const { sign, verify } = require("jsonwebtoken");
exports.createTokens = (user) => {
  const accessToken = sign({ email: user.email }, "AnkitSingh");
  return accessToken;
};
exports.validateToken = (req, res, next) => {
  const accessToken = req.headers.auth;

  if (!accessToken) {
    return res.status(400).json({ error: "User not auth" });
  }
  try {
    const validToken = verify(accessToken, "AnkitSingh");
    if (validToken) {
      return next();
    }
  } catch (error) {
    res.status(401).send("Unauthorized Req");
  }
};
