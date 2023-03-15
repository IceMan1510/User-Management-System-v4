const { sign, verify } = require("jsonwebtoken");
const BlackTokens = require("../models/blacktokens");
exports.createAccessTokens = (user) => {
  const accessToken = sign({ email: user.email }, "AnkitSingh", {
    expiresIn: "10h",
  });
  return accessToken;
};

exports.validateToken = async (req, res, next) => {
  const accessToken = req.headers.auth;
  const checkIfTokenExists = await BlackTokens.findOne({
    where: { token: accessToken },
  });
  if (accessToken === undefined) {
    res.status(401).send({ error: "Unauthorized Req" });
  } else if (checkIfTokenExists !== null) {
    res.status(401).send({ error: "Token Blacklisted" });
  } else if (!accessToken) {
    return res.status(404).json({ error: "No Access Token Found" });
  }

  try {
    const validToken = verify(accessToken, "AnkitSingh");
    if (validToken) {
      res.locals.email = validToken.email;
      return next();
    }
  } catch (error) {
    res.status(401).send({ error: "Unauthorized Req" });
  }
};
