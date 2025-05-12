USE hcmutdb;

SELECT * FROM print_jobs_file;

SELECT * FROM print_jobs;


SELECT f.* FROM FILE f JOIN print_jobs_file pjf ON f.file_id = pjf.file_id where pjf.print_jobs_id = 1;


select * from student;

SHOW CREATE TABLE `student`;
ALTER TABLE `transaction` AUTO_INCREMENT = 1;
INSERT INTO `transaction` (student_id, amount_paid, transaction_date, payment_method) 
VALUES (1, 500, '2024-12-05', 'MoMo');
select * from transaction;


SELECT @@sql_mode;

SHOW CREATE TABLE `transaction`;

ALTER TABLE `transaction` MODIFY `transaction_id` INT NOT NULL AUTO_INCREMENT;
SELECT * FROM user WHERE user_name = 'StudentOne';


select* from print_jobs;


SELEct* from student;
