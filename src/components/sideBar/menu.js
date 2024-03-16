import { MdDashboard, MdFastfood, MdTableBar } from "react-icons/md";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { IoIosRestaurant } from "react-icons/io";
import { GiCook, GiRiceCooker, GiPizzaCutter } from "react-icons/gi";
import { BsCashCoin } from "react-icons/bs";
import { RiBoxingFill, RiFileDamageFill } from "react-icons/ri";
import { MdFormatListBulleted, MdAddBusiness } from "react-icons/md";
import { HiOutlineClipboardList } from "react-icons/hi";
import { HiMiniUserGroup, HiRectangleGroup } from "react-icons/hi2";
import { BiSolidCategory, BiSolidComponent } from "react-icons/bi";
import { FaLayerGroup, FaMoneyCheckDollar, FaSitemap } from "react-icons/fa6";
import { TbFileInvoice, TbTruckDelivery } from "react-icons/tb";
import { MdMoveUp, MdRestaurantMenu, MdStorage } from "react-icons/md";
import { TbReport, TbPlaylistX, TbReportAnalytics } from "react-icons/tb";
import { LiaListAlt, LiaOpencart } from "react-icons/lia";
import { PiDotsThreeCircleVerticalFill } from "react-icons/pi";
import { VscUngroupByRefType } from "react-icons/vsc";
import { HiMiniChatBubbleLeftRight } from "react-icons/hi2";

const width = window.innerWidth <= 600 ? true : false;

export const Menu_customer = [
  {
    id: "1",
    path: "/mobile-invoices",
    name: "Bashqaruv paneli ",
    icon: <MdDashboard />,
    list: true,
    permission: true,
  },
  {
    id: "3",
    path: "/financial",
    name: "Kassa boshqaruvi",
    icon: <BsCashCoin />,
    list: true,
    permission: true,
  },
  {
    id: "2",
    path: "/orders",
    name: "Buyurtmalar boshqaruvi",
    icon: <RiBoxingFill />,
    list: true,
    permission: true,
  },
  {
    id: "4",
    path: "/restaurant-all-items",
    name: "Barcha mahsulotlar",
    icon: <HiRectangleGroup />,
    list: true,
    permission: true,
  },
  {
    id: "5",
    path: "/chat-restaurant-staff",
    name: "Chatlar",
    icon: <HiMiniChatBubbleLeftRight />,
    list: true,
    permission: true,
  },
];

export const Category = [
  {
    id: "1",
    path: "",
    name: "Taomlar",
    positions: width ? [0, 0, 80] : [65, -65, 70],
    icon: <IoIosRestaurant />,
  },
  {
    id: "1",
    path: "/workers",
    name: "Ishchilar",
    positions: width ? [-45, 45, 80] : [0, 0, 65],
    icon: <HiMiniUserGroup />,
  },
  {
    id: "12",
    name: "Envantarizatsiya",
    path: "/envantarisation",
    positions: width ? [-90, 90, 75] : [-65, 65, 70],
    icon: <LiaListAlt />,
  },
  {
    id: "1",
    name: "Envantarizatsiya",
    path: "/inventory",
    positions: width ? [-90, 90, 75] : [-65, 65, 70],
    icon: <LiaListAlt />,
  },
  {
    id: "2",
    path: "/",
    name: "Buyurtmalar",
    positions: width ? [0, 0, 80] : [90, -90, 90],
    icon: <RiBoxingFill />,
  },
  {
    id: "2",
    name: "Taomlar hisoboti",
    path: "/items-report",
    positions: width ? [-45, 45, 80] : [45, -45, 90],
    icon: <MdRestaurantMenu />,
  },
  {
    id: "2",
    name: "Bekor qilindan taomlar",
    path: "/rejects",
    positions: width ? [-90, 90, 75] : [0, 0, 90],
    icon: <TbPlaylistX />,
  },

  {
    id: "2",
    name: "Oldindan buyurtma",
    path: "/pre-orders",
    positions: width ? [-135, 135, 80] : [-45, 45, 90],
    icon: <GiRiceCooker />,
  },
  {
    id: "2",
    name: "Stollar & Xonalar",
    path: "/tables",
    positions: width ? [-180, 180, 80] : [-90, 90, 90],
    icon: <MdTableBar />,
  },
  {
    id: "22",
    path: "/cooking/food",
    name: "Tayyorlanayotgan taomlar",
    positions: [],
    icon: <GiCook />,
  },
  {
    id: "22",
    path: "/prepared/food",
    name: "Tayyor bo'lgan taomlar",
    positions: [],
    icon: <MdFastfood />,
  },
  {
    id: "3",
    path: "",
    name: "To'lov kiritish",
    positions: width ? [0, 0, 80] : [90, -90, 90],
    icon: <BsCashCoin />,
  },
  {
    id: "3",
    name: "Tranzaksiyalar",
    path: "/cashbox/transactions",
    positions: width ? [-45, 45, 80] : [45, -45, 90],
    icon: <MdStorage />,
  },
  {
    id: "3",
    name: "Kassa hisoboti",
    path: "/cashbox/transaction-report",
    positions: width ? [-90, 90, 75] : [0, 0, 90],
    icon: <MdStorage />,
  },
  {
    id: "3",
    name: "Kassalar",
    path: "/cashbox",
    positions: width ? [-135, 135, 80] : [-45, 45, 90],
    icon: <MdStorage />,
  },
  {
    id: "3",
    name: "Buyurtmalar",
    path: "/order-reports",
    positions: width ? [-180, 180, 80] : [-90, 90, 90],
    icon: <TbReport />,
  },
  {
    id: "4",
    name: "To'lovlar",
    path: "",
    positions: width ? [0, 0, 80] : [90, -90, 90],
    icon: <FaMoneyCheckDollar />,
  },
  {
    id: "4",
    name: "Chiqimlar",
    path: "/expenses",
    positions: width ? [-45, 45, 80] : [45, -45, 90],
    icon: <TbFileInvoice />,
  },
  {
    id: "4",
    name: "Taqsimlash",
    path: "/cutting",
    positions: width ? [-90, 90, 75] : [0, 0, 90],
    icon: <GiPizzaCutter />,
  },
  {
    id: "4",
    name: "Zararlangan taomlar",
    path: "/damaged-items",
    positions: width ? [-135, 135, 80] : [-45, 45, 90],
    icon: <RiFileDamageFill />,
  },
  {
    id: "4",
    name: "Ko'chirib o'tkazish",
    path: "/carry-up",
    positions: width ? [-180, 180, 80] : [-90, 90, 90],
    icon: <MdMoveUp />,
  },
  {
    id: "4",
    name: "Mahsulot tayyorlash",
    path: "/making-food",
    positions: [],
    icon: <GiRiceCooker />,
  },
  {
    id: "5",
    name: "Yetkazuvchilar",
    path: "",
    positions: width ? [0, 0, 80] : [90, -90, 90],
    icon: <TbTruckDelivery />,
  },
  {
    id: "5",
    path: "/storage",
    name: "Ombor",
    positions: width ? [-45, 45, 80] : [45, -45, 90],
    icon: <FaLayerGroup />,
  },
  {
    id: "5",
    name: "Bo'limlar",
    path: "/departments",
    positions: width ? [-90, 90, 75] : [0, 0, 90],
    icon: <BiSolidComponent />,
  },
  {
    id: "5",
    name: "Categoriyalar",
    path: "/categories",
    positions: width ? [-135, 135, 80] : [-45, 45, 90],
    icon: <BiSolidCategory />,
  },
  {
    id: "5",
    name: "Guruhlar",
    path: "/groups",
    positions: width ? [-180, 180, 80] : [-90, 90, 90],
    icon: <MdStorage />,
  },
  {
    id: "5",
    name: "Ingredientlar",
    path: "/ingredients",
    positions: [],
    icon: <HiOutlineClipboardList />,
  },
  {
    id: "55",
    name: "Mahsulotlar",
    path: "/s-products",
    positions: [],
    icon: <GiRiceCooker />,
  },
  {
    id: "55",
    name: "To'lov guruhlari",
    path: "/invoice-group",
    positions: [],
    icon: <MdStorage />,
  },
  {
    id: "55",
    name: "To'lov guruhlari",
    path: "/cashbox/transaction-group",
    positions: [],
    icon: <MdStorage />,
  },
  {
    id: "6",
    name: "Mahsulotlar hisoboti",
    path: "/report-according-by-one-ingredient",
    positions: width ? [0, 0, 80] : [90, -90, 90],
    icon: <TbReportAnalytics />,
  },
  {
    id: "6",
    name: "Yetkazuvchi hisoboti",
    path: "/supplier-reports",
    positions: width ? [-45, 45, 80] : [45, -45, 90],
    icon: <LiaOpencart />,
  },
  {
    id: "6",
    name: "Mahsulotlar hisoboti",
    path: "/ingredient-reports",
    positions: width ? [-90, 90, 75] : [0, 0, 90],
    icon: <HiRectangleGroup />,
  },
  {
    id: "6",
    name: "Mahsulotlar hisoboti",
    path: "/navigation",
    positions: width ? [-135, 135, 80] : [-45, 45, 90],
    icon: <VscUngroupByRefType />,
  },
  {
    id: "6",
    name: "Mahsulotlar hisoboti",
    path: "/documents",
    positions: width ? [-180, 180, 80] : [-90, 90, 90],
    icon: <MdDashboard />,
  },
  {
    id: "0765435",
    name: "Restaurant list",
    path: "",
    positions: [],
    icon: <MdFormatListBulleted />,
  },
  {
    id: "0765435",
    name: "Add restaurant",
    path: "/add",
    positions: [],
    icon: <MdAddBusiness />,
  },
];
