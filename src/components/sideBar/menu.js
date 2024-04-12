import { MdDashboard } from "react-icons/md";
import { BsCashCoin } from "react-icons/bs";
import { RiBoxingFill } from "react-icons/ri";
import { HiRectangleGroup } from "react-icons/hi2";
import { HiMiniChatBubbleLeftRight } from "react-icons/hi2";
import { MdTableBar } from "react-icons/md";
import { ImStatsBars } from "react-icons/im";
import { TbReportAnalytics, TbChecklist } from "react-icons/tb";

const dep = JSON.parse(localStorage.getItem("department"));

export const Menu_customer = [
  {
    id: "43",
    path: "/statistics",
    name: "statistikalar",
    icon: <ImStatsBars />,
    list: true,
    permission: ["owner"].includes(dep) ? true : false,
  },
  {
    id: "1",
    path: "/mobile-invoices",
    name: "Bashqaruv paneli ",
    icon: <MdDashboard />,
    list: true,
    permission: ["ish boshqaruvchi", "kassir", "buxgalter"].includes(dep)
      ? true
      : false,
  },
  {
    id: "6",
    path: "/orders/tables",
    name: "Buyurtmalar",
    icon: <MdTableBar />,
    list: true,
    permission: ["offitsant"].includes(dep) ? true : false,
  },
  {
    id: "3",
    path: "/financial",
    name: "Kassa boshqaruvi",
    icon: <BsCashCoin />,
    list: true,
    permission: ["ish boshqaruvchi", "kassir", "buxgalter"].includes(dep)
      ? true
      : false,
  },
  {
    id: "2",
    path:
      dep !== "offitsant" ? "/orders" : "oshpaz" ? "/" : "/my-receive-orders",
    name: "Buyurtmalar boshqaruvi",
    icon: <RiBoxingFill />,
    list: true,
    permission: [
      "ish boshqaruvchi",
      "kassir",
      "oshpaz",
      "buxgalter",
      "barmen",
    ].includes(dep)
      ? true
      : false,
  },
  {
    id: "4",
    path: "/restaurant-all-items",
    name: "Barcha mahsulotlar",
    icon: <HiRectangleGroup />,
    list: true,
    permission: [
      "ish boshqaruvchi",
      "kassir",
      "offitsant",
      "buxgalter",
      "barmen",
    ].includes(dep)
      ? true
      : false,
  },
  {
    id: "8",
    path: "/restaurant-reports",
    name: "Hisobotlar",
    icon: <TbReportAnalytics />,
    list: true,
    permission: ["owner"].includes(dep) ? true : false,
  },
  {
    id: "9",
    path: "/restaurant-inventory",
    name: "Invantarizatsiya",
    icon: <TbChecklist />,
    list: true,
    permission: ["owner"].includes(dep) ? true : false,
  },
  {
    id: "5",
    path: "/chat-restaurant-staff",
    name: "Chatlar",
    icon: <HiMiniChatBubbleLeftRight />,
    list: true,
    permission: [
      "owner",
      "ish boshqaruvchi",
      "kassir",
      "buxgalter",
      "offitsant",
      "barmen",
    ].includes(dep)
      ? true
      : false,
  },
];
