const middlewareService = (formData, openWarning) => {
  // Flag to check if warning has been opened
  let warningOpened = false;

  Object.values(formData).forEach((value) => {
    // If the value is "default" or "", and warning hasn't been opened yet
    if ((value === "default" || value === "") && !warningOpened) {
      openWarning("topRight");
      warningOpened = true; // Set the flag to true after opening the warning
    }
  });

  return formData;
};

export default middlewareService;
