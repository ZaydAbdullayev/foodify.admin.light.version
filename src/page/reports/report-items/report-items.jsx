import React, { useState } from "react";
import "../../storage/storage.css";
import "../universal.css";
import { useSelector, useDispatch } from "react-redux";
import { CalculateTotalQuantity } from "../../../service/calc.service";
import { CalculateTotalCH } from "../../../service/calc.service";
// import { useNavigate } from "react-router-dom";

import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { LoadingBtn } from "../../../components/loading/loading";
import { acNavStatus } from "../../../redux/navbar.status";
import { UniversalFilterBox } from "../../../components/filter/filter";
import { useFetchDataQuery } from "../../../service/fetch.service";
import { useNavigate } from "react-router-dom";

export const ReportItems = () => {
  const [sort, setSort] = useState({ id: null, state: false });
  const [showMore, setShowMore] = useState([]);
  const navigate = useNavigate();
  console.log(showMore);
  const acItem = useSelector((state) => state.activeThing);
  const { date } = useSelector((state) => state.uSearch);
  const res_id = useSelector((state) => state.res_id);
  // const navigate = useNavigate();
  const { data = [], isLoading } = useFetchDataQuery({
    url: `get/generateFoodsReport/${res_id}/${date?.start}/${date?.end}`,
  });
  console.log(data);
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(acNavStatus([0, 3, 6, 7, 15]));
  }, [dispatch]);

  const headerData = [
    { name: "№", size: "4%" },
    { name: "Nomi", size: "14%" },
    { name: "Soni", size: "6%", position: 1 },
    {
      name: "Narxi",
      size: "19%",
      position: 1,
      items: { a_price: "O'rtalamasi", qty: "Narxi" },
    },
    {
      name: "Tan narxi",
      size: "19%",
      position: 1,
      items: { a_price: "O'rtalamasi", qty: "Narxi" },
    },
    {
      name: "Foyda",
      size: "19%",
      position: 1,
      items: { a_price: "O'rtalamasi", qty: "Narxi" },
    },
    { name: "O'rtalama narx o'sishi", size: "12%", position: 2 },
    { name: "Tafsilot", size: "7%" },
  ];

  const displayKeys = [
    { name: "name", size: "14%", position: 1 },
    { name: "quantity", size: "6%", position: 1 },
    { name: "sale_price", size: "19%", position: 1, child: true },
    { name: "prime_cost", size: "19%", position: 1, child: true },
    { name: "profit", size: "19%", position: 1, child: true },
    { name: "percentage", size: "12%", position: 2, tick: "%" },
  ];

  const displayTotalKeys = [
    { name: "name", size: "14%", position: 1, tittle: "Jami" },
    { name: "quantity", size: "6%", position: 1, flex: 1 },
    { name: "sale_price", size: "19%", position: 1, child: true },
    { name: "prime_cost", size: "19%", position: 1, flex: 1, child: true },
    { name: "profit", size: "19%", position: 1, child: true },
    { name: "percentage", size: "12%", position: 2, tick: "%", flex: 1 },
  ];

  return (
    <div className="storage_container">
      <UniversalFilterBox />
      <div className="storage_body">
        <p>
          <span>Taomlar uchun hisobot</span>
        </p>
        <div className="storage_body_item reports_item _item-header">
          {headerData?.map((item, index) => {
            return (
              <label
                onClick={() => setSort({ id: 1, state: !sort.state })}
                style={{
                  "--data-line-size": item.size,
                  justifyContent: item?.position
                    ? item?.position === 1
                      ? "center"
                      : "flex-end"
                    : "flex-start",
                }}
                key={index}
                aria-label="for sort data and see al info about this product"
              >
                <p>{item.name}</p>
                {item?.items && (
                  <>
                    <span>
                      {item?.items?.a_price}
                      {sort.id === 1 && sort.state ? (
                        <RiArrowUpSLine />
                      ) : (
                        <RiArrowDownSLine />
                      )}
                    </span>
                    <span>
                      {item?.items?.qty}
                      {sort.id === 1 && sort.state ? (
                        <RiArrowUpSLine />
                      ) : (
                        <RiArrowDownSLine />
                      )}
                    </span>
                  </>
                )}
              </label>
            );
          })}
        </div>
        <div className="storage_body_box">
          {isLoading ? (
            <span className="loader_box relative">
              <LoadingBtn />
            </span>
          ) : (
            data?.data?.map((item, index) => {
              return (
                <div
                  className={"storage_body__box"}
                  key={item.id}
                  style={{ color: item.profit < 0 ? "#f07167" : "" }}
                >
                  <div
                    className={
                      acItem === item.name
                        ? "storage_body_item active"
                        : "storage_body_item"
                    }
                  >
                    <p style={{ "--data-line-size": "4%" }}>{index + 1}</p>
                    {displayKeys?.map(
                      ({ size, position, name, tick, child }, index) => (
                        <p
                          key={index}
                          style={{
                            "--data-line-size": size,
                            justifyContent: position
                              ? position === 1
                                ? "center"
                                : "flex-end"
                              : "flex-start",
                          }}
                        >
                          {child ? (
                            <>
                              <span className="reports_span">
                                {item?.[name]?.average_price}
                              </span>
                              <span className="reports_span">
                                {item?.[name]?.total}
                              </span>
                            </>
                          ) : (
                            <>
                              {item[name]}
                              {tick}
                            </>
                          )}
                        </p>
                      )
                    )}
                    <p
                      style={{
                        "--data-line-size": "7%",
                        justifyContent: "center",
                      }}
                      onClick={() => navigate(`/view/food-report/${item.id}`)}
                    >
                      <u style={{ color: "#787aff" }}>ovqatlar</u>
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div className={"storage_body_item"} style={{ background: "#3339" }}>
            <p style={{ "--data-line-size": "4%" }}></p>
            {displayTotalKeys?.map(
              ({ size, position, tittle, name, flex, tick, child }, index) => (
                <p
                  key={index}
                  style={{
                    "--data-line-size": size,
                    justifyContent: position
                      ? position === 1
                        ? "center"
                        : "flex-end"
                      : "flex-start",
                  }}
                >
                  {tittle}
                  {child ? (
                    <>
                      <span className="reports_span">{}</span>
                      <span className="reports_span">
                        {CalculateTotalCH(data?.data, name, "total")}
                      </span>
                    </>
                  ) : (
                    flex && CalculateTotalQuantity(data?.data, name)
                  )}
                  {tick}
                </p>
              )
            )}
            <p
              style={{
                "--data-line-size": "7%",
                justifyContent: "center",
              }}
            ></p>
          </div>
        </div>
      </div>
    </div>
  );
};
