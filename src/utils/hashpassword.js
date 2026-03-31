 import bcrypt from 'bcrypt';

  export const hashPassword = async (password) => {

    const salt = await bcrypt.genSalt(10);

    return await bcrypt.hash(password, salt);
    
};

//   export const hashSSN = async (SSN) => {

//     const salt = await bcrypt.genSalt(10);

//     return await bcrypt.hash(SSN, salt);
    
// };
//export const compareSSN = async (SSN, hash) => {
//     return await bcrypt.compare(SSN, hash);
// };

export const hashSSN = async (SSN) => {
  return await bcrypt.hash(String(SSN), 10);
};

export const compareSSN = async (SSN, hash) => {
  return await bcrypt.compare(SSN, hash);
};


// 

export const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};