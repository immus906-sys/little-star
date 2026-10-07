(() => {
  "use strict";

  const scenes = {
    welcome: document.querySelector("#welcome-scene"),
    photos: document.querySelector("#photos-scene"),
    message: document.querySelector("#message-scene"),
    letter: document.querySelector("#letter-scene"),
    final: document.querySelector("#final-scene")
  };
  const progressSteps = [...document.querySelectorAll(".progress__step")];
  const giftButton = document.querySelector("#open-gift");
  const burst = document.querySelector("#gift-burst");
  const musicButton = document.querySelector("#music-toggle");
  const musicLabel = document.querySelector("#music-label");
  const musicStatus = document.querySelector("#music-status");
  const audio = document.querySelector("#lullaby");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let currentScene = "welcome";
  let transitionBusy = false;
  let musicStatusTimer;

  function setProgress(step) {
    progressSteps.forEach((item) => {
      const number = Number(item.dataset.step);
      item.classList.toggle("is-current", number === step);
      item.classList.toggle("is-done", number < step);
    });
  }

  function revealItems(scene) {
    const items = [...scene.querySelectorAll(".reveal")];
    items.forEach((item, index) => {
      window.setTimeout(() => item.classList.add("is-visible"), reducedMotion ? 0 : index * 170 + 80);
    });
  }

  function showScene(name, step) {
    if (transitionBusy || !scenes[name] || currentScene === name) return;
    transitionBusy = true;
    const previous = scenes[currentScene];
    const next = scenes[name];
    previous.classList.add("is-leaving");
    window.setTimeout(() => {
      previous.classList.remove("is-active", "is-leaving");
      previous.setAttribute("aria-hidden", "true");
      next.setAttribute("aria-hidden", "false");
      next.classList.add("is-active");
      currentScene = name;
      setProgress(step);
      if (name === "photos" || name === "message") revealItems(next);
      if (name === "letter") revealLetter();
      if (name === "final") startFinale();
      transitionBusy = false;
    }, reducedMotion ? 0 : 650);
  }

  function addGiftBurst() {
    burst.replaceChildren();
    const colors = ["#ffe6bd", "#f6a9c9", "#e1c5ff", "#fff7e8"];
    for (let index = 0; index < 38; index += 1) {
      const particle = document.createElement("span");
      const angle = (Math.PI * 2 * index) / 38;
      const distance = 75 + Math.random() * 145;
      const symbol = index % 3 === 0 ? "♡" : index % 3 === 1 ? "✦" : "";
      particle.className = symbol ? "burst-particle burst-particle--symbol" : "burst-particle";
      particle.textContent = symbol;
      particle.style.setProperty("--tx", `${Math.cos(angle) * distance}px`);
      particle.style.setProperty("--ty", `${Math.sin(angle) * distance - 90}px`);
      particle.style.setProperty("--delay", `${Math.random() * 0.22}s`);
      particle.style.setProperty("--size", `${3 + Math.random() * 5}px`);
      particle.style.setProperty("--particle-color", colors[index % colors.length]);
      burst.append(particle);
    }
    burst.classList.remove("is-active");
    void burst.offsetWidth;
    burst.classList.add("is-active");
  }

  function openGift() {
    if (transitionBusy || currentScene !== "welcome") return;
    transitionBusy = true;
    giftButton.classList.add("is-opening");
    giftButton.disabled = true;
    window.setTimeout(addGiftBurst, reducedMotion ? 0 : 950);
    window.setTimeout(() => {
      giftButton.classList.remove("is-opening");
      giftButton.disabled = false;
      transitionBusy = false;
      showScene("photos", 2);
    }, reducedMotion ? 100 : 2150);
  }

  function makePetals() {
    const container = document.querySelector(".petals--photos");
    for (let index = 0; index < 16; index += 1) {
      const petal = document.createElement("span");
      petal.className = "petal";
      petal.textContent = index % 3 === 0 ? "♡" : index % 3 === 1 ? "✧" : "✿";
      petal.style.setProperty("--left", `${Math.random() * 100}%`);
      petal.style.setProperty("--size", `${9 + Math.random() * 11}px`);
      petal.style.setProperty("--duration", `${12 + Math.random() * 12}s`);
      petal.style.setProperty("--delay", `${-Math.random() * 22}s`);
      petal.style.setProperty("--drift", `${Math.random() * 90 - 45}px`);
      container.append(petal);
    }
  }

  function setUpImages() {
    document.querySelectorAll(".photo-card__image img").forEach((image) => {
      const frame = image.closest(".photo-card__image");
      const revealImage = () => frame.classList.add("has-image");
      image.addEventListener("load", revealImage);
      image.addEventListener("error", () => {
        frame.classList.remove("has-image");
        image.removeAttribute("src");
      }, { once: true });
      if (image.complete && image.naturalWidth > 0) revealImage();
    });
  }

  function revealLetter() {
    const lines = [...document.querySelectorAll(".letter-copy p")];
    lines.forEach((line, index) => {
      window.setTimeout(() => line.classList.add("is-visible"), reducedMotion ? 0 : 250 + index * 600);
    });
  }

  function startFinale() {
    const heart = document.querySelector("#heart-constellation");
    const fireworks = document.querySelector("#final-fireworks");
    heart.replaceChildren();
    fireworks.replaceChildren();

    const colors = ["#ffe7bc", "#f5c1d8", "#d6c2ff", "#fff8e8"];
    const starCount = 92;
    for (let index = 0; index < starCount; index += 1) {
      const t = (Math.PI * 2 * index) / starCount;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      const star = document.createElement("span");
      star.className = "heart-star";
      star.style.setProperty("--x", `${50 + (x / 18) * 49}%`);
      star.style.setProperty("--y", `${50 + (y / 18) * 50}%`);
      star.style.setProperty("--size", `${2 + Math.random() * 3}px`);
      star.style.setProperty("--delay", `${reducedMotion ? 0 : index * 0.035}s`);
      star.style.setProperty("--star-color", colors[index % colors.length]);
      heart.append(star);
    }

    for (let index = 0; index < 10; index += 1) {
      const firework = document.createElement("span");
      firework.className = "firework";
      firework.style.setProperty("--x", `${10 + Math.random() * 80}%`);
      firework.style.setProperty("--y", `${12 + Math.random() * 76}%`);
      firework.style.setProperty("--delay", `${Math.random() * 2.6}s`);
      fireworks.append(firework);
    }

    for (let index = 0; index < 32; index += 1) {
      const spark = document.createElement("span");
      spark.className = "final-spark";
      spark.textContent = index % 4 === 0 ? "♡" : "✦";
      spark.style.setProperty("--x", `${Math.random() * 100}%`);
      spark.style.setProperty("--size", `${8 + Math.random() * 12}px`);
      spark.style.setProperty("--duration", `${14 + Math.random() * 13}s`);
      spark.style.setProperty("--delay", `${-Math.random() * 20}s`);
      spark.style.setProperty("--drift", `${Math.random() * 110 - 55}px`);
      fireworks.append(spark);
    }
  }

  function announceMusic(message) {
    musicStatus.textContent = message;
    musicStatus.classList.add("is-visible");
    window.clearTimeout(musicStatusTimer);
    musicStatusTimer = window.setTimeout(() => musicStatus.classList.remove("is-visible"), 4500);
  }

  async function toggleMusic() {
    if (audio.paused) {
      try {
        await audio.play();
        musicButton.setAttribute("aria-pressed", "true");
        musicLabel.textContent = "Music On";
        announceMusic("");
      } catch {
        musicButton.setAttribute("aria-pressed", "false");
        musicLabel.textContent = "Music Off";
        announceMusic("Add your lullaby at assets/lullaby.mp3 to play music.");
      }
    } else {
      audio.pause();
      musicButton.setAttribute("aria-pressed", "false");
      musicLabel.textContent = "Music Off";
    }
  }

  function replay() {
    transitionBusy = false;
    currentScene = "final";
    scenes.final.classList.remove("is-active", "is-leaving");
    scenes.final.setAttribute("aria-hidden", "true");
    scenes.welcome.classList.add("is-active");
    scenes.welcome.setAttribute("aria-hidden", "false");
    document.querySelectorAll(".reveal.is-visible, .letter-copy p.is-visible").forEach((element) => {
      element.classList.remove("is-visible");
    });
    giftButton.classList.remove("is-opening");
    giftButton.disabled = false;
    setProgress(1);
    currentScene = "welcome";
    window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" });
  }

  giftButton.addEventListener("click", openGift);
  document.querySelector("#to-message").addEventListener("click", () => showScene("message", 3));
  document.querySelector("#to-letter").addEventListener("click", () => showScene("letter", 3));
  document.querySelector("#to-final").addEventListener("click", () => showScene("final", 4));
  document.querySelector("#replay").addEventListener("click", replay);
  musicButton.addEventListener("click", toggleMusic);
  audio.addEventListener("error", () => {
    musicButton.setAttribute("aria-pressed", "false");
    musicLabel.textContent = "Music Off";
  });

  makePetals();
  setUpImages();
})();
