import jwt from 'jsonwebtoken';

const authUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Not Authorized Login Again" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // assign the userId to request
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: "Invalid Token" });
  }
};


export default authUser;
