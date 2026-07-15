function openPokemonBox() {

	$("#pokemon-box-window").remove();

	const html = `
	<div id="pokemon-box-window">

		<div class="box-header">
			<h2>Team / Box</h2>
			<button id="close-box">X</button>
		</div>

		<h3>Team</h3>
		<div id="team-container"></div>

		<hr>

		<h3>Box</h3>
		<div id="box-container"></div>

	</div>
	`;

	$(".wrapper").append(html);

	renderPokemonBox();

}





function renderPokemonBox() {

	$("#team-container").empty();
	$("#box-container").empty();


	// TEAM

	pokemonTeam.forEach(function(poke, index){

		$("#team-container").append(`
			<div class="pokemon-slot team-pokemon" data-id="${index}">
				<img class="pokemon-box-sprite"
				src="${getPokemonSprite(poke)}">

				<p>${poke.name}</p>

				<span>Lv.${poke.level}</span>
			</div>
		`);

	});



	// BOX

	pokemonBox.forEach(function(poke,index){

		$("#box-container").append(`
			<div class="pokemon-slot box-pokemon" data-id="${index}">

				<img class="pokemon-box-sprite"
				src="${getPokemonSprite(poke)}">

				<p>${poke.name}</p>

				<span>Lv.${poke.level}</span>

			</div>
		`);

	});

}





$(document).on("click","#close-box",function(){

	$("#pokemon-box-window").remove();

});






// Création du set dans le format natif du damage calc

function createImportedSet(poke){


	if(!setdex[poke.name]){
		setdex[poke.name] = {};
	}



	setdex[poke.name]["Imported"] = {


		level: poke.level || 100,

		item: poke.item || "",

		ability: poke.ability || "",

		nature: poke.nature || "Serious",


		evs: poke.evs || {},

		ivs: poke.ivs || {},


		moves: poke.moves || []

	};



	console.log(
		"Set importé :",
		setdex[poke.name]["Imported"]
	);



	// Ajout dans le pokedex

	if(!pokedex[poke.name]){


		pokedex[poke.name]={

			name: poke.name,

			types: poke.types,

			bs: poke.bs,

			weightkg: poke.weightkg,

			abilities: poke.abilities

		};

	}



	if(!calc.SPECIES[poke.name]){

		calc.SPECIES[poke.name] =
			pokedex[poke.name];

	}

	// Ajout dans les options du calculateur

	if (typeof SETDEX !== "undefined") {

		if (!SETDEX[poke.name]) {
			SETDEX[poke.name] = {};
		}

		SETDEX[poke.name]["Imported"] = setdex[poke.name]["Imported"];

		console.log(
			"Ajout SETDEX :",
			SETDEX[poke.name]["Imported"]
		);

	}



	return poke.name+" (Imported)";

}

function loadPokemonToP1(poke){

	console.log("Chargement P1 :", poke.name);


	// Création du set
	let fullSetName = createImportedSet(poke);


	let selector = $("#p1 .set-selector").first();


	if(!selector.length){
		console.log("Selector introuvable");
		return;
	}



	// Ajoute l'option dans le vrai select

	if(selector.find("option[value='" + fullSetName + "']").length === 0){

		selector.select2("data", {
			pokemon: poke.name,
			set: "Imported",
			text: fullSetName,
			id: fullSetName,
			isCustom:true
		});

	}



	console.log("Valeur injectée :", fullSetName);



	// IMPORTANT :
	// On utilise val puis change
	selector.val(fullSetName);



	// Synchronisation Select2
	selector.select2("data", {
		pokemon: poke.name,
		set: "Imported",
		text: fullSetName,
		id: fullSetName,
		isCustom:true
	});



	// Déclenche le vrai event Smogon

	selector.trigger("change");



	// Double sécurité pour les champs qui ne se mettent pas à jour

	setTimeout(function(){


		let set = setdex[poke.name]["Imported"];


		console.log("Set chargé :", set);



		$("#p1 .level")
			.val(set.level)
			.trigger("change");



		$("#p1 .type1")
			.val(poke.types[0])
			.trigger("change");



		$("#p1 .type2")
			.val(poke.types[1] || "")
			.trigger("change");



		$("#p1 .nature")
			.val(set.nature)
			.trigger("change");



		$("#p1 .ability")
			.val(set.ability)
			.trigger("change");



		$("#p1 .item")
			.val(set.item)
			.trigger("change");



		// attaques

		let moves = set.moves;


		for(let i=0;i<4;i++){


			let moveSelector =
				$("#p1 .move" + (i+1) + " select.move-selector");


			if(moveSelector.length && moves[i]){


				moveSelector.val(moves[i]);


				moveSelector.trigger("change");


			}

		}



		// recalcul stats

		if(typeof calcStats === "function"){

			calcStats($("#p1"));

			
			setTimeout(function(){


				let pokemonData = pokedex[poke.name];


				console.log("Application des stats de base :", pokemonData.bs);



				if(pokemonData){


					$("#p1 .hp .base")
						.val(pokemonData.bs.hp);



					$("#p1 .at .base")
						.val(pokemonData.bs.at);



					$("#p1 .df .base")
						.val(pokemonData.bs.df);



					$("#p1 .sa .base")
						.val(pokemonData.bs.sa);



					$("#p1 .sd .base")
						.val(pokemonData.bs.sd);



					$("#p1 .sp .base")
						.val(pokemonData.bs.sp);



					// Recalcul complet

					$("#p1 .calc-trigger").first()
						.trigger("change");


					if(typeof calcStats === "function"){
						calcStats($("#p1"));
					}


				}


			},500);

		}



		console.log("Chargement terminé :", poke.name);



	},300);

}

// =====================================
// CLIC SUR UN POKEMON DE LA BOX / TEAM
// =====================================


$(document).on(
	"click",
	".box-pokemon, .team-pokemon",
	function(){


		let id = Number($(this).attr("data-id"));

		let poke;



		if($(this).hasClass("box-pokemon")){

			poke = pokemonBox[id];

		}else{

			poke = pokemonTeam[id];

		}



		console.log(
			"Pokemon choisi :",
			poke
		);



		loadPokemonToP1(poke);


	}
);






// =====================================
// SPRITES
// =====================================


function getPokemonSprite(pokemon){


	let name = pokemon.name
		.toLowerCase()
		.replace(/[^a-z0-9]/g,"");



	return "https://play.pokemonshowdown.com/sprites/gen5/"
		+ name +
		".png";


}






// =====================================
// RAFRAICHIR LES LISTES SELECT2
// (utile après import)
// =====================================


function refreshImportedSets(){


	$(".set-selector").each(function(){


		$(this).select2("destroy");


	});


	loadDefaultLists();



	console.log(
		"Listes Select2 rechargées"
	);


}