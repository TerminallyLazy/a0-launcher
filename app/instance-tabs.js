// Tab strip for embedded Agent Zero instances. The main process owns the
// instance views; this renders the strip and relays activate/close intents.
const api = window.a0TabsAPI;

function makeTab({ id, label, icon, active, closable }) {
  const tab = document.createElement("div");
  tab.className = `a0-tab${active ? " active" : ""}${closable ? "" : " a0-tab-home"}`;
  tab.setAttribute("role", "tab");
  tab.setAttribute("aria-selected", active ? "true" : "false");
  tab.title = label;

  const open = document.createElement("button");
  open.className = "a0-tab-open";
  open.type = "button";
  if (icon) {
    const iconEl = document.createElement("span");
    iconEl.className = "material-symbols-outlined a0-tab-icon";
    iconEl.setAttribute("aria-hidden", "true");
    iconEl.textContent = icon;
    open.appendChild(iconEl);
  }
  const text = document.createElement("span");
  text.className = "a0-tab-label";
  text.textContent = label;
  open.appendChild(text);
  open.addEventListener("click", () => api?.activate?.(id));
  tab.appendChild(open);

  if (closable) {
    const close = document.createElement("button");
    close.className = "a0-tab-close";
    close.type = "button";
    close.title = "Close instance";
    close.setAttribute("aria-label", `Close ${label}`);
    close.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">close</span>';
    close.addEventListener("click", (e) => {
      e.stopPropagation();
      api?.close?.(id);
    });
    tab.appendChild(close);
  }

  return tab;
}

function render(state) {
  const strip = document.getElementById("a0TabStrip");
  if (!strip) return;

  const tabs = Array.isArray(state?.tabs) ? state.tabs : [];
  const activeId = state?.activeId || "home";

  // The strip only exists once at least one A0 instance is open.
  if (!tabs.length) {
    strip.hidden = true;
    strip.innerHTML = "";
    document.body.classList.remove("has-a0-tabs");
    return;
  }

  strip.hidden = false;
  document.body.classList.add("has-a0-tabs");
  strip.innerHTML = "";
  strip.appendChild(makeTab({
    id: "home",
    label: "Home",
    icon: "home",
    active: activeId === "home",
    closable: false
  }));
  for (const tab of tabs) {
    strip.appendChild(makeTab({
      id: tab.id,
      label: tab.title || "Agent Zero",
      icon: "deployed_code",
      active: activeId === tab.id,
      closable: true
    }));
  }
}

if (api) {
  api.onChanged?.(render);
  api.list?.().then(render).catch(() => {});
}
