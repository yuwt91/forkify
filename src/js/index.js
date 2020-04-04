// https://forkify-api.herokuapp.com/api/search
// https://forkify-api.herokuapp.com/api/get
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, loading, clearLoading } from './views/base';


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
            recipeView.renderRecipe(state.recipe);

        } catch(error) {
            alert('Recipe processing error :(');
        }

    }

};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));