import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { Employee, EmployeeInput, EmployeeList, EmployeeUpdate, HealthStatus, TelegramPublishInput, TelegramPublishResult } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * Returns server health status
 * @summary Health check
 */
export declare const healthCheck: (options?: Parameters<typeof customFetch>[1]) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListEmployeesUrl: () => string;
/**
 * @summary List employees
 */
export declare const listEmployees: (options?: Parameters<typeof customFetch>[1]) => Promise<EmployeeList>;
export declare const getListEmployeesQueryKey: () => readonly ["/api/staff"];
export declare const getListEmployeesQueryOptions: <TData = Awaited<ReturnType<typeof listEmployees>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listEmployees>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listEmployees>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListEmployeesQueryResult = NonNullable<Awaited<ReturnType<typeof listEmployees>>>;
export type ListEmployeesQueryError = ErrorType<void>;
/**
 * @summary List employees
 */
export declare function useListEmployees<TData = Awaited<ReturnType<typeof listEmployees>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listEmployees>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateEmployeeUrl: () => string;
/**
 * @summary Create employee
 */
export declare const createEmployee: (employeeInput: EmployeeInput, options?: Parameters<typeof customFetch>[1]) => Promise<Employee>;
export declare const getCreateEmployeeMutationKey: () => readonly ["createEmployee"];
export declare const getCreateEmployeeMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createEmployee>>, TError, CreateEmployeeMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createEmployee>>, TError, CreateEmployeeMutationVariables, TContext>;
export type CreateEmployeeMutationResult = NonNullable<Awaited<ReturnType<typeof createEmployee>>>;
export type CreateEmployeeMutationBody = BodyType<EmployeeInput>;
export type CreateEmployeeMutationError = ErrorType<void>;
export type CreateEmployeeMutationVariables = {
    data: BodyType<EmployeeInput>;
};
/**
* @summary Create employee
*/
export declare const useCreateEmployee: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createEmployee>>, TError, CreateEmployeeMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createEmployee>>, TError, CreateEmployeeMutationVariables, TContext>;
export declare const getUpdateEmployeeUrl: (uid: string) => string;
/**
 * @summary Update employee
 */
export declare const updateEmployee: (uid: string, employeeUpdate: EmployeeUpdate, options?: Parameters<typeof customFetch>[1]) => Promise<Employee>;
export declare const getUpdateEmployeeMutationKey: () => readonly ["updateEmployee"];
export declare const getUpdateEmployeeMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateEmployee>>, TError, UpdateEmployeeMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateEmployee>>, TError, UpdateEmployeeMutationVariables, TContext>;
export type UpdateEmployeeMutationResult = NonNullable<Awaited<ReturnType<typeof updateEmployee>>>;
export type UpdateEmployeeMutationBody = BodyType<EmployeeUpdate>;
export type UpdateEmployeeMutationError = ErrorType<void>;
export type UpdateEmployeeMutationVariables = {
    uid: string;
    data: BodyType<EmployeeUpdate>;
};
/**
* @summary Update employee
*/
export declare const useUpdateEmployee: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateEmployee>>, TError, UpdateEmployeeMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateEmployee>>, TError, UpdateEmployeeMutationVariables, TContext>;
export declare const getDeleteEmployeeUrl: (uid: string) => string;
/**
 * @summary Delete employee
 */
export declare const deleteEmployee: (uid: string, options?: Parameters<typeof customFetch>[1]) => Promise<void>;
export declare const getDeleteEmployeeMutationKey: () => readonly ["deleteEmployee"];
export declare const getDeleteEmployeeMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteEmployee>>, TError, DeleteEmployeeMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteEmployee>>, TError, DeleteEmployeeMutationVariables, TContext>;
export type DeleteEmployeeMutationResult = NonNullable<Awaited<ReturnType<typeof deleteEmployee>>>;
export type DeleteEmployeeMutationError = ErrorType<void>;
export type DeleteEmployeeMutationVariables = {
    uid: string;
};
/**
* @summary Delete employee
*/
export declare const useDeleteEmployee: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteEmployee>>, TError, DeleteEmployeeMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteEmployee>>, TError, DeleteEmployeeMutationVariables, TContext>;
export declare const getPublishPropertyToTelegramUrl: (propertyId: string) => string;
/**
 * @summary Publish a property to Telegram
 */
export declare const publishPropertyToTelegram: (propertyId: string, telegramPublishInput: TelegramPublishInput, options?: Parameters<typeof customFetch>[1]) => Promise<TelegramPublishResult>;
export declare const getPublishPropertyToTelegramMutationKey: () => readonly ["publishPropertyToTelegram"];
export declare const getPublishPropertyToTelegramMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof publishPropertyToTelegram>>, TError, PublishPropertyToTelegramMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof publishPropertyToTelegram>>, TError, PublishPropertyToTelegramMutationVariables, TContext>;
export type PublishPropertyToTelegramMutationResult = NonNullable<Awaited<ReturnType<typeof publishPropertyToTelegram>>>;
export type PublishPropertyToTelegramMutationBody = BodyType<TelegramPublishInput>;
export type PublishPropertyToTelegramMutationError = ErrorType<void>;
export type PublishPropertyToTelegramMutationVariables = {
    propertyId: string;
    data: BodyType<TelegramPublishInput>;
};
/**
* @summary Publish a property to Telegram
*/
export declare const usePublishPropertyToTelegram: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof publishPropertyToTelegram>>, TError, PublishPropertyToTelegramMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof publishPropertyToTelegram>>, TError, PublishPropertyToTelegramMutationVariables, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map