import React, { useState } from "react";
import "./products.css";
import { Link, useLocation } from "react-router-dom";
import { NumericFormat } from "react-number-format";
import { enqueueSnackbar as es } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { LoadingBtn } from "../../components/loading/loading";
import { acNavStatus } from "../../redux/navbar.status";
import { useNavigate } from "react-router-dom";
import { ImgService } from "../../service/image.service";
import { useFetchDataQuery } from "../../service/fetch.service";
import { useDelDataMutation } from "../../service/fetch.service";
import { usePatchDataMutation } from "../../service/fetch.service";

import { GoSearch } from "react-icons/go";
import { AiFillDelete } from "react-icons/ai";
import { ImCancelCircle } from "react-icons/im";
import { FaPen, FaCheck } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import { TbInfoSquareRounded } from "react-icons/tb";

export const Products = () => {
  const { search, pathname } = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [update, setUpdate] = useState(false);
  const res_id = useSelector((state) => state?.res_id);
  const [info, setInfo] = useState({});
  // const [detail, setDetail] = useState(false);
  const { data: products = [], isLoading } = useFetchDataQuery({
    url: `get/foods/${res_id}`,
    tags: ["s-products", "product"],
  });
  const { data: categorys = [] } = useFetchDataQuery({
    url: `get/${res_id}/categories`,
    tags: ["category"],
  });
  const [delData] = useDelDataMutation();
  const [patchData] = usePatchDataMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  React.useEffect(() => {
    dispatch(acNavStatus([100]));
  }, [dispatch]);

  const category = (search && decodeURIComponent(search.split("=")[1])) || "";

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleUpdate = async (product) => {
    const { data } = await patchData({
      url: `update/foods/${product.id}`,
      data: product,
      tags: ["s-products"],
    });
    if (data) {
      es("Mahsulot malumotlari muvoffaqiyatli o'zgartirildi!", {
        variant: "success",
      });
      setInfo({});
      setUpdate(false);
    }
  };

  const handleDelete = async (id) => {
    const { data } = await delData({
      url: `delete/food/${id}`,
      tags: ["s-products"],
    });
    if (data) {
      const msg = "Mahsulotni O'zgartirishda qandaydir xatolik yuz berdi";
      es(msg, { variant: "error" });
    }
  };

  const updateImg = async (product) => {
    const { data } = await patchData({
      url: `update/productImg/${product.id}`,
      data: {
        img: product?.image,
        deleteImg: product.deleteImg,
      },
      tags: ["s-products"],
    });
    if (data) {
      const msg = "Mahsulot rasmi muvoffaqiyatli o'zgartirildi!";
      es(msg, { variant: "success" });
    }
  };

  const filteredProducts = products?.data?.filter((product) => {
    const categoryMatches =
      category === "" ||
      product?.category?.toLowerCase().includes(category.toLowerCase());
    const nameMatches = product?.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    return categoryMatches && nameMatches;
  });

  const handleInfoChange = (key, value) => {
    setInfo((prevInfo) => ({ ...prevInfo, [key]: value }));
  };

  return (
    <div className="product_list">
      <div className="search_container">
        <p>Barcha mahsulotlar ro'yxati</p>
        <form className="search_box">
          <button type="button">
            <GoSearch />
          </button>
          <input
            type="search"
            name="foundname"
            placeholder="Qidirish ? "
            value={searchTerm}
            onChange={handleSearch}
          />
        </form>
      </div>
      <div className="search_src">
        <Link to={pathname}>All</Link>
        {categorys?.data?.map((category) => (
          <Link
            to={`?q/gr=${encodeURIComponent(category?.name)}`}
            key={category?.id}>
            {category?.name}
          </Link>
        ))}
      </div>

      <div className="all_products">
        {isLoading ? (
          <span className="loader_box relative">
            <LoadingBtn />
          </span>
        ) : (
          filteredProducts?.map((product) => {
            const st = parseInt(product?.stop_list);
            return (
              <div className="item" key={product.id}>
                <label
                  className="img_box"
                  aria-label="the input is update product image">
                  <span className="upload_img">
                    Mahsulot rasmini o'zgartirish
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => updateImg(product, e.target.files[0])}
                  />
                  <ImgService src={product?.img} fallbackSrc alt="images" />
                </label>
                <div className="_item_info-box">
                  {update === product?.id ? (
                    <>
                      <input
                        type="text"
                        defaultValue={product.name}
                        style={{ textTransform: "capitalize" }}
                        autoFocus
                        onChange={(e) =>
                          handleInfoChange("name", e.target.value)
                        }
                        autoComplete="off"
                      />
                      <input
                        type="text"
                        defaultValue={product.description}
                        onChange={(e) =>
                          handleInfoChange("description", e.target.value)
                        }
                        autoComplete="off"
                      />
                    </>
                  ) : (
                    <>
                      <p className="name">{product.name}</p>
                      <p>{product.description}</p>
                    </>
                  )}
                  <NumericFormat
                    displayType={update === product?.id ? "input" : "text"}
                    defaultValue={product.price}
                    thousandSeparator=" "
                    suffix=" so'm"
                    onChange={(e) =>
                      handleInfoChange(
                        "price",
                        e.target.value.split(" ").join("")
                      )
                    }
                  />
                </div>
                <NumericFormat
                  className={
                    update === product?.id
                      ? ""
                      : st > 999
                      ? "_count active"
                      : "_count"
                  }
                  displayType={update === product?.id ? "input" : "text"}
                  style={{
                    background:
                      st <= 15 && st >= 10
                        ? "#f07167"
                        : st < 10
                        ? "#ef233c"
                        : "",
                  }}
                  defaultValue={st > 999 ? "" : st}
                  onChange={(e) =>
                    handleInfoChange("stop_list", e.target.value)
                  }
                />
                <div className="_item_action-box">
                  <div className="status">
                    <span
                      style={
                        product.status === 1
                          ? { background: "#33ff09" }
                          : { color: "#aaaa" }
                      }
                      onClick={() =>
                        handleUpdate({ id: product.id, status: 1 })
                      }
                      aria-label="change to active this product for sell">
                      active
                    </span>
                    <span
                      style={
                        product.status === 0
                          ? { background: "#d82" }
                          : { color: "#aaaa" }
                      }
                      onClick={() =>
                        handleUpdate({ id: product.id, status: 0 })
                      }
                      aria-label="change to  passive this product for sell">
                      passive
                    </span>
                  </div>
                  <NumericFormat
                    className={update === product?.id ? "" : "_count"}
                    displayType={update === product?.id ? "input" : "text"}
                    style={{
                      background:
                        st <= 15 && st >= 10
                          ? "#f07167"
                          : st < 10
                          ? "#ef233c"
                          : "",
                    }}
                    defaultValue={st > 999 ? 1 : st}
                    suffix={st >= 999 ? "∞" : ""}
                    onChange={(e) =>
                      handleInfoChange("stop_list", e.target.value)
                    }
                  />
                  <div className="update_btn">
                    {update === product?.id ? (
                      <>
                        <span
                          onClick={() =>
                            handleUpdate({ ...info, id: product.id })
                          }
                          aria-label="to confirm chnages">
                          <FaCheck />
                        </span>{" "}
                        <span
                          onClick={() => setUpdate(false)}
                          aria-label="to cancel  thi s changes">
                          <ImCancelCircle />
                        </span>
                      </>
                    ) : (
                      <span
                        onClick={() => setUpdate(product.id)}
                        aria-label="to click edit this product info">
                        <FaPen />
                      </span>
                    )}
                  </div>

                  <button
                    style={{ fontSize: "var(--fs4)", color: "#d82a0c" }}
                    onClick={() => handleDelete(product.id)}
                    aria-label="the button for delete this product">
                    <AiFillDelete />
                  </button>

                  <button
                    style={{ fontSize: "var(--fs4)", color: "#219ebc" }}
                    onClick={() => navigate(`/more/info/${product.id}`)}
                    aria-label="the button is for get more info about this product">
                    <TbInfoSquareRounded />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
