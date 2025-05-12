-- Insert an SPSO user
USE hcmutdb;
INSERT INTO `user` (user_name, email, password, role, create_at)
VALUES ('SPSOAdmin', 'spso@example.com', 'securepassword', 'spso', NOW());

-- Insert student users
INSERT INTO `user` (user_name, email, password, role, create_at)
VALUES 
('StudentOne', 'student1@example.com', 'password123', 'student', NOW()),
('StudentTwo', 'student2@example.com', 'password123', 'student', NOW());


INSERT INTO `SEMESTER_PAGE_ALLOCATION` (semester_name, create_at, start_date, end_date, page_allocated)
VALUES 
('HK241', '2024-07-01 12:00:00', '2024-08-01', '2024-12-30', 400);

-- Insert students
INSERT INTO `student` (student_id, user_id, allocation_id, page_balance)
VALUES 
(1, 2, 1, 400), 
(2, 3, 1, 400);

-- Insert permitted file types
INSERT INTO `permitted_file_type` (mime_type)
VALUES 
('application/pdf');




-- Insert printers
INSERT INTO `printer` (printer_name, brand_name, model, campus_name, building_name, room_number, update_at, create_at, status)
VALUES 
('Printer 1', 'HP', 'LaserJet 1020', 'LTK Campus', 'B4', '505', NOW(), NOW(), 'enabled'),
('Printer 2', 'Canon', 'PIXMA G3010', 'LTK Campus', 'A4', '303', NOW(), NOW(), 'enabled'),
('Printer 3', 'HP', 'LaserJet 1020', 'LTK Campus', 'B3', '101', NOW(), NOW(), 'enabled'),
('Printer 4', 'Canon', 'PIXMA G3010', 'LTK Campus', 'A2', '202', NOW(), NOW(), 'enabled'),
('Printer 5', 'HP', 'LaserJet 1020', 'LTK Campus', 'C1', '101', NOW(), NOW(), 'enabled'),
('Printer 6', 'HP', 'LaserJet 1020', 'Di An Campus', 'H1', '402', NOW(), NOW(), 'enabled'),
('Printer 7', 'Canon', 'PIXMA G3010', 'Di An Campus', 'H4', '503', NOW(), NOW(), 'enabled'),
('Printer 8', 'HP', 'LaserJet 1020', 'Di An Campus', 'H6', '102', NOW(), NOW(), 'enabled'),
('Printer 9', 'Canon', 'PIXMA G3010', 'Di An Campus', 'H6', '405', NOW(), NOW(), 'enabled'),
('Printer 10', 'HP', 'LaserJet 1020', 'Di An Campus', 'H1', '207', NOW(), NOW(), 'enabled');


-- Insert default print configuration
INSERT INTO `print_config` (paper_size, pages_to_print, number_of_copies, create_at, duplex)
VALUES 
('A4', 'all', 1, NOW(), TRUE);




-- Insert print jobs and associated files
-- INSERT INTO `print_jobs` (print_config_id, printer_id, student_id, print_start_time, print_end_time)
-- VALUES 
-- (1, 1, 1, NOW(), DATE_ADD(NOW(), INTERVAL 10 MINUTE)),
-- (1, 2, 2, NOW(), DATE_ADD(NOW(), INTERVAL 15 MINUTE));

-- INSERT INTO `print_jobs_file` (print_jobs_id, file_id)
-- VALUES 
-- (1, 1), 
-- (1, 2), 
-- (2, 3);
