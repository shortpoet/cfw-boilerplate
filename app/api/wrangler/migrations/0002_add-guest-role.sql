-- Migration number: 0002 	 2023-11-18T18:32:02.351Z

PRAGMA foreign_keys=OFF;

BEGIN TRANSACTION;

CREATE TABLE user_role_backup (
  `id` INTEGER PRIMARY KEY,
  `role` TEXT CHECK(role IN ('admin', 'user', 'guest')) NOT NULL DEFAULT 'guest'
);
INSERT INTO user_role_backup SELECT `id`, `role` FROM user_role;
DROP TABLE user_role;
ALTER TABLE user_role_backup RENAME TO user_role;

INSERT INTO user_role (role)
  SELECT 'guest' WHERE NOT EXISTS (SELECT 1 FROM user_role WHERE role = 'guest');
  
COMMIT;

PRAGMA foreign_keys=ON;
