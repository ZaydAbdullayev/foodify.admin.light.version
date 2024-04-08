import React from "react";
import "./statistics.css";
import { IoIosArrowForward } from "react-icons/io";
import { useFetchDataQuery } from "../../service/fetch.service";
import { DonutChart } from "./statistics";
import { GoDotFill } from "react-icons/go";
import { DataBill } from "./layout.statis";

export const BillsReport = () => {
  const user = JSON.parse(localStorage.getItem("user"))?.user || null;
  const { data = [] } = DataBill();
  // const { data: df = [] } = useFetchDataQuery({
  //   url: `/get/resOrders/${user?.id}/2024-01-01/2024-04-07`,
  //   tags: ["report"],
  // });
  const defaultPie = data?.length
    ? data
    : [{ value: 360, cl: "red", type: "" }];
  return (
    <div className="bills-report">
      <div className="bills-report-header">
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
      <div className="bills-report-box">
        <div className="bills-item">
          <div className="bills-item__title">
            <b>A1</b>
            <b>8000</b>
          </div>
          <div className="bills-item__value">
            <span>Mart 8, 2024, 15:17</span>
            <span>Admin</span>
          </div>
          <i>
            <IoIosArrowForward />
          </i>
        </div>
        <div className="bills-item">
          <div className="bills-item__title">
            <b>A1</b>
            <b>8000</b>
          </div>
          <div className="bills-item__value">
            <span>Mart 8, 2024, 15:17</span>
            <span>Admin</span>
          </div>
          <i>
            <IoIosArrowForward />
          </i>
        </div>
        <div className="bills-item">
          <div className="bills-item__title">
            <b>A1</b>
            <b>8000</b>
          </div>
          <div className="bills-item__value">
            <span>Mart 8, 2024, 15:17</span>
            <span>Admin</span>
          </div>
          <i>
            <IoIosArrowForward />
          </i>
        </div>
      </div>
    </div>
  );
};
