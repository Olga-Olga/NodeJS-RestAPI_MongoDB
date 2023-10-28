import Contact from "../models/Contact.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const getAll = async (req, res, next) => {
  const result = await Contact.find();
  res.json(result);
};

// const getById = async (req, res) => {
//   const { contactId } = req.params;
//   const contactList = await contactsOperations.getContactById(contactId);
//   if (!contactList) {
//     throw HttpError(404, `Can't find such Contact ${contactId}`);
//   }
//   res.json(contactList);
// };

// const addContact = async (req, res) => {
//   const newContact = await contactsOperations.addContact(req.body);
//   res.status(201).json(newContact);
// };

// const updateContactById = async (req, res) => {
//   const { contactId } = req.params;
//   const updateResult = await contactsOperations.updateContact(
//     contactId,
//     req.body
//   );
//   if (!updateResult) {
//     throw HttpError(400, `Contacts with ${contactId} not found(.`);
//   }
//   res.json(updateResult);
// };

// const removeContactById = async (req, res) => {
//   const { contactId } = req.params;
//   const removeContactResult = await contactsOperations.removeContact(contactId);
//   if (!removeContactResult) {
//     throw HttpError(400, `Contacts with ${contactId} not found(.`);
//   }
//   res.json({ message: `Contact ${contactId} deleted` });
// };

export default {
  getAll: ctrlWrapper(getAll),
  // getById: ctrlWrapper(getById),
  // addContact: ctrlWrapper(addContact),
  // removeContactById: ctrlWrapper(removeContactById),
  // updateContactById: ctrlWrapper(updateContactById),
};
