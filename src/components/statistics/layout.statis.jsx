import React, { memo } from "react";
import "./statistics.css";
import { Example } from "./statistics";
import { useFetchDataQuery } from "../../service/fetch.service";

import { FaMoneyBillAlt } from "react-icons/fa";
import { BsFillCreditCard2BackFill } from "react-icons/bs";
import { GiCardExchange } from "react-icons/gi";
import { FcDebt } from "react-icons/fc";
import { MdMoneyOff } from "react-icons/md";
import { GoDotFill } from "react-icons/go";

export const Statistics = memo(() => {
  const user = JSON.parse(localStorage.getItem("user"))?.user || null;
  const { data = [] } = useFetchDataQuery({
    url: `/generate/ordersReport/${user?.id}/2024-01-01/2024-04-03`,
    tags: ["report"],
  });

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
                  <span>{item.number}</span>
                </div>
                <div className="desc">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="statistic_product">
        <Example data={data?.data} />
        <div className="item-info">
          {data?.data?.every((item) => item?.value === 0) ? (
            <p>
              <GoDotFill style={{ color: "#353535" }} />
              <span>Ma'lumot yo'q</span>
            </p>
          ) : (
            data?.data?.map((item) => {
              return (
                <p key={`${item?.type}_${item?.id}`}>
                  <GoDotFill style={{ color: item?.cl }} />
                  <span>{item?.type}</span>
                </p>
              );
            })
          )}
        </div>
      </div>
      <div className="full_analystic">{/* <DemoDualAxes /> */}</div>
    </div>
  );
});

const statsData = [
  {
    id: 1,
    value: "cash",
    label: "Naqd to'lov",
    icon: <FaMoneyBillAlt />,
    number: 222000,
    bg: "red",
  },
  {
    id: 3,
    value: "credit",
    label: "Click/Payme",
    icon: <BsFillCreditCard2BackFill />,
    number: 222000,
    bg: "blue",
  },
  {
    id: 2,
    value: "bank_card",
    label: "Karta orqali",
    icon: <GiCardExchange />,
    number: 222000,
    bg: "hoki",
  },
  {
    id: 4,
    value: "debit",
    label: "Qarz",
    icon: <FcDebt />,
    number: 222000,
    bg: "purple",
  },
  {
    id: 5,
    value: "no_payment",
    label: "To'lanmaydi",
    icon: <MdMoneyOff />,
    number: 222000,
    bg: "green ",
  },
];
