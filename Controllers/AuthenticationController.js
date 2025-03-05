import User from '../Models/UserModel.js'
import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';
import slugify from 'slugify';
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs';
dotenv.config()

const otpStorage = new Map();

export const loadHomePage = (req, res) => {
  res.render('index')
}

export const loadLoginPage = (req, res) => {
  res.render('login')
}

export const otpPage=(req,res)=>{
  res.render('forotp')
}


// Forgot passowrd section

export const forgotPasswordPage = (req, res) => {
  res.render('forgotpassword')
}

export const forOtpPage = (req, res) => {
  res.render('forotp')
}

export const fornewpasswordPage = (req, res) => {
  res.render('fornewpassword')
}



// Create new account section




export const createAccount = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  console.log(req.body);

  try {
    if (!name || !email || !password || !confirmPassword) {
      console.log("Invalid Credentials");
      return res.status(400).json({ success: false, message: "Invalid Credentials" });
    }

    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Email is already registered. Please login.");
      return res.status(400).json({ success: false, message: "Email already registered. Please login." });
    }

    let otp = otpGenerator.generate(4, { 
      digits: true, 
      upperCaseAlphabets: false, 
      lowerCaseAlphabets: false, 
      specialChars: false 
  });
    const otpExpires = Date.now() + 60 * 1000;
    otpStorage.set(email, { otp, otpExpires });

    await sendOtpEmail(email, otp);

    console.log("OTP Sent:", otp);
    req.session.tempuser = { name, email, password, otpExpires };

    return res.status(200).json({ success: true, message: "OTP sent! Redirecting to OTP verification.", redirect: "/verifyotp" });
  } catch (err) {
    console.log("Error while creating an account", err);
    return res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};


const sendOtpEmail = async (email, otp) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_EMAIL_PASSWORD
      }
    });

    let mailOptions = {
      from: process.env.MY_EMAIL,
      to: email,
      subject: "Compass - Your OTP for Account Verification",
      text: `Dear User,  

Your One-Time Password (OTP) for verifying your Compass account is **${otp}**.  

This OTP is valid for **1 minute**. Please do not share it with anyone.  

If you did not request this, please ignore this email.  
Best regards,  
The Compass Team`
    };

    await transporter.sendMail(mailOptions).catch(err => console.log("Error sending email:", err));
  } catch (err) {
    console.log("Error in sending OTP email:", err);
  }
};




export const verifyOTP = async (req, res) => {
  const { otp } = req.body;
  const tempUser = req.session.tempuser;
  
  if (!tempUser) {
    return res.status(400).json({ success: false, message: "Session expired. Start again." });
  }

  const email = tempUser.email;
  const storedOtp = otpStorage.get(email);

  if (!storedOtp) {
    return res.status(400).json({ success: false, message: "OTP expired or invalid" });
  }

  if (storedOtp.otp !== otp) {
    return res.status(400).json({ success: false, message: "Incorrect OTP" });
  }

  if (Date.now() > storedOtp.otpExpires) {
    otpStorage.delete(email);
    return res.status(400).json({ success: false, message: "OTP expired, request a new one" });
  }

  const hashPassword = await bcrypt.hash(tempUser.password, 10);

  function generateValidUsername(email) {
    let baseName = email.split("@")[0];
    let username = slugify(baseName, {
      lower: true,
      strict: true,
      replacement: "_",
    });

    username += Math.floor(1000 + Math.random() * 9000);
    return username;
  }

  let users = await User.find({});
  let userName = generateValidUsername(email);
  let isUsernameTaken = users.some((uname) => uname.username === userName);

  if (isUsernameTaken) {
    userName += Math.floor(Math.random() * 1000);
  }

  const newUser = new User({
    name: tempUser.name,
    username: userName,
    email,
    password: hashPassword
  });

  await newUser.save();
  req.session.user = newUser._id;
  otpStorage.delete(email);
  
  res.json({ success: true, message: "Account created successfully" });
};




export const resentOTP = async (req, res) => {
  try {
    const tempUser = req.session.tempuser;
    if (!tempUser) {
      console.log("Session expired. Start again.");
      return res.status(400).json({ success: false, message: "Session expired. Please log in again." });
    }

    let otp = otpGenerator.generate(4, { 
      digits: true, 
      upperCaseAlphabets: false, 
      lowerCaseAlphabets: false, 
      specialChars: false 
    });

    const otpExpiration = Date.now() + 60 * 1000;
    otpStorage.set(tempUser.email, { otp, otpExpiration });

    await sendOtpEmail(tempUser.email, otp);
    req.session.tempuser.otpExpires = otpExpiration;
    
    console.log("New OTP sent to your email. Please verify.");

    return res.json({ success: true, message: "OTP has been resent successfully." });

  } catch (err) {
    console.log("Error while resending OTP", err);
    return res.status(500).json({ success: false, message: "Failed to resend OTP. Please try again." });
  }
};



export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
      if (!email || !password) {
          return res.status(400).json({ success: false, message: "Invalid Credentials" });
      }

      let existingUser = await User.findOne({ email });
      if (!existingUser) {
          return res.status(400).json({ success: false, message: "Email is not registered. Please sign up." });
      }

      let comparePassword = await bcrypt.compare(password, existingUser.password);
      if (!comparePassword) {
          return res.status(400).json({ success: false, message: "Incorrect Password" });
      }

      req.session.user = existingUser._id

      return res.status(200).json({ success: true, message: "Login successful" });

  } catch (err) {
      console.error("Login Error:", err);
      return res.status(500).json({ success: false, message: "Failed to Login. Please try again." });
  }
};



// Forgot password section 




export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
      if (!email) {
          return res.status(400).json({ success: false, message: "Email is required." });
      }

      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ success: false, message: "User not found." });
      }

      let otp = otpGenerator.generate(4, { 
          digits: true, 
          upperCaseAlphabets: false, 
          lowerCaseAlphabets: false, 
          specialChars: false 
      });

      const otpExpires = Date.now() + 60 * 1000;
      otpStorage.set(email, { otp, otpExpires });

      // Send OTP via email
      await sendOtpEmail(email, otp);

      req.session.resetUser = { email, otpExpires };

      return res.status(200).json({ success: true, message: "OTP sent to your email.", redirect: "/otpverify" });

  } catch (err) {
      console.log("Error in forgot password:", err);
      return res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};



export const verifyForgotPasswordOTP = async (req, res) => {
  const { otp } = req.body;
  const resetUser = req.session.resetUser;

  if (!resetUser) {
      return res.status(400).json({ success: false, message: "Session expired. Request OTP again." });
  }

  const email = resetUser.email;
  const storedOtp = otpStorage.get(email);

  if (!storedOtp) {
      return res.status(400).json({ success: false, message: "OTP expired or invalid" });
  }

  if (storedOtp.otp !== otp) {
      return res.status(400).json({ success: false, message: "Incorrect OTP" });
  }

  if (Date.now() > storedOtp.otpExpires) {
      otpStorage.delete(email);
      return res.status(400).json({ success: false, message: "OTP expired, request a new one" });
  }

  otpStorage.delete(email);
  req.session.resetUser.verified = true; // Mark user as verified

  return res.status(200).json({ success: true, message: "OTP verified successfully!", redirect: "/resetpassword" });
};




export const resetPassword=async(req,res)=>{
  try {
    const { npassword, cpassword } = req.body;
    const email = req.session.resetUser.email; 
    console.log(email);
    

    if (!email) {
        return res.status(400).json({ success: false, message: "Session expired. Try again." });
    }

    if (npassword !== cpassword) {
        return res.status(400).json({ success: false, message: "Passwords do not match." });
    }

    if (npassword.length < 6) {
        return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
    }

    
    const hashedPassword = await bcrypt.hash(npassword, 10);

 
    const user = await User.findOneAndUpdate({ email }, { password: hashedPassword });

    if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
    }

    req.session.destroy();

    return res.json({ success: true, message: "Password reset successful. Please login." });
} catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
}
}