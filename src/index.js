import "./styles/main.scss";
import { recipes } from "./recipes.js";
import cooking from "./assets/cooking_hat.svg";
import magnifying from "./assets/magnifying_glass.svg";
import food from "./assets/food.svg";
import time from "./assets/timer.svg";
import closeArrow from "./assets/close_arrow.svg";

let recipeList = [];

const recipeCardTemplate = document.querySelector("[data-recipe-template]");
const recipeCardsContainer = document.querySelector("[data-cards-container]");

// Create the search bar //

const searchBar = document.querySelector("[data-search]");
const buildSearchBar = () => {
  const logoBrand = document.getElementById("logo");
  logoBrand.src = cooking;
  const searchPicture = document.getElementById("search_picture");
  searchPicture.src = magnifying;
};
buildSearchBar();

// Build the cards //

const buildCard = () => {
  recipeList = recipes.map((recipe) => {
    const card = recipeCardTemplate.content.cloneNode(true).children[0];
    const title = card.querySelector("[data-title]");
    const timing = card.querySelector("[data-timing]");
    const ingredients = card.querySelector("[data-ingredients]");
    const instructions = card.querySelector("[data-instructions]");
    title.textContent = recipe.name;
    timing.textContent = recipe.time;
    const ingredientso = recipe.ingredients;

    ingredientso.forEach((ing) => {
      ingredients.innerHTML += `<span class="recipe__ingredients__title">${
        ing.ingredient
      } : </span> ${
        parseInt(ing.quantity) + ing.unit || parseInt(ing.quantity) || ""
      } <br>`;
    });

    instructions.textContent = recipe.description;
    recipeCardsContainer.append(card);

    return {
      titre: recipe.name,
      ingred: recipe.ingredients,
      devices: recipe.appliance,
      ustensils: recipe.ustensils,
      description: recipe.description,
      element: card,
    };
  });
};
buildCard();

// select card with input search value //

searchBar.addEventListener("input", (e) => {
  const value = e.target.value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();

  recipeList.forEach((list) => {
    let isVisible;
    list.ingred.forEach((ing) => {
      isVisible =
        list.titre
          .toLowerCase()
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .includes(value) ||
        ing.ingredient
          .toLowerCase()
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .includes(value) ||
        list.description
          .toLowerCase()
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .includes(value);
      if (value === ing.ingredient) {
        allIngredients = allIngredients.filter((el) => el === ing.ingredient);
      }
    });
    list.element.classList.toggle("show", isVisible);
  });
});

const recipesPic = document.querySelectorAll("[data-img]");
recipesPic.forEach((recip) => {
  recip.src = food;
});

const logoTimer = document.querySelectorAll("[data-timer-img]");
logoTimer.forEach((logo) => {
  logo.src = time;
});

// DOM //
const ingredientMenu = document.querySelector(".ingredient_menu");

// create ingredient list//

let allIngredients = [];
const getIngredientsList = () => {
  for (let recipe of recipes) {
    recipe.ingredients.map((object) => {
      allIngredients.push(
        object.ingredient.toLowerCase().replace(/\p{Diacritic}/gu, "")
      );
    });
  }
  allIngredients = [...new Set(allIngredients)];
  allIngredients.map((ing) => {
    const li = document.createElement("li");
    li.className = "ingredients_li";
    li.innerHTML += ing;
    ingredientMenu.appendChild(li);
  });
};
getIngredientsList();

//DOM //
const devices = document.querySelector(".device_menu");
// create devices list //

let allAppliances = [];

const getAppliancesList = () => {
  for (let recipe of recipes) {
    let appliances = recipe.appliance
      .toLowerCase()
      .replace(/\p{Diacritic}/gu, "");
    allAppliances.push(appliances);
  }
  allAppliances = [...new Set(allAppliances)];
  allAppliances.forEach((object) => {
    const device_li = document.createElement("li");
    device_li.className = "device_li";
    device_li.innerHTML += object;
    devices.appendChild(device_li);
  });
};
getAppliancesList();

//DOM //
const ustensilsM = document.querySelector(".ustensil_menu");
let allUstensils = [];

// create ustensils list //

const getUstensilList = () => {
  for (let recipe of recipes) {
    recipe.ustensils.map((object) => {
      allUstensils.push(object.toLowerCase().replace(/\p{Diacritic}/gu, ""));
    });
  }
  allUstensils = [...allUstensils];
  allUstensils = [...new Set(allUstensils)];
  allUstensils.forEach((object) => {
    const ustensil_li = document.createElement("li");
    ustensil_li.className = "ustensil_li";
    ustensil_li.innerHTML += object;
    ustensilsM.appendChild(ustensil_li);
  });
};
getUstensilList();

// find the tags who match the search//
const searchTags = (category) => {
  const searchBox = document.querySelector(`.${category}_search`);
  const ingredient_menu = document.querySelector(".ingredient_menu");
  const items = document.querySelectorAll(`.${category}_li`);
  for (let item of items) {
    let valuue =
      item.textContent
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "") ||
      item.innerHTML
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");

    searchBox.addEventListener("input", (element) => {
      let value = element.target.value
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");
      if (valuue.includes(value)) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });
  }
};
searchTags("ingredients");
searchTags("device");
searchTags("ustensil");

// create tags and erase it & remove unmatched cards//

let ingredientTags = [],
  deviceTags = [],
  ustensilTags = [];

const getCategoriesTag = (category, tabs, typeTags) => {
  const categories = document.getElementsByClassName(`${category}_li`);
  const buttons = document.querySelector(".buttons");
  const firstChild = buttons.firstChild;

  for (let i = 0; i < categories.length; i++) {
    categories[i].addEventListener("click", () => {
      let tag = document.createElement("button");
      tag.className = "tags";
      tag.textContent = categories[i].textContent;
      typeTags.push(tag.textContent);
      let closeTag = document.createElement("img");
      closeTag.className = "closeTag";
      closeTag.src = closeArrow;

      buttons.insertBefore(tag, firstChild);
      buttons.appendChild(tag);
      tag.appendChild(closeTag);
      let filterIng = tag.textContent;
      console.log(tabs.length);
      if (tag) {
        tabs = tabs.filter(
          (el) =>
            el !==
            filterIng
              .toLowerCase()
              .normalize("NFD")
              .replace(/\p{Diacritic}/gu, "")
        );
      }
      console.log(tabs.length);
      let clsTag = document.querySelectorAll(".closeTag");
      for (let item of clsTag) {
        item.addEventListener("click", (e) => {
          tabs.push(tag.textContent);
          typeTags = typeTags.filter((el) => el !== tag.textContent);
          tag.remove();
        });
      }

      tabs = tabs.filter((e, i) => tabs.indexOf(e) == i);

      let value =
        tag.innerText
          .toLowerCase()
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "") ||
        tag.textContent
          .toLowerCase()
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "");
      if (value) {
        recipeList.forEach((list) => {
          let isVisibleA = false;
          list.ingred.forEach((ing) => {
            if (
              ing.ingredient
                .toLowerCase()
                .normalize("NFD")
                .replace(/\p{Diacritic}/gu, "") === value
            ) {
              isVisibleA = true;
            }
          });
          if (
            value ===
            list.devices
              .toLowerCase()
              .normalize("NFD")
              .replace(/\p{Diacritic}/gu, "")
          ) {
            isVisibleA = true;
          }
          list.ustensils.forEach((ustensils) => {
            if (
              value ===
              ustensils
                .toLowerCase()
                .normalize("NFD")
                .replace(/\p{Diacritic}/gu, "")
            ) {
              isVisibleA = true;
            }
          });

          list.element.classList.toggle("show", isVisibleA);
        });
      }
    });
  }
  return tabs;
};
getCategoriesTag("ingredients", allIngredients, ingredientTags);
getCategoriesTag("device", allAppliances, deviceTags);
getCategoriesTag("ustensil", allUstensils, ustensilTags);
