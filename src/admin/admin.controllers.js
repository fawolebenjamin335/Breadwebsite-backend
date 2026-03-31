import { findUserByEmail, findUserByUsername, signUpUser } from "../user/user.services.js";
import { comparePassword, compareSSN, hashPassword, hashSSN } from "../utils/hashpassword.js";
import { generateOTPnumber, generateSSN } from "../utils/otp.creator.js";
import { loginAdminSchema, signUpAdminSchema, verifyAdminSchema } from "./admin.validate.js";
import { deleteCache, getCache, setCache } from "../utils/Cache.js";
import { sendOTPEmail } from "../utils/otp.sender.js";
import { accessT, refreshT } from "../token/jwt.js";

export const SignuAdminController = async ( req, res ) => {
    try {

        const { error, value } = signUpAdminSchema.validate(req.body);
        
        if  (error ) return res.status(400).json({ error: error.message });

        let { firstName, lastName , userName , email, role ,password , SSN} = value;

        const admin = await findUserByEmail({ email: value.email });
        
        if ( admin ) return res.status(400).json({ error: `Account already exist, kindly sign in` });

        value.password = await hashPassword(password);

        const sameAdmin = await findUserByUsername({userName: value.userName})

        if (sameAdmin) return res.status(400).json({error: `Username already exist, kindly replace it`});

        const otp = await generateOTPnumber(4, email);

        const regex = /[@_\-$]/
        const num = /[123567890]/

       role = "admin"

      if ( !regex.test(userName) && !num.test(userName) ) return res.status(400).json({ error: `Your userName must contain a special character and a number. eg what@13` })
    
       
      const plainSSN = await generateSSN(10, email);
      const hashedSSN = await hashSSN(plainSSN);
      value.SSN = hashedSSN;
        

       await setCache( `adminsignup:${email}`,
           {
        email,
        firstName,
        lastName,
        userName,
        role,
        password: value.password,
        otp,
        SSN: value.SSN

       }
       );
    

       

       await sendOTPEmail(
        email,
        `Your Verification Code 
        Your OTP is : ${otp}
        ---------------
        Your SSN is ${plainSSN}`
       )

       return res.status(201).json({message: `Your OTP and SSN has sent successfully, Kindly verify it`});

        
    } catch (error) {
          console.log(`Error sending otp. Try again`, error);

        return res.status(500).json({error: `Internal Server Error`});
        
    }
}

export const VerifyAdmincontroller = async (req,res) => {
   try {
     const { error, value } = verifyAdminSchema.validate(req.body);

    if ( error) return res.status(400).json({error: error.message});

    const { email, otp } = value;

    const thecacheddata = await getCache(`adminsignup:${email}`);

    if (!thecacheddata) {
        return res.status(404).json({ error: `Invalid credentials` });
    }

    if ( thecacheddata.email !== value.email ) {
        return res.status(404).json({error: `Email Incorrect, Recheck and try again` });

    };

    if ( parseInt(thecacheddata.otp) !==  parseInt(otp)  ) return res.status(404).json({error: `Invalid OTP or Expired OTP`});

    const user = await signUpUser({
        firstName: thecacheddata.firstName,
        lastName: thecacheddata.lastName,
        SSN: thecacheddata.SSN,
        email: thecacheddata.email,
        password: thecacheddata.password,
        role: thecacheddata.role,
        userName: thecacheddata.userName

    })

    deleteCache(`adminsignup:${email}`);

     return res.status(201).json({message: `Admin signed up successfully`, user})

   } catch (error) {
      console.log(`Error verifying user`, error);

      return res.status(500).json({error: `Internal Server Error`});
    
   };
};


export const loginAdmin = async ( req, res ) => {
    try {
        const { error, value  } = loginAdminSchema.validate(req.body);

    if ( error ) return res.status(400).json({ error: error.message });

    const { email, SSN, password } = value

    const AdminExist = await findUserByEmail({email});

    if ( !AdminExist ) return res.status(403).json({ error: `User with email: ${email} not found ` })

    const SSNexist = await compareSSN(SSN, AdminExist.SSN);
    
    if (!SSNexist) return res.status(404).json({error: `Invalide Credential, Check and try again `});

    const IspasswordMatch = await comparePassword(password, AdminExist.password);

    if ( !IspasswordMatch ) return res.status(404).json({error: `Invalid Credential `});    
    
    const id = AdminExist.id;
    const role = AdminExist.role;   
    
    const accessToken = accessT ({ id, role });
    
    const refreshToken = refreshT({ id, role });
    
    res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: false, // true in production
    maxAge: 7 * 24 * 60 * 60 * 1000
    });

     return res.status(200).json({message: `Login successful`, AdminExist, accessToken});

    } catch (error) {
        console.log(`Error logging in Admin`, error);

        return res.status(500).json({error: `Internal Server Error`});
    }
        
    
}
   


