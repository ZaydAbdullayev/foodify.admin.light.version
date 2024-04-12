import React, { useState, useMemo } from "react";
import "./order.css";
import "./cart.css";
import { useNavigate, useLocation } from "react-router-dom";
import { CalculateTotalPrice } from "../../service/calc.service";
import { CalculateTotalQuantity } from "../../service/calc.service";
import { NumericFormat } from "react-number-format";
import { LoadingBtn } from "../../components/loading/loading";
import { enqueueSnackbar as es } from "notistack";
import socket from "../../socket.config";

import { LuShoppingBasket } from "react-icons/lu";
import { BiCircle, BiCheck } from "react-icons/bi";
import { FiCheckCircle } from "react-icons/fi";
import { TbMessage2Plus } from "react-icons/tb";
import { useFetchDataQuery } from "../../service/fetch.service";

export const Orders = () => {
  const user = JSON.parse(localStorage.getItem("user"))?.user || null;
  const navigate = useNavigate();
  const [update, setUpdate] = useState(false);
  const [open, setOpen] = useState(false);
  const [takeaway, setTakeaway] = useState(false);
  const [desc, setDesc] = useState(false);
  const [extra, setExtra] = useState("");
  const location = useLocation();
  const { data = [], isLoading } = useFetchDataQuery({
    url: `get/foods/${user?.id}`,
    tags: ["s-products", "product"],
  });
  const { data: categoryData = [] } = useFetchDataQuery({
    url: `get/${user?.id}/categories`,
    tags: ["category"],
  });
  const position = location.pathname.split("/");
  const ct = categoryData?.data?.[0]?.name?.toLowerCase().replace(/\s|'/g, "");
  const category = location.search.split("=")[1] || ct;
  const cart = useMemo(() => {
    return JSON?.parse(localStorage?.getItem("cart")) || [];
  }, []);
  const total = CalculateTotalPrice(cart, 10);
  const prime_cost = CalculateTotalQuantity(cart, "prime_cost");

  const paymentData = {
    address: `&${position[3]}-stoll`,
    restaurant_id: user?.id,
    user_id: position[4],
    product_data: JSON.stringify({ 1: { pd: cart } }),
    food_total: total?.totalPrice,
    service: total?.service,
    prime_cost: prime_cost,
    total: total?.total,
    paid: 0,
    online_paymentToken: "token",
    table_name: position[3],
    worker_name: user?.name || "owner",
    worker_id: user?.user_id || user?.id,
    order_type: "offline",
    t_location: position[2],
    table_id: position[4],
    discount: 0,
  };

  const queue = parseInt(position[6]) + 1;
  const updatePaymentData = {
    order_id: position[5],
    product_data: JSON.stringify({ [queue]: cart }),
  };

  const handleTarget = (item) => {
    const url = item?.name?.toLowerCase().replace(/\s|'/g, "");
    navigate(`?category=${url}`);
  };

  const addToCart = (item) => {
    setUpdate(!update);
    const cartItem = cart?.find((x) => x?.id === item?.id);
    if (cartItem) {
      cartItem.quantity++;
      localStorage?.setItem("cart", JSON?.stringify(cart));
    } else {
      cart?.push({ ...item, quantity: 1, status: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  };

  const updateCart = (item) => {
    setUpdate(!update);
    const cartItem = cart.find((x) => x.id === item.id);
    if (cartItem && item?.quantity > 0) {
      cartItem.quantity = item?.quantity;
      localStorage.setItem("cart", JSON.stringify(cart));
    } else if (cartItem && item.quantity === 0) {
      const index = cart.indexOf(cartItem);
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  };

  const resieveOrderS = async () => {
    const uData = {
      id: position[4],
      status: 2,
      res_id: user?.id,
      location: position[2],
      worker_id: user?.worker_id,
    };
    if (!cart.length) {
      alert("Savatcha bo'sh");
      return;
    }
    if (position[1] === "update-order") {
      socket.emit("/addProduct/toOrder", updatePaymentData);
    } else {
      socket.emit("/order", paymentData);
      // socket.emit("/divide/orders/depart", paymentData);
      socket.emit("/update/table", uData);
    }
    // localStorage.removeItem("cart");
    // navigate("/orders/tables");
    // es("Buyurtma yuborildi!", { variant: "success" });
  };

  const addExtr = (value) => {
    setDesc(false);
    const updatedCart = cart?.map((item) => {
      if (item.id === value.id) {
        item.comment = value.comment;
      }
      return item;
    });
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const filteredData = data?.data?.filter(
    (item) => item?.category?.toLowerCase().replace(/\s|'/g, "") === category
  );

  return (
    <div className="res_products">
      <div className="res_category">
        <div className="res_category_box">
          {categoryData?.data?.map((item) => {
            return (
              <span
                key={item?.id}
                onClick={() => handleTarget({ id: item?.id, name: item?.name })}
                className={
                  category === item?.name?.toLowerCase().replace(/\s|'/g, "")
                    ? "active"
                    : ""
                }
                aria-label="to filter info according to this category">
                {item?.name}
              </span>
            );
          })}
        </div>
      </div>
      <div className="res_menu">
        <div className="res_menu_box">
          {isLoading ? (
            <span className="loader_box">
              <LoadingBtn />
            </span>
          ) : (
            filteredData?.map((item) => {
              const count = cart?.filter((x) => x?.id === item?.id);
              return (
                <div
                  className="res_menu_item"
                  key={item?.id}
                  onClick={() => addToCart(item)}
                  aria-label="click this aria for add basket this product">
                  <p style={{ textTransform: "capitalize" }}>{item?.name}</p>
                  <span>{item?.description}</span>
                  {count[0]?.quantity && <i>{count[0]?.quantity}</i>}
                </div>
              );
            })
          )}
        </div>
      </div>
      <div className="book_order">
        <span onClick={() => setOpen(!open)} aria-label="see basket">
          <LuShoppingBasket />
        </span>
        <button onClick={() => resieveOrderS()} aria-label="send order">
          Rasmiylashtirish
        </button>
      </div>
      <div className={open ? "cart_box open" : "cart_box"}>
        <p>
          <span>Mahsulotlar</span>
        </p>
        <div className="cart_body">
          {cart?.map((item) => {
            return (
              <div className="cart_body__item" key={item?.id}>
                {desc === item.id ? (
                  <input
                    type="text"
                    name="comment"
                    autoFocus
                    autoComplete="off"
                    className="description"
                    onChange={(e) => setExtra(e.target.value)}
                  />
                ) : (
                  <p>
                    {item?.name}
                    <b>{item?.description}</b>
                    <NumericFormat
                      value={item?.price * item?.quantity}
                      thousandSeparator=" "
                      displayType="text"
                      suffix=" so'm"
                    />
                  </p>
                )}
                <p>{item?.description}</p>
                <NumericFormat
                  value={item?.price * item?.quantity}
                  thousandSeparator=" "
                  displayType="text"
                  suffix=" so'm"
                />
                <div className="update_item">
                  <button aria-label="add message">
                    {desc === item.id ? (
                      <BiCheck
                        onClick={() => addExtr({ id: item.id, comment: extra })}
                      />
                    ) : (
                      <TbMessage2Plus onClick={() => setDesc(item.id)} />
                    )}
                  </button>
                  <button
                    onClick={() =>
                      updateCart({ id: item.id, quantity: item.quantity - 1 })
                    }
                    aria-label="minus 1x">
                    –
                  </button>
                  <input
                    type="number"
                    value={item?.quantity}
                    onChange={(e) =>
                      updateCart({
                        id: item.id,
                        quantity: e.target.value,
                      })
                    }
                    aria-label="quantity of this product"
                  />
                  <button
                    onClick={() =>
                      updateCart({ id: item.id, quantity: item.quantity + 1 })
                    }
                    aria-label="plus 1x">
                    +
                  </button>
                </div>
              </div>
            );
          })}
          <p>
            <span>Jami:</span>{" "}
            <NumericFormat
              value={total?.totalPrice || 0}
              thousandSeparator=" "
              displayType="text"
              suffix=" so'm"
            />{" "}
          </p>
        </div>
        <label
          className={takeaway ? "takeaway active" : "takeaway"}
          onClick={() => setTakeaway(!takeaway)}
          aria-label="change status of takeaway">
          {takeaway ? <FiCheckCircle /> : <BiCircle />}
          Olib ketish
        </label>
      </div>
    </div>
  );
};
