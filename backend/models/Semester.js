class Semester {
    constructor({
        allocationId,
        semesterName,
        createAt,
        startDate,
        endDate,
        pageAllocated
    }){
        this.allocationId = allocationId
        this.semesterName = semesterName
        this.createAt = createAt
        this.startDate = startDate
        this.endDate = endDate
        this.pageAllocated = pageAllocated
    }
}

export default Semester;