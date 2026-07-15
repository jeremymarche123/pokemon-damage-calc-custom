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


	// Affiche l'équipe du dresseur dans la box
	showTrainerTeam(team, name);


	setTimeout(function () {


		var options = window.TRAINER_OPTIONS || [];


		// Premier Pokémon de l'équipe
		var firstPokemonName = team
			.trim()
			.split("\n")[0];


		// Cherche le premier Pokémon dans les options du dresseur
		var firstPokemon = options.find(function (option) {

			return option.isCustom &&
				option.set.toLowerCase() === name.toLowerCase() &&
				option.pokemon.toLowerCase() === firstPokemonName.toLowerCase();

		});


		console.log(
			"Options du dresseur :",
			options
		);


		console.log(
			"Premier Pokémon trouvé :",
			firstPokemon
		);


		if (!firstPokemon) {

			console.log(
				"Aucun Pokémon trouvé pour :",
				firstPokemonName
			);

			return;

		}


		var selector = $("#p2 .set-selector");


		console.log(
			"Chargement dans Pokémon 2 :",
			firstPokemon
		);


		// Nettoie l'ancien Pokémon
		selector.select2("data", null);


		// Charge le nouveau Pokémon
		selector.select2("data", firstPokemon);


		// Force le calculateur à prendre le changement
		selector.trigger({

			type: "select2-selecting",
			val: firstPokemon.id,
			object: firstPokemon

		});


		selector.trigger({

			type: "change",
			added: firstPokemon

		});


		// Force l'affichage du nom
		setTimeout(function () {

			selector
				.parent()
				.find(".select2-chosen")
				.first()
				.text(firstPokemon.text);


			console.log(
				"Nom affiché :",
				firstPokemon.text
			);

		},100);


	},100);


}

function showTrainerTeam(team, name) {

	var container = $("#trainer-team-list");

	container.empty();


	// Stockage des Pokémon du dresseur sans toucher aux listes globales
	window.TRAINER_OPTIONS = [];


	var pokemons = team
		.trim()
		.split("\n\n");


	var title = $("<h3>")
		.text("Équipe " + name);

	container.append(title);


	pokemons.forEach(function (pokemon) {


		var lines = pokemon.split("\n");


		var pokemonName = lines[0].trim();


		// Création de l'option pour le chargement P2
		var option = {

			pokemon: pokemonName,

			set: name,

			text: pokemonName + " (" + name + ")",

			id: pokemonName + " (" + name + ")",

			isCustom: true,

			nickname: ""

		};


		window.TRAINER_OPTIONS.push(option);



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


	console.log(
		"TRAINER_OPTIONS créés :",
		window.TRAINER_OPTIONS
	);

}

function loadPokemonFromTrainer(trainer, pokemonName) {


	var options = window.TRAINER_OPTIONS || [];


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
		"Pokémon chargé depuis le dresseur :",
		pokemon
	);

}

//test