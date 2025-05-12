# BACKEND DATABASE SCHEMA

```sql
DROP DATABASE IF EXISTS hcmutdb;
CREATE DATABASE hcmutdb;
USE hcmutdb;

CREATE TABLE `user` (
`user_id` int AUTO_INCREMENT PRIMARY KEY,
`user_name` varchar(255) NOT NULL, 
`email` varchar(255) NOT NULL UNIQUE,
`password_hash` varchar(255) NOT NULL, 
`role` ENUM('student', 'spso') NOT NULL,
`created_at` datetime DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE `semester_page_allocation` (
	`allocation_id` int auto_increment primary key,
	`semester_name` varchar(255) NOT NULL,
    `start_date` date NOT NULL,
	`end_date` date NOT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
    `page_allocated` INT not null,
    CONSTRAINT `check_dates` CHECK (`end_date` >= `start_date`)
);

CREATE TABLE `permitted_file_type` (
`file_type_id` int AUTO_INCREMENT PRIMARY KEY,
`mime_type` varchar(255) NOT NULL UNIQUE,
`description` varchar(255),
`max_file_size` int,  -- in bytes
`enabled` boolean DEFAULT true,
`created_at` datetime DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE `printer` (
`printer_id` int AUTO_INCREMENT PRIMARY KEY,
`printer_name` varchar(255) NOT NULL,
`brand_name` varchar(255) NOT NULL,
`model` varchar(255) NOT NULL,
`description` text,
`campus_name` varchar(255) NOT NULL,
`building_name` varchar(255) NOT NULL,
`room_number` varchar(255) NOT NULL,
`status` ENUM('enabled', 'disabled', 'maintenance') NOT NULL DEFAULT 'enabled',
`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
`updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
`last_maintenance_date` datetime
);

CREATE TABLE `print_config` (
`print_config_id` int AUTO_INCREMENT PRIMARY KEY,
`paper_size` ENUM('A3', 'A4') NOT NULL,
`page_ranges` text NOT NULL,  -- Stores comma-separated page ranges (e.g., "1-5,7,9-12")
`pages_per_sheet` int DEFAULT 1,
`orientation` ENUM('portrait', 'landscape') NOT NULL DEFAULT 'portrait',
`color_mode` ENUM('color', 'grayscale') NOT NULL DEFAULT 'grayscale',
`duplex` boolean NOT NULL DEFAULT false,
`copies` int NOT NULL DEFAULT 1,
`created_at` datetime DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `student` (
  `student_id` int PRIMARY KEY,
  `allocation_id` int,
  `user_id` int NOT NULL ,
  `page_balance` int NOT NULL DEFAULT 0,
  FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`allocation_id`) REFERENCES `semester_page_allocation`(`allocation_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `transaction` (
`transaction_id` int AUTO_INCREMENT PRIMARY KEY,
`student_id` int NOT NULL,
`amount_paid` decimal(10,2) NOT NULL,
`pages_purchased` int NOT NULL,
`transaction_date` datetime DEFAULT CURRENT_TIMESTAMP,
`payment_method` ENUM('bank', 'momo', 'cash') NOT NULL,
`payment_status` ENUM('pending', 'completed', 'failed') NOT NULL,
FOREIGN KEY (`student_id`) REFERENCES `student`(`student_id`)
);


CREATE TABLE `file` (
`file_id` int AUTO_INCREMENT PRIMARY KEY,
`student_id` int NOT NULL,
`file_type_id` int NOT NULL,
`file_path` varchar(255) NOT NULL,
`filename` varchar(255) NOT NULL,
`original_filename` varchar(255) NOT NULL,
`status` ENUM('pending', 'processed', 'deleted') NOT NULL DEFAULT 'pending',
`size_in_bytes` int NOT NULL,
`page_count` int,  -- Total number of pages in the document
`upload_at` datetime DEFAULT CURRENT_TIMESTAMP,
`deleted_at` datetime,
FOREIGN KEY (`student_id`) REFERENCES `student`(`student_id`),
FOREIGN KEY (`file_type_id`) REFERENCES `permitted_file_type`(`file_type_id`)
);


CREATE TABLE `print_jobs` (
`print_job_id` int AUTO_INCREMENT PRIMARY KEY,
`student_id` int NOT NULL,
`printer_id` int NOT NULL,
`status` ENUM('pending', 'processing', 'completed', 'failed', 'canceled') NOT NULL DEFAULT 'pending',
`total_pages` int NOT NULL,
`total_sheets` int NOT NULL,
`total_cost` decimal(10,2) NOT NULL,
`submit_time` datetime DEFAULT CURRENT_TIMESTAMP,
`print_start_time` datetime,
`print_end_time` datetime,
`canceled_at` datetime,
`error_message` text,
FOREIGN KEY (`student_id`) REFERENCES `student`(`student_id`),
FOREIGN KEY (`printer_id`) REFERENCES `printer`(`printer_id`)
);

CREATE TABLE `print_job_files` (
`print_job_id` int NOT NULL,
`file_id` int NOT NULL,
`print_config_id` int NOT NULL,
PRIMARY KEY (`print_job_id`, `file_id`),
FOREIGN KEY (`print_job_id`) REFERENCES `print_jobs`(`print_job_id`),
FOREIGN KEY (`file_id`) REFERENCES `file`(`file_id`),
FOREIGN KEY (`print_config_id`) REFERENCES `print_config`(`print_config_id`)
);
```



# SOME DEVELOPED APIS
##  1. User Authentication and Management APIs
### 1.1. POST /api/login 
- Purpose: Authenticate users (both students and SPSO) using their credentials(hcmut email and password, must check if the email is a HCMUT email)
- Requirement: Allows users to authenticate before accessing services.
- Input: {"email": "user@hcmut.edu.vn", "password": securePassword}
- Output: { "token": "jwtToken", "user_id": 1, "role": "student" } # Cái trả về này tùy vào yêu cầu của frontend, nhưng quan trọng là phải có token để hoàn thành việc đăng nhập. FE cần token này để có global context cho người dùng.

### 1.2 User Profile retrieval(cho student)
- Endpoint: `/api/users/{user_id}`
- GET
- Retrieve user profile details.


## 2. Semester and Page Allocation Management
### 2.1. Retrieve Current Semester Allocation
- Endpoint: `/api/semesters/current`
- METHOD: `GET`
- Authentication required
- Desription: get the current semester's page allocation.


### 2.2. List All Semesters
- Endpoint: `/api/semesters`
- Method : `GET`
- Description: List all semesters and their allocations.

### 2.3 Create New Semester Allocation (SPSO)
- Endpoint: /api/semesters
- Method: `POST`
- Description: Create a new semester with a default page allocation.


## 3. Student Management
### 3.1. Get Student Details
- Endpoint: `/api/students/{student_id}`
- Method: `GET`
- Description: Retrieve student details including page balance.



## 4. File Management APIs
### 4.1. Upload File 
- Endpoint: `/api/files/upload`
- Method: `POST`
- Description: Upload a file to the system.

### 4.2. List Uploaded Files
- Endpoint: `/api/files`
- Method: `GET`
- Description: List all files uploaded by the authenticated student.

### 4.3. Delete File
- Endpoint: `/api/files/{file_id}`
- Method: `DELETE`
- Description: Delete a file uploaded by the student.



## 5. Printer Management
## 5.1. List Available Printers
- Endpoint: `/api/printers`
- Method: `GET`
- Description: Get a list of all available printers.

## 5.2. Get printer details
- Endpoint: `/api/printers/{printer_id}`
- Method: `GET`
- Description: Get detailed information about a specific printer.



## 6. Print Configuration Management
### 6.1. Get Permitted File Types
- Endpoint: `/api/files/permitted-types`
- Method: `GET`
- Description: Retrieve a list of permitted file types.



## 7. Print Job Management
### 7.1. Create Print Job
- Endpoint: `/api/print-jobs`
- Method: `POST`
- Create print job

### 7.2. Get Print Job Status
- Endpoint: `/api/print-jobs/{print_job_id}`
- Description: Retrieve the status of a print job.
- Method: `GET`


### 7.3. Cancel Print Job
- Endpoint: `/api/print-jobs/{print_job_id}/cancel`
- Description: Cancel a pending print job.
- Method: `POST`

## 8. Transaction Management
### 8.1. Purchase Additional Pages

- Endpoint: `/api/transactions/purchase`
- Method: `POST`
- Description: Purchase additional pages for printing.


### 8.2.  Get Transaction History
- Endpoint: `/api/transactions`
- Method: `GET`

- Description: Retrieve the student's transaction history.


