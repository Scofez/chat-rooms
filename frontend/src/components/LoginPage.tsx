import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authStore, queryHandler } from '../lib/easy-auth';
import { AuthForm, type AuthCredentials } from '@scofez/easy-auth';

export const LoginPage = () => {
  const navigate = useNavigate();
  const handleLogin = async (creds: AuthCredentials) => {
    try {
      const response = await queryHandler.query<{ token: string }>(
        '/security/login', 
        'POST', 
        { username: creds.username, password: creds.pass }
      );
      
      authStore.setToken(response.token);
      navigate('/chat');
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  const handleRegister = async (creds: AuthCredentials) => {
    try {
      const response = await queryHandler.query<{token: string}>(
        '/security/register',
        'POST',
        { username: creds.username, password: creds.pass }
      );
      authStore.setToken(response.token);
      navigate('/chat');
    }
    catch (err) {
      console.error('Register failed', err);
    }
  }

  return (
  <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
    <AuthForm onLogin={handleLogin} onRegister={handleRegister} />
  </Box>)
};