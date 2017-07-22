import { MONEY, DONUT } from 'resources'
import { paint } from 'paint'

import $ from 'jquery';
import Factory from 'objects/factory';
import Store from 'objects/store';
import Bank from 'objects/bank';

import './styles/index.scss'

const $canvas = $('#app');

const store = {
    items: []
};

const redraw = () => {

    return;
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

document.querySelector('#addDonut').addEventListener('click',()=>addDonut());
document.querySelector('#addStore').addEventListener('click',()=>addStore());
document.querySelector('#addBank').addEventListener('click',()=>addBank());
document.querySelector('#redraw').addEventListener('click',()=>redraw());

const canvas = document.getElementById('play');
paint(canvas,{
    store: store
});
