import PrintJobRepository from "../repositories/PrintJobsRepository.js";


class PrintJobController{
    constructor(){
        this.PrintJobRepository = new PrintJobRepository()
    }


    /**
     * Creates a new print job.
     *
     * If `printer_config_id` is an object, a new print configuration will be created
     * and associated with the print job. If `printer_config_id` is a number, an existing
     * print configuration will be used.
     *
     * @async
     * @param {Object} req - The HTTP request object.
     * @param {Object} req.body - The request body containing the print job data.
     * @param {number|Object} req.body.printer_config_id - Print configuration ID or configuration object.
     * @param {number} req.body.printer_id - The ID of the printer to use.
     * @param {number} req.body.student_id - The ID of the student submitting the print job.
     * @param {number} req.body.file_ids - The list of ID of the files that the student want to include in the print job
     * @param {Object} res - The HTTP response object.
     * @returns {Promise<void>} The HTTP response with the status and result of the operation.
     */
    createPrintJob = async (req, res) => {
        try{
            const {printer_config_id, printer_id, student_id, file_ids, total_page_cost} = req.body;

            if (!file_ids || file_ids.length === 0){
                return res.status(400).json({
                    success:false,
                    message: "No files for printing???"
                })
            }

            
            let printST = new Date();
            let randomSeconds = Math.floor(Math.random() * (90 - 30 + 1)) + 30;

            let printET = new Date(printST.getTime() + randomSeconds * 1000);
            let printConfigData;
            let printJobData = {
                printer_id,
                student_id,
                print_start_time : printST,
                print_end_time: printET,
                total_page_cost
            };

            if (typeof printer_config_id === 'object'){
                printConfigData = {
                    paper_size: printer_config_id.paper_size,
                    pages_to_print: printer_config_id.pages_to_print,
                    number_of_copies: printer_config_id.number_of_copies,
                    create_at: new Date(),
                    duplex: printer_config_id.duplex
                };
          
                const result = await this.PrintJobRepository.createWithConfigAndFiles(printJobData, printConfigData, file_ids);

                return res.status(200).json({
                    success:true,
                    message: "PrintJob create successfully",
                    data: result
                });
            }
            else{
                printJobData.printer_config_id = printer_config_id
                
                const result = await this.PrintJobRepository.createWithConfigAndFiles(printJobData, null, file_ids)


                return res.status(200).json({
                    success:true,
                    message: "PrintJob create successfully",
                    data: result
                });
            }
        }catch(error){
            console.error(`Error in createPrintJob: ${error}`);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error!"
            })
        }
    }


    /**
     * Retrieves all print jobs submitted by a specific student.
     *
     * @async
     * @param {Object} req - The HTTP request object.
     * @param {Object} req.params - The request parameters.
     * @param {number} req.params.student_id - The ID of the student whose print jobs to retrieve.
     * @param {Object} res - The HTTP response object.
     * @returns {Promise<void>} The HTTP response with the student's print jobs.
     */
    getStudentPrintJobs = async (req, res) => {
        try{
            const {student_id} = req.params;
            const printJobs = await this.PrintJobRepository.getByStudetnId(student_id);

            const transformedJobs = printJobs.map(job => ({
                ...job,
                files: job.file_ids? {
                    ids: job.file_ids.split(','),
                    names: job.filenames.split(',')
                }: null,
                file_ids: undefined,
                filenames: undefined
            }));

            return res.status(200).json({
                success:true,
                data: transformedJobs
            });


        }catch(error){
            console.error(`Error in getStudentPrintJobs ${error}`);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }


    /**
     * Retrieves all print jobs.
     *
     * @async
     * @param {Object} req - The HTTP request object.
     * @param {Object} res - The HTTP response object.
     * @returns {Promise<void>} The HTTP response with all print jobs.
     */
    getAllPrintJobs = async(req,res) => {
        try{
            const printJobs = await this.PrintJobRepository.getAllPrintJobs();
            const transformedJobs = printJobs.map(job => ({
                ...job,
                files: job.file_ids? {
                    ids: job.file_ids.split(','),
                    names: job.filenames.split(',')
                }: null,
                file_ids: undefined,
                filenames: undefined
            }));

            return res.status(200).json({
                success:true,
                data: transformedJobs
            });
        }catch(error){
            console.error(`Error in getAllPrintJobs ${error}`);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }    


    getJobFiles = async (req, res) => {
        try{
            const {print_jobs_id} = req.params;
            const files = await this.PrintJobRepository.getJobFiles(print_jobs_id);
            return res.status(200).json({
                success:false,
                data: files
            });
        }catch(error){
            console.log(`Error in getJobFiles: ${error}`);
            return res.status(500).json({
                success: false,
                messae: "Internal Server Error"
            })
        }
    };


}

export default new PrintJobController();