import primitive from './_primitive'
import { MONEY, DONUT } from 'resources.js'

export default class Store extends primitive {

    get type() {
        return 'store';
    }

    constructor() {
        super(constructor);
        this.converts = [
            {
                from: DONUT,
                to: MONEY,
                time: 4000,
                rate: 4
            }
        ]
    }

}
