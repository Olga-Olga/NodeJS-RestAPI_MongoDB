import Contact from "../models/Contact.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import { FSx } from "aws-sdk";
import path from "path";

const posterPath = path.resolve("public", posters);
const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Contact.find({ owner }, "-createdAT -updatedAt", {
    skip,
    limit,
  }).populate("owner", "username email");
  console.log(result);
  res.json(result);
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  // const contactList = await Contact.findById(contactId);
  const contactList = await Contact.findOne({ _id: id, owner });
  if (!contactList) {
    throw HttpError(404, `Can't find such Contact ${contactId}`);
  }
  res.json(contactList);
};

const addContact = async (req, res) => {
  const { _id: owner } = req.user;
  console.log("rq.body", req.body);
  console.log("rq.file", req.file);
  const { path: oldPath, filename } = req.file; //зберігаемо деструктуровану змінну Пас під ім'ям Олдпас

  const newPath = path.join(posterPath, filename);
  await fs.rename(oldPath, newPath);
  const poster = path.join("public", "posters", filename);
  const newContact = await Contact.create({ ...req.body, poster, owner });
  res.status(201).json(newContact);
};

const updateContactById = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  // const updateResult = await Contact.findByIdAndUpdate(contactId, req.body);
  const updateResult = await Contact.findOneAndUpdate(
    { _id: id, owner },
    req.body
  );
  if (!updateResult) {
    throw HttpError(400, `Contacts with ${contactId} not found(.`);
  }
  res.json(updateResult);
};

const updateFavorite = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  // const result = await Contact.findByIdAndUpdate(contactId, req.body);
  const result = await Contact.findByIdAndUpdate({ _id: id, owner }, req.body);
  if (!result) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }
  res.json(result);
};

const removeContactById = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  // const removeContactResult = await Contact.findOneAndDelete(contactId);
  const removeContactResult = await Contact.findOneAndDelete({ _id, owner });
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
  updateFavorite: ctrlWrapper(updateFavorite),
};
