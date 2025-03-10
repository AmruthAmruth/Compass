import express from 'express'
import { createAccount, forgotPassword, forgotPasswordPage, fornewpasswordPage, loadHomePage, loadLoginPage, login, otpPage, resentOTP, resetPassword, verifyForgotPasswordOTP, verifyOTP } from '../Controllers/AuthenticationController.js'
import passport from 'passport'
import { getProfile } from '../Controllers/userController.js';

const Router=express.Router()

//////////////////////////////Authentication part in compass/////////////////////////////////////////////////////////


// Google login section

Router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
Router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
      req.session.user=req.user._id
      res.redirect("/");
    }
  );



// Register to compass section

Router.post('/createaccount',createAccount)
Router.post('/verifyotp',verifyOTP)
Router.post('/resendotp',resentOTP) 
Router.post('/login',login)


// Forgotpassword in compass section

Router.post('/forgotPassword',forgotPassword)
Router.post('/veriyforgotPasswordopt',verifyForgotPasswordOTP)
Router.post('/resetpassword',resetPassword)
Router.get('/verifyotp',otpPage)


// Getting authentication page 
Router.get('/',loadHomePage)
Router.get('/login',loadLoginPage)  
Router.get('/forgotpassword',forgotPasswordPage)
Router.get('/otpverify',otpPage)
Router.get('/resetpassword',fornewpasswordPage)



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




///////////////////////////////User Profile section//////////////////////////////////////////////

Router.get('/profile',getProfile)









export default Router