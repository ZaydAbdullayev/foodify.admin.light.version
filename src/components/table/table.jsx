import React from "react";
import "./table.css";
import { useNavigate } from "react-router-dom";

import { HiUser } from "react-icons/hi";

export const Table = ({ data = [] }) => {
  const navigate = useNavigate();

  const handleTarget = (item) => {
    const location = item?.location?.split(" ")?.join("-");
    if (item?.status === 0) {
      navigate(`/category/${location}/${item?.name}/${item?.id}`);
      return;
    }
    navigate(`${location}/${item?.name}-${item?.id}/${item?.order_id}`);
  };

  return data?.map((item) => {
    return (
      <div
        className="table_box"
        key={item?.id}
        onClick={() => handleTarget(item)}
        style={{
          "--table-w":
            item?.people === 6
              ? "var(--table-w-2)"
              : item?.people >= 8
              ? "var(--table-w-3)"
              : "var(--table-w-1)",
        }}
        aria-label="tables component"
      >
        <div
          className={
            item?.status === 0
              ? "chair"
              : item?.status === 1
              ? "chair busy_chair"
              : "chair served_chair"
          }
          style={{
            "--chair-w": item?.people === 6 ? 3 : item?.people >= 8 ? 4 : 2,
          }}
        ></div>
        <div
          className={
            item?.status === 0
              ? "chair"
              : item?.status === 1
              ? "chair busy_chair"
              : "chair served_chair"
          }
          style={{
            "--chair-w": item?.people === 6 ? 3 : item?.people >= 8 ? 4 : 2,
          }}
        ></div>
        {item?.people >= 6 && (
          <div
            className={
              item?.status === 0
                ? "chair"
                : item?.status === 1
                ? "chair busy_chair"
                : "chair served_chair"
            }
            style={{
              "--chair-w": item?.people === 6 ? 3 : item?.people >= 8 ? 4 : 2,
            }}
          ></div>
        )}
        {item?.people >= 8 && (
          <div
            className={
              item?.status === 0
                ? "chair"
                : item?.status === 1
                ? "chair busy_chair"
                : "chair served_chair"
            }
            style={{
              "--chair-w": item?.people === 6 ? 3 : item?.people >= 8 ? 4 : 2,
            }}
          ></div>
        )}
        <div
          className={
            item?.status === 0
              ? "table"
              : item?.status === 1
              ? "table busy_table"
              : "table served_table"
          }
        >
          <span>{item?.name}</span>
          {item?.percentage !== 10 && <sub>{item?.percentage}%</sub>}
          {item?.people > 8 && (
            <p className="people">
              <HiUser /> {item?.people}
            </p>
          )}
        </div>
        <div
          className={
            item?.status === 0
              ? "chair"
              : item?.status === 1
              ? "chair busy_chair"
              : "chair served_chair"
          }
          style={{
            "--chair-w": item?.people === 6 ? 3 : item?.people >= 8 ? 4 : 2,
          }}
        ></div>
        <div
          className={
            item?.status === 0
              ? "chair"
              : item?.status === 1
              ? "chair busy_chair"
              : "chair served_chair"
          }
          style={{
            "--chair-w": item?.people === 6 ? 3 : item?.people >= 8 ? 4 : 2,
          }}
        ></div>
        {item?.people >= 6 && (
          <div
            className={
              item?.status === 0
                ? "chair"
                : item?.status === 1
                ? "chair busy_chair"
                : "chair served_chair"
            }
            style={{
              "--chair-w": item?.people === 6 ? 3 : item?.people >= 8 ? 4 : 2,
            }}
          ></div>
        )}
        {item?.people >= 8 && (
          <div
            className={
              item?.status === 0
                ? "chair"
                : item?.status === 1
                ? "chair busy_chair"
                : "chair served_chair"
            }
            style={{
              "--chair-w": item?.people === 6 ? 3 : item?.people >= 8 ? 4 : 2,
            }}
          ></div>
        )}
      </div>
    );
  });
};
