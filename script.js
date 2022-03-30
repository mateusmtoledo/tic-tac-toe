const gameBoard = (() => {
    const returnInitialPosition = () => {
        let pos = [];
        for (let i = 0; i < 3; i++) {
            pos[i] = [];
            for (let j = 0; j < 3 ; j++) {
                pos[i][j] = '';
            }
        }
        return pos;
    };

    const clear = () => {
        gameBoard.currentPosition = returnInitialPosition();
        displayController.clear();
    }

    const play = e => {
        const r = e.target.dataset.row;
        const c = e.target.dataset.column;
        if (gameBoard.currentPosition[r][c]) return;
        gameBoard.currentPosition[r][c] = currentTurn;
        displayController.updateBoard(currentTurn, r, c);
        if (checkForWin()) roundWinner = currentTurn;
        if (currentTurn === 'x') currentTurn = 'o';
        else currentTurn = 'x';
    };

    const checkForWin = () => {
        const pos = gameBoard.currentPosition;
        const checkRow = num => {
            if (!pos[num][0]) return;
            if (pos[num][0] === pos[num][1] && pos[num][0] === pos[num][2]) return true;
        }
        const checkColumn = num => {
            if (!pos[0][num]) return;
            if (pos[0][num] === pos[1][num] && pos[0][num] === pos[2][num]) return true;
        }
        const checkDiagonal = num => {
            if (num === 1) return;
            if (!pos[num][num]) return;
            const inc = num === 0 ? 1 : -1;
            if (pos[num][num] === pos[num+inc][num+inc] &&
                pos[num][num] === pos[num+2*inc][num+2*inc]) return true;
        }
        for (let i = 0; i < 3; i++) {
            if (checkRow(i) || checkColumn(i) || checkDiagonal(i)) return true;
        }
    };

    let roundWinner = '';
    let currentPosition = returnInitialPosition();
    let currentTurn = 'x';

    return {currentTurn, play, currentPosition, clear, roundWinner};
})();

const displayController = (() => {
    const container = document.querySelector('.container');
    const createBoard = () => {
        for (i = 0; i < 3; i++) {
            for (j = 0; j < 3; j++) {
                const square = document.createElement('div');
                square.classList.add('square');
                square.setAttribute('data-row', i);
                square.setAttribute('data-column', j);
                square.addEventListener('click', gameBoard.play);
                container.appendChild(square);
            }
        }
    };

    const updateBoard = (turn, r, c) => {
        const sqr = container.querySelector(`[data-row="${r}"][data-column="${c}"]`);
        if (turn === 'x') {
            sqr.innerHTML = '&#10060;';
            sqr.classList.add('cross');
        }
        else {
            sqr.innerHTML = '&#8413;';
            sqr.classList.add('circle');
        }
    }

    const clear = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const sqr = container.querySelector(`[data-row="${i}"][data-column="${j}"]`);
                sqr.textContent = '';
                sqr.classList.remove('cross');
                sqr.classList.remove('circle');
            }
        }
    }

    return {createBoard, container, updateBoard, clear};
})();

const playerCreator = (name) => {
    let score = 0;
    const getName = () => name;

    return {getName, score};
};

displayController.createBoard();

let playerName = '';
while (!playerName) {
    playerName = prompt('Enter the first player\'s name (X):');
}
const playerX = playerCreator(playerName);

playerName = '';
while(!playerName) {
    playerName = prompt('Enter the second player\'s name (O):');
}
const playerO = playerCreator(playerName);