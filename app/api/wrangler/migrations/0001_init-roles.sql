-- Migration number: 0001 	 2023-11-18T18:30:53.554Z

INSERT INTO user_role (role)
  SELECT 'admin' WHERE NOT EXISTS (SELECT 1 FROM user_role WHERE role = 'admin');

INSERT INTO user_role (role)
  SELECT 'user' WHERE NOT EXISTS (SELECT 1 FROM user_role WHERE role = 'user');