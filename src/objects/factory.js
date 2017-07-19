import primitive from './_primitive'
import { MONEY, DONUT } from 'resources.js'

export default class Factory extends primitive {

    get type() {
        return 'factory';
    }

    constructor() {
        super(constructor);
        this.converts = [
            {
                from: MONEY,
                to: DONUT,
                time: 2000,
                rate: 2
            }
        ]
    }

}
