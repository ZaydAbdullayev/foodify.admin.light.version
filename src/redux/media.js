export const reMedia = (state = "", action) => {
  switch (action.type) {
    case "MEDIA":
      return action.payload;
    default:
      return state;
  }
};

export const reDeviceWidth = (state = false, action) => {
  switch (action.type) {
    case "DEVICE_WIDTH":
      return action.payload;
    default:
      return state;
  }
};

export const acMedia = (payload) => ({ type: "MEDIA", payload });
export const acDeviceWidth = (payload) => ({ type: "DEVICE_WIDTH", payload });
