export const reCalc = (state = {}, action) => {
  switch (action.type) {
    case "ADD":
      return action.payload;
    default:
      return state;
  }
};

export const reCuttingAmount = (state = 0, action) => {
  switch (action.type) {
    case "CUTTING":
      return action.payload;
    default:
      return state;
  }
};

export const acCalc = (payload) => ({ type: "ADD", payload });
export const acCutting = (payload) => ({ type: "CUTTING", payload });

