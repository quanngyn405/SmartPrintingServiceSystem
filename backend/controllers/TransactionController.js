import TransactionRepository from "../repositories/TransactionRepository.js";

/**
 * Controller handling Transaction-related operations
 */
class TransactionController {
    constructor() {
        this.transactionRepository = new TransactionRepository();
    }

    /**
     * Get transaction by id
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    getAllTransactionByStudentId = async (req, res) => {
        try {
            const studentId = parseInt(req.params.student_id);
            const transactions = await this.transactionRepository.findByStudentId(studentId);
    
            if (transactions.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No transactions found for this student"
                });
            }
    
            // const formattedTransactions = transactions.map(transaction => ({
            //     transactionId: transaction.transactionId,
            //     studentId: transaction.studentId,
            //     amountPaid: transaction.amountPaid,
            //     transactionDate: transaction.transactionDate,
            //     paymentMethod: transaction.paymentMethod
            // }));
    
            res.status(200).json(transactions);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: `Failed to fetch transactions: ${error.message}`
            });
        }
    };
    
    getAllTransactions = async (req, res) => {
        try {
            const transactions = await this.transactionRepository.findAll();
            console.log(transactions)
            const formattedTransactions = transactions.map(transaction => ({
                transactionId: transaction.transactionId,
                studentId: transaction.studentId,
                amountPaid: transaction.amountPaid,
                transactionDate: transaction.transactionDate,
                paymentMethod: transaction.paymentMethod
            }));
            res.status(200).json(formattedTransactions);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: `Failed to fetch transactions: ${error.message}`
            });
        }
    };


    /**
   * Create transaction
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
    createTransaction = async (req, res) => {
        try {
            const {
                student_id,
                amount_paid,
                transaction_date,
                payment_method
            } = req.body;
            


            // const newTransaction = await this.transactionRepository.db.query(
                
            //     `
            //     INSERT INTO ${this.transactionRepository.tableName} (student_id,amount_paid, transaction_date, payment_method) VALUES (?, ?, ?, ?)
            //     `, [student_id, amount_paid, transaction_date,payment_method]

            // )
            const newTransaction = await this.transactionRepository.create({
                student_id: student_id,
                amount_paid: amount_paid,
                transaction_date: transaction_date,
                payment_method: payment_method
            });

            res.status(200).json({
                success: true,
                message: "Transaction created successfully",
                transaction: newTransaction
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: `Failed to create transaction: ${error.message}`
            })
        }
    };

    

}
export default new TransactionController();

