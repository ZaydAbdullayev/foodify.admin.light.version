import React, { useState } from "react";
import "../../storage/storage.css";
import "../universal.css";
import "./report-order.css";
import { useSelector, useDispatch } from "react-redux";
import { acActiveThing, acPassiveThing } from "../../../redux/active";
import { storageD } from "../../storage/store-data";
import { useNavigate } from "react-router-dom";

import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { LoadingBtn } from "../../../components/loading/loading";
import { acNavStatus } from "../../../redux/navbar.status";
import { UniversalFilterBox } from "../../../components/filter/filter";
import { setDocuments, setRelease } from "../../../redux/deleteFoods";
import { setAllDocuments } from "../../../redux/deleteFoods";
import { IoInformationCircleOutline } from "react-icons/io5";
import { useFetchDataQuery } from "../../../service/fetch.service";

export const ReportOrders = () => {
  const [sort, setSort] = useState({ id: null, state: false });
  const [checked, setChecked] = useState(false);
  const [showMore, setShowMore] = useState([]);
  const acItem = useSelector((state) => state.activeThing);
  const ckddt = useSelector((state) => state.delRouter);
  const res_id = useSelector((state) => state.res_id);
  const { date } = useSelector((state) => state.uSearch);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  React.useEffect(() => {
    dispatch(acNavStatus([0, 3, 6, 7, 15]));
  }, [dispatch]);
  const { data: reports = [], isLoading } = useFetchDataQuery({
    url: `/get/ordersReport/${res_id}/${date?.start}/${date?.end}`,
    tags: ["add-order"],
  });

  const headerData = [
    { name: "Turi", size: "3.7%" },
    { name: "Ochildi", size: "9.3%" },
    { name: "Yopildi", size: "9.3%" },
    { name: "Offitsant", size: "9.3%" },
    { name: "Stoll", size: "7.8%" },
    { name: "Buyurtma narxi", size: "9.3%" },
    { name: "Tan narx", size: "9.3%" },
    { name: "Foyda", size: "9.3%" },
    { name: "Xizmat", size: "5.1%" },
    { name: "Chegirma", size: "9.3%" },
    { name: "Jami narx", size: "9.3%" },
    { name: "Olindi", size: "9.3%" },
    { name: <IoInformationCircleOutline />, size: "4%", dis: true },
  ];

  const displayKeys = [
    { name: "order_type", size: "3.7%", short: true },
    { name: "receivedAt", size: "9.3%", date: true },
    { name: "closed_at", size: "9.3%", date: true },
    { name: "worker_name", size: "9.3%" },
    { name: "table_name", size: "7.8%", extra: "t_location" },
    { name: "food_total", size: "9.3%", position: 2 },
    { name: "prime_cost", size: "9.3%", position: 2 },
    { name: "profit", size: "9.3%", position: 2 },
    { name: "service", size: "5.1%", position: 1 },
    { name: "total", size: "9.3%", position: 2 },
    { name: "discount", size: "9.3%", position: 2 },
    { name: "paid", size: "9.3%", position: 2 },
  ];

  return (
    <div className="storage_container">
      <UniversalFilterBox />
      <div className="storage_body">
        <p>
          <span>Buyurtmalar uchun hisobot</span>
        </p>
        <div className="storage_body_item _item-header order-report">
          <label>
            <input
              type="checkbox"
              name="id"
              onClick={() => {
                setChecked(!checked);
                dispatch(
                  checked
                    ? setRelease("orderReport")
                    : setAllDocuments("orderReport", storageD)
                );
              }}
              aria-label="for chacked this product"
            />
          </label>
          <p>№</p>
          {headerData?.map((item, index) => {
            return (
              <label
                onClick={() => setSort({ id: 1, state: !sort.state })}
                style={{ "--data-line-size": item?.size }}
                key={index}
                aria-label="for sort data and see al info about this product">
                <p>{item?.name}</p>
                {item.dis ? (
                  ""
                ) : sort.id === 1 && sort.state ? (
                  <RiArrowUpSLine />
                ) : (
                  <RiArrowDownSLine />
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
            reports?.data?.map((item, index) => {
              const chek = ckddt?.orderReport?.some((el) => el.id === item?.id);
              return (
                <div
                  className={
                    showMore?.includes(item?.id)
                      ? "storage_body__box active"
                      : "storage_body__box"
                  }
                  key={item?.id}>
                  <div
                    className={
                      acItem === item?.id
                        ? "storage_body_item or-rp active"
                        : "storage_body_item or-rp"
                    }
                    onDoubleClick={() => {
                      dispatch(
                        !acItem?.id ? acActiveThing(item) : acPassiveThing()
                      );
                      dispatch(setDocuments("orderReport", item));
                      navigate(`?page-code=orderReport`);
                    }}>
                    <label
                      onClick={() => {
                        dispatch(
                          !acItem?.id ? acActiveThing(item) : acPassiveThing()
                        );
                        dispatch(setDocuments("orderReport", item));
                        navigate(`?page-code=orderReport`);
                      }}
                      aria-label="checked this elements">
                      <input type="checkbox" name="id" defaultChecked={chek} />
                    </label>
                    <p>{index + 1}</p>
                    {displayKeys?.map(
                      ({ name, size, position, extra, date, short }, ind) => (
                        <p
                          key={ind}
                          style={{
                            "--data-line-size": size,
                            justifyContent: position
                              ? position === 1
                                ? "center"
                                : "flex-end"
                              : "flex-start",
                            gap: extra ? "5px" : "0",
                          }}>
                          <sub>{item?.[extra]} </sub>{" "}
                          {date
                            ? item[name] !== "0000-00-00"
                              ? new Date(item[name]).toLocaleDateString()
                              : ""
                            : short
                            ? item[name].substring(0, 2)
                            : item[name]}
                        </p>
                      )
                    )}
                    <p
                      style={{
                        "--data-line-size": "4%",
                        justifyContent: "center",
                      }}
                      onClick={() =>
                        setShowMore((prev) =>
                          prev?.includes(item?.id)
                            ? prev?.filter((el) => el !== item?.id)
                            : [...prev, item?.id]
                        )
                      }>
                      <u
                        style={
                          showMore?.includes(item?.id)
                            ? { color: "#787aff" }
                            : {}
                        }>
                        <IoInformationCircleOutline />
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
                              {item?.remain}
                            </p>
                            <p style={{ "--data-line-size": "15%" }}>
                              {item?.total}
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
        </div>
      </div>
    </div>
  );
};
