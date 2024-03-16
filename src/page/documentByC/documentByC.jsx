import React, { memo } from "react";
import "./documentByC.css";
import { useLocation } from "react-router-dom";
import { NumericFormat } from "react-number-format";
import { useFetchDataQuery } from "../../service/fetch.service";
import { LoadingBtn } from "../../components/loading/loading";
import { useSelector } from "react-redux";

export const DocumentByC = memo(({ open, setOpen }) => {
  const ct = useLocation().search.split("?cp=").pop();
  const res_id = useSelector((state) => state?.res_id);
  const department = ct.split("|").shift();
  const date = ct.split("|dateby=").pop();
  const dData = {
    dep: department,
    start: date.split("&").shift(),
    end: date.split("&").pop(),
  };
  const { data = [], isLoading } = useFetchDataQuery({
    url: `get/departmentProfit/${res_id}/${dData?.dep}/${dData?.start}/${dData?.end}`,
    tags: [""],
  });

  return (
    <div className={open ? "document_conatainer open" : "document_conatainer"}>
      <div className="category_box">
        <h1>
          <span style={{ textTransform: "capitalize" }}>
            {department.split("%20").join(" ")}
          </span>{" "}
          bo'limi uchun hisobot
        </h1>
        <div className="category_body">
          {isLoading ? (
            <LoadingBtn />
          ) : (
            data?.departmentProfit?.map((item) => {
              return (
                <div className="category_item">
                  <h3>{item?.product}</h3>
                  <span>{item?.totalQuantity} ta</span>
                  <NumericFormat
                    value={item?.totalPrice}
                    displayType={"text"}
                    thousandSeparator=" "
                    suffix={" so'm"}
                  />
                </div>
              );
            })
          )}
        </div>
        <div className="category_footer">
          <button onClick={() => setOpen(false)} aria-label="backword">
            Orqaga
          </button>
          <button aria-label="as">lorem</button>
        </div>
      </div>
    </div>
  );
});
