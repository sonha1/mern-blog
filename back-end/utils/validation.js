export const validationPassword = (password) => {
  let pattern = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/);
  if (!pattern.test(password)) {
    return false;
  }
  return true;
};
