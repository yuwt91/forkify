// https://forkify-api.herokuapp.com/api/search
// https://forkify-api.herokuapp.com/api/get
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/Recipe';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';

import { elements, loading, clearLoading } from './views/base';
import Likes from './models/Likes';


/* Global state of the app
* - Search object
* - Current recipe object
* - Shopping list object
* - Liked recipes
*/
const state = {};

/**
 * Search Controller
 */

const controlSearch = async () => {
    // 1. get query from view
    const query = searchView.getInput();
    

    if(query) {
        // 2. new search object and add to state 
        state.search = new Search(query); // current query stored in state.search 

        // 3. prepare UI for resule
        searchView.clearSearchField();
        searchView.clearSearchList();
        loading(elements.searchResult);

        try{
            // 4. search for recipes
            await state.search.getResults();
    
            // 5. render results on UI
            clearLoading();
            searchView.renderResults(state.search.result);

        } catch(error) {
            alert('Search processing error :(');
        }

    } 
};


elements.searchForm.addEventListener('submit' , e => {
    e.preventDefault;
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearSearchList();
        searchView.renderResults(state.search.result, goToPage);
    }
});

/**
 * Recipe Controller: to displayer details information of choosen recipe
 */

// const r = new Recipe(47746);
// r.getRecipe();
// console.log(r);

const controlRecipe = async () => {
    const id = window.location.hash.replace('#','');
    
    if(id) {
        // prerape UI for changes
        recipeView.clearRecipe();
        loading(elements.recipe);
        
        if (state.search) searchView.highlightSelected(id);

        // create new recipe object
        state.recipe = new Recipe(id);

        // for 快速测试
        // window.r = state.recipe;
        try{
            // get recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
    
            // calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // render recipe
            clearLoading();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );

        } catch(error) {
            console.log(err);
            alert('Recipe processing error :(');
        }

    }

};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/**
 * Shopping Controller
 */
const controList = () => {
    if (!state.list) state.list = new List();


    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};

elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        state.list.deleteItem(id);

        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

/**
 * Like controller
 */

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    if (!state.likes.isLiked(currentID)) {
        const newLike = state.likes.addLike(
            currentID,
            stare.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        likesView.toggleLikeBtn(true);
        listView.renderLike(newLike);
    } else {
        state.likes.deleteLike(currentID);
        likesView.toggleLikeBtn(false);
        listView.deleteLike(currentID);

    }
    listsView.toggleLikeMenu(state.likes.getNumLikes());

};

window.addEventListener('load', () => {
    state.likes = new Likes();
    state.likes.readStorage();
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    state.likes.likes.forEach(like => likesView.renderResults(like));
});

// 响应recipe 详情页面的按钮事件
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // 按下减号按钮后调用函数
        if (state.recipe.servings > 1) {state.recipe.updateServings('dec');}
        recipeView.updateServingsIng(state.recipe);
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // 按下加号按钮后调用函数
        state.recipe.updateServings('inc');
        recipeView.updateServingsIng(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    }
});