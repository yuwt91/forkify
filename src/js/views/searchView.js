import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearSearchField = () => {
    elements.searchInput.value = '';
};

export const clearSearchList = () => {
    elements.resultList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

// ues reduce to caculate the characters of title, and set them under 17. the func return origin title or reduced title.
const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        },0);

        return `${newTitle.join(' ')} ...`;
    }
    return title;
};

const renderRecipe = (recipe) => {
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title, 17)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li> `;
    elements.resultList.insertAdjacentHTML('beforeend', markup);
};

// type: prev or next
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto= ${type === 'prev' ? page - 1 : page + 1}>
    <span> Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
    
`;

const renderButtons = (currentPage, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);

    let button;
    if (currentPage === 1 && pages > 1) {
        // only button to go to next page
        button = createButton(currentPage, 'next');
    } else if (currentPage < pages) {
        // both buttons
        button = `
            ${createButton(currentPage, 'prev')}
            ${createButton(currentPage, 'next')}
        `;
    } else if (currentPage === pages && pages > 1) {
        // only  button to go to prew page
        button = createButton(currentPage, 'prev');
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin', button)

};

export const renderResults = (recipes, currentPage = 1, resPerPage = 10) => {
    // render current page
    const start = (currentPage - 1) * resPerPage;
    const end = currentPage * resPerPage;
    recipes.slice(start, end).forEach(renderRecipe);

    // render pagination buttons
    renderButtons(currentPage, recipes.length, resPerPage);
};