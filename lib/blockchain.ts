import Web3 from 'web3';

interface ContractNetwork {
  address: string;
}

interface ContractArtifact {
  abi: any[];
  networks: {
    [key: number]: ContractNetwork;
  };
}

const UserStorage = require('./UserStorage.json') as ContractArtifact;

declare let window: any;

async function getContract() {
  if (!window.ethereum) {
    console.error('MetaMask not detected - Please install MetaMask');
    return null;
  }

  try {
    // Request account access if needed
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    
    // Try switching to default network if timeout occurs
    const switchNetwork = async () => {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x5' }], // Goerli testnet
        });
      } catch (switchError) {
        console.error('Network switch failed:', switchError);
      }
    };

    const networkId = await Promise.race([
      web3.eth.net.getId(),
      new Promise((_, reject) => 
        setTimeout(async () => {
          await switchNetwork();
          reject(new Error('Network timeout - Switched to default network. Please try again'));
        }, 5000)
      )
    ]).catch(err => {
      console.error('Network connection error:', err.message);
      return null;
    });

    if (!networkId) {
      console.error('Could not connect to blockchain network');
      return null;
    }

    const deployedNetwork = UserStorage.networks[Number(networkId)];
    if (!deployedNetwork?.address) {
      console.error(`Contract not deployed on network ID ${networkId}. Available networks:`, 
        Object.keys(UserStorage.networks));
      return null;
    }

    return {
      contract: new web3.eth.Contract(UserStorage.abi, deployedNetwork.address),
      account: accounts[0]
    };
  } catch (error: unknown) {
    console.error('Blockchain connection error:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

export async function addUserToBlockchain(role: string, name: string, email: string) {
  const contractInstance = await getContract();
  if (contractInstance) {
    await contractInstance.contract.methods
      .addUser(role, name, email)
      .send({ from: contractInstance.account });
  }
}

export async function getAllUsers() {
  const contractInstance = await getContract();
  return contractInstance 
    ? await contractInstance.contract.methods.getAllUsers().call({ from: contractInstance.account })
    : [];
}

export async function recordLogin(address: string) {
  const contractInstance = await getContract();
  if (contractInstance) {
    await contractInstance.contract.methods
      .recordLogin(address)
      .send({ from: address });
  }
}