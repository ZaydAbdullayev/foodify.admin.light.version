import React, { useState, memo } from "react";
import "./full-report.css";
import { useParams } from "react-router-dom";
import { DynamicTable } from "../../../hooks/generate.tags";

export const data = {
  storage_id: "e30e15",
  storage: "oshxona sklad",
  ingredient_id: "225081",
  ingredient_name: "piyoz",
  start: "2024-01-24",
  end: "2025-01-24",
  res_id: "2899b5",
  lastSynced: "2025-01-24",
  old_quantity: 0,
  income: 15,
  income_details: [
    {
      type: "Invoice Income",
      details: [
        {
          date: "2024-02-13T10:20:00.000Z",
          order: 1,
          quantity: 5,
          orders: 1,
          quantitys: 5,
          orderd: 1,
        },
        {
          date: "2024-02-13T15:50:00.000Z",
          order: 20,
          quantity: 5,
          orders: 20,
          quantitys: 5,
          orderd: 20,
        },
        {
          date: "2024-02-13T19:00:00.000Z",
          order: 5,
          quantity: 5,
          orders: 5,
          quantitys: 5,
          orderd: 5,
        },
        {
          date: "2024-02-13T15:50:00.000Z",
          order: 20,
          quantity: 5,
          orders: 20,
          quantitys: 5,
          orderd: 20,
        },
        {
          date: "2024-02-13T19:00:00.000Z",
          order: 5,
          quantity: 5,
          orders: 5,
          quantitys: 5,
          orderd: 5,
        },
      ],
    },
    {
      type: "Displacement Income",
      details: null,
    },
    {
      type: "Cutting Income",
      details: [
        {
          date: "2024-02-13T10:20:00.000Z",
          order: 1,
          quantity: 5,
        },
        {
          date: "2024-02-13T15:50:00.000Z",
          order: 20,
          quantity: 5,
        },
        {
          date: "2024-02-13T19:00:00.000Z",
          order: 5,
          quantity: 5,
        },
      ],
    },
  ],
  expense: 31,
  expense_details: [
    {
      type: "Invoice Expense",
      details: [
        {
          date: "2024-02-18T09:30:00.000Z",
          order: "1",
          price: 3000,
          quantity: 2,
        },
        {
          date: "2024-02-18T19:00:00.000Z",
          order: "2",
          price: 3000,
          quantity: 6,
        },
      ],
    },
    {
      type: "Displacement Expense",
      details: null,
    },
    {
      type: "Cutting Expense",
      details: null,
    },
    {
      type: "Damaged Expense",
      details: [
        {
          date: "2024-02-16T19:00:00.000Z",
          order: "1",
          price: 6000,
          quantity: 4,
        },
        {
          date: "2024-02-17T19:00:00.000Z",
          order: "2",
          price: 6000,
          quantity: 7,
        },
        {
          date: "2024-02-18T19:00:00.000Z",
          order: "3",
          price: 6000,
          quantity: 1,
        },
        {
          date: "2024-02-19T19:00:00.000Z",
          order: "4",
          price: 7000,
          quantity: 9,
        },
      ],
    },
  ],
  final_quantity: 16,
};

export const FullReportById = memo(() => {
  const values = useParams();
  const [type, setType] = useState(values.type || "income");
  const today = new Date().toLocaleDateString();
  const details =
    type === "income" ? data.income_details : data.expense_details;
  return (
    <div className="container full-report-container">
      <p>
        {values.start || today}-dan {values.end || today}-gacha {""}
        {values.item || "Sabzi"} uchun umumiy hisobot
      </p>
      <div className="full-report-header">
        <p>Ombor: {data.storage}</p>
        <p>Ingredient: {data.ingredient_name}</p>
        <p>Boshlang'ich miqdori: {data.old_quantity}</p>
        <p
          className={type === "income" ? "active" : ""}
          style={{ cursor: "pointer" }}
          onClick={() => setType("income")}
        >
          Kirim: {data.income}
        </p>
        <p
          className={type === "expense" ? "active" : ""}
          style={{ cursor: "pointer" }}
          onClick={() => setType("expense")}
        >
          Chiqim: {data.expense}
        </p>
        <p>Qolgan miqdori: {data.final_quantity}</p>
      </div>
      <div className="full-report-details">
        {details.map((item, index) => {
          return (
            item.details !== null && (
              <div
                className="_details-content"
                style={{ "--grid-row-table-row": item.details.length + 2 }}>
                <p>{item.type}</p>
                <DynamicTable
                  data={item?.details}
                  index={index}
                  key={`${item.type}_${index}`}
                />
              </div>
            )
          );
        })}
      </div>
    </div>
  );
});
