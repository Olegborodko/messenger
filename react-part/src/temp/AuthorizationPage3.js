import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { GoogleOAuthProvider, googleLogout, GoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const AuthorizationPage = ({ setToken }) => {
  const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const navigate = useNavigate();

  return (
    <div>
      <GoogleOAuthProvider clientId={CLIENT_ID}>
        <GoogleLogin
          onSuccess={credentialResponse => {
            console.log(credentialResponse);
            let token = credentialResponse.credential;
            setToken(token);
            navigate('/main');
          }}
          onError={() => {
            console.log('Login Failed');
          }}
          useOneTap
          responseType="code"
          scope="email profile"
        />
      </GoogleOAuthProvider>
    </div>
  );
}

export default AuthorizationPage;