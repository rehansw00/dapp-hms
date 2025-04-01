import { useState } from 'react';
import OverviewStats from './OverviewStats';

function DoctorDashboard() {
  const [isMetaMaskConnected, setMetaMaskConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState('');

  // Add stats array
  const stats = [
    { label: 'Total Patients', value: 120 },
    { label: 'Appointments Today', value: 15 },
    { label: 'Pending Reports', value: 8 },
  ];

  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        setMetaMaskConnected(true);
      } catch (error) {
        console.error('MetaMask connection error:', error);
      }
    }
  };

  const registerDoctor = async () => {
    try {
      const response = await fetch('/api/doctors/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          // Add other required doctor fields here
          name: 'Dr. Example',
          email: 'doctor@example.com',
          password: 'securepassword123',
          licenseNumber: 'MD123456',
          specialty: 'Cardiology'
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setRegistrationStatus('Registration successful!');
      } else {
        setRegistrationStatus(data.message || 'Registration failed');
      }
    } catch (error) {
      setRegistrationStatus('Error during registration');
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <OverviewStats stats={stats}>
          <div className="grid grid-cols-1">
            <div ref={null} className="rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div>
                    <p className="text-3xl font-bold">
                      {/* Move the div outside of the p tag */}
                    </p>
                    <div className="h-8 w-16 animate-pulse bg-muted rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </OverviewStats>
        <button onClick={connectMetaMask} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
          {isMetaMaskConnected ? 'MetaMask Connected' : 'Connect MetaMask'}
        </button>
        {isMetaMaskConnected && (
          <button onClick={registerDoctor} className="mt-4 ml-4 px-4 py-2 bg-green-600 text-white rounded">
            Register as Doctor
          </button>
        )}
        {registrationStatus && <p className="mt-4 text-gray-700">{registrationStatus}</p>}
      </div>
    </div>
  );
}

export default DoctorDashboard;