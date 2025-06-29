ALTER TYPE "public"."type" RENAME TO "transaction_type";--> statement-breakpoint
ALTER TABLE "movements" RENAME TO "transactions";--> statement-breakpoint
ALTER TABLE "transactions" DROP CONSTRAINT "movements_userId_users_id_user_fk";
--> statement-breakpoint
ALTER TABLE "transactions" DROP CONSTRAINT "movements_categoryId_categories_id_category_fk";
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_users_id_user_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id_user") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_categoryId_categories_id_category_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id_category") ON DELETE no action ON UPDATE no action;