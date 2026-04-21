let scenes = {};

function scenesHolder() {
 scenes = {
  sceneStart: {
   text: ` <span style="color: blue;">Hello</span> player <span style="color: blue;">welcome to the experience. First you’ll have to do a few things before you can begin but these choices should help make your experience much more enjoyable and personalized. You may continue.</span>`,
   choices: [
      {
        text: "Continue",
        next: "start1",
      },
    ]
  },

start1: {
    text: `<span style="color:blue;">Please choose your socially constructed sets of personality roles that will be assigned to you. This will decide how people refer to you as in pronouns, honorifics, and more. This will not decide your actions, you may decide your actions.  Note: this may affect specific outcomes or events in your experience.</span>`,
    choices: [
      {
        text: "Masculine roles",
        next: "start2",
        effect: {playerGender: `masculine`}
      },
     {
        text: "Feminine roles",
        next: "start2",
        effect: {playerGender: `feminine`}
      },
     {
        text: "Neutral roles",
        next: "start2",
        effect: {playerGender: `neutral`}
      },

    ]
  },

start2: {
    text: () => `<span style="color: blue;">${p('monarch')} detected… Now, please tell me the name you would like to be referred to or choose to have a name chosen for you. Please be aware others in the experience will not react to any unusual names you decide to call yourself thanks to the system but you will. So keep in mind if you want an enjoyable experience I suggest choosing a normal sounding name, whatever that may be for you.</span> `,
    choices: [
      {
        text: "Chosen Name",
        next: "start3",
      },
     {
        input: "Name",
        next: "start3",
      },
    ]
  },

start3: {
    text: `<span style="color: blue;">Good luck</span> player<span style="color: blue;">, i will follow you in your experience but hopefully not interfere. Now, you may begin.</span>`,
    choices: [
      {
        text: "Begin",
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
}
