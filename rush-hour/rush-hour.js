const canvas = document.getElementById('rushHourCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 6;
const cellSize = canvas.width / gridSize;
let cars = [
  { x: 0, y: 2, len: 2, dir: 'h', color: '#e53935', main: true }, // Red car
  { x: 0, y: 0, len: 3, dir: 'v', color: '#43a047' },
  { x: 2, y: 0, len: 2, dir: 'v', color: '#1e88e5' },
  { x: 4, y: 0, len: 2, dir: 'v', color: '#fbc02d' },
  { x: 1, y: 3, len: 2, dir: 'h', color: '#ff9800' },
  { x: 3, y: 4, len: 3, dir: 'h', color: '#8e24aa' }
];
let selected = null, offset = null;

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // Draw grid
  ctx.strokeStyle = '#bbb';
  for(let i=0;i<=gridSize;i++){
    ctx.beginPath();
    ctx.moveTo(i*cellSize,0);
    ctx.lineTo(i*cellSize,canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0,i*cellSize);
    ctx.lineTo(canvas.width,i*cellSize);
    ctx.stroke();
  }
  // Draw exit
  ctx.fillStyle = '#cfd8dc';
  ctx.fillRect(canvas.width-8,cellSize*2,8,cellSize);
  // Draw cars
  cars.forEach((car,i)=>{
    ctx.fillStyle = car.color;
    ctx.strokeStyle = car.main ? '#fff' : '#222';
    ctx.lineWidth = car.main ? 4 : 2;
    let x = car.x*cellSize, y = car.y*cellSize;
    let w = car.dir==='h'?car.len*cellSize:cellSize;
    let h = car.dir==='v'?car.len*cellSize:cellSize;
    ctx.beginPath();
    ctx.roundRect(x+4,y+4,w-8,h-8,12);
    ctx.fill();
    ctx.stroke();
    if(selected===i){
      ctx.save();
      ctx.globalAlpha=0.5;
      ctx.fillStyle='#fff';
      ctx.fillRect(x,y,w,h);
      ctx.restore();
    }
  });
}

function getCarAt(x,y){
  for(let i=cars.length-1;i>=0;i--){
    let car=cars[i];
    let cx=car.x,cy=car.y;
    let w=car.dir==='h'?car.len:1;
    let h=car.dir==='v'?car.len:1;
    if(x>=cx&&x<cx+w&&y>=cy&&y<cy+h)return i;
  }
  return null;
}

canvas.addEventListener('touchstart',e=>{
  const rect=canvas.getBoundingClientRect();
  const x=Math.floor((e.touches[0].clientX-rect.left)/cellSize);
  const y=Math.floor((e.touches[0].clientY-rect.top)/cellSize);
  selected=getCarAt(x,y);
  if(selected!==null){
    offset={x:x-cars[selected].x,y:y-cars[selected].y};
  }
});
canvas.addEventListener('touchmove',e=>{
  if(selected===null)return;
  const rect=canvas.getBoundingClientRect();
  const x=Math.floor((e.touches[0].clientX-rect.left)/cellSize)-offset.x;
  const y=Math.floor((e.touches[0].clientY-rect.top)/cellSize)-offset.y;
  let car=cars[selected];
  let oldX=car.x,oldY=car.y;
  if(car.dir==='h'){
    car.x=Math.max(0,Math.min(gridSize-car.len,x));
    // Check collision
    for(let i=0;i<cars.length;i++)if(i!==selected){
      let c=cars[i];
      if(c.dir==='h'&&c.y===car.y&&c.x<c.x+c.len&&c.x+c.len>car.x){car.x=oldX;break;}
      if(c.dir==='v'){
        for(let k=0;k<c.len;k++){
          if(c.x>=car.x&&c.x<car.x+car.len&&c.y+k===car.y){car.x=oldX;break;}
        }
      }
    }
  }else{
    car.y=Math.max(0,Math.min(gridSize-car.len,y));
    for(let i=0;i<cars.length;i++)if(i!==selected){
      let c=cars[i];
      if(c.dir==='v'&&c.x===car.x&&c.y<c.y+c.len&&c.y+c.len>car.y){car.y=oldY;break;}
      if(c.dir==='h'){
        for(let k=0;k<c.len;k++){
          if(c.y>=car.y&&c.y<car.y+car.len&&c.x+k===car.x){car.y=oldY;break;}
        }
      }
    }
  }
  draw();
});
canvas.addEventListener('touchend',()=>{
  if(selected!==null){
    // Win condition: red car at exit
    if(cars[selected].main&&cars[selected].x+cars[selected].len===gridSize){
      setTimeout(()=>alert('You Win!'),100);
    }
  }
  selected=null;offset=null;draw();
});
draw();
