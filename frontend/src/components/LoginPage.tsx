import { Box } from '@mui/material';
import { authStore, queryHandler } from '../lib/easy-auth';
import { AuthForm, type AuthCredentials } from '@scofez/easy-auth';

export const LoginPage = () => {
  const handleLogin = async (creds: AuthCredentials) => {
    try {
      const response = await queryHandler.query<{ token: string }>(
        '/auth/login', 
        'POST', 
        creds
      );
      
      authStore.setToken(response.token);
      globalThis.location.href = '/chat';
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
  <Box width="100%" height="100%" display="flex">
    <AuthForm onLogin={handleLogin} onRegister={() => {}} />
  </Box>)
};