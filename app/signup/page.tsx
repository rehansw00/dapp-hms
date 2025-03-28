"use client"

import { useState, useEffect } from "react"

declare global {
  interface Window {
    ethereum?: any
  }
}
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignupPage() {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState<boolean>(false)
  const [account, setAccount] = useState<string | null>(null)
  const [isRegistering, setIsRegistering] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
  })
  const router = useRouter()

  useEffect(() => {
    // Check if MetaMask is installed
    if (typeof window !== "undefined" && window.ethereum) {
      setIsMetaMaskInstalled(true)
    }
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        if (accounts.length > 0) {
          setAccount(accounts[0])
        }
      }
    } catch (err: any) {
      console.error("Error connecting to MetaMask", err)
      setError(err.message || "Failed to connect to MetaMask")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsRegistering(true)
    setError(null)

    try {
      if (!account) {
        throw new Error("Please connect your MetaMask wallet first")
      }

      // Here you would typically:
      // 1. Call your smart contract to register the patient
      // 2. Store additional patient data in your backend/IPFS
      
      // For demo, we'll simulate a successful registration
      setTimeout(() => {
        router.push("/dashboard/patient")
      }, 1000)
    } catch (err: any) {
      console.error("Error registering patient", err)
      setError(err.message || "Failed to register patient")
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Patient Registration</CardTitle>
          <CardDescription className="text-center">
            Sign up as a new patient on MediChain
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wallet">Wallet Connection</Label>
              {!isMetaMaskInstalled ? (
                <div className="text-center p-4">
                  <p className="mb-4">MetaMask is not installed. Please install MetaMask to continue.</p>
                  <Button asChild>
                    <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer">
                      Install MetaMask
                    </a>
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  onClick={connectWallet}
                  disabled={!!account}
                  className="w-full"
                >
                  {account ? "Wallet Connected" : "Connect Wallet"}
                </Button>
              )}
              {account && (
                <p className="text-sm text-muted-foreground truncate text-center">
                  {account.substring(0, 6)}...{account.substring(account.length - 4)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={handleInputChange}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!account || isRegistering}
            >
              {isRegistering ? "Registering..." : "Register"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
