const user = JSON.parse(localStorage.getItem("user")) || {};
const token = user.token || null;

export const reAuth = (state = token, action) => {
  switch (action.type) {
    case "LOGIN":
      return true;
    case "LOGOUT":
      return false;
    default:
      return state;
  }
};

export const acLogin = () => ({ type: "LOGIN" });
export const acLogout = () => ({ type: "LOGOUT" });
