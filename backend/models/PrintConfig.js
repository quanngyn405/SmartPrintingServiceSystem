class PrintConfig {
    constructor({ 
        print_config_id = null, 
        paper_size = 'A4', 
        pages_to_print = 'all', 
        number_of_copies = 1, 
        duplex = false, 
        create_at = new Date() 
    }) {
        this.print_config_id = print_config_id;
        this.paper_size = paper_size;
        this.pages_to_print = pages_to_print;
        this.number_of_copies = number_of_copies;
        this.duplex = duplex;
        this.create_at = create_at;
    }

    static createDefault() {
        return new PrintConfig({
            paper_size: 'A4',
            pages_to_print: 'all',
            number_of_copies: 1,
            duplex: false
        });
    }
}
export default PrintConfig;