/* ==========================================================
   Shuvo Mitra — Portfolio scripts (Vanilla JavaScript)
   ========================================================== */

// ---------- 1. Header style on scroll + back-to-top ----------
const header = document.getElementById("header");
const toTop = document.getElementById("toTop");

function onScroll() {
  const y = window.scrollY;
  header.classList.toggle("is-scrolled", y > 30);
  toTop.classList.toggle("is-visible", y > 500);
}
window.addEventListener("scroll", onScroll);
onScroll();

toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ---------- 2. Mobile menu ----------
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");

burger.addEventListener("click", () => {
  const open = menu.classList.toggle("is-open");
  burger.setAttribute("aria-expanded", String(open));
});
menu.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    menu.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  })
);

// ---------- 3. Highlight the menu link of the section on screen ----------
const sections = document.querySelectorAll("main section[id]");
const navLinks = menu.querySelectorAll("a");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((a) =>
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id)
        );
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => sectionObserver.observe(s));

// ---------- 4. Scroll reveal animations ----------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".pf-reveal").forEach((el) => revealObserver.observe(el));

// ---------- 5. Typing effect for the role line ----------
const roles = ["SWE Student", "Aspiring Software Engineer", "Web Developer", "Problem Solver"];
const typed = document.getElementById("typed");
let roleIndex = 0;
let charIndex = roles[0].length;
let deleting = true;

function typeLoop() {
  const word = roles[roleIndex];
  typed.textContent = word.slice(0, charIndex);

  if (deleting) {
    charIndex--;
    if (charIndex < 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      charIndex = 0;
    }
  } else {
    charIndex++;
    if (charIndex > roles[roleIndex].length) {
      deleting = true;
      setTimeout(typeLoop, 1600);
      return;
    }
  }
  setTimeout(typeLoop, deleting ? 45 : 85);
}
setTimeout(typeLoop, 2000);

// ---------- 6. Profile photo upload (saved in this browser) ----------
const photoInput = document.getElementById("photoInput");
const photoImg = document.getElementById("photoImg");
const photoEmpty = document.getElementById("photoEmpty");
const PHOTO_KEY = "pf-photo";

function showPhoto(src) {
  photoImg.src = src;
  photoImg.hidden = false;
  photoEmpty.hidden = true;
}

const savedPhoto = localStorage.getItem(PHOTO_KEY);
if (savedPhoto) showPhoto(savedPhoto);

photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    // shrink the image so it fits in browser storage
    const img = new Image();
    img.onload = () => {
      const size = 600;
      const scale = Math.min(1, size / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      const data = canvas.toDataURL("image/jpeg", 0.85);
      showPhoto(data);
      try { localStorage.setItem(PHOTO_KEY, data); } catch (e) { /* storage full */ }
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

// ---------- 7. Contact form (opens the visitor's email app) ----------
const form = document.getElementById("contactForm");
const note = document.getElementById("formNote");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const subject = form.subject.value.trim();
  const message = form.message.value.trim();

  const body = `Hi Shuvo,\n\n${message}\n\n— ${name} (${email})`;
  window.location.href =
    "mailto:shuvomitra097@gmail.com" +
    "?subject=" + encodeURIComponent(subject) +
    "&body=" + encodeURIComponent(body);

  note.textContent = "Your email app is opening — just press send!";
  note.classList.add("is-ok");
  form.reset();
});

// ---------- 8. Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- 9. Interactive Calculator and Biodata Form ----------
const projectModal = document.getElementById("projectModal");
const projectDialog = projectModal.querySelector(".pf-project-dialog");
const projectTitle = document.getElementById("projectModalTitle");
const calculatorPanel = document.getElementById("calculatorPanel");
const biodataPanel = document.getElementById("biodataPanel");
let previousFocus = null;

function openProject(name) {
  previousFocus = document.activeElement;
  const isCalculator = name === "calculator";
  projectTitle.textContent = isCalculator ? "Calculator" : "Biodata Form";
  calculatorPanel.hidden = !isCalculator;
  biodataPanel.hidden = isCalculator;
  projectModal.classList.add("is-open");
  projectModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("pf-modal-open");
  projectDialog.focus();
  if (isCalculator) updateCalculatorDisplay();
}
function closeProject() {
  projectModal.classList.remove("is-open");
  projectModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("pf-modal-open");
  if (previousFocus) previousFocus.focus();
}
document.querySelectorAll("[data-open-project]").forEach((button) => {
  button.addEventListener("click", () => openProject(button.dataset.openProject));
});
document.querySelectorAll("[data-project-card]").forEach((card) => {
  card.addEventListener("click", (event) => {
    if (event.target.closest("a, button")) return;
    openProject(card.dataset.projectCard);
  });
});
projectModal.querySelectorAll("[data-close-project]").forEach((element) => element.addEventListener("click", closeProject));
document.addEventListener("keydown", (event) => {
  if (!projectModal.classList.contains("is-open")) return;
  if (event.key === "Escape") closeProject();
  if (event.key === "Tab") {
    const focusable = [...projectDialog.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])')]
      .filter((el) => el.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});

// A small expression parser avoids eval() and follows normal operator precedence.
let calcExpression = "";
let calcJustEvaluated = false;
const calcDisplay = document.getElementById("calcDisplay");
const calcExpressionLabel = document.getElementById("calcExpression");
function updateCalculatorDisplay(message) {
  calcDisplay.textContent = calcExpression || "0";
  calcExpressionLabel.textContent = message || (calcJustEvaluated ? "Result" : "Enter an expression" );
}
function calculateExpression(source) {
  const normalized = source.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-").replace(/\s+/g, "");
  const tokens = normalized.match(/(?:\d*\.?\d+)|[()+\-*/%]/g) || [];
  if (tokens.join("") !== normalized || !tokens.length) throw new Error("Invalid expression");
  let index = 0;
  function primary() {
    if (tokens[index] === "+" || tokens[index] === "-") {
      const sign = tokens[index++] === "-" ? -1 : 1;
      return sign * primary();
    }
    let value;
    if (tokens[index] === "(") {
      index++; value = expression();
      if (tokens[index++] !== ")") throw new Error("Missing bracket");
    } else {
      const token = tokens[index++];
      if (token === undefined || !/^\d*\.?\d+$/.test(token)) throw new Error("Invalid number");
      value = Number(token);
    }
    while (tokens[index] === "%") { value /= 100; index++; }
    return value;
  }
  function term() {
    let value = primary();
    while (tokens[index] === "*" || tokens[index] === "/") {
      const op = tokens[index++], right = primary();
      if (op === "/" && right === 0) throw new Error("Cannot divide by zero");
      value = op === "*" ? value * right : value / right;
    }
    return value;
  }
  function expression() {
    let value = term();
    while (tokens[index] === "+" || tokens[index] === "-") {
      const op = tokens[index++], right = term();
      value = op === "+" ? value + right : value - right;
    }
    return value;
  }
  const result = expression();
  if (index !== tokens.length || !Number.isFinite(result)) throw new Error("Invalid calculation");
  return Number.parseFloat(result.toPrecision(12)).toString();
}
function appendCalcValue(value) {
  if (calcJustEvaluated && /[0-9.(]/.test(value)) calcExpression = "";
  calcJustEvaluated = false;
  const last = calcExpression.slice(-1);
  if (/[+−×÷]/.test(value)) {
    if (!calcExpression && value !== "−") return;
    if (/[+−×÷]/.test(last)) calcExpression = calcExpression.slice(0, -1);
  }
  if (value === ".") {
    const currentNumber = calcExpression.split(/[+−×÷()%]/).pop();
    if (currentNumber.includes(".")) return;
    if (!currentNumber) value = "0.";
  }
  if (value === "%" && (!last || /[+−×÷.(]/.test(last))) return;
  calcExpression += value;
  updateCalculatorDisplay();
}
function handleCalcAction(action) {
  if (action === "clear") { calcExpression = ""; calcJustEvaluated = false; updateCalculatorDisplay("Cleared"); return; }
  if (action === "backspace") { calcExpression = calcExpression.slice(0, -1); calcJustEvaluated = false; updateCalculatorDisplay(); return; }
  if (action === "sign") {
    const match = calcExpression.match(/(−?\d*\.?\d+%?)$/);
    if (match) {
      const start = match.index, chunk = match[0];
      calcExpression = calcExpression.slice(0, start) + (chunk.startsWith("−") ? chunk.slice(1) : "−" + chunk);
      calcJustEvaluated = false; updateCalculatorDisplay();
    }
    return;
  }
  if (action === "equals") {
    if (!calcExpression) return;
    try { const original = calcExpression; calcExpression = calculateExpression(calcExpression); calcJustEvaluated = true; updateCalculatorDisplay(original + " ="); }
    catch (error) { calcExpressionLabel.textContent = error.message; calcDisplay.textContent = "Error"; calcExpression = ""; calcJustEvaluated = false; }
  }
}
document.getElementById("calculatorKeys").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.value !== undefined) appendCalcValue(button.dataset.value);
  else handleCalcAction(button.dataset.calc);
});
document.addEventListener("keydown", (event) => {
  if (!projectModal.classList.contains("is-open") || calculatorPanel.hidden || event.ctrlKey || event.metaKey || event.altKey) return;
  if (/^[0-9.]$/.test(event.key)) { event.preventDefault(); appendCalcValue(event.key); }
  else if (["+", "-", "*", "/", "%"].includes(event.key)) { event.preventDefault(); appendCalcValue(({"*":"×", "/":"÷", "-":"−"})[event.key] || event.key); }
  else if (event.key === "Enter" || event.key === "=") { event.preventDefault(); handleCalcAction("equals"); }
  else if (event.key === "Backspace") { event.preventDefault(); handleCalcAction("backspace"); }
  else if (event.key === "Escape") { event.preventDefault(); handleCalcAction("clear"); }
});

// Biodata form: validate, create a readable preview, and allow browser printing to PDF.
const biodataForm = document.getElementById("biodataForm");
const biodataPreview = document.getElementById("biodataPreview");
const biodataPreviewDetails = document.getElementById("biodataPreviewDetails");
const biodataStatus = document.getElementById("biodataStatus");
const biodataLabels = {
  fullName: "Full name", dob: "Date of birth", email: "Email address", phone: "Phone number",
  gender: "Gender", nationality: "Nationality", address: "Present address", education: "Education",
  institution: "Institution", skills: "Skills / interests", about: "About me"
};
biodataForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!biodataForm.reportValidity()) return;
  const data = new FormData(biodataForm);
  biodataPreviewDetails.replaceChildren();
  Object.entries(biodataLabels).forEach(([key, label]) => {
    const value = String(data.get(key) || "").trim();
    if (!value) return;
    const dt = document.createElement("dt"); dt.textContent = label;
    const dd = document.createElement("dd"); dd.textContent = value;
    biodataPreviewDetails.append(dt, dd);
  });
  biodataPreview.hidden = false;
  biodataStatus.textContent = "Your biodata preview is ready. You can print it or save it as a PDF.";
  biodataPreview.scrollIntoView({ behavior: "smooth", block: "nearest" });
});
biodataForm.addEventListener("reset", () => {
  biodataPreview.hidden = true;
  biodataStatus.textContent = "";
});
document.getElementById("printBiodata").addEventListener("click", () => window.print());
