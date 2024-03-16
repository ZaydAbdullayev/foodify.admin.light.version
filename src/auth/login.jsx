import React, { useState, useEffect, useRef } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { ClearForm } from "../service/form.service";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { acPermission } from "../redux/permission";
import { useDispatch } from "react-redux";
import { usePostDataMutation } from "../service/fetch.service";

export const Login = () => {
  const navigate = useNavigate();
  const [err, setErr] = useState(false);
  const [check, setCheck] = useState("");
  const [postData] = usePostDataMutation();
  const [show, setShow] = useState(true);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const loginData = Object.fromEntries(formData.entries());
    loginData.username = loginData?.username?.split(" ").join("_");

    if (loginData.role === "worker") {
      handleWorkerLogin(loginData);
    } else {
      handleUserLogin(loginData);
    }
  };

  const handleWorkerLogin = async (loginData) => {
    const { error, data } = await postData({
      url: "/login/worker",
      data: loginData,
      tags: [""],
    });
    if (error) {
      handleLoginError();
      return;
    }
    const role = data?.innerData?.user?.user?.role;
    localStorage.setItem("user", JSON.stringify(data.innerData.user));
    localStorage.setItem("department", JSON.stringify(role));
    localStorage.setItem("check", JSON.stringify(true));
    navigate("/check");
    window.location.reload();
    setErr(false);
  };

  const handleUserLogin = async (loginData) => {
    const { data, error } = await postData({
      url: "/login/admin",
      data: loginData,
      tags: [""],
    });
    if (error) {
      handleLoginError();
      return;
    }

    localStorage.setItem("user", JSON.stringify(data.innerData.user));
    if (loginData.role !== "owner") {
      localStorage.setItem("department", JSON.stringify("owner"));
      dispatch(acPermission("owner"));
    }
    if (data?.innerData?.user?.user?.workers) {
      localStorage.setItem("permission", JSON.stringify(true));
    }
    navigate("/");
    window.location.reload();
    setErr(false);
  };

  const handleLoginError = () => {
    setErr(true);
    ClearForm("#form");
  };

  const handleShow = () => {
    setShow(!show);
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit} id="form">
        <h1>Hisobga kirish</h1>
        <input
          type="text"
          name="username"
          placeholder="Ism kiritng"
          required
          autoComplete="off"
          autoCapitalize="off"
          className="input"
          style={err ? { border: "1px solid tomato", padding: "4.5% 3%" } : {}}
          onChange={(e) => setCheck(e.target.value)}
        />
        <label>
          <input
            type={show ? "password" : "text"}
            name="password"
            placeholder="Parol kiriting"
            required
            autoComplete="off"
            className="input"
            style={err ? { border: "1px solid tomato" } : {}}
          />
          <span
            onClick={handleShow}
            style={show ? {} : { color: "orange" }}
            aria-label="parolni ko'rish"
          >
            {show ? <BsEyeSlash /> : <BsEye />}
          </span>
          <p style={err ? { display: "flex" } : {}} className="failed">
            Foydalanuvchi yoki parol xaroligi...!
          </p>
        </label>
        {check === "foodifyzaydatomic" ? (
          <div className="role">
            <input type="hidden" name="role" value="owner" />
            <p>Site creator</p>
          </div>
        ) : (
          <div className="role">
            <p style={err ? { color: "tomato" } : {}}>Boshqaruvchi:</p>
            <label>
              <input type="radio" name="role" value="worker" required />
              <p>Ishchi</p>
            </label>
            <label>
              <input type="radio" name="role" value="restaurant" required />
              <p>Owner</p>
            </label>
          </div>
        )}
        <button className="log_btn" type="submit">
          Log In
        </button>
      </form>
    </div>
  );
};

export const CheackDepartment = () => {
  const [pass, setPass] = useState("");
  const [err, setErr] = useState(false);
  const [postData] = usePostDataMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const inputElement = useRef(null); // useRef ile inputElement'i başlatın

  const loginD = async () => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    try {
      const { data, error } = await postData({
        url: `/check/worker/${user?.user?.id}/${pass}`,
        tags: [""],
      });
      if (error) {
        setErr(true);
        setPass("");
        return;
      }
      const dep = data?.innerData?.user?.user?.department;
      const mergedUser = {
        ...user,
        user: { ...user?.user, ...data?.innerData?.user?.user },
      };
      dispatch(acPermission(dep));
      localStorage.setItem("user", JSON.stringify(mergedUser));
      localStorage.setItem("department", JSON.stringify(dep));
      navigate("/");
    } catch (error) {
      setErr(true);
      setPass("");
    }
  };

  useEffect(() => {
    if (inputElement.current) {
      // null kontrolü ekleyin
      inputElement.current.focus();
    }
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key;
      if (/^\d$/.test(key)) {
        setPass(`${pass}${key}`);
      } else if (key === "Backspace" && pass.length > 0) {
        setPass(pass.slice(0, -1));
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [pass]);

  const removeLastDigit = () => {
    if (pass.length > 0) {
      setPass(pass.slice(0, -1));
    }
  };

  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

  return (
    <div className="login">
      <label className="cheack_d">
        <p>Bo'limingiz parolini kiriting</p>
        <label>
          <input
            type="text"
            style={
              pass.length <= 6 && !err
                ? {}
                : { border: "1px solid tomato", color: "tomato" }
            }
            ref={inputElement}
            value={pass}
          />
          {digits.map((digit) => (
            <button
              key={digit}
              onClick={() => setPass(`${pass}${digit}`)}
              aria-label="son yozish"
            >
              {digit}
            </button>
          ))}
          <button onClick={() => setPass("")} aria-label="delete all number">
            AC
          </button>
          <button onClick={removeLastDigit} aria-label="delete last number">
            ⨉
          </button>
        </label>
        <button onClick={loginD} aria-label="log in (hisobga kirish)">
          Kirish
        </button>
      </label>
    </div>
  );
};
