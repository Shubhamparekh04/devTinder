const validator = require("validator");
const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid...!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid...!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please Enter strong password...!");
  }
};

const validateProfileEditData = (req) => {
  // const { age, gender, photoUrl, skills, about } = req.body;

  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];

  const isAllowed = Object.keys(req.body).every((k) =>
    allowedEditFields.includes(k)
  );

  return isAllowed;
};

module.exports = {validateSignupData,validateProfileEditData};
