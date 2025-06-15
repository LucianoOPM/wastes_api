CREATE TABLE "profiles" (
	"id_profile" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "profiles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id_user" serial PRIMARY KEY NOT NULL,
	"email" varchar(100) NOT NULL,
	"password" varchar(75) NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"profileId" integer NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_profileId_profiles_id_profile_fk" FOREIGN KEY ("profileId") REFERENCES "public"."profiles"("id_profile") ON DELETE no action ON UPDATE no action;