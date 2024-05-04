import React, { useState, Suspense } from "react";
import "./inventory.css";
import "../../components/modal/modal.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Select, InputNumber, DatePicker, Input } from "antd";
import dayjs from "dayjs";

import { IoIosArrowForward } from "react-icons/io";
import { useFetchDataQuery } from "../../service/fetch.service";

export const Inventory = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  return (
    <div className="w100 df flc">
      <div className="w100 df aic jcc inventory-title">
        <big>Inventarizatsiya</big>
      </div>
      <div className="w100 df aic inventory-box">
        {[
          { name: "Invantarizatsiya tarixi", path: "history" },
          { name: "Invantarizatsiya qilish", path: "" },
        ]?.map((itm, ind) => {
          return (
            <label
              className="df aic jcsb inventory-item"
              key={`${itm?.path}_${ind}`}
              onClick={() => {
                if (itm?.path === "") return setOpen(true);
                navigate(`/restaurant-inventory/${itm?.path}`);
              }}>
              <p>{itm?.name}</p>
              <IoIosArrowForward />
            </label>
          );
        })}
      </div>
      {open && (
        <Suspense>
          <Modal setOpen={setOpen} />
        </Suspense>
      )}
    </div>
  );
};

export const InventoryHistory = () => {
  const navigate = useNavigate();
  return (
    <div className="w100 df flc inventory-history">
      <p className="w100 df aic jcc inventory-title">
        Inventarizatdiyalar tarixi
      </p>
      <div className="w100 df aic inventory-box inventory-hy-box">
        <div
          className="df flc inventory-item"
          onClick={() => navigate(`/restaurant-detail/1233`)}>
          <p className="w100 df aic jcsb">
            Ombor: <span>Bar</span>
          </p>
          <p className="w100 df aic jcsb">
            # <span>1</span>
          </p>
          <p className="w100 df aic jcsb">
            Vaqti: <span>03.04</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export const InventoryDetail = () => {
  const location = useLocation();
  return (
    <div className="w100 df flc inventory-detail">
      <p className="w100 df aic jcc inventory-title">Inventarizatsiya</p>
      <div className="w100 inventory-table-container">
        <table className="w100 inventory-table" border={1}>
          <thead>
            <tr>
              <th>Maxsulot</th>
              <th>O'lchov birligi</th>
              <th>Oldigni soni</th>
              <th>Keyingi soni</th>
              <th>Farq</th>
              <th>1x narxi</th>
              <th>Narxdagi farq</th>
              <th>Hozirgi balans</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                name: "Oshxona",
                size: "kg",
                count: 100,
                left: 20,
                price: 1000,
              },
              {
                name: "Oshxona",
                size: "kg",
                count: 100,
                left: 20,
                price: 1000,
              },
              {
                name: "Oshxona",
                size: "kg",
                count: 100,
                left: 20,
                price: 1000,
              },
            ]?.map((itm, ind) => {
              return (
                <tr key={`${itm?.name}_${ind}`}>
                  <td>{itm?.name}</td>
                  <th>{itm?.size}</th>
                  <th>{itm?.count}</th>
                  <th>{itm?.left}</th>
                  <th>{itm?.count - itm?.left}</th>
                  <th>{itm?.price}</th>
                  <th>{(itm?.count - itm?.left) * itm?.price}</th>
                  <th>{itm?.left * itm?.price}</th>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Modal = ({ setOpen }) => {
  const user = JSON.parse(localStorage.getItem("user"))?.user || {};
  const navigate = useNavigate();
  const [storage, setStorage] = useState({});
  const { data = {} } = useFetchDataQuery({
    url: `get/storage/${user?.id}`,
    tags: ["storageItems"],
  });
  const { data: n = {} } = useFetchDataQuery({
    url: `get/astSync/${user?.id}/${storage?.i}`,
    tags: ["storageItems"],
  });

  const getValues = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const value = Object.fromEntries(formData.entries());
    if (!storage.i) return setStorage({ i: null, n: null });
    setOpen(false);
    navigate(
      `/restaurant-inventory/new-inventory?num=${value?.number}&&date=${value?.date}&&sname=${storage.n}&&sid=${storage?.i}&&desc=${value?.description}`
    );
  };

  const getStorage = (e) => {
    setStorage({ i: e?.split("_")?.[0], n: e?.split("_")?.[1] });
  };

  return (
    <div className="u_modal_container open">
      <div className="w100 df aic jcc u_modal_box">
        <form className="df flc aic get-inventory-info" onSubmit={getValues}>
          <big>Inventarizatsiya ma'lumotlari</big>
          <label className="w100 df flc inventory-modal-item">
            <small>Inventarizatsiya raqami</small>
            <InputNumber
              aria-label="place for input number"
              placeholder="Inventarizatsiya raqami"
              style={{ width: "100%" }}
              name="number"
              defaultValue={n?.data?.number + 1 || 1}
            />
          </label>
          <label className="w100 df flc inventory-modal-item">
            <small>Inventarizatsiya sanasi</small>
            <DatePicker
              aria-label="place for select date"
              placement={"topLeft"}
              name="date"
              defaultValue={dayjs(new Date())}
            />
          </label>
          <label className="w100 df flc inventory-modal-item">
            <small>Ombor</small>
            <Select
              aria-label="place for choose option"
              onChange={getStorage}
              status={storage.i !== null ? "success" : "error"}
              defaultValue={`Ombor tanlang*`}
              options={data?.data?.map((item) => {
                return { label: item?.name, value: `${item?.id}_${item.name}` };
              })}
            />
          </label>
          <label className="w100 df flc inventory-modal-item">
            <small>Tasfilot</small>
            <Input
              aria-label="place for write info"
              name="description"
              placeholder="Tafsilot"
            />
          </label>
          <button className="w100 inventory-save">Saqlash</button>
        </form>
        <i
          onClick={() => setOpen(false)}
          aria-label="df aic jcc close modal"></i>
      </div>
    </div>
  );
};
