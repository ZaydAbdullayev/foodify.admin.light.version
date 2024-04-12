import React from "react";
import "./statistics.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { IoIosArrowForward } from "react-icons/io";
import { DonutChart } from "./statistics";
import { GoDotFill } from "react-icons/go";
import { MdTableBar } from "react-icons/md";
import { DataBill } from "./layout.statis";
import { acAddBill } from "../../redux/active";

export const BillsReport = () => {
  const { data = [], billsData = [], defaultPie } = DataBill();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div className="w100 df flc bills-report">
      <div className="w100 df aic jcc bills-report-header">
        <DonutChart data={defaultPie} billsData={billsData} />
        <div className="df flc item-info">
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
      <div className="w100 df aic bills-report-box">
        {billsData?.map((bill) => {
          const time = new Date(bill?.receivedAt);
          const close =
            bill?.closed_at !== "0000-00-00" ? new Date(bill?.closed_at) : null;
          return (
            <div
              className="df flc jcc bills-item"
              onClick={() => {
                dispatch(acAddBill(bill));
                navigate(`/one-bill-report/${bill?.id}`);
              }}
              key={bill?.id}>
              <div className="bills-item__title">
                <b>#{bill?.id?.split("_")[0]}</b>
                <b>
                  {bill?.total?.toString()?.replace(/\d(?=(\d{3})+$)/g, "$& ")}
                </b>
              </div>
              <div className="bills-item__value">
                <span>
                  {`${time?.toLocaleDateString("us-US", {
                    day: "numeric",
                    month: "long",
                  })}`}
                  , {time?.getFullYear()},{" "}
                  {time.getHours() === 0
                    ? `0${time.getHours()}`
                    : time.getHours()}
                  :
                  {time.getMinutes() === 0
                    ? `0${time.getMinutes()}`
                    : time.getMinutes()}{" "}
                  {close &&
                    `- ${
                      close.getHours() === 0
                        ? `0${close.getHours()}`
                        : close.getHours()
                    }:${
                      close.getMinutes() === 0
                        ? `0${close.getMinutes()}`
                        : close.getMinutes()
                    }`}
                </span>
                <span>{bill?.worker_name}</span>
              </div>
              <i>
                <IoIosArrowForward />
              </i>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const BillReportById = () => {
  const bills = useSelector((state) => state?.activeB);
  const time = new Date(bills?.receivedAt);
  const close =
    bills?.closed_at !== "0000-00-00" ? new Date(bills?.closed_at) : null;

  const parsedD = bills?.product_data ? JSON?.parse(bills?.product_data) : [];
  const ingD = Object.values(parsedD)?.[0]?.pd;

  console.log("pd", parsedD, ingD);
  // const ingD = Object.values();
  // category: "Ichimliklar";
  // category_id: "965cf2";
  // date: "2024-03-08T19:00:00.000Z";
  // department: "Bar";
  // description: "jkh";
  // id: "f8ac02";
  // img: "https://localhost:8081/add/product/img_1138d878.jpg";
  // name: "uyi";
  // price: "786";
  // prime_cost: "3700";
  // profit: "-2914";
  // quantity: 4;
  // res_id: "2899b5";
  // status: 1;
  // stop_list: 100;
  // storage: "Bar ombori";
  // type: "taom";
  return (
    <div className="w100 df aic flc single-bill-report">
      <span>#{bills?.id}</span>
      <div className="w100 df aic _bill-info">
        <label>
          <small>Buyurtma raqami</small>
          <p>#{bills?.id}</p>
        </label>
        <label>
          <small>Vaqti</small>
          <p>
            {`${time?.toLocaleDateString("us-US", {
              day: "numeric",
              month: "long",
            })}`}
            , {time?.getFullYear()},{" "}
            {time.getHours() === 0 ? `0${time.getHours()}` : time.getHours()}:
            {time.getMinutes() === 0
              ? `0${time.getMinutes()}`
              : time.getMinutes()}{" "}
            {close &&
              `- ${
                close.getHours() === 0
                  ? `0${close.getHours()}`
                  : close.getHours()
              }:${
                close.getMinutes() === 0
                  ? `0${close.getMinutes()}`
                  : close.getMinutes()
              }`}
          </p>
        </label>
        <label>
          <small>Offitsant</small>
          <p>{bills?.worker_name}</p>
        </label>
        <label>
          <small>Stoll/Xona</small>
          <p className="df aic" style={{ gap: "5px" }}>
            {bills?.t_location} <MdTableBar /> {bills?.table_name}
          </p>
        </label>
        <label>
          <small>Chegirma</small>
          <p>{bills?.discount}%</p>
        </label>
        <label>
          <small>Service</small>
          <p>{bills?.service}%</p>
        </label>
        <label>
          <small>Jami summa</small>
          <p>{bills?.total?.toString()?.replace(/\d(?=(\d{3})+$)/g, "$& ")}</p>
        </label>
      </div>
      <div className="w100 df aic _bill-details">
        {ingD?.map((product, ind) => {
          return (
            <div className="df aic _details_item" key={`${product?.id}_${ind}`}>
              <pre>
                <p style={{ textTransform: "capitalize" }}>{product?.name}</p>
                <small>
                  {product?.price
                    ?.toString()
                    ?.replace(/\d(?=(\d{3})+$)/g, "$&,")}
                  x {product?.quantity}
                </small>
              </pre>
              <span>
                {(product?.price * product?.quantity)
                  ?.toString()
                  ?.replace(/\d(?=(\d{3})+$)/g, "$&,")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
