CREATE TABLE token (
    id SERIAL PRIMARY KEY,
    token_value VARCHAR(255) NOT NULL,
    expiration_date TIMESTAMPTZ,
    user_id varchar(36) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
