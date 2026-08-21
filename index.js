const modal = document.querySelector("#booking-modal");
const bookingForm = document.querySelector("#booking-form");
const toast = document.querySelector(".toast");
const nav = document.querySelector(".desktop-nav");
const menuToggle = document.querySelector(".menu-toggle");
const bookingTriggers = document.querySelectorAll("[data-open-booking]");
let lastBookingTrigger = null;

// Show short-lived feedback for actions that do not need a full page change.
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(
    () => toast.classList.remove("show"),
    3200,
  );
}

function setModal(open) {
  modal.classList.toggle("open", open);
  modal.setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("modal-open", open);
  if (open) {
    modal.querySelector("input").focus();
  } else if (lastBookingTrigger) {
    lastBookingTrigger.focus();
  }
}

// Booking modal controls and submission feedback.
bookingTriggers.forEach((button) =>
  button.addEventListener("click", () => {
    lastBookingTrigger = button;
    setModal(true);
  }),
);
document
  .querySelector("[data-close-booking]")
  .addEventListener("click", () => setModal(false));
modal.addEventListener("click", (event) => {
  if (event.target === modal) setModal(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("open"))
    setModal(false);
});

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = bookingForm.querySelector(".form-message");
  message.textContent = "Lovely. We will confirm your table by email shortly.";
  bookingForm.reset();
  window.setTimeout(() => setModal(false), 2200);
});

// Favorite buttons provide an immediate, local interaction for each resident.
document.querySelectorAll(".like-button").forEach((button) =>
  button.addEventListener("click", () => {
    button.classList.toggle("liked");
    button.textContent = button.classList.contains("liked") ? "♥" : "♡";
    showToast(
      button.classList.contains("liked")
        ? "Added to your favorites."
        : "Removed from your favorites.",
    );
  }),
);

// Filter resident cards without reloading the page.
document.querySelectorAll(".filter").forEach((filterButton) =>
  filterButton.addEventListener("click", () => {
    document
      .querySelectorAll(".filter")
      .forEach((button) => button.classList.remove("active"));
    filterButton.classList.add("active");
    const selected = filterButton.dataset.filter;
    document.querySelectorAll(".cat-card").forEach((card) => {
      const visible = selected === "all" || card.dataset.type === selected;
      card.hidden = !visible;
    });
  }),
);

// Newsletter and menu actions keep the static site feeling complete.
document
  .querySelectorAll("[data-toast]")
  .forEach((button) =>
    button.addEventListener("click", () => showToast(button.dataset.toast)),
  );

document
  .querySelector("#newsletter-form")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    event.target.reset();
    document.querySelector("#newsletter-message").textContent =
      "You are on the list. See you soon.";
  });

menuToggle.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  menuToggle.setAttribute(
    "aria-label",
    expanded ? "Open navigation" : "Close navigation",
  );
  nav.classList.toggle("mobile-open", !expanded);
});
nav.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    nav.classList.remove("mobile-open");
  }),
);

// Animate every internal redirect and briefly identify its destination.
document.querySelectorAll('a[href^="#"]').forEach((link) =>
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));

    if (!target) return;

    event.preventDefault();
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    nav.classList.remove("mobile-open");
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", link.getAttribute("href"));

    if (target.tagName === "SECTION") {
      target.classList.remove("destination-pulse");
      void target.offsetWidth;
      target.classList.add("destination-pulse");
      window.setTimeout(
        () => target.classList.remove("destination-pulse"),
        1300,
      );
    }
  }),
);

// Prevent visitors from requesting a reservation date in the past.
const bookingDate = bookingForm.querySelector('input[type="date"]');
bookingDate.min = new Date().toISOString().split("T")[0];

const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }),
  { threshold: 0.12 },
);
document
  .querySelectorAll(".reveal")
  .forEach((element) => observer.observe(element));
