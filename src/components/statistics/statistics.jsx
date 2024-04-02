import React from "react";
import { DualAxes } from "@ant-design/plots";
import { Pie, measureTextWidth } from "@ant-design/plots";
import "./statistics.css";

export const DemoDualAxes = () => {
  const uvBillData = [
    {
      time: "2023-03",
      value: 350,
      type: "oylik",
    },
    {
      time: "2023-04",
      value: 900,
      type: "oylik",
    },
    {
      time: "2023-05",
      value: 300,
      type: "oylik",
    },
    {
      time: "2023-06",
      value: 450,
      type: "oylik",
    },
    {
      time: "2023-07",
      value: 470,
      type: "oylik",
    },
    {
      time: "2023-03",
      value: 220,
      type: "haftalik",
    },
    {
      time: "2023-04",
      value: 300,
      type: "haftalik",
    },
    {
      time: "2023-05",
      value: 250,
      type: "haftalik",
    },
    {
      time: "2023-06",
      value: 220,
      type: "haftalik",
    },
    {
      time: "2023-07",
      value: 100,
      type: "haftalik",
    },
  ];
  const transformData = [
    {
      time: "2023-03",
      count: 800,
      name: "chiqim",
    },
    {
      time: "2023-04",
      count: 600,
      name: "chiqim",
    },
    {
      time: "2023-05",
      count: 400,
      name: "chiqim",
    },
    {
      time: "2023-06",
      count: 380,
      name: "chiqim",
    },
    {
      time: "2023-07",
      count: 20,
      name: "chiqim",
    },
    {
      time: "2023-03",
      count: 750,
      name: "kirim",
    },
    {
      time: "2023-04",
      count: 650,
      name: "kirim",
    },
    {
      time: "2023-05",
      count: 450,
      name: "kirim",
    },
    {
      time: "2023-06",
      count: 400,
      name: "kirim",
    },
    {
      time: "2023-07",
      count: 620,
      name: "kirim",
    },
    {
      time: "2023-03",
      count: 900,
      name: "foyda",
    },
    {
      time: "2023-04",
      count: 600,
      name: "foyda",
    },
    {
      time: "2023-05",
      count: 450,
      name: "foyda",
    },
    {
      time: "2023-06",
      count: 300,
      name: "foyda",
    },
    {
      time: "2023-07",
      count: 200,
      name: "foyda",
    },
  ];
  const config = {
    data: [uvBillData, transformData],
    xField: "time",
    yField: ["value", "count"],
    geometryOptions: [
      {
        geometry: "line",
        seriesField: "type",
        lineStyle: {
          lineWidth: 2,
          lineDash: [5, 5],
        },
        smooth: true,
      },
      {
        geometry: "line",
        seriesField: "name",
        point: {},
      },
    ],
  };
  return <DualAxes {...config} />;
};

export const DemoPie = ({ data }) => {
  function renderStatistic(containerWidth, text, style) {
    const { width: textWidth, height: textHeight } = measureTextWidth(
      text,
      style
    );
    const R = containerWidth / 2; // r^2 = (w / 2)^2 + (h - offsetY)^2

    let scale = 1;

    if (containerWidth < textWidth) {
      scale = Math.min(
        Math.sqrt(
          Math.abs(
            Math.pow(R, 2) /
              (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2))
          )
        ),
        1
      );
    }

    const textStyleStr = `width:${containerWidth}px;`;
    return `<div style="${textStyleStr};font-size:${scale}em;line-height:${
      scale < 1 ? 1 : "inherit"
    };">${text}</div>`;
  }

  const config = {
    appendPadding: 10,
    data,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.64,
    meta: {
      value: {
        formatter: (v) => `${v} sum`,
      },
    },
    label: {
      type: "inner",
      offset: "-50%",
      style: {
        textAlign: "center",
      },
      autoRotate: true,
      content: "",
    },
    statistic: {
      title: {
        offsetY: -4,
        customHtml: (container, view, datum) => {
          const { width, height } = container.getBoundingClientRect();
          const d = Math.sqrt(Math.pow(width / 1, 2) + Math.pow(height / 1, 2));
          const text = datum ? datum.type : "Umimiy foyda";
          return renderStatistic(d, text, {
            fontSize: 18,
          });
        },
      },
      content: {
        offsetY: 4,
        style: {
          fontSize: 16,
        },
        customHtml: (container, view, datum, data) => {
          const { width } = container.getBoundingClientRect();
          const text = datum
            ? `${datum.value} sum`
            : `${data.reduce((r, d) => r + d.value, 0)} sum`;
          return renderStatistic(width, text, {
            fontSize: 16,
          });
        },
      },
    },
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
      {
        type: "pie-statistic-active",
      },
    ],
  };
  return <Pie {...config} />;
};
