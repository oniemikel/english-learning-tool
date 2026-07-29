import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value?: string | Date | number | null): string {
  // 1. null, undefined, 空文字の場合は '-' を返す
  if (!value) {
    return '-';
  }

  const date = new Date(value);

  // 2. 日付として無効な値 (Invalid Date) の場合も '-' を返す
  if (isNaN(date.getTime())) {
    return '-';
  }

  // 3. 正常な日付のみフォーマットして返す
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}