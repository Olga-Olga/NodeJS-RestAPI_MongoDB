import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import User from "../models/User.js";
import "dotenv/config";
const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers; //Щоб уникнути коли у спліт андефайнд (коли невалідний токін без пробілу буде) ставиться пусте по дефолту значення
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    return next(HttpError(401));
    //   почему тут не throw Error
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    if (!user) {
      return next(HttpError(401));
    }
    next();
  } catch (err) {
    return next(HttpError(401, err.message));
  }
};

export default authenticate;
