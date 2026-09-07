import {axialToPixel,key} from "./board.js";
import {haptic} from "./telegram.js";
import {beep} from "./audio.js";

export class UI {
  constructor(tg,state) {
    this.tg=tg; this.state=state;
    this.boardEl=document.querySelector("#board");
    this.trayEl=document.querySelector("#tray");
    this.scoreEl=document.querySelector("#score");
    this.bestEl=document.querySelector("#best");
    this.comboEl=document.querySelector("#combo");
    this.message=document.querySelector("#message");
    this.drag=null;
  }

  updateStats(score,combo){
    this.scoreEl.textContent=score;
    this.bestEl.textContent=Math.max(score,this.state.best||0);
    this.comboEl.textContent=`x${combo}`;
  }

  boardMetrics(){
    const rect=this.boardEl.getBoundingClientRect();
    const R=4;
    const size=Math.min(22, (rect.width*.86)/(Math.sqrt(3)*(R*2+1)));
    return {rect,size};
  }

  renderBoard(cells){
    this.boardEl.innerHTML="";
    const {rect,size}=this.boardMetrics();
    let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
    const pos=new Map();
    for(const c of cells.values()){
      const p=axialToPixel(c.q,c.r,size);
      pos.set(key(c.q,c.r),p);
      minX=Math.min(minX,p.x);maxX=Math.max(maxX,p.x);
      minY=Math.min(minY,p.y);maxY=Math.max(maxY,p.y);
    }
    const cx=(minX+maxX)/2, cy=(minY+maxY)/2;
    for(const c of cells.values()){
      const p=pos.get(key(c.q,c.r));
      const el=document.createElement("div");
      el.className="hex"+(c.filled?" filled":"");
      if(c.filled) el.style.setProperty("--tile",c.color);
      el.style.left=`calc(50% + ${p.x-cx}px)`;
      el.style.top=`calc(50% + ${p.y-cy}px)`;
      el.dataset.q=c.q; el.dataset.r=c.r;
      el.addEventListener("pointerup",()=>this.dropOnCell(+el.dataset.q,+el.dataset.r));
      this.boardEl.appendChild(el);
      c.el=el;
    }
  }

  renderTray(pieces){
    this.trayEl.innerHTML="";
    pieces.forEach((p,i)=>{
      const slot=document.createElement("div"); slot.className="piece-slot";
      const el=document.createElement("div"); el.className="piece"; el.dataset.index=i;
      const coords=p.shape;
      const minQ=Math.min(...coords.map(x=>x.q)), maxQ=Math.max(...coords.map(x=>x.q));
      const minR=Math.min(...coords.map(x=>x.r)), maxR=Math.max(...coords.map(x=>x.r));
      const size=18, ox=(minQ+maxQ)*size*.866, oy=(minR+maxR)*size*.65;
      coords.forEach(c=>{
        const h=document.createElement("div");h.className="mini-hex";
        h.style.setProperty("--tile",p.color);
        h.style.left=`calc(50% + ${(c.q*size*1.732+c.r*size*.866)-ox}px)`;
        h.style.top=`calc(50% + ${(c.r*size*1.5)-oy}px)`;
        el.appendChild(h);
      });
      el.addEventListener("pointerdown",e=>this.startDrag(e,i));
      slot.appendChild(el);this.trayEl.appendChild(slot);
    });
  }

  startDrag(e,index){
    e.preventDefault();
    const piece=this.uiGame?.pieces?.[index];
    this.drag={index,pointerId:e.pointerId};
    e.currentTarget.setPointerCapture?.(e.pointerId);
    this.showPreview(e.clientX,e.clientY,index);
  }

  setGame(game){this.uiGame=game}

  showPreview(x,y,index){
    if(!this.uiGame) return;
    const board=this.boardEl.getBoundingClientRect();
    if(x<board.left||x>board.right||y<board.top||y>board.bottom)return;
    const size=this.boardMetrics().size;
    const q=Math.round(((x-board.left-board.width/2)/(Math.sqrt(3)*size)));
    const r=Math.round(((y-board.top-board.height/2)/(1.5*size)));
    this.clearPreview();
    const p=this.uiGame.pieces[index];
    for(const c of p.shape){
      const el=this.uiGame.cells.get(key(q+c.q,r+c.r))?.el;
      if(el) el.classList.add("preview");
    }
  }

  clearPreview(){this.boardEl.querySelectorAll(".preview").forEach(e=>e.classList.remove("preview"))}

  dropOnCell(q,r){
    if(!this.drag||!this.uiGame)return;
    const i=this.drag.index;
    this.clearPreview();
    const ok=this.uiGame.tryPlace(i,q,r);
    if(ok){beep(this.state.sound,650,.07);haptic(this.tg,"light");setTimeout(()=>this.uiGame.checkGameOver(),80)}
    else {beep(this.state.sound,150,.08,"square");haptic(this.tg,"rigid")}
    this.drag=null;
  }

  animateClear(cells){
    cells.forEach(c=>c.el?.classList.add("pop"));
    beep(this.state.sound,880,.12);
    haptic(this.tg,"medium");
  }

  showGameOver(score){
    if(score>(this.state.best||0)){
      this.state.best=score;
      this.bestEl.textContent=score;
      this.uiSave?.();
    }
    document.querySelector("#messageTitle").textContent="GAME OVER";
    document.querySelector("#messageText").textContent=`Score: ${score}`;
    this.message.classList.remove("hidden");
    haptic(this.tg,"heavy");
  }
  hideGameOver(){this.message.classList.add("hidden")}
  uiSave=null;
}
