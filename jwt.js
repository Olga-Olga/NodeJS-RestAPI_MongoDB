import jwt from "jsonwebtoken";
import "dotent/config";

// const { JWT_SECRET } = process.env;
const { JWT_SECRET } = process.env;

// const JWT_SECRET = cjyPvS7w7sCBSIWHn0ljiOgYQK84Xm2;
console.log(JWT_SECRET);

const payload = {
  id: "654677c2bbb8baab65de385f",
};

const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
const decodeToken = jwt.decode(token);
console.log(decodeToken);

try {
  const { id } = jwt.verify(token, JWT_SECRET);
} catch (err) {
  console.log(err);
}
