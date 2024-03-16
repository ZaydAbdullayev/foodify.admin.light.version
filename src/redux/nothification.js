export const reNothification = (state = false, action) => {
  switch (action.type) {
    case "NOTHIFICAT":
      return action.payload;
    default:
      return state;
  }
};

export const acNothification = (payload) => ({ type: "NOTHIFICAT", payload });
