import { getFormattedDate } from "../service/calc-date.service";

export const reSearch = (state = "", action) => {
  switch (action.type) {
    case "SEARCH":
      return action.payload;
    default:
      return state;
  }
};
const date = getFormattedDate(0);
const initialState = {
  date: {
    start: date,
    end: date,
  },
  groups: "",
  department: "",
  name: "",
  cashier: "",
  storage: "",
};
export const reGetNewData = (state = initialState, action) => {
  switch (action.type) {
    case "TAKE":
      return {
        ...state,
        [action.payload.property]: action.payload.value,
      };
    default:
      return state;
  }
};

export const acSearch = (payload) => ({ type: "SEARCH", payload });
export const acGetNewData = (property, value) => ({
  type: "TAKE",
  payload: { property, value },
});
