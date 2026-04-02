const scenes = {
  sceneStart: {
    text: "Start menu",
    choices: [
      {
        text: "start",
        next: "scene1S",
      },
    ]
  },
  scene1S: {
    text: "Someone drops their books in front of you.",
    choices: [
      {
        text: "Help them",
        next: "scene2S",
        effect: { helpful: +2, compassionate: +1 }
      },
      {
        text: "Ignore them",
        next: "scene2S",
        effect: { helpful: -2 }
      }
    ]
  },

  scene2S: {
    text: () => {
      if (corePersonalities.agreeableness() >= 1) {
        return "They smile warmly at you.";
      } else {
        return "They look disappointed.";
      }
    },
    choices: [
      {
        text: "Talk to them",
        next: "scene3S",
        condition: () => corePersonalities.extraversion() >= 0
      },
      {
        text: "Walk away",
        next: "scene3S"
      }
    ]
  },

  scene3S: {
    text: "End of demo.",
    choices: [
      { text: "Restart", next: "scene1S" }
    ]
  }

};
