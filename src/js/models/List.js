import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    additem (count, unit, ingredient) {
        const item = {
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem (id) { 
        const index = this.items.findIndex(el => el.id === id);
        return this.items.splice(index, 1);
    }

    updateCount(idm, newCount) {
        this.items.find(el => el.id === id).count = newCount;
    }
}