CREATE TABLE IF NOT EXISTS "statuses" (
	"id" char(26) PRIMARY KEY NOT NULL,
	"profile_id" char(26) NOT NULL,
	"content" text NOT NULL
);

DO $$ BEGIN
 ALTER TABLE "statuses" ADD CONSTRAINT "statuses_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
