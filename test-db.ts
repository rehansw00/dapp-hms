{
    "compilerOptions": {
      "module": "commonjs",
      "esModuleInterop": true,
      "target": "ES6",
      "moduleResolution": "node";
    }
  }import dbConnect from './lib/mongoose';

async function testConnection() {
  try {
    const connection = await dbConnect();
    console.log('✅ MongoDB connected successfully');
    console.log('Connection state:', connection.connection.readyState);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
  }
}

testConnection();