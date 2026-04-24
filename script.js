let gameState = {
    currentScene: `sceneStart`,
    socialRoles: "neutral",
    playerName: "Player",
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

function p(type) {
    const pronouns = {
        masculine: { they: "he", them: "him", their: "his", person: "boy", monarch: "King" }, 
        feminine: { they: "she", them: "her", their: "her", person: "girl", monarch: "Queen" }, 
        neutral: { they: "they", them: "them", their: "their", person: "person", monarch: "Monarch" }
    };
    return pronouns[gameState.socialRoles][type] || type;
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
const mascBtn = document.getElementById("mascBtn");
const femBtn = document.getElementById("femBtn");
const neutralBtn = document.getElementById("neutralBtn");

mascBtn.addEventListener("click", () => {
    gameState.socialRoles = "masculine";
    showScene(gameState.currentScene);
});
femBtn.addEventListener("click", () => {
    gameState.socialRoles = "feminine";
    showScene(gameState.currentScene);
});
neutralBtn.addEventListener("click", () => {
    gameState.socialRoles = "neutral";
    showScene(gameState.currentScene);
});
settingsBtnStart.addEventListener("click", () => {
    settingsMenu.classList.toggle("uncollapse");
    alert(" idk") 
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
        if (choice.input) {
            const inputField = document.createElement("input");
            inputField.type = "text";
            inputField.placeholder = "Enter name...";
            inputField.classList.add("name-input-inline");
            const confirmBtn = document.createElement("button");
            confirmBtn.innerText = "Confirm";
            confirmBtn.onclick = () => {
                gameState.playerName = inputField.value || "Player";
                showScene(choice.next);
            };
            choicesElement.appendChild(inputField);
            choicesElement.appendChild(confirmBtn);
        } else {
            const button = document.createElement(`button`);
            button.innerText = choice.text;
            button.onclick = () => {
                if (choice.effect) {
                    for (let key in choice.effect) {
                        if (typeof choice.effect[key] === "number") {
                            gameState.traits[key] = clamp((gameState.traits[key] || 0) + choice.effect[key]);
                        } else {
                            gameState[key] = choice.effect[key];
                        }
                    }
                }
                if (choice.cutsceneEvent) {
                    triggerTextCutscene(choice.cutsceneEvent, choice.next);
                } else {
    showScene(choice.next);
}
            };
            choicesElement.appendChild(button);

        }
    });
    updateStats();
    saveGame(); 
};
function typeWriter(element, text, callback) {
    element.innerHTML = "";
    let i = 0;
    const speed = 50; 

    function type() {
        if (i < text.length) {
             element.innerHTML = text.substring(0, i + 1);
            i++;
            setTimeout(type, speed);
        } else if (callback) {
            callback(); 
        }
    }
    type();
}
function triggerTextCutscene(cutsceneText, nextSceneId) {
    const gameContainer = document.getElementById("game");
    const sidebar = document.querySelector(".sidebar");
    const picture = document.getElementById("picture");
    const overlay = document.getElementById("cutscene-overlay");
    const displayElement = document.getElementById("cutscene-text");
    
    gameContainer.classList.add("fade-out");
    sidebar.classList.add("fade-out");
    picture.classList.add("fade-out");
    setTimeout(() => {
        overlay.style.display = "flex";
        overlay.style.opacity = "1";
        typeWriter(displayElement, cutsceneText, () => {
            displayElement.classList.add("animate");
            setTimeout(() => {
                overlay.style.display = "none";
                gameContainer.classList.remove("fade-out");
                sidebar.classList.remove("fade-out");
                picture.classList.remove("fade-out");
                displayElement.classList.remove("animate");
                showScene(nextSceneId);
            }, 2000);
        });
    }, 1000);
}
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
     neuroticism: ${corePersonalities.neuroticism().toFixed(1)}
     Social Roles: ${gameState.socialRoles}`;
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
    socialRoles: "neutral",
    playerName: "Player",
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
    showScene("sceneStart");
    updateStats();
    saveMenu.classList.remove("uncollapse");
    statsMenu.classList.remove("uncollapse");
    infoMenu.classList.remove("uncollapse");
    settingsMenu.classList.remove("uncollapse");
    sidebar.classList.toggle("collapsed");
    document.getElementById("start-menu").classList.remove("hidden");
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
            saveGame();
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
    if (typeof scenesHolder === "function") {
        scenesHolder();
    }
    if (startBtn) {
        startBtn.addEventListener("click", () => {
            startMenu.classList.add("hidden");
            if (!localStorage.getItem("gameState")) {
                showScene("sceneStart");
            } else {
                loadGame(); 
            }
        });
    }
});
