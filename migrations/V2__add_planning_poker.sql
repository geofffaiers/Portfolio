USE portfolio;

DELIMITER //

CREATE PROCEDURE init_planning_poker_schema()
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;

    CREATE TABLE IF NOT EXISTS `pp_rooms` (
        `id` VARCHAR(36) PRIMARY KEY,
        `name` VARCHAR(255) NOT NULL,
        `description` TEXT,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS `pp_room_players` (
        `room_id` VARCHAR(36) NOT NULL,
        `user_id` INT,
        `online` TINYINT(1) DEFAULT 0,
        `role` ENUM('owner', 'player', 'observer') DEFAULT 'player',
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`room_id`, `user_id`),
        FOREIGN KEY (`room_id`) REFERENCES `pp_rooms`(`id`),
        FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS `pp_games` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `room_id` VARCHAR(36) NOT NULL,
        `name` VARCHAR(255) NOT NULL,
        `in_progress` TINYINT(1) DEFAULT 0,
        `game_success` TINYINT(1) DEFAULT 0,
        `final_estimate` DECIMAL(10,2) NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        `created_by` INT,
        FOREIGN KEY (`room_id`) REFERENCES `pp_rooms`(`id`),
        FOREIGN KEY (`created_by`) REFERENCES `users`(`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS `pp_rounds` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `room_id` VARCHAR(36) NOT NULL,
        `game_id` INT NOT NULL,
        `in_progress` TINYINT(1) DEFAULT 0,
        `total_score` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        `median_score` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        `mean_score` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        `mode_score` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        `lowest_score` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        `highest_score` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        `count_of_different_scores` INT NOT NULL DEFAULT 0,
        `ended_at` TIMESTAMP NULL DEFAULT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (`room_id`) REFERENCES `pp_rooms`(`id`),
        FOREIGN KEY (`game_id`) REFERENCES `pp_games`(`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS `pp_votes` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `room_id` VARCHAR(36) NOT NULL,
        `round_id` INT NOT NULL,
        `user_id` INT NOT NULL,
        `value` VARCHAR(50),
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY `idx_round_user` (`round_id`, `user_id`),
        FOREIGN KEY (`room_id`) REFERENCES `pp_rooms`(`id`),
        FOREIGN KEY (`round_id`) REFERENCES `pp_rounds`(`id`),
        FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    COMMIT;
    
END //

DELIMITER ;

CALL init_planning_poker_schema();

DROP PROCEDURE init_planning_poker_schema;
