document.addEventListener("DOMContentLoaded", () => {
  const petImageEl = document.getElementById("pet-image");
  const petImgEl = document.getElementById("pet-img");
  const petNameEl = document.getElementById("pet-name");
  const statusHunger = document.getElementById("status-hunger");
  const statusHappiness = document.getElementById("status-happiness");
  const statusEnergy = document.getElementById("status-energy");
  const statusCleanliness = document.getElementById("status-cleanliness");
  const statusHealth = document.getElementById("status-health");
  const statusItems = document.querySelectorAll(".status-item");

  const feedBtn = document.getElementById("feed-btn");
  const playBtn = document.getElementById("play-btn");
  const sleepBtn = document.getElementById("sleep-btn");
  const cleanBtn = document.getElementById("clean-btn");
  const saveBtn = document.getElementById("save-btn");
  const loadBtn = document.getElementById("load-btn");
  const sacrificeBtn = document.getElementById("sacrifice-btn");
  const restartBtn = document.getElementById("restart-btn");

  const messageBox = document.getElementById("message-box");
  const messageText = document.getElementById("message-text");
  const closeMessageBtn = document.getElementById("close-message-btn");
  const statusAge = document.getElementById("status-age");

  const confirmationBox = document.getElementById("confirmation-box");
  const confirmationText = document.getElementById("confirmation-text");
  const confirmYesBtn = document.getElementById("confirm-yes");
  const confirmNoBtn = document.getElementById("confirm-no");

  const MAX_STAT = 100;
  const MIN_STAT = 0;
  const LOW_STAT = 30;

  const PET_STAGES = [
    {
      name: "Pequeno Demônio",
      img: "1.png",
      minAge: 0,
      maxAge: 3,
    },
    {
      name: "Criança Maligna",
      img: "2.png",
      minAge: 3,
      maxAge: 12,
    },
    {
      name: "Demônio Adolescente",
      img: "3.png",
      minAge: 13,
      maxAge: 18,
    },
    {
      name: "Demônio Adulto",
      img: "4.png",
      minAge: 18,
      maxAge: 40,
    },
    {
      name: "Lorde das Trevas",
      img: "5.png",
      minAge: 40,
      maxAge: Infinity,
    },
  ];

  let tamagotchi = {
    hunger: MAX_STAT,
    happiness: MAX_STAT,
    energy: MAX_STAT,
    cleanliness: MAX_STAT,
    health: MAX_STAT,
    ageDays: 0,
    isSleeping: false,
    isAlive: true,
  };

  function clamp(value) {
    return Math.max(MIN_STAT, Math.min(MAX_STAT, value));
  }

  function getCurrentStage() {
    return PET_STAGES.find(
      (stage) =>
        tamagotchi.ageDays >= stage.minAge && tamagotchi.ageDays < stage.maxAge
    );
  }

  function updateStatusIndicators() {
    statusItems[0].classList.toggle("low", tamagotchi.hunger <= LOW_STAT);
    statusItems[1].classList.toggle("low", tamagotchi.happiness <= LOW_STAT);
    statusItems[2].classList.toggle("low", tamagotchi.energy <= LOW_STAT);
    statusItems[3].classList.toggle("low", tamagotchi.cleanliness <= LOW_STAT);
    statusItems[4].classList.toggle("low", tamagotchi.health <= LOW_STAT);
  }

  function updateDisplay() {
    if (!tamagotchi.isAlive) {
      petImageEl.innerHTML = "💀";
      petImageEl.classList.add("dead");
      petImageEl.classList.remove("sleeping");
      petNameEl.textContent = "Demônio Morto";
    } else if (tamagotchi.isSleeping) {
      petImageEl.innerHTML = "😴";
      petImageEl.classList.add("sleeping");
      petImageEl.classList.remove("dead");
      petNameEl.textContent = "Zzzz...";
    } else {
      petImageEl.classList.remove("dead", "sleeping");
      const stage = getCurrentStage();
      petImageEl.innerHTML = `<img src="${stage.img}" alt="${stage.name}">`;
      petNameEl.textContent = stage.name;
    }

    statusHunger.textContent = `${tamagotchi.hunger}%`;
    statusHappiness.textContent = `${tamagotchi.happiness}%`;
    statusEnergy.textContent = `${tamagotchi.energy}%`;
    statusCleanliness.textContent = `${tamagotchi.cleanliness}%`;
    statusHealth.textContent = `${tamagotchi.health}%`;

    sleepBtn.disabled = tamagotchi.isSleeping;
    feedBtn.disabled = !tamagotchi.isAlive || tamagotchi.isSleeping;
    playBtn.disabled = !tamagotchi.isAlive || tamagotchi.isSleeping;
    cleanBtn.disabled = !tamagotchi.isAlive || tamagotchi.isSleeping;

    sleepBtn.textContent = tamagotchi.isSleeping ? "Acordar" : "😴 Dormir";
    statusAge.textContent = Math.floor(tamagotchi.ageDays);

    updateStatusIndicators();
  }

  function showMessage(message) {
    messageText.textContent = message;
    messageBox.style.display = "flex";
  }

  function hideMessage() {
    messageBox.style.display = "none";
  }

  function showConfirmation(message) {
    confirmationText.textContent = message;
    confirmationBox.style.display = "flex";
    return new Promise((resolve) => {
      const handleChoice = (choice) => {
        confirmationBox.style.display = "none";
        confirmYesBtn.removeEventListener("click", yesHandler);
        confirmNoBtn.removeEventListener("click", noHandler);
        resolve(choice);
      };

      const yesHandler = () => handleChoice(true);
      const noHandler = () => handleChoice(false);

      confirmYesBtn.addEventListener("click", yesHandler);
      confirmNoBtn.addEventListener("click", noHandler);
    });
  }

  function performAction(action) {
    if (!tamagotchi.isAlive) {
      showMessage("Seu demônio está morto 💀");
      return;
    }

    if (tamagotchi.isSleeping && action !== "sleep") {
      showMessage("Seu demônio está dormindo 😴");
      return;
    }

    if (action === "feed") {
      tamagotchi.hunger = clamp(tamagotchi.hunger + 20);
      showMessage("Nom nom nom! 🍗");
    }
    if (action === "play") {
      tamagotchi.happiness = clamp(tamagotchi.happiness + 20);
      tamagotchi.energy = clamp(tamagotchi.energy - 10);
      showMessage("Hahaha! Que divertido! 🎮");
    }
    if (action === "sleep") {
      tamagotchi.isSleeping = !tamagotchi.isSleeping;
      showMessage(tamagotchi.isSleeping ? "Zzzz... 😴" : "Acordei! 😈");
    }
    if (action === "clean") {
      tamagotchi.cleanliness = clamp(MAX_STAT);
      showMessage("Minhas chamas estão acesas! 🔥");
    }

    updateDisplay();
  }

  function saveGame() {
    const saveData = {
      tamagotchi: tamagotchi,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("demonVirtualSave", JSON.stringify(saveData));
    showMessage("Jogo salvo com sucesso! 💾");
  }

  function loadGame() {
    const saveData = localStorage.getItem("demonVirtualSave");
    if (!saveData) {
      showMessage("Nenhum jogo salvo encontrado! ❌");
      return;
    }

    try {
      const parsedData = JSON.parse(saveData);
      tamagotchi = parsedData.tamagotchi;
      updateDisplay();
      showMessage("Jogo carregado com sucesso! 📂");
    } catch (error) {
      showMessage("Erro ao carregar jogo! ❌");
    }
  }

  async function sacrificeDemon() {
    if (!tamagotchi.isAlive) {
      showMessage("Seu demônio já está morto! 💀");
      return;
    }

    const confirmed = await showConfirmation(
      "Tem certeza que deseja sacrificar seu demônio? Esta ação é irreversível!"
    );
    if (confirmed) {
      tamagotchi.isAlive = false;
      updateDisplay();
      showMessage(
        "Você sacrificou seu demônio! Sua alma agora pertence às trevas... ⚔️"
      );
    }
  }

  async function restartGame() {
    const confirmed = await showConfirmation(
      "Tem certeza que deseja reiniciar o jogo? Todo progresso será perdido!"
    );
    if (confirmed) {
      tamagotchi = {
        hunger: MAX_STAT,
        happiness: MAX_STAT,
        energy: MAX_STAT,
        cleanliness: MAX_STAT,
        health: MAX_STAT,
        ageDays: 0,
        isSleeping: false,
        isAlive: true,
      };
      updateDisplay();
      showMessage("Jogo reiniciado! Um novo demônio nasceu... 🔄");
    }
  }

  feedBtn.addEventListener("click", () => performAction("feed"));
  playBtn.addEventListener("click", () => performAction("play"));
  sleepBtn.addEventListener("click", () => performAction("sleep"));
  cleanBtn.addEventListener("click", () => performAction("clean"));
  saveBtn.addEventListener("click", saveGame);
  loadBtn.addEventListener("click", loadGame);
  sacrificeBtn.addEventListener("click", sacrificeDemon);
  restartBtn.addEventListener("click", restartGame);
  closeMessageBtn.addEventListener("click", hideMessage);

  setInterval(() => {
    if (!tamagotchi.isAlive) return;

    tamagotchi.ageDays += 0.5;

    if (!tamagotchi.isSleeping) {
      tamagotchi.hunger = clamp(tamagotchi.hunger - 1);
      tamagotchi.happiness = clamp(tamagotchi.happiness - 1);
      tamagotchi.energy = clamp(tamagotchi.energy - 1);
      tamagotchi.cleanliness = clamp(tamagotchi.cleanliness - 1);
    } else {
      tamagotchi.energy = clamp(tamagotchi.energy + 3);
      if (tamagotchi.energy >= MAX_STAT) {
        tamagotchi.isSleeping = false;
        showMessage("Acordei revigorado! 😈");
      }
    }

    let healthPenalty = 0;
    if (tamagotchi.hunger < LOW_STAT) healthPenalty += 2;
    if (tamagotchi.happiness < LOW_STAT) healthPenalty += 1;
    if (tamagotchi.energy < LOW_STAT) healthPenalty += 1;
    if (tamagotchi.cleanliness < LOW_STAT) healthPenalty += 2;
    tamagotchi.health = clamp(tamagotchi.health - healthPenalty);

    if (tamagotchi.health <= 0) {
      tamagotchi.isAlive = false;
      showMessage("Seu demônio morreu 💀");
    }

    updateDisplay();
  }, 2000);

  updateDisplay();
});
