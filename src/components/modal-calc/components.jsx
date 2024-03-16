export const data = [
  {
    id: 1,
    name: "test 1",
    price: 10000,
    transaction: [
      {
        id: 1,
        name: "Inner Test",
        details: [{ id: 1, name: "Inner Data's tes", price: 345254 }],
      },
    ],
    unit: "kg",
    group: "test",
  },
  {
    id: 2,
    name: "test 2",
    price: 10000,
    transaction: [
      {
        id: 2,
        name: "Inner Test",
        details: [
          { id: 2, name: "Inner Data's tes", price: 340000 },
          { id: 4, name: "Inner Data's tes", price: 7500 },
        ],
      },
      {
        id: 2,
        name: "Inner Test",
        details: [{ id: 2, name: "Inner Data's tes", price: 650000 }],
      },
      {
        id: 2,
        name: "Inner Test",
        details: [
          { id: 2, name: "Inner Data's tes", price: 543000 },
          { id: 4, name: "Inner Data's tes", price: 50111 },
          { id: 4, name: "Inner Data's tes", price: 2100 },
        ],
      },
    ],
    unit: "kg",
    group: "wfe",
  },
  {
    id: 3,
    name: "test 3",
    price: 10000,
    transaction: [
      {
        id: 3,
        name: "Inner Test",
        details: [
          { id: 3, name: "Inner Data's tes", price: 433000 },
          { id: 4, name: "Inner Data's tes", price: 23321 },
          { id: 4, name: "Inner Data's tes", price: 9000 },
        ],
      },
    ],
    unit: "kg",
    group: "test",
  },
  {
    id: 4,
    name: "test 4",
    price: 10000,
    transaction: [
      {
        id: 4,
        name: "Inner Test",
        details: [
          { id: 4, name: "Inner Data's tes", price: 12000 },
          { id: 4, name: "Inner Data's tes", price: 320000 },
          { id: 4, name: "Inner Data's tes", price: 1200000 },
        ],
      },
      {
        id: 5,
        name: "Inner Test",
        details: [
          { id: 4, name: "Inner Data's tes", price: 1400000 },
          { id: 4, name: "Inner Data's tes", price: 2100000 },
        ],
      },
    ],
    unit: "kg",
    group: "test",
  },
];

export const calculateTotal = (data) => {
  let total = 0;

  data?.ingredients?.forEach((ingredient) => {
    const amount = ingredient.amount || 0;
    const price = ingredient.price || 0;

    total += amount * price;
  });

  const remainingPrice = data.price - total;

  const result = data.price / total || 0;
  return {
    markup: result,
    prime_cost: total,
    profit: remainingPrice,
  };
};


