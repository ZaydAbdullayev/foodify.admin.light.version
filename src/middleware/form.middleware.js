const middlewareService = (formData, openWarning) => {
  let warningOpened = false;
  Object.values(formData).forEach((value) => {
    if ((value === "default" || value === "") && !warningOpened) {
      openWarning("topRight");
      warningOpened = true;
    }
  });
  return warningOpened ? null : formData;
};
export default middlewareService;
