// ! Маршрути для одного об'єкту
import express from "express";
const router = express.Router();

import contactsController from "../../controllers/contacts-controller.js";
import { validateBody } from "../../decorators/index.js";
import {
  movieAddSchema,
  movieUpdateSchema,
} from "../../schemas/contacts-schemas.js";

router.get("/", contactsController.getAll);
// router.get("/:contactId", contactsController.getById);
// router.post("/", validateBody(movieAddSchema), contactsController.addContact);
router.post("/", contactsController.addContact);

// router.delete("/:contactId", contactsController.removeContactById);

// // Отримує параметр id
// // Отримує body в json-форматі c оновленням будь-яких полів name, email и phone
// // Якщо body немає, повертає json з ключем {"message": "missing fields"} і статусом 400
// // Якщо з body всі добре, викликає функцію updateContact(contactId, body). (Напиши її) для поновлення контакту в файлі contacts.json
// // За результатом роботи функції повертає оновлений об'єкт контакту і статусом 200. В іншому випадку, повертає json з ключем "message": "Not found" і статусом 404
// router.put(
//   "/:contactId",
//   validateBody(movieUpdateSchema),
//   contactsController.updateContactById
// );

export default router;
