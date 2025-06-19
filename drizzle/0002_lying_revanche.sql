CREATE TABLE "sessions" (
	"id_session" uuid PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"user_agent" varchar(300) NOT NULL,
	"ip_adress" "inet" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"is_valid" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_user_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id_user") ON DELETE no action ON UPDATE no action;