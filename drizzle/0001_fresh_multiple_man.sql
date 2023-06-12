CREATE TABLE IF NOT EXISTS "oauth_app_redirect_uris" (
	"app_id" char(26),
	"uri" varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS "oauth_apps" (
	"id" char(26) PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"secret" varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS "sessions" (
	"id" char(26) PRIMARY KEY NOT NULL,
	"account_id" char(26) NOT NULL,
	"expires_at" timestamp DEFAULT now() + interval '7 day' NOT NULL,
	"app_id" char(26),
	"scope" json DEFAULT '[]'::json NOT NULL
);

DO $$ BEGIN
 ALTER TABLE "oauth_app_redirect_uris" ADD CONSTRAINT "oauth_app_redirect_uris_app_id_oauth_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "oauth_apps"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_app_id_oauth_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "oauth_apps"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
