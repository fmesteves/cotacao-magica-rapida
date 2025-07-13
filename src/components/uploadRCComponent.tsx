import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import {
  Upload,
  FileSpreadsheet,
  Check,
  X,
  Download,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const ExcelUploadComponent = ({
  processedFiles,
  setProcessedFiles,
}: {
  processedFiles: any[];
  setProcessedFiles: (files: any[]) => void;
}) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [expandedFiles, setExpandedFiles] = useState(new Set());

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);

    const validFiles = selectedFiles.filter((file) => {
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'application/vnd.ms-excel.sheet.macroEnabled.12',
      ];

      return (
        validTypes.includes(file.type) ||
        file.name.endsWith('.xlsx') ||
        file.name.endsWith('.xls')
      );
    });

    if (validFiles.length !== selectedFiles.length) {
      setError(
        `${
          selectedFiles.length - validFiles.length
        } file(s) were skipped. Please select only Excel files (.xlsx or .xls)`
      );
    } else {
      setError('');
    }

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
      setSuccess(false);

      processAllFiles(validFiles);
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    setProcessedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );

    // Remove from expanded files if it was expanded
    setExpandedFiles((prev) => {
      const newSet = new Set(prev);
      newSet.delete(indexToRemove);
      // Adjust indices for remaining files
      const adjustedSet = new Set();
      newSet.forEach((index) => {
        if (index > indexToRemove) {
          adjustedSet.add(index - 1);
        } else if (index < indexToRemove) {
          adjustedSet.add(index);
        }
      });
      return adjustedSet;
    });
  };

  const processExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });

          // Get the first worksheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          // Convert to JSON with header row
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: '',
            blankrows: false,
          });

          if (jsonData.length > 0) {
            // Get headers from first row
            const headers = jsonData[0];

            // Convert rows to objects
            const processedData = jsonData.slice(1).map((row) => {
              const obj = {};
              headers.forEach((header, index) => {
                // Clean header names and handle special cases
                let cleanHeader = header.toString().trim();

                // Map specific headers to match your data structure
                const headerMapping = {
                  NUM_REC: 'NUM_REC',
                  NUM_ITEM_RC: 'NUM_ITEM_RC',
                  'GRUPO\nCOMPRADOR': 'GRUPO_COMPRADOR',
                  'COD\nMATERIAL': 'COD_MATERIAL',
                  DESC_MATERIAL: 'DESC_MATERIAL',
                  FABRICANTE: 'FABRICANTE',
                  NUMERO_PECA_FABRICANTE: 'NUMERO_PECA_FABRICANTE',
                  'GRUPO MERCADORIA': 'GRUPO_MERCADORIA',
                  QUANTID: 'QUANTID',
                  UND_MED: 'UND_MED',
                  PRECO_REQ: 'PRECO_REQ',
                  UND_PRECO: 'UND_PRECO',
                  CENTRO: 'CENTRO',
                  ENDERECO: 'ENDERECO',
                  CEP: 'CEP',
                  CIDADE: 'CIDADE',
                  UF: 'UF',
                  FAMILIA: 'FAMILIA',
                };

                const mappedHeader = headerMapping[cleanHeader] || cleanHeader;

                // Handle different data types
                let value = row[index] || '';

                // Convert numeric fields
                if (
                  [
                    'NUM_REC',
                    'NUM_ITEM_RC',
                    'COD_MATERIAL',
                    'QUANTID',
                    'UND_PRECO',
                  ].includes(mappedHeader)
                ) {
                  value = value ? Number(value) : null;
                }

                // Handle price field (remove spaces and convert to number)
                if (mappedHeader === 'PRECO_REQ' && value) {
                  value =
                    parseFloat(
                      value.toString().replace(/\s+/g, '').replace(',', '.')
                    ) || 0;
                }

                obj[mappedHeader] = value;
              });
              return obj;
            });

            resolve({
              fileName: file.name,
              data: processedData,
              recordCount: processedData.length,
            });
          } else {
            reject(new Error('The Excel file appears to be empty'));
          }
        } catch (parseError) {
          reject(
            new Error('Error parsing Excel file. Please check the file format.')
          );
        }
      };

      reader.onerror = () => {
        reject(new Error('Error reading the file'));
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const processAllFiles = async (files) => {
    if (files.length === 0) return;

    setLoading(true);
    setError('');

    try {
      const results = await Promise.all(
        files.map((file) => processExcelFile(file))
      );

      setProcessedFiles(results);
      setSuccess(true);
      console.log('All processed files:', results);
    } catch (error) {
      console.error('File processing error:', error);
      setError(error.message || 'Error processing files');
    } finally {
      setLoading(false);
    }
  };

  const toggleFileExpansion = (index) => {
    setExpandedFiles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // const clearAllData = () => {
  //   setFiles([]);
  //   setProcessedFiles([]);
  //   setError('');
  //   setSuccess(false);
  //   setExpandedFiles(new Set());
  //   // Reset file input
  //   const fileInput = document.getElementById('excel-file-input');
  //   if (fileInput) fileInput.value = '';
  // };

  // const getTotalRecords = () => {
  //   return processedFiles.reduce((total, file) => total + file.recordCount, 0);
  // };

  return (
    <Accordion type="multiple" defaultValue={['item-1']}>
      <AccordionItem value="item-1">
        <AccordionTrigger className="hover:bg-gray-100 pr-4 pl-2 hover:no-underline">
          <p className="">Adicione os Arquivos de Requisição</p>
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-4">
            {/* File Upload Section */}
            <div>
              <label htmlFor="excel-file-input" className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="mb-4">
                    <label
                      htmlFor="excel-file-input"
                      className="cursor-pointer"
                    >
                      <input
                        id="excel-file-input"
                        type="file"
                        accept=".xlsx,.xls"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-xl text-gray-800">
                    Escolha arquivos Excel ou arraste e solte na área abaixo
                  </p>
                  <p className="text-sm text-gray-500">
                    Suporta múltiplos arquivos .xlsx e .xls
                  </p>
                </div>
              </label>
            </div>

            {/* Files List */}
            {files.length > 0 && (
              <Accordion type="multiple">
                <AccordionItem
                  value="selected-files"
                  className="border border-gray-200 rounded-sm"
                >
                  <AccordionTrigger className="hover:bg-gray-100 pr-4 pl-2 hover:no-underline">
                    <p className="text-lg font-semibold text-gray-800">
                      Arquivos Selecionados ({files.length})
                    </p>
                  </AccordionTrigger>
                  <AccordionContent className="p-2">
                    <div className="">
                      <div className="space-y-2">
                        {files.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <FileSpreadsheet className="h-5 w-5 text-green-600" />
                              <div>
                                <p className="font-medium text-gray-800">
                                  {file.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {(file.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => removeFile(index)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}
            {processedFiles.length > 0 && (
              <Accordion type="multiple">
                <AccordionItem
                  value="processed-files"
                  className="border border-gray-200 rounded-sm"
                >
                  <AccordionTrigger className="hover:bg-gray-100 pr-4 pl-2 hover:no-underline">
                    <p className="text-lg font-semibold text-gray-800">
                      Arquivos Processados ({processedFiles.length})
                    </p>
                  </AccordionTrigger>
                  <AccordionContent className="p-2">
                    <div className="">
                      <div className="space-y-4">
                        {processedFiles.map((fileData, index) => (
                          <div
                            key={index}
                            className="border rounded-lg overflow-hidden"
                          >
                            <div className="bg-gray-50 p-4 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <FileSpreadsheet className="h-5 w-5 text-green-600" />
                                <div>
                                  <h4 className="font-medium text-gray-800">
                                    {fileData.fileName}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {fileData.recordCount} registros
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => toggleFileExpansion(index)}
                                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                                >
                                  {expandedFiles.has(index) ? (
                                    <>
                                      <EyeOff className="h-3 w-3" />
                                      Ocultar
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="h-3 w-3" />
                                      Ver Detalhes
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                            {expandedFiles.has(index) && (
                              <div className="p-4">
                                {/* Table Preview */}
                                <div className="overflow-x-auto border rounded-lg mb-4">
                                  <table className="min-w-full bg-white">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        {Object.keys(
                                          fileData.data[0] || {}
                                        ).map((key) => (
                                          <th
                                            key={key}
                                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                                          >
                                            {key}
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                      {fileData.data.map((row, rowIndex) => (
                                        <tr
                                          key={rowIndex}
                                          className="hover:bg-gray-50"
                                        >
                                          {Object.values(row).map(
                                            (value, cellIndex) => (
                                              <td
                                                title={value?.toString() || ''}
                                                key={cellIndex}
                                                className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 border-b w-auto max-w-40 text-ellipsis overflow-hidden"
                                              >
                                                {value?.toString() || ''}
                                              </td>
                                            )
                                          )}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ExcelUploadComponent;
