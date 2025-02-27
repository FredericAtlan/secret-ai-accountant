import React from 'react'

const AuditorScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Auditor Screen</h1>
        <p>This is the auditor screen where auditors can verify transactions and check document integrity.</p>
      </div>
    </div>
  )
}

export default AuditorScreen
