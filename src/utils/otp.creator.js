import { User }  from "../models/user.js";



export const generateOTPnumber = async (length = 6) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;

  let OTP;
  let exists = true;

  while (exists) {
    OTP = Math.floor(Math.random() * (max - min + 1)) + min;
    const otpStr = OTP.toString();

    // Check if OTP already exists for any user
    const result = await User.findOne({ where: { OTP: otpStr } });
     exists = !!result; // true if number exists
  }

  return OTP;
}