console.log("trainers.js chargé");

document.addEventListener("DOMContentLoaded", function () {

    const select = document.getElementById("trainer-select");

    console.log("Menu trouvé :", select);

    if (!select) return;

    for (const trainerName in TRAINERS) {
        const option = document.createElement("option");
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

    const team = TRAINERS[name];

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

        const options = getSetOptions();


        // Premier Pokémon de l'équipe
        const firstPokemonName = team
            .trim()
            .split("\n")[0];


        // Recherche du set custom correspondant
        const firstPokemon = options.find(function (option) {

            return option.isCustom &&
                option.set.toLowerCase() === name.toLowerCase() &&
                option.pokemon.toLowerCase() === firstPokemonName.toLowerCase();

        });


        console.log(
            "Sets custom trouvés :",
            options.filter(option => option.isCustom)
        );


        console.log(
            "Pokemon automatique trouvé :",
            firstPokemon
        );


        if (!firstPokemon) {
            console.log("Aucun Pokémon trouvé");
            return;
        }


        const selector = $("#p2 .set-selector");


        console.log(
            "Sélection forcée :",
            firstPokemon
        );


        // Change la donnée Select2
        selector.select2("data", firstPokemon);

        setTimeout(function () {
            $("#p2 .select2-chosen")
                .text(firstPokemon.text);
        }, 50);


        // Change le texte affiché
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