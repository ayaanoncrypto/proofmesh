CREATE TABLE `contributions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`funderId` int NOT NULL,
	`amountUsdc` int NOT NULL,
	`txHash` varchar(120),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contributions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `milestones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`position` int NOT NULL,
	`title` varchar(180) NOT NULL,
	`description` text NOT NULL,
	`amountUsdc` int NOT NULL,
	`proofUrl` varchar(500),
	`proofDescription` text,
	`status` enum('Pending','Submitted','Approved','Released') NOT NULL DEFAULT 'Pending',
	`submittedAt` timestamp,
	`approvedAt` timestamp,
	`releasedAt` timestamp,
	CONSTRAINT `milestones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('proof_submitted','milestone_approved','funds_released','contribution_received') NOT NULL,
	`title` varchar(180) NOT NULL,
	`body` text NOT NULL,
	`projectId` int,
	`milestoneId` int,
	`readAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`creatorId` int NOT NULL,
	`title` varchar(180) NOT NULL,
	`description` text NOT NULL,
	`category` enum('DeFi','Gaming','DePIN','Social','Other') NOT NULL,
	`goalUsdc` int NOT NULL,
	`status` enum('Active','Completed','Cancelled') NOT NULL DEFAULT 'Active',
	`chain` varchar(80) NOT NULL DEFAULT 'Arbitrum Sepolia',
	`contractAddress` varchar(80),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `proofReviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`milestoneId` int NOT NULL,
	`reviewerType` enum('AI','Human') NOT NULL DEFAULT 'AI',
	`recommendation` enum('Approve','Needs evidence','Reject') NOT NULL,
	`confidence` int NOT NULL,
	`rationale` text NOT NULL,
	`checksJson` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `proofReviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `releases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`milestoneId` int NOT NULL,
	`projectId` int NOT NULL,
	`amountUsdc` int NOT NULL,
	`txHash` varchar(120) NOT NULL,
	`network` varchar(80) NOT NULL DEFAULT 'Arbitrum Sepolia',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `releases_id` PRIMARY KEY(`id`)
);
