'use server';

import { Theme } from '@prisma/client';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const orderSchema = z.enum(['DUE_ASC', 'RANDOM', 'CREATED_DESC']);
const themeSchema = z.enum(['light', 'dark', 'system']);

const updateSettingsSchema = z.object({
  newLimit: z.number().int().min(0).max(200),
  reviewLimit: z.number().int().min(0).max(500),
  theme: themeSchema,
  order: orderSchema,
});

export type StudyOrder = z.infer<typeof orderSchema>;
export type ThemePreference = z.infer<typeof themeSchema>;

const toThemeEnum = (theme: ThemePreference): Theme => {
  if (theme === 'light') return Theme.LIGHT;
  if (theme === 'dark') return Theme.DARK;
  return Theme.SYSTEM;
};

const fromThemeEnum = (theme: Theme): ThemePreference => {
  if (theme === Theme.LIGHT) return 'light';
  if (theme === Theme.DARK) return 'dark';
  return 'system';
};

export async function getUserSettings() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const settings = await prisma.userSetting.findUnique({
    where: { userId: session.user.id },
    select: {
      dailyNewCards: true,
      maximumReviews: true,
      theme: true,
    },
  });

  return {
    newLimit: settings?.dailyNewCards ?? 20,
    reviewLimit: settings?.maximumReviews ?? 100,
    theme: settings ? fromThemeEnum(settings.theme) : 'system',
    // Stored client-side for now because there is no DB field yet.
    order: 'DUE_ASC' as StudyOrder,
  };
}

export async function updateUserSettings(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const { newLimit, reviewLimit, theme, order } = updateSettingsSchema.parse(input);

  await prisma.userSetting.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      dailyNewCards: newLimit,
      maximumReviews: reviewLimit,
      theme: toThemeEnum(theme),
    },
    update: {
      dailyNewCards: newLimit,
      maximumReviews: reviewLimit,
      theme: toThemeEnum(theme),
    },
  });

  return {
    newLimit,
    reviewLimit,
    theme,
    order,
  };
}
