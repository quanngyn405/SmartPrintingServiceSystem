class PrintJob{
    constructor(builder) {
        this.printJobId = builder.printJobId;
        this.printConfigId = builder.printConfigId;
        this.printerId = builder.printerId;
        this.studentId = builder.studentId;
        this.submitTime = builder.submitTime;
        this.totalPrintedSide = builder.totalPrintedSide;
        this.printStartTime = builder.printStartTime;
        this.printEndTime = builder.printEndTime;
        this.status = builder.status;
    }
    static get Builder() {
        class Builder {
            constructor(){
                this.status = "Pending";
            }
            
            setPrintConfigId(printConfigId) {
                this.printConfigId = printConfigId;
                return this;
            }
            setPrinterId (printerId){
                this.printerId = printerId;
                return this
            }

            setStudentId(studentId){
                this.studentId = studentId
                return this;
            }

            setTotalPrintedSide(totalPrintedSide){
                this.totalPrintedSide = totalPrintedSide;
                return this;
            }
            setSubmitTime(submitTime){
                this.submitTime = submitTime;
                return this;
            }
            build(){
                return new PrintJob(this);
            }
        }

        return Builder();
    }
}

export default PrintJob;