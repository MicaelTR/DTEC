// ================== ELEMENTOS ==================
const boardEl = document.getElementById('board');
const turnEl = document.getElementById('turnIndicator');
const estadoEl = document.getElementById('estado');
const btnReset = document.getElementById('reset');
const capBlackEl = document.getElementById('capturedBlack');
const capWhiteEl = document.getElementById('capturedWhite');

// ================== PEÇAS E TABULEIRO ==================
const pieces = {
  'P':'♙','R':'♖','N':'♘','B':'♗','Q':'♕','K':'♔',
  'p':'♟','r':'♜','n':'♞','b':'♝','q':'♛','k':'♚'
};

const initialSetup = [
  ["r","n","b","q","k","b","n","r"],
  ["p","p","p","p","p","p","p","p"],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  ["P","P","P","P","P","P","P","P"],
  ["R","N","B","Q","K","B","N","R"]
];

let board = [];
let selected = null;
let turn = 'w';
let stateText = 'Jogando';
let captured = { w: [], b: [] };
let pendingPromotion = null; 
let lastLegalMoves = [];

// ================== BOT ==================
let gameMode = null;       // '2p' ou 'bot'
let botDifficulty = null;  // 'easy', 'medium', 'hard'
let botColor = 'b';        // bot joga de pretas

function showBotOptions() {
  document.getElementById("bot-options").classList.remove("hidden");
}

function startGame(mode, difficulty = null) {
  gameMode = mode;
  botDifficulty = difficulty;
  document.getElementById("menu").style.display = "none";
  document.getElementById("gameContainer").style.display = "flex";
  resetBoard();
}

function botMove(difficulty) {
  let allMoves = [];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.color === botColor) {
        const moves = getMoves(r, c, piece);
        for (const move of moves) {
          if (isLegalMove(r, c, move[0], move[1], botColor)) {
            allMoves.push({ from: [r, c], to: move });
          }
        }
      }
    }
  }

  if (allMoves.length === 0) return;

  let choice;
  switch (difficulty) {
    case "easy":
      choice = allMoves[Math.floor(Math.random() * allMoves.length)];
      break;
    case "medium":
      choice = chooseBestCapture(allMoves);
      if (!choice) choice = allMoves[Math.floor(Math.random() * allMoves.length)];
      break;
    case "hard":
      choice = chooseBestCapture(allMoves); // futuramente minimax
      break;
  }

  if (!choice) choice = allMoves[Math.floor(Math.random() * allMoves.length)];

  doMove(choice.from[0], choice.from[1], choice.to[0], choice.to[1]);
}

function chooseBestCapture(moves) {
  let best = null;
  let bestValue = -Infinity;
  for (const m of moves) {
    const target = board[m.to[0]][m.to[1]];
    const value = target ? getPieceValue(target.type) : 0;
    if (value > bestValue) {
      bestValue = value;
      best = m;
    }
  }
  return best;
}

function getPieceValue(type) {
  switch (type.toLowerCase()) {
    case "p": return 1;
    case "n": return 3;
    case "b": return 3;
    case "r": return 5;
    case "q": return 9;
    case "k": return 100;
    default: return 0;
  }
}

// ================== FUNÇÕES DO JOGO ==================
function resetBoard(){
  board = initialSetup.map(r=>r.slice()).map(row=>row.map(v=>{
    if(!v) return null;
    return { type:v.toLowerCase(), color:(v===v.toUpperCase()?'w':'b') };
  }));
  selected=null; turn='w'; stateText='Jogando';
  captured={w:[],b:[]};
  lastLegalMoves = [];
  document.getElementById('endMessage').classList.remove('active');
  render();
}

function render(){
  boardEl.innerHTML='';
  for(let r=0;r<8;r++){
    for(let c=0;c<8;c++){
      const sq=document.createElement('div');
      sq.classList.add('square',(r+c)%2===0?'light':'dark');
      const piece=board[r][c];
      if(piece){
        const el=document.createElement('div');
        el.classList.add('peca',piece.color==='w'?'white':'black');
        const glyphKey=(piece.color==='w')?piece.type.toUpperCase():piece.type;
        el.textContent=pieces[glyphKey];
        sq.appendChild(el);
      }
      if(selected && selected.r===r && selected.c===c) sq.classList.add('selected');
      if(isMoveOption(r,c)) sq.classList.add('moveOption');
      if(board[r][c] && board[r][c].type==='k'){
        if(isKingInCheck(board[r][c].color)) sq.classList.add('inCheck');
      }
      sq.addEventListener('click',()=>handleClick(r,c));
      boardEl.appendChild(sq);
    }
  }
  turnEl.textContent=`Vez: ${turn==='w'?'Brancas':'Pretas'}`;
  estadoEl.textContent=stateText;
  renderCaptured();
}

function renderCaptured(){
  capBlackEl.innerHTML=''; capWhiteEl.innerHTML='';
  captured.b.forEach(t=>{ const d=document.createElement('div'); d.className='mini'; d.textContent=pieces[t]; capBlackEl.appendChild(d); });
  captured.w.forEach(t=>{ const d=document.createElement('div'); d.className='mini'; d.textContent=pieces[t.toUpperCase()]; capWhiteEl.appendChild(d); });
}

function handleClick(r,c){
  const piece=board[r][c];
  if(selected){
    if(selected.r===r && selected.c===c){ selected=null; lastLegalMoves=[]; render(); return; }
    if(isMoveOption(r,c)){ doMove(selected.r,selected.c,r,c); selected=null; lastLegalMoves=[]; render(); return; }
    if(piece && piece.color===turn){ selected={r,c}; computeLegalMoves(selected.r,selected.c); render(); return; }
  } else if(piece && piece.color===turn){ selected={r,c}; computeLegalMoves(selected.r,selected.c); render(); }
}

function isMoveOption(r,c){
  if(!selected) return false;
  return lastLegalMoves.some(m=>m[0]===r && m[1]===c);
}

function doMove(r1,c1,r2,c2){
  const mover=board[r1][c1];
  const target=board[r2][c2];
  if(target){ if(target.color==='b') captured.b.push(target.type); else captured.w.push(target.type); }
  board[r2][c2]=mover; board[r1][c1]=null;

  if(mover.type==='p' && ((mover.color==='w' && r2===0)||(mover.color==='b' && r2===7))){
    pendingPromotion={r:r2,c:c2,color:mover.color};
    openPromotionMenu(mover.color);
    return;
  }

  turn=(turn==='w')?'b':'w';
  updateGameStateAfterMove();
  render();

  if (gameMode === "bot" && turn === botColor) {
    setTimeout(() => botMove(botDifficulty), 500);
  }
}

function openPromotionMenu(color){
  const menu=document.getElementById('promotionMenu');
  const opts=document.getElementById('promotionOptions');
  opts.innerHTML='';
  const choices=color==='w'?[['Q','♕'],['R','♖'],['B','♗'],['N','♘']] : [['q','♛'],['r','♜'],['b','♝'],['n','♞']];
  for(const [type,symbol] of choices){
    const btn=document.createElement('button');
    btn.textContent=symbol;
    btn.addEventListener('click',()=>choosePromotion(type));
    opts.appendChild(btn);
  }
  menu.classList.add('active');
}

function choosePromotion(type){
  if(pendingPromotion){
    const {r,c}=pendingPromotion;
    board[r][c].type=type.toLowerCase();
    pendingPromotion=null;
    document.getElementById('promotionMenu').classList.remove('active');
    turn=(turn==='w')?'b':'w';
    updateGameStateAfterMove();
    render();

    if (gameMode === "bot" && turn === botColor) {
      setTimeout(() => botMove(botDifficulty), 500);
    }
  }
}

// ================== MOVIMENTOS ==================
function getMoves(r,c,p){ return getMovesOnBoard(board,r,c,p); }

function getMovesOnBoard(b,r,c,p){
  const moves=[]; const inB = (rr,cc)=> rr>=0 && rr<8 && cc>=0 && cc<8;
  const dir=p.color==='w'?-1:1;

  if(p.type==='p'){
    const fr=r+dir;
    if(inB(fr,c) && !b[fr][c]) moves.push([fr,c]);
    if((p.color==='w'&&r===6)||(p.color==='b'&&r===1)){
      const fr2=r+dir*2;
      if(inB(fr2,c) && !b[fr][c] && !b[fr2][c]) moves.push([fr2,c]);
    }
    for(const dc of [-1,1]){
      const rr=r+dir,cc=c+dc;
      if(inB(rr,cc) && b[rr][cc] && b[rr][cc].color!==p.color) moves.push([rr,cc]);
    }
  }

  if(p.type==='r'||p.type==='q') moves.push(...slideOnBoard(b,r,c,p,[[1,0],[-1,0],[0,1],[0,-1]]));
  if(p.type==='b'||p.type==='q') moves.push(...slideOnBoard(b,r,c,p,[[1,1],[1,-1],[-1,1],[-1,-1]]));
  if(p.type==='n'){
    const jumps=[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
    for(const [dr,dc] of jumps){ const rr=r+dr,cc=c+dc; if(inB(rr,cc)&&(!b[rr][cc]||b[rr][cc].color!==p.color)) moves.push([rr,cc]); }
  }
  if(p.type==='k'){
    for(const [dr,dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]){
      const rr=r+dr,cc=c+dc; if(inB(rr,cc)&&(!b[rr][cc]||b[rr][cc].color!==p.color)) moves.push([rr,cc]);
    }
  }
  return moves;
}

function getAttacksOnBoard(b,r,c,p){
  const attacks=[]; const inB = (rr,cc)=> rr>=0 && rr<8 && cc>=0 && cc<8;
  const dir=p.color==='w'?-1:1;

  if(p.type==='p'){ for(const dc of [-1,1]){ const rr=r+dir,cc=c+dc; if(inB(rr,cc)) attacks.push([rr,cc]); } return attacks; }
  if(p.type==='r'||p.type==='q') attacks.push(...slideAttacksOnBoard(b,r,c,p,[[1,0],[-1,0],[0,1],[0,-1]]));
  if(p.type==='b'||p.type==='q') attacks.push(...slideAttacksOnBoard(b,r,c,p,[[1,1],[1,-1],[-1,1],[-1,-1]]));
  if(p.type==='n'){ const jumps=[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]; for(const [dr,dc] of jumps){ const rr=r+dr,cc=c+dc; if(inB(rr,cc)) attacks.push([rr,cc]); } return attacks; }
  if(p.type==='k'){ for(const [dr,dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]){ const rr=r+dr,cc=c+dc; if(inB(rr,cc)) attacks.push([rr,cc]); } return attacks; }
  return attacks;
}

function slideOnBoard(b,r,c,p,dirs){
  const res=[]; const inB = (rr,cc)=> rr>=0 && rr<8 && cc>=0 && cc<8;
  for(const [dr,dc] of dirs){ let rr=r+dr,cc=c+dc; while(inB(rr,cc)){ if(!b[rr][cc]) res.push([rr,cc]); else{ if(b[rr][cc].color!==p.color) res.push([rr,cc]); break; } rr+=dr; cc+=dc; } }
  return res;
}

function slideAttacksOnBoard(b,r,c,p,dirs){
  const res=[]; const inB = (rr,cc)=> rr>=0 && rr<8 && cc>=0 && cc<8;
  for(const [dr,dc] of dirs){ let rr=r+dr,cc=c+dc; while(inB(rr,cc)){ res.push([rr,cc]); if(b[rr][cc]) break; rr+=dr; cc+=dc; } }
  return res;
}

// ================== CHECK / CHECKMATE ==================
function findKing(color){ for(let r=0;r<8;r++) for(let c=0;c<8;c++){ const p=board[r][c]; if(p && p.type==='k' && p.color===color) return {r,c}; } return null; }

function isKingInCheck(color){
  const kingPos = findKing(color);
  if(!kingPos) return false;
  const oppColor = color==='w'?'b':'w';
  for(let r=0;r<8;r++) for(let c=0;c<8;c++){ const p=board[r][c]; if(!p||p.color!==oppColor) continue; const attacks=getAttacksOnBoard(board,r,c,p); for(const [mr,mc] of attacks) if(mr===kingPos.r && mc===kingPos.c) return true; }
  return false;
}

function cloneBoard(b){ return b.map(row=>row.map(cell=>cell?{type:cell.type,color:cell.color}:null)); }

function isLegalMove(r1,c1,r2,c2,color){
  const backup = cloneBoard(board);
  const mover = backup[r1][c1];
  if(!mover || mover.color!==color) return false;
  backup[r2][c2]=mover; backup[r1][c1]=null;
  let kingPos = null;
  for(let r=0;r<8;r++) for(let c=0;c<8;c++){ const p=backup[r][c]; if(p && p.type==='k' && p.color===color) { kingPos={r,c}; break; } }
  if(!kingPos) return false;
  const oppColor=color==='w'?'b':'w';
  for(let r=0;r<8;r++) for(let c=0;c<8;c++){ const p=backup[r][c]; if(!p||p.color!==oppColor) continue; const attacks=getAttacksOnBoard(backup,r,c,p); for(const [mr,mc] of attacks) if(mr===kingPos.r && mc===kingPos.c) return false; }
  return true;
}

function computeLegalMoves(r,c){
  lastLegalMoves = [];
  const p = board[r][c];
  if(!p) return;
  const moves = getMoves(r,c,p);
  for(const [mr,mc] of moves){ if(isLegalMove(r,c,mr,mc,p.color)) lastLegalMoves.push([mr,mc]); }
}

function hasAnyLegalMove(color){
  for(let r=0;r<8;r++) for(let c=0;c<8;c++){ const p=board[r][c]; if(!p||p.color!==color) continue; const moves=getMoves(r,c,p); for(const [mr,mc] of moves) if(isLegalMove(r,c,mr,mc,color)) return true; }
  return false;
}

function updateGameStateAfterMove(){
  const opp = turn;
  if(isKingInCheck(opp)){
    if(!hasAnyLegalMove(opp)){
      stateText = opp==='w'?'Xeque-mate — Pretas vencem':'Xeque-mate — Brancas vencem';
      document.getElementById('endMessage').classList.add('active');
      document.getElementById('endText').textContent = stateText;
    } else { stateText = 'Xeque'; }
  } else {
    if(!hasAnyLegalMove(opp)){
      stateText = 'Empate por afogamento (stalemate)';
      document.getElementById('endMessage').classList.add('active');
      document.getElementById('endText').textContent = stateText;
    } else { stateText = 'Jogando'; }
  }
}

// ================== EVENTOS ==================
btnReset.addEventListener('click',()=>resetBoard());
resetBoard();
