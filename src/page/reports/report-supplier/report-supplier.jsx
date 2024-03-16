import React, { useState, lazy, Suspense } from "react";
import "../../storage/storage.css";
import "../universal.css";
import { useSelector } from "react-redux";
import { storageD } from "../../storage/store-data";
import { CalculateTotalQuantity } from "../../../service/calc.service";
import { acOpenUModal } from "../../../redux/u-modal";
import { useDispatch } from "react-redux";

import { LoadingBtn } from "../../../components/loading/loading";
import { acNavStatus } from "../../../redux/navbar.status";
import { UniversalFilterBox } from "../../../components/filter/filter";
import { useFetchDataQuery } from "../../../service/fetch.service";
const UniversalModal = lazy(() => import("../../../components/modal/modal"));

export const ReportSuppliers = () => {
  const user = JSON.parse(localStorage.getItem("user"))?.user || null;
  const [sort, setSort] = useState({ id: null, state: false });
  const [showMore, setShowMore] = useState([]);
  const acItem = useSelector((state) => state.activeThing);
  const res_id = useSelector((state) => state.res_id);
  const { data: storeData = [] } = useFetchDataQuery({
    url: `get/${res_id}/categories`,
    tags: ["category"],
  });
  const today = new Date().toISOString().slice(0, 10);
  console.log(storeData);
  const isLoading = false;
  const depData = [];
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(acNavStatus([0, 3, 4, 6, 7, 15]));
  }, [dispatch]);
  const sortData = storageD.sort((a, b) => {
    if (sort.state) {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  //   const sortData =
  //     storeData?.data &&
  //     [...storeData?.data]?.sort((a, b) => {
  //       if (sort.state) {
  //         return a.name.localeCompare(b.name);
  //       } else {
  //         return b.name.localeCompare(a.name);
  //       }
  //     });

  const headerData = [
    { name: "Nomi", size: "15%" },
    {
      name: "Boshlanish vaqt (balans)",
      position: 1,
      items: { profit: "Daromad", price: "Xarajat" },
      size: "18.4%",
    },
    {
      name: "Aylanish (balans)",
      position: 1,
      items: { profit: "Daromad", price: "Xarajat" },
      size: "18.4%",
    },
    {
      name: "Tugash vaqt (balans)",
      position: 1,
      items: { profit: "Daromad", price: "Xarajat" },
      size: "18.4%",
    },
    { name: "To'lov", size: "9%" },
    { name: "Tranzaksiyalar", size: "9%" },
    { name: "Tafsilotlar", size: "9%" },
  ];

  const displayKeys = [
    { name: "dep", size: "15%", border: "none" },
    { name: "items", size: "18.4%", position: 1 },
    { name: "items", size: "18.4%", position: 1 },
    { name: "items", size: "18.4%", position: 2 },
  ];

  const displayTotalKeys = [
    { name: "Umumiy", size: "15%", position: 1, tick: "Umumiy" },
    { name: "items", size: "18.4%", position: 2, flex: 1 },
    { name: "items", size: "18.4%", position: 2, flex: 1 },
    { name: "items", size: "18.4%", position: 2, flex: 1 },
    { name: "remain", size: "9%", position: 2 },
    { name: "remain", size: "9%", position: 2 },
    { name: "remain", size: "9%", position: 2 },
  ];

  const openUModal = () => {
    dispatch(acOpenUModal());
  };

  return (
    <div className="storage_container">
      <UniversalFilterBox />
      <div className="storage_body">
        <p>
          <span>Yetkazuvchilar uchun hisobot</span>
        </p>
        <div className="storage_body_item reports_item _item-header">
          <p style={{ "--data-line-size": "var(--univslH)" }}>№</p>
          {headerData?.map((item, index) => {
            return (
              <label
                onClick={() => setSort({ id: 1, state: !sort.state })}
                style={{
                  "--data-line-size": item.size,
                  justifyContent: item?.position
                    ? item?.position === 1
                      ? "center"
                      : "flex-end"
                    : "flex-start",
                }}
                aria-label="sort data down of top or top of down"
                key={index}>
                <p>{item.name}</p>
                {item?.items && (
                  <>
                    <span>{item?.items?.profit}</span>
                    <span>{item?.items?.price}</span>
                  </>
                )}
              </label>
            );
          })}
        </div>
        <div className="storage_body_box">
          {isLoading ? (
            <span className="loader_box relative">
              <LoadingBtn />
            </span>
          ) : (
            sortData?.map((item, index) => {
              return (
                <div
                  className={
                    showMore?.includes(item?.id)
                      ? "storage_body__box active"
                      : "storage_body__box"
                  }
                  key={item.id}>
                  <div
                    className={
                      acItem === item.id
                        ? "storage_body_item active"
                        : "storage_body_item"
                    }>
                    <p style={{ "--data-line-size": "var(--univslH)" }}>
                      {index + 1}
                    </p>
                    {displayKeys?.map((displayKey, index) => (
                      <p
                        key={index}
                        style={{
                          "--data-line-size": displayKey.size,
                          justifyContent: displayKey.position
                            ? displayKey.position === 1
                              ? "center"
                              : "flex-end"
                            : "flex-start",
                        }}>
                        {displayKey?.name === "items" ? (
                          <>
                            <span className="reports_span">
                              {item?.items?.a_price}
                            </span>
                            <span className="reports_span">
                              {item?.items?.qty}
                            </span>
                          </>
                        ) : (
                          <>
                            {item[displayKey?.name]}
                            {displayKey?.tick}
                          </>
                        )}
                      </p>
                    ))}
                    <p
                      style={{
                        "--data-line-size": "9%",
                        justifyContent: "center",
                      }}
                      onClick={openUModal}
                      aria-label="to click to add paymetn this order">
                      <u>to'lov</u>
                    </p>
                    <p
                      style={{
                        "--data-line-size": "9%",
                        justifyContent: "center",
                      }}
                      onClick={() =>
                        setShowMore((prev) =>
                          prev?.includes(item?.id)
                            ? prev?.filter((id) => id !== item?.id)
                            : [...prev, item.id]
                        )
                      }>
                      <u
                        style={
                          showMore?.includes(item?.id)
                            ? { color: "#787aff" }
                            : {}
                        }>
                        tranzaksiyalar
                      </u>
                    </p>
                    <p
                      style={{
                        "--data-line-size": "9%",
                        justifyContent: "center",
                      }}
                      onClick={() =>
                        setShowMore(
                          showMore?.includes(item?.id) ? null : item.id
                        )
                      }>
                      <u
                        style={
                          showMore?.includes(item?.id)
                            ? { color: "#787aff" }
                            : {}
                        }>
                        tafsilot
                      </u>
                    </p>
                  </div>
                  {showMore?.includes(item?.id) && (
                    <div className=" storage-body_inner_item">
                      <div className="storage_body_item">
                        <p
                          style={{
                            borderRight: "1px solid #ccc5",
                          }}>
                          №
                        </p>
                        <p
                          style={{
                            "--data-line-size": "35%",
                            borderRight: "1px solid #ccc5",
                          }}>
                          Nomi
                        </p>
                        <p
                          style={{
                            "--data-line-size": "20%",
                            borderRight: "1px solid #ccc5",
                          }}>
                          Narxi
                        </p>
                        <p
                          style={{
                            "--data-line-size": "25%",
                            borderRight: "1px solid #ccc5",
                          }}>
                          Tan Narxi
                        </p>
                        <p style={{ "--data-line-size": "15%" }}>Foyda</p>
                      </div>
                      {item?.data?.map((product, ind) => {
                        return (
                          <div className="storage_body_item inner_item">
                            <p
                              style={{
                                borderRight: "1px solid #ccc5",
                              }}>
                              {ind + 1}
                            </p>
                            <p style={{ "--data-line-size": "35%" }}>
                              {product.name}
                            </p>
                            <p style={{ "--data-line-size": "20%" }}>
                              {product.password}
                            </p>
                            <p style={{ "--data-line-size": "25%" }}>
                              {item.remain}
                            </p>
                            <p style={{ "--data-line-size": "15%" }}>
                              {item.total}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div className={"storage_body_item"} style={{ background: "#3339" }}>
            <p></p>
            {displayTotalKeys?.map((displayKey, index) => (
              <p
                key={index}
                style={{
                  "--data-line-size": displayKey.size,
                  justifyContent: displayKey.position
                    ? displayKey.position === 1
                      ? "center"
                      : "flex-end"
                    : "flex-start",
                }}>
                {displayKey?.tittle}
                {displayKey?.name === "items" ? (
                  <>
                    <span className="reports_span">
                      {CalculateTotalQuantity(storageD, "remain")}
                    </span>
                    <span className="reports_span">
                      {CalculateTotalQuantity(storageD, "remain")}
                    </span>
                  </>
                ) : (
                  displayKey.flex &&
                  CalculateTotalQuantity(storageD, displayKey?.name)
                )}
                {displayKey?.tick}
              </p>
            ))}
          </div>
        </div>
      </div>
      <Suspense>
        <UniversalModal
          type="cash"
          title="To'lov qilish"
          status={acItem?.id ? false : true}>
          <label>
            <input type="date" name="date" defaultValue={today} required />
            <select name="department">
              <option value="default">To'lov guruhi tanlang*</option>
              {depData?.data?.map((item, index) => {
                return (
                  <option value={item.name} key={index}>
                    {item.name}
                  </option>
                );
              })}
            </select>
          </label>
          <label>
            <select name="department">
              <option value="default">To'lov category tanlang*</option>
              {depData?.data?.map((item, index) => {
                return (
                  <option value={item.name} key={index}>
                    {item.name}
                  </option>
                );
              })}
            </select>
            <select name="department">
              <option value="default">Kassa tanlang*</option>
              {depData?.data?.map((item, index) => {
                return (
                  <option value={item.name} key={index}>
                    {item.name}
                  </option>
                );
              })}
            </select>
          </label>
          <select name="department">
            <option value="default">Yetkazuvchi tanlang*</option>
            {depData?.data?.map((item, index) => {
              return (
                <option value={item.name} key={index}>
                  {item.name}
                </option>
              );
            })}
          </select>
          <select name="department">
            <option value="default">To'lov turi tanlang*</option>
            {depData?.data?.map((item, index) => {
              return (
                <option value={item.name} key={index}>
                  {item.name}
                </option>
              );
            })}
          </select>
          <input type="text" name="price" placeholder="Miqdor" required />
          <input type="text" name="price" placeholder="Tavsif" required />
          <input type="hidden" name="res_id" value={user?.id} />
        </UniversalModal>
      </Suspense>
    </div>
  );
};
