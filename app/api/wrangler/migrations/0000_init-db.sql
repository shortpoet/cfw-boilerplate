-- Migration number: 0000 	 2023-11-18T17:30:53.554Z

CREATE TABLE IF NOT EXISTS [user] 
(
  [id] VARCHAR(15) NOT NULL PRIMARY KEY,
  [username] VARCHAR(31) NOT NULL,
  [email]    TEXT UNIQUE,
  [name]     TEXT,
  [avatar_url] TEXT,
  [password] TEXT

);

CREATE TABLE IF NOT EXISTS [user_key] 
(
  [id]              VARCHAR(255) NOT NULL PRIMARY KEY,
  [user_id]         VARCHAR(15) NOT NULL,
  [hashed_password] VARCHAR(255),

  FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS [user_session]
(
  [id]             VARCHAR(127) NOT NULL PRIMARY KEY,
  [user_id]        VARCHAR(15) NOT NULL,
  [active_expires] BIGINT NOT NULL,
  [idle_expires]   BIGINT NOT NULL,
  [token]          VARCHAR(255),

  FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS [user_role]
(
  [id] INTEGER PRIMARY KEY,
  [role] TEXT CHECK(role IN ('admin', 'user')) NOT NULL DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS [user_role_assignment]
(
  [id] INTEGER PRIMARY KEY,
  [user_id] INTEGER NOT NULL REFERENCES [user] (id) ON DELETE CASCADE,
  [role_id] INTEGER NOT NULL REFERENCES [user_role] (id) ON DELETE CASCADE,
  [created_at] TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  [updated_at] TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES [user](id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES [user_role](id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS user_id
  ON user(id);

CREATE UNIQUE INDEX IF NOT EXISTS user_name
  ON user(username);

CREATE UNIQUE INDEX IF NOT EXISTS user_key_id
  ON user_key(id);

CREATE UNIQUE INDEX IF NOT EXISTS user_session_id
  ON user_session(id);

CREATE UNIQUE INDEX IF NOT EXISTS role
  ON user_role(role);
