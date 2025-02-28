"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const SteganographyForm: React.FC = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [outputImage, setOutputImage] = useState<string | null>(null)
  const [downloadEnabled, setDownloadEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData()
    formData.append("username", username)
    formData.append("email", email)
    formData.append("password", password)
    if (image) formData.append("image", image)

    try {
      const response = await fetch("http://localhost:5000/api/hide-data", {
        method: "POST",
        body: formData,
      })
      const result = await response.json()
      if (result.success) {
        setOutputImage(result.output_image)
        setDownloadEnabled(true)
      } else {
        alert("Failed to hide data: " + (result.message || "Unknown error"))
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
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Hide Your Data</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Hide Data"}
        </button>
        {outputImage && (
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Data Hidden Successfully!</h2>
            <div className="border p-4 rounded-lg mb-4">
              <img
                src={`http://localhost:5000${outputImage}`}
                alt="Steganographic Image"
                className="max-w-full h-auto"
              />
            </div>
            <a
              href={`http://localhost:5000${outputImage}`}
              download="output_image.png"
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 inline-block"
            >
              Download Image
            </a>
          </div>
        )}
      </form>
    </div>
  )
}

export default SteganographyForm

