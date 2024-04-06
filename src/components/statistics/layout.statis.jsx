import React, { memo } from "react";
import "./statistics.css";
import { Example } from "./statistics";
import { useFetchDataQuery } from "../../service/fetch.service";

import { IoLogoUsd, IoStatsChart } from "react-icons/io5";
import { BsFillCreditCard2FrontFill } from "react-icons/bs";
import { FaComment } from "react-icons/fa6";

export const Statistics = memo(() => {
  const user = JSON.parse(localStorage.getItem("user"))?.user || null;
  const { data = [] } = useFetchDataQuery({
    url: `/generate/ordersReport/${user?.id}/2024-01-01/2024-04-03`,
    tags: ["report"],
  });
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
                <div className="desc">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="statistic_product">
        <Example />
      </div>
      <div className="full_analystic">
        {/* <DemoDualAxes /> */}
      </div>
    </div>
  );
});

const statsData = [
  {
    id: 1,
    icon: <IoLogoUsd />,
    number: 312,
    desc: "Total Profit",
    bg: "red",
  },
  {
    id: 2,
    icon: <BsFillCreditCard2FrontFill />,
    number: 12.5,
    desc: "New Order",
    bg: "blue",
  },
  {
    id: 3,
    icon: <IoStatsChart />,
    number: "+ 53%",
    desc: "Popularity",
    bg: "hoki",
  },
  {
    id: 4,
    icon: <FaComment />,
    number: 689,
    desc: "New Feedback",
    bg: "purple",
  },
];
