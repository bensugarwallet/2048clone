class Game2048 {
    constructor() {
        this.board = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.bestScore = localStorage.getItem('best2048Score') || 0;
        this.highScores = JSON.parse(localStorage.getItem('2048HighScores')) || [];
        this.gameBoard = document.getElementById('game-board');
        this.scoreElement = document.getElementById('score');
        this.bestScoreElement = document.getElementById('best-score');
        this.highScoresList = document.getElementById('high-scores-list');
        
        document.getElementById('new-game-btn').addEventListener('click', () => this.newGame());
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Touch event handling
        this.touchStartX = null;
        this.touchStartY = null;
        this.gameBoard.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.gameBoard.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.gameBoard.addEventListener('touchend', () => this.handleTouchEnd());
        
        this.updateHighScoresDisplay();
        this.newGame();
    }

    newGame() {
        this.board = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.updateScoreDisplay();
        this.addRandomTile();
        this.addRandomTile();
        this.renderBoard();
    }

    addRandomTile() {
        const emptyCells = [];
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (this.board[r][c] === 0) {
                    emptyCells.push({r, c});
                }
            }
        }

        if (emptyCells.length > 0) {
            const {r, c} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const value = Math.random() < 0.9 ? 2 : 4;
            this.board[r][c] = {
                value: value,
                isNew: true
            };
        }
    }

    renderBoard() {
        this.gameBoard.innerHTML = '';
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                const tile = document.createElement('div');
                tile.classList.add('tile');
                if (this.board[r][c] !== 0) {
                    tile.textContent = this.board[r][c].value !== undefined ? this.board[r][c].value : this.board[r][c];
                    tile.classList.add(`tile-${this.board[r][c].value !== undefined ? this.board[r][c].value : this.board[r][c]}`);
                    if (this.board[r][c].isNew) {
                        tile.style.animation = 'none';
                        tile.offsetHeight; // Trigger reflow
                        tile.style.animation = null;
                        delete this.board[r][c].isNew;
                    }
                    if (this.board[r][c].merged) {
                        tile.classList.add('merged');
                        delete this.board[r][c].merged;
                    }
                }
                this.gameBoard.appendChild(tile);
            }
        }
    }

    handleKeyPress(e) {
        const key = e.key;
        let moved = false;

        switch(key) {
            case 'ArrowUp':
                moved = this.moveUp();
                break;
            case 'ArrowDown':
                moved = this.moveDown();
                break;
            case 'ArrowLeft':
                moved = this.moveLeft();
                break;
            case 'ArrowRight':
                moved = this.moveRight();
                break;
        }

        if (moved) {
            this.addRandomTile();
            this.renderBoard();
            this.checkGameStatus();
        }
    }

    handleTouchStart(e) {
        const touch = e.touches[0];
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
        e.preventDefault();
    }

    handleTouchMove(e) {
        e.preventDefault();
    }

    handleTouchEnd() {
        if (!this.touchStartX || !this.touchStartY) return;

        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - this.touchStartX;
        const deltaY = touch.clientY - this.touchStartY;
        const minSwipeDistance = 50;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    this.moveRight();
                } else {
                    this.moveLeft();
                }
            }
        } else {
            if (Math.abs(deltaY) > minSwipeDistance) {
                if (deltaY > 0) {
                    this.moveDown();
                } else {
                    this.moveUp();
                }
            }
        }

        this.touchStartX = null;
        this.touchStartY = null;
    }

    moveLeft() {
        let moved = false;
        for (let r = 0; r < 4; r++) {
            const row = this.board[r].filter(cell => cell !== 0 && cell.value !== undefined ? cell.value : cell);
            for (let c = 0; c < row.length - 1; c++) {
                const current = row[c].value !== undefined ? row[c].value : row[c];
                const next = row[c + 1].value !== undefined ? row[c + 1].value : row[c + 1];
                if (current === next) {
                    row[c] = {
                        value: current * 2,
                        merged: true
                    };
                    this.score += current * 2;
                    row.splice(c + 1, 1);
                    moved = true;
                }
            }
            const newRow = row.map(cell => cell.value !== undefined ? cell : {value: cell});
            while (newRow.length < 4) newRow.push(0);
            if (JSON.stringify(newRow) !== JSON.stringify(this.board[r])) moved = true;
            this.board[r] = newRow;
        }
        this.updateScoreDisplay();
        return moved;
    }

    moveRight() {
        let moved = false;
        for (let r = 0; r < 4; r++) {
            const row = this.board[r].filter(cell => cell !== 0 && cell.value !== undefined ? cell.value : cell);
            for (let c = row.length - 1; c > 0; c--) {
                const current = row[c].value !== undefined ? row[c].value : row[c];
                const next = row[c - 1].value !== undefined ? row[c - 1].value : row[c - 1];
                if (current === next) {
                    row[c] = {
                        value: current * 2,
                        merged: true
                    };
                    this.score += current * 2;
                    row.splice(c - 1, 1);
                    moved = true;
                }
            }
            const newRow = row.map(cell => cell.value !== undefined ? cell : {value: cell});
            while (newRow.length < 4) newRow.unshift(0);
            if (JSON.stringify(newRow) !== JSON.stringify(this.board[r])) moved = true;
            this.board[r] = newRow;
        }
        this.updateScoreDisplay();
        return moved;
    }

    moveUp() {
        let moved = false;
        for (let c = 0; c < 4; c++) {
            const column = [
                this.board[0][c], 
                this.board[1][c], 
                this.board[2][c], 
                this.board[3][c]
            ].filter(cell => cell !== 0 && cell.value !== undefined ? cell.value : cell);

            for (let r = 0; r < column.length - 1; r++) {
                const current = column[r].value !== undefined ? column[r].value : column[r];
                const next = column[r + 1].value !== undefined ? column[r + 1].value : column[r + 1];
                if (current === next) {
                    column[r] = {
                        value: current * 2,
                        merged: true
                    };
                    this.score += current * 2;
                    column.splice(r + 1, 1);
                    moved = true;
                }
            }

            const newColumn = column.map(cell => cell.value !== undefined ? cell : {value: cell});
            while (newColumn.length < 4) newColumn.push(0);
            
            for (let r = 0; r < 4; r++) {
                if (this.board[r][c].value !== undefined ? this.board[r][c].value : this.board[r][c] !== newColumn[r].value !== undefined ? newColumn[r].value : newColumn[r]) moved = true;
                this.board[r][c] = newColumn[r];
            }
        }
        this.updateScoreDisplay();
        return moved;
    }

    moveDown() {
        let moved = false;
        for (let c = 0; c < 4; c++) {
            const column = [
                this.board[0][c], 
                this.board[1][c], 
                this.board[2][c], 
                this.board[3][c]
            ].filter(cell => cell !== 0 && cell.value !== undefined ? cell.value : cell);

            for (let r = column.length - 1; r > 0; r--) {
                const current = column[r].value !== undefined ? column[r].value : column[r];
                const next = column[r - 1].value !== undefined ? column[r - 1].value : column[r - 1];
                if (current === next) {
                    column[r] = {
                        value: current * 2,
                        merged: true
                    };
                    this.score += current * 2;
                    column.splice(r - 1, 1);
                    moved = true;
                }
            }

            const newColumn = column.map(cell => cell.value !== undefined ? cell : {value: cell});
            while (newColumn.length < 4) newColumn.unshift(0);
            
            for (let r = 0; r < 4; r++) {
                if (this.board[r][c].value !== undefined ? this.board[r][c].value : this.board[r][c] !== newColumn[r].value !== undefined ? newColumn[r].value : newColumn[r]) moved = true;
                this.board[r][c] = newColumn[r];
            }
        }
        this.updateScoreDisplay();
        return moved;
    }

    updateScoreDisplay() {
        this.scoreElement.textContent = this.score;
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('best2048Score', this.bestScore);
        }
        this.bestScoreElement.textContent = this.bestScore;
    }

    updateHighScores() {
        this.highScores.push({
            score: this.score,
            date: new Date().toLocaleDateString()
        });
        
        // Sort high scores in descending order and keep only top 5
        this.highScores.sort((a, b) => b.score - a.score);
        this.highScores = this.highScores.slice(0, 5);
        
        localStorage.setItem('2048HighScores', JSON.stringify(this.highScores));
        this.updateHighScoresDisplay();
    }

    updateHighScoresDisplay() {
        this.highScoresList.innerHTML = '';
        this.highScores.forEach(score => {
            const li = document.createElement('li');
            li.textContent = `${score.score} points (${score.date})`;
            this.highScoresList.appendChild(li);
        });
    }

    checkGameStatus() {
        // Check for 2048 tile
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (this.board[r][c].value !== undefined ? this.board[r][c].value : this.board[r][c] === 2048) {
                    this.updateHighScores();
                    alert('Congratulations! You reached 2048!');
                    return;
                }
            }
        }

        // Check if game is over
        const isBoardFull = this.board.every(row => row.every(cell => cell !== 0));
        const canMerge = this.checkIfCanMerge();

        if (isBoardFull && !canMerge) {
            this.updateHighScores();
            alert('Game Over! No more moves possible.');
        }
    }

    checkIfCanMerge() {
        // Check horizontal merges
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 3; c++) {
                if (this.board[r][c].value !== undefined ? this.board[r][c].value : this.board[r][c] === this.board[r][c + 1].value !== undefined ? this.board[r][c + 1].value : this.board[r][c + 1]) return true;
            }
        }

        // Check vertical merges
        for (let c = 0; c < 4; c++) {
            for (let r = 0; r < 3; r++) {
                if (this.board[r][c].value !== undefined ? this.board[r][c].value : this.board[r][c] === this.board[r + 1][c].value !== undefined ? this.board[r + 1][c].value : this.board[r + 1][c]) return true;
            }
        }

        return false;
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Game2048();
});
