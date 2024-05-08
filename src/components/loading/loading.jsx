import React, { memo } from "react";
import "./loading.css";
import { BiLoader } from "react-icons/bi";

export const Loading = memo(() => {
  return <div className="loading"></div>;
});

export const LoadingBtn = ({ s = "" }) => {
  return (
    <div className={`loading_btn ${s}`}>
      <BiLoader />
    </div>
  );
};

// export const Router = () => {
//   const department = useSelector((state) => state.permission);
//   const nothificate = useSelector((state) => state.nothificate);
//   const location = useLocation();
//   const dispatch = useDispatch();
//   const sound = new Howl({
//     src: [audio],
//     html5: true,
//   });

//   useEffect(() => {
//     dispatch(acCloseUModal());
//   }, [dispatch, location]);

//   useEffect(() => {
//     if (window.innerWidth < 600) {
//       dispatch(acDeviceWidth(true));
//     } else {
//       dispatch(acDeviceWidth(false));
//     }
//   }, [dispatch]);

//   useEffect(() => {
//     const span = document.createElement("span");
//     span.classList.add("stm-animate");
//     document.body.appendChild(span);
//     const handleClick = (event) => {
//       const x = event.clientX;
//       const y = event.clientY;
//       span.style.top = `${y - 30}px`;
//       span.style.left = `${x - 30}px`;
//       span.style.zIndex = `999999999`;
//       span.classList.add("active");
//     };
//     document.addEventListener("click", handleClick);

//     return () => {
//       document.removeEventListener("click", handleClick);
//       span.removeEventListener("animationend", handleAnimationEnd);
//       document.body.removeChild(span);
//     };
//   }, []);

//   useEffect(() => {
//     const handleAnimationEnd = () => {
//       span.classList.remove("active");
//     };
//     span.addEventListener("animationend", handleAnimationEnd);

//     return () => {
//       span.removeEventListener("animationend", handleAnimationEnd);
//     };
//   }, [span]);

//   useEffect(() => {
//     if (nothificate) {
//       sound.play();
//       setTimeout(() => {
//         dispatch(acNothification(false));
//         sound.stop();
//       }, 1000);
//     }
//   }, [dispatch, nothificate, sound]);

//   // Rest of your component code...
// };
