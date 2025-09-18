const columns = document.querySelectorAll('.grid > .grid-column');

let grid = {};

let moveNow = Math.random() > 0.5 ? 'x' : 'o';

const getMove = () => {
    const moveBefore = moveNow;
    return (moveNow = moveNow === 'o' ? 'x' : 'o', moveBefore);
};

//init
(() => {
    columns.forEach(column => {
        column.querySelectorAll('.box').forEach(box => {
            box.addEventListener('mousedown', () => {
                if (box.innerHTML !== '') return;
                box.innerHTML = getMove();

                updateGrid();
                checkForWin();
            });
        });
    });
})();

//todo: не придумал
const updateGrid = (write = false, x, y, data) => {
    if (write === true) {
        columns.forEach((column, columnIndex) => {
            if (!grid[`column${columnIndex}`]) grid[`column${columnIndex}`] = {};

            column.querySelectorAll('.box').forEach((_, boxIndex) => x === columnIndex && y === boxIndex && (grid[`column${columnIndex}`][`box${boxIndex}`] = data));
        });
    } else {
        if (y && y > -1) {
            columns.forEach((column, columnIndex) => {
                if (!grid) return;

                column.querySelectorAll('.box').forEach((box, boxIndex) => {
                    if (x === columnIndex && y === boxIndex) return box.innerHTML ?? '';
                });
            });
        } else {
            columns.forEach((column, columnIndex) => {
                if (!grid[`column${columnIndex}`]) grid[`column${columnIndex}`] = {};

                column.querySelectorAll('.box').forEach((box, boxIndex) => grid[`column${columnIndex}`][`box${boxIndex}`] = box.innerHTML);
            });
        };
    };
};

updateGrid();

const eraseAll = () => {
    for (const column of columns) {
        for (const box of column.querySelectorAll('.box')) {
            box.innerHTML = '';
        };
    };
};

let stopPrevious = false;

const title = document.querySelector('.title');

const wait = timeout => new Promise(r => setTimeout(r, timeout));

const showTitle = async text => {
    stopPrevious = true;

    title.innerHTML = text;
    title.style.opacity = '1';
    
    await wait(1500);

    stopPrevious = false;

    for (let i = 1; i < 11; i++) {
        if (stopPrevious == true) {
            title.style.opacity = '1';
            break;
        };

        await wait(75);

        title.style.opacity = `${(10 - i) / 10}`;
    };
};

const variants = [
    [[0,0],[1,1],[2,2]],
    [[2,0],[1,1],[0,2]],
    [[0,0],[1,0],[2,0]],
    [[0,0],[0,1],[0,2]],
    [[0,2],[1,2],[2,2]],
    [[2,2],[2,1],[2,0]],
    [[1,0],[1,1],[1,2]],
    [[0,1],[1,1],[2,1]]
];

let winners = [0, 0];

const win = (who) => {
    eraseAll();

    showTitle(who ? `Выиграли ${who .toUpperCase()}` : 'Ничья');
    if (['x', 'o'].includes(who)) (who === 'x' ? winners[0]++ : winners[1]++, document.querySelector('.winners').innerHTML = winners.join('  '));
};

const checkForWin = () => {
    let filled = 0;

    for (const poses of variants) {
        let r = [];
        
        for (const pos of poses) {
            const item = grid[`column${pos[0]}`][`box${pos[1]}`];
            if (item !== '') filled++;
            r.push(item);
        };

        if (r[0] !== '' && r[0] === r[1] && r[1] === r[2]) return win(r[0]);
    };

    if (filled >= 24) win();
};

showTitle('Приятной игры!');
