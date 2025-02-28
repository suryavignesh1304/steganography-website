import type React from "react"
import { Link } from "react-router-dom"

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Steganography Website</h1>
      <p className="text-gray-700 mb-8">Hide and extract your details securely in an image.</p>
      <div className="flex gap-4">
        <Link to="/steganography" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
          Hide Data
        </Link>
        <Link to="/degenerate" className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">
          Extract Data
        </Link>
      </div>
    </div>
  )
}

export default Home

