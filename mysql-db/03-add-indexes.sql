
USE portfolio;

ALTER TABLE `users`
  ADD INDEX `idx_email` (`email`),
  ADD INDEX `idx_username` (`username`);

ALTER TABLE `previous_passwords`
  ADD INDEX `idx_user_id` (`user_id`);

ALTER TABLE `messages`
  ADD INDEX `idx_sender_id` (`sender_id`),
  ADD INDEX `idx_receiver_id` (`receiver_id`);

ALTER TABLE `scores`
  ADD INDEX `idx_user_id` (`user_id`),
  ADD INDEX `idx_score` (`score`);