
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export const accessT = (payload) => {
  return jwt.sign(
    payload,
    config.accessSecret,
    { expiresIn: "30m" }
  );
};

export const refreshT = (payload) => {
  return jwt.sign(
    payload,
    config.refreshSecret,
     { expiresIn: "7d" }
  );
};
