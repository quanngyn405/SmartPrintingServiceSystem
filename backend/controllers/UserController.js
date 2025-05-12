import UserRepository from "../repositories/UserRepository.js";

/**
 * Controller handling User-related operations
 */
class UserController {
    constructor(){
        this.userRepository  = new UserRepository();
    }

    /**
     * Get user by id
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */

    getUsersByID = async (req, res) => { 

      try{
          const userId = parseInt(req.params.user_id);  
          const user = await this.userRepository.findById(userId);
          if(!user){
              return res.status(404).json({
                  success:false,
                  message: "User not found"
              })
          }
          res.status(200).json({
            success:true,
            data: user
          })
      }catch(error){
          res.status(500).json({
              success:false,
              message: `Failed to fetch User: ${error.message}`
          })
      }
    };

    getUsersByUsername = async (req, res) => {
        try{
            
            const username = req.params.username;
            console.log(username)
            const user = await this.userRepository.db.query(
                `SELECT * FROM ${this.userRepository.tableName} WHERE user_name = ?`,
                [username]
            )
            if(!user){
                return res.status(404).json({
                    success:false,
                    message: "User not found"
                })
            }
            res.status(200).json({
                success:true,
                data: user[0][0]
              })
        }catch(error){
            res.status(500).json({
                success:false,
                message: `Failed to fetch User: ${error.message}`
            })
        }
    }
      /**
     * Create user
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */

    getStudentByUsername = async(req,res) => {
        try{
            const username = req.params.username;
            const user = await this.userRepository.db.query(
                `SELECT 
                    u.user_id,
                    u.user_name,
                    u.email,
                    u.password,
                    u.role,
                    u.create_at,
                    s.student_id,
                    s.page_balance,
                    spa.semester_name,
                    spa.start_date,
                    spa.end_date,
                    spa.page_allocated
                FROM USER u
                JOIN STUDENT s ON u.user_id = s.user_id
                JOIN SEMESTER_PAGE_ALLOCATION spa ON s.allocation_id = spa.allocation_id
                WHERE u.user_name =  ?
                `, [username])

                if(!user){
                    return res.status(404).json({
                        success:false,
                        message: "User not found"
                    })
                }
                res.status(200).json({
                    success:true,
                    data: user[0][0]
                }) 
        }catch(error){
            res.status(500).json({
                success:false,
                message: `Failed to fetch User: ${error.message}`
            })
        }
    }
  createUser = async (req, res) => {
    try{
        const{
          user_name,
          email,
          password
        } = req.body;

        const newUser = await this.userRepository.create({
            userName: user_name,
            email: email,
            password: password,
            role: 'Student'
        });

        res.status(200).json({
            success:true,
            message: "User created successfully",
            user: newUser
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: `Failed to create user: ${error.message}`
        })
    }
  };
};
export default new UserController();
