import React, { useState, useEffect } from "react";
import "./home.css";
import { usePostDataMutation } from "../../service/fetch.service";
import { useDispatch, useSelector } from "react-redux";
import { LoadingBtn } from "../../components/loading/loading";
import { enqueueSnackbar as es } from "notistack";
import { acNavStatus } from "../../redux/navbar.status";
import { NumericFormat } from "react-number-format";
import socket from "../../socket.config";
import { useSwipeable } from "react-swipeable";
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
  const permissions = JSON.parse(localStorage.getItem("permissions")) || [
    "Bar",
    "Oshxona",
  ];
  const newOrder = useSelector((state) => state.upload);
  const [situation, setSituation] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState({});
  const [full, setFull] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [selectedTags, setSelectedTags] = useState(["Hammasi"]);
  const [postData] = usePostDataMutation();
  const search = useLocation().search?.split("=").pop();
  const id = user?.user?.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(acNavStatus([100]));
  }, [dispatch]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     GetData(permissions);
  //   }, 800);
  // }, [newOrder, permissions]);

  const GetData = async (deps) => {
    try {
      const res = await postData({
        url: `get/orders/${id}`,
        data: { departments: ["Bar", "Oshxona"] },
        tags: [""],
      });
      setOrders(res?.data?.innerData);
      console.log("normal", res?.data?.innerData);
    } catch (err) {
      console.log(err);
    }
  };
  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    setSelectedTags(nextSelectedTags);
  };

  useEffect(() => {
    socket.on(`/get/newOrders/${id}`, (data) => {
      setOrders(data);
      dispatch(acNothification(true));
      console.log("socket", data);
    });
    return () => {
      socket.off(`/get/newOrders/${id}`);
    };
  }, [dispatch, id]);

  useEffect(() => {
    socket.on(`/get/newOrderOne/${id}`, (newData) => {
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
      socket.off(`/get/newOrderOne/${id}`);
    };
  }, [id]);

  // to accept order's product by id
  const orderAccept = (order, ac) => {
    console.log("upO", {
      data: order,
      action: ac,
    });
    try {
      setLoading(order);
      socket.emit("/accept/order", {
        status: true,
        variant: order?.status,
        user_id: order?.user_id,
      });
      socket.emit("/update/order/status", {
        data: order,
        action: ac,
      });
      if (dep === "kassir" || dep === "owner") {
        socket.emit("/divide/orders/depart", order);
      }
      setSituation({ status: order?.status, id: order?.id });
    } catch (err) {
      es("Xatolik yuz berdi!", { variant: "warning" });
    } finally {
      setLoading({});
    }
  };

  // to find order situation
  const orderSituation = (order) => {
    console.log("upP", order);
    try {
      setLoading(order);
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
    } finally {
      setLoading({});
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
          <span>{`${new Date().toLocaleDateString("us-US", {
            day: "numeric",
            month: "long",
          })}, ${getWeekDay(new Date().getDay())} ,${currentTime}`}</span>
          <Segmented
            options={[
              { label: <RiBoxingFill />, value: `/orders` },
              { label: <GiCook />, value: `/orders/cooking/food` },
              {
                label: <MdFastfood />,
                value: `/orders/prepared/food`,
              },
            ]}
            onChange={(link) => navigate(link)}
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
                        {(dep === "kassir" || dep === "owner") && (
                          <span>{order?.address?.split("&")?.pop()}</span>
                        )}
                        <span>ID № : {order?.id?.split("_")[0]}</span>{" "}
                      </p>
                      <span>{time}</span>
                      {(dep === "kassir" || dep === "owner") && (
                        <div className="btn_box">
                          <button
                            className="relative"
                            onClick={() =>
                              orderAccept({ ...order, status: 4 }, "reject")
                            }
                            aria-label="cancel this order">
                            <RxCross2 />
                          </button>
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
                            {loading.id === order.id && loading.status === 1 ? (
                              <LoadingBtn />
                            ) : (
                              <BsCheck2All />
                            )}
                          </button>
                        </div>
                      )}
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
                                  {loading.id === product.id &&
                                  loading.status === 3 ? (
                                    <LoadingBtn />
                                  ) : (
                                    <RxCross2 />
                                  )}
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
          {permissions?.length &&
            ["Hammasi", ...permissions]?.map((tag, i) => (
              <ConfigProvider
                key={`${tag}_${i}`}
                theme={{
                  components: {
                    Tag: {
                      defaultColor: "red",
                      defaultBg: "#454545",
                    },
                  },
                }}>
                <Tag.CheckableTag
                  checked={selectedTags.includes(tag)}
                  onChange={(checked) => handleChange(tag, checked)}>
                  {tag}
                </Tag.CheckableTag>
              </ConfigProvider>
            ))}
        </div>
        <Button onClick={() => navigate(-1)}>Orqaga</Button>
      </div>
    </div>
  );
};
