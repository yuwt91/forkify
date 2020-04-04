import axios from 'axios';

export default class Recipe{
    constructor(id){
        this.id = id;
    }

    async getRecipe(){
        try{
            const rec = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            
            this.author = rec.data.recipe.publisher;
            this.ingredients = rec.data.recipe.ingredients;
            this.url = rec.data.recipe.source_url;
            this.social_rank = rec.data.recipe.social_rank;
            this.title = rec.data.recipe.title;
            this.img = rec.data.recipe.image_url;
            //console.log(`author is ${this.author}`);

        } catch(error) {
            alert(error);
            console.log(`some error happens :(`);
        }
    }

    calcTime(){
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings(){
        this.servings = 4;
    }

    parseIngredients() {
        const unitLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitShort,'kg','g'];

        const newIngredients = this.ingredients.map(el => {
            // 1. uniform units
            let ingredient = el.toLowerCase();
            unitLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitShort[i]);
            });

            // 2. remove parenthses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

            // 3. parse ingredients into count, unit ang ingredients
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;
            if (unitIndex > -1) {
                // 有一个单位
                const arrCount = arrIng.slice(0, unitIndex);
                
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-','+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };

            } else if(parseInt(arrIng[0], 10)) {
                // 无单位，第一个元素是数字
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit:'',
                    ingredient: arrIng.slice(1).join(' ')
                };
            } else if (unitIndex === -1) {
                // 没有单位，没有数字，在第一个位置
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                };
            }
            return objIng;
        });
        this.ingredients = newIngredients;
    }
}