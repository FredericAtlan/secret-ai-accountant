import React from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import CompanyScreen from './CompanyScreen'
import AuditorScreen from './AuditorScreen'

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <nav className="bg-gray-800 text-white py-4">
          <ul className="flex justify-around">
            <li>
              <Link to="/" className="hover:text-gray-300">Company Screen</Link>
            </li>
            <li>
              <Link to="/auditor" className="hover:text-gray-300">Auditor Screen</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<CompanyScreen />} />
          <Route path="/auditor" element={<AuditorScreen />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
