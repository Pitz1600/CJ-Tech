import express from 'express';
import { register, login, logout,
    sendVerifyOtp, verifyEmail, isAuthenticated,
    sendResetOtp, resetPassword, 
    verifyResetEmail,
    changePassword} from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';
import userAuthEmail from '../middleware/userAuthEmail.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', userAuthEmail, sendVerifyOtp);
authRouter.post('/verify-account', userAuthEmail, verifyEmail);
authRouter.get('/is-auth', userAuth, isAuthenticated);
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/verify-reset-account', verifyResetEmail);
authRouter.post('/reset-password', resetPassword);
authRouter.post("/change-password", userAuth, changePassword);

export default authRouter;