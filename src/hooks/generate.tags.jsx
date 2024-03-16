import React from "react";
import { useState } from "react";
import { DatePicker, Input, InputNumber, Select, Checkbox, Table } from "antd";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { acActiveSt_id } from "../redux/active";
import "./hook.css";
import { acCutting } from "../redux/calc";

function genrateId() {
  const roomNumber = Math.floor(100000 + Math.random() * 900000);
  return roomNumber;
}

export const GenerateField = ({ fieldData }) => {
  const dispatch = useDispatch();
  const [datas, setDatas] = useState({ name: "", id: "" });
  const {
    type = "text",
    options = [],
    plc_hr = "",
    df_value = "",
    name = "",
    extra = "",
    take_id = false,
    shareV = false,
  } = fieldData;

  const getExtraValue = (extra) => {
    const values = extra?.split("=")?.[1]?.split("|");
    setDatas({ ...datas, name: values[0], id: values[1] });
    if (take_id) {
      dispatch(acActiveSt_id(values[1]));
    }
  };

  const getSelectValue = (value) => {
    setDatas({ ...datas, select: value });
  };

  const onlyNumber = (value) => {
    const newValue = value.replace(/[^0-9]/g, "");
    return newValue;
  };

  switch (type) {
    case "select":
      return (
        <>
          <Select
            aria-label="place for choose option"
            defaultValue={df_value}
            onChange={getSelectValue}
            options={options.map((item) => ({
              label: item?.name,
              value: item?.name,
            }))}
          />
          <input name={name} type="hidden" value={datas?.select} />
        </>
      );

    case "input":
      return (
        <>
          <Input
            name={name}
            placeholder={plc_hr}
            defaultValue={df_value}
            aria-label="place for write info"
          />
        </>
      );

    case "inputD":
      return (
        <>
          <DatePicker
            name={name}
            defaultValue={dayjs(df_value)}
            aria-label="place for select date"
          />
        </>
      );

    case "checkbox":
      return (
        <>
          <Checkbox
            name={name}
            defaultChecked={df_value}
            aria-label="place for check this element"
          />
        </>
      );

    case "inputN":
      return (
        <InputNumber
          name={name}
          formatter={(value) => `${onlyNumber(value)}`}
          parser={(value) => onlyNumber(value)}
          placeholder={plc_hr}
          defaultValue={df_value}
          onChange={(e) => shareV && dispatch(acCutting(e))}
          min={1}
          max={9999999999}
          aria-label="place for write number value"
        />
      );

    case "inputH":
      return (
        <input
          type="hidden"
          name={name}
          defaultValue={df_value}
          aria-label="place for secret value"
        />
      );

    case "s_extra":
      return (
        <>
          <Select
            aria-label="place for choose option"
            defaultValue={df_value}
            onChange={getExtraValue}
            options={
              Array.isArray(options)
                ? options.map((item) => ({
                    label: item?.name,
                    value: `${extra}=${item?.name}|${item?.id}`,
                  }))
                : []
            }
          />
          <input
            type="hidden"
            name={name}
            value={datas?.name}
            aria-label={`place for secret value ${datas?.name}`}
          />
          <input
            type="hidden"
            name={extra}
            value={datas?.id}
            aria-label={`place for secret value ${datas?.id}`}
          />
        </>
      );

    case "s_search":
      return (
        <Select
          showSearch
          placeholder={plc_hr}
          defaultValue={df_value}
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? "").includes(input)
          }
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? "")
              .toLowerCase()
              .localeCompare((optionB?.label ?? "").toLowerCase())
          }
          options={
            options?.map((item) => ({
              value: item?.id,
              label: item?.name,
            })) || []
          }
        />
      );

    default:
      return null;
  }
};

export const DynamicTable = ({ data, index }) => {
  const key = genrateId();
  const columns = Object.keys(data[0]).map((key) => ({
    title: key,
    dataIndex: key,
    key: key,
  }));
  return <Table dataSource={data} columns={columns} key={key + index} />;
};

export const CheckBox = ({ name, label, description = "", value }) => {
  return (
    <label className="universal-checkbox">
      <input type="radio" name={name} required value={value} />
      <span className="checkmark">
        <span>{label}</span>
        <span style={{ color: "#eee6" }}>{description}</span>
      </span>
    </label>
  );
};
