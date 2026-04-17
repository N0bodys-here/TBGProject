let gameState = {
    currentScene: `sceneStart`,
    playerGender: "neutral",
    traits: {
        curious: 0,
        creative: 0,
        adventurous: 0,
        organized: 0,
        dependable: 0,
        disciplined: 0,
        outgoing: 0,
        energetic: 0,
        talkative: 0,
        trusting: 0,
        compassionate: 0,
        helpful: 0,
        anxious: 0,
        temperamental: 0,
        moody: 0,
    }
};

const corePersonalities = {
    openness: () =>
    (gameState.traits.curious + gameState.traits.creative + gameState.traits.adventurous) / 3,
    conscientiousness: () =>
    (gameState.traits.organized + gameState.traits.dependable + gameState.traits.disciplined) / 3,
    extraversion: () =>
    (gameState.traits.outgoing + gameState.traits.energetic + gameState.traits.talkative) / 3,
    agreeableness: () =>
    (gameState.traits.trusting + gameState.traits.compassionate + gameState.traits.helpful) / 3,
    neuroticism: () =>
    (gameState.traits.anxious + gameState.traits.temperamental + gameState.traits.moody) / 3,
};

function p(type) {
    const pronouns = {
        masculine: { they: "he", them: "him", their: "his", person: "boy", monarch: "king" }, 
        feminine: { they: "she", them: "her", their: "her", person: "girl", monarch: "queen" }, 
        neutral: { they: "they", them: "them", their: "their", person: "person", monarch: "monarch" }
    };
    return pronouns[gameState.playerGender][type] || type;
};

const MIN = -10;
const MAX = 10;
const textElement = document.getElementById(`text`);
const choicesElement = document.getElementById(`choices`);
const statsElement = document.getElementById(`stats`);
const sidebar = document.querySelector(`.sidebar`);
const sidebarToggler = document.querySelector(`.sidebar-toggler`);
const settingsBtn = document.querySelector(`#settingsB`);
const infoBtn = document.querySelector(`#infoB`);
const statsBtn = document.querySelector(`#statsB`);
const settingsMenu = document.querySelector(`#settings-menu`);
const infoMenu = document.querySelector(`#info-menu`);
const statsMenu = document.querySelector(`#stats-menu`);
const loadBtn = document.querySelector(`#load-game`);
const settingsBtnStart = document.querySelector(`#settings`);
const saveBtn = document.querySelector(`#saveB`);
const saveMenu = document.querySelector(`#save-menu`);
const fontDropdownBtn = document.getElementById("fontDropdownBtn");
const fontContent = document.getElementById("myDropdown");
const regularFontBtn = document.getElementById("regularF");
const medievalFontBtn = document.getElementById("MedievalSharp");

settingsBtnStart.addEventListener("click", () => {
     settingsMenu.classList.toggle("uncollapse");
});
loadBtn.addEventListener("click", () => {
    saveMenu.classList.toggle("uncollapse");
});
sidebarToggler.addEventListener("click", ()=> {
    sidebar.classList.toggle("collapsed");
});

settingsBtn.addEventListener("click", ()=> {
    settingsMenu.classList.toggle("uncollapse");
});
infoBtn.addEventListener("click", ()=> {
    infoMenu.classList.toggle("uncollapse");
});
statsBtn.addEventListener("click", ()=> {
    statsMenu.classList.toggle("uncollapse");
});
saveBtn.addEventListener("click", ()=> {
    saveMenu.classList.toggle("uncollapse");
});
fontDropdownBtn.addEventListener("click", (e) => {
    e.stopPropagation(); 
    fontContent.classList.toggle("show");
});
regularFontBtn.addEventListener("click", () => {
    document.body.style.fontFamily = "sans-serif";
    document.getElementById("game").style.fontFamily = "sans-serif";
});
medievalFontBtn.addEventListener("click", () => {
    document.body.style.fontFamily = "'MedievalSharp', cursive";
    document.getElementById("game").style.fontFamily = "'MedievalSharp', cursive";
});
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        if (fontContent.classList.contains('show')) {
            fontContent.classList.remove('show');
        }
    }
};
function clamp(value) {
    return Math.max(MIN,Math.min(MAX,value));
};

function showScene(sceneId) {
    gameState.currentScene = sceneId;
    const scene = scenes[sceneId];
    if (!scene) {
        textElement.innerText = `scene not found.`;
        return;
    }
    
    textElement.innerHTML = 
        typeof scene.text === "function"
        ? scene.text() 
            : scene.text;
        choicesElement.innerHTML = ``;

    scene.choices.forEach(choice => {
        if (choice.condition && !choice.condition())
            return;
        const button = document.createElement(`button`);
        button.innerText = choice.text;
        button.classList.add(`choice.btn`);
        button.onclick = () => {
            if (choice.effect) {
                for (let key in choice.effect) {
                    if (typeof choice.effect[key] === "number") {
                        gameState.traits[key] = clamp((gameState.traits[key] || 0) + choice.effect[key]);
                    } else {
                        gameState[key] = choice.effect[key];
                    }
                }
            };
            showScene(choice.next);
        };
        choicesElement.appendChild(button);
    });
    updateStats();
    saveGame(); 
};

function updateStats() {
  statsElement.innerText =
    `curious: ${gameState.traits.curious}
     creative: ${gameState.traits.creative}
     adventurous: ${gameState.traits.adventurous}
     organized: ${gameState.traits.organized}
     dependable: ${gameState.traits.dependable}
     disciplined: ${gameState.traits.disciplined}
     outgoing: ${gameState.traits.outgoing}
     energetic: ${gameState.traits.energetic}
     talkative: ${gameState.traits.talkative}
     trusting: ${gameState.traits.trusting}
     compassionate: ${gameState.traits.compassionate}
     helpful: ${gameState.traits.helpful}
     anxious: ${gameState.traits.anxious}
     temperamental: ${gameState.traits.temperamental}
     moody: ${gameState.traits.moody}
     openness: ${corePersonalities.openness().toFixed(1)}
     conscientiousness: ${corePersonalities.conscientiousness().toFixed(1)}
     extraversion: ${corePersonalities.extraversion().toFixed(1)}
     agreeableness: ${corePersonalities.agreeableness().toFixed(1)}
     neuroticism: ${corePersonalities.neuroticism().toFixed(1)}`;
}

function saveGame() {
  localStorage.setItem("gameState", JSON.stringify(gameState));
};

function loadGame() {
  const saved = JSON.parse(localStorage.getItem("gameState"));
  if (saved) {
    gameState = saved;
    showScene(gameState.currentScene);
  }
};

function newGame() {
  localStorage.removeItem("gameState");
  gameState = {
    currentScene: `sceneStart`,
    traits: {
        curious: 0,
        creative: 0,
        adventurous: 0,
        organized: 0,
        dependable: 0,
        disciplined: 0,
        outgoing: 0,
        energetic: 0,
        talkative: 0,
        trusting: 0,
        compassionate: 0,
        helpful: 0,
        anxious: 0,
        temperamental: 0,
        moody: 0,
    }
};
showScene(`sceneStart`)
};
function copySaveCode() {
    const code = btoa(JSON.stringify(gameState));
    prompt("Copy this code and save it somewhere safe:", code);
}
function enterSaveCode() {
    const code = prompt("Paste your save code here:");
    if (code) {
        try {
            gameState = JSON.parse(atob(code));
            saveGame(); // Puts it back into localStorage for convenience
            showScene(gameState.currentScene);
            alert("Game Loaded!");
        } catch (e) {
            alert("Invalid code! Make sure you copied the whole thing.");
        }
    }
}
document.getElementById("newBtn").onclick = newGame;
document.getElementById("saveBtn").onclick = saveGame;
document.getElementById("loadBtn").onclick = loadGame;

document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.querySelector(`#start-game`);
    const startMenu = document.querySelector(`#start-menu`);
    if (startBtn) {
        startBtn.addEventListener("click", () => {
            startMenu.classList.add("hidden");
        });
    }
    loadGame();
    if (!localStorage.getItem("gameState")) {
        showScene("sceneStart");
    }
});

