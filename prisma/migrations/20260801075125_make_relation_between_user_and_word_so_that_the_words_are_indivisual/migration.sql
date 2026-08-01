-- AlterTable
ALTER TABLE `Word` ADD COLUMN `userId` CHAR(36) NULL;

-- CreateIndex
CREATE INDEX `Word_userId_idx` ON `Word`(`userId`);

-- AddForeignKey
ALTER TABLE `Word` ADD CONSTRAINT `Word_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
