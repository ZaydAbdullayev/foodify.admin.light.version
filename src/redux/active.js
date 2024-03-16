const user = JSON?.parse(localStorage.getItem("user"))?.user || null;

export const reActive = (state = false, action) => {
  switch (action.type) {
    case "SIDE_ACTIVE":
      return !state;
    default:
      return state;
  }
};
const today = new Date().toISOString().split("T")[0];

const initialState = {
  id: null,
  name: "",
  group: "",
  ingredient_group: "",
  category: "",
  date: today,
  storage: "",
  description: "",
  amount: "",
  order: "",
  ingredient: "",
  ingredient_id: "",
  responsible: "",
  type: "",
  fullname: "",
  passport: "",
  SNILS: "",
  code: "",
  INN: "",
  registered_address: "",
  residence_address: "",
  number: "",
  fullOrganizationName: "",
  shortOrganizationName: "",
  issued_by: "",
  KPP: "",
  OKPO: "",
  ORGN: "",
  Yuridik_address: "",
  ActualAddress: "",
  unit: "",
  price: "",
  payment_type: "",
  res_id: user?.id,
};

export const reActiveThing = (state = initialState, action) => {
  switch (action.type) {
    case "ACTIVE_THING":
      return { ...state, ...action.payload };
    case "PASSIVE_THING":
      return initialState;
    default:
      return state;
  }
};

export const reStorageId = (state = "", action) => {
  switch (action.type) {
    case "STORAGE_ID":
      return action.payload;
    default:
      return state;
  }
};

export const reActiveSt_id = (state = null, action) => {
  switch (action.type) {
    case "ACTIVE_ST_ID":
      return action.payload;
    default:
      return state;
  }
};

export const acActive = (payload) => ({ type: "SIDE_ACTIVE", payload });
export const acActiveThing = (payload) => ({ type: "ACTIVE_THING", payload });
export const acPassiveThing = (payload) => ({ type: "PASSIVE_THING", payload });
export const acStorageId = (payload) => ({ type: "STORAGE_ID", payload });
export const acActiveSt_id = (payload) => ({ type: "ACTIVE_ST_ID", payload });
