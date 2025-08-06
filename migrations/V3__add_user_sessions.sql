USE portfolio;

-- First create the table using a procedure
DELIMITER //
CREATE PROCEDURE add_user_sessions_table()
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;

    CREATE TABLE IF NOT EXISTS `users_sessions` (
        `id` INT NOT NULL AUTO_INCREMENT,
        `user_id` INT DEFAULT NULL,
        `refresh_token` VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        `user_agent` TEXT COLLATE utf8mb4_unicode_ci,
        `ip_address` TEXT COLLATE utf8mb4_unicode_ci,
        `location` VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        `is_active` TINYINT(1) DEFAULT '0',
        `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        `expires_at` TIMESTAMP NULL DEFAULT NULL,
        PRIMARY KEY (`id`),
        UNIQUE KEY `idx_refresh_token` (`refresh_token`),
        KEY `idx_user_id` (`user_id`),
        KEY `idx_is_active` (`is_active`),
        KEY `idx_expires_at` (`expires_at`),
        KEY `idx_user_active` (`user_id`,`is_active`),
        CONSTRAINT `fk_user_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    COMMIT;
    
END //
DELIMITER ;

-- Call the procedure to create the table
CALL add_user_sessions_table();
DROP PROCEDURE add_user_sessions_table;

-- Now create the event separately
SET GLOBAL event_scheduler = ON;
DROP EVENT IF EXISTS cleanup_expired_sessions;

DELIMITER //
CREATE EVENT cleanup_expired_sessions
ON SCHEDULE EVERY 1 DAY
DO
BEGIN
    -- Delete expired sessions that are older than 30 days
    DELETE FROM users_sessions 
    WHERE (expires_at < NOW() OR is_active = 0) 
    AND updated_at < DATE_SUB(NOW(), INTERVAL 30 DAY);
    
    -- Update status of expired but still active sessions
    UPDATE users_sessions 
    SET is_active = 0
    WHERE expires_at < NOW() AND is_active = 1;
END //
DELIMITER ;