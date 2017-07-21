import { MONEY, DONUT } from 'resources.js'

import $ from 'jquery';
import Factory from './objects/factory';
import Store from './objects/store';
import Bank from './objects/bank';

import './styles/index.scss'

const $canvas = $('#app');

const store = {
    items: []
};

const redraw = () => {

    store.items.map(item => {

        let $item = $canvas.find('#'+item.uuid);

        if ($item.length < 1) {
            $item = $(`
                <div id="${item.uuid}"" class="object ${item.type}"></div>
            `)
            $item.on('click',()=>{console.log(item)})
            $canvas.append($item);
        }
        item.onUnitCompleted = unit => {
            $item.append($(`<div class='money'></div>`));
        };
        item.onSourceDepleted = unit => {
            $item.addClass('depleted');
        };
        item.onSourceReplenished = unit => {
            $item.removeClass('depleted');
        };

    })

    let donutsTotal = store.items.reduce((sum,item)=>{
        return sum + item.goods.DONUT
    },0);
    $('#donuts').text(donutsTotal.toFixed(2) + ' donuts');

    let moneyTotal = store.items.reduce((sum,item)=>{
        return sum + item.goods.MONEY
    },0);
    $('#money').text(moneyTotal.toFixed(2) + '$');
}

const addDonut = () => {

    let factory = new Factory();

    store.items.map(item => {
        factory.attach(item);
    });

    store.items = [...store.items, factory];
    redraw();
}
const addStore = () => {
    store.items = [...store.items, new Store()];
    redraw();
}
const addBank = () => {
    store.items = [...store.items, new Bank()];
    redraw();
}

setInterval(redraw,1000);

window.store = store;

$('#addDonut').on('click',()=>addDonut());
$('#addStore').on('click',()=>addStore());
$('#addBank').on('click',()=>addBank());
$('#redraw').on('click',()=>redraw());


const $img = $(`<img src=${require('images/floor.png')}>`);
const $cursor = $(`<img src=${require('images/cursor.png')}>`);
const $factory = $(`<img src=${require('images/factory.png')}>`);

$('body').append($img).append($cursor);

$img.on('load',()=>{
    var canvas = document.getElementById('play');
    var ctx = canvas.getContext('2d');

    let scale = 2;

    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    ctx.font = "8px Verdana";
    ctx.scale(scale, scale);
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    const cols = 20;
    const rows = cols*1.5;

    const tileDimensions = [32,16]

    let offset = [0,0]

    let mousedown = false;
    let mousedrag = false;
    let mousedragOrigin = [0,0];
    let cursorAt = [0,0];

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

    const draw = () => {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // floor pass
        for(let yIndex=0;yIndex < rows;yIndex++) {
            for(let xIndex=0;xIndex < cols;xIndex++) {
                let tilePosAt = getPixelsFromTile(xIndex,yIndex);
                ctx.drawImage(
                    $img[0],tilePosAt[0],tilePosAt[1]
                );
            }
        }

        // cursor pass
        const cursorPosAt = getPixelsFromTile(...getTileFromPixels(...cursorAt));

        ctx.drawImage(
            $cursor[0],cursorPosAt[0],cursorPosAt[1]
        );

        // store pass
        store.items.map((item,index) => {
            ctx.drawImage(
                $factory[0],...getPixelsFromTile(index,index,32)
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



})
