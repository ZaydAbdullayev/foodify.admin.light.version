import React, { useState } from "react";
import "./navbar.css";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { acOpenMadal, acCloseModal } from "../../redux/modal";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { acSearch } from "../../redux/search";
import { UniversalFilterBox } from "../filter/filter";
import { acOpenUModal } from "../../redux/u-modal";
import { Dropdown } from "antd";
import { useFetchDataQuery } from "../../service/fetch.service";
// import { setRelease } from "../../redux/deleteFoods";
// import { notification } from "antd";

// import { BiEdit, BiPlus } from "react-icons/bi";
// import { MdDelete } from "react-icons/md";
import { BsSearch } from "react-icons/bs";
import { FaBell } from "react-icons/fa";
import default_img from "../../assets/images/default-img.png";
import logo from "../../assets/images/logo.png";
import addOrder from "../../assets/images/add_order.png";
import { SlArrowLeft } from "react-icons/sl";
import { MdTableBar, MdOutlineTransferWithinAStation } from "react-icons/md";
import { FcSafe } from "react-icons/fc";

export const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user")) || [];
  const dep = JSON.parse(localStorage.getItem("department")) || [];
  const { data: cx = [] } = useFetchDataQuery({
    url: `get/cashbox/${user?.user?.id}`,
    tags: ["cashbox"],
  });

  const modal = useSelector((state) => state.modal);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const name = user?.user?.username?.split("_")?.join(" ");
  const w_name = user?.user?.name?.split("_")?.join(" ");
  const status = useSelector((state) => state.status);
  const location = useLocation();
  // const delDocuments = useSelector((state) => state.delRouter);
  // const [api, contextHolder] = notification.useNotification();

  const items = cx?.data?.map((item) => ({
    key: item?.name,
    label: item?.name,
    icon: <FcSafe />,
  }));
  const [activeCash, setActiveCash] = useState(items?.[0]?.key);
  const handleMenuClick = (e) => {
    console.log("click", e);
    setActiveCash(e.key);
    JSON?.stringify(localStorage.setItem("cashbox", e.key));
  };

  const menuProps = {
    items: items || [],
    onClick: handleMenuClick,
  };

  const openModal = () => {
    dispatch(acOpenMadal());
  };

  const closeModal = () => {
    dispatch(acCloseModal());
  };

  const openUModal = () => {
    dispatch(acOpenUModal());
  };

  // const openUModalU = () => {
  //   const placement = "topRight";
  //   api.warning({
  //     message: "Xatolik",
  //     description: "O'zgartirish uchun mavjud malumot yo'q!",
  //     placement,
  //   });
  // };

  const handleSort = (value) => {
    dispatch(acSearch(value));
    navigate(`?search=${value}`);
  };

  const log_out = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="w100 df aic navbar">
      <span
        className="backword"
        onClick={() => {
          if (window.location.pathname === "/chat-restaurant-staff") {
            navigate("?closeChat");
          } else {
            navigate(-1);
          }
        }}>
        <SlArrowLeft />
      </span>
      <div className="nav_menu">
        <img src={logo} alt="" />
      </div>
      {status?.includes(0) && (
        <form className="short_hands" onSubmit={(e) => e.preventDefault()}>
          {/* {status?.includes(1) && (
            <button
              type="button"
              onClick={openUModal}
              aria-label="open modal belong's to active page">
              <BiPlus />
            </button>
          )} */}
          {status.includes(101) && (
            <button
              type="button"
              onClick={openUModal}
              aria-label="open modal for add table's modal">
              <b>+</b>
              <MdTableBar />{" "}
            </button>
          )}
          <UniversalFilterBox />
          {location?.search?.split("title=").length && (
            <span className="page-title">
              {location?.search
                ?.split("title=")[1]
                ?.split("%E2%84")
                .join("№")
                .split("%20")
                .join(" ")}
            </span>
          )}
        </form>
      )}

      {status.includes(100) && (
        <form className="search">
          <BsSearch />
          <input
            type="search"
            name="search"
            placeholder="Qidirish..."
            required
            onChange={(e) => handleSort(e.target.value)}
            autoComplete="off"
          />
        </form>
      )}

      <i className="line-block"></i>

      <div className="profile">
        {["owner", "manager", "cashier"].includes(dep) && (
          <span onClick={() => navigate("/orders/tables")}>
            <img src={addOrder} alt="icon" aria-label="icon" />
          </span>
        )}

        {/*dep === "owner" && (
          <span
            onClick={() => navigate("/statistics")}
            aria-label="target statistics page">
            <ImStatsBars />
          </span>
        )*/}
        <span
          onClick={() => navigate("/nothifications")}
          aria-label="target nothification page">
          <FaBell />
        </span>
        <Dropdown.Button
          menu={menuProps}
          placement="bottom"
          icon={<MdOutlineTransferWithinAStation />}>
          {activeCash}
        </Dropdown.Button>
        <img
          src={user?.user?.img || default_img}
          alt="user_photo"
          onClick={openModal}
          aria-label="user's image and open the modal when click"
        />
      </div>
      <div
        className={modal ? "modal_box" : "modal_box close_modal"}
        onMouseLeave={closeModal}>
        <div className="df aic jcsb user">
          <b>{dep === "owner" ? name : w_name}</b>
          <figure>
            <img src={user?.user?.img || default_img} alt="user_photo" />
            <button
              onClick={closeModal}
              aria-label="close user's information modal">
              x
            </button>
          </figure>
        </div>
        <ul>
          <Link to="/" aria-label="Ma'lumotlarim">
            Ma'lumotlarim
          </Link>
          <Link to="/" aria-label="Manzillarim">
            Manzillarim
          </Link>
          <Link to="/my-receive-orders" aria-label="Buyurtlarim">
            Buyurtlarim
          </Link>
          <Link to="/" aria-label="Bildirishnomalar">
            Bildirishnomalar
          </Link>
          <li onClick={log_out} aria-label="log out">
            Chiqish
          </li>
        </ul>
      </div>
    </div>
  );
};
