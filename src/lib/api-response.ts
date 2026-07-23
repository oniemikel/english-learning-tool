import { NextResponse } from 'next/server';

export type ApiSuccess<T> = { success: true; data: T };
export type ApiFailure = {
  success: false;
  error: { code: string; message: string; details?: unknown[] };
};

export function success<T>(data: T, status = 200) {
  return NextResponse.json<ApiSuccess<T>>({ success: true, data }, { status });
}

export function failure(
  code: string,
  message: string,
  status: number,
  details?: unknown[],
) {
  return NextResponse.json<ApiFailure>(
    { success: false, error: { code, message, ...(details ? { details } : {}) } },
    { status },
  );
}
