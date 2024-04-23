const jwt = require("jsonwebtoken");

const genarateToken = (id) => {
  return jwt.sign({ id }, "Sahan", {
    expiresIn: "30d",
  });
};
module.exports = genarateToken;
