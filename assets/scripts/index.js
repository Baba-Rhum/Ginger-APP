const cookie_button = document.getElementById("accept-cookies");
const uncookie_button = document.getElementById("decline-cookies");

function randrange(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

let cookieAdjectives = ["Essentiels", "Persistants", "Temporaires", "Sécurisés", "HttpOnly", "SameSite", "Tiers", "Première partie", "Non sécurisés", "Flash", "Zombie", "Super", "Protégés", "Non protégés", "Session", "Permanent", "Non persistants", "Non cryptés", "Cryptés", "chiffrés*", "Intrusifs", "Non intrusifs", "Analytiques", "Fonctionnels", "De performance", "De préférence", "De ciblage", "De traçage", "De statistiques", "De personnalisation", "De localisation", "De processus", "De vérification", "De publicité comportementale", "De session utilisateur", "Multidomaines", "De réseaux sociaux", "De conversion", "De publicité personnalisée", "De retargeting", "De test A/B", "De suivi de campagne", "De suivi de clic", "De suivi de navigation", "De suivi de session", "De suivi de site", "De suivi de source", "De suivi de temps", "De suivi de visiteur", "De suivi de zone", "publicitaires"];
uncookie_button.addEventListener("click", function () {
    personalize_cookies = document.getElementById("personalize_cookies");
    personalize_cookies.style.display = "block";
    document.getElementById("cookie-consent").style.display = "none";
    personalize_cookies.style.overflow = "auto";
    for (let cookieAdjective of cookieAdjectives) {
        const newDiv = document.createElement('div');
        const newCheckbox = document.createElement('input');
        newCheckbox.type = 'checkbox';
        newCheckbox.checked = true;
        const newLabel = document.createElement('label');
        newLabel.textContent = 'Cookies ' + cookieAdjective.toLowerCase();
        if (cookieAdjective.includes("publicit")) {
            newCheckbox.disabled = true;
        }
        personalize_cookies.appendChild(newCheckbox);
        personalize_cookies.appendChild(newLabel);
        personalize_cookies.appendChild(newDiv);
    }
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Enregistrer';
    personalize_cookies.appendChild(saveButton);
    saveButton.addEventListener('click', function () {
        const progressBar = document.createElement('div');
        progressBar.style.position = 'fixed';
        progressBar.style.top = '50%';
        progressBar.style.left = '50%';
        progressBar.style.transform = 'translate(-50%, -50%)';
        progressBar.style.width = '80%';
        progressBar.style.zIndex = '501';
        progressBar.style.height = '20px';
        progressBar.style.backgroundColor = 'lightgray';
        progressBar.style.borderRadius = '10px';
        progressBar.style.overflow = 'hidden';

        const progress = document.createElement('div');
        progress.style.width = '0%';
        progress.style.height = '100%';
        progress.style.backgroundColor = 'green';

        progressBar.appendChild(progress);
        personalize_cookies.appendChild(progressBar);

        let width = 0;
        const interval = setInterval(() => {
            if (width >= 100) {
                width = 100;
                clearInterval(interval);
                setTimeout(() => {
                    progressBar.remove();
                    personalize_cookies.style.display = 'none';
                    localStorage.setItem("cookie", "true");
                }, 100);
            } else if (width >= 70 && width < 90) {
                width += 5;
            } else if (width >= 90) {
                if (randrange(0, 100) < 50) {
                    width += 2;
                }
            } else {
                width += 10;
            }
            progress.style.width = `${width}%`;
        }, 1000);
    });
});

if (localStorage.getItem("cookie") === "true") {
    document.getElementById("cookie-consent").remove();
}
cookie_button.addEventListener("click", function () {
    document.getElementById("cookie-consent").style.display = "none";
    localStorage.setItem("cookie", "true");
});
