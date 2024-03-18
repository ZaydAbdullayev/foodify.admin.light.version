import React, { useState, useEffect, Suspense, lazy } from "react";
import "./chat.css";
import socket from "../../socket.config";
import { useFetchDataQuery } from ".././../service/fetch.service";
import { usePostDataMutation } from ".././../service/fetch.service";
import { useLocation, useNavigate } from "react-router-dom";

import { ImUserPlus } from "react-icons/im";
import { FaArrowUp } from "react-icons/fa6";
import { IoCheckmarkDoneOutline, IoCheckmark } from "react-icons/io5";
import { IoMdArrowBack } from "react-icons/io";
import { LoadingBtn } from "../../components/loading/loading";

const ChatModal = lazy(() => import("./chat.modal"));
// message tick border radius
export const Chat = () => {
  const user = JSON.parse(localStorage.getItem("user"))?.user || {};
  const [activeChat, setActiveChat] = useState(null);
  const [activeAcc, setActiveAcc] = useState(null);
  const [addNewChat, setAddNewChat] = useState(false);
  const [workers, setWorkers] = useState([]);
  const path = useLocation().search;
  const navigate = useNavigate();
  const [postData] = usePostDataMutation();
  const { data: usersD, isLoading } = useFetchDataQuery({
    url: `get/chats/${user?.id}`,
    tags: ["chat"],
  });

  useEffect(() => {
    if (path === "?closeChat") {
      setActiveAcc(null);
      setActiveChat(null);
    }
  }, [path]);

  socket.on("/get/newChat", (data) => {
    console.log(data);
  });

  // when get chat add location's sercha user id
  const getChat = (user) => {
    navigate(`?chat=${user?.chat_id}`);
    setActiveAcc(user);
    const chat = chats?.find((chat) => chat?.chat_id === user?.chat_id) || null;
    setActiveChat(chat);
  };

  function generate_l_g() {
    let color = "#";
    for (let i = 0; i < 3; i++) {
      color += ("0" + Math.floor(Math.random() * 240).toString(16)).slice(-2);
    }
    return color;
  }

  const addChat = async () => {
    setAddNewChat(!addNewChat);
    setActiveAcc(null);
    setActiveChat(null);

    if (!addNewChat) {
      const data = {};
      const res = await postData({
        url: `get/workersList/${user?.id}/${user?.id}`,
        data,
        tags: [""],
      });
      setWorkers(res?.data?.data);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const formdata = new FormData(e.target);
    const value = Object.fromEntries(formdata.entries());
    const data = {
      user1: user?.worker_id || user?.id,
      user2: activeAcc?.id,
      last_messages: value?.text,
      user1_name: user?.worker_name || "Owner",
      user2_name: activeAcc?.[addNewChat ? "name" : "fullname"],
    };
    if (addNewChat) {
      socket.emit("/create/chat", data);
      e.target.reset();
      setAddNewChat(false);
    }
  };
  const usersData = addNewChat ? workers : usersD?.data;
  return (
    <>
      <div className="df aic chat-container">
        <div
          className={`df flc aic chat-accounts ${
            activeAcc?.firstname && "close"
          }`}>
          <h1 className="df aic _accounts-header">
            <span>Chat</span>
            <small style={{ cursor: "pointer" }} onClick={() => addChat()}>
              <ImUserPlus />
            </small>
          </h1>
          <label
            className="df aic chat-search"
            aria-label="to filter the data according by name">
            <input type="search" placeholder="Search" />
          </label>

          <div className="df flc chat-user-list">
            {isLoading ? (
              <span className="relative">
                <LoadingBtn />
              </span>
            ) : usersD?.data !== "there are no Chats" ? (
              usersD?.data?.map((user) => {
                return (
                  <div
                    className={`df aic _user-item 
                ${activeAcc?.id === user?.id ? "active" : ""}
                `}
                    key={user?.id}
                    onClick={() => getChat(user)}>
                    <div
                      className="df aic jcc user-img"
                      style={{ background: user?.bg || "#666" }}>
                      {user?.img ? (
                        <img
                          src="https://via.placeholder.com/40"
                          alt="user"
                          aria-label="user's image"
                        />
                      ) : (
                        user?.user2_name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="df flc user-info">
                      <p>{user?.user2_name}</p>
                      <small>{user?.last_messages?.[0]?.text || ""}</small>
                      {!user?.read_status ? (
                        <span className="df aic jcc badge">
                          {user?.last_messages?.length + 1}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <span className="empty-chat">Chatlaringiz yo'q</span>
            )}
          </div>
        </div>
        <div className="df flc chat-content">
          <div className="df flc chat-body">
            <p className="df aic jcc chat-body-header">
              <span>{activeAcc?.user2_name || "Chat tanlang"}</span>
            </p>
            {activeChat?.messages?.length ? (
              activeChat?.messages?.map((message) => {
                return (
                  <div
                    className={`df aic ${
                      message?.user_id === user?.id ? "chat-right" : "chat-left"
                    }`}
                    key={message?.id}>
                    <div className="df chat-message">
                      <p>{message?.text}</p>
                      <sup>
                        <small className="df aic">
                          {message?.time}{" "}
                          {message?.user_id === user?.id ? <IoCheckmark /> : ""}
                        </small>
                      </sup>
                    </div>
                  </div>
                );
              })
            ) : (
              <span className="empty-chat">Chat bo'sh</span>
            )}
          </div>
          <form
            className={`df aic chat-footer ${
              activeAcc?.user2_name ? "" : "hide"
            }`}
            onSubmit={(e) => sendMessage(e)}>
            <input type="text" name="text" placeholder="Habar yozing" />
            <button>
              <FaArrowUp />
            </button>
          </form>
        </div>
      </div>
      <Suspense>
        {addNewChat && (
          <ChatModal
            getChat={getChat}
            activeAcc={activeAcc}
            setAddNewChat={setAddNewChat}
          />
        )}
      </Suspense>
    </>
  );
};

const chats = [
  {
    chat_id: 1,
    messages: [
      {
        id: 1,
        user_id: 100,
        text: `Hello Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor et totam impedit quis reiciendis iusto nobis eveniet illo repellat dignissimos nam id, provident temporibus at doloribus. Quos qui nesciunt quasi a aliquam adipisci quam, ullam iste soluta ad. Reiciendis, iusto`,
        date: "2021-06-01",
        time: "12:00",
      },
      {
        id: 2,
        user_id: 200,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor et totam impedit quis reiciendis iusto nobis eveniet illo repellat dignissimos nam id, provident temporibus at doloribus. Quos qui nesciunt quasi a aliquam adipisci quam, ullam iste soluta ad. Reiciendis, iusto",
        date: "2021-06-01",
        time: "12:01",
      },
    ],
  },
  {
    chat_id: 2,
    messages: [],
  },
  {
    chat_id: 3,
    messages: [
      {
        id: 5,
        user_id: 104,
        text: "Hello",
        date: "2021-06-01",
        time: "12:00",
      },
      {
        id: 6,
        user_id: 200,
        text: "Hi",
        date: "2021-06-01",
        time: "12:01",
      },
    ],
  },
  {
    chat_id: 4,
    messages: [
      {
        id: 7,
        user_id: 106,
        text: "Hello",
        date: "2021-06-01",
        time: "12:00",
      },
      {
        id: 8,
        user_id: 200,
        text: "Hi",
        date: "2021-06-01",
        time: "12:01",
      },
    ],
  },
  {
    chat_id: 5,
    messages: [
      {
        id: 9,
        user_id: 108,
        text: "Hello",
        date: "2021-06-01",
        time: "12:00",
      },
      {
        id: 10,
        user_id: 200,
        text: "Hi",
        date: "2021-06-01",
        time: "12:01",
      },
    ],
  },
];
