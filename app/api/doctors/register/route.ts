import { connectToDB } from '../../../../lib/db';
import Doctor from '../../../../models/Doctor';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    await connectToDB();
    const doctorData = await request.json();

    // Validate wallet address
    if (!doctorData.walletAddress) {
      return NextResponse.json(
        { message: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (doctorData.password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!doctorData.name || !doctorData.email || !doctorData.password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({ 
      $or: [
        { email: doctorData.email },
        { licenseNumber: doctorData.licenseNumber }
      ]
    });

    if (existingDoctor) {
      return NextResponse.json(
        { message: 'Doctor with this email or license already exists' },
        { status: 409 }
      );
    }

    // Create new doctor with wallet address
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(doctorData.password, salt);
    
    const newDoctor = new Doctor({
      ...doctorData,
      password: hashedPassword,
      walletAddress: doctorData.walletAddress
    });

    await newDoctor.save();

    return NextResponse.json(
      { 
        message: 'Doctor registered successfully',
        doctor: {
          id: newDoctor._id,
          name: newDoctor.name,
          email: newDoctor.email,
          walletAddress: newDoctor.walletAddress
        }
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Registration failed' },
      { status: 500 }
    );
  }
}