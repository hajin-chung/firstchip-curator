drop table artist;
drop table art;
drop table image;

CREATE TABLE artist (
	id varchar(10) NOT NULL PRIMARY KEY,
	name varchar(255) NOT NULL,
	profile varchar(2048)
);

CREATE TABLE art (
	id varchar(10) NOT NULL PRIMARY KEY,
	name varchar(255) NOT NULL,
	description text,
	artistId varchar(10),
	KEY artistIdIdx (artistId)
);

CREATE TABLE image (
	id varchar(10) NOT NULL PRIMARY KEY,
	url varchar(2048) NOT NULL,
	artId varchar(10),
	KEY artIdIdx (artId)
);