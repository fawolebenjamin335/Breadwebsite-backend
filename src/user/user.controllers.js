import { deleteCache, getCache, setCache } from "../utils/Cache.js";
import { comparePassword, hashPassword } from "../utils/hashpassword.js";
import { generateOTPnumber } from "../utils/otp.creator.js";
import { signUpUserSchema, verifyUserSchema , loginUserSchema} from "../validator/user.validator.js"
import { findUserByEmail, signUpUser} from "./user.services.js"
import {sendOTPEmail} from "../utils/otp.sender.js";
import { accessT, refreshT } from "../token/jwt.js";
import { config } from "../config/env.js";
import { User } from "../models/user.js";



export const SignupUserController = async ( req, res ) => {
    try {
        
        const { error, value } = signUpUserSchema.validate(req.body);

        if ( error ) return res.status(400).json({error: error.message})

        let { firstName, lastName , userName , email, role ,password} = value;

        const user = await findUserByEmail({email: value.email});

        if (user) return res.status(400).json({error: `Account already exist, Kindly sign in`})
        
        value.password = await hashPassword(password)

        const otp = await generateOTPnumber(4, email);

        value.role = "user" || role  

        await setCache(`signup:${email}`, 
            {
                email,
                firstName,
                lastName,
                userName,
                password: value.password,
                otp,
                role: value.role

            }
        );

          await sendOTPEmail(
          email,
          " Your Verification Code",
          `Your OTP is: ${otp}` ,
          );

          return  res.status(201).json({message: `OTP sent to your Email. Kindly input it to sign up fully`})



    } catch (error) {

          console.log(`Error sending otp. Try again`, error);

        return res.status(500).json({error: `Internal Server Error`});
        
    }

}

export const VerifyUserController = async ( req, res) => {
    try {
        const { error, value} = verifyUserSchema.validate(req.body);

        if ( error ) return res.status(400).json({error: error.message})
        
        const { email, otp } = value;

        const cachedData = await getCache(`signup:${email}`);

        if (!cachedData ) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        };
          
         if (cachedData.email !== value.email) {
            return res.status(400).json({ error: 'Email mismatch, Check and try again' })

        };


        if (parseFloat(cachedData.otp) !== parseFloat(otp) ) return res.status(400).json({ error: 'Invalid OTP, Check and try again' });
 
  

        const user = await signUpUser({
            firstName: cachedData.firstName,
            lastName: cachedData.lastName,
            userName: cachedData.userName,
            email: cachedData.email,
            password: cachedData.password,
            role: cachedData.role
        })

        deleteCache(`signup:${email}`);



        return res.status(201).json({message: `User signed up successfully`, user})

    } catch (error) {
        console.log(`Error verifying user`, error);

        return res.status(500).json({error: `Internal Server Error`});
    }
}


export const LoginUserController = async ( req, res) => {
    try {
        const { error, value} = loginUserSchema.validate(req.body)

        if ( error ) return res.status(400).json({error: error.message})

        let { email, password} = value;

        const user = await findUserByEmail({email});

        if (!user) return res.status(400).json({error: `User not found`})

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) return res.status(400).json({error: `Invalid credentials`})  
        
         const id = user.id;
         const role = user.role;   

        const accessToken = accessT ({ id, role });

        const refreshToken = refreshT({ id, role });

        res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
         sameSite: "strict",
         secure: false, // true in production
         maxAge: 7 * 24 * 60 * 60 * 1000
  });

 

        return res.status(200).json({message: `Login successful`, user, accessToken})
    } catch (error) {
        console.log(`Error logging in user`, error);

        return res.status(500).json({error: `Internal Server Error`});
    }
}

export const refresh = (req, res) => {
  
    const refreshToken = req.cookies.refreshToken;
 
    if (!refreshToken) return res.sendStatus(401);

  jwt.verify(
    refreshToken,
    config.refreshSecret,
    (error, decoded) => {
      
        if (error) return res.status(403).json({ error: 'Invalid refresh token' });

      const newAccessToken = accessT(decoded);
      res.json({ accessToken: newAccessToken });
    }
  );
};



export const logout = (req, res) => {
  res.clearCookie("refreshToken");
 return res.status(204).json({message: "Logout successful"});
};



export const editUserDetailsController = async (req, res) => {
  try {
    const userId = req.user.id;    

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const allowedFields =  ["firstName", "lastName", "username"];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

   return  res.status(201).json({ message: "User updated successfully", user });

  } catch (error) {

    console.error ("Error editing user", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const 
