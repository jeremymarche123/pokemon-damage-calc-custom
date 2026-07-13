console.log("trainers.js chargé");

document.addEventListener("DOMContentLoaded", function () {

    var select = document.getElementById("trainer-select");

    console.log("Menu trouvé :", select);

    if (!select) return;

    for (var trainerName in TRAINERS) {

        var option = document.createElement("option");
        option.value = trainerName;
        option.textContent = trainerName;
        select.appendChild(option);

    }

    select.addEventListener("change", function () {

        if (this.value) {
            loadTrainer(this.value);
        }

    });

});


function loadTrainer(name) {

    console.log("Dresseur choisi :", name);

    var team = TRAINERS[name];

    if (!team) {

        console.log("Dresseur introuvable");
        return;

    }

    console.log("Équipe :", team);


    // Ajoute les sets personnalisés
    addSets(team, name);


    // Recharge les listes du calculateur
    loadDefaultLists();


    setTimeout(function () {

        var options = getSetOptions();


        // Premier Pokémon de l'équipe
        var firstPokemonName = team
            .trim()
            .split("\n")[0];


        // Recherche du set custom correspondant
        var firstPokemon = options.find(function (option) {

            return option.isCustom &&
                option.set.toLowerCase() === name.toLowerCase() &&
                option.pokemon.toLowerCase() === firstPokemonName.toLowerCase();

        });


        console.log(
            "Sets custom trouvés :",
            options.filter(function (option) {
                return option.isCustom;
            })
        );


        console.log(
            "Pokemon automatique trouvé :",
            firstPokemon
        );


        if (!firstPokemon) {

            console.log("Aucun Pokémon trouvé");
            return;

        }


        var selector = $("#p2 .set-selector");


        console.log(
            "Sélection forcée :",
            firstPokemon
        );


        // Change la donnée Select2
        selector.select2("data", firstPokemon);


        // Change le texte affiché après le rafraîchissement Select2
        setTimeout(function () {

            $("#p2 .select2-chosen")
                .text(firstPokemon.text);

        }, 50);


        // Change aussi immédiatement le texte affiché
        selector.closest("#p2")
            .find(".select2-chosen")
            .text(firstPokemon.text);


        // Force les événements du calculateur
        selector.trigger({

            type: "select2-selecting",
            val: firstPokemon.id,
            object: firstPokemon

        });


        selector.trigger({

            type: "change",
            added: firstPokemon

        });


        selector.trigger("change");


        console.log(
            "Sélection envoyée au calculateur"
        );


    }, 1000);

}