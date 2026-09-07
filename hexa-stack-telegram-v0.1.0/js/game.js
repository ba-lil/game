import {CONFIG} from "./config.js";
import {makeBoard,axialToPixel,key,canPlace,place,clearCompleted} from "./board.js";
import {randomPiece} from "./pieces.js";

export class Game {
  constructor(ui) {
    this.ui=ui;
    this.reset();
  }

  reset() {
    this.cells=makeBoard();
    this.score=0; this.combo=0; this.over=false;
    this.pieces=[randomPiece(CONFIG.colors),randomPiece(CONFIG.colors),randomPiece(CONFIG.colors)];
    this.ui.renderBoard(this.cells);
    this.ui.renderTray(this.pieces);
    this.ui.updateStats(this.score,this.combo);
    this.ui.hideGameOver();
  }

  tryPlace(pieceIndex,q,r) {
    if(this.over) return false;
    const piece=this.pieces[pieceIndex];
    if(!piece || !canPlace(this.cells,piece.shape,q,r)) return false;

    place(this.cells,piece.shape,q,r,piece.color);
    this.score += piece.shape.length*CONFIG.scorePerCell;
    const cleared=clearCompleted(this.cells);

    if(cleared.count>0) {
      this.combo++;
      this.score += cleared.count*CONFIG.lineBonus + Math.max(0,this.combo-1)*CONFIG.comboBonus;
      this.ui.animateClear(cleared.cells);
    } else {
      this.combo=0;
    }

    this.pieces[pieceIndex]=randomPiece(CONFIG.colors);
    this.ui.renderBoard(this.cells);
    this.ui.renderTray(this.pieces);
    this.ui.updateStats(this.score,this.combo);
    return true;
  }

  hasAnyMove() {
    for(let i=0;i<this.pieces.length;i++){
      const p=this.pieces[i];
      for(const c of this.cells.values()){
        if(canPlace(this.cells,p.shape,c.q,c.r)) return true;
      }
    }
    return false;
  }

  checkGameOver() {
    if(!this.hasAnyMove()){
      this.over=true;
      this.ui.showGameOver(this.score);
    }
  }
}
