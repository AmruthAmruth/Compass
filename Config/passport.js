import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../Models/UserModel.js";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import slugify from "slugify";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:7000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google Profile:", profile);

        if (!profile.emails || profile.emails.length === 0) {
          return done(new Error("No email found in Google profile"), null);
        }

        const email = profile.emails[0].value;
        let user = await User.findOne({ email });

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

        if (!user) {
          let users = await User.find({});
          let userName = generateValidUsername(email);
          let isUsernameTaken = users.some((uname) => uname.username === userName);
          
          if (isUsernameTaken) {
            userName += Math.floor(Math.random() * 1000); 
          }

          const hashPassword = await bcryptjs.hash(profile.displayName, 10);

          user = new User({
            username: userName,
            name: profile.displayName,
            email: email,
            avatar: profile.photos?.[0]?.value || "",
            password: hashPassword,
          });
          

          await user.save();
        }

        return done(null, user);
      } catch (error) {
        console.error("Google Auth Error:", error.message);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
