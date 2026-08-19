CREATE TABLE `notificationPreferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`proofSubmitted` int NOT NULL DEFAULT 1,
	`milestoneApproved` int NOT NULL DEFAULT 1,
	`fundsReleased` int NOT NULL DEFAULT 1,
	`contributionReceived` int NOT NULL DEFAULT 1,
	CONSTRAINT `notificationPreferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `notificationPreferences_userId_unique` UNIQUE(`userId`)
);
