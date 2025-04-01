import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  specialty: { type: String, required: true },
  hospital: { type: String },
  walletAddress: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);