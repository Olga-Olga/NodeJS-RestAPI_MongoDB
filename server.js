import mongoose from "mongoose";
import app from "./app.js";
import { DB_HOST } from "./config.js";
const { PORT = 3000 } = process.env;

mongoose
  .connect(process.env.DB_HOST)
  .then(console.log("connected to db"))
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server running. Use our API on port: 3000");
    });
  })
  .catch((err) => {
    console.log(err.message);
    // закриваємо запущені процесси з невідомою помилкою 1, можно 1 не писати
    process.exit(1);
  });
