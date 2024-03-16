export const CalculateTotalPrice = (cart = [], percentage = 10) => {
  const totalPrice = cart.reduce(
    (sum, item) => sum + (item?.price || 0) * (item?.quantity || 1),
    0
  );
  const service = isNaN(totalPrice) ? 0 : (totalPrice / 100) * percentage;
  const parsedS = parseFloat(service.toFixed(2));

  return {
    totalPrice,
    service: parsedS,
    total: parseInt(totalPrice) + parseInt(parsedS),
  };
};
// (qty ? item[key] * qty : item[key]),
export const CalculateTotalQuantity = (cart, key, qty = null) => {
  const totalPrice =
    cart?.reduce((accumulator, item) => {
      const quantityMultiplier = qty ? parseInt(item[qty], 10) : 1;
      return accumulator + parseInt(item[key], 10) * quantityMultiplier;
    }, 0) || 0;

  return totalPrice;
};

export const CalculateTotalP = (cart, first, second) => {
  const totalPrice = cart?.reduce(
    (accumulator, item) => accumulator + item[first] * item[second],
    0
  );
  return totalPrice;
};

export const CalculateTotalByLine = (cart, keyToExclude) => {
  const totalPrice =
    cart?.reduce((accumulator, item) => {
      if (!item.hasOwnProperty(keyToExclude)) {
        accumulator += parseInt(item[keyToExclude], 10);
      }
      return accumulator;
    }, 0) || 0;

  return totalPrice;
};

export const CalculateTotal = (data, key) => {
  let total = 0;
  data?.forEach((inner) => {
    inner[key]?.forEach((tr) => {
      total += CalculateTotalQuantity(tr?.details, "amount");
    });
  });
  return total;
};

export const CalculateTotalCH = (data, key, vl) => {
  let total = 0;

  data?.forEach((item) => {
    const value = item[key]?.[vl];
    total += value ? value : 0; // Eğer value undefined ise 0 kullan
  });

  return total;
};

