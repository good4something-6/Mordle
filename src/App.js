import { useEffect, useState } from "react";
import "./App.css";
import "./words.js";
import words from "./words.js";

//Assuming the contents of 'words' is all lower case

//Not in state yet - relying on page refresh to get a new game instead of a "new game" button
//const correctWord = words[Math.floor(Math.random() * words.length)];
const correctWord = words[Math.floor(Math.random() * 500)];
//const correctWord = "calks";
console.log(correctWord);

function App() {
  const [guessList, setGuessList] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  return (
    <div className="App">
      <header>
        <h1>Welcome to Mordle</h1>
        {/* <h2>{correctWord}</h2> */}
      </header>
      <main>
        <section>
          <GuessBox
            setGuessList={setGuessList}
            guessList={guessList}
            gameOver={gameOver}
            setGameOver={setGameOver}
          />
        </section>
        <section>
          <GuessList guessListArr={guessList} setGameOver={setGameOver} />
        </section>
      </main>
    </div>
  );
}

function GuessBox(props) {
  const [currentGuess, setCurrentGuess] = useState(["", "", "", "", ""]);

  const handleChange = (event) => {
    const index = Number(event.target.name); // name of input box being changed 0 to 4
    setCurrentGuess((currGuessState) => {
      let newGuessState = [...currGuessState];
      newGuessState[index] = event.target.value;
      return newGuessState;
    });
  };
  const addGuess = (currentGuess) => {
    props.setGuessList((currList) => {
      return [currentGuess, ...currList];
    });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      currentGuess.join("").length < 5 ||
      !words.includes(currentGuess.join("").toLowerCase())
    ) {
      alert("Invalid word. Please retry.");
      return;
    }
    if (props.guessList.length < 5 && currentGuess.join("") !== correctWord) {
      let lowerCaseGuessArr = currentGuess.map((ele) => {
        return ele.toLowerCase();
      });
      addGuess(lowerCaseGuessArr);
      setCurrentGuess([]);
    } else if (
      props.guessList.length === 5 ||
      currentGuess.join("") === correctWord
    ) {
      let lowerCaseGuessArr = currentGuess.map((ele) => {
        return ele.toLowerCase();
      });
      addGuess(lowerCaseGuessArr);
      setCurrentGuess([]);
      props.setGameOver(true);
      setCurrentGuess(correctWord.split(""));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="guessForm">
      <table className="guessTable">
        <tbody>
          <tr>
            <td className="guessInput">
              <button
                type="image"
                className="submitButton"
                onClick={() => {
                  window.location.reload();
                }}
              >
                <img src="./replay.png" alt="New Game"></img>
              </button>
            </td>
            <td>
              <input
                className="guessInput"
                type="text"
                name="0"
                value={currentGuess[0] || ""}
                onChange={handleChange}
                maxLength="1"
                autoComplete="off"
              />
            </td>
            <td>
              <input
                className="guessInput"
                type="text"
                name="1"
                value={currentGuess[1] || ""}
                onChange={handleChange}
                maxLength="1"
                autoComplete="off"
              />
            </td>
            <td>
              <input
                className="guessInput"
                type="text"
                name="2"
                value={currentGuess[2] || ""}
                onChange={handleChange}
                maxLength="1"
                autoComplete="off"
              />
            </td>
            <td>
              <input
                className="guessInput"
                type="text"
                name="3"
                value={currentGuess[3] || ""}
                onChange={handleChange}
                maxLength="1"
                autoComplete="off"
              />
            </td>
            <td>
              <input
                className="guessInput"
                type="text"
                name="4"
                value={currentGuess[4] || ""}
                onChange={handleChange}
                maxLength="1"
                autoComplete="off"
              />
            </td>
            <td>
              <button
                type="image"
                className="submitButton"
                disabled={props.gameOver}
                style={props.gameOver ? { display: "none" } : { display: "" }}
              >
                <img src="./question.png" alt="New Game"></img>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  );
}

function GuessList(props) {
  let winningWordFlag;
  let jsx = (
    <ul>
      {props.guessListArr.map(
        //
        (guess, indexGuess) => {
          let countCorrectLettersInGuess = 0;
          const colourArray = guess.map(
            //
            (letter, indexLetter) => {
              //

              if (letter === correctWord[indexLetter]) {
                countCorrectLettersInGuess = countCorrectLettersInGuess + 1;
                return "yellowgreen";
              } else if (correctWord.includes(letter)) {
                return "yellow";
              }
              return "pink";
            }
          ); // colourArray

          //Is the current "guess" the winning word? Set winningWordFlag
          if (countCorrectLettersInGuess === 5) {
            winningWordFlag = true;
          } else {
            winningWordFlag = false;
          }

          //Use winningWordFlag to determine what html to display
          if (
            winningWordFlag ||
            (props.guessListArr.length === 6 && indexGuess === 0)
          ) {
            let endList = (
              <div key={"END" + indexGuess}>
                {/* react warning "Warning: Each child in a list should have a unique "key" prop." is misleading*/}
                {/* unique key only needs to be on the outermost element*/}
                {/*, i.e. in this case the <div> above*/}
                {/* of the JSX list of elements - NOT the html list elements */}
                <h2>YOU {winningWordFlag ? "WIN" : "LOSE"}!</h2>
                <li
                  style={{
                    backgroundColor: `rgb(91, 4, 131)`,
                  }}
                >
                  <table border="1" className="guesslistTable">
                    <tbody>
                      <tr>
                        <td style={{ backgroundColor: colourArray[0] }}>
                          {guess[0]}
                        </td>
                        <td style={{ backgroundColor: colourArray[1] }}>
                          {guess[1]}
                        </td>
                        <td style={{ backgroundColor: colourArray[2] }}>
                          {guess[2]}
                        </td>
                        <td style={{ backgroundColor: colourArray[3] }}>
                          {guess[3]}
                        </td>
                        <td style={{ backgroundColor: colourArray[4] }}>
                          {guess[4]}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </li>
              </div>
            ); //endList
            return endList;
          } else {
            let playList = (
              <li
                key={"PLAY" + indexGuess}
                className="liGuessList"
                style={{
                  backgroundColor: `rgb(${
                    91 + 23 * (6 - props.guessListArr.length + indexGuess)
                  },
                    ${4 + 27 * (6 - props.guessListArr.length + indexGuess)} , 
                    ${
                      131 + 24 * (6 - props.guessListArr.length + indexGuess)
                    })`,
                }}
              >
                {/* react warning "Warning: Each child in a list should have a unique "key" prop." is misleading*/}
                {/* unique key only needs to be on the outermost element*/}
                {/*, i.e. in this case the <li> above*/}
                {/* of the JSX list of elements - NOT the html list elements */}
                <table border="1" className="guesslistTable">
                  <tbody>
                    <tr>
                      <td style={{ backgroundColor: colourArray[0] }}>
                        {guess[0]}
                      </td>
                      <td style={{ backgroundColor: colourArray[1] }}>
                        {guess[1]}
                      </td>
                      <td style={{ backgroundColor: colourArray[2] }}>
                        {guess[2]}
                      </td>
                      <td style={{ backgroundColor: colourArray[3] }}>
                        {guess[3]}
                      </td>
                      <td style={{ backgroundColor: colourArray[4] }}>
                        {guess[4]}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </li>
            ); //playList
            return playList;
          }
          //        return playList;
        }
      )}
    </ul>
  );

  useEffect(() => {
    if (winningWordFlag) {
      props.setGameOver(true);
    }
    //}, [winningWordFlag]);
  }, [props, winningWordFlag]);
  return jsx;
}

export default App;
