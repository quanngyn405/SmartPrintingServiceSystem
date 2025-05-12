import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from 'react-pdf';
import NavigationBar from "../../component/NavigationBar";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "./PrintConfig.css";
import "./DocxViewer.css"; 

import mammoth from "mammoth";


pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;


const studentInfo = localStorage.getItem("studentInfo");



function PrintConfig() {
  const location = useLocation();
  const navigate = useNavigate();
  const file = location.state.file || {};
  const fileName = file.filename;

  const [copies, setCopies] = useState(1);
  const [paperSize, setPaperSize] = useState("A4");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [docxContent, setDocxContent] = useState(null);


  const [printers, setPrinters] = useState([]);
  
  const [selectedPrinter, setSelectedPrinter] = useState(null);
  const [defaultPrintConfig, setDefaultPrintConfig] = useState(null);
  const [selectedPrintConfig, setSelectedPrintConfig] = useState(null);
  const currentPages = JSON.parse(studentInfo).page_balance;

  


  useEffect(() => {
      const fetchPrintersAndConfig = async () => {
      try{
        const printersResponse = await fetch('http://localhost:5000/api/printers');
        const printersData = await printersResponse.json();
        const availablePrintersData = printersData.filter(printerData => printerData.status === 'enabled');
        setPrinters(availablePrintersData);
  
        const configResponse = await fetch('http://localhost:5000/api/print-config/default');
        const configData = await configResponse.json();
        setDefaultPrintConfig(configData);


        setSelectedPrintConfig({
          paper_size: configData.paper_size,
          pages_to_print: configData.pages_to_print,
          number_of_copies: configData.number_of_copies,
          duplex: configData.duplex
        });
      }catch(error){
        console.error("Error fetching data: ", error);
        setError("Failed to load printer and default config")
      }
    };
    fetchPrintersAndConfig();

  }, []);


  const isDefaultConfig = () => {
    if (!defaultPrintConfig || !selectedPrintConfig) return true;
    return (
      selectedPrintConfig.paper_size === defaultPrintConfig.paper_size &&
      selectedPrintConfig.pages_to_print === defaultPrintConfig.pages_to_print &&
      selectedPrintConfig.number_of_copies === defaultPrintConfig.number_of_copies &&
      selectedPrintConfig.duplex === defaultPrintConfig.duplex
    );
  };

  const calculatePage = () => {
    if (!selectedPrintConfig){
      return 0;
    }
    const totalDocumentPages  = file.number_of_pages;
    const numberOfCopies = selectedPrintConfig.number_of_copies
    const pagesToPrint = selectedPrintConfig.pages_to_print;
    const duplex = selectedPrintConfig.duplex === '2-sided' ;
    const paperSizeA3 = selectedPrintConfig.paper_size === 'A3';
    let finalTotalPageToPrint = 0;

    if (pagesToPrint === "all") {
      finalTotalPageToPrint =  totalDocumentPages * numberOfCopies;
    } else if (pagesToPrint === "odd") {
      const oddPages = Math.ceil(totalDocumentPages / 2);
      finalTotalPageToPrint =  oddPages * numberOfCopies;
    } else if (pagesToPrint === "even") {
      const evenPages = Math.floor(totalDocumentPages / 2);
      finalTotalPageToPrint =  evenPages * numberOfCopies;
    } 
    if (duplex){
      finalTotalPageToPrint = Math.ceil(finalTotalPageToPrint / 2)
    }
    if(paperSizeA3){
      finalTotalPageToPrint = Math.ceil(finalTotalPageToPrint * 2)
    }
    return finalTotalPageToPrint;
  }

  

  

  const getFileType = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    return extension;
  }
  const loadDocxContent = async(filePath) => {
    try{
      const response = await fetch(filePath);
      const blob = await response.blob();
      
      
      const arrayBuffer = await blob.arrayBuffer();

      const result = await mammoth.convertToHtml({ arrayBuffer }, {
        styleMap: [
          "p[style-name='Section Title'] => h1:fresh",
          "p[style-name='Subsection Title'] => h2:fresh"
          ]
        });
        setDocxContent(result.value);
        setIsLoading(false);
    }catch(error){
      setError("Error loading docx content" + error.message);
      setIsLoading(false);
    }
  }

  const renderReview = ()  => {
    if(isLoading){
      return <div className="loading"> Loading document...</div>
    }

    if (error){
      return <div className="error">{error}</div>
    }

    const fileType = getFileType(fileName);
    switch(fileType){
      case 'pdf':
        return (
          <iframe
            src={file.file_path}
            title="PDF Preview"
            width="100%"
            height="600px"
            style={{ border: 'none' }}
          />
        )
      case 'docx':
        return (
          <div className="docx-viewer">
            <div 
              className="docx-content"
              dangerouslySetInnerHTML={{ __html: docxContent }}
            />
          </div>
        )
        default:
          return <div>Unsupported file type</div>;
    }
  }
  useEffect(() => {
      if (file.file_path) {
        const fileType = getFileType(file.filename);
        if (fileType === 'docx') {
          loadDocxContent(file.file_path);
        } else {
          setIsLoading(false);
        }
      }
  }, [file.file_path]);


 

  const handleCancel = () => {
    navigate("/Print");
  };

  const handlePrint = async () => {
      console.log("Remaining Pages: ", calculatePage());
      if (currentPages -  calculatePage() < 0) {
        toast.error("Your account doesn't have enough pages!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }

      if (!selectedPrinter || !selectedPrintConfig) {
        toast.error("Please select a printer or a print configuration setting")
        return;
      }


      try{
        const printJobData = {
            student_id: JSON.parse(studentInfo).student_id,
            printer_id: parseInt(selectedPrinter.printer_id),
            file_ids: [file.file_id],
            total_page_cost: calculatePage(),
        }

        if (isDefaultConfig()){
          printJobData.print_config_id = 1
        }else{
          printJobData.printer_config_id = {
            paper_size: selectedPrintConfig.paper_size,
            pages_to_print: selectedPrintConfig.pages_to_print,
            number_of_copies: selectedPrintConfig.number_of_copies,
            duplex: selectedPrintConfig.duplex === "2-sided"
          }
        }


        
        navigate("/Print/PrintConfirm", {
            state: {
              printJobData,
              file,
              fileName,
              copies: selectedPrintConfig.number_of_copies,
              paperSize: selectedPrintConfig.paper_size,
              totalPages: calculatePage(),
              remainingPages: currentPages - calculatePage(),
              locationToGetFile: `${selectedPrinter.campus_name} ${selectedPrinter.building_name}-${selectedPrinter.room_number}`
            }
          });

      }catch(error){
        toast.error("Error submitting print job");
        console.error(error);
      }
    }
  const handlePrinterChange = (e) => {
    const printerId = parseInt(e.target.value);
    const printer = printers.find(p => p.printer_id === printerId);
    setSelectedPrinter(printer);
  };

  const handleConfigChange = (field, value) =>{
    setSelectedPrintConfig(prev => ({
      ...prev,
      [field]: value
    }));
  }



  return (
    <>
      <NavigationBar />
      <ToastContainer />
      <div className="print-config-container">
        <div className="left-panel">
          <h3>Print Setup</h3>
          <div className="option">
            <label>Printer:</label>
            <select value={selectedPrinter?.printer_id || ''} onChange={handlePrinterChange}>
              <option value = ''>Select Printer</option>
              {printers.map((printer) => (
                <option
                  key = {printer.printer_id}
                  value = {printer.printer_id}
                >
                  {printer.printer_name} - {printer.campus_name} {printer.building_name}-{printer.room_number}
                </option>
              ))}
            </select>
          </div>

          <div className="option">
            <label>Page Range:</label>
            <select
              value = {selectedPrintConfig?.pages_to_print  || 'all'}
              onChange={(e) => handleConfigChange('pages_to_print', e.target.value)}
            >
              <option value='all'>All Pages</option>
              <option value='even'>Even Pages</option>
              <option value='odd'>Odd Pages</option>
            </select>
          </div>


          <div className="option">
            <label>Paper Size:</label>
            <select
             value={selectedPrintConfig?.paper_size || 'A4'} 
             onChange={(e) => handleConfigChange('paper_size', e.target.value)}
            >
              <option value='A4'>A4</option>
              <option value='A3'>A3</option>
            </select>
          </div>



          <div className="option">
            <label>Print Side:</label>
            <select
              value={selectedPrintConfig?.duplex  || '2-sided'}
              onChange={(e) => handleConfigChange('duplex', e.target.value)}
            >
              <option value='1-sided'>Single-sided</option>
              <option value='2-sided'>Double-sided</option>
            </select>
          </div>


          <div className="option">
            <label>Copies:</label>
            <input className="copies"
              type="number"
              min="1"
              value={selectedPrintConfig?.number_of_copies > 0? selectedPrintConfig?.number_of_copies : 0 || 1}
              onChange={(e) => handleConfigChange('number_of_copies', e.target.value)}
            />
          </div>



          <div className="status">
            <div className="current">Current A4 Pages: <span className="currentpage">{currentPages}</span></div>
            <div className="current">Page to pay:<span className="currentPage">{calculatePage()}</span></div>

            <div style={{ color: currentPages - calculatePage() < 0 ? "red" : "black" }}>
              Remaining Pages: <span className="remainpage">{currentPages - calculatePage()}</span>
            </div>
          </div>
          <div className="buttons">
            <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
            <button className="print-btn" onClick={handlePrint}>Print</button>
          </div>
        </div>
        <div className="right-panel">
          <h3>Preview</h3>
          <div className="pdf-preview">
          {renderReview()}
          </div>
        </div>
      </div>
    </>
  );
}

export default PrintConfig;