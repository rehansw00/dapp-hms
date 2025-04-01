import axios from 'axios';

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY;

export async function uploadToIPFS(file: File) {
  if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
    throw new Error('Pinata API keys are not configured');
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_API_KEY,
        },
      }
    );
    return res.data.IpfsHash;
  } catch (error) {
    console.error('Error uploading to Pinata:', error);
    throw error;
  }
}

export async function retrieveFromIPFS(cid: string) {
  try {
    const response = await axios.get(
      `https://gateway.pinata.cloud/ipfs/${cid}`,
      { responseType: 'arraybuffer' }  // Add this option
    );
    return response.data;
  } catch (error) {
    console.error('Error retrieving from IPFS:', error);
    throw error;
  }
}