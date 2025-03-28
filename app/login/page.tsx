"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

declare global {
  interface Window {
    ethereum?: any
  }
}
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState<boolean>(false)
  const [account, setAccount] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if MetaMask is installed
    if (typeof window !== "undefined" && window.ethereum) {
      setIsMetaMaskInstalled(true)
    }
  }, [])

  const connectWallet = async () => {
    setIsConnecting(true)
    setError(null)

    try {
      if (window.ethereum) {
        // Request account access
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })

        if (accounts.length > 0) {
          setAccount(accounts[0])

          // In a real app, you would verify the role here from your smart contract
          // For demo purposes, we'll use a timeout to simulate contract interaction
          setTimeout(() => {
            // Redirect based on role (this would be determined by your contract)
            const path = "/dashboard/patient" // or "/dashboard/doctor" or "/dashboard/admin"
            router.push(path)
          }, 1000)
        }
      }
    } catch (err: any) {
      console.error("Error connecting to MetaMask", err)
      setError(err.message || "Failed to connect to MetaMask")
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login to MediChain</CardTitle>
          <CardDescription className="text-center">
            Connect with MetaMask to access the hospital management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="metamask" className="w-full">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="metamask">MetaMask Authentication</TabsTrigger>
            </TabsList>
            <TabsContent value="metamask" className="mt-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

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
                <div className="flex flex-col items-center gap-4 p-4">
                  <img src="/placeholder.svg?height=80&width=80" alt="MetaMask" className="h-20 w-20" />
                  <Button onClick={connectWallet} disabled={isConnecting || !!account} className="w-full">
                    {isConnecting ? "Connecting..." : account ? "Connected" : "Connect with MetaMask"}
                  </Button>
                  {account && (
                    <p className="text-sm text-muted-foreground truncate w-full text-center">
                      Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}
                    </p>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            New patient?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up here
            </Link>
          </p>
          <p className="text-sm text-muted-foreground">Secure blockchain authentication powered by Ethereum</p>
        </CardFooter>
      </Card>
    </div>
  )
}

