-- Migration number: 0000 	 2023-11-18T17:30:53.554Z

CREATE TABLE IF NOT EXISTS [user] 
(
  [id] VARCHAR(15) NOT NULL PRIMARY KEY,
  [username] VARCHAR(31) NOT NULL,
  [role_flags] INTEGER NOT NULL DEFAULT 0,
  [user_type_flags] INTEGER NOT NULL DEFAULT 0,
  [email]    TEXT UNIQUE NOT NULL,
  [email_verified] INTEGER NOT NULL DEFAULT 0,
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

CREATE TABLE IF NOT EXISTS [verification_code]
(
  [code]           VARCHAR(255) NOT NULL PRIMARY KEY,
  [user_id]        VARCHAR(15) NOT NULL,
  [expires]        BIGINT NOT NULL,

  FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS user_id
  ON user(id);

CREATE UNIQUE INDEX IF NOT EXISTS user_name
  ON user(username);

CREATE UNIQUE INDEX IF NOT EXISTS user_key_id
  ON user_key(id);

CREATE UNIQUE INDEX IF NOT EXISTS user_session_id
  ON user_session(id);
