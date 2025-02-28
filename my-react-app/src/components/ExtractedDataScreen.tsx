import type React from "react"
import { useLocation, useNavigate } from "react-router-dom"

const ExtractedDataScreen: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { data, imageName } = location.state as { data: string; imageName?: string }

  // Parse the data to display in a structured format
  const parseData = (data: string) => {
    const lines = data.split("\n")
    const parsedData: Record<string, string> = {}

    lines.forEach((line) => {
      const [key, value] = line.split(": ")
      if (key && value) {
        parsedData[key.trim()] = value.trim()
      }
    })

    return parsedData
  }

  const parsedData = parseData(data)

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">Extracted Data</h1>

        {imageName && (
          <div className="mb-4 p-2 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Source: {imageName}</p>
          </div>
        )}

        <div className="space-y-4">
          {Object.entries(parsedData).map(([key, value], index) => (
            <div key={index} className="border-b pb-2">
              <p className="font-semibold text-gray-700">{key}</p>
              <p className="text-gray-800">{key.toLowerCase() === "password" ? "••••••••" : value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={() => navigate("/degenerate")}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Extract Another
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExtractedDataScreen

