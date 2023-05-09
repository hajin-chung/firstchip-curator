drop table artist;
drop table art;
drop table image;
drop table if exists session;

CREATE TABLE artist (
	id varchar(10) NOT NULL PRIMARY KEY,
	name TEXT NOT NULL,
	email TEXT NOT NULL,
	sub TEXT NOT NULL,
	picture TEXT
);

CREATE TABLE session (
	id varchar(10) NOT NULL PRIMARY KEY,
	artistId varchar(10),
	expires bigint,
	KEY artistIdIdx (artistId)
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