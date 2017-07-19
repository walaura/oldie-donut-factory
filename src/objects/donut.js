export default class Donut {

    constructor() {
        this.value = 0;
        setInterval(()=>{
            this.tick();
        },100);
    }

    tick() {
        this.value = this.value+1;
    }

}
