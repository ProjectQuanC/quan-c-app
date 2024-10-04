"use client"

import { useState, useRef } from "react"
import { X, Plus, Upload } from "lucide-react"
import axios from "axios"

function AddChallenge() {
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [points, setPoints] = useState("")
  const [testCases, setTestCases] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [modalMessage, setModalMessage] = useState<string | null>(null) // Modal message
  const [isModalOpen, setIsModalOpen] = useState(false) // Modal state
  const fileInputRef = useRef<HTMLInputElement>(null)

  const accessToken = localStorage.getItem(`${process.env.REACT_APP_TOKEN_NAME}`); // Replace with the actual token

  const handleAddTag = () => {
    setTags([...tags, ""])
  }

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...tags]
    newTags[index] = value
    setTags(newTags)
  }

  const handleRemoveTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index)
    setTags(newTags)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type === "application/zip" || selectedFile.name.endsWith(".zip")) {
        setFile(selectedFile)
        setError(null)
      } else {
        setFile(null)
        setError("Please upload a .zip file only.")
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (parseInt(points) <= 0 || parseInt(testCases) <= 0) {
      setError("Total points and total test cases must be greater than 0.")
      return
    }

    if (!file) {
      setError("Please upload a .zip file.")
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('link', url)
    formData.append('points', points)
    formData.append('total_test_case', testCases)
    tags.forEach(tag => formData.append('tags', tag)) // Correctly append tags
    formData.append('file', file)

    const host_url = process.env.REACT_APP_API_BASE_URL
    let config = {
      method: 'post',
      url: `${host_url}/submitChallenge`, // Update the endpoint as needed
      headers: { 
        'Authorization': `Bearer ${accessToken}`, 
      },
      data: formData
    };

    console.log(config)
    axios.request(config)
      .then((response) => {
        const data = response.data
        setModalMessage("Challenge uploaded successfully!") // Success message
        setIsModalOpen(true) // Show modal
      })
      .catch((error) => {
        console.error("Error:", error)
        const errorMessage = error.response?.data?.message || "An error occurred while uploading the challenge."
        setModalMessage(errorMessage) // Error message
        setIsModalOpen(true) // Show modal
      })
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Upload Challenge</h2>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Challenge Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">Challenge URL</label>
              <input
                id="url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-1">Total Points</label>
              <input
                id="points"
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                min="1"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="testCases" className="block text-sm font-medium text-gray-700 mb-1">Total Test Cases</label>
              <input
                id="testCases"
                type="number"
                value={testCases}
                onChange={(e) => setTestCases(e.target.value)}
                min="1"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <div className="space-y-2">
              {tags.map((tag, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                    placeholder={`Tag ${index + 1}`}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddTag}
              className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Tag
            </button>
          </div>
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">Challenge File (.zip)</label>
            <div className="flex flex-col items-start space-y-2">
              <input
                id="file"
                type="file"
                accept=".zip"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Upload className="h-4 w-4 mr-2" /> Upload .zip
              </button>
              {file && <span className="text-sm text-gray-600">{file.name}</span>}
            </div>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit Challenge
          </button>
        </form>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{modalMessage}</h3>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddChallenge