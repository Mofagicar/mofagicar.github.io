// -------- Chargement doux de la page -------- //
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
  ajusterMargeContenu();
});

window.addEventListener("resize", ajusterMargeContenu);

// -------- Ombre et couleur au scroll -------- //
window.addEventListener("scroll", function () {
  const header = document.querySelector("header");
  header.style.boxShadow = window.scrollY > 35 ? "0px 1px rgba(255, 102, 0)" : "0px 1px rgba(255, 102, 0, 0)";
  header.style.backgroundColor = window.scrollY > 35 ? "#f0f2f5" : "transparent";
});

// -------- Navigation vers formations -------- //
function fdecouvrir()     { window.location.href = "formations/formations.html?formation=personnalite"; }
function fconfiance()     { window.location.href = "formations/formations.html?formation=confiance"; }
function fstress()        { window.location.href = "formations/formations.html?formation=stress"; }
function fcommunication() { window.location.href = "formations/formations.html?formation=communication"; }
function fproductivite()  { window.location.href = "formations/formations.html?formation=productivite"; }
function fmindset()       { window.location.href = "formations/formations.html?formation=mindset"; }
function fdiscipline()    { window.location.href = "formations/formations.html?formation=discipline"; }
function fcharisme()      { window.location.href = "formations/formations.html?formation=charisme"; }
function fintelligence()  { window.location.href = "formations/formations.html?formation=intelligence"; }
function ftimidite()      { window.location.href = "formations/formations.html?formation=timidite"; }

// -------- Navigation vers tests -------- //
function testPersonnalite()   { window.location.href = "tests/developpementpersonnel/tests.html?test=personnalite"; }
function testConfiance()      { window.location.href = "tests/developpementpersonnel/tests.html?test=confiance"; }
function testStress()         { window.location.href = "tests/developpementpersonnel/tests.html?test=stress"; }
function testCommunication()  { window.location.href = "tests/developpementpersonnel/tests.html?test=communication"; }
function testProductivite()   { window.location.href = "tests/developpementpersonnel/tests.html?test=productivite"; }
function testMindset()        { window.location.href = "tests/developpementpersonnel/tests.html?test=mindset"; }
function testMotivation()     { window.location.href = "tests/developpementpersonnel/tests.html?test=motivation"; }
function testCharisme()       { window.location.href = "tests/developpementpersonnel/tests.html?test=charisme"; }
function testIntelligence()   { window.location.href = "tests/developpementpersonnel/tests.html?test=intelligence"; }
function testTimidite()       { window.location.href = "tests/developpementpersonnel/tests.html?test=timidite"; }

// -------- Ajuster la marge sous le header -------- //
function ajusterMargeContenu() {
  const header = document.querySelector("header");
  const contenu = document.getElementById("contenu");
  if (header && contenu) {
    const hauteurHeader = header.offsetHeight;
    contenu.style.paddingTop = `${hauteurHeader}px`;
  }
}

function toggleMenu() {
  const menuBar = document.getElementById("barre-menu");
  
  if (menuBar.classList.contains("show")) {
    // Retire la classe après l'animation
    menuBar.classList.remove("show");
    setTimeout(() => {
      menuBar.style.display = "none"; // Cache complètement après 500ms
    }, 500);
  } else {
    menuBar.style.display = "flex"; // Affiche avant d'ajouter l'animation
    setTimeout(() => {
      menuBar.classList.add("show");
    }, 10); // Petit délai pour éviter un saut visuel
  }
}

//--------afficher/masquer la barre de menu-------//

function toggleMenu() {
  const menuBar = document.getElementById("barre-menu");
  menuBar.classList.toggle("show");
  ajusterMargeContenu(); // Ajuste l’espace du reste du contenu
}

//--------afficher/masquer la barre de recherche-------//

function toggleIcone() {
  const iconeBar = document.getElementById("barre-de-recherche");
  iconeBar.classList.toggle("show");
  ajusterMargeContenu(); // Ajuste l’espace du reste du contenu
}

// -------- Footer dynamique -------- //
fetch("footer.html")
  .then(response => response.text())
  .then(data => {
    document.getElementById("footer-container").innerHTML = data;
  });

// -------- Moteur de recherche intelligent -------- //
document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("searchInput");
  const resultatsDiv = document.getElementById("resultats-recherche");
  const clearBtn = document.getElementById("clearSearch");
  const contenu = document.getElementById("contenu");
  const barreRecherche = document.getElementById("barre-de-recherche");

  let tests = [];
  let formations = {};

  async function chargerDonnees() {
    const resTests = await fetch('tests/developpementpersonnel/tests.json');
    tests = (await resTests.json()).tests;

    const resFormations = await fetch('formations/formations.json');
    formations = await resFormations.json();
  }

  function texteCompletFormation(f) {
    let contenu = f.titre + " " + (f.presentation || "");
    if (f.jours) {
      f.jours.forEach(j => contenu += " " + j.titre + " " + j.description);
    }
    return contenu.toLowerCase();
  }

  function texteCompletTest(t) {
    let contenu = t.titre + " " + (t.description || "");
    if (t.dimensions) {
      t.dimensions.forEach(dim => {
        contenu += " " + dim.titre + " " + dim.description;
        if (dim.affirmations) contenu += " " + dim.affirmations.join(" ");
      });
    }
    return contenu.toLowerCase();
  }

  function rechercher(terme) {
    terme = terme.toLowerCase();
    resultatsDiv.innerHTML = "";

    const matchesFormations = Object.entries(formations).filter(([id, f]) =>
      texteCompletFormation(f).includes(terme)
    );

    const matchesTests = tests.filter(t =>
      texteCompletTest(t).includes(terme)
    );

    if (matchesTests.length === 0 && matchesFormations.length === 0) {
      resultatsDiv.innerHTML = "<p style='padding:10px;'>Aucun résultat.</p>";
      return;
    }

    if (matchesFormations.length > 0) {
      resultatsDiv.innerHTML += "<h3>Formations</h3><ul>" +
        matchesFormations.map(([id, f]) => `
          <li onclick="${'f' + id}()">
            <img src="${f.illustration.replace('../', '')}" alt="${f.titre}"> ${f.titre}
          </li>`).join("") + "</ul>";
    }

    if (matchesTests.length > 0) {
      resultatsDiv.innerHTML += "<h3>Tests</h3><ul>" +
        matchesTests.map(t => `
          <li onclick="${'test' + t.id.charAt(0).toUpperCase() + t.id.slice(1)}()">
            <img src="${t.image.replace('../../', '')}" alt="${t.titre}"> ${t.titre}
          </li>`).join("") + "</ul>";
    }
  }

  input.addEventListener("input", () => {
    const terme = input.value.trim();
    clearBtn.style.display = terme.length > 0 ? "block" : "none";
    if (terme.length >= 2) {
      contenu.classList.add("assombri");
      resultatsDiv.style.display = "block";
      rechercher(terme);
    } else {
      contenu.classList.remove("assombri");
      resultatsDiv.innerHTML = "";
      resultatsDiv.style.display = "none";
    }
  });

  clearBtn.addEventListener("click", () => {
    input.value = "";
    clearBtn.style.display = "none";
    resultatsDiv.innerHTML = "";
    resultatsDiv.style.display = "none";
    contenu.classList.remove("assombri");
    input.focus();
  });

  document.addEventListener("click", (e) => {
    const cliqueDansBarre = barreRecherche.contains(e.target);
    const cliqueDansResultats = resultatsDiv.contains(e.target);
    const cliqueDansLoupe = e.target.closest(".icone-de-recherche");

    if (!cliqueDansBarre && !cliqueDansResultats && !cliqueDansLoupe) {
      input.value = "";
      resultatsDiv.innerHTML = "";
      resultatsDiv.style.display = "none";
      clearBtn.style.display = "none";
      contenu.classList.remove("assombri");
    }
  });

  chargerDonnees();
});