import { User } from "../models/user.js";




export const findUserByEmail = async (email) => {
  return await User.findOne({where: email});
};

export const signUpUser = async (data) => {
  return await User.create(data);
};

export const findUserByUsername = async ( userName ) => {
  return await User.findOne({where: userName}) 
}


export const findUserNametoUpperCase = async ( userName ) => {
  const string = await User.findOne({where: userName});
  const firstName = await string.slice(0,1).toUpperCase();
  return firstName;
}