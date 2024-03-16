export const reShrink = (state = true, action) => {
  switch (action.type) {
    case "OPEN":
      return !state;
    default:
      return state;
  }
};

export const acShrink = (payload) => ({ type: "OPEN", payload });
