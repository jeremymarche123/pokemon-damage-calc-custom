/* global TRAINERS, addSets, loadDefaultLists, getSetOptions, $ */

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
	showTrainerTeam(team, name);


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

		// Force Select2 à oublier l'ancien Pokémon
		selector.select2("data", null);


		// Change la donnée Select2
		selector.select2("data", firstPokemon);


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


		// Force uniquement l'affichage après le rafraîchissement
		setTimeout(function () {

			selector
				.parent()
				.find(".select2-chosen")
				.first()
				.text(firstPokemon.text);

			console.log("Nom affiché forcé :", firstPokemon.text);

		}, 100);


		console.log(
			"Sélection envoyée au calculateur"
		);


	}, 1000);

}

function showTrainerTeam(team, name) {

	var container = $("#trainer-team-list");

	container.empty();


	var pokemons = team
		.trim()
		.split("\n\n");


	var title = $("<h3>")
		.text("Équipe " + name);

	container.append(title);


	pokemons.forEach(function (pokemon) {

		var pokemonName = pokemon
			.split("\n")[0];


		var button = $("<button>")
			.text(pokemonName)
			.addClass("trainer-pokemon-button");


		button.on("click", function () {

			loadPokemonFromTrainer(
				name,
				pokemonName
			);

		});


		container.append(button);

	});

}

function loadPokemonFromTrainer(trainer, pokemonName) {


	var options = getSetOptions();


	var pokemon = options.find(function(option) {

		return option.isCustom &&
			option.set.toLowerCase() === trainer.toLowerCase() &&
			option.pokemon.toLowerCase() === pokemonName.toLowerCase();

	});


	if (!pokemon) {

		console.log("Pokémon introuvable :", pokemonName);
		return;

	}


	var selector = $("#p2 .set-selector");


	selector.select2("data", null);

	selector.select2("data", pokemon);


	selector.trigger({

		type: "select2-selecting",
		val: pokemon.id,
		object: pokemon

	});


	selector.trigger({

		type: "change",
		added: pokemon

	});


	selector
		.parent()
		.find(".select2-chosen")
		.first()
		.text(pokemon.text);


	console.log(
		"Pokémon chargé :",
		pokemon
	);

}