CREATE TABLE IF NOT EXISTS "account_emails" (
	"email" varchar PRIMARY KEY NOT NULL,
	"account_id" char(26)
);

CREATE TABLE IF NOT EXISTS "accounts" (
	"id" char(26) PRIMARY KEY NOT NULL,
	"name" varchar DEFAULT '' NOT NULL,
	"authenticator" json DEFAULT '{}'::json NOT NULL
);

DO $$ BEGIN
 ALTER TABLE "account_emails" ADD CONSTRAINT "account_emails_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
