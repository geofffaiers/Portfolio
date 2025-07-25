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

    -- Add guest support to pp_votes
    ALTER TABLE `pp_votes`
    ADD COLUMN `guest_session_id` VARCHAR(255) NULL AFTER `user_id`;

    -- Add index for guest votes
    ALTER TABLE `pp_votes`
    ADD UNIQUE KEY `idx_round_guest_nullable` (`round_id`, `guest_session_id`);

    COMMIT;

END //

DELIMITER ;

CALL add_guest_access_poker();
DROP PROCEDURE add_guest_access_poker;