import {initTelegram} from "./telegram.js";
import {loadState,saveState} from "./storage.js";
import {UI} from "./ui.js";
import {Game} from "./game.js";

const tg=initTelegram();
const state=loadState();
const ui=new UI(tg,state);
const game=new Game(ui);
ui.setGame(game);
ui.uiSave=()=>saveState(state);

const soundBtn=document.querySelector("#soundBtn");
function refreshSound(){soundBtn.textContent=state.sound?"🔊":"🔇"}
refreshSound();

soundBtn.addEventListener("click",()=>{
  state.sound=!state.sound;
  refreshSound();
  saveState(state);
});

document.querySelector("#newGameBtn").addEventListener("click",()=>{
  game.reset(); saveState(state);
});
document.querySelector("#restartBtn").addEventListener("click",()=>{
  game.reset(); saveState(state);
});

window.addEventListener("resize",()=>ui.renderBoard(game.cells));

document.addEventListener("pointermove",e=>{
  if(ui.drag) ui.showPreview(e.clientX,e.clientY,ui.drag.index);
});
document.addEventListener("pointerup",()=>{
  if(ui.drag) { ui.clearPreview(); ui.drag=null; }
});

ui.bestEl.textContent=state.best||0;
