import default_img from "../assets/images/default-food.jpg";
export const ImgService = ({
  src,
  fallbackSrc,
  fallbackSrcRes,
  alt,
  ...props
}) => {
  const handleError = (event) => {
    fallbackSrc && (event.target.src = default_img);
    fallbackSrcRes &&
      (event.target.src =
        "https://restaurantsnapshot.com/wp-content/uploads/2023/02/Best-New-Restaurants-1.jpg");
  };

  return <img src={src} onError={handleError} alt={alt} {...props} />;
};
