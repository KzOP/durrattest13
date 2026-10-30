import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

export type StaffRole = "employee" | "super_admin";

export interface StaffRecord {
  uid: string;
  displayName: string;
  phone: string;
  role: StaffRole;
  active: boolean;
}

interface StaffSeed {
  displayName: string;
  phone: string;
  role: StaffRole;
  password: string;
}

let adminApp: App | undefined;

function readString(
  record: Record<string, unknown>,
  ...keys: string[]
): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.length > 0) return value;
  }
  return undefined;
}

export function normalizeStaffPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("966") && digits.length === 12) {
    return `0${digits.slice(3)}`;
  }
  if (digits.length === 9 && digits.startsWith("5")) {
    return `0${digits}`;
  }
  return digits;
}

export function staffAuthEmail(phone: string): string {
  const normalized = normalizeStaffPhone(phone);
  if (!/^\d{9,15}$/.test(normalized)) {
    throw new Error("A valid staff phone number is required.");
  }
  return `${normalized}@staff.durrat.invalid`;
}

function getApp(): App {
  if (adminApp) return adminApp;

  const rawCredential = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!rawCredential) {
    throw new Error("Firebase Admin credentials are not configured.");
  }

  const parsed: unknown = JSON.parse(rawCredential);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Firebase Admin credentials are invalid.");
  }

  const record = parsed as Record<string, unknown>;
  const projectId = readString(record, "project_id", "projectId");
  const clientEmail = readString(record, "client_email", "clientEmail");
  const privateKey = readString(record, "private_key", "privateKey");
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase Admin credentials are incomplete.");
  }

  adminApp =
    getApps()[0] ??
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, "\n"),
      }),
    });

  return adminApp;
}

export function getFirebaseAdmin() {
  const app = getApp();
  return {
    auth: getAuth(app),
    db: getFirestore(app),
  };
}

function parseStaffSeed(raw: string): StaffSeed[] {
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed) || parsed.length !== 10) {
    throw new Error("STAFF_SEED_JSON must contain exactly ten staff records.");
  }

  const seeds = parsed.map((entry): StaffSeed => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new Error("STAFF_SEED_JSON contains an invalid record.");
    }

    const record = entry as Record<string, unknown>;
    const displayName = readString(
      record,
      "name",
      "displayName",
      "display_name",
    )?.trim();
    const phoneValue = readString(record, "phone");
    const password = readString(record, "password");
    const role = record.role;
    if (
      !displayName ||
      !phoneValue ||
      !password ||
      password.length < 8 ||
      (role !== "employee" && role !== "super_admin")
    ) {
      throw new Error("STAFF_SEED_JSON contains an invalid record.");
    }

    const phone = normalizeStaffPhone(phoneValue);
    if (!/^\d{9,15}$/.test(phone)) {
      throw new Error("STAFF_SEED_JSON contains an invalid phone number.");
    }

    return { displayName, phone, role, password };
  });

  if (new Set(seeds.map((seed) => seed.phone)).size !== seeds.length) {
    throw new Error("STAFF_SEED_JSON contains duplicate phone numbers.");
  }
  if (!seeds.some((seed) => seed.role === "super_admin")) {
    throw new Error("STAFF_SEED_JSON must include a super admin.");
  }

  return seeds;
}

async function getOrCreateSeedAuthUser(
  seed: StaffSeed,
): Promise<{ uid: string; created: boolean }> {
  const { auth } = getFirebaseAdmin();
  const email = staffAuthEmail(seed.phone);

  try {
    const existing = await auth.getUserByEmail(email);
    return { uid: existing.uid, created: false };
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code !== "auth/user-not-found"
    ) {
      throw error;
    }
  }

  try {
    const created = await auth.createUser({
      email,
      password: seed.password,
      displayName: seed.displayName,
      disabled: false,
    });
    return { uid: created.uid, created: true };
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "auth/email-already-exists"
    ) {
      const existing = await auth.getUserByEmail(email);
      return { uid: existing.uid, created: false };
    }
    throw error;
  }
}

export async function ensureStaffSeeded(): Promise<number> {
  const rawSeed = process.env.STAFF_SEED_JSON;
  if (!rawSeed) {
    throw new Error("Initial staff credentials are not configured.");
  }

  const seeds = parseStaffSeed(rawSeed);
  const { auth, db } = getFirebaseAdmin();
  let createdCount = 0;

  for (const seed of seeds) {
    const existingByPhone = await db
      .collection("employees")
      .where("phone", "==", seed.phone)
      .limit(1)
      .get();

    if (!existingByPhone.empty) {
      const existingDoc = existingByPhone.docs[0];
      try {
        await auth.getUser(existingDoc.id);
        continue;
      } catch (error) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code !== "auth/user-not-found"
        ) {
          throw error;
        }
      }

      const recovered = await getOrCreateSeedAuthUser(seed);
      const oldRef = existingDoc.ref;
      const newRef = db.collection("employees").doc(recovered.uid);
      await newRef.set(
        {
          uid: recovered.uid,
          displayName: seed.displayName,
          phone: seed.phone,
          role: seed.role,
          active: true,
          createdAt: new Date().toISOString(),
        },
        { merge: true },
      );
      if (oldRef.id !== newRef.id) await oldRef.delete();
      if (recovered.created) createdCount += 1;
      continue;
    }

    const { uid, created } = await getOrCreateSeedAuthUser(seed);
    const employeeRef = db.collection("employees").doc(uid);
    const existingEmployee = await employeeRef.get();
    const existingData = existingEmployee.data();
    const existingPhone =
      typeof existingData?.phone === "string"
        ? normalizeStaffPhone(existingData.phone)
        : "";
    if (existingEmployee.exists && existingPhone && existingPhone !== seed.phone) {
      throw new Error("A seeded Firebase account conflicts with an employee record.");
    }

    await employeeRef.set(
      {
        uid,
        displayName: seed.displayName,
        phone: seed.phone,
        role: seed.role,
        active: true,
        createdAt:
          typeof existingData?.createdAt === "string"
            ? existingData.createdAt
            : new Date().toISOString(),
      },
      { merge: true },
    );
    if (created) createdCount += 1;
  }

  return createdCount;
}
