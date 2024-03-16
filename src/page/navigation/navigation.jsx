import React, { useState } from "react";
import "./navigation.css";
import { Link } from "react-router-dom";

export const NavigationPanel = () => {
  const [part, setPart] = useState(0);

  const active = (id) => {
    setPart(id);
  };

  return (
    <div className="navigation_container">
      {itemData.map((item) => (
        <div
          className={
            part === item.id ? "navigation_item active" : "navigation_item"
          }
          onClick={() => active(item.id)}
          key={item.id}
        >
          <p>{item.name}</p>
          <div className="_item__piece-box">
            {item.items.map((inner, ind) => (
              <Link
                to={inner.path}
                key={ind}
                className={
                  part === item.id
                    ? "navigation_item__piece active"
                    : "navigation_item__piece"
                }
              >
                {part === item.id && (
                  <>
                    {inner.icon}
                    <p>{inner.name}</p>
                  </>
                )}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const itemData = [
  {
    id: 1,
    name: "Boshqaruv",
    items: [
      { name: "Kirim qilish", icon: "", path: "" },
      { name: "Chiqim qilish", icon: "", path: "" },
      { name: "Mahsulot tayyorlash", icon: "", path: "" },
      { name: "Zararlangan taomlar", icon: "", path: "" },
    ],
  },
  {
    id: 2,
    name: "Buyurtmalar",
    items: [
      { name: "Yangi buyurtmalar", icon: "", path: "" },
      { name: "Tayyor buyurtmalar", icon: "", path: "" },
      { name: "Taomlarni boshqarish", icon: "", path: "" },
      { name: "Oldindan buuyurtma", icon: "", path: "" },
    ],
  },
  {
    id: 3,
    name: "Boshqaruv",
    items: [
      { name: "Kirim qilish", icon: "", path: "" },
      { name: "Chiqim qilish", icon: "", path: "" },
      { name: "Mahsulot tayyorlash", icon: "", path: "" },
      { name: "Zararlangan taomlar", icon: "", path: "" },
    ],
  },
  {
    id: 4,
    name: "Buyurtmalar",
    items: [
      { name: "Yangi buyurtmalar", icon: "", path: "" },
      { name: "Tayyor buyurtmalar", icon: "", path: "" },
      { name: "Taomlarni boshqarish", icon: "", path: "" },
      { name: "Oldindan buuyurtma", icon: "", path: "" },
    ],
  },
];
