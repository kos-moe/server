CREATE TABLE IF NOT EXISTS "profiles" (
	"id" char(26) PRIMARY KEY NOT NULL,
	"handle" char(26) NOT NULL,
	"account_id" char(26),
	"name" char(26) DEFAULT '' NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "handle_idx" ON "profiles" (lower("handle"));
DO $$ BEGIN
 ALTER TABLE "profiles" ADD CONSTRAINT "profiles_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
