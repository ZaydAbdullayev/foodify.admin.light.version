import React from "react";
import "./inventory.css";

import { IoIosArrowForward } from "react-icons/io";

export const Inventory = () => {
  return (
    <div className="w100 df flc inventory-container">
      <div className="w100 df aic jcc inventory-title">
        <big>Inventarizatsiya</big>
      </div>
      <div className="w100 df aic inventory-box">
        {[
          { name: "Invantarizatsiya tarixi", path: "history" },
          { name: "Invantarizatsiya qilish", path: "new-inventory" },
        ]?.map((itm, ind) => {
          return (
            <label
              className="df aic jcsb inventory-item"
              key={`${itm?.path}_${ind}`}>
              <p>{itm?.name}</p>
              <IoIosArrowForward />
            </label>
          );
        })}
      </div>
    </div>
  );
};
