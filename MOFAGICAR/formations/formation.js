
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

// Effets visuels sur le header lors du scroll
window.addEventListener("scroll", function () {
  const header = document.querySelector("header");
  const barreTitre = document.getElementById("barre-de-titre");

  if (window.scrollY > 122) {
    header.style.boxShadow = "0px 1px rgba(255, 102, 0)";
    header.style.backgroundColor = "#f0f2f5";
    barreTitre.style.display = "flex";
  } else {
    header.style.boxShadow = "0px 1px rgba(255, 102, 0, 0)";
    header.style.backgroundColor = "transparent";
    
  }
});

// Charger le footer commun
fetch("../footer.html")
  .then(response => response.text())
  .then(data => {
    document.getElementById("footer-container").innerHTML = data;
  });

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const formationKey = params.get("formation");

  if (!formationKey) {
    document.body.innerHTML = "<p>Formation introuvable.</p>";
    return;
  }

  fetch("formations.json")
    .then((response) => response.json())
    .then((data) => {
      const formation = data[formationKey];
      if (!formation) {
        document.body.innerHTML = "<p>Formation non trouvée.</p>";
        return;
      }

      // Titre
      const barreTitre = document.getElementById("barre-de-titre");
      barreTitre.textContent = formation.titre;
      barreTitre.style.display = "flex";

      // Illustration
      const illustrationContainer = document.getElementById("illustration-container");
      const img = document.createElement("img");
      img.src = formation.illustration;
      img.alt = "Illustration";
      img.style.maxHeight = "100%";
      img.style.maxWidth = "100%";
      img.style.margin = "auto";
      illustrationContainer.appendChild(img);

      // Présentation
      document.getElementById("content-container").innerHTML = formation.presentation;

      // Contenu des jours
      const btnContainer = document.getElementById("buttons-container");

      formation.jours.forEach((jour, index) => {
        const btn = document.createElement("button");
        btn.className = "jour-bouton";
        btn.innerHTML = jour.titre;

        const icon = document.createElement("img");
        icon.src = "../images/down.png";
        icon.className = "icone-down";
        icon.style.marginLeft = "8px";
        icon.style.verticalAlign = "middle";
        btn.appendChild(icon);

        const desc = document.createElement("div");
        desc.className = "jour-description";
        desc.innerHTML = jour.description;
        desc.style.display = "none";

        // Bouton de progression (checkbox)
        const progressWrapper = document.createElement("div");
        progressWrapper.className = "progression-wrapper";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "progression-checkbox";
        checkbox.id = `jour-${index}-check`;

        const key = `${formationKey}-jour-${index}`;
        if (localStorage.getItem(key) === "done") {
          checkbox.checked = true;
        }

        const updateCheckIcon = () => {
          if (checkbox.checked) {
            icon.src = "../images/valid.png";
            icon.className = "icone-check";
            localStorage.setItem(key, "done");
          } else {
            icon.src = "../images/down.png";
            icon.className = "icone-down";
            localStorage.removeItem(key);
          }
        };

        checkbox.addEventListener("change", updateCheckIcon);
        updateCheckIcon(); // Initialisation

        progressWrapper.appendChild(checkbox);
        desc.appendChild(progressWrapper);

        btn.addEventListener("click", (event) => {
  // Si on clique sur un lien à l'intérieur du bouton, on ne fait rien
  if (event.target.tagName === "A") {
    return;
  }

  const isOpen = desc.style.display === "block";
  desc.style.display = isOpen ? "none" : "block";

  // Ne change l’icône de direction que si le jour n’est pas terminé
  if (!checkbox.checked) {
    icon.src = isOpen ? "../images/down.png" : "../images/up.png";
  }
});

        btnContainer.appendChild(btn);
        btnContainer.appendChild(desc);
      });

      // Lien vers cours complet
      const lienContainer = document.getElementById("telecharger-livre");
      const lien = document.createElement("a");
      lien.href = formation.lienComplet.url;
      lien.className = "acces-formation-button";
      lien.innerHTML = `${formation.lienComplet.texte} <img src="../images/livre.png" class="icone-livre" />`;
      lienContainer.appendChild(lien);
    });

  // Bouton retour
  window.retourAction = () => {
    window.history.back();
  };
});