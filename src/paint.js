const cols = 20;
const rows = cols*1.5;

const tileDimensions = [32,16];

let $scratchpad;

let offset = [0,0]

let mousedown = false;
let mousedrag = false;
let mousedragOrigin = [0,0];
let cursorAt = [0,0];
let scale = 2;

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

const getScratchpadAndContext = () => {
	if(!$scratchpad) {
		$scratchpad = document.createElement('canvas');
	}
	return [$scratchpad,$scratchpad.getContext('2d')];
}

const filter = (img,filter=false) => {

	if(filter === false) {
		return img;
	}

	let w, h, $canvas, ctx;

	[w, h] = [img.naturalWidth,img.naturalHeight];
    [$canvas, ctx] = getScratchpadAndContext();

	$canvas.width = w;
	$canvas.height = h;

    ctx.drawImage(img,0,0);

    let imgdata = ctx.getImageData(0,0,w,h) ;
    let rgba = imgdata.data;

	for (var i = 0; i < rgba.length; i += 4) {
	  	var avg = (rgba[i] + rgba[i + 1] + rgba[i + 2]) / 3;
	  	rgba[i]     = avg; // red
	  	rgba[i + 1] = avg; // green
	  	rgba[i + 2] = avg; // blue
    }

	ctx.putImageData(imgdata,0,0);
	let returnable = new Image();
	returnable.src = $canvas.toDataURL('image/png');
	return returnable;

}

export const paint = ($canvas,{store={}}={}) => {

	const ctx = $canvas.getContext('2d');

	ctx.canvas.width  = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	ctx.font = "8px Verdana";
	ctx.scale(scale, scale);
	ctx.imageSmoothingEnabled = false;

	$canvas.addEventListener('mousedown',ev=>{
	    mousedown = true;
	    mousedragOrigin = cursorAt;

		let tile = getTileFromPixels(...cursorAt);
		$canvas.dispatchEvent(new CustomEvent('unitclick',{
			detail: {
				tile: tile,
				item: store.items.filter(item => (item.position[0] === tile[0] && item.position[1] === tile[1]))[0],
			}
		}));
	});
	$canvas.addEventListener('mouseup',ev=>{
	    mousedown = false;
	});
	$canvas.addEventListener('mousemove',ev=>{
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

	    ctx.clearRect(0, 0, $canvas.width, $canvas.height);

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
				filter(imageList[item.type],item.state.goodsDepleted.size > 0),
				...getPixelsFromTile(item.position[0],item.position[1],imageList[item.type].naturalHeight)
			)
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
