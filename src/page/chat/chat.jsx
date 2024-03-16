import React from "react";
import "./chat.css";

export const Chat = () => {
  function generate_l_g(numColors) {
    const colors = Array.from(
      { length: numColors },
      () => "#" + Math.floor(Math.random() * 16777215).toString(16)
    );
    const gradient = `linear-gradient(to right, ${colors.join(", ")})`;
    return gradient;
  }
  return (
    <div className="chat-container">
      <div className="chat-accounts">
        <h1>Chat</h1>
        <label
          className="chat-search"
          aria-label="to filter the data according by name">
          <input type="search" placeholder="Search" />
        </label>

        <div className="chat-user-list">
          <div className="_user-item">
            <div className="user-img" style={{ background: generate_l_g(243) }}>
              <img
                src="https://via.placeholder.com/30"
                alt="user"
                aria-label="user's image"
              />
            </div>
            <div className="user-info">
              <h3>John Doe</h3>
              <p>Hi</p>
            </div>
          </div>
          <div className="_user-item">
            <div className="user-img" style={{ background: generate_l_g(103) }}>
              <span>JD</span>
            </div>
            <div className="user-info">
              <h3>John Doe</h3>
              <p>Hi</p>
            </div>
          </div>
        </div>
      </div>
      <div className="chat-content">
        <div className="chat-body"></div>
        <form className="chat-footer">
          <input type="text" placeholder="Type a message" />
          <button>Send</button>
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
    chat_id: 1,
    last_messages: {
      id: 1,
      user_id: 100,
      message: "Hello",
      date: "2021-06-01",
      time: "12:00",
    },
  },
  {
    id: 101,
    firstname: "Jane",
    lastname: "Doe",
    chat_id: 1,
    last_messages: {
      id: 2,
      user_id: 101,
      message: "Hi",
      date: "2021-06-01",
      time: "12:01",
    },
  },
  {
    id: 102,
    firstname: "John",
    lastname: "Smith",
    chat_id: 2,
    last_messages: {
      id: 3,
      user_id: 102,
      message: "Hello",
      date: "2021-06-01",
      time: "12:00",
    },
  },
  {
    id: 103,
    firstname: "Jane",
    lastname: "Smith",
    chat_id: 2,
    last_messages: {
      id: 4,
      user_id: 103,
      message: "Hi",
      date: "2021-06-01",
      time: "12:01",
    },
  },
  {
    id: 104,
    firstname: "John",
    lastname: "Johnson",
    chat_id: 3,
    last_messages: {
      id: 5,
      user_id: 104,
      message: "Hello",
      date: "2021-06-01",
      time: "12:00",
    },
  },
  {
    id: 105,
    firstname: "Jane",
    lastname: "Johnson",
    chat_id: 3,
    last_messages: {
      id: 6,
      user_id: 105,
      message: "Hi",
      date: "2021-06-01",
      time: "12:01",
    },
  },
  {
    id: 106,
    firstname: "John",
    lastname: "Brown",
    chat_id: 4,
    last_messages: {
      id: 7,
      user_id: 106,
      message: "Hello",
      date: "2021-06-01",
      time: "12:00",
    },
  },
  {
    id: 107,
    firstname: "Jane",
    lastname: "Brown",
    chat_id: 4,
    last_messages: {
      id: 8,
      user_id: 107,
      message: "Hi",
      date: "2021-06-01",
      time: "12:01",
    },
  },
  {
    id: 108,
    firstname: "John",
    lastname: "Williams",
    chat_id: 5,
    last_messages: {
      id: 9,
      user_id: 108,
      message: "Hello",
      date: "2021-06-01",
      time: "12:00",
    },
  },
];
