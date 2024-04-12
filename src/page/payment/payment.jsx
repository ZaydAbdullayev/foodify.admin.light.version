import React, { useState } from "react";
import "./payment.css";
import { useNavigate } from "react-router-dom";
import { AddPayment } from "./addPayment/addPayment";
import { useDispatch, useSelector } from "react-redux";
import { acNavStatus } from "../../redux/navbar.status";
import { DatePicker, Segmented, Result, Button } from "antd";
import dayjs from "dayjs";
import { useFetchDataQuery } from "../../service/fetch.service";
import { MdTableBar } from "react-icons/md";
const { RangePicker } = DatePicker;

export const Payment = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("openOrders");
  // const [data, setData] = useState("openOrders");
  const res_id = useSelector((state) => state?.res_id);
  // const search = useLocation().search?.split("=").pop();
  const [date, setDate] = useState({
    start: "2021-01-01",
    end: new Date().toISOString().split("T")[0],
  });
  const { data: ordersData = [] } = useFetchDataQuery({
    url: `/get/ordersForCashier/${res_id}/${date.start}/${date.end}`,
    tags: ["order"],
  });
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(acNavStatus([100]));
  }, [dispatch]);

  const getDetails = (order) => {
    navigate(`/financial?total-price=${order?.total}&&order-id=${order?.id}`);
    setOpen(true);
  };

  return (
    <div className="payment_container">
      <div className="document_header">
        <h1>To'lov kiritish</h1>
        <div className="filter_date">
          <Segmented
            options={[
              { label: "Ochiq", value: "openOrders" },
              { label: "Yopiq", value: "closedOrders" },
              { label: "Qarz", value: "debtOrders" },
            ]}
            onChange={(e) => setType(e)}
          />
          <RangePicker
            defaultValue={[dayjs(date.start), dayjs(date.end)]}
            aria-label="select data from to end"
            onChange={(date, dateString) =>
              setDate({
                start: dateString?.[0],
                end: dateString?.[1],
              })
            }
          />
        </div>
      </div>
      {ordersData?.innerData?.[type] ? (
        ordersData?.innerData?.[type]?.map((item, index) => {
          const reverseIndex = ordersData?.innerData?.[type]?.length - index;
          const p_data = JSON?.parse(item?.product_data);
          const payment_data = Object.values(p_data)[0]?.pd;
          const closedTime =
            item?.closed_at !== "0000-00-00"
              ? item?.closed_at?.split("T")[1]?.split(".")[0].slice(0, 5)
              : false;
          return (
            <div className="payment_item" key={item.id}>
              <i
                className={
                  item.payment_status === 1
                    ? `payment_tick`
                    : `payment_tick not_paid`
                }></i>
              <span className="payment_item-header">
                <small>{item.order_type} </small>{" "}
                <small>
                  {item.receivedAt?.split("T")[1]?.split(".")[0].slice(0, 5)}{" "}
                  {closedTime === false ? "" : ` — ${closedTime}`}
                </small>
                <small></small>
              </span>
              <p>
                <span className="p_name">
                  {item.order_type === "offline" ? (
                    <span>
                      {item.t_location}{" "}
                      <MdTableBar style={{ paddingTop: "1px" }} />{" "}
                      {item.table_name}
                    </span>
                  ) : (
                    <span>{item.id}</span>
                  )}
                </span>
                <span>{`#${reverseIndex}`}</span>
              </p>
              <ul className="p_data_box">
                <p>
                  <span>QT</span> <span className="p_name">Menu</span>{" "}
                  <span>price</span>
                </p>
                {payment_data?.map((product) => {
                  return (
                    <li key={product?.id}>
                      <span>{product?.quantity}</span>
                      <span className="p_name">{product?.name}</span>
                      <span>
                        {product?.price.replace(/\d(?=(\d{3})+$)/g, "$&,")} so'm
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p style={{ lineHeight: "2" }}>
                <span className="p_name">To'lov narxi</span>
                <span>{item?.total} so'm</span>
              </p>
              <div className="p_btn__box">
                <button
                  onClick={() => getDetails(item)}
                  aria-label="Edit this product for payment">
                  Edit
                </button>
                <button
                  onClick={() => getDetails(item)}
                  aria-label="Payment this product for payment">
                  Payment
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <figure className="no_result">
          <Result
            status="403"
            title={`${type} buyurtma yo'q`}
            subTitle={`${type} buyurtma topilmadi yoki mavjud emas!`}
            extra={
              <Button onClick={() => window.location.reload()}>
                Sahifani yangilash
              </Button>
            }
          />
        </figure>
      )}
      <AddPayment active={setOpen} actives={open} />
    </div>
  );
};
