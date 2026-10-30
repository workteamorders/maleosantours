-- Public visitor comments with admin moderation.
-- Safe additive migration: creates a new table only.
-- status is VARCHAR: 'pending', 'approved', 'rejected'.

CREATE TABLE IF NOT EXISTS `visitorcomment` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(80) NOT NULL,
  `content` TEXT NOT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'pending',
  `ipHash` VARCHAR(64) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `visitorcomment_status_createdAt_idx` (`status`, `createdAt`),
  INDEX `visitorcomment_ipHash_createdAt_idx` (`ipHash`, `createdAt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
