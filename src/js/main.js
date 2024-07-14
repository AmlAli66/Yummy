

var homeBox = document.querySelector('#homeMeals');
var recipeBox = document.querySelector('#recipeDetails');
var recipeIngredient = document.querySelector('.recipeIngredient');
var categories = document.querySelector('#categories');


$(document).ready(() => {
    getMeals().then(() => {
        $("#LoadingSpinner").fadeOut(500)
        $("body").css("overflow", "visible")
    })
})

// =========>Home meals<==========//
async function getMeals() {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=`;
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data);
    var dataArr = data.meals
    displayMeals(dataArr);

    $("#LoadingSpinner").addClass('d-none')
    $("body").css("overflow", "hidden")
}
getMeals();


function displayMeals(dataArr) {
    let box = '';
    for (var i = 0; i < dataArr.length; i++) {
        box += `
                <div class="col-md-3 meal-col" onclick="getRecipe('${dataArr[i].idMeal}')">
                    <div class="meal-img rounded-3 overflow-hidden"  >
                        <img src="${dataArr[i].strMealThumb}" class="w-100 rounded-3" alt="">
                        <div class="meal-overlay d-flex align-items-center ps-2">
                            <h3 class="text-black">${dataArr[i].strMeal}</h3>
                        </div>
                    </div>
                </div>
                `

    }
    homeBox.innerHTML = box;
}

// =========>meals details<==========//
async function getRecipe(idMeal) {
    $('#containerSpinner').removeClass('d-none').fadeIn(1000)

    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`;
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data);
    displayRecipe(data.meals[0]);
    $('#containerSpinner').addClass('d-none').fadeOut(300)


}


function displayRecipe(meal) {
    removeSearchSec();

    document.querySelectorAll('.meal-col').forEach(() => {
        let recipeIngredientBox = ``;
        for (let i = 1; i <= 20; i++) {
            if (meal[`strIngredient${i}`] === '') {
                break;
            } else {
                recipeIngredientBox += `
                <li class="alert alert-info tag-details p-1 m-2 ">
                    <span class="">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</span> 
                </li>`
            }
        }

        let recipeTag = ``;
        if (meal.strTags) {
            recipeTag = `
            <span class="alert alert-danger bg-opacity-25 p-1 m-2 border-0">${meal.strTags}</span>
            `
        }



        let box = `
                <div class="col-md-4">
                <div class="recipeImage">
                    <img src="${meal.strMealThumb}" class="w-100 rounded-3" alt="">
                    <h2 class=" mt-1">${meal.strMeal}</h2>
                </div>
            </div>
            <div class="col-md-8">
                <div class="recipeText">
                    <h2>Instructions</h2>
                    <p>${meal.strInstructions}</p>
                    <h3><span class="fw-bold">Area : </span>${meal.strArea}</h3>
                    <h3><span class="fw-bold">Category : </span>${meal.strCategory}</h3>
                    <h3>Recipes :</h3>
                    <ul class="recipeIngredient list-unstyled text-black d-flex flex-wrap g-3  ">
                    ${recipeIngredientBox}
                    </ul>
                    <h3 class="">Tags :</h3>
                    <div class="recpieTag my-4">${recipeTag}</div>
                    <a href="${meal.strSource}" class="btn btn-success" target="_blank">Source</a>
                    <a href="${meal.strYoutube}" class="btn btn-danger" target="_blank">Youtube</a>
                </div>
            </div>
        `;


        homeBox.innerHTML = box;

    })
}
// =========>ASide Menu<==========//

$('.open-close-btn').click(function () {
    checkOPenOrClose();
})


function checkOPenOrClose() {
    if ($('.open-close-btn').hasClass('fa-align-justify')) {
        $('.b-nav-sec').animate({ width: '260px', padding: '2rem' }, function () {
            $('.b-nav-sec ul li').eq(0).animate({ top: '0' }, 400);
            $('.b-nav-sec ul li').eq(1).animate({ top: '0' }, 500);
            $('.b-nav-sec ul li').eq(2).animate({ top: '0' }, 600);
            $('.b-nav-sec ul li').eq(3).animate({ top: '0' }, 700);
            $('.b-nav-sec ul li').eq(4).animate({ top: '0' }, 800);
            $('.copyRight').removeClass('d-none')
        })
        $(".open-close-btn").removeClass("fa-align-justify").addClass("fa-x ");
        return true;
    }
    else if ($('.open-close-btn').hasClass('fa-x')) {
        $('.b-nav-sec').animate({ width: '0px', padding: '0rem' });
        $('.b-nav-sec ul li').animate({ top: '300px' }, 300)
        $(".open-close-btn").removeClass("fa-x").addClass("fa-align-justify");
        $('.copyRight').addClass('d-none')

        return false;
    }
}


// =========>categories<==========//
async function getCategories() {
    $('#containerSpinner').removeClass('d-none').fadeIn(1000)

    const url = `https://www.themealdb.com/api/json/v1/1/categories.php`
    const response = await fetch(url)
    const data = await response.json()
    // console.log(data.categories);
    displayCategories(data.categories);
    $('#containerSpinner').addClass('d-none').fadeOut(300)

}


function displayCategories(categArr) {
    $(".open-close-btn").removeClass("fa-align-justify").addClass("fa-x");
    checkOPenOrClose();


    let categBox = ``;
    for (let i = 0; i < categArr.length; i++) {
        categBox += `
                <div class="col-md-3" onclick="getMealsFromCategory('${categArr[i].strCategory}')" >
                    <div class="categDiv position-relative rounded-3 overflow-hidden">
                        <img src="${categArr[i].strCategoryThumb}" class="w-100 rounded-3" alt="">
                        <div class="category-overlay text-black  text-center p-3">
                            <h3 class="">${categArr[i].strCategory}</h3>
                            <p>${categArr[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                        </div>
                    </div>
                </div>
    `
    }
    homeBox.innerHTML = categBox;
}

async function getMealsFromCategory(categ) {
    $('#containerSpinner').removeClass('d-none').fadeIn(300)
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categ}`;
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data.meals);
    // console.log(categ);
    displayMeals(data.meals.slice(0, 20));
    $('#containerSpinner').addClass('d-none').fadeOut(300)
}

// =========>Area<==========//

async function getArea() {
    $('#containerSpinner').removeClass('d-none').fadeIn(300)
    const url = `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
    const response = await fetch(url)
    const data = await response.json()
    // console.log(data.meals);
    displayArea(data.meals);
    $('#containerSpinner').addClass('d-none').fadeOut(300)

}

function displayArea(areaArr) {
    $(".open-close-btn").removeClass("fa-fa-align-justify").addClass("fa-x");
    checkOPenOrClose();

    $('#contactUs').addClass('d-none');

    let areaBox = ``;
    for (let i = 0; i < areaArr.length; i++) {
        areaBox += `
        <div class="col-md-3 text-center" onclick="getMealsFromArea('${areaArr[i].strArea}')">
            <div class="area-sec">
                <i class="fa-solid fa-house-laptop fa-4x"></i>
                <h3>${areaArr[i].strArea}</h3>
            </div>
        </div>

`
    }
    homeBox.innerHTML = areaBox;
}

async function getMealsFromArea(area) {
    $('#containerSpinner').removeClass('d-none').fadeIn(300)
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`;
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data.meals);
    // console.log(area);
    displayMeals(data.meals.slice(0, 20));
    $('#containerSpinner').addClass('d-none').fadeOut(300)

}

// =========>Ingredients<==========//

async function getIngredients() {
    $('#containerSpinner').removeClass('d-none').fadeIn(300)

    const url = `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
    const response = await fetch(url)
    const data = await response.json()
    // console.log(data.meals.slice(0, 20));
    displayIngredients(data.meals.slice(0, 20));
    $('#containerSpinner').addClass('d-none').fadeOut(300)

}

function displayIngredients(ingredientArr) {
    $(".open-close-btn").removeClass("fa-fa-align-justify").addClass("fa-x");
    checkOPenOrClose();


    $('#contactUs').addClass('d-none');

    let ingredientBox = ``;
    for (let i = 0; i < ingredientArr.length; i++) {
        ingredientBox += `
        <div class="col-md-3 text-center" onclick="getMealsFromingredient('${ingredientArr[i].strIngredient}')">
            <div class="area-sec">
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h3>${ingredientArr[i].strIngredient}</h3>
                <p>${ingredientArr[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
            </div>
        </div>

`
    }
    homeBox.innerHTML = ingredientBox;
}


async function getMealsFromingredient(ingredient) {
    $('#containerSpinner').removeClass('d-none').fadeIn(300)

    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data.meals);
    // console.log(area);
    displayMeals(data.meals);
    $('#containerSpinner').addClass('d-none').fadeOut(300)

}
//  =========>Contact us<==========
let isNameFocus = false;
let isEmailFocus = false;
let isPhoneFocus = false;
let isAgeFocus = false;
let isPassFocus = false;
let isRepassFocus = false;
function displayContactSec() {
    $(".open-close-btn").removeClass("fa-fa-align-justify").addClass("fa-x");
    checkOPenOrClose();


    let searchBox = `
                <div class="vh-100 d-flex align-items-center w-75 row m-auto">
                <div class="row g-4" id="contactUs">
                    <div class="col-md-6">
                        <input  type="text" class="form-control" placeholder="Enter Your Name" id="nameInput"
                            onkeyup="validationAllInput()">
                            <div  class="text-center alert alert-danger  w-100 mt-2 d-none" id="nameMessage">
                            Special characters and numbers not allowed
                            </div>
                    </div>
                    <div class="col-md-6">
                        <input  type="email" class="form-control" placeholder="Enter Your Email" id="emailInput" 
                            onkeyup="validationAllInput();">
                            <div  class="text-center  alert alert-danger w-100 mt-2 d-none" id="emailMessage">
                            Email not valid *exemple@yyy.zzz
                            </div>
                    </div>
                    <div class="col-md-6">
                        <input type="text" class="form-control" placeholder="Enter Your Phone"  id="phoneInput"
                            onkeyup="validationAllInput()" >
                        <div  class="text-center  alert alert-danger w-100 mt-2 d-none" id="phoneMessage" >
                            Enter valid Phone Number
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input  type="number" class="form-control" placeholder="Enter Your Age" id="ageInput"
                            onkeyup="validationAllInput()">
                        <div  class="text-center  alert alert-danger w-100 mt-2 d-none" id="ageMessage" >
                            Enter valid age
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input  type="password" class="form-control" placeholder="Enter Your Password" id="passInput"
                            onkeyup="validationAllInput()">
                        <div  class="text-center alert alert-danger w-100 mt-2 d-none"  id="passMessage">
                            Enter valid password *Minimum eight characters, at least one letter and one number:*
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input  type="password" class="form-control" placeholder="Repassword" id="repassInput"
                            onkeyup="validationAllInput()">
                        <div  class="text-center alert alert-danger w-100 mt-2 d-none" id="repassMessage">
                            Enter valid repassword
                        </div>
                    </div>
                    <div class="col-md-12 text-center">
                        <button class="btn btn-outline-danger mt-3 px-2" id="submitBtn" disabled >Submit</button>
                    </div>
                </div>
            </div>
    `;

    homeBox.innerHTML = searchBox;
    $('#emailInput').focus(function () {
        isEmailFocus = true;
    })
    $('#nameInput').focus(function () {
        isNameFocus = true;
    })
    $('#phoneInput').focus(function () {
        isPhoneFocus = true;
    })
    $('#ageInput').focus(function () {
        isAgeFocus = true;
    })
    $('#passInput').focus(function () {
        isPassFocus = true;
    })
    $('#repassInput').focus(function () {
        isRepassFocus = true;
    })


}

// ===========>validation<============

function validateName(name) {
    return (/^[a-zA-Z ]+$/.test(name));
}
function validateEmail(email) {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email));
}
function validatePhone(phone) {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone));
}
function validateAge(age) {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(age));
}
function validatePassowrd(password) {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(password));
}
function validateRepassowrd() {
    return $("#repassInput").val() === $("#passInput").val();
}


function validationAllInput() {
    if (isEmailFocus) {
        if (validateEmail($("#emailInput").val())) {
            $('#emailMessage').addClass('d-none');
        }
        else {
            $('#emailMessage').removeClass('d-none');
        }
    }

    if (isNameFocus) {
        if (validateName($("#nameInput").val())) {
            $('#nameMessage').addClass('d-none');
        }
        else {
            $('#nameMessage').removeClass('d-none');
        }
    }
    if (isPhoneFocus) {
        if (validatePhone($("#phoneInput").val())) {
            $('#phoneMessage').addClass('d-none');
        }
        else {
            $('#phoneMessage').removeClass('d-none');
        }
    }
    if (isAgeFocus) {
        if (validateAge($("#ageInput").val())) {
            $('#ageMessage').addClass('d-none');
        }
        else {
            $('#ageMessage').removeClass('d-none');
        }
    }
    if (isPassFocus) {
        if (validatePassowrd($("#passInput").val())) {
            $('#passMessage').addClass('d-none');
        }
        else {
            $('#passMessage').removeClass('d-none');
        }
    }
    if (isPassFocus) {
        if (validateRepassowrd($("#repassInput").val())) {
            $('#repassMessage').addClass('d-none');
        }
        else {
            $('#repassMessage').removeClass('d-none');
        }
    }

    if (validateName($("#nameInput").val()) && validateEmail($("#emailInput").val()) && validatePhone($("#phoneInput").val()) && validateAge($("#ageInput").val()) && validatePassowrd($("#passInput").val()) && validateRepassowrd()) {
        $('#submitBtn').removeAttr('disabled');

    } else {
        $('#submitBtn').attr('disabled', true);
    }

}



// ===========>search<============
function getSearchSec() {
    $('#containerSpinner').removeClass('d-none').fadeIn(300)

    $(".open-close-btn").removeClass("fa-fa-align-justify").addClass("fa-x");
    checkOPenOrClose();
    $('#searchSec').removeClass('d-none');
    homeBox.innerHTML = " ";
    $('#containerSpinner').addClass('d-none').fadeOut(300)

}
function removeSearchSec() {
    $('#searchSec').addClass('d-none');
}

async function searchByMealName(mealName) {
    $('#containerSpinner').removeClass('d-none').fadeIn(300);

    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`;
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data.meals);
    // checkSearch(data.meals)
    if (data.meals) {
        displayMeals(data.meals);
        $('.loadingSpinner').addClass('d-none').fadeOut(300)

    } else {
        let noMealsArr = []
        displayMeals(noMealsArr);

    }
    $('#containerSpinner').addClass('d-none').fadeOut(300)


}

async function searchByMealFirstletter(letter) {
    $('#containerSpinner').removeClass('d-none').fadeIn(300)

    letter == "" ? letter = "a" : "";
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.meals) {
        displayMeals(data.meals);
    } else {
        let noMealsArr = []
        displayMeals(noMealsArr);
    }

    $('#containerSpinner').addClass('d-none').fadeOut(300)

}
