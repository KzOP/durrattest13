import type { Request } from "express";
import { getFirebaseAdmin, type StaffRecord } from "./firebase-admin";

export type StaffAuthentication =
  | { staff: StaffRecord }
  | { status: 401 | 403 };

export async function authenticateStaff(
  request: Request,
): Promise<StaffAuthentication> {
  const authorization = request.get("authorization") ?? "";
  const token = /^Bearer\s+(.+)$/i.exec(authorization)?.[1];
  if (!token) return { status: 401 };

  const { auth, db } = getFirebaseAdmin();
  let uid: string;
  try {
    const decoded = await auth.verifyIdToken(token, true);
    uid = decoded.uid;
  } catch {
    return { status: 401 };
  }

  const employeeSnapshot = await db.collection("employees").doc(uid).get();
  const employee = employeeSnapshot.data();
  if (!employeeSnapshot.exists || employee?.active !== true) {
    return { status: 403 };
  }

  return {
    staff: {
      uid,
      displayName:
        typeof employee.displayName === "string" ? employee.displayName : "",
      phone: typeof employee.phone === "string" ? employee.phone : "",
      role: employee.role === "super_admin" ? "super_admin" : "employee",
      active: true,
    },
  };
}
