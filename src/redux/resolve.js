export const resolve = (
  state = {
    product: "",
    order_id: null,
    status: 0,
    department: "",
  },
  action
) => {
  switch (action.type) {
    case "RESOLVE":
      return action.payload;
    default:
      return state;
  }
};

export const acResolve = (payload) => ({ type: "RESOLVE", payload });
