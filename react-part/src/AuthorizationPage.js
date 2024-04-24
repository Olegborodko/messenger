import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import socketConnect from './parts/Socket';
const socket = socketConnect;

const AuthorizationPage = () => {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      socket.emit('google-authenticate', { data: tokenResponse.code });
      navigate('/main');
    },
    flow: 'auth-code',
  });

  return (
    <div>
      <Button onClick={() => login()}>Sign in with Google</Button>
    </div>
  );
}

export default AuthorizationPage;