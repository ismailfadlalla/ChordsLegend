// src/components/GoogleAuthButton.tsx
import { Button } from 'react-native';
// import { loginWithGoogle, logout } from '../services/auth';
import { useAuth } from '../context/AuthProvider';

export function GoogleAuthButton() {
  const { user } = useAuth();

  // TODO: Implement Google auth services
  const handleLogin = () => console.log('Google login not implemented yet');
  const handleLogout = () => console.log('Google logout not implemented yet');

  return user ? (
    <Button title="Logout" onPress={handleLogout} />
  ) : (
    <Button title="Login with Google" onPress={handleLogin} />
  );
}