CREATE TABLE `companies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`logo_url` text,
	`website` text
);
--> statement-breakpoint
CREATE TABLE `job_technologies` (
	`job_id` integer NOT NULL,
	`technology_id` integer NOT NULL,
	PRIMARY KEY(`job_id`, `technology_id`),
	FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`technology_id`) REFERENCES `technologies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`company_id` integer NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`workplace` text NOT NULL,
	`work_type` text NOT NULL,
	`seniority` text NOT NULL,
	`country` text,
	`city` text,
	`salary_min` integer,
	`salary_max` integer,
	`is_featured` integer DEFAULT false,
	`published_at` integer,
	`created_at` integer,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `technologies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `technologies_name_unique` ON `technologies` (`name`);