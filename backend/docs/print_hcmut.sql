-- Database setup
DROP DATABASE IF EXISTS hcmutdb;
CREATE DATABASE hcmutdb;
USE hcmutdb;

-- Semester page allocation table
CREATE TABLE `SEMESTER_PAGE_ALLOCATION` (
  `allocation_id` INT AUTO_INCREMENT PRIMARY KEY,
  `semester_name` VARCHAR(100),
  `create_at` DATETIME,
  `start_date` DATETIME,
  `end_date` DATETIME,
  `page_allocated` INT
);

-- User table
CREATE TABLE `user` (
  `user_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_name` VARCHAR(255),
  `email` VARCHAR(255),
  `password` VARCHAR(255),
  `role` ENUM('student', 'spso'),
  `create_at` DATETIME
);

-- Student table
CREATE TABLE `student` (
  `student_id` INT PRIMARY KEY,
  `user_id` INT,
  `allocation_id` INT,
  `page_balance` INT,
  FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  FOREIGN KEY (`allocation_id`) REFERENCES `SEMESTER_PAGE_ALLOCATION`(`allocation_id`)
    ON DELETE CASCADE 
    ON UPDATE CASCADE
);

-- Transaction table
CREATE TABLE `transaction` (
  `transaction_id` int auto_increment primary key,
  `student_id` INT,
  `amount_paid` DECIMAL(10,2),
  `transaction_date` DATETIME,
  `payment_method` VARCHAR(255),
  FOREIGN KEY (`student_id`) REFERENCES `student`(`student_id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
);


-- Printer table
CREATE TABLE `printer` (
  `printer_id` INT AUTO_INCREMENT PRIMARY KEY,
  `printer_name` VARCHAR(255),
  `brand_name` VARCHAR(255),
  `model` VARCHAR(255),
  `campus_name` VARCHAR(255), -- Co So LTK hoac Co So Di An
  `building_name` VARCHAR(255),
  `room_number` VARCHAR(255),
  `update_at` DATETIME,
  `create_at` DATETIME,
  `status` ENUM('enabled', 'disabled')
);

-- Permitted file type table
CREATE TABLE `permitted_file_type` (
  `file_type_id` INT AUTO_INCREMENT PRIMARY KEY,
  `mime_type` VARCHAR(255)
);

-- File table
CREATE TABLE `file` (
  `file_id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT,
  `file_type_id` INT,
  `file_path` VARCHAR(255),
  `filename` VARCHAR(255),
  `upload_at` DATETIME,
  `number_of_pages` INT, 
  `size`  BIGINT NOT NULL DEFAULT 0,
  FOREIGN KEY (`student_id`) REFERENCES `student`(`student_id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  FOREIGN KEY (`file_type_id`) REFERENCES `permitted_file_type`(`file_type_id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
);

-- Print configuration table
CREATE TABLE `print_config` (
  `print_config_id` INT AUTO_INCREMENT PRIMARY KEY,
  `paper_size` ENUM('A3', 'A4'),
  `pages_to_print` ENUM('even', 'odd', 'all'),
  `number_of_copies` INT,
  `create_at` DATETIME,
  `duplex` BOOLEAN
);

-- Print jobs table
CREATE TABLE `print_jobs` (
  `print_jobs_id` INT AUTO_INCREMENT PRIMARY KEY,
  `print_config_id` INT,
  `printer_id` INT,
  `student_id` INT,
  `print_start_time` DATETIME,
  `print_end_time` DATETIME,
  `total_page_cost` INT,
  FOREIGN KEY (`print_config_id`) REFERENCES `print_config`(`print_config_id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  FOREIGN KEY (`printer_id`) REFERENCES `printer`(`printer_id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  FOREIGN KEY (`student_id`) REFERENCES `student`(`student_id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
);

-- Print jobs file association table
CREATE TABLE `print_jobs_file` (
  `print_jobs_id` INT,
  `file_id` INT,
  FOREIGN KEY (`print_jobs_id`) REFERENCES `print_jobs`(`print_jobs_id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  FOREIGN KEY (`file_id`) REFERENCES `file`(`file_id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
);



DELIMITER //

CREATE TRIGGER after_transaction_insert
AFTER INSERT ON `transaction`
FOR EACH ROW
BEGIN
	-- Update the page_balance by adding new pages (amount_paid / 1000)
    -- assuming 1000 VND per page	
    UPDATE student	
    SET page_balance = page_balance + FLOOR(NEW.amount_paid / 500)	
    WHERE student_id = NEW.student_id;
END//
DELIMITER ;

DELIMITER //

CREATE TRIGGER after_print_job_insert
AFTER INSERT ON `print_jobs`
FOR EACH ROW
BEGIN
    UPDATE student
    SET page_balance = page_balance - NEW.total_page_cost 
    WHERE student_id = NEW.student_id;
END//
DELIMITER ;







