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

    const currentPosition = returnInitialPosition();

    return {currentPosition};
})();

const displayController =(() => {
    const container = document.querySelector('.container');

    const createBoard = () => {
        for (i = 0; i < 3; i++) {
            for (j = 0; j < 3; j++) {
                const square = document.createElement('div');
                square.classList.add('square');
                square.setAttribute('data-row', i);
                square.setAttribute('data-column', j);
                container.appendChild(square);
            }
        }
    };

    return {createBoard, container};
})();

const playerCreator = () => {
    const score = 0;
    const play = () => {
    }
    return {score, play};
};

displayController.createBoard();