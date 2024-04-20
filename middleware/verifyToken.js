import jwt from "jsonwebtoken";
export async function verifyToken(req, res, next) {
  // console.log(req.token)
  const authHeader = req.headers.authorization || req.headers.Authorization;

  // console.log("Bearer",authHeader);
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    console.log({ decoded },err);
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = decoded.userinfo.username;
    req.roles = decoded.userinfo.roles;
    next();
  });
//   next(new Error("access unauthorized"));
}
// NOT used till now anywhere
