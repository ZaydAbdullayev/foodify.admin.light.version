import React, { useState } from "react";
import "./resolve.modal.css";
import { enqueueSnackbar as es } from "notistack";
import { useSelector } from "react-redux";
import { usePostDataMutation } from "../../service/fetch.service";
import { useDispatch } from "react-redux";
import { acResolve } from "../../redux/resolve";
import socket from "../../socket.config";

const ResolveModal = () => {
  const user = JSON.parse(localStorage.getItem("user")) || [];
  const [option, setOption] = useState("");
  const [storage, setStorage] = useState(true);
  const [dailyLimit, setDailyLimit] = useState(true);
  const resolve = useSelector((state) => state.resolve);
  const [postData] = usePostDataMutation();
  const dispatch = useDispatch();

  const orderSituation = async (e) => {
    e.preventDefault();
    try {
      const formdata = new FormData(e.target);
      const value = Object.fromEntries(formdata.entries());
      socket.emit("/update/ProductSt", {
        order_id: resolve?.order_id,
        product_id: resolve?.product?.id,
        status: resolve?.status,
        department: resolve?.department,
      });
      const { data = [] } = await postData({
        url: `/cancel/item`,
        body: {
          ...value,
          order_id: resolve?.order_id,
          product_data: JSON.stringify({
            ...resolve?.product,
            status: resolve?.status,
          }),
          worker_id: user?.user?.worker_id || user?.user?.id,
          res_id: user?.user?.id,
          storage,
          dailyLimit,
        },
        tags: [""],
      });

      if (data?.message === "Product has been added") {
        es("Muvaffaqiyatli yakunlandi!", { variant: "success" });
        dispatch(acResolve({}));
      }
    } catch (err) {
      es("Xatolik yuz berdi!", { variant: "warning" });
    }
  };

  return (
    <div
      className={
        resolve?.order_id ? "resolve_container open" : "resolve_container"
      }>
      <div className="u_modal_box">
        <form className="resolve_item" onSubmit={orderSituation}>
          <p>{resolve?.product?.name} ni bekor qilish sababi ?</p>

          <div className="resolve_options">
            <label
              onClick={() => setOption(1)}
              className={
                option === 1 ? "resolve_option active" : "resolve_option"
              }
              aria-label="canceled user">
              <input type="radio" name="description" value="cancel" />
              <span>Mijoz bekor qildi</span>
            </label>
            <label
              onClick={() => setOption(2)}
              className={
                option === 2 ? "resolve_option active" : "resolve_option"
              }
              aria-label="waiter bad">
              <input type="radio" name="description" value="waiter_bad" />
              <span>Offitsant hatosi</span>
            </label>
            <label
              onClick={() => setOption(3)}
              className={
                option === 3 ? "resolve_option active" : "resolve_option"
              }
              aria-label="write other cancel reason">
              <input type="radio" name="description" value="other" />
              <span>Boshqa...</span>
            </label>
          </div>
          {option === 3 && (
            <input
              type="text"
              name="description"
              placeholder="Bekor qilish sababi"
            />
          )}
          <div className="resolve_options">
            <label
              onClick={() => setDailyLimit(!dailyLimit)}
              className={
                dailyLimit ? "resolve_option2 active" : "resolve_option2"
              }
              aria-label="back to stop list">
              <span>
                StopListga qaytarilsinmi?: {dailyLimit ? " Ha" : " Yo'q"}
              </span>
            </label>
            <label
              onClick={() => setStorage(!storage)}
              className={storage ? "resolve_option2 active" : "resolve_option2"}
              aria-label="back to storage">
              <span>Omborga qaytarilsinmi?: {storage ? " Ha" : " Yo'q"}</span>
            </label>
          </div>
          <div className="resolve_options resolve_btn_box">
            <button
              type="button"
              onClick={() => dispatch(acResolve({}))}
              aria-label="close modal">
              Bekor qilish
            </button>
            <button>OK</button>
          </div>
        </form>
      </div>
      <i onClick={() => dispatch(acResolve({}))} aria-label="close modal"></i>
    </div>
  );
};

export default ResolveModal;
