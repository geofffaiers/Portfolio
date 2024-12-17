USE portfolio;

INSERT INTO `users` (`username`, `password`, `email`, `first_name`, `last_name`, `verified_email`)
SELECT 'gfaiers', '', 'geoff@gfaiers.com', 'Geoff', 'Faiers', true
WHERE NOT EXISTS (
  SELECT 1 FROM `users` WHERE `username` = 'gfaiers'
);
