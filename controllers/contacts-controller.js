import Contact from "../models/Contact.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const getAll = async (req, res) => {
  const result = await Contact.find();
  console.log(result);
  res.json(result);
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  // const contactList = await Contact.findOne({ _id: contactId });
  const contactList = await Contact.findById(contactId);
  if (!contactList) {
    throw HttpError(404, `Can't find such Contact ${contactId}`);
  }
  res.json(contactList);
};

const addContact = async (req, res) => {
  const newContact = await Contact.create(req.body);
  res.status(201).json(newContact);
};

const updateContactById = async (req, res) => {
  const { contactId } = req.params;
  const updateResult = Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!updateResult) {
    throw HttpError(400, `Contacts with ${contactId} not found(.`);
  }
  res.json(updateResult);
};

const updateFavorite = async (req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  if (!favorite) {
    return res.status(400, "missing field favorite");
  }
  const result = await Contact.findByIdAndUpdate(contactId, req.body);
  if (!result) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }
  res.json(result);
};

const removeContactById = async (req, res) => {
  const { contactId } = req.params;
  const removeContactResult = await Contact.findByIdAndDelete(contactId);
  if (!removeContactResult) {
    throw HttpError(400, `Contacts with ${contactId} not found(.`);
  }
  res.json({ message: `Contact ${contactId} deleted` });
};

export default {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  addContact: ctrlWrapper(addContact),
  removeContactById: ctrlWrapper(removeContactById),
  updateContactById: ctrlWrapper(updateContactById),
  updateFavorite: ctrlWrapper(updateContactById),
};
