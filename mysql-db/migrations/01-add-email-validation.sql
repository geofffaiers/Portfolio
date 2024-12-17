USE portfolio;

DELIMITER //

CREATE PROCEDURE add_email_validation()
BEGIN
    -- Check if the column 'validate_token' exists before adding it
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
                   WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'validate_token') THEN
        ALTER TABLE `users` ADD COLUMN `validate_token` VARCHAR(255);
    END IF;

    -- Check if the column 'validate_token_expires' exists before adding it
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
                   WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'validate_token_expires') THEN
        ALTER TABLE `users` ADD COLUMN `validate_token_expires` TIMESTAMP NULL DEFAULT NULL;
    END IF;

    -- Check if the column 'verified_email' exists before adding it
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
                   WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'verified_email') THEN
        ALTER TABLE `users` ADD COLUMN `verified_email` BOOLEAN DEFAULT FALSE;
    END IF;
END //

DELIMITER ;

CALL add_email_validation();

DROP PROCEDURE add_email_validation;