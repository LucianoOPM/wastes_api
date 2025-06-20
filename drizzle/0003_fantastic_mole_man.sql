CREATE TYPE "public"."type" AS ENUM('income', 'expense');--> statement-breakpoint
CREATE TABLE "categories" (
	"id_category" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "movements" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "type" NOT NULL,
	"userId" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"amount" numeric(10, 2),
	"description" text,
	"date" date NOT NULL,
	"title" varchar(100) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"categoryId" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "movements" ADD CONSTRAINT "movements_userId_users_id_user_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id_user") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movements" ADD CONSTRAINT "movements_categoryId_categories_id_category_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id_category") ON DELETE no action ON UPDATE no action;