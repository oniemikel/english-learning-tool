-- Add explicit correctness tracking for each review and typing-mode override setting.
ALTER TABLE `ReviewLog`
    ADD COLUMN `isCorrect` BOOLEAN NOT NULL DEFAULT false;

-- Backfill existing logs from FSRS rating so historical analytics remain usable.
UPDATE `ReviewLog`
SET `isCorrect` = CASE
    WHEN `rating` IN ('HARD', 'GOOD', 'EASY') THEN true
    ELSE false
END;

ALTER TABLE `UserSetting`
    ADD COLUMN `allowTypingCorrectnessOverride` BOOLEAN NOT NULL DEFAULT true;
