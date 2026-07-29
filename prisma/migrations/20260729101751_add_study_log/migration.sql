-- CreateTable
CREATE TABLE `StudyLog` (
    `id` CHAR(36) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `deckId` CHAR(36) NOT NULL,
    `mode` ENUM('EN_JA', 'JA_EN', 'LISTENING', 'PRONUNCIATION') NOT NULL,
    `solved` INTEGER NOT NULL,
    `correct` INTEGER NOT NULL,
    `accuracy` DOUBLE NOT NULL,
    `minutes` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `StudyLog_userId_idx`(`userId`),
    INDEX `StudyLog_deckId_idx`(`deckId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StudyLog` ADD CONSTRAINT `StudyLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudyLog` ADD CONSTRAINT `StudyLog_deckId_fkey` FOREIGN KEY (`deckId`) REFERENCES `Deck`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
