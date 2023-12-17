CREATE TABLE IF NOT EXISTS [user] 
(
  [id] VARCHAR(15) NOT NULL PRIMARY KEY,
  [username] VARCHAR(31) NOT NULL
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

  FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS [d1_migrations]
(
  [id]         VARCHAR(255) NOT NULL PRIMARY KEY,
  [applied_at] TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  [name]       VARCHAR(255)
);


CREATE UNIQUE INDEX IF NOT EXISTS user_id
  ON user(id);

CREATE UNIQUE INDEX IF NOT EXISTS user_name
  ON user(username);

CREATE UNIQUE INDEX IF NOT EXISTS user_key_id
  ON user_key(id);

CREATE UNIQUE INDEX IF NOT EXISTS user_session_id
  ON user_session(id);

CREATE UNIQUE INDEX IF NOT EXISTS user_session_user_id
  ON user_session(user_id);
