'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Web3 from 'web3';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function RegisterDoctorPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    licenseNumber: '',
    specialty: '',
    hospital: '',
    walletAddress: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [metamaskConnected, setMetamaskConnected] = useState(false);
  const router = useRouter();

  const connectMetaMask = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not installed');
      }
      
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const web3 = new Web3(window.ethereum);
      const balance = await web3.eth.getBalance(accounts[0]);
      
      setFormData(prev => ({
        ...prev,
        walletAddress: accounts[0]
      }));
      setMetamaskConnected(true);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect MetaMask');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: typeof formData) => ({
      ...prev,
      [name]: value
    }));
  };

  const storeInMongoDB = async (doctorData: any) => {
    try {
      const response = await fetch('/api/doctors/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...doctorData,
          role: 'doctor' // Ensure role is set
        }),
      });
      
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', {
          status: response.status,
          statusText: response.statusText,
          responseText: await response.text()
        });
        throw new Error(`Invalid response from server: ${response.status} ${response.statusText}`);
      }
      
      if (!response.ok) {
        console.error('API Error Details:', {
          status: response.status,
          error: data,
          requestData: doctorData
        });
        throw new Error(data?.message || `Server error: ${response.status}`);
      }
      
      return data;
    } catch (err) {
      console.error('Database Operation Failed:', {
        error: err,
        requestData: doctorData,
        timestamp: new Date().toISOString()
      });
      throw new Error(err instanceof Error ? err.message : 'Failed to store doctor data');
    }
  };

  // Add this type definition right after your imports
  // Update the ContractABI type to include tuple components
  type ContractABI = Array<{
    inputs: {
      internalType: string;
      name: string;
      type: string;
      components?: Array<{
        internalType: string;
        name: string;
        type: string;
      }>;
    }[];
    name: string;
    outputs: {
      internalType: string;
      name: string;
      type: string;
      components?: Array<{
        internalType: string;
        name: string;
        type: string;
      }>;
    }[];
    stateMutability: 'pure' | 'view' | 'nonpayable' | 'payable';
    type: 'function' | 'constructor' | 'event' | 'fallback';
  }>;
  
  // Then update the getDoctor output in the ABI array
  const contractABI: ContractABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_walletAddress",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_licenseNumber",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_specialty",
          "type": "string"
        }
      ],
      "name": "registerDoctor",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_walletAddress",
          "type": "address"
        }
      ],
      "name": "getDoctor",
      "outputs": [
        {
          "internalType": "tuple",
          "name": "",
          "type": "tuple",
          "components": [
            {
              "internalType": "address",
              "name": "walletAddress",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "licenseNumber",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "specialty",
              "type": "string"
            },
            {
              "internalType": "bool",
              "name": "isRegistered",
              "type": "bool"
            }
          ]
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
  
  const storeInBlockchain = async (doctorData: any) => {
    if (!window.ethereum) {
      throw new Error('MetaMask not connected');
    }
    
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    
    const contractABI: ContractABI = [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_walletAddress",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "_licenseNumber",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_specialty",
            "type": "string"
          }
        ],
        "name": "registerDoctor",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_walletAddress",
            "type": "address"
          }
        ],
        "name": "getDoctor",
        "outputs": [
          {
            "internalType": "tuple",
            "name": "",
            "type": "tuple",
            "components": [
              {
                "internalType": "address",
                "name": "walletAddress",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "licenseNumber",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "specialty",
                "type": "string"
              },
              {
                "internalType": "bool",
                "name": "isRegistered",
                "type": "bool"
              }
            ]
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ];
    
    // Get this address from Ganache after deployment
    const contractAddress = '0xYourContractAddressFromGanache'; 
    
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    await contract.methods.registerDoctor(
      doctorData.walletAddress,
      doctorData.licenseNumber,
      doctorData.specialty
    ).send({ from: accounts[0] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form data
      if (!formData.name || !formData.email || !formData.password || 
          !formData.licenseNumber || !formData.walletAddress) {
        throw new Error('Please fill all required fields and connect MetaMask');
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      if (formData.password.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }

      // Store in MongoDB
      const mongoResponse = await storeInMongoDB(formData);
      
      // Store in Blockchain
      await storeInBlockchain(formData);
      
      // Redirect after successful registration
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">Doctor Registration</h2>
        {error && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
            <p className="font-bold">Registration Error</p>
            <p>{error}</p>
            {error.includes('database') && (
              <p className="mt-2 text-sm">
                Please check your details and try again. If the problem persists, contact support.
              </p>
            )}
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Personal Information */}
            <div className="space-y-4 md:col-span-1">
              <div>
                <label htmlFor="name" className="block text-sm font-medium">
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  Password *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4 md:col-span-1">
              <div>
                <label htmlFor="licenseNumber" className="block text-sm font-medium">
                  Medical License Number *
                </label>
                <input
                  id="licenseNumber"
                  name="licenseNumber"
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="specialty" className="block text-sm font-medium">
                  Specialty *
                </label>
                <select
                  id="specialty"
                  name="specialty"
                  required
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.specialty}
                  onChange={handleChange}
                >
                  <option value="">Select specialty</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Surgery">Surgery</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Oncology">Oncology</option>
                  <option value="Psychiatry">Psychiatry</option>
                </select>
              </div>

              <div>
                <label htmlFor="hospital" className="block text-sm font-medium">
                  Hospital/Clinic
                </label>
                <input
                  id="hospital"
                  name="hospital"
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.hospital}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Wallet Address *
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.walletAddress}
                    readOnly
                    placeholder="Connect MetaMask"
                  />
                  <button
                    type="button"
                    onClick={connectMetaMask}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    {metamaskConnected ? 'Connected' : 'Connect'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !metamaskConnected}
            className={`w-full px-4 py-2 font-medium text-white rounded-md ${
              loading || !metamaskConnected ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Registering...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
}