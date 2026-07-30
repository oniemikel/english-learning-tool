-- Create the implicit M:N relation table between Deck and Word.
CREATE TABLE `_DeckToWord` (
    `A` CHAR(36) NOT NULL,
    `B` CHAR(36) NOT NULL,

    UNIQUE INDEX `_DeckToWord_AB_unique`(`A`, `B`),
    INDEX `_DeckToWord_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Backfill existing one-to-many links to the new join table.
INSERT INTO `_DeckToWord` (`A`, `B`)
SELECT `deckId`, `id`
FROM `Word`;

-- Add FK constraints with cascading to remove only links when Deck/Word is deleted.
ALTER TABLE `_DeckToWord`
    ADD CONSTRAINT `_DeckToWord_A_fkey`
    FOREIGN KEY (`A`) REFERENCES `Deck`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `_DeckToWord`
    ADD CONSTRAINT `_DeckToWord_B_fkey`
    FOREIGN KEY (`B`) REFERENCES `Word`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

-- Remove old one-to-many relation from Word.
ALTER TABLE `Word` DROP FOREIGN KEY `Word_deckId_fkey`;
ALTER TABLE `Word` DROP INDEX `Word_deckId_word_key`;
ALTER TABLE `Word` DROP INDEX `Word_deckId_idx`;
ALTER TABLE `Word` DROP COLUMN `deckId`;
