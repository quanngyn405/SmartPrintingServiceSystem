import PrintConfigRepository from "../repositories/PrintConfigRepository.js";

/**
 * Controller handling print configuration operations
 */
class PrintConfigController {
    constructor() {

        this.printConfigRepository = new PrintConfigRepository();

    }

    getDefaultConfig = async (req, res) => {
        try {
         
            console.log(this.printConfigRepository)
            console.log("Hello")
            const config = await this.printConfigRepository.getDefaultConfig();
            
            return res.status(200).json({
                print_config_id: config.print_config_id,
                paper_size: config.paper_size,
                pages_to_print: config.pages_to_print,
                number_of_copies: config.number_of_copies,
                create_at: config.create_at,
                duplex: config.duplex ? '2-sided' : '1-sided'
            });
        } catch (error) {
            console.error(`Error in getDefaultConfig: ${error.message}`);
            res.status(500).json({
                success: false,
                message: `Failed to fetch default configuration: ${error.message}`
            });
        }
    }
}

export default  new PrintConfigController();