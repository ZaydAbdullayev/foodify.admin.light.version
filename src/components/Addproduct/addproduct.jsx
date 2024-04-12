import React, { useState, memo } from "react";
import "./addproduct.css";
import { IoIosRestaurant } from "react-icons/io";
import { enqueueSnackbar as es } from "notistack";
import { ClearForm } from "../../service/form.service";
import { ApiService } from "../../service/api.service";
import { useNavigate } from "react-router-dom";
import { LoadingBtn } from "../loading/loading";
import { acGetUrl } from "../../redux/u-modal";
import { useDispatch, useSelector } from "react-redux";
import { useFetchDataQuery } from "../../service/fetch.service";
import { useParams } from "react-router-dom";

export const Addproduct = memo(() => {
  const [files, setFiles] = useState([]);
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const image = useSelector((state) => state.image);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    ApiService.fetching("get/imgUrl", { img: img })
      .then((res) => {
        const image = res?.data?.data;
        dispatch(acGetUrl({ st: false, img: image }));
        es("Rasm muaffaqiyatli qo'shildi", { variant: "success" });
        ClearForm(".add_product");
        setFiles([]);
        setImg(null);
      })
      .catch((err) => {
        es("Qo'shishda xatolik yuz berdi", { variant: "error" });
      })
      .finally(() => setLoading(false));
  };

  const takeImg = (e) => {
    const file = e.target.files[0];
    setImg(file);
    const img = URL.createObjectURL(file);
    setFiles([img]);
  };

  return (
    <div className={image.st ? "product_box open" : "product_box"}>
      {image?.type === "view" ? (
        <img src={image?.img} alt="product's images" />
      ) : (
        <form className="add_product" onSubmit={handleSubmit}>
          <label
            style={files.length ? { border: "none" } : {}}
            className="product_img"
            htmlFor="image"
          >
            {files.length ? "" : <IoIosRestaurant />}
            <input
              type="file"
              name="img"
              accept="image/*"
              required
              onChange={takeImg}
              id="image"
            />
            {files.length > 0 && (
              <img src={files[0]} alt="Selected" className="selected_image" />
            )}
          </label>
          <button
            type="button"
            className="product_box_btn"
            onClick={() => dispatch(acGetUrl({ st: false, img: "" }))}
            aria-label="get out from add picture page"
          >
            Chiqish
          </button>
          <button className="product_box_btn relative">
            {loading ? <LoadingBtn /> : "Tasdiqlash"}
          </button>
        </form>
      )}
    </div>
  );
});

export const ShowProduct = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useFetchDataQuery({
    url: `get/oneFood/${id}`,
    tags: ["product"],
  });
  const ingredientData = JSON?.parse(data?.data?.ingredients);
  return (
    <div className="product_box open p_info">
      <div className="product_item">
        <h3>{data?.data?.name}</h3>
        <span>Product description</span>
        <div>
          Narxi: <i></i>
          <span>
            {data?.data?.price.replace(/\d(?=(\d{3})+$)/g, "$& ")} so'm
          </span>
        </div>
        <div>
          Tan Narxi: <i></i>
          <span>
            {data?.data?.prime_cost.replace(/\d(?=(\d{3})+$)/g, "$& ")} so'm
          </span>
        </div>
        <div>
          Foyda: <i></i>
          <span>
            {data?.data?.profit.replace(/\d(?=(\d{3})+$)/g, "$& ")} so'm
          </span>
        </div>
        <div>
          Kategoriyasi: <i></i> <span>{data?.data?.category}</span>
        </div>
        <div>
          Ombor: <i></i> <span>{data?.data?.storage}</span>
        </div>
        <div>
          Ingredientlari:{" "}
          <ol>
            {ingredientData?.map((item) => {
              return (
                <li key={item?.id}>
                  {item?.name} - {item?.amount} <span>{item?.unit}</span>
                  {item?.price} so'm
                </li>
              );
            })}
          </ol>
        </div>
        <button
          className="product_box_btn"
          onClick={() => navigate("/managment")}
          aria-label="backword all products page"
        >
          Orqaga qaytish
        </button>
      </div>
      <i onClick={() => navigate("/managment")} aria-label="close modal"></i>
    </div>
  );
});
