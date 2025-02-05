import { Router } from 'express';
import { loginHandler, logoutHandler, refreshHandler, registerHandler, resetPasswordHandler } from './controller.js';


const authRoutes = Router();

// prefix /auth

authRoutes.post('/register', registerHandler);
authRoutes.post('/login', loginHandler);
authRoutes.get('/refresh', refreshHandler);
authRoutes.get('/logout', logoutHandler);
authRoutes.post('/password/reset', resetPasswordHandler);

export default authRoutes;
