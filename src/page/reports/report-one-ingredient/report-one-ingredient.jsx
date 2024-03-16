import React, { useState } from "react";
import "../../storage/storage.css";
import "../universal.css";
import "./report-one-ingredient.css";
import { useSelector, useDispatch } from "react-redux";
import { storageD } from "../../storage/store-data";
import { acNavStatus } from "../../../redux/navbar.status";

import { LoadingBtn } from "../../../components/loading/loading";
import { UniversalFilterBox } from "../../../components/filter/filter";
import { useFetchDataQuery } from "../../../service/fetch.service";

export const ReportOneIngredient = () => {
  const [part, setPart] = useState(1);
  const res_id = useSelector((state) => state.res_id);
  const { data: storeData = [] } = useFetchDataQuery({
    url: `get/storage/${res_id}`,
    tags: ["store"],
  });
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(acNavStatus([0, 6, 7, 9, 13, 15]));
  }, [dispatch]);
  console.log(storeData);
  const isLoading = false;

  //   const sortData =
  //     storeData?.data &&
  //     [...storeData?.data]?.sort((a, b) => {
  //       if (sort.state) {
  //         return a.name.localeCompare(b.name);
  //       } else {
  //         return b.name.localeCompare(a.name);
  //       }
  //     });

  const firstHeaderKeys = [
    "Kun",
    "Kirim",
    "Boshqa ombordan kirim",
    "Maydalash",
    "Ingrediyent tayyorlash",
    "Boshqa Restorandan kirim",
  ];

  const fakeData_first = [
    {
      date: "January 1 2024",
      invoiceIncome: 100,
      displacementIncome: 100,
      cuttinIncome: 100,
      makingFoodIncome: 100,
      resMovementIncome: 100,
    },
    {
      date: "January 2 2024",
      invoiceIncome: 100,
      displacementIncome: 100,
      cuttinIncome: 100,
      makingFoodIncome: 100,
      resMovementIncome: 100,
    },
    {
      date: "January 3 2024",
      invoiceIncome: 100,
      displacementIncome: 100,
      cuttinIncome: 100,
      makingFoodIncome: 100,
      resMovementIncome: 100,
    },
  ];

  const SecondeHeaderKeys = [
    "Kun",
    "Chiqim",
    "Xarajatlar uchun",
    "Maydalash",
    "Ingredient tayyorlash",
    "Yarim tayyor mahsulotlar uchun",
    "Hisoblar",
    "Boshqa restorga chiqim",
  ];

  const firstDisplayKeys = [
    "date",
    "invoiceIncome",
    "displacementIncome",
    "cuttinIncome",
    "makingFoodIncome",
    "resMovementIncome",
  ];

  const SecondeDisplayKeys = [
    "date",
    "invoiceExpense",
    "displacementExpense",
    "cuttinExpense",
    "makingFoodExpense",
    "makingSemiFoodsExpense",
    "accounts",
    "resMovementExpense",
  ];

  const headerKeys = part === 1 ? firstHeaderKeys : SecondeHeaderKeys;
  const displayKeys = part === 1 ? firstDisplayKeys : SecondeDisplayKeys;

  return (
    <div className="storage_container">
      <UniversalFilterBox />
      <div className="row-table">
        <p style={{ "--extra-w": fakeData_first.length + 1 }}>
          <span>
            {part === 1
              ? "Mahsulotning kirim hisoboti"
              : "Mahsulotning chiqim hisoboti "}
          </span>
        </p>
        <div className="row-table-item">
          {headerKeys?.map((item, index) => {
            return (
              <label>
                <p key={index}>{item}</p>
              </label>
            );
          })}
        </div>
        <div className="row-table-box">
          {isLoading ? (
            <span className="loader_box relative">
              <LoadingBtn />
            </span>
          ) : (
            fakeData_first?.map((item, index) => {
              return (
                <div
                  className={"row-table-item"}
                  key={item.id}
                  style={{ color: item.profit < 0 ? "#f07167" : "" }}
                >
                  {displayKeys?.map((key, ind) => (
                    <label key={ind}>
                      <p>{item[key]}</p>
                    </label>
                  ))}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
