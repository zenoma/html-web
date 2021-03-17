let info = "";
main();

function main() {
    let baseUrl = "https://pokeapi.co/api/v2/pokemon/";
    let pokemonId = window.location.href.split("?id=")[1].replace("/", "");
    details(baseUrl, pokemonId);
}

function details(baseUrl, pokemonId) {
    fetch(baseUrl + pokemonId)
        .then(Response => {
            if (Response.ok) {
                return Response.json();
            } else {
                throw Error('error');
            }
        })
        .then(response => {
            let text = "";
            info = response;
            let json_det = response;
            let title = document.getElementById("title");
            let type = document.getElementById("pokemonType");
            let desc = document.getElementById("abilities");
            let statsTable = document.getElementById("statsTable");

            //insertar cabecera(nombre y nº) e imagen
            title.insertAdjacentHTML('beforeend', '<h1 id=pokemonName >' + json_det.name + '</h1>' +
                ' <span id="pokedexId">#' + json_det.id + '</span>' +
                '<img id=pokimg src="' + json_det.sprites.other["official-artwork"].front_default + '"  alt="Pokemon image">');

            //los tipos
            json_det.types.forEach(element => {
                text += ' <a href="./index.html?type=' + element.type.name + '"class="' + element.type.name + '">' + element.type.name + '</a>';
            });
            type.insertAdjacentHTML('afterbegin', text);

            //habilidades
            text = "<strong>Abilities: </strong>";
            json_det.abilities.forEach(element => {
                text += ' <a href="./index.html?ability=' + element.ability.name + '"class="ability">' + element.ability.name + '</span>';
            });
            desc.insertAdjacentHTML('beforeend', text);

            //stats(HP,Attack,Defense)
            let stat = "";
            json_det.stats.forEach(element => {
                stat += '<tr class="statRow">' +
                    '<td class= "' + element.stat.name + ' stat">' + element.stat.name + '</td>' +
                    '<td id="barStat" class="barStat">' +
                    '<div id="bar" class="barStatFill" style="width:' + element.base_stat + 'px;">' + element.base_stat + '</div>' +
                    '</td></tr>';
            })
            statsTable.insertAdjacentHTML('beforeend', stat);
            encounters(baseUrl, pokemonId);
            evolution(baseUrl, pokemonId);
        }).catch(function (error) {
            console.log("error ");
            document.getElementsByClassName('pokemonDetails')[0].innerHTML = "<h3> Doesn't exist a pokemon with that ID or name. Please try again </h3>";
        });
}

function encounters(baseUrl, pokemonId) {
    //encounters
    fetch(baseUrl + pokemonId + "/encounters")
        .then(Response => {
            if (Response.ok) {
                return Response.json();
            } else {
                throw Error('error');
            }
        })
        .then(response => {
            let json_enc = response;
            let encounters = document.getElementById("encounterAreas");
            json_enc.forEach(element => {
                encounters.insertAdjacentHTML('beforeend', '<div class="area">' + element.location_area.name.slice(0, -5) + '</div>');
            });
        })

}

function evolution(baseUrl, pokemonId) {
    //html structure
    let evolution = document.getElementById("pokemonEvolution");
    evolution.insertAdjacentHTML('beforeend', '<div id="lvl1"></div> <div id="lvl2"></div><div id="lvl3"></div>');

    //evolutions
    fetch(info.species.url)
        .then(Response => {
            if (Response.ok) {
                return Response.json();
            } else {
                throw Error('error');
            }
        })
        .then(response => {
            let json_evo = response;
            fetch(json_evo.evolution_chain.url)
                .then(Response => {
                    if (Response.ok) {
                        return Response.json();
                    } else {
                        throw Error('error');
                    }
                })
                .then(response => {
                    let json_chain = response;

                    //First one of the chain
                    let lvl1 = document.getElementById("lvl1");
                    let chain1 = '<h3 class="chain1">' + json_chain.chain.species.name + '</h3>';
                    fetch(baseUrl + json_chain.chain.species.name)
                        .then(Response => {
                            if (Response.ok) {
                                return Response.json();
                            } else {
                                throw Error('error');
                            }
                        })
                        .then(response => {
                            let json_stats = response;
                            chain1 = '<a class="EvolutionCard" href="./details.html?id=' + json_stats.name + '"><img alt="Pokemon image" src="' + json_stats.sprites.other["official-artwork"].front_default + '">' + chain1 + '</a>';
                            lvl1.insertAdjacentHTML('beforeend', chain1 + '<i class="fa fa-arrow-down" aria-hidden="true"></i>');
                        })

                    //second one of the chain
                    json_chain.chain.evolves_to.forEach(element => {
                        let lvl2 = document.getElementById("lvl2");
                        let chain2 = '<h3 class="chain2">' + element.species.name + '</h3>';
                        fetch(baseUrl + element.species.name)
                            .then(Response => {
                                if (Response.ok) {
                                    return Response.json();
                                } else {
                                    throw Error('error');
                                }
                            })
                            .then(response => {
                                let json_stats = response;
                                chain2 = '<a class="EvolutionCard" href="./details.html?id=' + json_stats.name + '"><img alt="Pokemon image" src="' + json_stats.sprites.other["official-artwork"].front_default + '">' + chain2 + '</a>';
                                lvl2.insertAdjacentHTML('beforeend', chain2);
                            })
                        text = '';

                        //Third one of the chain
                        for (let index = 0; index < element.evolves_to.length; index++) {
                            console.log(index, element.evolves_to.length)
                            let lvl3 = document.getElementById("lvl3");
                            var pokemon = element.evolves_to[index];
                            let chain3 = '<h3 class="chain3">' + pokemon.species.name + '</h3>';
                            fetch(baseUrl + pokemon.species.name)
                                .then(Response => {
                                    if (Response.ok) {
                                        return Response.json();
                                    } else {
                                        throw Error('error');
                                    }
                                })
                                .then(response => {
                                    let json_stats = response;
                                    if (index == 0) {
                                        lvl3.insertAdjacentHTML('beforeend', '<i class="fa fa-arrow-down" aria-hidden="true"></i>');
                                    }
                                    chain3 = '<a class="EvolutionCard" href="./details.html?id=' + json_stats.name + '"><img alt="Pokemon image" src="' + json_stats.sprites.other["official-artwork"].front_default + '">' + chain3 + '</a>';
                                    lvl3.insertAdjacentHTML('beforeend', chain3);
                                })
                        }
                    })
                })
        })
}

document.getElementById("wrapper").addEventListener("click", goHome);
document.getElementById("backButton").addEventListener("click", goBack);

function goBack() {
    history.back();
}
function goHome() {
    window.location.href = "./index.html"
}