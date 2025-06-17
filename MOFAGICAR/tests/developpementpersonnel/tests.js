
let testIdentifiant = ""; // Clé unique pour isoler les données du test

// -------- Apparence et effet lors du scroll -------- //
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  header.style.boxShadow = window.scrollY > 130 ? "0px 1px rgba(255, 102, 0)" : "0px 1px rgba(255, 102, 0, 0)";
  header.style.backgroundColor = window.scrollY > 130 ? "#f0f2f5" : "transparent";
});

// -------- Retour vers la page précédente -------- //
function retourAction() {
  if (window.history.length > 1) {
    history.back();
  } else {
    window.location.href = "../../index.html";
  }
}

// -------- Chargement du footer -------- //
fetch("../../footer.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("footer-container").innerHTML = data;
  });

// -------- Chargement dynamique du test via JSON -------- //
document.addEventListener("DOMContentLoaded", () => {
  testIdentifiant = new URLSearchParams(window.location.search).get("test");
  if (!testIdentifiant) {
    document.getElementById("barre-de-titre").textContent = "Aucun test sélectionné.";
    return;
  }

  fetch("tests.json")
    .then((res) => res.json())
    .then((data) => {
      const test = data.tests.find((t) => t.id === testIdentifiant);
      if (!test) {
        document.getElementById("barre-de-titre").textContent = "Test introuvable.";
        return;
      }

      afficherTest(test);
      restaurerReponses(test);
    })
    .catch((err) => {
      console.error("Erreur de chargement :", err);
      document.getElementById("barre-de-titre").textContent = "Erreur de chargement.";
    });
});

function afficherTest(test) {
  document.getElementById("barre-de-titre").textContent = test.titre;

  const illustration = document.getElementById("illustration-container");
  illustration.innerHTML = test.image
    ? `<img src="${test.image}" alt="${test.titre}" class="illustration-img">`
    : "";

  document.getElementById("test-description").innerHTML = `<p>${test.description}</p>`;

  const container = document.getElementById("test-dimensions");
  container.innerHTML = "";

  test.dimensions.forEach((dim, index) => {
    const section = document.createElement("div");
    section.classList.add("dimension-section");

    let html = `
      <div id="${dim.id}">
        <h2>${dim.titre}</h2>
        <div class="dimension-presentation"><p>${dim.description}</p></div>
    `;

    dim.affirmations.forEach((q, i) => {
      const name = `${dim.id}${i + 1}`;
      html += `
        <div class="question">
          <p>${q}</p>
          <label><input type="radio" name="${name}" value="4"> Tout à fait vrai</label><br>
          <label><input type="radio" name="${name}" value="3"> Plutôt vrai</label><br>
          <label><input type="radio" name="${name}" value="2"> Plutôt faux</label><br>
          <label><input type="radio" name="${name}" value="1"> Tout à fait faux</label>
        </div>
      `;
    });

    const resultId = `result${index}`;
    html += `
        <button onclick="calculerResultat('${dim.id}', ${dim.affirmations.length}, '${resultId}')">Voir le score</button>
        <div id="${resultId}" class="resultat-bloc"></div>
      </div>
    `;

    section.innerHTML = html;
    container.appendChild(section);
  });
}

// -------- Calcul du score par dimension -------- //
function calculerResultat(prefix, nbQuestions, resultId) {
  let total = 0;
  let toutesRepondues = true;

  for (let i = 1; i <= nbQuestions; i++) {
    const name = `${prefix}${i}`;
    const radios = document.getElementsByName(name);
    let repondu = false;

    for (const radio of radios) {
      if (radio.checked) {
        total += parseInt(radio.value);
        localStorage.setItem(`${testIdentifiant}_${name}`, radio.value);
        repondu = true;
        break;
      }
    }

    if (!repondu) {
      toutesRepondues = false;
      break;
    }
  }

  if (!toutesRepondues) {
    alert("Veuillez répondre à toutes les affirmations avant de voir le score !");
    return;
  }

  const max = nbQuestions * 4;
  localStorage.setItem(`${testIdentifiant}_${resultId}`, total);
  document.getElementById(resultId).textContent = `Votre score est : ${total} / ${max}`;
}

// -------- Restauration des réponses -------- //
function restaurerReponses(test) {
  test.dimensions.forEach((dim, index) => {
    const resultId = `result${index}`;
    const nb = dim.affirmations.length;

    for (let i = 1; i <= nb; i++) {
      const name = `${dim.id}${i}`;
      const saved = localStorage.getItem(`${testIdentifiant}_${name}`);
      if (saved) {
        const radios = document.getElementsByName(name);
        for (const radio of radios) {
          if (radio.value === saved) {
            radio.checked = true;
            break;
          }
        }
      }
    }

    const savedResult = localStorage.getItem(`${testIdentifiant}_${resultId}`);
    if (savedResult) {
      const max = nb * 4;
      document.getElementById(resultId).textContent = `Votre score est : ${savedResult} / ${max}`;
    }
  });
}

// -------- Réinitialisation locale du test -------- //
function reinitialiserTestComplet() {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith(`${testIdentifiant}_`)) {
      localStorage.removeItem(key);
    }
  });

  const radios = document.querySelectorAll('input[type="radio"]');
  radios.forEach((r) => (r.checked = false));

  const resultats = document.querySelectorAll(".resultat-bloc");
  resultats.forEach((r) => (r.textContent = ""));
}