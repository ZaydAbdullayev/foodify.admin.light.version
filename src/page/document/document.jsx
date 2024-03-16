import React, { useState } from "react";
import "./document.css";
import { useNavigate, useLocation } from "react-router-dom";
import { MdDateRange } from "react-icons/md";
import AnimatedNumber from "animated-number-react";
import { useFetchDataQuery } from "../../service/fetch.service";
import { DocumentByC } from "../documentByC/documentByC";
import { LoadingBtn } from "../../components/loading/loading";
import { useDispatch, useSelector } from "react-redux";
import { acNavStatus } from "../../redux/navbar.status";
import dayjs from "dayjs";
import { DatePicker, Result, Button } from "antd";
const { RangePicker } = DatePicker;

export const Document = () => {
  const navigate = useNavigate();
  const res_id = useSelector((state) => state.res_id);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState({
    fdate: new Date().toISOString().split("T")[0],
    tdate: new Date().toISOString().split("T")[0],
  });
  const { data = [], isLoading } = useFetchDataQuery({
    url: `get/departmentSales/${res_id}/${date?.fdate}/${date?.tdate}`,
    tags: [""],
  });
  const search = useLocation().search?.split("=").pop();
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(acNavStatus([100]));
  }, [dispatch]);

  const getCategry = (name) => {
    navigate(`/historical/?cp=${name}|dateby=${date.fdate}&${date.tdate}`);
    setOpen(true);
  };

  const formatValue = (value) => value.toFixed(0);

  const filteredData = data?.departmentSales?.filter((item) => {
    return item?.department?.toLowerCase()?.includes(search?.toLowerCase());
  });

  return (
    <div className="container_box document_box">
      <div className="document_header">
        <h1>Barcha hisobotlar</h1>

        <div className="filter_date">
          <RangePicker
            defaultValue={[dayjs(date.start), dayjs(date.end)]}
            aria-label="select data from to end"
            onChange={(date, dateString) =>
              setDate({
                start: dateString?.[0],
                end: dateString?.[1],
              })
            }
          />
        </div>
      </div>
      <div className="document_body">
        {isLoading ? (
          <span className="loader_box relative">
            <LoadingBtn />
          </span>
        ) : filteredData?.length ? (
          filteredData?.map((item, index) => {
            return (
              <div
                className="document_item"
                key={index}
                onClick={() => getCategry(item?.department)}>
                <p>
                  <MdDateRange />
                  <span>bugun:</span>
                  <span style={{ textTransform: "lowercase" }}>
                    <AnimatedNumber
                      value={item?.totalQuantity}
                      formatValue={formatValue}
                    />{" "}
                    ta
                  </span>
                </p>
                <h3>{item?.department}</h3>
                <span>
                  $ :{" "}
                  <AnimatedNumber
                    value={item?.totalSales}
                    formatValue={formatValue}
                  />{" "}
                  sum
                </span>
              </div>
            );
          })
        ) : (
          <figure className="no_result">
            <Result
              status="404"
              title="Hisobotlar yo'q"
              subTitle="Hisbot ma'lumotlari topilmadi yoki mavjud emas !"
              extra={
                <Button onClick={() => window.location.reload()}>
                  Sahifani yangilash
                </Button>
              }
            />
          </figure>
        )}
      </div>
      <DocumentByC open={open} setOpen={setOpen} />
    </div>
  );
};
