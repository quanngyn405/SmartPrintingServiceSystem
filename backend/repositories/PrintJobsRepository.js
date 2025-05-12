import BaseRepository from './BaseRepository.js';

import PrintJob from '../models/PrintJob.js';

class PrintJobRepository extends BaseRepository{
    constructor(){
        super(PrintJob, 'print_jobs');
    }

    createWithConfigAndFiles = async (printJobData, printConfigData, fileIds) => {
        const connection = await this.db.getConnection();
        try{
            
            connection.beginTransaction()
            let printConfigId = 1;
            if (printConfigData){
                
                const [configResult] = await connection.query(
                    `
                    INSERT INTO print_config SET ?
                    `, printConfigData
                )
                printConfigId = configResult.insertId;
                console.log(printConfigId)
            }
            // else = 1 // default config
          
            printJobData.print_config_id = printConfigId;
            delete printJobData.printer_config_id;
        

            
            const [jobResult] = await connection.query(
                `INSERT INTO print_jobs SET ?` , printJobData      
            )
            const printJobsId = jobResult.insertId;
           
            

            if (fileIds && fileIds.length > 0){
                const filesPrintJobValues = fileIds.map(fileId => [printJobsId, fileId]);
                
                await connection.query(
                    'INSERT INTO print_jobs_file (print_jobs_id, file_id) VALUES ?',
                    [filesPrintJobValues]
                );
            };

            await connection.commit();
            return {
                ...printJobData,
                print_jobs_id: jobResult.insertId,
                print_config_id: printConfigId
            };



        }catch(error){
            console.error(`Error in createWithConfig: ${error.message}`);
            throw error;
        }
    }

    getByStudetnId = async(studentId) => {
        try{    
            const [rows] = await this .db.query(
                `
                SELECT 
                    pj.*, 
                    pc.*,
                    GROUP_CONCAT(f.file_id) as file_ids,
                    GROUP_CONCAT(f.filename) as filenames
                FROM print_jobs pj
                
                LEFT JOIN print_config pc ON pj.print_config_id = pc.print_config_id
                LEFT JOIN print_jobs_file pjf ON pj.print_jobs_id = pjf.print_jobs_id
                LEFT JOIN file f ON  pjf.file_id = f.file_id
                WHERE pj.student_id = ?
                GROUP BY pj.print_jobs_id
                `, [studentId]
            );
            return rows;
        }catch(error){
            console.log(`Error in getStudentById: ${error}`);
            throw error;
        }
    }


    getAllPrintJobs = async () => {
        try{
            const [rows] = await this.db.query(
                `
                SELECT 
                    pj.*, 
                    pc.*,
                    GROUP_CONCAT(f.file_id) as file_ids,
                    GROUP_CONCAT(f.filename) as filenames
                FROM print_jobs pj
                
                LEFT JOIN print_config pc ON pj.print_config_id = pc.print_config_id
                LEFT JOIN print_jobs_file pjf ON pj.print_jobs_id = pjf.print_jobs_id
                LEFT JOIN file f ON  pjf.file_id = f.file_id
                GROUP BY pj.print_jobs_id
                `
            );
            return rows;
        }catch(error){
            console.log(`Error in getAllPrintJobs: ${error}`);
            throw error;
        }
    };



    getJobFiles = async (printJobId) => {
        try{
            console.log(printJobId)
            const [rows] = await this.db.query(
                `SELECT f.* FROM FILE f JOIN print_jobs_file pjf ON f.file_id = pjf.file_id where pjf.print_jobs_id = ? `, [printJobId]
            );
            console.log(rows)
            return rows;
        }catch(error){
            console.error(`Error in getJobFiles: ${error.message}`);
            throw error;
        }
    }
}

export default  PrintJobRepository;