import { Slider, TextField } from "@mui/material";
import { withStyles } from "@mui/styles";
import React, { useState, useEffect, useRef } from "react";
import { WORDS } from "../config/WORDS";
import "./Home.css";
export default function Home() {
  const [text, setText] = useState([""]);
  const [value, setValue] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [letterIndex, setLetterIndex] = useState(0);
  const [typedLog, setTypedLog] = useState([]);
  const [timer, setTimer] = useState(0);
  const [finished, setFinished] = useState(false);
  const [settings, setSettings] = useState(false);
  const [opacity, setOpacity] = useState(60);
  const [wordNum, setWordNum] = useState(60);
  const [wpm, setWpm] = useState();
  let mopacity = opacity;
  let mwordNum = wordNum;
  const inputRef = useRef();
  const handleKeyPress = (e) => {
    switch (e.key) {
      case "Backspace":
        goBack();
        break;
      case "Tab":
        restart();
        break;
      case "Escape":
        restart();
        setOpacity(mopacity);
        setWordNum(mwordNum);
        setSettings((p) => !p);
        break;
      default:
        break;
    }
  };
  const [timerInteraval, setTimerInteraval] = useState();
  const restart = () => {
    clearInterval(timerInteraval);
    setTimerInteraval();
    const mWords = WORDS.split(" ")
      .sort(() => Math.random() - 0.5)
      .splice(0, wordNum);
    setText(mWords);
    setTypedLog(mWords.map((e, i) => e.split("").map(() => 0)));
    setValue("");
    setWordIndex(0);
    setLetterIndex(0);
    setTimer(0);
    setFinished(false);
    setWpm();
  };
  const goBack = () => {
    if (letterIndex === 0 && wordIndex === 0) return;
    if (letterIndex > 0) {
      setLetterIndex(letterIndex - 1);
    } else {
      setWordIndex(wordIndex - 1);
      setLetterIndex(typedLog[wordIndex - 1].filter((v) => v !== 0).length);
    }
    if (typedLog[wordIndex][letterIndex - 1] === 3) {
      setText((e) => [
        ...e.filter((v, i) => i < wordIndex),
        e[wordIndex].slice(0, letterIndex - 1),
        ...e.filter((v, i) => i > wordIndex),
      ]);
      setTypedLog((e) => [
        ...e.filter((v, i) => i < wordIndex),
        [
          ...e
            .filter((v, i) => i === wordIndex)[0]
            .filter((v, i) => i < letterIndex - 1),
          ...e
            .filter((v, i) => i === wordIndex)[0]
            .filter((v, i) => i > letterIndex - 1),
        ],
        ...e.filter((v, i) => i > wordIndex),
      ]);
    } else
      setTypedLog((e) => [
        ...e.filter((v, i) => i < wordIndex),
        [
          ...e
            .filter((v, i) => i === wordIndex)[0]
            .filter((v, i) => i < letterIndex - 1),
          0,
          ...e
            .filter((v, i) => i === wordIndex)[0]
            .filter((v, i) => i > letterIndex - 1),
        ],
        ...e.filter((v, i) => i > wordIndex),
      ]);
  };
  const finish = (correct) => {
    const mtypeLog = correct
      ? [
          ...typedLog.filter((v, i) => i < typedLog.length - 1),
          [
            ...typedLog[typedLog.length - 1].filter(
              (v, i) => i < typedLog[typedLog.length - 1].length - 1
            ),
            1,
          ],
        ]
      : typedLog;

    const correctWords = mtypeLog.filter(
      (word, i) =>
        word.filter((letter) => letter === 1).length === text[i].length
    );
    setWpm(Math.round((correctWords.length / timer) * 6000) / 100);
    setFinished(true);
  };
  const onType = (e) => {
    const typed = e.target.value;
    setValue("");

    let correct = false;
    if (typed === " ") {
      if (letterIndex !== 0) {
        setWordIndex((e) => e + 1);
        setLetterIndex(0);
      }
    } else {
      if (wordIndex === 0 && letterIndex === 0) {
        setTimerInteraval(
          setInterval(() => {
            setTimer((e) => e + 1);
          }, 1000)
        );
      }
      setLetterIndex((e) => e + 1);
      if (typed === text[wordIndex].split("")[letterIndex]) {
        setTypedLog((e) => [
          ...e.filter((v, i) => i < wordIndex),
          [
            ...e
              .filter((v, i) => i === wordIndex)[0]
              .filter((v, i) => i < letterIndex),
            1,
            ...e
              .filter((v, i) => i === wordIndex)[0]
              .filter((v, i) => i > letterIndex),
          ],
          ...e.filter((v, i) => i > wordIndex),
        ]);
        correct = true;
      } else {
        if (letterIndex > text[wordIndex].length - 1) {
          setText((e) => [
            ...e.filter((v, i) => i < wordIndex),
            e[wordIndex] + typed,
            ...e.filter((v, i) => i > wordIndex),
          ]);
          setTypedLog((e) => [
            ...e.filter((v, i) => i < wordIndex),
            [
              ...e
                .filter((v, i) => i === wordIndex)[0]
                .filter((v, i) => i < letterIndex),
              3,
              ...e
                .filter((v, i) => i === wordIndex)[0]
                .filter((v, i) => i > letterIndex),
            ],
            ...e.filter((v, i) => i > wordIndex),
          ]);
        } else
          setTypedLog((e) => [
            ...e.filter((v, i) => i < wordIndex),
            [
              ...e
                .filter((v, i) => i === wordIndex)[0]
                .filter((v, i) => i < letterIndex),
              2,
              ...e
                .filter((v, i) => i === wordIndex)[0]
                .filter((v, i) => i > letterIndex),
            ],
            ...e.filter((v, i) => i > wordIndex),
          ]);
      }
    }
    if (
      wordIndex === text.length - 1 &&
      (letterIndex === text[wordIndex].length - 1 || typed === " ")
    ) {
      console.log(
        "typed: ",
        typed,
        "wordIndex: ",
        wordIndex,
        "letterIndex: ",
        letterIndex
      );
      finish(correct);
      return;
    }
  };
  useEffect(() => {
    const mWords = WORDS.split(" ")
      .sort(() => Math.random() - 0.5)
      .splice(0, wordNum);
    setText(mWords);
    setTypedLog(mWords.map((e, i) => e.split("").map(() => 0)));
    inputRef.current?.focus();
  }, [wordNum]);

  const changeOpacity = (v) => {
    mopacity = v;
    document.body.style.backgroundColor = `rgba(36, 36, 36, ${v / 100})`;
  };
  const changeWordNum = (v) => {
    mwordNum = v;
  };
  const CustomSlider = withStyles({
    track: {
      color: "gray",
    },
    thumb: {
      color: "gray",
    },
  })(Slider);
  if (!settings) inputRef.current?.focus();
  return (
    <div className="Home" onKeyDown={handleKeyPress}>
      <input
        type="text"
        className="text-input"
        value={value}
        onChange={onType}
        ref={inputRef}
      />
      {settings ? (
        <div className="settings">
          <div className="settings-item">
            <span className="settings-text">opacity</span>
            <CustomSlider
              defaultValue={opacity}
              valueLabelDisplay="auto"
              onChange={(e) => changeOpacity(e.target.value)}
            />
          </div>
          <div className="settings-item">
            <span className="settings-text">words</span>
            <CustomSlider
              defaultValue={wordNum}
              max={200}
              step={5}
              valueLabelDisplay="auto"
              onChange={(e) => changeWordNum(e.target.value)}
            />
          </div>
        </div>
      ) : finished ? (
        <>
          <span className="timer">{wpm} WPM</span>
          <span>press TAB to restart</span>
          <span>press Esc to change the settings</span>
        </>
      ) : (
        <>
          <span className="timer">{timer}</span>
          <div
            className="word-container"
            onClick={() => inputRef.current?.focus()}
          >
            {text.map((word, wordI) => (
              <>
                <span
                  className={
                    "word" +
                    (wordI === wordIndex ? " word-active" : "") +
                    (wordI < wordIndex &&
                    typedLog[wordI]?.filter((v) => v === 1).length !==
                      word.length
                      ? " word-wrong"
                      : "")
                  }
                  key={wordI + "w"}
                >
                  {word.split("").map((letter, letterI) => (
                    <span
                      className={
                        "letter" +
                        (letterI === letterIndex && wordI === wordIndex
                          ? " letter-active"
                          : typedLog[wordI][letterI] === 1
                          ? " letter-correct"
                          : typedLog[wordI][letterI] === 2
                          ? " letter-incorrect"
                          : typedLog[wordI][letterI] === 3
                          ? " letter-extra"
                          : "")
                      }
                      key={letterI + "l"}
                    >
                      {letter}
                    </span>
                  ))}
                </span>
                <span
                  key={wordI + "s"}
                  className={
                    "letter" +
                    (letterIndex >= word.length && wordI === wordIndex
                      ? " letter-active "
                      : "") +
                    " letter-space"
                  }
                >
                  {" "}
                </span>
              </>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
