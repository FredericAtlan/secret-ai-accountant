import React, { useState } from 'react'
import FileUpload from './FileUpload'
import PDFViewer from './PDFViewer'
import ocrService from './OCRService'
import logo from './assets/luxury-real-estate-logo.png' // Make sure this path is correct
import {
  User, // User icon
  LogOut, // LogOut icon
  Wallet, // Wallet icon
  FileUp,
  FileSearch,
  Fingerprint,
  FileText,
  Edit,
  CheckCircle,
  XCircle,
  FileSignature,
  Share2,
  RotateCcw,
  Zap,
} from 'lucide-react'

const apiInvoiceUrl = 'http://localhost:5000/api/invoice'
const apiCredibilityUrl = 'http://localhost:5000/api/credibility'

interface ApiResponse {
  invoice_number: string
  date: string
  client_name: string
  type: string
  total_amount: number
  tax_amount: number
  currency: string
}

const CompanyScreen: React.FC = () => {
  const [pdfText, setPdfText] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null)
  const [credibilityScore, setCredibilityScore] = useState<number | null>(null)
  const [documentName, setDocumentName] = useState('')
  const [fingerprint, setFingerprint] = useState('')
  const [ocrResults, setOcrResults] = useState('')

  const handleFileChange = (file: File) => {
    setUploadedFile(file)
    setDocumentName(file.name) // Set the document name when a file is uploaded
  }

  const extractText = async () => {
    if (!uploadedFile) return
    try {
      const text = await ocrService.extractTextFromPDF(uploadedFile)
      setPdfText(text)
      setOcrResults(text) // Set OCR results
    } catch (error) {
      console.error('Error extracting text:', error)
    }
  }

  const callApi = async () => {
    if (!pdfText) return
    try {
      const response = await fetch(apiInvoiceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: pdfText,
        }),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const result: ApiResponse = await response.json()
      setApiResponse(result)
      // Assuming the API response contains a 'fingerprint' field
      if (result) {
        setFingerprint('fakehash' + result.invoice_number)
      }
    } catch (error) {
      console.error('Error calling API:', error)
    }
  }

  const callCredibilityApi = async () => {
    if (!pdfText || !apiResponse) return
    try {
      const response = await fetch(apiCredibilityUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoice: pdfText,
          accounting_row: apiResponse,
        }),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const result = await response.json()
      setCredibilityScore(result.credibility)
      console.log('Credibility API response:', result)
    } catch (error) {
      console.error('Error calling credibility API:', error)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof ApiResponse
  ) => {
    if (apiResponse) {
      setApiResponse({
        ...apiResponse,
        [field]: e.target.value,
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col w-full">
      {/* Sidebar */}
      <div className="flex h-screen">
        <aside className="bg-gray-800 text-white w-64 p-4">
          <div className="flex items-center mb-6">
            <span className="text-xl font-bold">S Tool Name</span>
          </div>
          <ul>
            <li className="mb-2">
              <a href="#" className="flex items-center text-gray-300 hover:text-white">
                <span className="mr-2">
                  <User />
                </span>
                Company Screen
              </a>
            </li>
            <li className="mb-2">
              <a href="/auditor" className="flex items-center text-gray-300 hover:text-white">
                <span className="mr-2">
                  <LogOut />
                </span>
                Auditor Screen
              </a>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <img src={logo} alt="Company Logo" className="h-12 w-auto mr-4" />
              <div className="bg-gray-200 p-2 rounded-md">
                Global Credibility Score: <span className="font-bold text-green-500">87%</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-4">Oscar Davis</span>
              <div className="bg-gray-200 p-2 rounded-full">
                <Wallet />
              </div>
              <span className="ml-2 text-sm">Wallet Connected</span>
            </div>
          </div>

          {/* Upload Document Section */}
          <section className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold mb-4">Upload Document</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FileUpload onFileChange={handleFileChange} />
                {uploadedFile && (
                  <button
                    onClick={extractText}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 flex items-center"
                  >
                    <FileUp className="mr-2" />
                    Extract and View
                  </button>
                )}
              </div>
              <div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="document">
                    Document
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="document"
                      value={documentName}
                      onChange={(e) => setDocumentName(e.target.value)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="/path/Document name"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FileSearch className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fingerprint">
                    Fingerprint
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="fingerprint"
                      value={fingerprint}
                      readOnly
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Hash"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Fingerprint className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ocr">
                    OCR
                  </label>
                  <div className="relative">
                    <textarea
                      id="ocr"
                      value={ocrResults}
                      readOnly
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
                      placeholder="OCR Results"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none top-0">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Automatic Secured Ledger Section */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Automatic Secured Ledger</h2>
            <div className="flex items-center justify-between mb-4">
              <div>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center mr-2">
                  <Edit className="mr-2" />
                  Edit
                </button>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center mr-2">
                  <CheckCircle className="mr-2" />
                  Approve
                </button>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center mr-2">
                  <XCircle className="mr-2" />
                  Delete line
                </button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center mr-2">
                  <FileSignature className="mr-2" />
                  SEAL in BC
                </button>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                  <Share2 className="mr-2" />
                  Share with Auditor
                </button>
              </div>
              <div className="flex items-center">
                <span className="mr-2">AI LLM Credibility</span>
                <div className="bg-gray-200 rounded-full h-6 w-24 flex items-center justify-center">
                  <span className="text-white font-bold">54%</span>
                </div>
              </div>
            </div>

            {/* Ledger Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Selection
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Company Wallet
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Accounting Line ID
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Ref.
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Supplier
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Amount (Excl. Tax)
                    </th>
                    {/* Add more headers as needed */}
                  </tr>
                </thead>
                <tbody>
                  {apiResponse && (
                    <tr>
                      <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                        <input type="checkbox" className="form-checkbox" />
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                        {/* Replace with actual wallet data */}
                        Wallet
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                        {apiResponse.invoice_number}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                        {apiResponse.date}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                        {/* Replace with actual ref data */}
                        FA-001
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                        {apiResponse.client_name}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                        {apiResponse.type}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                        {apiResponse.total_amount}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center mt-4">
              <RotateCcw className="animate-spin" />
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default CompanyScreen
