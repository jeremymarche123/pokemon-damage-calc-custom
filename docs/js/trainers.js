console.log("trainers.js chargé");

document.addEventListener("DOMContentLoaded", function () {

    console.log("TRAINERS =", TRAINERS);

    const select = document.getElementById("trainer-select");

    console.log("Menu trouvé =", select);

    if (!select) {
        console.log("Pas de menu trainer-select");
        return;
    }

    for (const trainer in TRAINERS) {

        console.log("Ajout :", trainer);

        const option = document.createElement("option");
        option.value = trainer;
        option.textContent = trainer;

        select.appendChild(option);
    }

});