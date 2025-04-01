'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formValid, setFormValid] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error') || undefined;

  useEffect(() => {
    if (errorParam) {
      switch(errorParam) {
        case 'AuthFailed':
          setError('Invalid email or password. Please try again.');
          break;
        case 'SessionExpired':
          setError('Your session has expired. Please login again.');
          break;
        case 'AccessDenied':
          setError('You do not have permission to access this resource.');
          break;
        default:
          setError('An unexpected error occurred. Please try again.');
      }
    }
  }, [errorParam]);

  useEffect(() => {
    setFormValid(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && 
      password.length >= 8
    );
  }, [email, password]);

  const connectMetaMask = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        console.log('Connected account:', accounts[0]);
      } else {
        throw new Error('MetaMask not installed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect MetaMask');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValid) {
      setError('Please enter valid email and password (min 8 characters)');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl: '/dashboard'
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const registerAsDoctor = async () => {
    try {
      // Implement registration logic here
      console.log('Registering as doctor...');
      // Example: Interact with a smart contract or update the database
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('Connected account for registration:', accounts[0]);
        // Add additional logic for registration as a doctor
      } else {
        throw new Error('MetaMask not installed');
      }
      
      // Redirect to the register as doctor page
      router.push('/register-doctor');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register as doctor');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">Sign in to your account</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 border rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  className="w-full px-3 py-2 border rounded-md"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={!formValid || loading}
            className={`w-full px-4 py-2 font-medium text-white rounded-md ${
              formValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <button
          onClick={connectMetaMask}
          className="w-full px-4 py-2 font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 mt-4"
        >
          Connect MetaMask
        </button>
        <button
          onClick={registerAsDoctor}
          className="w-full px-4 py-2 font-medium text-white bg-green-600 rounded-md hover:bg-green-700 mt-4"
        >
          Register as Doctor
        </button>
      </div>
    </div>
  );
}
