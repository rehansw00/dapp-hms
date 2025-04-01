import { addUserToBlockchain, recordLogin } from './blockchain';

export async function registerUser(role: string, name: string, email: string) {
  // ... existing registration logic
  await addUserToBlockchain(role, name, email);
}

export async function handleLogin(address: string) {
  // ... existing login logic
  await recordLogin(address);
}