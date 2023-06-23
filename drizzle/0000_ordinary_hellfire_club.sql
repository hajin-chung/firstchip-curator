CREATE TABLE IF NOT EXISTS "art" (
	"id" varchar(10) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now(),
	"artistId" varchar(10)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "artist" (
	"id" varchar(10) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(320) NOT NULL,
	"sub" text NOT NULL,
	"picture" text,
	"createdAt" timestamp DEFAULT now(),
	"description" text DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "image" (
	"id" varchar(10) PRIMARY KEY NOT NULL,
	"url" varchar(2048) NOT NULL,
	"artId" varchar(10)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" varchar(10) PRIMARY KEY NOT NULL,
	"artistId" varchar(10),
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "art" ADD CONSTRAINT "art_artistId_artist_id_fk" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "image" ADD CONSTRAINT "image_artId_art_id_fk" FOREIGN KEY ("artId") REFERENCES "art"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_artistId_artist_id_fk" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
