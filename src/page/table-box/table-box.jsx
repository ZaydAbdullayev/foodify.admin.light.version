import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";
import "./table-box.css";
import { Table } from "../../components/table/table";
import { useDispatch, useSelector } from "react-redux";
import { acNavStatus } from "../../redux/navbar.status";
import { PatternFormat } from "react-number-format";
import socket from "../../socket.config";
import { useFetchDataQuery } from "../../service/fetch.service";
const UniversalModal = lazy(() => import("../../components/modal/modal"));

export const TableBox = () => {
  const user = JSON.parse(localStorage.getItem("user"))?.user || null;
  const { data: category = [] } = useFetchDataQuery({
    url: `/get/tlocations/${user?.id}`,
    tags: ["table"],
  });
  const [active, setActive] = useState(category?.data?.[0]);
  const acItem = useSelector((state) => state.acActiveThing);
  const [newType, setNewType] = useState("");
  const [type, setType] = useState("stoll");
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(acNavStatus([0, 101, 100]));
  }, [dispatch]);
  const [tablesData, setTablesData] = useState([]);
  // isLoading: loading, isError: error, data: tables = []

  const filterData = useCallback(
    (type) => {
      setActive(type);
      const tdata = {
        res_id: user?.id,
        location: type,
      };
      socket.emit("/get/tables", tdata);
      socket.on(`/get/table/${tdata.res_id}/${tdata.location}`, (data) => {
        setTablesData(data);
      });
    },
    [user?.id]
  );

  useEffect(() => {
    filterData(category?.data?.[0]);
  }, [category?.data, filterData]);

  return (
    <div className="box">
      <div className="home">
        <div className="universal_box home_filter">
          {category?.data?.map((item) => {
            return (
              <span
                className={
                  active === item
                    ? "home_filter__item active"
                    : "home_filter__item"
                }
                key={item}
                onClick={() => filterData(item)}
                aria-label="filter data  according to this category">
                {item}
              </span>
            );
          })}
        </div>

        <div className="home_table_box">
          <Table data={tablesData} />
        </div>
      </div>
      <Suspense>
        <UniversalModal
          type="table"
          title="Stoll/Xona qo'shish"
          status={acItem?.id ? false : true}>
          <select name="location" onChange={(e) => setNewType(e.target.value)}>
            <option value="">Joylashuv tanlang</option>
            {category?.data?.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
            <option value="new">Yangi joylashuv oshish</option>
          </select>
          {newType === "new" && (
            <input
              type="text"
              name="location"
              required
              autoComplete="off"
              placeholder="Joylashuv nomi qo'shing *"
            />
          )}
          <input
            type="text"
            name="name"
            required
            autoComplete="off"
            placeholder={`Xona/Stoll raqamini kiriting *`}
          />
          <select name="people" onChange={(e) => setType(e.target.value)}>
            <option value="4">Xona/Stoll sig'imi</option>
            <option value="4">4 kishilik</option>
            <option value="6">6ta kishilik</option>
            <option value="8">8ta kishilik</option>
            <option value="10">10ta kishilik</option>
            <option value="manual">Qo'lda kiritish</option>
          </select>
          {type === "manual" && (
            <input
              type="number"
              name="people"
              required
              autoComplete="off"
              placeholder="Xona/Stoll sig'imi *"
            />
          )}
          <PatternFormat
            name="percentage"
            placeholder="Stoll uchun foizni kiritish"
            format="##%"
            mask="_"
            autoComplete="off"
          />
          <input
            type="number"
            name="minutelyCost"
            autoComplete="off"
            placeholder="Minutlik narx"
          />
          <input type="hidden" name="res_id" value={user?.id} />
        </UniversalModal>
      </Suspense>
    </div>
  );
};
