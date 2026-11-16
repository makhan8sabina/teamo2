document.addEventListener("DOMContentLoaded", function () {
  const USERS_KEY = "teamo_users";
  const SESSION_KEY = "teamo_session";
  const SEARCH_KEYS = { events: "teamo_search_eventSearch", faq: "teamo_search_faqSearch" };

  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function findUser(email) {
    const wanted = email.toLowerCase();
    return getUsers().find(function (u) {
      return u.email.toLowerCase() === wanted;
    }) || null;
  }

  function currentUser() {
    const email = localStorage.getItem(SESSION_KEY);
    return email ? findUser(email) : null;
  }

  function getSavedStorageKey() {
    const email = localStorage.getItem(SESSION_KEY);
    return email ? "teamo_saved_events_" + email.trim().toLowerCase() : "teamo_saved_events_guest";
  }

  function getSavedEvents() {
    try {
      return JSON.parse(localStorage.getItem(getSavedStorageKey())) || [];
    } catch (e) {
      return [];
    }
  }

  function setSavedEvents(list) {
    localStorage.setItem(getSavedStorageKey(), JSON.stringify(list));
  }

  function getPlayerCardKey() {
    const email = localStorage.getItem(SESSION_KEY);
    return email ? "teamo_player_card_" + email.trim().toLowerCase() : "teamo_player_card_guest";
  }

  function getPlayerCard() {
    try {
      return JSON.parse(localStorage.getItem(getPlayerCardKey())) || {
        number: "10",
        position: "MID"
      };
    } catch (e) {
      return { number: "10", position: "MID" };
    }
  }

  function setPlayerCard(data) {
    localStorage.setItem(getPlayerCardKey(), JSON.stringify(data));
  }

  function value(id) {
    const el = document.getElementById(id);
    return el ? el.value : "";
  }

  function toast(message, type) {
    if (window.TeamoUI) TeamoUI.toast(message, type);
  }

  function setLoading(button, on) {
    if (window.TeamoUI) TeamoUI.setLoading($(button), on);
  }

  function initNavLinks() {
    const loggedIn = !!currentUser();
    document.querySelectorAll('#auth-link, .auth-link, footer a[href="login.html"], footer a[href="profile.html"]').forEach(function (link) {
      link.textContent = loggedIn ? "Profile" : "Log In";
      link.href = loggedIn ? "profile.html" : "login.html";
    });
  }

  function initEventsSync() {
    const saveButtons = document.querySelectorAll(".jq-save");
    if (saveButtons.length === 0) return;

    function updateBtnVisual(btn, isSaved) {
      btn.setAttribute("aria-pressed", isSaved ? "true" : "false");
      btn.textContent = isSaved ? "★ Saved" : "☆ Save";
      btn.classList.toggle("btn-warning", isSaved);
      btn.classList.toggle("btn-outline-secondary", !isSaved);
    }

    function syncAllButtons() {
      const savedList = getSavedEvents();
      saveButtons.forEach(function (btn) {
        const eventName = btn.getAttribute("data-event");
        updateBtnVisual(btn, savedList.indexOf(eventName) !== -1);
      });
    }

    syncAllButtons();
    setTimeout(syncAllButtons, 100);

    saveButtons.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        if (!currentUser()) {
          toast("Log in to save events to your profile.", "info");
          setTimeout(function () {
            location.href = "login.html";
          }, 700);
          return;
        }

        const eventName = btn.getAttribute("data-event");
        const saved = getSavedEvents();
        const idx = saved.indexOf(eventName);

        if (idx === -1) {
          saved.push(eventName);
          setSavedEvents(saved);
          updateBtnVisual(btn, true);
          toast("Saved \"" + eventName + "\" to your profile!", "success");
        } else {
          saved.splice(idx, 1);
          setSavedEvents(saved);
          updateBtnVisual(btn, false);
          toast("Removed \"" + eventName + "\" from saved events.", "info");
        }
      }, true);
    });
  }

  function initSignup() {
    const form = document.getElementById("signup-form");
    if (!form) return;
    if (currentUser()) {
      location.replace("profile.html");
      return;
    }

    const button = document.getElementById("signup-btn");
    const fields = ["su-name", "su-email", "su-phone", "su-password", "su-confirm"];

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      fields.forEach(clearError);

      const name = value("su-name").trim();
      const email = value("su-email").trim();
      const phone = value("su-phone").trim();
      const password = value("su-password");
      const confirm = value("su-confirm");
      let ok = true;

      function fail(id, message) {
        showError(id, message);
        ok = false;
      }

      if (name === "") fail("su-name", "Please enter your full name.");
      else if (name.length < 2) fail("su-name", "Name must be at least 2 characters.");

      if (email === "") fail("su-email", "Please enter your email address.");
      else if (!Validators.email(email)) fail("su-email", "Enter a valid email, e.g. name@example.com.");
      else if (findUser(email)) fail("su-email", "An account with this email already exists. Try logging in.");

      if (phone === "") fail("su-phone", "Please enter your phone number.");
      else if (!Validators.phone(phone)) fail("su-phone", "Use the format +7 700 123 45 67.");

      const passwordProblem = Validators.passwordProblem(password);
      if (passwordProblem) fail("su-password", passwordProblem);

      if (confirm === "") fail("su-confirm", "Please repeat your password.");
      else if (confirm !== password) fail("su-confirm", "Passwords do not match.");

      if (!ok) {
        toast("Please fix the highlighted fields.", "error");
        return;
      }

      setLoading(button, true);
      setTimeout(function () {
        const users = getUsers();
        users.push({
          name: name,
          email: email,
          phone: phone,
          password: password,
          createdAt: new Date().toISOString()
        });
        saveUsers(users);
        setLoading(button, false);
        toast("Account created! Please log in.", "success");
        setTimeout(function () {
          location.href = "login.html?registered=1";
        }, 700);
      }, 900);
    });
  }

  function initLogin() {
    const form = document.getElementById("login-form");
    if (!form) return;
    if (currentUser()) {
      location.replace("profile.html");
      return;
    }

    const button = document.getElementById("login-btn");
    const status = document.getElementById("login-status");
    const notice = document.getElementById("registered-notice");

    if (notice && new URLSearchParams(location.search).get("registered")) {
      notice.classList.remove("d-none");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearError("li-email");
      clearError("li-password");
      status.textContent = "";

      const email = value("li-email").trim();
      const password = value("li-password");
      let ok = true;

      if (email === "") {
        showError("li-email", "Please enter your email address.");
        ok = false;
      } else if (!Validators.email(email)) {
        showError("li-email", "Enter a valid email, e.g. name@example.com.");
        ok = false;
      }

      if (password === "") {
        showError("li-password", "Please enter your password.");
        ok = false;
      }

      if (!ok) {
        toast("Please fix the highlighted fields.", "error");
        return;
      }

      setLoading(button, true);
      setTimeout(function () {
        const user = findUser(email);
        setLoading(button, false);

        if (!user || user.password !== password) {
          status.style.color = "red";
          status.textContent = "Incorrect email or password.";
          toast("Login failed. Check your email and password.", "error");
          return;
        }

        localStorage.setItem(SESSION_KEY, user.email);
        toast("Welcome back, " + user.name + "!", "success");
        setTimeout(function () {
          location.href = "profile.html";
        }, 600);
      }, 800);
    });
  }

  function initProfile() {
    const card = document.getElementById("profile-card");
    if (!card) return;

    const user = currentUser();
    if (!user) {
      location.replace("login.html");
      return;
    }

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        localStorage.removeItem(SESSION_KEY);
        toast("You have been logged out.", "info");
        setTimeout(function () {
          location.href = "index.html";
        }, 600);
      });
    }

    function setText(id, text) {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    }

    const initials = user.name.split(/\s+/).map(function (part) {
      return part.charAt(0);
    }).join("").slice(0, 2).toUpperCase();

    setText("profile-avatar", initials);
    setText("profile-greeting", "Hello, " + user.name.split(/\s+/)[0] + "!");
    setText("profile-name", user.name);
    setText("profile-email", user.email);
    setText("profile-phone", user.phone);
    setText("profile-since", new Date(user.createdAt).toLocaleDateString("en-GB", {
      day: "numeric", month: "long", year: "numeric"
    }));

    const pcForm = document.getElementById("player-card-form");
    const numInput = document.getElementById("pc-number");
    const posSelect = document.getElementById("pc-position");
    const cardNameEl = document.getElementById("card-player-name");
    const cardNumEl = document.getElementById("card-number-display");
    const cardPosEl = document.getElementById("card-pos-badge");

    function updateCardPreview(num, pos) {
      const cleanNum = num ? String(num).replace(/\D/g, "").slice(0, 2) : "10";
      if (cardNameEl) cardNameEl.textContent = user.name;
      if (cardNumEl) cardNumEl.textContent = "#" + (cleanNum || "10");
      if (cardPosEl) cardPosEl.textContent = pos || "MID";
    }

    if (pcForm && numInput && posSelect) {
      const savedCard = getPlayerCard();
      numInput.value = savedCard.number;
      posSelect.value = savedCard.position;
      updateCardPreview(savedCard.number, savedCard.position);

      numInput.addEventListener("input", function () {
        updateCardPreview(numInput.value, posSelect.value);
      });

      posSelect.addEventListener("change", function () {
        updateCardPreview(numInput.value, posSelect.value);
      });

      pcForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const finalNum = numInput.value.trim() || "10";
        numInput.value = finalNum;
        setPlayerCard({
          number: finalNum,
          position: posSelect.value
        });
        updateCardPreview(finalNum, posSelect.value);
        toast("Player card updated!", "success");
      });
    }

    function renderSavedEvents() {
      const listEl = document.getElementById("profile-saved-events");
      if (!listEl) return;
      const saved = getSavedEvents();
      listEl.innerHTML = "";

      if (saved.length === 0) {
        const emptyLi = document.createElement("li");
        emptyLi.className = "list-group-item text-body-secondary";
        emptyLi.textContent = "No saved events yet";
        listEl.appendChild(emptyLi);
        return;
      }

      saved.forEach(function (evName) {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";

        const titleSpan = document.createElement("span");
        titleSpan.textContent = "★ " + evName;

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "btn btn-sm btn-outline-danger";
        removeBtn.textContent = "Remove";
        removeBtn.addEventListener("click", function () {
          const updated = getSavedEvents().filter(function (item) {
            return item !== evName;
          });
          setSavedEvents(updated);
          renderSavedEvents();
          toast("Removed \"" + evName + "\".", "info");
        });

        li.appendChild(titleSpan);
        li.appendChild(removeBtn);
        listEl.appendChild(li);
      });
    }
    renderSavedEvents();

    function showSearches() {
      setText("profile-event-search", localStorage.getItem(SEARCH_KEYS.events) || "none yet");
      setText("profile-faq-search", localStorage.getItem(SEARCH_KEYS.faq) || "none yet");
    }
    showSearches();

    const clearBtn = document.getElementById("clear-searches-btn");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        localStorage.removeItem(SEARCH_KEYS.events);
        localStorage.removeItem(SEARCH_KEYS.faq);
        showSearches();
        toast("Saved searches cleared.", "info");
      });
    }
  }

  initNavLinks();
  initEventsSync();
  initSignup();
  initLogin();
  initProfile();
});