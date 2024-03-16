import { useDelDataMutation } from "./fetch.service";
// all types:
// products,
// income,
// invoice,
// exp,
// edr,
// cutting,
// damaged,
// curry,
// making,
// preOrder,
// main,
// dep,
// category,
// group,
// ing,
// newIngGr,
// supplier,
// invGr,
// cashbox,
// cashboxGr,
// trsn,
// table,
// ingradient,
// envanter,
// orderReport,

const DeleteSelectedElements = async (type, data) => {
  const [delData] = useDelDataMutation();

  let result;

  switch (type) {
    case "product":
      result = await delData(data);
      break;
    default:
      break;
  }

  return result;
};

export default DeleteSelectedElements;
