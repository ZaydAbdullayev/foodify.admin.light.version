import React from "react";
import { Howl } from "howler";
import "./touch.css";

import audio from "../../assets/images/nothification.mp3";

const SoundButton = () => {
  const sound = new Howl({
    src: [audio],
    html5: true,
  });

  const oynatSes = () => {
    sound.play();
  };

  setTimeout(() => {
    sound.play();
  }, 2000);

  return (
    <div>
      <button onClick={oynatSes}>Ses Çal</button>
    </div>
  );
};

export default SoundButton;
