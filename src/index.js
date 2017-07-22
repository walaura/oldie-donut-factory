import { MONEY, DONUT } from 'resources'
import { paint } from 'paint'

import Factory from 'objects/factory';
import Store from 'objects/store';
import Bank from 'objects/bank';

import 'assets/styles/index.scss'

const $canvas = document.getElementById('play');

const store = {
    items: []
};

const redraw = () => {

    let donutsTotal = store.items.reduce((sum,item)=>{
        return sum + item.goods.DONUT
    },0);
    document.querySelector('#donuts').textContent = donutsTotal.toFixed(2) + ' donuts'

    let moneyTotal = store.items.reduce((sum,item)=>{
        return sum + item.goods.MONEY
    },0);
    document.querySelector('#money').textContent = moneyTotal.toFixed(2) + '$'

}

let lastClickAt = [0,0];

const addThingToStore = thing => {
    thing.position = lastClickAt;
    store.items = [...store.items, thing];
    store.items = store.items.sort((a, b) => a.position[0] > b.position[0] ? 1 : -1)
    store.items = store.items.sort((a, b) => a.position[1] > b.position[1] ? 1 : -1)
}

const addDonut = () => {

    let factory = new Factory();

    store.items.map(item => {
        factory.attach(item);
    });

    addThingToStore(factory);
    redraw();
}
const addStore = () => {
    addThingToStore(new Store());
}
const addBank = () => {
    addThingToStore(new Bank());
}

document.querySelector('#addDonut').addEventListener('click',()=>addDonut());
document.querySelector('#addStore').addEventListener('click',()=>addStore());
document.querySelector('#addBank').addEventListener('click',()=>addBank());
document.querySelector('#redraw').addEventListener('click',()=>redraw());

$canvas.addEventListener('unitclick',ev => {
    lastClickAt = ev.detail.tile;
})

paint($canvas,{
    store: store
});
