import React from "react";
import "./App.css";
import GitHub_Logo_White from "./GitHub_Logo_White.png";

// I want to get rid of the map-method and especially the unnecessary extra const "ids",
// since it can be merged with "numbers". I want to use this method: https://stackoverflow.com/questions/14810506/map-function-for-objects-instead-of-arrays
const numbers = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0];
const ops = ["-", "/", "*", "+"];
const ids = {
  7: "seven",
  8: "eight",
  9: "nine",
  4: "four",
  5: "five",
  6: "six",
  1: "one",
  2: "two",
  3: "three",
  0: "zero",
  "-": "subtract",
  "/": "divide",
  "*": "multiply",
  "+": "add",
};

class Calculator extends React.Component {
  state = {
    calc: "0",
    evaluated: undefined,
    equalsign: undefined,
  };

  handleClick = (e) => {
    //click-logic happens here
    const { calc, lastPressed } = this.state;
    const { innerText } = e.target;

    //this is where the typing is achieved
    switch (innerText) {
      case "CE": {
        this.setState({
          calc: "0",
          evaluated: undefined,
          equalsign: undefined,
        });
        break;
      }
      case "C": {
        if (calc.length > 1)
          this.setState({
            calc: calc.slice(0, -1),
          });
        else if (calc.length === 1)
          this.setState({
            calc: "0",
          });
        else return;
        break;
      }

      case "=": {
        // eslint-disable-next-line
        const evaluated = eval(calc);
        this.setState({
          // https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary
          // I also tried to use .toLocaleString("en-US", {minimumFractionDigits: 4}), but that broke the program
          calc: Math.round((evaluated + Number.EPSILON) * 10000) / 10000,
          evaluated: calc,
          equalsign: "=",
        });
        break;
      }

      // I want to put some conditional formatting. The goal is that the calculation of the previous calc
      // is becoming green. And when typing new digits, the calc of the previous sum remains green, and
      // the other text has a different color. This will help with UX (and overcome some wrong interpretations
      //   for first time users)
      // The way it is taught in freeCodeCamp:
      //   if (this.state.input.length > 15) {
      //   inputStyle.border = '3px solid red';}

      // I want to improve the logic here. Now you can type multiple "dots" after typing an operator,
      // and after a second the program crashes.
      // I tried several methods, but the ...includes() like this:
      // ((calc.includes(/\.{1}/g)) )"" cannot start with a RegEx.
      // It still passes the tests and therefor I won't change it now.
      //

      case ".": {
        if (!calc.includes("."))
          this.setState({
            calc: calc + ".",
          });
        // The next line avoids that you can press multiple "dots" in a row
        // but you can still write: e.g. "6.6.6.6", so it is not perfect.
        // Problem which causes this is that I build on top of the calc, while in
        // some examples, you finish a complete calculation and you don't touch the
        //state anymore, but in our case we continue appending in the previous result.
        if (lastPressed.includes(".")) return;
        if (
          calc.includes(".") &&
          (calc.includes("+") ||
            calc.includes("*") ||
            calc.includes("/") ||
            calc.includes("-"))
        )
          this.setState({
            calc: calc + ".",
          });
        break;
      }

      // This is how the calculations are actually done:
      // I followed a 3hour tutorial by Florin Pop, and massively adapted/improved most components, but not the below part.
      // The below calculations are still a mess, and hard to adapt/improve since it is full of caveats.
      // There is a prettier method by "Web Dev Simplified", which doesn't depend on "eval"
      default: {
        let computation;
        if (ops.includes(innerText)) {
          if (ops.includes(lastPressed) && innerText !== "-") {
            const convertCalc = calc
              .split("")
              .reverse()
              .findIndex(
                (character) => character !== " " && numbers.includes(+character)
              );
            computation =
              calc.slice(0, calc.length - convertCalc) + ` ${innerText} `;
          } else {
            computation = `${calc} ${innerText} `;
          }
        } else {
          computation = calc === "0" ? innerText : calc + innerText;
        }
        this.setState({
          calc: computation,
        });
      }
    }
    this.setState({
      lastPressed: innerText,
    });
  };

  render() {
    const { calc, evaluated, equalsign } = this.state;

    return (
      <div className="container">
        <div className="calculator">
          <h1 id="title"> JS CALCULATOR WITH REACT </h1>

          {/* Want to make a "unused-digits display", in which you see the "88888" of a calculator, css is already there */}
          <div id="screen">
            <div id="previousOperands">
              {evaluated} {equalsign}
            </div>
            <div id="display" className="display">
              {calc}
            </div>
          </div>

          <div className="first-row-container">
            <button className="big-horizontal">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/Gerard-B/"
              >
                <img
                  src={GitHub_Logo_White}
                  id="github-logo"
                  alt="github-logo"
                />
              </a>
            </button>
            <button
              id="clear"
              className="clear-items"
              onClick={this.handleClick}
            >
              CE
            </button>
            <button className="clear-items" onClick={this.handleClick}>
              C
            </button>
          </div>
          <div className="numbers-container">
            {numbers.map((number) => (
              <button
                className="number"
                id={ids[number]}
                onClick={this.handleClick}
              >
                {number}
              </button>
            ))}
            <button className="number" id="decimal" onClick={this.handleClick}>
              .
            </button>
            <button
              className="operation"
              id="equals"
              onClick={this.handleClick}
            >
              =
            </button>
          </div>
          {/* I would like to change the current division sign "/" to the "Obelus" or "÷"-sign. But to calculate
          the program needs "/". */}
          <div className="operations-container">
            {ops.map((op) => (
              <button
                className="operation"
                id={ids[op]}
                onClick={this.handleClick}
              >
                {op}
              </button>
            ))}
          </div>
        </div>

        <div class="text-dark">
          <div class="footer">
            {" "}
            by{" "}
            <a
              class="text-dark"
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/Gerard-B/"
            >
              Gerard
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export { Calculator };

// {/*
// User Story #7: At any time, pressing the clear button clears the input and output values, and returns the calculator to its initialized state; 0 should be shown in the element with the id of display.
// create a state-segment, default is 0,
// event/clickhandler on the "clear"-button which: setState=0

// User Story #8: As I input numbers, I should be able to see my input in the element with the id of display.

// User Story #9: In any order, I should be able to add, subtract, multiply and divide a chain of numbers of any length, and when I hit =, the correct result should be shown in the element with the id of display.

// User Story #10: When inputting numbers, my calculator should not allow a number to begin with multiple zeros.

// User Story #11: When the decimal element is clicked, a . should append to the currently displayed value; two . in one number should not be accepted.

// User Story #12: I should be able to perform any operation (+, -, *, /) on numbers containing decimal points.

// User Story #13: If 2 or more operators are entered consecutively, the operation performed should be the last operator entered (excluding the negative (-) sign). For example, if 5 + * 7 = is entered, the result should be 35 (i.e. 5 * 7); if 5 * - 5 = is entered, the result should be -25 (i.e. 5 x (-5)).

// User Story #14: Pressing an operator immediately following = should start a new calculation that operates on the result of the previous evaluation.

// User Story #15: My calculator should have several decimal places of precision when it comes to rounding (note that there is no exact standard, but you should be able to handle calculations like 2 / 7 with reasonable precision to at least 4 decimal places).

// Note On Calculator Logic: It should be noted that there are two main schools of thought on calculator input logic: immediate execution logic and formula logic. Our example utilizes formula logic and observes order of operation precedence, immediate execution does not. Either is acceptable, but please note that depending on which you choose, your calculator may yield different results than ours for certain equations (see below example). As long as your math can be verified by another production calculator, please do not consider this a bug.

// EXAMPLE: 3 + 5 x 6 - 2 / 4 =

// Immediate Execution Logic: 11.5
// Formula/Expression Logic: 32.5
// */}
//       </header>
//     </div>
//   );
// }
