class Observable{
    constructor(){
        this.observers=[];
    }
    attach(observer){
        this.observers.push(observer);
    }
    detach(observer){
        const idx=this.observers.findIndex(item=>item===observer);
        this.observers.splice(idx,1);
    }
    notify(){
        this.observers.forEach(item=>{
            item.update();
        })
    }

}
