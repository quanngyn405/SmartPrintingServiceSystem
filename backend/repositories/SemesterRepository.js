import BaseRepository from "./BaseRepository.js";
import Semester from "../models/Semester.js";



class SemesterRepository extends BaseRepository{
    constructor(){
        super(Semester, 'SEMESTER_PAGE_ALLOCATION')
    }

    getAllSemesters = async () => {
        try{
            const [rows] = await this.db.query(
                `SELECT * FROM ${this.tableName} ORDER BY start_date DESC`
            )
            return rows;

        }catch(error){
            console.error(`Error in getAllSemester: ${error}`);
            throw error;
        }
    }

    getSemesterById = async (allocationId) => {
        try{
            const [rows] =  await this.db.query(
                `SELECT * FROM ${this.tableName} ORDER BY start_date DESC WHERE allocation_id = ?`,[allocationId]
            )
            return rows[0] || null;
        }catch(error){
            console.error(`Error in getSemesterById: ${error}`);
            throw error;
        }
    }

    updatePageAllocation = async (allocationId, pageAllocated) => {
        try{

            const [result] = await this.db.query(
                `UPDATE ${this.tableName} 
                SET page_allocated = ? 
                WHERE allocation_id = ? AND start_date > NOW()`,
                [pageAllocated, allocationId]
            );
            return result.affectedRows > 0;
        }catch(error){
            console.error(`Error in updatePageAllocation: ${error}`);
            throw error;
        }
    }


    createSemester  = async (semesterData) => {
        try{
            if (new Date(semesterData.start_date) <= new Date()) {
                throw new Error('Semester start date must be in the future');
            }
            const sql = `
                INSERT INTO ${this.tableName} (semester_name, start_date, end_date, page_allocated, create_at)
                VALUES (?, ?, ?, ?, NOW())
            `;
            const params = [semesterData.semester_name, semesterData.start_date, semesterData.end_date, semesterData.page_allocated];
            const [result] = await this.db.query(sql, params); 
            
        }catch(error){
            console.error(`Error in createSemester: ${error}`);
            throw error;
        }
    }
}

export default SemesterRepository;