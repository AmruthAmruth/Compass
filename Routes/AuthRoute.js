import express from 'express'
import { createAccount, forgotPasswordPage, loadHomePage, loadLoginPage, login, otpPage, resentOTP, verifyOTP } from '../Controllers/AuthenticationController.js'
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




Router.get('/verifyotp',otpPage)

Router.get('/',loadHomePage)
Router.get('/login',loadLoginPage)
Router.get('/forgotpassword',forgotPasswordPage)
export default Router