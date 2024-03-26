import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { acNavStatus } from "../../redux/navbar.status";
import { useSwipeable } from "react-swipeable";
import { NumericFormat } from "react-number-format";
import { useNavigate } from "react-router-dom";
import socket from "../../socket.config";

import noResult from "../../assets/images/20231109_144621.png";
import { MdFastfood } from "react-icons/md";
import { GiCook } from "react-icons/gi";
import { RiBoxingFill } from "react-icons/ri";
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import { HiCheck } from "react-icons/hi";
import { useFetchDataQuery } from "../../service/fetch.service";
// import { BsCheck2All } from "react-icons/bs";

export const MakedFoods = () => {
  const user = JSON?.parse(localStorage?.getItem("user"))?.user || [];
  // const newOrder = useSelector((state) => state.upload);
  const [full, setFull] = useState(false);
  const [activeIndex, setActiveIndex] = useState(2);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data = [] } = useFetchDataQuery({
    url: `/get/readyFoods/${user?.id}`,
    tags: [""],
  });
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    setOrders(data?.innerData);
    dispatch(acNavStatus([100]));
  }, [dispatch, data?.innerData]);

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("LEFT"),
    onSwipedRight: () => handleSwipe("RIGHT"),
    trackMouse: true,
  });

  const handleSwipe = async (direction) => {
    const newIndex = direction === "LEFT" ? activeIndex + 1 : activeIndex - 1;
    setActiveIndex((newIndex + 3) % 3);
    navigate(
      `/orders/${
        newIndex === 0 ? "" : newIndex === 1 ? "cooking/food" : "prepared/food"
      }`
    );
  };

  useEffect(() => {
    socket.on(`/get/readyOrderOne/${user?.id}`, (newData) => {
      console.log("readyOrder socket", newData);
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
          return prevOrders?.length ? [...prevOrders, newData] : [newData];
        }
      });
    });
    return () => {
      socket.off(`/get/readyOrderOne/${user?.id}`);
    };
  }, [user?.id]);

  return (
    <div
      className={
        full ? "container_box home_page active" : "container_box home_page"
      }>
      <div className="_orders">
        <h1>
          <i></i>
          <i></i>
          <span {...handlers} className="swipe-pages">
            <span
              className={activeIndex === 0 ? "active" : ""}
              onClick={() => navigate("/orders")}
              aria-label='target this link "/orders"'>
              <RiBoxingFill />
            </span>
            <span
              className={activeIndex === 1 ? "active" : ""}
              onClick={() => navigate("/orders/cooking/food")}
              aria-label='target this link "/orders/cooking/food"'>
              <GiCook />
            </span>
            <span
              className={activeIndex === 2 ? "active" : ""}
              onClick={() => navigate("/orders/prepared/food")}
              aria-label='target this link "/orders/prepared/food"'>
              <MdFastfood />
            </span>
          </span>
          <i></i>
          <span
            onClick={() => setFull(!full)}
            aria-label="enter fullscreen and exit fullscreen">
            {full ? <AiOutlineFullscreenExit /> : <AiOutlineFullscreen />}
          </span>
        </h1>
        {orders?.length ? (
          <div className={full ? "orders_body fullScreen" : "orders_body"}>
            {orders?.map((order) => {
              const pds = JSON?.parse(order?.product_data) || {};
              const { pd, received_at } = Object?.values(pds)?.[0];
              const time = new Date(received_at)?.toLocaleString("uz-UZ", {
                hour: "numeric",
                minute: "numeric",
                hour12: false,
              });
              return (
                <div
                  key={order?.id}
                  style={{
                    "--grid-col": full ? 1 : 1.5,
                    "--grid-row": pd?.length + 1,
                    display: order?.status === 4 ? "none" : "flex",
                  }}>
                  <figure className="order_item">
                    <div className="order_item_header">
                      <p>
                        <span>ID № : {order?.id?.split("_")[0]}</span>{" "}
                      </p>
                      <span>{time}</span>
                      <div className="btn_box">
                        <sub style={{ background: "none" }}>
                          Olib ketilishi kutilmoqda
                        </sub>
                      </div>
                    </div>
                    <div className="order_item-body">
                      {pd?.map((product, ind) => {
                        return (
                          <figcaption key={product?.id + ind}>
                            {product?.status === 3 && <i></i>}
                            <p className="qty">{product?.quantity}</p>
                            <pre>
                              <p style={{ textTransform: "capitalize" }}>
                                {product?.name}
                              </p>
                              <p>{product?.description}</p>
                            </pre>
                            <NumericFormat
                              value={product?.quantity * product?.price}
                              displayType={"text"}
                              thousandSeparator={true}
                            />
                            <div className="order_stution">
                              <button
                                style={{ color: "#3CE75B" }}
                                className="relative">
                                <HiCheck />
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
            <img src={noResult} alt="foto" />
          </figure>
        )}
      </div>
    </div>
  );
};
