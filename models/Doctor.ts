import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { 
    type: String, 
    required: true,
    select: false // Don't return password in queries
  },
  licenseNumber: { type: String, required: true, unique: true },
  specialty: { type: String, required: true },
  hospital: { type: String },
  walletAddress: { type: String, required: true },
  role: { type: String, default: 'doctor' },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
DoctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare passwords
DoctorSchema.methods.comparePassword = async function(
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);