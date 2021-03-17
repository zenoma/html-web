let urlParams = { page: 0 }

function getUrlFromParams() {
    let url = "";
    if (Object.entries(urlParams)) {
        url += "?"
        for (const [key, value] of Object.entries(urlParams)) {
            url += key + "=" + value + "&"
        }
    }
    return url.slice(0, -1);
}

function initUrlParams() {
    let startIndex = window.location.href.indexOf('?');
    if (startIndex != -1) {
        let params = window.location.href.substr(startIndex + 1, window.location.href.length - 1).split("&");
        params =
            params.forEach(element => {
                urlParams[element.split('=')[0]] = element.split('=')[1];
            });
    }
}

main();

function main() {
    initUrlParams();
    fillDropdownList();
    if (urlParams.type) {
        pokemonFilterList("https://pokeapi.co/api/v2/type/" + urlParams.type);
    } else if (urlParams.generation) {
        pokemonFilterList("https://pokeapi.co/api/v2/generation/" + urlParams.generation);
    } else if (urlParams.ability) {
        pokemonFilterList("https://pokeapi.co/api/v2/ability/" + urlParams.ability);
    } else {
        if (urlParams.page) {
            pokemonList("https://pokeapi.co/api/v2/pokemon?offset=" + urlParams.page * 20 + "&limit=20");
        } else {
            pokemonList("https://pokeapi.co/api/v2/pokemon");
        }
    }
}

function pokemonFilterList(baseUrl) {
    fetch(baseUrl)
        .then(Response => {
            if (Response.ok) {
                return Response.json();
            } else {
                throw Error('error');
            }
        })
        .then(response => {
            let json_stats; let json_pok;
            if (urlParams.generation) {
                json_pok = response['pokemon_species'];
            } else if (urlParams.type || urlParams.ability) {
                json_pok = response['pokemon'];
            }
            let index = 0;
            let count = Math.min(20, json_pok.length);
            let b = document.getElementById("pokemonList");
            if (urlParams.page) {
                index += urlParams.page * 20;
                count += Math.min(urlParams.page * 20, json_pok.length - 1);
            }
            for (index; index < count; index++) {
                element = json_pok[index];
                let url = "";
                if (urlParams.generation) {
                    url = "https://pokeapi.co/api/v2/pokemon/" + element.name
                } else if (urlParams.type || urlParams.ability) {
                    url = element.pokemon.url;
                    element = element.pokemon;
                }
                fetch(url)
                    .then(Response => {
                        if (Response.ok) {
                            return Response.json();
                        } else {
                            throw Error('error');
                        }
                    })
                    .then(response => {
                        json_stats = response;
                        let text = '<a class="pokemonItem" href="./details.html?id=' + response.name + '">' +
                            '<h2 class ="nameList">' + response.name + '</h2>' +
                            '<img alt="Pokemon image" src="' + json_stats.sprites.other["official-artwork"].front_default + '">' +
                            '<div class="pokemonType">';

                        json_stats.types.forEach(element => {
                            text += ' <span class="' + element.type.name + '">' + element.type.name + '</span>';
                        });
                        text += ' </div></a>';
                        b.insertAdjacentHTML('beforeend', text);
                    });
            }
            if (count < json_pok.length) {
                createNextButton();
            }
            if (urlParams.page != 0) {
                createPreviousButton();
            }
        }).catch(function (error) {
            let b = document.getElementById("pokemonList");
            b.insertAdjacentHTML('beforeend', '<h2> No results</h2>');
        });
}

function pokemonList(baseUrl) {
    fetch(baseUrl)
        .then(Response => {
            if (Response.ok) {
                return Response.json();
            } else {
                throw Error('error');
            }
        })
        .then(response => {
            let json_stats;
            let json_pok = response['results'];
            for (let index = 0; index < json_pok.length; index++) {
                let element = json_pok[index];
                let list = document.getElementById("pokemonList");
                list.insertAdjacentHTML("beforeend", "<div id = 'pokemon-" + index + "' class='pokemonItem'></div>")
                fetch(element.url)
                    .then(Response => {
                        if (Response.ok) {
                            return Response.json();
                        } else {
                            throw Error('error');
                        }
                    })
                    .then(response => {
                        let pokemonDiv = document.getElementById("pokemon-" + index);
                        json_stats = response;
                        let text = '<a href="./details.html?id=' + element.url.split("/pokemon/")[1] + '">' +
                            '<h2 class ="nameList">' + element.name + '</h2>' +
                            '<img alt="Pokemon image" src="' + json_stats.sprites.other["official-artwork"].front_default + '">' +
                            '<div class="pokemonType">';

                        json_stats.types.forEach(element => {
                            text += ' <span class="' + element.type.name + '">' + element.type.name + '</span>';
                        });
                        text += ' </div></a>';
                        pokemonDiv.insertAdjacentHTML('beforeend', text);
                    });
            }
            if (response.next) {
                createNextButton();
            }
            if (response.previous) {
                createPreviousButton();
            }
        });
}

function createNextButton() {
    initUrlParams();
    let a = document.getElementById("pageButtons");
    if (urlParams.page) {
        urlParams.page = (parseInt(urlParams.page.valueOf()) + 1).toString();
    } else {
        urlParams.page = "1";
    }
    a.insertAdjacentHTML('afterbegin', "<div class='buttonWrapper'><a id='nextButton' href='" + getUrlFromParams() + "' role='button'>Next</a></div>");
    urlParams.page = (parseInt(urlParams.page.valueOf()) - 1).toString();
}

function createPreviousButton() {
    initUrlParams();
    let a = document.getElementById("pageButtons");
    if (urlParams.page) {
        urlParams.page = (parseInt(urlParams.page.valueOf()) - 1).toString();
    }
    a.insertAdjacentHTML('afterbegin', "<div class='buttonWrapper'><a id='previousButton' href='" + getUrlFromParams() + "' role='button'>Previous</a></div>");
    urlParams.page = (parseInt(urlParams.page.valueOf()) + 1).toString();
}

function fillDropdownList() {
    const GENERATIONS_URL = "https://pokeapi.co/api/v2/generation";
    const FILTER_GENERATION = "generation";
    const TYPES_URL = "https://pokeapi.co/api/v2/type";
    const FILTER_TYPE = "type";
    const ABILITYS_URL = "https://pokeapi.co/api/v2/ability";
    const FILTER_ABILITY = "ability";
    let dropdownFillInfo = [{
        url: GENERATIONS_URL,
        dropdown: "generationsDropdown",
        filter: FILTER_GENERATION
    },
    {
        url: TYPES_URL,
        dropdown: "typesDropdown",
        filter: FILTER_TYPE
    },
    {
        url: ABILITYS_URL,
        dropdown: "abilitiesDropdown",
        filter: FILTER_ABILITY
    }];
    dropdownFillInfo.forEach(element => {
        fetch(element.url)
            .then(Response => {
                if (Response.ok) {
                    return Response.json();
                } else {
                    throw Error('error');
                }
            })
            .then(response => {
                let json_gen = response['results'];
                json_gen.forEach(item => {
                    let a = document.getElementById(element.dropdown);
                    a.insertAdjacentHTML('beforeend', '<div class="itemDropdown" onclick="dropDownClick(\'' + element.filter + '\',\'' + item.name + '\')">' + item.name + '</div>')
                });
            });
    });
}

function showDropdown(string) {
    document.getElementById(string).classList.toggle("show");
}

function filterDropdown(input, dropdown) {
    let inputElement, filter, ul, li, a, i;
    inputElement = document.getElementById(input);
    filter = inputElement.value.toUpperCase();
    div = document.getElementById(dropdown);
    a = div.getElementsByTagName("div");
    for (i = 0; i < a.length; i++) {
        txtValue = a[i].textContent || a[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}


function dropDownClick(filter, name) {
    window.location.href = "?" + filter + "=" + name;
}

document.getElementById("wrapper").addEventListener("click", goHome);

function goHome() {
    window.location.href = "./index.html"
}

