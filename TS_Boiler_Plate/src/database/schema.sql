-- =============================================================
-- HR Management API – Database Schema
-- =============================================================
-- This file mirrors the Knex migration files in:
--   src/database/migrations/
--
-- Usage (manual init):
--   mysql -u <user> -p <database> < src/database/schema.sql
--
-- For programmatic migration use:
--   npm run migrate:latest
-- =============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- -------------------------------------------------------------
-- Table: hr_users
-- Stores HR admin accounts (used for authentication)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hr_users` (
  `id`            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `email`         VARCHAR(255)    NOT NULL,
  `password_hash` VARCHAR(255)    NOT NULL,
  `name`          VARCHAR(255)    NOT NULL,
  `created_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hr_users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- Table: employees
-- Core employee records with soft-delete support
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `employees` (
  `id`            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `name`          VARCHAR(255)    NOT NULL,
  `age`           INT             NOT NULL,
  `designation`   VARCHAR(255)    NOT NULL,
  `hiring_date`   DATE            NOT NULL,
  `date_of_birth` DATE            NOT NULL,
  `salary`        DECIMAL(10, 2)  NOT NULL,
  `photo_path`    VARCHAR(500)        NULL,
  `deleted_at`    TIMESTAMP           NULL DEFAULT NULL,
  `created_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- Table: attendance
-- Daily check-in records (one per employee per date)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `attendance` (
  `id`            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `employee_id`   INT UNSIGNED    NOT NULL,
  `date`          DATE            NOT NULL,
  `check_in_time` TIME            NOT NULL,
  `created_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `attendance_employee_date_unique` (`employee_id`, `date`),
  CONSTRAINT `fk_attendance_employee`
    FOREIGN KEY (`employee_id`)
    REFERENCES `employees` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
