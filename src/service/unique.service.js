export const uniqArray = (arr) => {
  return arr?.filter((item, index) => arr?.indexOf(item) === index) || [];
};
