const searchInput = document.querySelector('.search');
const foodsWrapper = document.querySelector('.foods_wrapper');
const recipeModal = document.querySelector('.recipe');
const closeRecipeBtn = document.querySelector('.close_button');
const recipeTitle = document.querySelector('.recipe_title');
const recipeCategory = document.querySelector('.recipe_category');
const recipeInstructions = document.querySelector('.recipe_instruct p');
const recipeImg = document.querySelector('.recipe_meal_img img');
const saveToFavorites = document.querySelector('.save_to_favorites');
const deleteRecipe = document.querySelector('.delete_recipe');
const favoritesButton = document.querySelector('.favorites');
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
const apiKey = "cace287f5e6f4360ba44fd31050c7138"; 
const apiURL = "https://api.spoonacular.com/recipes";
document.querySelector('.searchBar svg').addEventListener('click', searchRecipes);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchRecipes();
});
async function searchRecipes() {
    const query = searchInput.value.trim();
    if (!query) return;
    try {
        const response = await fetch(`${apiURL}/complexSearch?query=${query}&number=9&apiKey=${apiKey}`);
        const data = await response.json();
        displayRecipes(data.results);
    } catch (error) {
        console.error("Error fetching recipes:", error);
    }
}
function displayRecipes(recipes) {
    foodsWrapper.innerHTML = recipes && recipes.length > 0
        ? recipes.map(recipe => recipeToHTML(recipe)).join('')
        : '<p class="no_results">No results found.</p>';
}
function recipeToHTML(recipe, isFavoriteView = false) {
    return `
        <div class="food">
            <img src="https://spoonacular.com/recipeImages/${recipe.id}-312x231.jpg" alt="${recipe.title}" class="food_img" onerror="this.src='default-image.jpg'">
            <h2 class="food_name">${recipe.title}</h2>
            <button class="get_recipe" onclick="showRecipe(${recipe.id})">Get Recipe</button>
            ${isFavoriteView ? `<button class="delete_recipe" onclick="removeFromFavorites(${recipe.id})">Delete from Favorites</button>` : ''}
        </div>
    `;
}
async function showRecipe(id) {
    try {
        const response = await fetch(`${apiURL}/${id}/information?apiKey=${apiKey}`);
        const recipe = await response.json();
        recipeTitle.textContent = recipe.title;
        recipeCategory.textContent = recipe.dishTypes ? recipe.dishTypes.join(", ") : "Unknown";
        recipeInstructions.textContent = recipe.instructions || "No instructions available.";
        recipeImg.src = recipe.image;
        recipeModal.classList.remove('hidden');
        if (favorites.some(item => item.id === recipe.id)) {
            saveToFavorites.classList.add('hidden');
            deleteRecipe.onclick = () => removeFromFavorites(recipe.id);
        } else {
            saveToFavorites.classList.remove('hidden');
            saveToFavorites.onclick = () => addToFavorites(recipe);
        }
    } catch (error) {
        console.error("Error fetching recipe details:", error);
    }
}
closeRecipeBtn.addEventListener('click', () => {
    recipeModal.classList.add('hidden');
});
function addToFavorites(recipe) {
    if (!favorites.find(item => item.id === recipe.id)) {
        favorites.push(recipe);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        saveToFavorites.classList.add('hidden');
    }
}
function removeFromFavorites(id) {
    favorites = favorites.filter(recipe => recipe.id !== id);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
    saveToFavorites.classList.remove('hidden');
}
favoritesButton.addEventListener('click', displayFavorites);
function displayFavorites() {
    const savedRecipes = JSON.parse(localStorage.getItem('favorites')) || [];
    if (savedRecipes.length > 0) {
        foodsWrapper.innerHTML = savedRecipes.map(recipe => recipeToHTML(recipe, true)).join('');
    } else {
        foodsWrapper.innerHTML = '<p class="no_results">No favorites saved yet.</p>';
    }
}