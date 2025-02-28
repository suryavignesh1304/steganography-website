import type React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./components/Home"
import SteganographyForm from "./components/SteganographyForm"
import DegenerateImage from "./components/DegenerateImage"
import ExtractedDataScreen from "./components/ExtractedDataScreen"

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/steganography" element={<SteganographyForm />} />
        <Route path="/degenerate" element={<DegenerateImage />} />
        <Route path="/extracted-data" element={<ExtractedDataScreen />} />
      </Routes>
    </Router>
  )
}

export default App

