DELETE FROM session WHERE expires < UNIX_TIMESTAMP() * 1000;