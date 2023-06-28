CREATE TABLE IF NOT EXISTS "exhibit" (
	"id" varchar(10) PRIMARY KEY NOT NULL,
	"location" text NOT NULL,
	"startDate" timestamp NOT NULL,
	"endDate" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "exhibitArts" (
	"exhibitId" varchar(10),
	"artId" varchar(10)
);
--> statement-breakpoint
ALTER TABLE "exhibitArts" ADD CONSTRAINT "exhibitArts_artId_exhibitId" PRIMARY KEY("artId","exhibitId");
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exhibitArts" ADD CONSTRAINT "exhibitArts_exhibitId_exhibit_id_fk" FOREIGN KEY ("exhibitId") REFERENCES "exhibit"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exhibitArts" ADD CONSTRAINT "exhibitArts_artId_art_id_fk" FOREIGN KEY ("artId") REFERENCES "art"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
