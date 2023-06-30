DO $$ BEGIN
 CREATE TYPE "status" AS ENUM('SALE', 'PREPARE', 'SOLD');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "art" ALTER COLUMN "status" SET DATA TYPE status;