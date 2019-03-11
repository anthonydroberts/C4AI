var board = [[0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0]];
var gameType = 0; //game type refers to 0 for standard C4, or 1 for alternate dropping version
var playType = 0; //0 for human vs human, 1 for human vs ai, 2 for ai vs ai
var playerTurn = 1; //1 for player 1, or 2 for player 2

//update board grid values, x position, y position, player number (1 or 2)			 
function updateBoardValues(x,y,p){
	//if alternative game mode, and position is y=5, and spot taken by same player, then drop col
	if(gameType == 1 && y == 5 && board[y][x] == p){
		for(let i = 5; i > 0; i--){
			board[i][x] = board[i-1][x];
		}
		board[0][x] = 0;
		return 1;
	}
	
	//if position taken, traverse upwards to find empty 
	if(board[y][x] != 0){
		for(let i = y; i >= 0; i--){
			if(board[i][x] == 0){
				board[i][x] = p;
				return 1;
			}
		}
	}

	//if position not taken, drop to lowest slot and fill
	else{
		for (let i = 5; i >= y; i--) {
			if (board[i][x] == 0) {
				board[i][x] = p;
				return 1;
			}
		}
	}
	
	return 0;
}

//clear old board, then redraw all table entries based on grid values in each entry
function drawBoard(){
	for(let i = 0; i < board.length; i++){
		for(let j = 0; j < board[i].length; j++){
			if(board[i][j] == 0){
				let cell = $("tr:eq(" + i + ")").find('td').eq(j).css('background', 'transparent');
			}
			if(board[i][j] == 1){
				let cell = $("tr:eq(" + i + ")").find('td').eq(j).css('background', '#ff3c64');
			}
			else if(board[i][j] == 2){
				let cell = $("tr:eq(" + i + ")").find('td').eq(j).css('background', 'blue');
			}
		}
	}
}


//check for a win or a draw by scanning board
function checkBoard(){
	let HEIGHT = board.length;
    let WIDTH = board[0].length;
    let EMPTY_SLOT = 0;
    for (let r = 0; r < HEIGHT; r++) { // iterate rows, bottom to top
        for (let c = 0; c < WIDTH; c++) { // iterate columns, left to right
            let player = board[r][c];
            if (player == EMPTY_SLOT)
                continue; // don't check empty slots

            if (c + 3 < WIDTH &&
                player == board[r][c+1] && // look right
                player == board[r][c+2] &&
                player == board[r][c+3])
                console.log("HORIZONTAL WIN FOR " + player);
            if (r + 3 < HEIGHT) {
                if (player == board[r+1][c] && // look up
                    player == board[r+2][c] &&
                    player == board[r+3][c])
                    console.log("VERTICAL WIN FOR " + player);
                if (c + 3 < WIDTH &&
                    player == board[r+1][c+1] && // look up & right
                    player == board[r+2][c+2] &&
                    player == board[r+3][c+3])
                    console.log("POSITIVE DIAGONAL WIN FOR " + player);
                if (c - 3 >= 0 &&
                    player == board[r+1][c-1] && // look up & left
                    player == board[r+2][c-2] &&
                    player == board[r+3][c-3])
                    console.log("NEGATIVE DIAGONAL WIN FOR " + player);
            }
        }
    }
	//no win, check for draw
	for(let i = 0; i < board.length; i++){
		for(let j = 0; j < board[i].length; j++){
			if(board[i][j] == 0){
				return 0;
			}
		}
	}
	//draw check did not detect any empty grids, game is a draw return draw
	console.log("DRAW GAME");
	return 0;
}

// takes in a new board state and returns its evaluated score 
function getScore(b, p){
	let SCORE = 0;
	let HEIGHT = b.length;
    let WIDTH = b[0].length;
	let player1 = -1;
	let player2 = -2;
	
	if(p == 1){
		player1 = 1;
		player2 = 2;
	}
	else if(p == 2){
		player1 = 2;
		player2 = 1;
	}
	
    for (let r = 0; r < HEIGHT; r++) { // iterate rows, bottom to top
        for (let c = 0; c < WIDTH; c++) { // iterate columns, left to right
            if (b[r][c] == 0)
                continue; // don't check empty slots
			else if (b[r][c] == player1){ // we are checking a computers tile
				if(c == 3 && player1 == b[r][c]){ //middle column pieces are worth more
					SCORE = SCORE + 2;
				}
				
				if (c + 3 < WIDTH &&
					player1 == b[r][c+1] && // look right
					player1 == b[r][c+2] &&
					player1 == b[r][c+3]){
							//player1 4 in a row horizontally
						SCORE = SCORE + 10000;
					}
					
				if (c + 2 < WIDTH &&
					player1 == b[r][c+1] && // look right
					player1 == b[r][c+2]){
							//player1 3 in a row horizontally
						SCORE = SCORE + 5;
					}
				
				if (c + 1 < WIDTH &&
					player1 == b[r][c+1]){
							//player1 2 in a row horizontally
						SCORE = SCORE + 2;
					}
				
				if (r + 3 < HEIGHT &&
					player1 == b[r+1][c] && // look up
					player1 == b[r+2][c] &&
					player1 == b[r+3][c]){
						//player1 4 in a row vertically
						SCORE = SCORE + 10000;
					}

				if (r + 2 < HEIGHT &&
					player1 == b[r+1][c] && // look up
					player1 == b[r+2][c]){
						//player1 3 in a row vertically
						SCORE = SCORE + 5;
					}
					
				if (r + 1 < HEIGHT &&
					player1 == b[r+1][c]){
						//player1 2 in a row vertically
						SCORE = SCORE + 2;
					}
					
				if (r + 3 < HEIGHT &&
					c + 3 < WIDTH &&
					player1 == b[r+1][c+1] && // look up & right
					player1 == b[r+2][c+2] &&
					player1 == b[r+3][c+3]){
						//player1 4 in a row diagonally
						SCORE = SCORE + 10000;
					}
					
				if (r + 2 < HEIGHT &&
					c + 2 < WIDTH &&
					player1 == b[r+1][c+1] && // look up & right
					player1 == b[r+2][c+2]){
						//player1 3 in a row diagonally
						SCORE = SCORE + 5;
					}
					
				if (r + 1 < HEIGHT &&
					c + 1 < WIDTH &&
					player1 == b[r+1][c+1]){
						//player1 2 in a row diagonally
						SCORE = SCORE + 2;
					}
					
				if (r + 3 < HEIGHT &&
					c - 3 >= 0 &&
					player1 == b[r+1][c-1] && // look up & left
					player1 == b[r+2][c-2] &&
					player1 == b[r+3][c-3]){
						//player1 4 in a row diagonally
						SCORE = SCORE + 10000;
					}
					
				if (r + 2 < HEIGHT &&
					c - 2 >= 0 &&
					player1 == b[r+1][c-1] && // look up & left
					player1 == b[r+2][c-2]){
						//player1 3 in a row diagonally
						SCORE = SCORE + 5;
					}

				if (r + 1 < HEIGHT &&
					c - 1 >= 0 &&
					player1 == b[r+1][c-1]){
						//player1 2 in a row diagonally
						SCORE = SCORE + 2;
					}
						
			}
			else if(b[r][c] == player2){  // we are checking a players tile
				if(c == 3 && player2 == b[r][c]){ //middle column pieces are worth more
					SCORE = SCORE - 2;
				}
			
				if (c + 3 < WIDTH &&
					player2 == b[r][c+1] && // look right
					player2 == b[r][c+2] &&
					player2 == b[r][c+3]){
							//player2 4 in a row horizontally
						SCORE = SCORE - 10000;
					}
					
				if (c + 2 < WIDTH &&
					player2 == b[r][c+1] && // look right
					player2 == b[r][c+2]){
							//player2 3 in a row horizontally
						SCORE = SCORE - 5;
					}
				
				if (c + 1 < WIDTH &&
					player2 == b[r][c+1]){
							//player2 2 in a row horizontally
						SCORE = SCORE - 2;
					}
				
				if (r + 3 < HEIGHT &&
					player2 == b[r+1][c] && // look up
					player2 == b[r+2][c] &&
					player2 == b[r+3][c]){
						//player2 4 in a row vertically
						SCORE = SCORE - 10000;
					}

				if (r + 2 < HEIGHT &&
					player2 == b[r+1][c] && // look up
					player2 == b[r+2][c]){
						//player2 3 in a row vertically
						SCORE = SCORE - 5;
					}
					
				if (r + 1 < HEIGHT &&
					player2 == b[r+1][c]){
						//player2 2 in a row vertically
						SCORE = SCORE - 2;
					}
					
				if (r + 3 < HEIGHT &&
					c + 3 < WIDTH &&
					player2 == b[r+1][c+1] && // look up & right
					player2 == b[r+2][c+2] &&
					player2 == b[r+3][c+3]){
						//player2 4 in a row diagonally
						SCORE = SCORE - 10000;
					}
					
				if (r + 2 < HEIGHT &&
					c + 2 < WIDTH &&
					player2 == b[r+1][c+1] && // look up & right
					player2 == b[r+2][c+2]){
						//player2 3 in a row diagonally
						SCORE = SCORE - 5;
					}
					
				if (r + 1 < HEIGHT &&
					c + 1 < WIDTH &&
					player2 == b[r+1][c+1]){
						//player2 2 in a row diagonally
						SCORE = SCORE - 2;
					}
					
				if (r + 3 < HEIGHT &&
					c - 3 >= 0 &&
					player2 == b[r+1][c-1] && // look up & left
					player2 == b[r+2][c-2] &&
					player2 == b[r+3][c-3]){
						//player2 4 in a row diagonally
						SCORE = SCORE - 10000;
					}
					
				if (r + 2 < HEIGHT &&
					c - 2 >= 0 &&
					player2 == b[r+1][c-1] && // look up & left
					player2 == b[r+2][c-2]){
						//player2 3 in a row diagonally
						SCORE = SCORE - 5;
					}

				if (r + 1 < HEIGHT &&
					c - 1 >= 0 &&
					player2 == b[r+1][c-1]){
						//player2 2 in a row diagonally
						SCORE = SCORE - 2;
					}
			}

        }
    }
	
	return SCORE;
}

//function to set all relevant variables, also used for resetting game
function init(gt,pt){
	board = [[0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0]];
	gameType = gt; //game type refers to 0 for standard C4, or 1 for alternate dropping version
	playType = pt; //0 for human vs human, 1 for human vs ai, 2 for ai vs ai
	playerTurn = 1; //1 for player 1, or 2 for player 2
	drawBoard();
}

//click handler for grid positions when player clicks
$('#board td').click(function(){
	
	let y = $('#board tr').index($(this).closest('tr'));
	let x = $(this).closest('tr').find('td').index($(this).closest('td'));
	
	//check if updateBoardValues returns success then proceed
	if(updateBoardValues(x,y, playerTurn) == 1){
		drawBoard()
		checkBoard()
		if(playType == 0){ //human vs human, switch turns
			if (playerTurn == 1){
				playerTurn = 2;
			}
			else if(playerTurn == 2){
				playerTurn = 1;
			}
		}
		console.log(getScore(board,1))
	}
	
});

$('#initGame').click(function(){
	init(document.getElementById("SelectGameType").value, document.getElementById("SelectPlayType").value);
});