import React from "react";
import "./inventory.css";
import { useLocation, useNavigate } from "react-router-dom";

import { IoIosArrowForward } from "react-icons/io";

export const Inventory = () => {
  const navigate = useNavigate();
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
              key={`${itm?.path}_${ind}`}
              onClick={() => navigate(`/restaurant-inventory/${itm?.path}`)}>
              <p>{itm?.name}</p>
              <IoIosArrowForward />
            </label>
          );
        })}
      </div>
    </div>
  );
};

export const InventoryHistory = () => {
  const navigate = useNavigate();
  return (
    <div className="w100 df flc inventory-history">
      <p className="w100 df aic jcc inventory-title">
        Inventarizatdiyalar tarixi
      </p>
      <div className="w100 df aic inventory-box inventory-hy-box">
        <div
          className="df flc inventory-item"
          onClick={() => navigate(`/restaurant-detail/1233`)}>
          <p className="w100 df aic jcsb">
            Ombor: <span>Bar</span>
          </p>
          <p className="w100 df aic jcsb">
            # <span>1</span>
          </p>
          <p className="w100 df aic jcsb">
            Vaqti: <span>03.04</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export const InventoryDetail = () => {
  const location = useLocation();
  return (
    <div className="w100 df flc inventory-detail">
      <p className="w100 df aic jcc inventory-title">Inventarizatsiya</p>
      <div className="w100 inventory-table-container">
        <table className="w100 inventory-table" border={1}>
          <thead>
            <tr>
              <th>Maxsulot</th>
              <th>O'lchov birligi</th>
              <th>Oldigni soni</th>
              <th>Keyingi soni</th>
              <th>Farq</th>
              <th>1x narxi</th>
              <th>Narxdagi farq</th>
              <th>Hozirgi balans</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                name: "Oshxona",
                size: "kg",
                count: 100,
                left: 20,
                price: 1000,
              },
              {
                name: "Oshxona",
                size: "kg",
                count: 100,
                left: 20,
                price: 1000,
              },
              {
                name: "Oshxona",
                size: "kg",
                count: 100,
                left: 20,
                price: 1000,
              },
            ]?.map((itm, ind) => {
              return (
                <tr key={`${itm?.name}_${ind}`}>
                  <td>{itm?.name}</td>
                  <th>{itm?.size}</th>
                  <th>{itm?.count}</th>
                  <th>{itm?.left}</th>
                  <th>{itm?.count - itm?.left}</th>
                  <th>{itm?.price}</th>
                  <th>{(itm?.count - itm?.left) * itm?.price}</th>
                  <th>{itm?.left * itm?.price}</th>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
