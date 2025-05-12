
import pool from '../config/database.js';


class BaseRepository {
    constructor(model, tableName) {
        this.model = model;
        this.tableName = tableName;
        this.db = pool;
    }

    async findById(id) {
        try {
            const [rows] = await this.db.query(
                `SELECT * FROM ${this.tableName} WHERE ${this.tableName}_id = ?`,
                [id]
            );

            return rows.length > 0 ?  rows[0] : null;
        } catch (error) {
            console.error(`Error in findById: ${error.message}`);
            throw error;
        }
    }

    async create(entity) {
        try {
            
            const [result] = await this.db.query(
                `INSERT INTO ${this.tableName} SET ?`,
                entity
            );

            entity[`${this.tableName}_id`] = result.insertId;
            return entity;
        } catch (error) {
            console.error(`Error in create: ${error.message}`);
            throw error;
        }
    }

    async update(id, updates) {
        try {
            await this.db.query(
                `UPDATE ${this.tableName} SET ? WHERE ${this.tableName}_id = ?`,
                [updates, id]
            );
            return this.findById(id);
        } catch (error) {
            console.error(`Error in update: ${error.message}`);
            throw error;
        }
    }

    async delete(id) {
        try {
            const [result] = await this.db.query(
                `DELETE FROM ${this.tableName} WHERE ${this.tableName}_id = ?`,
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error(`Error in delete: ${error.message}`);
            throw error;
        }
    }
}

export default BaseRepository;