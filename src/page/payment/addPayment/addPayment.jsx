import React, { useState, useEffect, memo } from "react";
import "./addPayment.css";
import { NumericFormat } from "react-number-format";
import { useLocation, useNavigate } from "react-router-dom";
import { LoadingBtn } from "../../../components/loading/loading";
import { enqueueSnackbar as es } from "notistack";
import { useFetchDataQuery } from "../../../service/fetch.service";
import { usePatchDataMutation } from "../../../service/fetch.service";
import { usePostDataMutation } from "../../../service/fetch.service";

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
  const [type, setType] = useState({
    id: 1,
    value: "cash",
  }); // ["ofline", "online"]
  const id = useLocation().search.split("?dt=").pop();
  const { data: order = [], isLoading } = useFetchDataQuery({
    url: `/get/oneOrder/${id}`,
    tags: ["order"],
  });
  const [patchData] = usePatchDataMutation();
  const [postData] = usePostDataMutation();
  const orderData = order?.innerData ? order?.innerData[0] : [];
  const [price, setPrice] = useState({ df_v: orderData?.total }); // ["ofline", "online"]
  const navigate = useNavigate();

  useEffect(() => {
    const priceElement = document.querySelector("#price");
    if (priceElement) {
      priceElement.value = price?.df_v;
    }
  }, [price.df_v, type]);

  const addPayment = async () => {
    const trsn = {
      res_id: user.id,
      transaction_group: "income",
      cashier_receiver: dep,
      activity_kind: "income",
      payment_type: type.value,
      amount: price ? price : orderData?.total,
      description: "",
      transaction_type: "income",
      transaction_category: "food_income",
    };
    setLoading(true);
    try {
      const res = await patchData({
        url: `/update/payment/status/${orderData.id}`,
        data: {
          payment_status:
            type.value === "cash" ? 1 : type.value === "depozit" ? 3 : 2,
          payment_type: type.value,
          paid: price ? price : orderData?.total,
          role: dep || "not awaible",
          worker_id: user.id || "not awaible",
        },
        tags: ["order"],
      });
      const second_res = await postData({
        url: "add/transaction",
        data: trsn,
        tags: ["cashbox-transaction"],
      });
      if (
        res.data.message === "All Orders" &&
        second_res.data.message === "All Orders"
      ) {
        es("To'lov qilindi!", { variant: "success" });
      }
      if (res.error) {
        es(res.error.data.data, { variant: "warning" });
        console.log(1);
      }
      // navigate(window.location.pathname + window.location.search, {
      //   replace: true,
      // });
      active(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const productdata =
    orderData.product_data && JSON.parse(orderData.product_data);
  const payment_data = productdata
    ? Object.values(productdata)[0]?.pd || []
    : [];

  return (
    <div
      className={
        actives
          ? "add_payment__container open_details"
          : "add_payment__container"
      }>
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
            payment_data?.map((item) => {
              return (
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
              );
            })
          )}
        </div>
        <div className="add_payment__footer">
          <p>
            <span className="p_name">Service (10%)</span>
            <NumericFormat
              value={orderData?.service}
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
          {orderData?.payment_status === 0 ? (
            <>
              <div className="payment_type-options">
                <div
                  className={
                    type.id === 1 ? "payment_type active" : "payment_type"
                  }
                  onClick={() => setType({ id: 1, value: "cash" })}>
                  <FaMoneyBillAlt />
                  <span>
                    {price?.[1] > 0 ? price?.[type?.id] : "Naqd to'lov"}
                  </span>
                </div>
                <div
                  className={
                    type.id === 3 ? "payment_type active" : "payment_type"
                  }
                  onClick={() => setType({ id: 3, value: "credit" })}>
                  <GiCardExchange />
                  <span>
                    {price?.[3] > 0 ? price?.[type?.id] : "Click/Payme"}
                  </span>
                </div>
                <div
                  className={
                    type.id === 2 ? "payment_type active" : "payment_type"
                  }
                  onClick={() =>
                    setType({
                      id: 2,
                      comment: "Pul o'tkazma",
                      value: "bank_card",
                    })
                  }>
                  <BsFillCreditCard2BackFill />
                  <span>
                    {price?.[2] > 0 ? price?.[type?.id] : "Karta orqali"}
                  </span>
                </div>
                <div
                  className={
                    type.id === 4 ? "payment_type active" : "payment_type"
                  }
                  onClick={() => setType({ id: 4, value: "debit" })}>
                  <FcDebt />
                  <span>{price?.[4] > 0 ? price?.[type?.id] : "Qarz"}</span>
                </div>
                <div
                  className={
                    type.id === 5 ? "payment_type active" : "payment_type"
                  }
                  onClick={() =>
                    setType({
                      id: 5,
                      value: "not_paid",
                    })
                  }>
                  <MdMoneyOff />
                  <span>
                    {price?.[5] > 0 ? price?.[type?.id] : "To'lanmaydi"}
                  </span>
                </div>
              </div>
              <div className="add_payment__button">
                <small>Olindi:</small>
                <input
                  type="number"
                  value={price.df_v}
                  id="price"
                  onChange={(e) =>
                    setPrice((prev) => {
                      const value = e.target.value;
                      return {
                        ...prev,
                        [type?.id]: value > prev?.df_v ? prev?.df_v : value,
                        df_v:
                          value > prev?.df_v
                            ? prev?.df_v
                            : prev?.df_v !== 0
                            ? prev?.df_v - value
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
        }}
        aria-label="close this modal"></i>
    </div>
  );
});
