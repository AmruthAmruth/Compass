import express from 'express'
import { createAccount, forgotPassword, forgotPasswordPage, fornewpasswordPage, loadHomePage, loadLoginPage, login, otpPage, resentOTP, resetPassword, verifyForgotPasswordOTP, verifyOTP } from '../Controllers/AuthenticationController.js'
import passport from 'passport'

const Router=express.Router()

// Google login section

Router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
Router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
      res.redirect("/");
    }
  );





 Router.post('/createaccount',createAccount)
 Router.post('/verifyotp',verifyOTP)
 Router.post('/resendotp',resentOTP) 
  Router.post('/login',login)


  Router.post('/forgotPassword',forgotPassword)
  Router.post('/veriyforgotPasswordopt',verifyForgotPasswordOTP)
 Router.post('/resetpassword',resetPassword)
Router.get('/verifyotp',otpPage)

Router.get('/',loadHomePage)
Router.get('/login',loadLoginPage)  
Router.get('/forgotpassword',forgotPasswordPage)

Router.get('/otpverify',otpPage)

Router.get('/resetpassword',fornewpasswordPage)
export default Router