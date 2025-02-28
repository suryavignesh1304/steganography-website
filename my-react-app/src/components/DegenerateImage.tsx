"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const DegenerateImage: React.FC = () => {
  const [image, setImage] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData()
    if (image) formData.append("image", image)

    try {
      const response = await fetch("http://localhost:5000/api/extract-data", {
        method: "POST",
        body: formData,
      })
      const result = await response.json()
      if (result.success) {
        navigate("/extracted-data", { state: { data: result.data, imageName: image?.name } })
      } else {
        alert("Failed to extract data: " + (result.message || "Unknown error"))
      }
    } catch (error) {
      console.error("Error:", error)
      alert("An error occurred while processing your request.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Extract Hidden Data</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Upload Steganographic Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          {image && (
            <div className="mt-4 p-2 border rounded">
              <p className="text-sm text-gray-600">Selected: {image.name}</p>
            </div>
          )}
        </div>
        <button
          type="submit"
          className={`w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={isLoading}
        >
          {isLoading ? "Extracting..." : "Extract Data"}
        </button>
      </form>
    </div>
  )
}

export default DegenerateImage

