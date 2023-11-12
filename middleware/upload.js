import multer from "multer";
// створює шляхи
import path from "path";

const destination = path.resolve("temp");
// дистинейшин - де буде зберігатися файл, файлнейм - під яким ім'ям зберегти файл
const storage = multer.diskStorage({
  destination,
  filename: (req, file, cb) => {
    //сb - це колбек
    const uniquePreffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}}`;
    const filename = `${uniquePreffix}_${file.originalname}`; //збегігаємо файл не під ім'ям що він прийшоа, а ще додаємо префікс
    cb(null, filename); //файлНейм з префіксом
  },
});

const limits = {
  fileSize: 1024 * 1024 * 5, //в байтах - не більше 5ти мегабайт
};
//Створюємо мідлвару Апплоад що буде зберігати файли що приходять в тимчасову папу і буде ці інформацю передавать далі на опрацювання
const upload = multer({
  storage,
  limits,
});

export default upload;
