import jwt from "jsonwebtoken";

export const getUserId = ({ request }, isAuthRequired = true) => {
  let authorization = request.headers.authorization;

  if (authorization && authorization.includes("Bearer")) {
    authorization = authorization.replace("Bearer ", "");

    const decodeToken = jwt.verify(authorization, "mySecret");

    return decodeToken.userId;
  }

  if (isAuthRequired) throw new Error("Authentication failed...");

  return null;
};
