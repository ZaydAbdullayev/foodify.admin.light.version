import React, { useState } from "react";
import "./chat.css";
import socket from "../../socket.config";
import {
  useFetchDataQuery,
  usePostDataMutation,
} from ".././../service/fetch.service";

import { ImUserPlus } from "react-icons/im";
import { FaArrowUp } from "react-icons/fa6";
import { IoCheckmarkDoneOutline, IoCheckmark } from "react-icons/io5";
import { IoMdArrowBack } from "react-icons/io";

// message tick border radius
export const Chat = () => {
  const user = JSON.parse(localStorage.getItem("user"))?.user || {};
  const [activeChat, setActiveChat] = useState(null);
  const [activeAcc, setActiveAcc] = useState(null);
  const [addNewChat, setAddNewChat] = useState(false);
  const [workers, setWorkers] = useState([]);
  const [postData] = usePostDataMutation();
  const { data: usersD } = useFetchDataQuery({
    url: `get/chats/${user?.id}`,
    tags: ["chat"],
  });

  console.log(usersD);

  socket.on("/get/newChat", (data) => {
    console.log(data);
  });

  const getChat = (user) => {
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

    if (addNewChat) {
      const data = {};
      const res = await postData({
        url: `get/workersList/${user?.id}/${user?.id}`,
        data,
        tags: [""],
      });
      console.log(res);
    }
  };
  return (
    <div className="df aic chat-container">
      <div className="df flc aic chat-accounts">
        <h1 className="df aic _accounts-header">
          {addNewChat ? <small>Habar yuborish</small> : <span>Chat</span>}
          <small style={{ cursor: "pointer" }} onClick={() => addChat()}>
            {addNewChat ? <IoMdArrowBack /> : <ImUserPlus />}
          </small>
        </h1>
        <label
          className="df aic chat-search"
          aria-label="to filter the data according by name">
          <input type="search" placeholder="Search" />
        </label>

        <div className="df flc chat-user-list">
          {users?.map((user) => {
            return (
              <div
                className={`df aic _user-item 
                ${activeAcc?.id === user?.id ? "active" : ""}
                `}
                key={user?.id}
                onClick={() => getChat(user)}>
                <div
                  className="df aic jcc user-img"
                  style={{ background: generate_l_g() || "#222" }}>
                  {user?.img ? (
                    <img
                      src="https://via.placeholder.com/40"
                      alt="user"
                      aria-label="user's image"
                    />
                  ) : (
                    user?.firstname?.charAt(0) + user?.lastname?.charAt(0)
                  )}
                </div>
                <div className="df flc user-info">
                  <p>
                    {user?.firstname} {user?.lastname}
                  </p>
                  {!addNewChat && (
                    <small>{user?.last_messages?.[0]?.text || ""}</small>
                  )}
                  {!user?.read_status && !addNewChat ? (
                    <span className="df aic jcc badge">
                      {user?.last_messages?.length + 1}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="df flc chat-content">
        <div className="df flc chat-body">
          <p className="df aic jcc chat-body-header">
            <span>{activeAcc?.firstname || "Chat tanlang"}</span>
          </p>
          {activeChat?.messages?.length ? (
            activeChat?.messages?.map((message) => {
              return (
                <div
                  className={`df aic ${
                    message?.user_id === 200 ? "chat-right" : "chat-left"
                  }`}
                  key={message?.id}>
                  <div className="df chat-message">
                    <p>{message?.text}</p>
                    <sup>
                      <small className="df aic">
                        {message?.time}{" "}
                        {message?.user_id === 200 ? <IoCheckmark /> : ""}
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
            activeAcc?.firstname ? "" : "hide"
          }`}>
          <input type="text" placeholder="Habar yozish" />
          <button>
            <FaArrowUp />
          </button>
        </form>
      </div>
    </div>
  );
};

const users = [
  {
    id: 100,
    firstname: "John",
    lastname: "Doe",
    user1: 100,
    user2: 200,
    chat_id: 1,
    read_status: false,
    last_messages: [
      {
        id: 1,
        user_id: 100,
        text: "Hello",
        date: "2021-06-01",
        time: "12:00",
      },
    ],
  },
  {
    id: 101,
    firstname: "Jane",
    lastname: "Doe",
    user1: 101,
    user2: 200,
    chat_id: 2,
    read_status: true,
    last_messages: [
      {
        id: 2,
        user_id: 101,
        text: "Hi",
        date: "2021-06-01",
        time: "12:01",
      },
    ],
  },
  {
    id: 102,
    firstname: "John",
    lastname: "Smith",
    user1: 102,
    user2: 200,
    chat_id: 3,
    read_status: true,
    last_messages: [
      {
        id: 3,
        user_id: 102,
        text: "Hello",
        date: "2021-06-01",
        time: "12:00",
      },
    ],
  },
  {
    id: 103,
    firstname: "Jane",
    lastname: "Smith",
    user1: 103,
    user2: 200,
    chat_id: 4,
    read_status: false,
    last_messages: [
      {
        id: 4,
        user_id: 103,
        text: "Hi",
        date: "2021-06-01",
        time: "12:01",
      },
    ],
  },
  {
    id: 104,
    firstname: "John",
    lastname: "Johnson",
    user1: 104,
    user2: 200,
    chat_id: 5,
    read_status: false,
    last_messages: [
      {
        id: 5,
        user_id: 104,
        text: "Hello",
        date: "2021-06-01",
        time: "12:00",
      },
    ],
  },
  {
    id: 105,
    firstname: "Jane",
    lastname: "Johnson",
    user1: 105,
    user2: 200,
    chat_id: 6,
    read_status: true,
    last_messages: [
      {
        id: 6,
        user_id: 105,
        text: "Hi",
        date: "2021-06-01",
        time: "12:01",
      },
    ],
  },
  {
    id: 106,
    firstname: "John",
    lastname: "Brown",
    user1: 106,
    user2: 200,
    chat_id: 7,
    read_status: true,
    last_messages: [
      {
        id: 7,
        user_id: 106,
        text: "Hello",
        date: "2021-06-01",
        time: "12:00",
      },
    ],
  },
  {
    id: 107,
    firstname: "Jane",
    lastname: "Brown",
    user1: 107,
    user2: 200,
    chat_id: 8,
    read_status: true,
    last_messages: [
      {
        id: 8,
        user_id: 107,
        text: "Hi",
        date: "2021-06-01",
        time: "12:01",
      },
    ],
  },
  {
    id: 108,
    firstname: "John",
    lastname: "Williams",
    user1: 108,
    user2: 200,
    chat_id: 9,
    read_status: true,
    last_messages: [
      {
        id: 9,
        user_id: 108,
        text: "Hello",
        date: "2021-06-01",
        time: "12:00",
      },
    ],
  },
];

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
