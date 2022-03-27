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
  const [wpm, setWpm] = useState();
  const [accuracy, setAccuracy] = useState();
  const inputRef = useRef();
  const handleKeyPress = (e) => {
    switch (e.key) {
      case "Backspace":
        goBack();
        break;
      case "Tab":
        restart();
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
      .splice(0, 60);
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
    if (typedLog[wordIndex][letterIndex - 1] === 3)
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
          .filter((v, i) => i < letterIndex),
        0,
        ...e
          .filter((v, i) => i === wordIndex)[0]
          .filter((v, i) => i > letterIndex),
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
      (word) => word.filter((letter) => letter === 1).length === word.length
    );
    const letters = mtypeLog.reduce((acc, word) => [...acc, ...word]);
    const correctLetters = letters.filter((letter) => letter === 1);
    setAccuracy(
      Math.round((correctLetters.length / letters.length) * 10000) / 100
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
      .splice(0, 60);
    setText(mWords);
    setTypedLog(mWords.map((e, i) => e.split("").map(() => 0)));
    inputRef.current?.focus();
  }, []);
  return (
    <div className="Home">
      <input
        type="text"
        className="text-input"
        value={value}
        onChange={onType}
        ref={inputRef}
        onKeyDown={handleKeyPress}
      />
      {finished ? (
        <>
          <span className="timer">{wpm} WPM</span>
          <span className="timer">{accuracy} Acc</span>
          <span>press TAB to restart</span>
        </>
      ) : (
        <>
          <span className="timer">{timer}</span>
          <div className="word-container">
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
