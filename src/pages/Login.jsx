import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const { user, redirectToSSO } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'ROLE_ADMIN') {
        navigate('/adminofcarrer');
      } else {
        navigate('/');
      }
    } else {
      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get('redirect') || '/';
      redirectToSSO(redirectTo);
    }
  }, [user, navigate, redirectToSSO]);

  return null;
}
