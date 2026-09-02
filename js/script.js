// Almanac Print Co — shared behaviour

// Responsive nav toggle
document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    links.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }
});

// Contact form validation
function validateForm() {
  var name = document.forms["contactForm"]["name"].value.trim();
  var email = document.forms["contactForm"]["email"].value.trim();

  if (name === "" || email === "") {
    alert("Please fill in both your name and email before sending.");
    return false;
  }

  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert("That email address doesn't look quite right — please check it.");
    return false;
  }

  return true;
}
