import { MONEY, DONUT } from 'resources'
import { setupCanvas, drawLoop } from 'paint'

import Factory from 'objects/factory';
import Store from 'objects/store';
import Bank from 'objects/bank';

import 'assets/styles/index.scss'

const $canvas = document.getElementById('play');

const store = {
    items: []
};

let lastClickAtItem = null;
let lastClickAtTile = [0,0];
let draggablePlaceholder = {}

const redraw = () => {

    let donutsTotal = store.items.reduce((sum,item)=>{
        return sum + item.goods.DONUT
    },0);
    document.querySelector('#donuts').textContent = donutsTotal.toFixed(2) + ' donuts'

    let moneyTotal = store.items.reduce((sum,item)=>{
        return sum + item.goods.MONEY
    },0);
    document.querySelector('#money').textContent = moneyTotal.toFixed(2) + '$'

    if(lastClickAtItem) {
        document.querySelector('.window-contents').innerHTML =
        `
        <div class="window-area">
            ${lastClickAtItem.name}
        </div>
        <div class="window-area">
        <dl>
            ${Object.keys(lastClickAtItem.converts).map(key => (
                `
                <dt>Makes:</dt>
                <dd>${lastClickAtItem.converts[key].to}</dd>
                <dt>Needs:</dt>
                <dd>
                    ${lastClickAtItem.converts[key].from}
                </dd>
                ${
                    lastClickAtItem.state.goodsDepleted.has(lastClickAtItem.converts[key].from) ?
                        `!!Missing ${lastClickAtItem.converts[key].from}!!`:''
                }
                `
            )).join('')}
        </dl>
        </div>
        <div class="window-area">
            <dl>
                ${Object.keys(lastClickAtItem.goods).map(key => (
                    `
                    <dt>${key}:</dt>
                    <dd>${lastClickAtItem.goods[key]}</dd>
                    `
                )).join('')}
            </dl>
        </div>
        `;
    }

}

setInterval(()=>{redraw();},500);

const addThingToStore = thing => {
    thing.name = `${thing.type.charAt(0).toUpperCase() + thing.type.slice(1)} #${store.items.length}`;
    thing.position = lastClickAtTile;
    store.items = [...store.items, thing];
    store.items = store.items.sort((a, b) => a.position[0] > b.position[0] ? 1 : -1)
    store.items = store.items.sort((a, b) => a.position[1] > b.position[1] ? 1 : -1)
}

const holdItem = item => {
    draggablePlaceholder = {
        item: item
    }
}

const addItem = item => {
    if(item.type === 'factory') {
        store.items.map(storeItem => {
            item.attach(storeItem);
        });
    }
    addThingToStore(item);
}

document.querySelector('#addDonut').addEventListener('click',()=>holdItem(new Factory()));
document.querySelector('#addStore').addEventListener('click',()=>holdItem(new Store()));
document.querySelector('#addBank').addEventListener('click',()=>holdItem(new Bank()));

$canvas.addEventListener('unitclick',ev => {
    lastClickAtItem = ev.detail.item;
    lastClickAtTile = ev.detail.tile;

    if(draggablePlaceholder && draggablePlaceholder.item) {
        addItem(draggablePlaceholder.item);
        draggablePlaceholder = {};
    }

})

const drawLoopLoop = () => {
    requestAnimationFrame(()=>{
        drawLoop($canvas,{
            store: store,
            draggablePlaceholder: draggablePlaceholder,
        });
        drawLoopLoop();
    })
}

setupCanvas($canvas,store);
drawLoopLoop();
