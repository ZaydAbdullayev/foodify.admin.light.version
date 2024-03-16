export const filterData = (data) => {
  const newItem = data?.map((item) => {
    const productData = JSON?.parse(item?.product_data);
    const one = [];
    const two = [];

    productData?.forEach((product) => {
      if (!product?.status) {
        one.push(product);
      } else if (product?.status === "2") {
        two.push(product);
      }
    });

    return {
      ...item,
      one,
      two,
    };
  });
  return newItem;
};
