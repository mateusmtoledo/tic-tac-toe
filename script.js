const gameBoard = (() => {
  const returnInitialPosition = () => {
    let pos = [];
    for (let i = 0; i < 3; i++) {
      pos[i] = [];
      for (let j = 0; j < 3; j++) {
        pos[i][j] = "";
      }
    }
    return pos;
  };

  const clear = () => {
    gameBoard.currentPosition = returnInitialPosition();
    displayController.clear();
  };

  const play = (e) => {
    const r = e.target.dataset.row;
    const c = e.target.dataset.column;
    if (gameBoard.currentPosition[r][c]) return;
    gameBoard.currentPosition[r][c] = currentTurn;
    displayController.updateBoard(currentTurn, r, c);
    if (checkForWin()) {
      players.roundWinner = players[currentTurn];
      players.roundWinner.score++;
      displayController.toggleListeners();
      displayController.updateScore();
      displayController.displayWinner(players.roundWinner);
      displayController.turn.textContent = '';
    } else if (checkForDraw()) {
      displayController.toggleListeners();
      displayController.displayDrawMessage();
      displayController.turn.textContent = '';
    }
    if (currentTurn === "x") currentTurn = "o";
    else currentTurn = "x";
    displayController.updateTurn(currentTurn);
  };

  const checkForDraw = () => {
    const pos = gameBoard.currentPosition;
    for (let i = 0; i < 3; i++) {
      if (pos[i].includes("")) return;
    }
    return true;
  };

  const checkForWin = () => {
    const pos = gameBoard.currentPosition;
    const checkRow = (num) => {
      if (!pos[num][0]) return;
      if (pos[num][0] === pos[num][1] && pos[num][0] === pos[num][2])
        return true;
    };
    const checkColumn = (num) => {
      if (!pos[0][num]) return;
      if (pos[0][num] === pos[1][num] && pos[0][num] === pos[2][num])
        return true;
    };
    const checkDiagonal = (num) => {
      if (num === 1) return;
      if (!pos[num][num]) return;
      const inc = num === 0 ? 1 : -1;
      if (
        pos[num][num] === pos[num + inc][num + inc] &&
        pos[num][num] === pos[num + 2 * inc][num + 2 * inc]
      )
        return true;
    };
    for (let i = 0; i < 3; i++) {
      if (checkRow(i) || checkColumn(i) || checkDiagonal(i)) return true;
    }
  };

  let roundWinner = {};
  let currentPosition = returnInitialPosition();
  let currentTurn = "x";

  return { currentTurn, play, currentPosition, clear, roundWinner };
})();

const displayController = (() => {
  const winnerDiv = document.querySelector(".round-winner");
  const container = document.querySelector(".container");
  const squares = [];
  const playerXName = document.querySelector(".player:first-child .name");
  const playerOName = document.querySelector(".player:last-child .name");
  const playerXScore = document.querySelector(".player:first-child .score");
  const playerOScore = document.querySelector(".player:last-child .score");
  const turn = document.querySelector(".turn");

  const displayNames = () => {
    playerXName.textContent = `${players.x.getName()} (${players.x
      .getSymbol()
      .toUpperCase()})`;
    playerOName.textContent = `${players.o.getName()} (${players.o
      .getSymbol()
      .toUpperCase()})`;
  };

  const updateScore = () => {
    playerXScore.textContent = players.x.score;
    playerOScore.textContent = players.o.score;
  };

  const displayDrawMessage = () => {
    winnerDiv.textContent = `It's a draw!`;
  };

  const updateTurn = (t) => {
    turn.textContent = `It's ${players[t].getName()}'s (${players[t]
      .getSymbol()
      .toUpperCase()}) turn to play`;
  };

  const displayWinner = (w) => {
    winnerDiv.textContent = `${w.getName()} (${w
      .getSymbol()
      .toUpperCase()}) won the round!`;
  };

  const createBoard = () => {
    for (i = 0; i < 3; i++) {
      squares[i] = [];
      for (j = 0; j < 3; j++) {
        squares[i][j] = document.createElement("div");
        squares[i][j].classList.add("square");
        squares[i][j].setAttribute("data-row", i);
        squares[i][j].setAttribute("data-column", j);
        squares[i][j].addEventListener("click", gameBoard.play);
        squares[i][j].setAttribute("data-listener", 1);
        container.appendChild(squares[i][j]);
      }
    }
  };

  const toggleListeners = () => {
    if (squares[0][0].getAttribute("data-listener") == 1) {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          squares[i][j].removeEventListener("click", gameBoard.play);
          squares[i][j].setAttribute("data-listener", 0);
        }
      }
    } else {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          squares[i][j].addEventListener("click", gameBoard.play);
          squares[i][j].setAttribute("data-listener", 1);
        }
      }
    }
  };

  const updateBoard = (turn, r, c) => {
    const sqr = container.querySelector(
      `[data-row="${r}"][data-column="${c}"]`
    );
    if (turn === "x") {
      sqr.innerHTML = "&#10060;";
      sqr.classList.add("cross");
    } else {
      sqr.innerHTML = "&#8413;";
      sqr.classList.add("circle");
    }
  };

  const clear = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const sqr = container.querySelector(
          `[data-row="${i}"][data-column="${j}"]`
        );
        sqr.textContent = "";
        sqr.classList.remove("cross");
        sqr.classList.remove("circle");
      }
    }
  };

  return {
    createBoard,
    updateBoard,
    clear,
    toggleListeners,
    updateScore,
    displayWinner,
    updateTurn,
    displayNames,
    displayDrawMessage,
    turn,
  };
})();

const playerCreator = (name, Symbol) => {
  let score = 0;
  const getName = () => name;
  const getSymbol = () => Symbol;

  return { getName, score, getSymbol };
};

const players = (() => {
  let playerName = "";
  let roundWinner = {};

  while (!playerName || playerName.length >= 10) {
    playerName = prompt("Enter the first player's name (X):");
  }
  const x = playerCreator(playerName, "x");

  playerName = "";
  while (!playerName || playerName.length >= 10) {
    playerName = prompt("Enter the second player's name (O):");
  }
  const o = playerCreator(playerName, "o");

  return { o, x, roundWinner };
})();

displayController.displayNames();
displayController.createBoard();
displayController.updateScore();
displayController.updateTurn("x");
