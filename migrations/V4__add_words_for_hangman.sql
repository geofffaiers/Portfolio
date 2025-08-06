USE portfolio;

DELIMITER //
CREATE PROCEDURE add_words_for_hangman()
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;

    CREATE TABLE IF NOT EXISTS `words` (
      `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      `word` VARCHAR(50) NOT NULL UNIQUE,
      `length` TINYINT NOT NULL,
      `first_letter` CHAR(1) NOT NULL,
      `is_valid` BOOLEAN NULL DEFAULT NULL,
      `validation_data` JSON NULL,
      `validated_at` TIMESTAMP NULL,
      `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      
      INDEX `idx_length` (`length`),
      INDEX `idx_first_letter` (`first_letter`),
      INDEX `idx_valid_words` (`is_valid`, `length`, `first_letter`),
      INDEX `idx_word_lookup` (`word`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    COMMIT;
END //
DELIMITER ;

CALL add_words_for_hangman();
DROP PROCEDURE add_words_for_hangman;
