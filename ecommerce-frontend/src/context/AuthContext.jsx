import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);


function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function isTokenExpired(claims) {
  if (!claims?.exp) return true;
  return Date.now() >= claims.exp * 1000;
}


function getUserIdFromClaims(claims) {
  return claims?.id || claims?._id || claims?.sub || null;
}

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [claims, setClaims] = useState(null); 

  useEffect(() => {
    const stored = localStorage.getItem('accessToken');
    if (stored) {
      const c = parseJwt(stored);
      if (c&& !isTokenExpired(c)) {
        setAccessToken(stored);
        setClaims(c);
        api.defaults.headers.common['Authorization'] = `Bearer ${stored}`;
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        delete api.defaults.headers.common['Authorization'];
      }
    }
  }, []);

  const userId = useMemo(() => getUserIdFromClaims(claims), [claims]);
  const role = claims?.role || null;
  const email = claims?.email || null;
  const user = useMemo(() => {
    if (!claims) return null;
    return {
      id: userId,
      role,
      email,
      iat: claims.iat,
      exp: claims.exp,
      raw: claims,
    };
  }, [claims, userId, role, email]);

  const login = ({ accessToken: at, refreshToken: rt }) => {
    if (!at) throw new Error('accessToken es requerido en login');
    const c = parseJwt(at);
    setAccessToken(at);
    setClaims(c);
    localStorage.setItem('accessToken', at);
    if (rt) localStorage.setItem('refreshToken', rt);
    api.defaults.headers.common['Authorization'] = `Bearer ${at}`;
  };

  const logout = () => {
    setAccessToken(null);
    setClaims(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete api.defaults.headers.common['Authorization'];
  };

  const value = useMemo(
    () => ({
      user,        // { id, role, email, iat, exp, raw }
      userId,      // string | null
      role,        // 'admin' | ...
      email,       // email del token
      accessToken, // string | null
      isAdmin: role === 'admin',
      login,
      logout,
    }),
    [user, userId, role, email, accessToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
