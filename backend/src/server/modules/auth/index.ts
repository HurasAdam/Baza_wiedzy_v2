import { Router } from 'express';
import login from './login/index.js';
import logout from './logout/index.js';
import refresh from './refresh/index.js';
import register from './register/index.js';
import resetPassword from './resetPassword/index.js';

/**
 * Initialize auth routes
 * Prefix: /auth.
 */
export default (): Router => {
  const router = Router();

  router.post('/register', register());
  router.post('/login', login());
  router.get('/refresh', refresh());
  router.get('/logout', logout());
  router.post('/password/reset', resetPassword());

  return router;
};
