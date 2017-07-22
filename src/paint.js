const cols = 20;
const rows = cols*1.5;

const tileDimensions = [32,16]

let offset = [0,0]

let mousedown = false;
let mousedrag = false;
let mousedragOrigin = [0,0];
let cursorAt = [0,0];
let scale = 2;

var grayscale = function() {
  for (var i = 0; i < data.length; i += 4) {
	var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
	data[i]     = avg; // red
	data[i + 1] = avg; // green
	data[i + 2] = avg; // blue
  }
  ctx.putImageData(imageData, 0, 0);
};

const imageList = (()=>{
    let rt = {};
    [
        'floor','cursor',
        'factory','store','bank'
    ].map(image => {
        rt[image] = new Image();
        rt[image].src = require(`images/${image}.png`)
    });
    return rt;
})();

const getPixelsFromTile = (x,y,height=tileDimensions[1]) => {
	return [
		tileDimensions[0]*x + (tileDimensions[0]*(rows-y)/2) + offset[0],
		tileDimensions[1]*(y/2) + offset[1] - (height*1.5-tileDimensions[1]*1.5)
	]
}

const getTileFromPixels = (x,y) => {

	x = x - offset[0];
	y = y - offset[1];

	y = y / (tileDimensions[1]/2);

	x = x + (tileDimensions[0]/2*((rows-y)*-1))
	x = x / (tileDimensions[0]);

	x = x - .33;
	y = y - .25;

	x = Math.floor(x);
	y = Math.floor(y);

	return [x,y];
}

export const paint = (canvas,{store={}}={}) => {

	const ctx = canvas.getContext('2d');

	ctx.canvas.width  = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	ctx.font = "8px Verdana";
	ctx.scale(scale, scale);
	ctx.imageSmoothingEnabled = false;

	canvas.addEventListener('mousedown',ev=>{
	    mousedown = true;
	    mousedragOrigin = cursorAt;
	});
	canvas.addEventListener('mouseup',ev=>{
	    mousedown = false;
	});
	canvas.addEventListener('mousemove',ev=>{
	    cursorAt = [ev.x/scale,ev.y/scale];
	    if(mousedown) {
	        offset = [
	            offset[0]+cursorAt[0]-mousedragOrigin[0],
	            offset[1]+cursorAt[1]-mousedragOrigin[1]
	        ];
	        mousedragOrigin = cursorAt;
	    }
	});

	const draw = () => {

	    ctx.clearRect(0, 0, canvas.width, canvas.height);

	    // floor pass
	    for(let yIndex=0;yIndex < rows;yIndex++) {
	        for(let xIndex=0;xIndex < cols;xIndex++) {
	            let tilePosAt = getPixelsFromTile(xIndex,yIndex);
	            ctx.drawImage(
	                imageList.floor,tilePosAt[0],tilePosAt[1]
	            );
	        }
	    }

	    // cursor pass
	    let cursorPosAt = getPixelsFromTile(...getTileFromPixels(...cursorAt));
	    ctx.drawImage(
	        imageList.cursor,cursorPosAt[0],cursorPosAt[1]
	    );

	    // store pass
	    store.items.map((item,index) => {
	        ctx.drawImage(
	            imageList[item.type],...getPixelsFromTile(index,index,32)
	        );
	    });
	};

	const drawLoop = () => {
	    requestAnimationFrame(()=>{
	        draw();
	        drawLoop();
	    })
	}

	drawLoop();

}
