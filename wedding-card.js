const galleryPhotos = [
  ["assets/photos/p03.webp", "Us, already looking like a save-the-date", "This is the picture that makes the fake wedding card feel dangerously real."],
  ["assets/photos/p01.webp", "Golden hour bride energy", "If the sun had a guest list, Vanika would still be the main event."],
  ["assets/photos/p06.webp", "Reception table pretty", "This could be a normal dinner, except she makes every table look like a memory."],
  ["assets/photos/p04.webp", "After-party glow", "The kind of picture that belongs beside vows, flowers, and one very nervous groom."],
  ["assets/photos/p08.jpg", "Future Mrs. maybe", "Just for fun, but also not nearly as funny as it should be."],
  ["assets/photos/p09.jpg", "The smile clause", "Official wedding rule: if she smiles like this, everyone else loses focus."]
];

const vows = [
  "I promise to keep making you feel wanted, not just loved from far away.",
  "I promise to be patient with the distance and impatient for the future.",
  "I promise to learn the tiny details of you and treat them like they matter, because they do.",
  "I promise that even on ordinary days, you will never be ordinary to me.",
  "I promise to choose us loudly, softly, stubbornly, and on purpose."
];

const rsvpMessages = {
  yes: "Vanika + Dyutit, pending one very pretty yes.",
  crying: "Tissues reserved. Groom also crying. Ceremony delayed by emotions.",
  bride: "Bride mode activated. Everyone else may now stand aside."
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

let vowIndex = 0;
let holdTimer = null;
let holdProgress = 0;
let petalAnimation = null;

document.body.classList.add("no-scroll");

function petalBurst(x, y, count = 30) {
  const layer = $("#burstLayer");
  const palette = ["#f6d7dc", "#b74764", "#c69b4f", "#b8d8cb", "#fffaf2"];
  for (let i = 0; i < count; i += 1) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = `${x}px`;
    petal.style.top = `${y}px`;
    petal.style.setProperty("--c", palette[i % palette.length]);
    petal.style.setProperty("--dx", `${(Math.random() - 0.5) * 280}px`);
    petal.style.setProperty("--dy", `${70 + Math.random() * 190}px`);
    petal.style.setProperty("--r", `${(Math.random() - 0.5) * 520}deg`);
    layer.appendChild(petal);
    setTimeout(() => petal.remove(), 1200);
  }
}

function initOpening() {
  $("#openInvite").addEventListener("click", (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    petalBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 52);
    $("#opening").classList.add("is-hidden");
    document.body.classList.remove("no-scroll");
    setTimeout(() => $("#opening")?.remove(), 460);
  });
}

function initPetalCanvas() {
  const canvas = $("#petalCanvas");
  const context = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const petals = Array.from({ length: 42 }, () => ({
    x: Math.random(),
    y: Math.random(),
    speed: 0.0018 + Math.random() * 0.0028,
    size: 5 + Math.random() * 9,
    drift: -0.001 + Math.random() * 0.002,
    turn: Math.random() * Math.PI
  }));

  function resize() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  }

  function frame() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    petals.forEach((petal) => {
      petal.y += petal.speed;
      petal.x += petal.drift;
      petal.turn += 0.02;
      if (petal.y > 1.08) {
        petal.y = -0.08;
        petal.x = Math.random();
      }
      if (petal.x < -0.08) petal.x = 1.08;
      if (petal.x > 1.08) petal.x = -0.08;

      const x = petal.x * window.innerWidth;
      const y = petal.y * window.innerHeight;
      context.save();
      context.translate(x, y);
      context.rotate(Math.sin(petal.turn) * 0.8);
      context.fillStyle = "rgba(183, 71, 100, 0.28)";
      context.beginPath();
      context.ellipse(0, 0, petal.size * 0.55, petal.size, 0, 0, Math.PI * 2);
      context.fill();
      context.restore();
    });
    petalAnimation = requestAnimationFrame(frame);
  }

  resize();
  frame();
  window.addEventListener("resize", resize);
  window.addEventListener("beforeunload", () => cancelAnimationFrame(petalAnimation));
}

function initGallery() {
  $("#photoGrid").innerHTML = galleryPhotos.map((photo, index) => `
    <button class="photo-tile" type="button" data-photo="${index}">
      <img src="${photo[0]}" alt="${photo[1]}" loading="lazy">
      <span>${photo[1]}</span>
    </button>
  `).join("");

  $$(".photo-tile").forEach((button) => {
    button.addEventListener("click", () => {
      const [src, title, text] = galleryPhotos[Number(button.dataset.photo)];
      $("#modalImage").src = src;
      $("#modalImage").alt = title;
      $("#modalTitle").textContent = title;
      $("#modalText").textContent = text;
      $("#photoModal").classList.add("is-open");
      $("#photoModal").setAttribute("aria-hidden", "false");
      document.body.classList.add("no-scroll");
    });
  });
}

function closeModal() {
  $("#photoModal").classList.remove("is-open");
  $("#photoModal").setAttribute("aria-hidden", "true");
  if (!$("#opening")) document.body.classList.remove("no-scroll");
}

function initModal() {
  $("#closeModal").addEventListener("click", closeModal);
  $("#photoModal").addEventListener("click", (event) => {
    if (event.target.id === "photoModal") closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
  });
}

function initVows() {
  $("#nextVow").addEventListener("click", (event) => {
    vowIndex = (vowIndex + 1) % vows.length;
    $("#vowText").textContent = vows[vowIndex];
    const rect = event.currentTarget.getBoundingClientRect();
    petalBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 14);
  });
}

function initRsvpChoices() {
  $$(".rsvp-choice").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".rsvp-choice").forEach((choice) => choice.classList.remove("is-active"));
      button.classList.add("is-active");
      $("#sealCopy").textContent = rsvpMessages[button.dataset.answer];
    });
  });
}

function initHoldSeal() {
  const button = $("#holdSeal");
  const fill = $("#holdFill");

  function setProgress(value) {
    holdProgress = Math.max(0, Math.min(100, value));
    fill.style.width = `${holdProgress}%`;
  }

  function stop() {
    clearInterval(holdTimer);
    holdTimer = null;
    if (holdProgress < 100) setProgress(0);
  }

  button.addEventListener("pointerdown", (event) => {
    button.setPointerCapture?.(event.pointerId);
    clearInterval(holdTimer);
    setProgress(0);
    holdTimer = setInterval(() => {
      setProgress(holdProgress + 4);
      if (holdProgress >= 100) {
        clearInterval(holdTimer);
        holdTimer = null;
        $("#sealCopy").textContent = "Sealed. Future wedding card officially saved for Vanika.";
        const rect = button.getBoundingClientRect();
        petalBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 60);
      }
    }, 38);
  });

  button.addEventListener("pointerup", stop);
  button.addEventListener("pointercancel", stop);
  button.addEventListener("pointerleave", stop);
}

initOpening();
initPetalCanvas();
initGallery();
initModal();
initVows();
initRsvpChoices();
initHoldSeal();
