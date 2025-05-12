// controllers/PrinterController.js

import PrinterRepository from "../repositories/PrinterRepository.js";

/**
 * Controller handling printer-related operations
 */
class PrinterController {
    constructor(){
        this.printerRepository  = new PrinterRepository();
        
    }

    /**
     * Get all printers
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    getAllPrinters = async (req, res) => {
        try{
            const printers = await this.printerRepository.findAll();
            console.log(printers)
            // const formattedPrinters = printers.map(printer => ({
            //     printer_id: printer.printerId,
            //     printer_name: printer.printerName,
            //     brand_name: printer.brandName,
            //     model: printer.model,
            //     description: printer.description,
            //     campus_name: printer.campusName,
            //     building_room_name: printer.buildingName + ' ' + printer.roomNumber,
            //     update_at: printer.updatedAt,
            //     create_at: printer.createdAt,
            //     status: printer.status
            // }));
            res.status(200).json(printers);
        }catch(error){ 
            res.status(500).json({
                success:false,
                message: `Failed to fetch printers: ${error.message}`
            });
        }
    };

    /**
     * Get printer by ID
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object 
     */
    getPrinterByID = async (req, res) => {
        try{
            const printerId = parseInt(req.params.printer_id);
            const printer = await this.printerRepository.findById(printerId);
            if(!printer){
                return res.status(404).json({
                    success:false,
                    message: "Printer not found"
                })
            }
            res.status(200).json({
                printer_id: printer.printerId,
                printer_name: printer.printerName,
                brand_name: printer.brandName,
                model: printer.model,
                description: printer.description,
                campus_name: printer.campusName,
                building_room_name: printer.buildingName + ' ' + printer.roomNumber,
                update_at: printer.updatedAt,
                create_at: printer.createdAt,
                status: printer.status
            })
        }catch(error){
            res.status(500).json({
                success:false,
                message: `Failed to fetch printer: ${error.message}`
            })
        }
    };

    /**
     * Update printer status
     * @param {Object} req
     * @param {Object} res
     */
    updatePrinterStatus = async (req, res) => {
        try{
            const printerId = parseInt(req.params.printer_id);
            const {status} = req.body;

            console.log(status)
            console.log(printerId)

            if (!['enabled', 'disabled'].includes(status.toLowerCase())){
                return res.status(400).json({
                    success:false,
                    message:"Invalid status. The status must be either 'enable' or 'disable'"
                });
            }
            const updatePrinter = await this.printerRepository.updateStatus(printerId, status.toLowerCase());
            if (!updatePrinter){
                return res.status(404).json({
                    success: false,
                    message: `Update failed with printerId: ${printerId} and status: ${status}}, printer not found`
                })
            }
            res.status(200).json({
                success:true,
                message: `Printer with id: ${printerId}, has its status updated to ${status}`
            })
        }catch(error){
            res.status(500).json({
                success:false,
                message: `Failed to update printer status: ${error.message}`
            })
        }
    };

    /**
     * Create a new printer
     * @param req
     * @param res
     */
    createPrinter = async (req, res) => {
        try{
            const{
                printer_name, 
                brand_name,
                model,
                campus_name,
                building_name,
                room_number,
                status
            } = req.body;

           
            const newPrinter = await this.printerRepository.create({
                printer_name,
                brand_name,
                model,
                campus_name,
                building_name: building_name,
                room_number: room_number,
                status: status.toLowerCase(),
                update_at: new Date(),
                create_at : new Date()
            });

            res.status(200).json({
                success:true,
                message: "Printer created successfully",
                printer: newPrinter
            })
        }catch(error){
            res.status(500).json({
                success: false,
                message: `Failed to create printer: ${error.message}`
            })
        }
    };
}

export default new PrinterController();