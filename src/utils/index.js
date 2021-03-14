import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const getUserId = ({ request }, isAuthRequired = true) => {
  let authorization = request.headers
    ? request.headers.authorization
    : request.connection.context.authorization;

  if (authorization && authorization.includes("Bearer")) {
    authorization = authorization.replace("Bearer ", "");

    const decodeToken = jwt.verify(authorization, "mySecret");

    return decodeToken.userId;
  }

  if (isAuthRequired) throw new Error("Authentication failed...");

  return null;
};

export const generateToken = (userId, expTime = "7 days") =>
  jwt.sign({ userId }, "mySecret", { expiresIn: expTime });

export const validateAndHashPassword = async (password) => {
  if (password.length < 7)
    throw new Error("Password should be 7 characters long.");

  return await bcrypt.hash(password, 10);
};
