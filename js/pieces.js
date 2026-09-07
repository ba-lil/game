const SHAPES = [
  [{q:0,r:0}],
  [{q:0,r:0},{q:1,r:0}],
  [{q:0,r:0},{q:1,r:0},{q:2,r:0}],
  [{q:0,r:0},{q:0,r:1},{q:1,r:0}],
  [{q:0,r:0},{q:1,r:0},{q:0,r:1},{q:1,r:1}],
  [{q:0,r:0},{q:1,r:0},{q:2,r:0},{q:1,r:-1}],
  [{q:0,r:0},{q:0,r:1},{q:0,r:2},{q:1,r:1}],
  [{q:0,r:0},{q:1,r:0},{q:1,r:1},{q:2,r:1}],
  [{q:0,r:0},{q:1,r:0},{q:2,r:0},{q:0,r:1},{q:0,r:2}],
  [{q:0,r:0},{q:1,r:-1},{q:1,r:0},{q:2,r:-1},{q:2,r:0}]
];

export function randomPiece(colors) {
  const shape = SHAPES[Math.floor(Math.random()*SHAPES.length)].map(p=>({...p}));
  const color = colors[Math.floor(Math.random()*colors.length)];
  return {shape,color,id:crypto.randomUUID?.() || String(Math.random())};
}
