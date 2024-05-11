import React, { useState, useEffect } from "react";
import "./universal.css";
import { DateRange } from "../../components/statistics/layout.statis";
import { useLocation, useParams } from "react-router-dom";
import { useFetchDataQuery } from "../../service/fetch.service";
import { usePostDataMutation } from "../../service/fetch.service";
import { Tree } from "antd";
import { useNavigate } from "react-router-dom";
import { LoadingBtn } from "../../components/loading/loading";

import { MdFilterAlt } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

export const ReportDetails = () => {
  const [details, setDetails] = useState([]);
  const [billType, setBillType] = useState([]);
  const [payType, setPayType] = useState([]);
  const [waiter, setWaiter] = useState([]);
  const [hall, setHall] = useState([]);
  const [table, setTable] = useState([]);
  const [dep, setDep] = useState([]);
  const [category, setCategory] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [postData] = usePostDataMutation();
  const lc = useLocation();
  const navigate = useNavigate();
  const { title, resId, method, type, label } = useParams();
  const searchParams = new URLSearchParams(lc.search);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  const trees = [
    {
      propertyes: billType,
      actions: setBillType,
      data: o_types,
      permission: ["orders"],
    },
    {
      propertyes: payType,
      actions: setPayType,
      data: pay_types,
      permission: ["orders"],
    },
    {
      propertyes: waiter,
      actions: setWaiter,
      data: waiters,
      permission: ["orders", "report", "canceled"],
    },
    {
      propertyes: hall,
      actions: setHall,
      data: halls,
      permission: ["orders", "report"],
    },
    {
      propertyes: table,
      actions: setTable,
      data: tables,
      permission: ["orders", "report"],
    },
    {
      propertyes: dep,
      actions: setDep,
      data: department,
      permission: ["report", "canceled"],
    },
    {
      propertyes: category,
      actions: setCategory,
      data: categories,
      permission: ["report", "canceled"],
    },
  ];
  // to set the data of the search query
  const search = () => {
    let search = "";
    if (billType?.length > 0) {
      search += `&&order_types[]=${billType.join(",")}`;
    }
    if (payType?.length > 0) {
      search += `&&pay_types[]=${payType.join(",")}`;
    }
    if (waiter?.length > 0) {
      search += `&&waiters[]=${waiter.join(",")}`;
    }
    if (hall?.length > 0) {
      search += `&&halls[]=${hall.join(",")}`;
    }
    if (table?.length > 0) {
      search += `&&tables[]=${table.join(",")}`;
    }
    if (dep?.length > 0) {
      search += `&&department[]=${dep.join(",")}`;
    }
    if (category?.length > 0) {
      search += `&&category[]=${category.join(",")}`;
    }
    return search;
  };
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const { data = {} } = await postData({
        url: `${method}/${type}/${resId}/${start}/${end}?query${search()}`,
        tags: ["report"],
      });
      setDetails(data);
    } catch (err) {
      alert("Malumot yuklanmadi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w100 df flc report-conatiner">
        <div className="w100 df aic jcsb report-title">
          <p>{title}</p>
          {["orders", "canceled", "courses"].includes(label) ? (
            <span
              className="df aic jcc filter-open-btn"
              onClick={() => setOpen(true)}>
              <MdFilterAlt />
            </span>
          ) : (
            DateRange()
          )}
        </div>
        <div className="w100 df aic reports-box">
          {isLoading ? (
            <span className="relative loader_box">
              <LoadingBtn />
            </span>
          ) : label === "orders" ? (
            details?.innerData?.map((rep, ind) => {
              const time = new Date(rep?.receivedAt);
              const close =
                rep?.closed_at !== "0000-00-00"
                  ? new Date(rep?.closed_at)
                  : null;
              return (
                <label
                  className={`df aic flc  report-item ${rep?.st || ""}`}
                  key={`${rep?.type}_${ind}`}>
                  <p className="w100 df aic jcsb">
                    #{rep?.id}
                    <p>{rep?.payment_type}</p>
                  </p>
                  <p className="w100 df aic jcsb">
                    <span>ochilgan vaqti</span>
                    {`${time?.toLocaleDateString("us-US", {
                      day: "numeric",
                      month: "long",
                    })}`}
                    , {time?.getFullYear()},{" "}
                    {time?.getHours() === 0
                      ? `0${time?.getHours()}`
                      : time?.getHours()}
                    :
                    {time?.getMinutes() === 0
                      ? `0${time?.getMinutes()}`
                      : time?.getMinutes()}{" "}
                  </p>
                  <p className="w100 df aic jcsb">
                    <span>yopilgan vaqti</span>
                    {close &&
                      `${close?.toLocaleDateString("us-US", {
                        day: "numeric",
                        month: "long",
                      })}
                    , ${close?.getFullYear()}, 
                    ${
                      close?.getHours() === 0
                        ? `0${close?.getHours()}`
                        : close?.getHours()
                    }:${
                        close?.getMinutes() === 0
                          ? `0${close?.getMinutes()}`
                          : close?.getMinutes()
                      }
                    `}
                  </p>
                  <p className="w100 df aic jcsb">
                    <span>offitsant</span>
                    {rep?.worker_name}
                  </p>
                  <p className="w100 df aic jcsb">
                    <span>miqdori</span>
                    {rep?.total}
                  </p>
                </label>
              );
            })
          ) : (
            labels?.[label]?.map((hint) => {
              return (
                <>
                  {hint?.name && (
                    <p
                      key={hint?.name}
                      className="df aic report-item info"
                      style={{ width: "100%" }}>
                      {hint?.name}
                    </p>
                  )}
                  {(details?.data?.[hint?.type] || details?.data)?.map(
                    (rep, ind) => {
                      return (
                        <label
                          className={`df aic jcsb report-item ${rep?.st || ""}`}
                          key={`${rep?.type}_${ind}`}>
                          <p>{rep?.type || rep?.name}</p>
                          <span>
                            {(rep?.value || rep?.total || rep?.amount || 0)
                              ?.toString()
                              ?.replace(/\d(?=(\d{3})+$)/g, "$& ") || 0}
                          </span>
                        </label>
                      );
                    }
                  )}
                </>
              );
            })
          )}
        </div>
      </div>
      <div
        className={`w100 df add_payment__container ${
          open && "open_details"
        } order-filter-box`}>
        <div className="add_payment__box">
          <p className="w100 df aic jcsb">
            Filter{" "}
            <span className="filter-close-btn" onClick={() => setOpen(false)}>
              <RxCross2 />
            </span>
          </p>
          <div className="w100 df flc aic filters">
            <label className="w100 df aic">{DateRange()}</label>
            {trees?.map((tree, ind) => {
              return (
                tree.permission?.includes(label) && (
                  <label className="w100 df aic" key={ind}>
                    <Tree
                      checkable
                      onCheck={(vl) => tree?.actions(vl)}
                      checkedKeys={tree?.propertyes}
                      onSelect={(vl) =>
                        tree?.actions((prev) => {
                          if (prev?.includes(vl[0])) {
                            return prev?.filter((v) => v !== vl[0]);
                          } else {
                            return [...prev, vl[0]];
                          }
                        })
                      }
                      treeData={tree?.data}
                    />
                  </label>
                )
              );
            })}
          </div>
          <button
            className="w100 filters-button"
            onClick={() => {
              getData();
              setOpen(false);
              setIsLoading(true);
            }}>
            Filterlash
          </button>
        </div>
        <i onClick={() => setOpen(false)}></i>
      </div>
    </>
  );
};

// /filter/billsReport/:resId/:start/:end

const labels = {
  profit_loss: [
    {
      type: "profits",
    },
    {
      name: "Operativ faoliyatlar",
      type: "expense",
    },
  ],
  cashflow: [
    {
      name: "Operativ faoliyatlar",
      type: "expense",
    },
    {
      name: "Investitsiyalar",
      type: "investment",
    },
    {
      name: "Finans faoliyatlar",
      type: "finance",
    },
  ],
  orders: [{ type: "orders" }],
  department: [{ type: "department" }],
  canceled: [{ type: "canceled" }],
};

const o_types = [
  {
    title: "Buyurtma turlari",
    key: "order_types",
    children: [
      {
        title: "Ochiq",
        key: "opened",
      },
      {
        title: "Yopilgan",
        key: "closed",
      },
      {
        title: "To'langan",
        key: "paid",
      },
      {
        title: "To'lanmagan",
        key: "unpaid",
      },
      {
        title: "Qarz",
        key: "debt",
      },
      {
        title: "O'chirilgan",
        key: "deleted",
      },
      {
        title: "To'langan va Qarz",
        key: "paidDebt",
      },
      {
        title: "To'lanmagan va Qarz",
        key: "unpaidDebt",
      },
      {
        title: "To'langan, To'lanmagan va Qarz",
        key: "unpaidPaidDebt",
      },
    ],
  },
];

const pay_types = [
  {
    title: "To'lov turlari",
    key: "pay_types",
    children: [
      {
        title: "Naqd",
        key: "cash",
      },
      {
        title: "Plastik karta",
        key: "card",
      },
      {
        title: "Pul o'tkazma",
        key: "viaApp",
      },
      {
        title: "Qarz",
        key: "debt",
      },
      {
        title: "Depozit",
        key: "deposit",
      },
      {
        title: "To'lanmaydigan",
        key: "unpaid",
      },
    ],
  },
];

const waiters = [
  {
    title: "Ofitsiantlar",
    key: "waiters",
    children: [],
  },
];

const halls = [
  {
    title: "Zallar",
    key: "halls",
    children: [],
  },
];

const tables = [
  {
    title: "Stollar",
    key: "tables",
    children: [],
  },
];

const department = [
  {
    title: "Bo'limlar",
    key: "department",
    children: [],
  },
];

const categories = [
  {
    title: "Kategoriyalar",
    key: "category",
    children: [],
  },
];
