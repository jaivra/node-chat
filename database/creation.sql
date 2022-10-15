CREATE TABLE c_user (
    username VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    img VARCHAR(255)
);

CREATE TABLE c_message (
    user_from VARCHAR(255) NOT NULL REFERENCES c_user(username),
    user_to VARCHAR(255) NOT NULL REFERENCES c_user(username),
    timestamp BIGINT,
    text VARCHAR(255),
    PRIMARY KEY(user_from, user_to, timestamp)
)