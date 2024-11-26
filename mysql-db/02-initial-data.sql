USE portfolio;

INSERT INTO `users` (`username`, `password`, `email`, `first_name`, `last_name`)
SELECT 'gfaiers', '', 'geoff@gfaiers.com', 'Geoff', 'Faiers'
WHERE NOT EXISTS (
  SELECT 1 FROM `users` WHERE `username` = 'gfaiers'
);
