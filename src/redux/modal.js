export const reModal = (state = false, action) => {
  switch (action.type) {
    case "OPEN_MODAL":
      return true;
    case "CLOSE_MODAL":
      return false;
    default:
      return state;
  }
};

export const rePayModal = (state = { status: false, price: 0 }, action) => {
  switch (action.type) {
    case "OPEN_PAY":
      return { status: true, price: action.payload };
    case "CLOSE_PAY":
      return { status: false, price: 0 };
    default:
      return state;
  }
};

export const acOpenMadal = (payload) => ({ type: "OPEN_MODAL", payload });
export const acCloseModal = (payload) => ({ type: "CLOSE_MODAL", payload });
export const acOpenPayModal = (payload) => ({ type: "OPEN_PAY", payload });
export const acClosePayModal = (payload) => ({ type: "CLOSE_PAY", payload });
