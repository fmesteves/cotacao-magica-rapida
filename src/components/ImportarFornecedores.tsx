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
  Building2,
} from 'lucide-react';
import { Button } from './ui/button';

const SupplierExcelUploadComponent = ({
  handleImport,
}: {
  handleImport: (fornecedoresImportados: any[]) => void;
}) => {
  const [files, setFiles] = useState([]);
  const [processedFiles, setProcessedFiles] = useState([]);
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


  // here i need to avoid the field when its: "": "
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
            blankrows: false
          });
          
          if (jsonData.length > 0) {
            // Get headers from first row
            const headers = jsonData[0];
            
            // Convert rows to objects
            const processedData = jsonData.slice(1).map(row => {
              const obj = {};
              headers.forEach((header, index) => {
                // Clean header names and handle special cases
                const cleanHeader = header.toString().trim();
                
                // Map specific headers to match supplier data structure
                const headerMapping = {
                  'RAZAO_SOCIAL': 'razao_social',
                  'RAZÃO_SOCIAL': 'razao_social',
                  'CNPJ': 'cnpj',
                  'EMAIL': 'email',
                  'E-MAIL': 'email',
                  'UF': 'uf',
                  'COD_SAP': 'cod_sap',
                  'COD SAP': 'cod_sap',
                  'CODIGO_SAP': 'cod_sap',
                  'COD_GRUPO_MERCADORIA': 'cod_grupo_mercadoria',
                  'COD GRUPO MERCADORIA': 'cod_grupo_mercadoria',
                  'GRUPO_MERCADORIA': 'grupo_mercadoria',
                  'GRUPO MERCADORIA': 'grupo_mercadoria',
                  'FAMILIA': 'familia',
                  'FAMÍLIA': 'familia'
                };
                
                const mappedHeader = headerMapping[cleanHeader] || cleanHeader.toLowerCase();
                
                // Handle different data types
                let value = row[index] || '';
                
                // Convert numeric fields
                if (['cod_sap'].includes(mappedHeader)) {
                  value = value ? value.toString().trim() : '';
                }
                
                // Clean CNPJ format
                if (mappedHeader === 'cnpj' && value) {
                  value = value.toString().trim();
                }
                
                // Clean email format
                if (mappedHeader === 'email' && value) {
                  value = value.toString().trim().toLowerCase();
                }
                
                // Clean UF format
                if (mappedHeader === 'uf' && value) {
                  value = value.toString().trim().toUpperCase();
                }
                
                // Clean text fields
                if (['razao_social', 'grupo_mercadoria', 'familia'].includes(mappedHeader) && value) {
                  value = value.toString().trim();
                }
                
                // SOLUTION: Only add the property if the value is not empty
                // if (value !== '' && value !== null && value !== undefined) {
                  obj[mappedHeader] = value;
                // }
              });
              return obj;
            });
            
            resolve({
              fileName: file.name,
              data: processedData,
              recordCount: processedData.length
            });
          } else {
            reject(new Error('The Excel file appears to be empty'));
          }
        } catch (parseError) {
          reject(new Error('Error parsing Excel file. Please check the file format.'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading the file'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  };

  const processAllFiles = async (files: any[]) => {
    if (files.length === 0) return;

    setLoading(true);
    setError('');

    try {
      const results = await Promise.all(
        files.map((file) => processExcelFile(file))
      );

      setProcessedFiles(results);
      setSuccess(true);
      console.log('All processed supplier files:', results);
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

  const getTotalRecords = () => {
    return processedFiles.reduce((total, file) => total + file.recordCount, 0);
  };

  return (
    <div className="max-w-full overflow-hidden flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Building2 className="text-blue-600" />
        Importar Fornecedores
      </h2>

      {/* File Upload Section */}
      <div className="">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="">
            <label htmlFor="supplier-file-input" className="cursor-pointer">
              <span className="text-lg font-medium text-gray-700">
                Escolha arquivos Excel de fornecedores ou arraste e solte
              </span>
              <input
                id="supplier-file-input"
                type="file"
                accept=".xlsx,.xls"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-sm text-gray-500">
            Importe dados de fornecedores com as colunas:{'\n'} RAZAO_SOCIAL,
            CNPJ, EMAIL, UF, COD_SAP, COD_GRUPO_MERCADORIA, GRUPO_MERCADORIA,
            FAMILIA
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Processed Files Results */}
      <div className="flex flex-1 overflow-hidden w-full">
        {processedFiles.length > 0 && (
          <div className="flex flex-col flex-1 w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Arquivos Processados ({processedFiles.length})
            </h3>

            <div className="space-y-4 h-auto overflow-auto w-full">
              {processedFiles.map((fileData, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {fileData.fileName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {fileData.recordCount} fornecedores
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
                            Visualizar
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {expandedFiles.has(index) && (
                    <div className="p-4">
                      {/* Table Preview */}
                      <div className="overflow-x-auto border rounded-lg">
                        <table className="min-w-full bg-white">
                          <thead className="bg-gray-50">
                            <tr>
                              {Object.keys(fileData.data[0] || {}).map(
                                (key) => (
                                  <th
                                    key={key}
                                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                                  >
                                    {key}
                                  </th>
                                )
                              )}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {fileData.data.map((row, rowIndex) => (
                              <tr key={rowIndex} className="hover:bg-gray-50">
                                {Object.values(row).map((value, cellIndex) => (
                                  <td
                                    key={cellIndex}
                                    className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 border-b"
                                  >
                                    {value?.toString() || ''}
                                  </td>
                                ))}
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
        )}
      </div>

      <div className="flex justify-end">
        <Button
          disabled={loading || processedFiles.length === 0}
          onClick={() => handleImport(processedFiles)}
        >
          {loading ? 'Importando...' : 'Importar'}
        </Button>
      </div>
    </div>
  );
};

export default SupplierExcelUploadComponent;
