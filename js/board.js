import { CONFIG } from "./config.js";

const dirs = [
  [1,0], [0,1], [-1,1], [-1,0], [0,-1], [1,-1]
];

export function makeBoard() {
  const cells = new Map();
  const R = CONFIG.boardRadius;
  for (let q=-R;q<=R;q++) {
    for (let r=-R;r<=R;r++) {
      const s = -q-r;
      if (Math.max(Math.abs(q),Math.abs(r),Math.abs(s)) <= R) {
        cells.set(key(q,r), {q,r,filled:false,color:null,el:null});
      }
    }
  }
  return cells;
}

export const key = (q,r) => `${q},${r}`;

export function axialToPixel(q,r,size) {
  const x = size * Math.sqrt(3) * (q + r/2);
  const y = size * 1.5 * r;
  return {x,y};
}

export function getLines(cells) {
  const R = CONFIG.boardRadius;
  const lines = [];
  for (let q=-R;q<=R;q++) lines.push([...cells.values()].filter(c=>c.q===q));
  for (let r=-R;r<=R;r++) lines.push([...cells.values()].filter(c=>c.r===r));
  for (let s=-R;s<=R;s++) lines.push([...cells.values()].filter(c=>-c.q-c.r===s));
  return lines;
}

export function getNeighbors(q,r) {
  return dirs.map(([dq,dr])=>key(q+dq,r+dr));
}

export function canPlace(cells, shape, anchorQ, anchorR) {
  for (const p of shape) {
    const k = key(anchorQ+p.q, anchorR+p.r);
    const c = cells.get(k);
    if (!c || c.filled) return false;
  }
  return true;
}

export function place(cells, shape, anchorQ, anchorR, color) {
  for (const p of shape) {
    const c = cells.get(key(anchorQ+p.q,anchorR+p.r));
    if (c) { c.filled=true; c.color=color; }
  }
}

export function clearCompleted(cells) {
  const full = getLines(cells).filter(line => line.every(c=>c.filled));
  const unique = new Map();
  full.flat().forEach(c=>unique.set(key(c.q,c.r),c));
  unique.forEach(c=>{c.filled=false;c.color=null});
  return {count:full.length,cells:[...unique.values()]};
}
