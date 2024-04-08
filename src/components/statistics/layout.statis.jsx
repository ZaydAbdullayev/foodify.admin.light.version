import React, { memo } from "react";
import "./statistics.css";
import { DonutChart } from "./statistics";
import { useFetchDataQuery } from "../../service/fetch.service";

import { FaMoneyBillAlt } from "react-icons/fa";
import { BsFillCreditCard2BackFill } from "react-icons/bs";
import { GiCardExchange } from "react-icons/gi";
import { FcDebt } from "react-icons/fc";
import { MdMoneyOff } from "react-icons/md";
import { GoDotFill } from "react-icons/go";

export const Statistics = memo(() => {
  const user = JSON.parse(localStorage.getItem("user"))?.user || null;
  const { data, defaultPie } = DataBill();
  // const { data = [] } = useFetchDataQuery({
  //   url: `/generate/ordersReport/${user?.id}/2024-01-01/2024-04-07`,
  //   tags: ["report"],
  // });

  // /get/resOrders/:resId/:start/:end

  return (
    <div className="statistic_box">
      <div className="wrapper_item">
        <div className="row">
          {statsData.map((item) => (
            <div key={item.id} className={`dashboard-stat ${item?.bg}`}>
              <div className="visual">{item.icon}</div>
              <div className="details">
                <div className="number">
                  <span>{item.value}</span>
                </div>
                <div className="desc">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="statistic_product">
        <DonutChart data={defaultPie} />
        <div className="item-info">
          {data?.every((item) => item?.value === 0) ? (
            <p>
              <GoDotFill style={{ color: "#353535" }} />
              <span>Ma'lumot yo'q</span>
            </p>
          ) : (
            data?.map((item) => {
              return (
                <p
                  key={`${item?.type}_${item?.id}`}
                  style={{ opacity: item?.value <= 0 ? 0.2 : 1 }}>
                  <GoDotFill style={{ color: item?.cl }} />
                  <b>{item?.type}</b>
                </p>
              );
            })
          )}
        </div>
      </div>

      <div className="full_analystic"></div>
    </div>
  );
});

const statsData = [
  {
    id: 1,
    type: "cash",
    label: "Naqd to'lov",
    icon: <FaMoneyBillAlt />,
    value: 2200,
    bg: "red",
    direction: "top",
  },
  {
    id: 3,
    type: "credit",
    label: "Click/Payme",
    icon: <BsFillCreditCard2BackFill />,
    value: 30222,
    bg: "blue",
    direction: "left",
  },
  {
    id: 2,
    type: "bank_card",
    label: "Karta orqali",
    icon: <GiCardExchange />,
    value: 100000,
    bg: "hoki",
    direction: "left",
  },
  {
    id: 4,
    type: "debit",
    label: "Qarz",
    icon: <FcDebt />,
    value: 230000,
    bg: "purple",
    direction: "rightBottom",
  },
  {
    id: 5,
    type: "no_payment",
    label: "To'lanmaydi",
    icon: <MdMoneyOff />,
    value: 180000,
    bg: "green ",
    direction: "bottom",
  },
];

export const DataBill = () => {
  const user = JSON.parse(localStorage.getItem("user"))?.user || null;
  const { data = [] } = useFetchDataQuery({
    url: `/generate/ordersReport/${user?.id}/2024-01-01/2024-04-07`,
    tags: ["report"],
  });

  const defaultPie = data?.data?.length
    ? data?.data
    : [{ value: 360, cl: "red", type: "" }];

  return { data: data?.data, defaultPie };
};
