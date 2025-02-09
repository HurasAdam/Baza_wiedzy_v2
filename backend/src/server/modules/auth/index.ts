import { Router } from 'express';
import login from './login/index.js';
import logout from './logout/index.js';
import refresh from './refresh/index.js';
import register from './register/index.js';
import resetPassword from './resetPassword/index.js';

const authRoutes = Router();

// prefix /auth

authRoutes.post('/register', register());
authRoutes.post('/login', login());
authRoutes.get('/refresh', refresh());
authRoutes.get('/logout', logout());
authRoutes.post('/password/reset', resetPassword());

export default authRoutes;
