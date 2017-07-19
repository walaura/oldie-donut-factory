import primitive from './_primitive'
import { ETHER, MONEY } from 'resources.js'

export default class Bank extends primitive {

    get type() {
        return 'bank';
    }

    constructor() {
        super(constructor);
        this.converts = [
            {
                from: ETHER,
                to: MONEY,
                time: 10,
                rate: .001
            }
        ]
    }

}
