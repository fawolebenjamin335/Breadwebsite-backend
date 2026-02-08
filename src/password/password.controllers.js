//import { User } from "../models/user.js";
import { findUserByEmail } from "../user/user.services.js";
import { deleteCache, getCache, setCache } from "../utils/Cache.js";
import { generateOTPnumber } from "../utils/otp.creator.js";
import { sendOTPEmail } from "../utils/otp.sender.js";
import { hashPassword} from "../utils/hashpassword.js";
import { PasswordVerifySchema, ForgottenPasswordSchema } from "./password.validate.js";

export const ForgottenPassword = async (req, res) =>  {
    try {

        
        let { value , error} = ForgottenPasswordSchema.validate(req.body);

        if ( error ) return res.status(400).json({ error: error.message });

        const { email } = value;

        if ( !email ) {
             return res.status(400).json({ error: "Email is required" });
        }

        const user = await findUserByEmail({ email });

        if ( !user ) {
            return res.status(404).json({ error: "User with this email does not exist" });
        }

     const otp = await generateOTPnumber(6, email);

        // Store OTP in cache
        await setCache(`password:${email}`, {
            email,
            otp
        });

        await sendOTPEmail(email, otp);

        return res.status(200).json({ message: "OTP sent to your email" , success: true });

    } catch (error) {
        console.error("Error in ForgottenPassword:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


export const VerifyPasswordOTP = async (req, res) => {
  try {
    const { value, error } = PasswordVerifySchema.validate(req.body);

    if (error)
      return res.status(400).json({ error: error.message });

    const { email, otp, newpassword, confirmPassword } = value;

    console.log("Frontend email:", email);

    const TheCachedData = await getCache(`password:${email}`);

    if (!TheCachedData)
      return res.status(400).json({ error: "Invalid or expired OTP" });

    console.log("Cache:", TheCachedData);

    if (TheCachedData.email !== email)
      return res.status(400).json({ error: "Email does not match" });
  console.log(`otp`, otp); 

    if (TheCachedData.otp  != otp)
    return res.status(400).json({ error: "Invalid OTP" });

      console.log(`frontend otp`, otp );
    if (newpassword !== confirmPassword)
      return res.status(400).json({ error: "Passwords do not match" });

 
    const user = await findUserByEmail({ email });

    if (!user)
      return res.status(404).json({ error: "User not found" });

    user.password = await hashPassword(newpassword);

    await user.save();

    deleteCache(`password:${email}`);

    return res.status(200).json({
      message: "OTP verified successfully",
      success: true
    });

  } catch (error) {
    console.error("Error in Verifying Password and OTP:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
