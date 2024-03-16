export const reUModal = (state = false, action) => {
  switch (action.type) {
    case "OPEN_UMODAL":
      return true;
    case "CLOSE_UMODAL":
      return false;
    default:
      return state;
  }
};

export const reModalType = (state = "", action) => {
  switch (action.type) {
    case "TYPE_UMODAL":
      return action.payload;
    default:
      return state;
  }
};

const st = { st: false, img: "" };
export const reGetUrl = (state = st, action) => {
  switch (action.type) {
    case "GET_URL":
      return action.payload;
    default:
      return state;
  }
};

export const acModalType = (payload) => ({ type: "TYPE_UMODAL", payload });
export const acOpenUModal = (payload) => ({ type: "OPEN_UMODAL", payload });
export const acCloseUModal = (payload) => ({ type: "CLOSE_UMODAL", payload });
export const acGetUrl = (payload) => ({ type: "GET_URL", payload });
