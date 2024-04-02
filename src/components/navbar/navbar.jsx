import React from "react";
import "./navbar.css";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { acOpenMadal, acCloseModal } from "../../redux/modal";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { acSearch } from "../../redux/search";
import { acMedia } from "../../redux/media";
import { UniversalFilterBox } from "../filter/filter";
import { acOpenUModal } from "../../redux/u-modal";
import DeleteSelectedElementss from "../../service/delete-elements.service";
import { enqueueSnackbar as es } from "notistack";
import { setRelease } from "../../redux/deleteFoods";
import { notification } from "antd";

import { BiEdit, BiPlus } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { MdTableBar } from "react-icons/md";
import { BsSearch } from "react-icons/bs";
import { FaBell } from "react-icons/fa";
import { ImStatsBars } from "react-icons/im";
import default_img from "../../assets/images/default-img.png";
import logo from "../../assets/images/logo.png";
import addOrder from "../../assets/images/add_order.png";
import { SlArrowLeft } from "react-icons/sl";

export const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user")) || [];
  const dep = JSON.parse(localStorage.getItem("department")) || [];
  const modal = useSelector((state) => state.modal);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const name = user?.user?.username?.split("_")?.join(" ");
  const w_name = user?.user?.name?.split("_")?.join(" ");
  const status = useSelector((state) => state.status);
  const media = useSelector((state) => state.media);
  const delDocuments = useSelector((state) => state.delRouter);
  const page_code = useLocation().search.split("=")[1];
  const delData = delDocuments?.[page_code];
  const [api, contextHolder] = notification.useNotification();

  const deleteDocuments = async () => {
    if (delDocuments?.[page_code]?.length > 0) {
      const result = await DeleteSelectedElementss(page_code, delData);
      if (result.status === "success") {
        es({ message: "Muvaffaqiyatli o'chirildi", variant: "success" });
        dispatch(setRelease(page_code));
      } else {
        es({ message: "Xatolik yuz berdi", variant: "error" });
      }
    } else {
      const placement = "topRight";
      api.warning({
        message: "Xatolik",
        description: "O'chirish uchun mavjud malumot yo'q!",
        placement,
      });
    }
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

  const openUModalU = () => {
    if (delDocuments?.[page_code]?.length === 1) {
      dispatch(acOpenUModal());
    } else {
      const placement = "topRight";
      api.warning({
        message: "Xatolik",
        description: "O'zgartirish uchun mavjud malumot yo'q!",
        placement,
      });
    }
  };

  const handleSort = (value) => {
    dispatch(acSearch(value));
    navigate(`?search=${value}`);
  };

  const log_out = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="navbar">
      {contextHolder}
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
      <div
        className="nav_menu"
        onClick={() => dispatch(acMedia(media ? false : true))}>
        <img src={logo} alt="" />
      </div>
      {status?.includes(0) && (
        <form className="short_hands" onSubmit={(e) => e.preventDefault()}>
          {status?.includes(1) && (
            <button
              type="button"
              onClick={openUModal}
              aria-label="open modal belong's to active page">
              <BiPlus />
            </button>
          )}
          {status.includes(101) && (
            <button
              type="button"
              onClick={openUModal}
              aria-label="open modal for add table's modal">
              <b>+</b>
              <MdTableBar />{" "}
            </button>
          )}
          {status?.includes(2) && (
            <button
              type="button"
              style={
                delDocuments?.[page_code]?.length === 1
                  ? {}
                  : { opacity: "0.4", border: "1px solid #ccc6" }
              }
              onClick={openUModalU}
              aria-label="open modal for edit belong's active page">
              <BiEdit />
            </button>
          )}
          {status?.includes(3) && (
            <button
              type="button"
              style={
                delDocuments?.[page_code]?.length > 0
                  ? {}
                  : { opacity: "0.4", border: "1px solid #ccc6" }
              }
              onClick={() => deleteDocuments()}
              aria-label="open modal for delete belong's active page">
              <MdDelete />
            </button>
          )}
          <UniversalFilterBox />
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
      {status?.length === 0 && <i></i>}
      <div className="profile">
        {["owner", "manager", "cashier"].includes(dep) && (
          <span onClick={() => navigate("/orders/tables")}>
            <img src={addOrder} alt="icon" aria-label="icon" />
          </span>
        )}
        {dep === "owner" && (
          <span
            onClick={() => navigate("/statistics")}
            aria-label="target statistics page">
            <ImStatsBars />
          </span>
        )}
        <span
          onClick={() => navigate("/nothifications")}
          aria-label="target nothification page">
          <FaBell />
        </span>
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
        <div className="user">
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
