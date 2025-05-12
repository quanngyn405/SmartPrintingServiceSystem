class Printer {
    constructor({
        printerId,
        printerName,
        brandName,
        model,
        description,
        campusName,
        buildingName,
        roomNumber,
        status,
        updatedAt,
        createdAt,
    }){
        this.printerId = printerId;
        this.printerName = printerName;
        this.brandName = brandName;
        this.model = model;
        this.description = description;
        this.campusName = campusName;
        this.buildingName = buildingName;
        this.roomNumber = roomNumber;
        this.status = status;
        this.updatedAt = updatedAt || new Date();
        this.createdAt = createdAt || new Date();
    }
  }
  
export default Printer;