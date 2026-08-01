/*
  Warnings:

  - A unique constraint covering the columns `[userId,word]` on the table `Word` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `Word` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Word` DROP FOREIGN KEY `Word_userId_fkey`;

-- AlterTable
ALTER TABLE `Word` MODIFY `userId` CHAR(36) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Word_userId_word_key` ON `Word`(`userId`, `word`);

-- AddForeignKey
ALTER TABLE `Word` ADD CONSTRAINT `Word_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
