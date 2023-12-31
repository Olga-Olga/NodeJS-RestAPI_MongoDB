import express from "express";
const router = express.Router();

import contactsController from "../../controllers/contacts-controller.js";
import { validateBody } from "../../decorators/index.js";
import {
  contactAddSchema,
  contactUpdateSchema,
  contactPatchSchema,
} from "../../models/Contact.js";

import { isValidId, authenticate, upload } from "../../middleware/index.js";

router.use(authenticate);

router.get("/", contactsController.getAll);
router.get("/:contactId", isValidId, contactsController.getById);
// явно вказуємо в міділварі в якому полі буде файл
// upload.array("poster", 8) - 8 файлів Постер прийшли
// upload.fields([{name: "poster", maxCount: 1}]) - декілька файлів прийшли Постер один і Макс Каунт другий
router.post(
  "/",
  upload.single("avatar"), //явно вказуємо в міділварі в якому полі буде файл - в полі Постер один файл
  validateBody(contactAddSchema),
  contactsController.addContact
);
router.put(
  "/:contactId",
  isValidId,
  validateBody(contactUpdateSchema),
  contactsController.updateContactById
);

router.patch(
  "/:contactId/favorite",
  validateBody(contactPatchSchema),
  contactsController.updateFavorite
);
router.delete("/:contactId", contactsController.removeContactById);

// Отримує параметр id
// Отримує body в json-форматі c оновленням будь-яких полів name, email и phone
// Якщо body немає, повертає json з ключем {"message": "missing fields"} і статусом 400
// Якщо з body всі добре, викликає функцію updateContact(contactId, body). (Напиши її) для поновлення контакту в файлі contacts.json
// За результатом роботи функції повертає оновлений об'єкт контакту і статусом 200. В іншому випадку, повертає json з ключем "message": "Not found" і статусом 404
// router.put(
//   "/:contactId", isValidId,
//   validateBody(movieUpdateSchema),
//   contactsController.updateContactById
// );

export default router;
