import * as readline from 'readline';

type Player = 'X' | 'O';
type Cell = Player | null;
type Board = Cell[][];

class TicTacToe {
    private board: Board;
    private currentPlayer: Player;
    private rl: readline.Interface;

    constructor() {
        this.board = Array(3).fill(null).map(() => Array(3).fill(null));
        this.currentPlayer = 'X';
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    private displayBoard(): void {
        console.clear();
        console.log('Current board:');
        for (let i = 0; i < 3; i++) {
            let row = '';
            for (let j = 0; j < 3; j++) {
                row += ` ${this.board[i][j] || ' '} `;
                if (j < 2) row += '|';
            }
            console.log(row);
            if (i < 2) console.log('-----------');
        }
        console.log(`\nPlayer ${this.currentPlayer}'s turn`);
    }

    private isValidMove(row: number, col: number): boolean {
        return row >= 0 && row < 3 && col >= 0 && col < 3 && this.board[row][col] === null;
    }

    private checkWin(): boolean {
        // Check rows
        for (let i = 0; i < 3; i++) {
            if (this.board[i][0] && 
                this.board[i][0] === this.board[i][1] && 
                this.board[i][0] === this.board[i][2]) {
                return true;
            }
        }

        // Check columns
        for (let j = 0; j < 3; j++) {
            if (this.board[0][j] && 
                this.board[0][j] === this.board[1][j] && 
                this.board[0][j] === this.board[2][j]) {
                return true;
            }
        }

        // Check diagonals
        if (this.board[0][0] && 
            this.board[0][0] === this.board[1][1] && 
            this.board[0][0] === this.board[2][2]) {
            return true;
        }

        if (this.board[0][2] && 
            this.board[0][2] === this.board[1][1] && 
            this.board[0][2] === this.board[2][0]) {
            return true;
        }

        return false;
    }

    private isBoardFull(): boolean {
        return this.board.every(row => row.every(cell => cell !== null));
    }

    private async getPlayerMove(): Promise<[number, number]> {
        while (true) {
            const input = await new Promise<string>(resolve => {
                this.rl.question('Enter your move (row[1-3] col[1-3], e.g., "1 2"): ', resolve);
            });

            const [rowStr, colStr] = input.trim().split(' ');
            const row = parseInt(rowStr) - 1;
            const col = parseInt(colStr) - 1;

            if (this.isValidMove(row, col)) {
                return [row, col];
            }
            console.log('Invalid move! Try again.');
        }
    }

    private switchPlayer(): void {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }

    public async play(): Promise<void> {
        let gameOver = false;

        while (!gameOver) {
            this.displayBoard();
            const [row, col] = await this.getPlayerMove();
            this.board[row][col] = this.currentPlayer;

            if (this.checkWin()) {
                this.displayBoard();
                console.log(`Player ${this.currentPlayer} wins!`);
                gameOver = true;
            } else if (this.isBoardFull()) {
                this.displayBoard();
                console.log("It's a draw!");
                gameOver = true;
            } else {
                this.switchPlayer();
            }
        }

        this.rl.close();
    }
}

// Start the game
const game = new TicTacToe();
game.play().catch(console.error);