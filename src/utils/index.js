import jwt from "jsonwebtoken";

export const getUserId = ({ request }) => {
  let authorization = request.headers.authorization;

  if (!authorization || !authorization.includes("Bearer"))
    throw new Error("Authentication failed...");

  authorization = authorization.replace("Bearer ", "");

  const decodeToken = jwt.verify(authorization, "mySecret");

  return decodeToken.userId;
};
