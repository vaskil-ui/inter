// ---------------------------------------------------
// Shared storage helpers
// ---------------------------------------------------
const STORAGE_KEY = "contacts";

function getSubmissions(){
  try{
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  }catch(e){
    return [];
  }
}

function saveSubmissions(list){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function escapeHtml(str){
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---------------------------------------------------
// Contact form page
// ---------------------------------------------------
const form = document.getElementById("contactForm");

if (form) {
  const fields = {
    name: {
      input: document.getElementById("name"),
      field: document.getElementById("nameField"),
      msg: document.getElementById("nameMsg"),
      validate(value){
        if (!value.trim()) return "Enter your name.";
        return "";
      }
    },
    email: {
      input: document.getElementById("email"),
      field: document.getElementById("emailField"),
      msg: document.getElementById("emailMsg"),
      validate(value){
        if (!value.trim()) return "Enter your email.";
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(value.trim())) return "Enter a valid email address.";
        return "";
      }
    },
    message: {
      input: document.getElementById("message"),
      field: document.getElementById("messageField"),
      msg: document.getElementById("messageMsg"),
      validate(value){
        if (!value.trim()) return "Enter a message.";
        return "";
      }
    }
  };

  const status = document.getElementById("formStatus");

  function validateField(key){
    const f = fields[key];
    const error = f.validate(f.input.value);
    f.field.classList.toggle("invalid", Boolean(error));
    f.msg.textContent = error;
    return !error;
  }

  Object.keys(fields).forEach(key => {
    fields[key].input.addEventListener("blur", () => validateField(key));
    fields[key].input.addEventListener("input", () => {
      if (fields[key].field.classList.contains("invalid")) validateField(key);
    });
  });

  form.addEventListener("submit", function(e){
    e.preventDefault();

    let allValid = true;
    Object.keys(fields).forEach(key => {
      if (!validateField(key)) allValid = false;
    });

    if (!allValid) {
      status.textContent = "Please fix the highlighted fields.";
      status.classList.add("error");
      return;
    }

    const entry = {
      name: fields.name.input.value.trim(),
      email: fields.email.input.value.trim(),
      message: fields.message.input.value.trim(),
      savedAt: new Date().toISOString()
    };

    const submissions = getSubmissions();
    submissions.push(entry);
    saveSubmissions(submissions);

    form.reset();
    Object.keys(fields).forEach(key => {
      fields[key].field.classList.remove("invalid");
      fields[key].msg.textContent = "";
    });

    status.classList.remove("error");
    status.textContent = "Saved. View it on the submissions page.";
  });
}

// ---------------------------------------------------
// Submissions page
// ---------------------------------------------------
const entryList = document.getElementById("entryList");

if (entryList) {
  const emptyState = document.getElementById("emptyState");
  const countPill = document.getElementById("countPill");
  const clearAll = document.getElementById("clearAll");

  function formatDate(iso){
    try{
      const d = new Date(iso);
      return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
    }catch(e){
      return "";
    }
  }

  function render(){
    const submissions = getSubmissions();
    entryList.innerHTML = "";

    countPill.textContent = submissions.length === 1
      ? "1 entry"
      : `${submissions.length} entries`;

    clearAll.hidden = submissions.length === 0;

    if (submissions.length === 0) {
      emptyState.hidden = false;
      return;
    }
    emptyState.hidden = true;

    submissions.slice().reverse().forEach((entry, reverseIndex) => {
      const realIndex = submissions.length - 1 - reverseIndex;
      const li = document.createElement("li");
      li.className = "entry";
      li.innerHTML = `
        <div class="entry-top">
          <span class="entry-name">${escapeHtml(entry.name)}</span>
          <button class="remove-btn" data-index="${realIndex}">Remove</button>
        </div>
        <span class="entry-email">${escapeHtml(entry.email)}</span>
        <p class="entry-message">${escapeHtml(entry.message)}</p>
        <span class="count-pill">${entry.savedAt ? formatDate(entry.savedAt) : ""}</span>
      `;
      entryList.appendChild(li);
    });

    entryList.querySelectorAll(".remove-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.index);
        const submissions = getSubmissions();
        submissions.splice(idx, 1);
        saveSubmissions(submissions);
        render();
      });
    });
  }

  clearAll.addEventListener("click", () => {
    if (confirm("Clear all saved submissions?")) {
      saveSubmissions([]);
      render();
    }
  });

  render();
}
