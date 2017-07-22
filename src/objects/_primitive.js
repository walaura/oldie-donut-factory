import uuid from 'uuid/v4';
import { MONEY, DONUT } from 'resources.js'

export default class primitive {

    constructor() {
		this.goods = {
			DONUT: 0,
            MONEY: 0,
            ETHER: 99999999999999999999999999999,
		}
		this.linkedObjects = [

		];
        this.uuid = uuid();
        this.lastTick = Date.now();
        this.state = {
            timeLastUnitCompleted: 0,
            goodsDepleted: new Set()
        }
        this.position = [0,0];
        setInterval(()=>{
            this.tick();
        },1000);
    }

    attach(item) {
        this.linkedObjects = [...this.linkedObjects, item];
    }

    fetchResource(type,needed) {

        const neededPlusGreed = needed*1.1;

        if(this.goods[type] > needed) {
            return true;
        }
        else {
            this.linkedObjects.map(object => {
                if (object.goods[type] > neededPlusGreed) {
                    object.goods[type] = object.goods[type] - neededPlusGreed;
                    this.goods[type] += neededPlusGreed;
                    return true;
                }
                else if(object.goods[type] > 0) {
                    this.goods[type] += object.goods[type];
                    object.goods[type] = 0;
                    return this.fetchResource(type,needed);
                }
                else {
                    return false;
                }
            })
        }
    }

    tick() {

        let now = parseInt(Date.now());

        this.converts = this.converts.map(converter => {

            if(!converter.completionPercent) {
                converter.completionPercent = 0;
            }

            let convertablePercent = (now-this.lastTick)/converter.time;
            let resourceNeeded = (converter.rate*convertablePercent);

            if(!this.fetchResource(converter.from,resourceNeeded)) {
                this.state.goodsDepleted.add(converter.from);
                return converter;
            }
            else {
                this.state.goodsDepleted.delete(converter.from);
            }

            converter.completionPercent += convertablePercent,

            this.goods[converter.from] =
            this.goods[converter.from] - resourceNeeded;

            this.goods[converter.to] =
            this.goods[converter.to] + convertablePercent;

            if(converter.completionPercent > 1) {
                converter.completionPercent = 0;
                this.timeLastUnitCompleted = now;
            }
            return converter;
        })

        this.lastTick = now;
    }

}
