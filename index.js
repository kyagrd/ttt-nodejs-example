var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
app.use(cors()); // http://guswnsxodlf.github.io/enable-CORS-on-express

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var gameState = { winner: '', isXnext: true, squares: Array(9).fill('') };

function wins(turn) { // turn = 'X' 또는 'O'
  var squares = gameState.squares;

  return (squares[0]==turn && squares[1]==turn && squares[2]==turn) ||
         (squares[3]==turn && squares[4]==turn && squares[5]==turn) ||
         (squares[6]==turn && squares[7]==turn && squares[8]==turn) ||
         (squares[0]==turn && squares[3]==turn && squares[6]==turn) ||
         (squares[1]==turn && squares[4]==turn && squares[7]==turn) ||
         (squares[2]==turn && squares[5]==turn && squares[8]==turn) ||
         (squares[0]==turn && squares[4]==turn && squares[8]==turn) ||
         (squares[2]==turn && squares[4]==turn && squares[6]==turn) ;
};

function calcWinner() {
  console.log("wins('X') = "+ wins('X'));
  console.log("wins('O') = "+ wins('O'));
  if (wins('X')) return 'X'; // X가 이긴 경우
  if (wins('O')) return 'O'; // O가 이긴 경우
  return '';
};

app.get('/game_state', (req, res) => {
  res.charset = 'UTF-8';
  res.send(gameState); // send JSON
} );

// https://...../move?turn=X&pos=4
app.get('/move', (req, res) => {
  res.charset = 'UTF-8';
  var turn = req.query.turn;
  var pos = req.query.pos;
  // 승리조건이 이미 만족되었는지 검사해 에러처리
  if (wins('X')) {
    res.send('ERROR X가 이미 이겼습니다.');
    return;
  }
  if (wins('O')) {
    res.send('ERROR O가 이미 이겼습니다.');
    return;
  }

  // 비어있지 않은지 검사해서 에러 처리
  if (gameState.squares[pos] != '') {
    res.send('ERROR 빈칸이 아닙니다.');
    return;
  }
  // Ok 조건 검사
  if ( gameState.isXnext ? (turn == 'X') : (turn == 'O') ) {
       // (gameState.isXnext && turn == 'X') ||
       // (!gameState.isXnext && turn == 'O') ) {
    console.log('move: '+turn+pos);
    gameState.squares[pos] = turn;
    gameState.isXnext = !gameState.isXnext;
    gameState.winner = calcWinner();
    res.send('OK');
  } else {
    res.send('ERROR '+(gameState.isXnext?'X':'O')+' 차례입니다.');
  }

} );

app.get('/', (req, res) => {
  res.charset = 'UTF-8';
  res.send('GET으로 넘어온 name은 '+ req.query.name + '입니다.');
} );

app.post('/', (req, res) => {
  res.charset = 'UTF-8';
  res.send('POST로 넘어온 name은 '+ req.body.name + '입니다.');
} );

app.listen(8080, () => console.log('Example app listening on port 8080!'));
