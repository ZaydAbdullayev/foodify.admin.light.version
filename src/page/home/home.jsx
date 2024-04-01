import React, { useState, useEffect, useCallback } from "react";
import "./home.css";
import { usePostDataMutation } from "../../service/fetch.service";
import { useDispatch } from "react-redux";
import { enqueueSnackbar as es } from "notistack";
import { acNavStatus } from "../../redux/navbar.status";
import { NumericFormat } from "react-number-format";
import socket from "../../socket.config";
import { useNavigate, useLocation } from "react-router-dom";
import { Segmented, Result, Button, Tag, ConfigProvider } from "antd";
import { getWeekDay } from "../../service/calc-date.service";

import { BsCheck2All } from "react-icons/bs";
import { AiOutlineFullscreen } from "react-icons/ai";
import { AiOutlineFullscreenExit } from "react-icons/ai";
import { HiCheck } from "react-icons/hi2";
import { RxCross2 } from "react-icons/rx";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { RiBoxingFill } from "react-icons/ri";
import { GiCook } from "react-icons/gi";
import { MdFastfood } from "react-icons/md";
import { acNothification } from "../../redux/nothification";

export const Home = () => {
  const user = JSON.parse(localStorage.getItem("user")) || [];
  const dep = JSON.parse(localStorage.getItem("department")) || null;
  const id = user?.user?.id;
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
  const [full, setFull] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [selectedTags, setSelectedTags] = useState(permissions);
  const [tags, setTags] = useState(["Hammasi"]);
  const [postData] = usePostDataMutation();
  const search = useLocation().search?.split("=").pop();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(acNavStatus([100]));
  }, [dispatch]);

  const getData = useCallback(
    async (deps) => {
      try {
        const res = await postData({
          url: params?.b,
          data: { departments: deps },
          tags: [""],
        });
        setOrders(res?.data?.innerData);
        console.log("normal", res?.data?.innerData);
      } catch (err) {
        console.log(err);
      }
    },
    [params, postData]
  );

  useEffect(() => {
    getData(selectedTags);
  }, [getData, selectedTags]);

  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    setSelectedTags(nextSelectedTags);
    if (nextSelectedTags.length === permissions?.length) {
      setTags(["Hammasi"]);
    } else {
      setTags([]);
    }
    getData(nextSelectedTags);
  };
  
  useEffect(() => {
    if (page === 1) {
      socket.on(`/get/newOrders/${id}`, (data) => {
        setOrders(data);
        dispatch(acNothification(true));
        console.log("socket", data);
      });
      return () => {
        socket.off(`/get/newOrders/${id}`);
      };
    }
  }, [dispatch, id, page]);

  useEffect(() => {
    socket.on(params?.s, (newData) => {
      console.log("newData socket", newData);
      setOrders((prevOrders) => {
        const existingOrder = prevOrders?.find(
          (order) => order?.id === newData.id
        );
        if (existingOrder) {
          if (newData?.deleted) {
            return prevOrders?.filter((order) => order?.id !== newData.id);
          } else {
            const updatedOrders = prevOrders?.map((order) =>
              order?.id === newData.id ? newData : order
            );
            return updatedOrders;
          }
        } else {
          return [...prevOrders, newData];
        }
      });
    });
    return () => {
      socket.off(params?.s);
    };
  }, [params?.s]);

  // to accept order's product by id
  const orderAccept = (order, ac) => {
    console.log("upO", {
      data: order,
      action: ac,
    });
    try {
      socket.emit("/accept/order", {
        status: true,
        variant: order?.status,
        user_id: order?.user_id,
      });
      socket.emit("/update/order/status", {
        data: order,
        action: ac,
      });
      if ((dep === "kassir" || dep === "owner") && page === 1) {
        socket.emit("/divide/orders/depart", order);
      }
      setSituation({ status: order?.status, id: order?.id });
    } catch (err) {
      es("Xatolik yuz berdi!", { variant: "warning" });
    }
  };

  // to find order situation
  const orderSituation = (order) => {
    console.log("upP", order);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredData = orders?.filter((item) => {
    return (
      item?.id?.toLowerCase().includes(search?.toLowerCase()) ||
      item?.address
        ?.split("&")
        ?.pop()
        .toLowerCase()
        .includes(search?.toLowerCase())
    );
  });

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
            <span>{`${currentTime}`}</span>
          </span>
          <Segmented
            options={[
              { label: <RiBoxingFill />, value: 1 },
              { label: <GiCook />, value: 2 },
              { label: <MdFastfood />, value: 3 },
            ]}
            onChange={(p) => {
              setPage(p);
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
          <Button>Stop-list</Button>
          <b
            onClick={() => setFull(!full)}
            aria-label={full ? "Exit full screen" : "Full screen"}>
            {full ? <AiOutlineFullscreenExit /> : <AiOutlineFullscreen />}
          </b>
        </div>

        {filteredData?.length ? (
          <div className={full ? "orders_body fullScreen" : "orders_body"}>
            {filteredData?.map((order) => {
              const pds = order?.product_data
                ? JSON?.parse(order?.product_data)
                : {};
              const pdArray = Object?.values(pds)?.[0];
              const orderNum = Object?.keys(pds)?.[0];
              const { pd = [], received_at = "" } = pdArray ?? {};
              const time = new Date(received_at)?.toLocaleString("uz-UZ", {
                hour: "numeric",
                minute: "numeric",
                hour12: false,
              });
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
                    display: order?.deleted ? "none" : "flex",
                  }}>
                  <figure className="order_item">
                    <div className="order_item_header">
                      <p>
                        {page !== 4 && (
                          <span>{order?.address?.split("&")?.pop()}</span>
                        )}
                        <span>ID № : {order?.id?.split("_")[0]}</span>{" "}
                      </p>
                      <span>{time}</span>
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
                          <figcaption key={product?.id + ind}>
                            <i
                              onClick={() => {
                                let newStatus;
                                if (order?.type === "online") {
                                  newStatus = 2;
                                } else {
                                  newStatus = 4;
                                }

                                if (product?.status === 4) {
                                  orderSituation({
                                    order_id: order?.id,
                                    product_id: product?.id,
                                    orderNumber: orderNum,
                                    status: 5,
                                    department: dep,
                                  });
                                } else {
                                  orderSituation({
                                    order_id: order?.id,
                                    product_id: product?.id,
                                    status: newStatus,
                                    department: dep,
                                    orderNumber: orderNum,
                                  });
                                }
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
                                  let newStatus;
                                  if (order?.type === "online") {
                                    newStatus = 2;
                                  } else {
                                    newStatus = 4;
                                  }

                                  if (product?.status === 4) {
                                    orderSituation({
                                      order_id: order?.id,
                                      product_id: product?.id,
                                      status: 5,
                                      department: dep,
                                      orderNumber: orderNum,
                                    });
                                  } else {
                                    orderSituation({
                                      order_id: order?.id,
                                      product_id: product?.id,
                                      status: newStatus,
                                      department: dep,
                                      orderNumber: orderNum,
                                    });
                                  }
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
                onChange={(checked) => handleChange(tag, checked)}>
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
