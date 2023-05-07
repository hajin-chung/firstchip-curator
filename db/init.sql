CREATE TABLE artist (
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name varchar(255) NOT NULL,
	profile varchar(2048)
);

CREATE TABLE art (
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name varchar(255) NOT NULL,
	description text,
	artist_id int,
	KEY artist_id_idx (artist_id)
);

CREATE TABLE image (
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	art_id int,
	KEY art_id_idx (art_id)
);