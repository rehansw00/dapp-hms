"use client"
import { useState } from 'react'
import { uploadToIPFS, retrieveFromIPFS } from '@/lib/ipfs'
import { toast } from 'sonner'

export function ProfileSection() {
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [ipfsHash, setIpfsHash] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setProfileImage(file)
    const reader = new FileReader()
    reader.onload = () => setImageUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  const uploadProfileImage = async () => {
    if (!profileImage) return
    
    setIsLoading(true)
    try {
      const cid = await uploadToIPFS(profileImage)
      setIpfsHash(cid)
      toast.success('Profile image uploaded successfully')
      // Save the CID to your database here
    } catch (error) {
      toast.error('Failed to upload profile image')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const retrieveProfileImage = async () => {
    if (!ipfsHash) return
    
    try {
      const data = await retrieveFromIPFS(ipfsHash)
      const blob = new Blob([data])
      setImageUrl(URL.createObjectURL(blob))
    } catch (error) {
      toast.error('Failed to retrieve profile image')
      console.error(error)
    }
  }

  return (
    <div className="border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Doctor Profile</h2>
      
      <div className="space-y-4">
        {imageUrl && (
          <div className="flex justify-center">
            <img 
              src={imageUrl} 
              alt="Profile preview" 
              className="h-32 w-32 rounded-full object-cover"
            />
          </div>
        )}

        <div>
          <label className="block mb-2 text-sm font-medium">Profile Image</label>
          <input 
            type="file" 
            onChange={handleImageChange}
            accept="image/*"
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          <button 
            onClick={uploadProfileImage}
            disabled={isLoading || !profileImage}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Uploading...' : 'Upload Profile Image'}
          </button>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Retrieve Profile</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={ipfsHash}
              onChange={(e) => setIpfsHash(e.target.value)}
              placeholder="Enter IPFS CID"
              className="flex-1 border rounded px-3 py-2 text-sm"
            />
            <button 
              onClick={retrieveProfileImage}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Retrieve
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}