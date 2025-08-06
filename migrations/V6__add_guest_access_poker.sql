USE portfolio;

DELIMITER //

CREATE PROCEDURE add_guest_access_poker()
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Add guest support columns to pp_room_players
    ALTER TABLE `pp_room_players` 
    ADD COLUMN `guest_name` VARCHAR(255) NULL AFTER `user_id`,
    ADD COLUMN `guest_session_id` VARCHAR(255) NULL AFTER `guest_name`;

    -- Add unique constraint for guest sessions
    ALTER TABLE `pp_room_players`
    ADD UNIQUE KEY `idx_room_guest_unique` (`room_id`, `guest_session_id`);

    CREATE TABLE `pp_votes_new` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `room_id` VARCHAR(36) NOT NULL,
        `round_id` INT NOT NULL,
        `player_id` INT NULL,
        `value` VARCHAR(50),
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY `idx_round_user_nullable` (`round_id`, `player_id`),
        FOREIGN KEY (`room_id`) REFERENCES `pp_rooms`(`id`),
        FOREIGN KEY (`round_id`) REFERENCES `pp_rounds`(`id`),
        FOREIGN KEY (`player_id`) REFERENCES `pp_room_players`(`id`) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    -- Changing from user_id in votes to a player_id, so that guests line up easier with the room_players table.
    INSERT INTO `pp_votes_new` (
        `id`,
        `room_id`,
        `round_id`,
        `player_id`,
        `value`,
        `created_at`,
        `updated_at`
    )
    SELECT
        v.`id`,
        v.`room_id`,
        v.`round_id`,
        rp.`id` AS `player_id`,
        v.`value`,
        v.`created_at`,
        v.`updated_at`
    FROM `pp_votes` v
    JOIN `pp_room_players` rp
        ON (v.`user_id` IS NOT NULL AND v.`user_id` = rp.`user_id` AND v.`room_id` = rp.`room_id`);

    DROP TABLE `pp_votes`;

    RENAME TABLE `pp_votes_new` TO `pp_votes`;

    COMMIT;

END //

DELIMITER ;

CALL add_guest_access_poker();
DROP PROCEDURE add_guest_access_poker;