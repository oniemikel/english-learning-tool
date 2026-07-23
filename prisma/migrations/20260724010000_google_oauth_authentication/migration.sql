-- Authentication policy migration: Google OAuth only.
-- Existing password-based records are intentionally not migrated because
-- password authentication is not part of the approved initial specification.
ALTER TABLE `User`
    DROP COLUMN `passwordHash`,
    ADD COLUMN `authProvider` ENUM('GOOGLE') NOT NULL DEFAULT 'GOOGLE',
    ADD COLUMN `providerAccountId` VARCHAR(255) NOT NULL;

CREATE UNIQUE INDEX `User_providerAccountId_key` ON `User`(`providerAccountId`);
