import bcryptjs from "bcryptjs";

const hashPassword = async (password) => {
  const result = await bcryptjs.hash(password, 10);
  const compareResult = await bcryptjs.compare("password", result);
  console.log(compareResult);
};

hashPassword("123123");
