import { deleteCache, getCache, setCache } from "../utils/Cache.js";
import { comparePassword, hashPassword } from "../utils/hashpassword.js";
import { generateOTPnumber } from "../utils/otp.creator.js";
import { signUpUserSchema, verifyUserSchema , loginUserSchema, editUserSchema} from "../validator/user.validator.js"
import { findUserByEmail, findUserByUsername, signUpUser} from "./user.services.js"
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

       const sameuser =  await findUserByUsername({userName: value.userName});
        if (sameuser) return res.status(400).json({error: `Username already exist, Kindly choose another username`})

        const otp = await generateOTPnumber(4, email);

        const theRole = role || "user"

        await setCache(`signup:${email}`, 
            {
                email,
                firstName,
                lastName,
                userName,
                password: value.password,
                otp,
                role: theRole

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
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    jwt.verify(refreshToken, config.refreshSecret, (error, decoded) => {
      if (error) return res.status(403).json({ error: 'Invalid refresh token' });

      const { id, role } = decoded;

      // generate new access token
      const newAccessToken = accessT({ id, role });

      // optionally, re-set refresh token to extend expiration
      const newRefreshToken = refreshT({ id, role });
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: false, // set true in production
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.log("Refresh error", err);
    return res.status(500).json({ message: "Server error" });
  }
};



export const logout = (req, res) => {
  res.clearCookie("refreshToken");
 return res.status(204).json({message: "Logout successful"});
};



export const editUserDetailsController = async (req, res) => {
  try {
    const userId = req.user.id; 

    const {error, value} = editUserSchema.validate(req.body)

    if ( error ) return res.status(400).json({error: error.message});

    const { firstName, lastName, role, userName } = value;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found"});

    // firstName = user.firstName;
    // lastName = user.lastName;
    //  role = user.role;
    // userName = user.userName;

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (role) user.role = role;
    if (userName) user.userName = userName;

    await user.save();

  return res.status(201).json({ message: "User updated", user });
  } catch (error) {
    console.log("Error editing user", error);
    return res.status(500).json({ message: "Server error" });
  }
};



export const getUserController = async ( req, res) =>{
  try {

    const loggedinUser = req.user;

    const id = loggedinUser.id;
    
    const user = await findUserByEmail({id});

    if ( !user ) {
      return res.status(404).json({ error: `User doesnt exist` })
    }

    return res.status(200).json({message: user})
  } catch (error) {
    console.log(error, `Error getting user`)
    return res.status(500).json({ error: `Error getting user` })
  }
}
