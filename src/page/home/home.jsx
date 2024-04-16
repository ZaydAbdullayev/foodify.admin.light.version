import React, { useState, useEffect, useCallback } from "react";
import "./home.css";
import { usePostDataMutation } from "../../service/fetch.service";
import { useDispatch } from "react-redux";
import { enqueueSnackbar as es } from "notistack";
import { acNavStatus } from "../../redux/navbar.status";
import { NumericFormat } from "react-number-format";
import socket from "../../socket.config";
import { useNavigate } from "react-router-dom";
import { Segmented, Result, Button, Tag, ConfigProvider } from "antd";
import { getWeekDay } from "../../service/calc-date.service";
import { GetRealTime } from "../../hooks/generate.tags";

import { BsCheck2All } from "react-icons/bs";
import { HiCheck } from "react-icons/hi";
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { RiBoxingFill } from "react-icons/ri";
import { GiCook } from "react-icons/gi";
import { MdFastfood } from "react-icons/md";
import { acNothification } from "../../redux/nothification";

export const Home = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const dep = JSON.parse(localStorage.getItem("department")) || null;
  const id = user.user?.id || null;
  const permissions = JSON.parse(localStorage.getItem("permissions")) || [
    "Bar",
    "Oshxona",
  ];
  const [page, setPage] = useState(1);
  const [params, setParams] = useState({
    s: `/get/newOrderOne/${id}`,
    b: `get/orders/${id}`,
    oa: "reject",
  });
  const [situation, setSituation] = useState(false);
  const [orders, setOrders] = useState([]);
  const [full, setFull] = useState(dep === "oshpaz");
  const [selectedTags, setSelectedTags] = useState(permissions);
  const [tags, setTags] = useState(["Hammasi"]);
  const [postData] = usePostDataMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getData = useCallback(
    async (deps) => {
      try {
        const res = await postData({
          url: params?.b,
          data: { departments: deps },
          tags: [""],
        });
        setOrders(res?.data?.innerData);
      } catch (err) {
        console.log(err);
      }
    },
    [params, postData]
  );

  useEffect(() => {
    dispatch(acNavStatus([100]));
    getData(selectedTags);
  }, [dispatch, selectedTags, getData, postData]);

  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    setSelectedTags(nextSelectedTags);
    setTags(nextSelectedTags.length === permissions?.length ? ["Hammasi"] : []);
    getData(nextSelectedTags);
  };

  const handleChangeH = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    setTags(nextSelectedTags);
    if (checked) {
      setSelectedTags(permissions);
    } else {
      setSelectedTags([]);
    }
  };

  useEffect(() => {
    if (page === 1) {
      socket.on(`/get/newOrders/${id}`, (data) => {
        setOrders(data);
        dispatch(acNothification(true));
      });
      return () => {
        socket.off(`/get/newOrders/${id}`);
      };
    }
  }, [dispatch, id, page]);

  useEffect(() => {
    socket.on(params?.s, (newData) => {
      setOrders((prevOrders) => {
        const existingOrder = prevOrders?.find(
          (order) => order?.id === newData.id
        );
        if (existingOrder) {
          if (newData?.deleted) {
            return prevOrders?.filter((order) => order?.id !== newData.id);
          } else {
            return prevOrders?.map((order) =>
              order?.id === newData.id ? newData : order
            );
          }
        } else {
          return [...prevOrders, newData];
        }
      });
    });
    return () => {
      socket.off(params?.s);
    };
  }, [params?.s, dispatch]);

  const orderAccept = (order, ac) => {
    try {
      socket.emit("/accept/order", {
        status: true,
        variant: order?.status,
        user_id: order?.user_id,
      });
      socket.emit("/update/order/status", { data: order, action: ac });
      if ((dep === "kassir" || dep === "owner") && page === 1) {
        socket.emit("/divide/orders/depart", order);
      }
      setSituation({ status: order?.status, id: order?.id });
    } catch (err) {
      es("Xatolik yuz berdi!", { variant: "warning" });
    }
  };

  const orderSituation = (order) => {
    try {
      socket.emit("/accept/order", {
        status: true,
        variant: order?.status,
        user_id: order?.user_id,
      });
      socket.emit("/update/ProductSt", order);
      if (
        orders.find(({ id, status }) => id === order?.order_id && status === 3)
      ) {
        setSituation(order?.order_id);
      }
    } catch (err) {
      es("Xatolik yuz berdi!", { variant: "warning" });
    }
  };

  return (
    <div className={"container_box home_page" + (full ? " active" : "")}>
      <div className="_orders">
        <div className="orders-header">
          <span>
            <label>
              <small>
                {`${new Date().toLocaleDateString("us-US", {
                  day: "numeric",
                  month: "long",
                })}`}
                ,
              </small>
              <small>{`${getWeekDay(new Date().getDay())}`}</small>
            </label>
            {"  "}
            <GetRealTime />
          </span>
          <Segmented
            options={[
              { label: <RiBoxingFill />, value: 1 },
              { label: <GiCook />, value: 2 },
              { label: <MdFastfood />, value: 3 },
            ]}
            onChange={(p) => {
              setPage(p);
              setOrders([]);
              if (p === 1) {
                setParams({
                  s: `/get/newOrderOne/${id}`,
                  b: `get/orders/${id}`,
                  oa: "reject",
                });
              } else if (p === 2) {
                setParams({
                  s: `/get/makingOrderOne/${id}`,
                  b: `get/foodsBeingMade/${id}`,
                  oa: "back",
                });
              } else {
                setParams({
                  s: `/get/readyOrderOne/${user?.id}`,
                  b: `get/readyFoods/${id}`,
                  oa: "backToKitchen",
                });
              }
            }}
          />
          <i></i>
          <Button onClick={() => navigate("/restaurant-all-items")}>
            Stop-list
          </Button>
          {dep !== "oshpaz" && (
            <b
              onClick={() => setFull(!full)}
              aria-label={full ? "Exit full screen" : "Full screen"}>
              {full ? <AiOutlineFullscreenExit /> : <AiOutlineFullscreen />}
            </b>
          )}
        </div>

        {orders?.length ? (
          <div className={full ? "orders_body fullScreen" : "orders_body"}>
            {orders?.map((order) => {
              const pds = order?.product_data
                ? JSON?.parse(order?.product_data)
                : {};
              const pdArray = Object?.values(pds)?.[0];
              const orderNum = Object?.keys(pds)?.[0];
              const { pd = [], received_at = "" } = pdArray ?? {};
              const del = pd?.filter((p) =>
                selectedTags.includes(p?.department)
              );
              return (
                <div
                  key={order?.id}
                  className={
                    situation.id === order.id && situation.status !== 2
                      ? "accepted"
                      : ""
                  }
                  style={{
                    "--grid-col": full ? 1 : 1.5,
                    "--grid-row": pd?.length + 1,
                    display: order?.deleted || !del.length ? "none" : "flex",
                  }}>
                  <figure className="order_item">
                    <div className="order_item_header">
                      <p>
                        {page !== 4 && (
                          <span>{order?.address?.split("&")?.pop()}</span>
                        )}
                        <span>ID № : {order?.id?.split("_")[0]}</span>{" "}
                      </p>
                      <span>
                        {new Date(received_at).getHours()}:
                        {new Date(received_at).getMinutes()}
                      </span>
                      <div className="btn_box">
                        <button
                          className="relative"
                          onClick={() =>
                            orderAccept({ ...order, status: 4 }, params?.oa)
                          }
                          aria-label="cancel this order">
                          {page === 1 ? <RxCross2 /> : "↶"}
                        </button>
                        {page === 3 ? (
                          <sub style={{ background: "none" }}>
                            Dastavka kutilmoqda
                          </sub>
                        ) : (
                          <button
                            className="relative"
                            onClick={() => {
                              let newStatus;
                              if (order?.order_type === "online") {
                                newStatus = 1;
                              } else if (
                                order?.order_type === "offline" &&
                                order?.status === 0
                              ) {
                                newStatus = 2;
                              } else {
                                newStatus = 3;
                              }
                              orderAccept(
                                { ...order, status: newStatus },
                                "do"
                              );
                            }}
                            aria-label="to accept or to prepare">
                            <BsCheck2All />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="order_item-body">
                      {pd?.map((product, ind) => {
                        return (
                          selectedTags.includes(product?.department) && (
                            <figcaption key={product?.id + ind}>
                              <i
                                onClick={() => {
                                  let newS;
                                  if (order?.type === "online") {
                                    newS = 2;
                                  } else {
                                    newS = 4;
                                  }
                                  orderSituation({
                                    order_id: order?.id,
                                    product_id: product?.id,
                                    status: product?.status === 4 ? 5 : newS,
                                    department: dep,
                                    orderNumber: orderNum,
                                    data: order,
                                  });
                                }}></i>
                              {product?.status === 3 && <i></i>}
                              <p className="qty">{product?.quantity}</p>
                              <pre>
                                <p style={{ textTransform: "capitalize" }}>
                                  {product?.name}
                                </p>
                                <small>{product?.description}</small>
                              </pre>
                              <NumericFormat
                                value={product?.quantity * product?.price}
                                displayType={"text"}
                                thousandSeparator={true}
                              />
                              <div className="order_stution">
                                {product?.status === 1 && (
                                  <button
                                    className="relative"
                                    onClick={() =>
                                      orderSituation({
                                        order_id: order?.id,
                                        product_id: product?.id,
                                        status: 3,
                                        department: dep,
                                        orderNumber: orderNum,
                                        data: order,
                                      })
                                    }
                                    aria-label="cancel this product">
                                    <RxCross2 />
                                  </button>
                                )}
                                <button
                                  style={{ color: "#3CE75B" }}
                                  className="relative"
                                  onClick={() => {
                                    let newS;
                                    if (order?.type === "online") {
                                      newS = 2;
                                    } else {
                                      newS = 4;
                                    }
                                    orderSituation({
                                      order_id: order?.id,
                                      product_id: product?.id,
                                      status: product?.status === 4 ? 5 : newS,
                                      department: dep,
                                      orderNumber: orderNum,
                                      data: order,
                                    });
                                  }}
                                  aria-label="to accept or to prepare this product">
                                  {product?.status === 1 || !product?.status ? (
                                    <HiCheck />
                                  ) : product?.status === 5 ? (
                                    <HiCheck />
                                  ) : (
                                    <IoCheckmarkDoneCircleSharp />
                                  )}
                                </button>
                              </div>
                            </figcaption>
                          )
                        );
                      })}
                    </div>
                  </figure>
                </div>
              );
            })}
          </div>
        ) : (
          <figure className="no_result">
            <Result
              status="403"
              title={`Yangi buyurtma yo'q`}
              subTitle={`Yangi buyurtma topilmadi yoki mavjud emas!`}
              extra={
                <Button onClick={() => window.location.reload()}>
                  Sahifani yangilash
                </Button>
              }
            />
          </figure>
        )}
      </div>
      <div className="orders-footer">
        <div className="department-box">
          <ConfigProvider
            theme={{
              components: {
                Tag: {
                  defaultColor: "red",
                  defaultBg: "#454545",
                },
              },
            }}>
            {["Hammasi"]?.map((tag, i) => (
              <Tag.CheckableTag
                key={`${tag}_${i}`}
                checked={tags.includes(tag)}
                onChange={(checked) => handleChangeH(tag, checked)}>
                {tag}
              </Tag.CheckableTag>
            ))}
            {permissions?.map((tag, i) => (
              <Tag.CheckableTag
                key={`${tag}_${i}`}
                checked={selectedTags.includes(tag)}
                onChange={(checked) => handleChange(tag, checked)}>
                {tag}
              </Tag.CheckableTag>
            ))}
          </ConfigProvider>
        </div>
        <Button onClick={() => navigate(-1)}>Orqaga</Button>
      </div>
    </div>
  );
};
