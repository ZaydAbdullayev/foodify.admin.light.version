export const reUpload = (state = false, action) => {
  switch (action.type) {
    case "UPLOAD":
      return !state;
    default:
      return state;
  }
};

export const acUpload = (payload) => ({ type: "UPLOAD", payload });
