import React, { useState, useEffect, memo } from "react";
import "./addPayment.css";
import { NumericFormat } from "react-number-format";
import { useLocation, useNavigate } from "react-router-dom";
import { LoadingBtn } from "../../../components/loading/loading";
import { enqueueSnackbar as es } from "notistack";
import { useFetchDataQuery } from "../../../service/fetch.service";
import { usePatchDataMutation } from "../../../service/fetch.service";

import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { BsFillCreditCard2BackFill, BsCheckLg } from "react-icons/bs";
import { BsJournalCheck } from "react-icons/bs";
import { GiCardExchange } from "react-icons/gi";
import { FaMoneyBillAlt } from "react-icons/fa";
import { FcDebt } from "react-icons/fc";
import { MdMoneyOff } from "react-icons/md";

export const AddPayment = memo(({ active, actives }) => {
  const user = JSON.parse(localStorage.getItem("user"))?.user || "";
  const dep = JSON.parse(localStorage.getItem("department")) || "";
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const [pD, setPD] = useState([]);
  const [type, setType] = useState({ id: 1, value: "cash" });
  const id = useLocation().search?.split("order-id=").pop();
  const { data: order = [], isLoading } = useFetchDataQuery({
    url: `/get/oneOrder/${id}`,
    tags: ["order"],
  });
  const [patchData] = usePatchDataMutation();
  const [price, setPrice] = useState({ df_v: 0, extra: 0 });
  const navigate = useNavigate();

  // const calculate = () => {};

  useEffect(() => {
    const orderData = order?.innerData ? order?.innerData[0] : [];
    setOrderData(orderData);
    setPrice({
      df_v: orderData?.total || 0,
      extra: 0,
      1: orderData?.total || 0,
    });
    const productdata =
      orderData?.product_data && JSON.parse(orderData?.product_data);
    const payment_data = productdata
      ? Object.values(productdata)[0]?.pd || []
      : [];
    setPD(payment_data);
  }, [order.innerData]);

  const addPayment = async () => {
    setLoading(true);
    try {
      const res = await patchData({
        url: `/update/payment/status/${orderData.id}`,
        data: {
          payment_status:
            type.value === "cash" ? 1 : type.value === "depozit" ? 3 : 2,
          payment_type: type.value,
          paid: price?.df_v,
          cash: price?.[1] || 0,
          viaApp: price?.[3] || 0,
          bank_card: price?.[2] || 0,
          debt: price?.[4] || 0,
          no_payment: price?.[5] || 0,
          change: price?.extra || 0,
          role: dep || "not awaible",
          worker_id: user.id || "not awaible",
        },
        tags: ["order"],
      });
      if (res.data.message === "All Orders") {
        es("To'lov qilindi!", { variant: "success" });
      }
      if (res.error) {
        es(res.error.data.data, { variant: "warning" });
      }
      active(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`w100 df add_payment__container ${actives && "open_details"}`}>
      <div className="add_payment__box">
        <div className="add_payment__header">
          <pre>
            <p>Payment</p>
            <p>
              <span className="p_name">
                {orderData?.order_type === "Restoran" ? (
                  <span>Table {orderData?.table_name}</span>
                ) : (
                  <span>ID {orderData?.id}</span>
                )}
              </span>
            </p>
          </pre>
        </div>
        <div className="add_payment__body relative">
          {isLoading ? (
            <LoadingBtn />
          ) : (
            pD?.map((item) => (
              <div className="add_payment__item" key={item?.id}>
                <p>
                  <span>{item?.quantity} ta</span>
                  <span className="p_name">{item?.name}</span>
                  <NumericFormat
                    value={item?.price}
                    displayType={"text"}
                    thousandSeparator=","
                    suffix={" so'm"}
                  />
                </p>
                <div className="change_payment">
                  <button>
                    <FiEdit />
                  </button>
                  <button>
                    <MdDelete />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="add_payment__footer">
          <p>
            <span className="p_name">Service (10%)</span>
            <NumericFormat
              value={orderData?.service || 0}
              displayType={"text"}
              thousandSeparator=","
              suffix={" so'm"}
            />
          </p>
          <p>
            <span className="p_name">Jami</span>
            <NumericFormat
              value={orderData?.total}
              displayType={"text"}
              thousandSeparator=","
              suffix={" so'm"}
            />
          </p>
          {price.extra > 0 && (
            <p className="change">
              <span className="p_name">Qaytim</span>
              <NumericFormat
                value={price.extra}
                displayType={"text"}
                thousandSeparator=","
                suffix={" so'm"}
              />
            </p>
          )}
          {orderData?.payment_status === 0 && !isLoading ? (
            <>
              <div className="payment_type-options">
                {[
                  {
                    id: 1,
                    value: "cash",
                    label: "Naqd to'lov",
                    icon: <FaMoneyBillAlt />,
                  },
                  {
                    id: 3,
                    value: "viaApp",
                    label: "Click/Payme",
                    icon: <BsFillCreditCard2BackFill />,
                  },
                  {
                    id: 2,
                    value: "bank_card",
                    label: "Karta orqali",
                    icon: <GiCardExchange />,
                  },
                  { id: 4, value: "debt", label: "Qarz", icon: <FcDebt /> },
                  {
                    id: 5,
                    value: "no_payment",
                    label: "To'lanmaydi",
                    icon: <MdMoneyOff />,
                  },
                ].map((option) => (
                  <div
                    key={option.id}
                    className={
                      price.includes(option.id)
                        ? "payment_type active"
                        : "payment_type"
                    }
                    onClick={() => {
                      const i = document.getElementById("price");
                      i.value = price.df_v >= 0 ? price.df_v : 0;
                      setType(option);
                    }}>
                    {option.icon}
                    <span>
                      {price[option.id] > 0 ? price[option.id] : option.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="add_payment__button">
                <small>Olindi:</small>
                <input
                  type="number"
                  defaultValue={price?.[type.id]}
                  placeholder={price.df_v}
                  id="price"
                  onBlur={(e) =>
                    setPrice((prev) => {
                      const value = e.target.value;
                      return {
                        ...prev,
                        [type.id]:
                          value > prev.df_v && type?.id !== 1
                            ? prev.df_v
                            : value,
                        df_v: prev.df_v !== 0 ? prev.df_v - value : 0,
                        extra:
                          value > prev.df_v && type?.id === 1
                            ? value - prev.df_v
                            : 0,
                      };
                    })
                  }
                  name="price"
                />
                <span
                  className="relative"
                  onClick={() => addPayment()}
                  aria-label="add payment">
                  {loading ? <LoadingBtn /> : <BsCheckLg />}
                </span>
              </div>
            </>
          ) : (
            <div
              className="payment_type"
              onClick={() => navigate(`/get/check/${orderData?.id}`)}>
              <BsJournalCheck />
              <span aria-label="get check">Check olish</span>
            </div>
          )}
        </div>
      </div>
      <i
        onClick={() => {
          navigate("/financial");
          active(false);
          setOrderData([]);
          setPD([]);
        }}
        aria-label="close this modal"></i>
    </div>
  );
});
