import React, { useState, useEffect } from "react";
import "./nothification.css";
import { useDispatch } from "react-redux";
import { acNavStatus } from "../../redux/navbar.status";
import socket from "../../socket.config";

export const NothificationPage = () => {
  const [data, setData] = useState(fd);
  const dispatch = useDispatch();
  console.log(data);
  useEffect(() => {
    dispatch(acNavStatus([100]));
  }, [dispatch]);

  socket.on("/get/nothification", (data) => {
    setData(data);
  });
  return (
    <div className="container_box nothification">
      <p>Bildirishnomalar</p>
      <div className=" container_box nothification_box">
        {data?.map((item) => {
          const cls =
            item?.status === "ready"
              ? "success"
              : item.status === "cancel"
              ? "error"
              : "warning";
          const seen = item?.type === "seen" ? "seen" : "";
          return (
            <div
              className={`nothification-item ${cls} ${seen}`}
              // style={{
              //   background: item?.status === "ready" ? "#2dc650" : "tomato",
              // }}
            >
              <div className="nathification-table">
                <p>{item.position}</p>
                <span>{item.table_number}</span>
                <p>stoll</p>
              </div>
              <span className="y-line"></span>
              <div className="nothification-item-info">
                <span>
                  {item.status === "ready" ? "Tayyor" : "Bekor qilindi"}
                </span>
                {item.status === "ready" ? (
                  <p>
                    buyurtmadagi {item.describtion.join(", ")} lar tayyor bo'ldi
                    !
                  </p>
                ) : (
                  <p>
                    buyurtmadagi {item.describtion.join(", ")} lar bekor qilindi
                    !
                  </p>
                )}
              </div>
              <p className="time">{item.time}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const fd = [
  {
    id: "453gre",
    order_id: "348934",
    table_number: "6",
    position: "tashqari",
    describtion: ["osh", "shashlik", "salat"],
    status: "cancel",
    time: "12:00",
    type: "not_seen",
  },
  {
    id: "w43g3e",
    order_id: "234544",
    table_number: "2",
    position: "ichkari",
    describtion: [],
    status: "ready",
    time: "12:20",
    type: "not_seen",
  },
];
