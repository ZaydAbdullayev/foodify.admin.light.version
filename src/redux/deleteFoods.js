const initialState = {
  products: [],
  income: [],
  invoice: [],
  exp: [],
  edr: [],
  cutting: [],
  damaged: [],
  curry: [],
  making: [],
  preOrder: [],
  main: [],
  dep: [],
  category: [],
  group: [],
  ing: [],
  newIngGr: [],
  ingGroup: [],
  supplier: [],
  invGr: [],
  cashbox: [],
  cashboxGr: [],
  trsn: [],
  table: [],
  ingradient: [],
  envanter: [],
  orderReport: [],
  ingredient: [],
};

export const rootDocuments = (state = initialState, action) => {
  switch (action.type) {
    case "SET_DOCUMENTS":
      const existingDocuments = state[action.payload.roomId];
      const newDocument = action.payload.document;

      if (existingDocuments?.some((doc) => doc?.id === newDocument?.id)) {
        const filteredDocuments = existingDocuments.filter(
          (doc) => doc?.id !== newDocument?.id
        );

        return {
          ...state,
          [action.payload.roomId]: filteredDocuments,
        };
      }

      return {
        ...state,
        [action.payload.roomId]: [...existingDocuments, newDocument],
      };
    case "SET_RELEASE":
      return {
        ...state,
        [action.payload.roomId]: [],
      };
    case "SET_ALL_DOCUMENTS":
      return {
        ...state,
        [action.payload.roomId]: action.payload.documents,
      };

    default:
      return state;
  }
};

export const setDocuments = (roomId, document) => ({
  type: "SET_DOCUMENTS",
  payload: {
    roomId,
    document,
  },
});

export const setRelease = (roomId) => ({
  type: "SET_RELEASE",
  payload: {
    roomId,
  },
});

export const setAllDocuments = (roomId, documents) => ({
  type: "SET_ALL_DOCUMENTS",
  payload: {
    roomId,
    documents,
  },
});


