CREATE TABLE `recallops_audit_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`actorHash` varchar(64) NOT NULL,
	`action` varchar(32) NOT NULL,
	`target` varchar(80) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp NOT NULL,
	CONSTRAINT `recallops_audit_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `recallops_rate_limits` (
	`subjectHash` varchar(64) NOT NULL,
	`windowStartedAt` bigint NOT NULL,
	`requestCount` int NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `recallops_rate_limits_subjectHash` PRIMARY KEY(`subjectHash`)
);
--> statement-breakpoint
CREATE INDEX `recallops_audit_expires_idx` ON `recallops_audit_events` (`expiresAt`);