
USE portfolio;

CREATE INDEX IF NOT EXISTS `idx_email` ON `users` (`email`);
CREATE INDEX IF NOT EXISTS `idx_username` ON `users` (`username`);

CREATE INDEX IF NOT EXISTS `idx_user_id` ON `previous_passwords` (`user_id`);

CREATE INDEX IF NOT EXISTS `idx_sender_id` ON `messages` (`sender_id`);
CREATE INDEX IF NOT EXISTS `idx_receiver_id` ON `messages` (`receiver_id`);

CREATE INDEX IF NOT EXISTS `idx_score_desc` ON `scores` (`score` DESC);
CREATE INDEX IF NOT EXISTS `idx_user_id_score_desc_id_created_at` ON `scores` (`user_id`, `score` DESC, `id`, `created_at`);