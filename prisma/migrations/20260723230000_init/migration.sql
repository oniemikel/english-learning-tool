-- CreateTable
CREATE TABLE `User` (
    `id` CHAR(36) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `passwordHash` VARCHAR(255) NOT NULL,
    `displayName` VARCHAR(100) NOT NULL,
    `avatarUrl` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserSetting` (
    `id` CHAR(36) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `dailyNewCards` INTEGER NOT NULL DEFAULT 20,
    `maximumReviews` INTEGER NOT NULL DEFAULT 200,
    `enableSound` BOOLEAN NOT NULL DEFAULT true,
    `enableSpeech` BOOLEAN NOT NULL DEFAULT true,
    `language` ENUM('JA', 'EN') NOT NULL DEFAULT 'JA',
    `theme` ENUM('LIGHT', 'DARK', 'SYSTEM') NOT NULL DEFAULT 'SYSTEM',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UserSetting_userId_key`(`userId`),
    INDEX `UserSetting_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Deck` (
    `id` CHAR(36) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `color` VARCHAR(20) NULL,
    `icon` VARCHAR(50) NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isArchived` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `Deck_userId_idx`(`userId`),
    INDEX `Deck_userId_sortOrder_idx`(`userId`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Word` (
    `id` CHAR(36) NOT NULL,
    `deckId` CHAR(36) NOT NULL,
    `word` VARCHAR(150) NOT NULL,
    `pronunciation` VARCHAR(255) NULL,
    `partOfSpeech` VARCHAR(50) NULL,
    `meaning` TEXT NOT NULL,
    `memo` TEXT NULL,
    `difficulty` INTEGER NULL,
    `source` VARCHAR(100) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `Word_deckId_idx`(`deckId`),
    INDEX `Word_word_idx`(`word`),
    INDEX `Word_partOfSpeech_idx`(`partOfSpeech`),
    UNIQUE INDEX `Word_deckId_word_key`(`deckId`, `word`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExampleSentence` (
    `id` CHAR(36) NOT NULL,
    `wordId` CHAR(36) NOT NULL,
    `english` TEXT NOT NULL,
    `japanese` TEXT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `ExampleSentence_wordId_idx`(`wordId`),
    INDEX `ExampleSentence_wordId_sortOrder_idx`(`wordId`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Synonym` (
    `id` CHAR(36) NOT NULL,
    `wordId` CHAR(36) NOT NULL,
    `value` VARCHAR(150) NOT NULL,
    `explanation` TEXT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `Synonym_wordId_idx`(`wordId`),
    INDEX `Synonym_wordId_sortOrder_idx`(`wordId`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Antonym` (
    `id` CHAR(36) NOT NULL,
    `wordId` CHAR(36) NOT NULL,
    `value` VARCHAR(150) NOT NULL,
    `explanation` TEXT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `Antonym_wordId_idx`(`wordId`),
    INDEX `Antonym_wordId_sortOrder_idx`(`wordId`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Collocation` (
    `id` CHAR(36) NOT NULL,
    `wordId` CHAR(36) NOT NULL,
    `phrase` VARCHAR(255) NOT NULL,
    `meaning` TEXT NULL,
    `example` TEXT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `Collocation_wordId_idx`(`wordId`),
    INDEX `Collocation_wordId_sortOrder_idx`(`wordId`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Card` (
    `id` CHAR(36) NOT NULL,
    `wordId` CHAR(36) NOT NULL,
    `isSuspended` BOOLEAN NOT NULL DEFAULT false,
    `isStarred` BOOLEAN NOT NULL DEFAULT false,
    `lastStudiedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Card_wordId_key`(`wordId`),
    INDEX `Card_wordId_idx`(`wordId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FSRSState` (
    `id` CHAR(36) NOT NULL,
    `cardId` CHAR(36) NOT NULL,
    `state` ENUM('NEW', 'LEARNING', 'REVIEW', 'RELEARNING') NOT NULL DEFAULT 'NEW',
    `stability` DOUBLE NOT NULL DEFAULT 0,
    `difficulty` DOUBLE NOT NULL DEFAULT 0,
    `due` DATETIME(3) NOT NULL,
    `lastReview` DATETIME(3) NULL,
    `reps` INTEGER NOT NULL DEFAULT 0,
    `lapses` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `FSRSState_cardId_key`(`cardId`),
    INDEX `FSRSState_due_idx`(`due`),
    INDEX `FSRSState_state_idx`(`state`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReviewLog` (
    `id` CHAR(36) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `cardId` CHAR(36) NOT NULL,
    `rating` ENUM('AGAIN', 'HARD', 'GOOD', 'EASY') NOT NULL,
    `reviewMode` ENUM('NORMAL', 'RANDOM', 'CUSTOM') NOT NULL,
    `responseTime` INTEGER NULL,
    `reviewedAt` DATETIME(3) NOT NULL,
    `syncStatus` ENUM('PENDING', 'SYNCED', 'CONFLICT') NOT NULL DEFAULT 'PENDING',
    `version` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ReviewLog_userId_reviewedAt_idx`(`userId`, `reviewedAt`),
    INDEX `ReviewLog_cardId_reviewedAt_idx`(`cardId`, `reviewedAt`),
    INDEX `ReviewLog_syncStatus_idx`(`syncStatus`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DailyStatistic` (
    `id` CHAR(36) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `reviewCount` INTEGER NOT NULL DEFAULT 0,
    `studyTime` INTEGER NOT NULL DEFAULT 0,
    `correctCount` INTEGER NOT NULL DEFAULT 0,
    `incorrectCount` INTEGER NOT NULL DEFAULT 0,
    `accuracyRate` DOUBLE NOT NULL DEFAULT 0,
    `syncStatus` ENUM('PENDING', 'SYNCED', 'CONFLICT') NOT NULL DEFAULT 'PENDING',
    `version` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `DailyStatistic_userId_date_idx`(`userId`, `date`),
    UNIQUE INDEX `DailyStatistic_userId_date_key`(`userId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserSetting` ADD CONSTRAINT `UserSetting_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Deck` ADD CONSTRAINT `Deck_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Word` ADD CONSTRAINT `Word_deckId_fkey` FOREIGN KEY (`deckId`) REFERENCES `Deck`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExampleSentence` ADD CONSTRAINT `ExampleSentence_wordId_fkey` FOREIGN KEY (`wordId`) REFERENCES `Word`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Synonym` ADD CONSTRAINT `Synonym_wordId_fkey` FOREIGN KEY (`wordId`) REFERENCES `Word`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Antonym` ADD CONSTRAINT `Antonym_wordId_fkey` FOREIGN KEY (`wordId`) REFERENCES `Word`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Collocation` ADD CONSTRAINT `Collocation_wordId_fkey` FOREIGN KEY (`wordId`) REFERENCES `Word`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Card` ADD CONSTRAINT `Card_wordId_fkey` FOREIGN KEY (`wordId`) REFERENCES `Word`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FSRSState` ADD CONSTRAINT `FSRSState_cardId_fkey` FOREIGN KEY (`cardId`) REFERENCES `Card`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReviewLog` ADD CONSTRAINT `ReviewLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReviewLog` ADD CONSTRAINT `ReviewLog_cardId_fkey` FOREIGN KEY (`cardId`) REFERENCES `Card`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyStatistic` ADD CONSTRAINT `DailyStatistic_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

