const DEPENSES_STORAGE_KEY = "suivi_depenses_v3";
const DEFAULT_CURRENCY = "EUR";
const TARGET_CURRENCY = "MGA";

const defaultData = [
  { date: "2026-07-09", depense: "AVIS Super cover", montantEur: 213.00, retraitEur: null, paid: false },
  { date: "2026-07-10", depense: "1ere partie Chauffeur", montantEur: null, retraitEur: 1000.00, paid: false },
  { date: "2026-07-11", depense: "Plein avant départ", montantEur: 85.00, retraitEur: null, paid: false },
  { date: "2026-07-12", depense: "", montantEur: null, retraitEur: null, paid: false },
  { date: "2026-07-13", depense: "Complément plein", montantEur: 70.00, retraitEur: null, paid: false },
  { date: "2026-07-15", depense: "Plein avant Belo", montantEur: 85.00, retraitEur: null, paid: false },
  { date: "2026-07-16", depense: "2eme partie Chauffeur", montantEur: 330.00, retraitEur: null, paid: false },
  { date: "2026-07-19", depense: "Complément", montantEur: 70.00, retraitEur: null, paid: false },
  { date: "2026-07-20", depense: "Sécurisation retour Tana", montantEur: 40.00, retraitEur: null, paid: false },
  { date: "2026-07-21", depense: "", montantEur: null, retraitEur: 600.00, paid: false },
  { date: "2026-07-22", depense: "Plein après récupération", montantEur: 85.00, retraitEur: null, paid: false },
  { date: "2026-07-31", depense: "Plein avant Ampfey", montantEur: 85.00, retraitEur: 200.00, paid: false },
  { date: "2026-08-04", depense: "Plein avant Andasibe", montantEur: 85.00, retraitEur: null, paid: false },
  { date: "2026-08-07", depense: "Complément si nécessaire", montantEur: 60.00, retraitEur: null, paid: false },
  { date: "2026-08-09", depense: "Plein retour AVIS", montantEur: 60.00, retraitEur: null, paid: false }
];

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById("tableBody");
  const totalAmountEl = document.getElementById("totalAmount");
  const totalWithdrawalEl = document.getElementById("totalWithdrawal");
  const totalPaidEl = document.getElementById("totalPaid");
  const resetButton = document.getElementById("resetButton");
  const currencyButton = document.getElementById("currencyButton");
  const saveStatus = document.getElementById("saveStatus");
  const rateInfo = document.getElementById("rateInfo");
  const amountHeader = document.getElementById("amountHeader");
  const withdrawalHeader = document.getElementById("withdrawalHeader");
  const quickForm = document.getElementById("quickExpenseForm");
  const quickAmount = document.getElementById("quickAmount");
  const quickCategory = document.getElementById("quickCategory");
  const quickNote = document.getElementById("quickNote");

  let state = loadState();

  function cloneDefaultData() { return JSON.parse(JSON.stringify(defaultData)); }
  function defaultState() {
    return { displayCurrency: DEFAULT_CURRENCY, eurToMgaRate: null, lastRateUpdate: null, lastRateSource: null, data: cloneDefaultData() };
  }
  function loadState() {
    try {
      const raw = localStorage.getItem(DEPENSES_STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      return {
        displayCurrency: parsed.displayCurrency === TARGET_CURRENCY ? TARGET_CURRENCY : DEFAULT_CURRENCY,
        eurToMgaRate: typeof parsed.eurToMgaRate === "number" ? parsed.eurToMgaRate : null,
        lastRateUpdate: typeof parsed.lastRateUpdate === "string" ? parsed.lastRateUpdate : null,
        lastRateSource: typeof parsed.lastRateSource === "string" ? parsed.lastRateSource : null,
        data: Array.isArray(parsed.data) ? parsed.data : cloneDefaultData()
      };
    } catch (error) {
      return defaultState();
    }
  }
  function saveState(message = "Données sauvegardées localement.") {
    try {
      localStorage.setItem(DEPENSES_STORAGE_KEY, JSON.stringify(state));
      saveStatus.textContent = message;
      saveStatus.className = 'status-ok';
    } catch (error) {
      saveStatus.textContent = "Erreur : impossible de sauvegarder localement.";
      saveStatus.className = 'status-warn';
    }
  }
  function formatDateDDMM(dateString) {
    if (!dateString) return "";
    const parts = dateString.split("-");
    if (parts.length !== 3) return dateString;
    return `${parts[2]}/${parts[1]}`;
  }
  function formatDisplayedNumber(value) {
    if (value === null || value === undefined) return "";
    if (state.displayCurrency === DEFAULT_CURRENCY) return value.toFixed(2).replace(".", ",");
    return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
  function formatCurrency(value) {
    if (state.displayCurrency === DEFAULT_CURRENCY) {
      return value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
    }
    return value.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) + " Ar";
  }
  function parseFrenchNumber(value) {
    if (value === null || value === undefined) return null;
    const cleaned = String(value).replace(/\s/g, "").replace(/€/g, "").replace(/Ar/gi, "").replace(",", ".");
    if (cleaned === "") return null;
    const num = parseFloat(cleaned);
    return Number.isNaN(num) ? null : num;
  }
  function roundToTwo(value) { return Math.round(value * 100) / 100; }
  function displayedToEur(displayedAmount) {
    if (displayedAmount === null) return null;
    if (state.displayCurrency === DEFAULT_CURRENCY) return roundToTwo(displayedAmount);
    if (!state.eurToMgaRate) return null;
    return roundToTwo(displayedAmount / state.eurToMgaRate);
  }
  function eurToDisplayed(eurAmount) {
    if (eurAmount === null) return null;
    if (state.displayCurrency === DEFAULT_CURRENCY) return roundToTwo(eurAmount);
    if (!state.eurToMgaRate) return null;
    return Math.round(eurAmount * state.eurToMgaRate);
  }
  function updateCurrencyUI() {
    amountHeader.textContent = state.displayCurrency === DEFAULT_CURRENCY ? "Montant €" : "Montant Ariary";
    withdrawalHeader.textContent = state.displayCurrency === DEFAULT_CURRENCY ? "Retraits €" : "Retraits Ariary";
    const sourceLabel = state.lastRateSource === "network" ? "source réseau" : state.lastRateSource === "fallback" ? "mode secours" : "aucun taux chargé";
    if (state.eurToMgaRate && state.lastRateUpdate) {
      const rateText = `1 € = ${Math.round(state.eurToMgaRate).toLocaleString("fr-FR")} Ar`;
      rateInfo.textContent = `Devise affichée : ${state.displayCurrency === DEFAULT_CURRENCY ? "EUR" : "Ariary"} | Taux mémorisé : ${rateText} | Dernière mise à jour : ${state.lastRateUpdate} | Origine : ${sourceLabel}`;
    } else {
      rateInfo.textContent = `Devise affichée : ${state.displayCurrency === DEFAULT_CURRENCY ? "EUR" : "Ariary"} | Aucun taux disponible`;
    }
  }
  function updateTotals() {
    const totalAmountEur = state.data.reduce((sum, row) => sum + (row.montantEur || 0), 0);
    const totalWithdrawalEur = state.data.reduce((sum, row) => sum + (row.retraitEur || 0), 0);
    const totalPaidEur = state.data.reduce((sum, row) => row.paid && row.montantEur ? sum + row.montantEur : sum, 0);
    totalAmountEl.textContent = formatCurrency(eurToDisplayed(totalAmountEur) ?? 0);
    totalWithdrawalEl.textContent = formatCurrency(eurToDisplayed(totalWithdrawalEur) ?? 0);
    totalPaidEl.textContent = "Payé : " + formatCurrency(eurToDisplayed(totalPaidEur) ?? 0);
  }
  function renderTable() {
    tableBody.innerHTML = "";
    state.data.forEach((row, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${formatDateDDMM(row.date)}</td>
        <td><input class="text-input" type="text" value="${(row.depense || '').replace(/"/g, '&quot;')}" placeholder="Saisir une dépense"></td>
        <td><input class="amount-input" type="text" value="${eurToDisplayed(row.montantEur) !== null ? formatDisplayedNumber(eurToDisplayed(row.montantEur)) : ''}" placeholder="${state.displayCurrency === DEFAULT_CURRENCY ? '0,00' : '0'}"></td>
        <td class="status"></td>
        <td><input class="amount-input" type="text" value="${eurToDisplayed(row.retraitEur) !== null ? formatDisplayedNumber(eurToDisplayed(row.retraitEur)) : ''}" placeholder="${state.displayCurrency === DEFAULT_CURRENCY ? '0,00' : '0'}"></td>
      `;
      const depenseInput = tr.children[1].querySelector('input');
      const montantInput = tr.children[2].querySelector('input');
      const statusCell = tr.children[3];
      const retraitInput = tr.children[4].querySelector('input');

      depenseInput.addEventListener('change', e => {
        state.data[index].depense = e.target.value;
        saveState();
        renderTable();
      });
      montantInput.addEventListener('change', e => {
        const entered = parseFrenchNumber(e.target.value);
        const eurValue = entered === null ? null : displayedToEur(entered);
        state.data[index].montantEur = eurValue;
        if (eurValue === null) state.data[index].paid = false;
        saveState();
        renderTable();
      });
      retraitInput.addEventListener('change', e => {
        const entered = parseFrenchNumber(e.target.value);
        state.data[index].retraitEur = entered === null ? null : displayedToEur(entered);
        saveState();
        renderTable();
      });

      const hasMontant = row.montantEur !== null && row.montantEur !== undefined;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = row.paid ? 'btn paid' : 'btn';
      button.style.background = row.paid ? '#1f9d55' : '#f0b400';
      button.style.color = row.paid ? '#fff' : '#222';
      button.style.padding = '7px 10px';
      button.style.fontSize = '13px';
      button.textContent = row.paid ? 'Annuler' : 'Payé';
      button.disabled = !hasMontant;
      button.addEventListener('click', () => {
        if (!hasMontant) return;
        state.data[index].paid = !state.data[index].paid;
        saveState();
        renderTable();
      });
      const label = document.createElement('span');
      label.className = row.paid ? 'status-ok' : 'status-warn';
      label.style.marginLeft = '8px';
      label.textContent = row.paid ? 'Payé' : 'Non payé';
      statusCell.append(button, label);

      tableBody.appendChild(tr);
    });
    updateCurrencyUI();
    updateTotals();
  }
  async function fetchLatestEurToMgaRate() {
    const response = await fetch("https://open.er-api.com/v6/latest/EUR", { method: "GET", cache: "no-store" });
    if (!response.ok) throw new Error("Impossible de récupérer le taux de change.");
    const result = await response.json();
    if (!result || !result.rates || typeof result.rates.MGA !== "number") throw new Error("Réponse de taux invalide.");
    state.eurToMgaRate = result.rates.MGA;
    state.lastRateSource = "network";
    state.lastRateUpdate = result.time_last_update_utc || new Date().toLocaleString("fr-FR");
    return true;
  }
  async function ensureRateLoaded() {
    try {
      await fetchLatestEurToMgaRate();
      saveState("Taux réseau chargé et sauvegardé localement.");
      return { ok: true, mode: "network" };
    } catch (error) {
      if (typeof state.eurToMgaRate === "number" && state.lastRateUpdate) {
        state.lastRateSource = "fallback";
        saveState("Réseau indisponible : utilisation du dernier taux sauvegardé.");
        return { ok: true, mode: "fallback" };
      }
      return { ok: false, mode: "none" };
    }
  }
  async function toggleCurrency() {
    currencyButton.disabled = true;
    currencyButton.textContent = "Conversion...";
    try {
      const result = await ensureRateLoaded();
      if (!result.ok) {
        saveStatus.textContent = "Impossible de convertir : aucun taux n’a encore été chargé.";
        saveStatus.className = 'status-warn';
        return;
      }
      state.displayCurrency = state.displayCurrency === DEFAULT_CURRENCY ? TARGET_CURRENCY : DEFAULT_CURRENCY;
      saveState(result.mode === 'network'
        ? "Conversion effectuée avec le dernier taux réseau."
        : "Conversion effectuée en mode secours avec le dernier taux sauvegardé.");
      renderTable();
    } finally {
      currencyButton.disabled = false;
      currencyButton.textContent = "€ / Ariary";
    }
  }
  function resetData() {
    const confirmed = window.confirm("Tu vas effacer les données locales du suivi des dépenses. Continuer ?");
    if (!confirmed) return;
    localStorage.removeItem(DEPENSES_STORAGE_KEY);
    state = defaultState();
    saveStatus.textContent = "Données réinitialisées.";
    saveStatus.className = 'status-ok';
    renderTable();
  }
  function addQuickExpense(event) {
    event.preventDefault();
    const rawAmount = parseFrenchNumber(quickAmount.value);
    if (rawAmount === null) {
      saveStatus.textContent = "Entre un montant valide.";
      saveStatus.className = 'status-warn';
      return;
    }
    const eurAmount = displayedToEur(rawAmount);
    if (eurAmount === null) {
      saveStatus.textContent = "Aucun taux disponible pour cette devise.";
      saveStatus.className = 'status-warn';
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    state.data.unshift({
      date: today,
      depense: `${quickCategory.value} — ${quickNote.value || 'saisie rapide'}`,
      montantEur: eurAmount,
      retraitEur: null,
      paid: false
    });
    quickForm.reset();
    saveState("Dépense rapide ajoutée.");
    renderTable();
  }
  async function initializeApp() {
    renderTable();
    const result = await ensureRateLoaded();
    saveStatus.textContent = result.ok
      ? (result.mode === 'network' ? "Application prête. Dernier taux chargé au démarrage." : "Application prête. Dernier taux sauvegardé conservé.")
      : "Application prête. Aucun taux disponible tant qu’un premier chargement réseau n’a pas réussi.";
    saveStatus.className = result.ok ? 'status-ok' : 'status-warn';
    renderTable();
  }
  resetButton.addEventListener("click", resetData);
  currencyButton.addEventListener("click", toggleCurrency);
  quickForm.addEventListener("submit", addQuickExpense);
  initializeApp();
});