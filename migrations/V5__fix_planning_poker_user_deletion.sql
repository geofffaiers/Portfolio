USE portfolio;

DELIMITER //

CREATE PROCEDURE fix_planning_poker_user_deletion()
BEGIN
    -- Create new tables with correct structure
    CREATE TABLE `pp_rooms_new` (
        `id` VARCHAR(36) PRIMARY KEY,
        `name` VARCHAR(255) NOT NULL,
        `description` TEXT,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE `pp_room_players_new` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `room_id` VARCHAR(36) NOT NULL,
        `user_id` INT NULL,
        `online` TINYINT(1) DEFAULT 0,
        `role` ENUM('owner', 'player', 'observer') DEFAULT 'player',
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY `idx_room_user_unique` (`room_id`, `user_id`),
        FOREIGN KEY (`room_id`) REFERENCES `pp_rooms_new`(`id`),
        FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE `pp_games_new` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `room_id` VARCHAR(36) NOT NULL,
        `name` VARCHAR(255) NOT NULL,
        `in_progress` TINYINT(1) DEFAULT 0,
        `game_success` TINYINT(1) DEFAULT 0,
        `final_estimate` DECIMAL(10,2) NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        `created_by` INT NULL,
        FOREIGN KEY (`room_id`) REFERENCES `pp_rooms_new`(`id`),
        FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE `pp_rounds_new` (
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
        FOREIGN KEY (`room_id`) REFERENCES `pp_rooms_new`(`id`),
        FOREIGN KEY (`game_id`) REFERENCES `pp_games_new`(`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE `pp_votes_new` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `room_id` VARCHAR(36) NOT NULL,
        `round_id` INT NOT NULL,
        `user_id` INT NULL,
        `value` VARCHAR(50),
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        KEY `idx_round_user_nullable` (`round_id`, `user_id`),
        FOREIGN KEY (`room_id`) REFERENCES `pp_rooms_new`(`id`),
        FOREIGN KEY (`round_id`) REFERENCES `pp_rounds_new`(`id`),
        FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    -- Migrate data from old tables to new tables
    INSERT INTO `pp_rooms_new` SELECT * FROM `pp_rooms`;
    
    INSERT INTO `pp_room_players_new` (`room_id`, `user_id`, `online`, `role`, `created_at`, `updated_at`)
    SELECT `room_id`, `user_id`, `online`, `role`, `created_at`, `updated_at` FROM `pp_room_players`;
    
    INSERT INTO `pp_games_new` SELECT * FROM `pp_games`;
    INSERT INTO `pp_rounds_new` SELECT * FROM `pp_rounds`;
    INSERT INTO `pp_votes_new` SELECT * FROM `pp_votes`;

    -- Drop old tables
    DROP TABLE `pp_votes`;
    DROP TABLE `pp_rounds`;
    DROP TABLE `pp_games`;
    DROP TABLE `pp_room_players`;
    DROP TABLE `pp_rooms`;

    -- Rename new tables to original names
    RENAME TABLE `pp_rooms_new` TO `pp_rooms`;
    RENAME TABLE `pp_room_players_new` TO `pp_room_players`;
    RENAME TABLE `pp_games_new` TO `pp_games`;
    RENAME TABLE `pp_rounds_new` TO `pp_rounds`;
    RENAME TABLE `pp_votes_new` TO `pp_votes`;

END //

DELIMITER ;

CALL fix_planning_poker_user_deletion();
DROP PROCEDURE fix_planning_poker_user_deletion;