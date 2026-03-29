const CONVERTER_STORAGE = {
  rate: 'madagascar_trip_exchange_rate',
  updatedAt: 'madagascar_trip_exchange_rate_updated_at',
  source: 'madagascar_trip_exchange_rate_source',
  mode: 'madagascar_trip_exchange_mode'
};
const FALLBACK_RATE = 4715.93;

function safeGetItem(key) {
  try { return localStorage.getItem(key); } catch (error) { return null; }
}
function safeSetItem(key, value) {
  try { localStorage.setItem(key, value); } catch (error) {}
}
function loadStoredRate() {
  const stored = parseFloat(safeGetItem(CONVERTER_STORAGE.rate));
  return Number.isFinite(stored) && stored > 0 ? stored : FALLBACK_RATE;
}
function formatNumber(value, maxDigits = 2) {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDigits
  }).format(value);
}
function formatMoneyEUR(value) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency', currency: 'EUR',
    minimumFractionDigits: 2, maximumFractionDigits: 2
  }).format(value);
}
function formatDate(isoString) {
  if (!isoString) return 'Non renseignée';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return 'Non renseignée';
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}
document.addEventListener('DOMContentLoaded', () => {
  const sourceAmount = document.getElementById('sourceAmount');
  const targetAmount = document.getElementById('targetAmount');
  const headlineResult = document.getElementById('headlineResult');
  const headlineRate = document.getElementById('headlineRate');
  const detailRate = document.getElementById('detailRate');
  const lastUpdate = document.getElementById('lastUpdate');
  const rateSource = document.getElementById('rateSource');
  const manualRate = document.getElementById('manualRate');
  const saveRateBtn = document.getElementById('saveRateBtn');
  const refreshRateBtn = document.getElementById('refreshRateBtn');
  const clearBtn = document.getElementById('clearBtn');
  const helperText = document.getElementById('helperText');
  const decisionHint = document.getElementById('decisionHint');
  const statusText = document.getElementById('statusText');
  const toggleModeBtn = document.getElementById('toggleModeBtn');
  const mainTitle = document.getElementById('mainTitle');
  const inputLabel = document.getElementById('inputLabel');
  const sourceCurrency = document.getElementById('sourceCurrency');
  const targetCurrency = document.getElementById('targetCurrency');
  const modeDescription = document.getElementById('modeDescription');
  const quickButtons = document.querySelectorAll('.quick-btn');
  let exchangeRate = loadStoredRate();
  let mode = safeGetItem(CONVERTER_STORAGE.mode) || 'MGA_TO_EUR';

  function saveRate(rate, source) {
    exchangeRate = rate;
    safeSetItem(CONVERTER_STORAGE.rate, String(rate));
    safeSetItem(CONVERTER_STORAGE.updatedAt, new Date().toISOString());
    safeSetItem(CONVERTER_STORAGE.source, source);
    updateDisplay();
  }
  function getDecisionHint(eurValue) {
    if (eurValue <= 5) return 'Petit achat, impact faible sur le budget.';
    if (eurValue <= 15) return 'Achat moyen, décision simple si l’objet te plaît.';
    if (eurValue <= 30) return 'Montant à regarder de près avant d’acheter.';
    return 'Achat conséquent, compare ou négocie avant de décider.';
  }
  function applyModeUI() {
    const isMGAtoEUR = mode === 'MGA_TO_EUR';
    safeSetItem(CONVERTER_STORAGE.mode, mode);
    mainTitle.textContent = isMGAtoEUR ? 'Convertisseur Ariary → Euro' : 'Convertisseur Euro → Ariary';
    toggleModeBtn.textContent = isMGAtoEUR ? 'AR → €' : '€ → AR';
    inputLabel.textContent = isMGAtoEUR ? 'Montant affiché sur le marché' : 'Montant en euros';
    sourceCurrency.textContent = isMGAtoEUR ? 'AR' : '€';
    targetCurrency.textContent = isMGAtoEUR ? '€' : 'AR';
    sourceAmount.placeholder = isMGAtoEUR ? 'Ex. 45000' : 'Ex. 20';
    modeDescription.textContent = isMGAtoEUR
      ? 'Par défaut, l’app part d’un prix en ariary et l’affiche en euros.'
      : 'Tu peux aussi partir d’un montant en euros pour connaître son équivalent en ariary.';
    quickButtons.forEach((button) => {
      button.textContent = isMGAtoEUR
        ? `${formatNumber(Number(button.dataset.ar), 0)} AR`
        : `${formatNumber(Number(button.dataset.eur), 0)} €`;
    });
  }
  function updateDisplay() {
    const rawValue = parseFloat(sourceAmount.value);
    const sourceValue = Number.isFinite(rawValue) && rawValue >= 0 ? rawValue : 0;
    const isMGAtoEUR = mode === 'MGA_TO_EUR';
    const convertedValue = exchangeRate > 0
      ? (isMGAtoEUR ? sourceValue / exchangeRate : sourceValue * exchangeRate)
      : 0;
    const eurReference = isMGAtoEUR ? convertedValue : sourceValue;

    targetAmount.value = formatNumber(convertedValue, isMGAtoEUR ? 2 : 0);
    headlineResult.textContent = isMGAtoEUR
      ? `≈ ${formatMoneyEUR(convertedValue)}`
      : `≈ ${formatNumber(convertedValue, 0)} AR`;
    headlineRate.textContent = `Taux utilisé : 1 € = ${formatNumber(exchangeRate, 2)} AR`;
    detailRate.textContent = `1 € = ${formatNumber(exchangeRate, 2)} AR`;
    lastUpdate.textContent = formatDate(safeGetItem(CONVERTER_STORAGE.updatedAt));
    rateSource.textContent = safeGetItem(CONVERTER_STORAGE.source) || 'Manuelle';
    manualRate.value = exchangeRate;
    decisionHint.textContent = getDecisionHint(eurReference);

    helperText.textContent = sourceValue > 0
      ? (isMGAtoEUR
        ? `${formatNumber(sourceValue, 0)} AR correspondent à environ ${formatMoneyEUR(convertedValue)}.`
        : `${formatMoneyEUR(sourceValue)} correspondent à environ ${formatNumber(convertedValue, 0)} AR.`)
      : (isMGAtoEUR
        ? 'Tape un prix en ariary pour voir l\'équivalent en euros.'
        : 'Tape un montant en euros pour voir l\'équivalent en ariary.');
  }
  async function refreshRate() {
    statusText.textContent = 'Mise à jour du taux en cours…';
    refreshRateBtn.disabled = true;
    try {
      const response = await fetch('https://api.exchangerate.host/convert?from=EUR&to=MGA');
      const data = await response.json();
      if (data && typeof data.result === 'number' && !Number.isNaN(data.result) && data.result > 0) {
        saveRate(data.result, 'Synchronisée');
        statusText.textContent = 'Taux mis à jour et enregistré sur l’appareil.';
      } else {
        statusText.textContent = 'Taux indisponible. Dernier taux conservé.';
      }
    } catch (error) {
      statusText.textContent = 'Pas de connexion ou service indisponible. Dernier taux conservé.';
    } finally {
      refreshRateBtn.disabled = false;
    }
  }
  function bindTap(element, handler) {
    let touchHandled = false;
    element.addEventListener('touchend', function (event) {
      touchHandled = true;
      event.preventDefault();
      event.stopPropagation();
      handler(event);
      setTimeout(() => { touchHandled = false; }, 300);
    }, { passive: false });
    element.addEventListener('click', function (event) {
      if (touchHandled) return;
      event.preventDefault();
      event.stopPropagation();
      handler(event);
    });
  }

  sourceAmount.addEventListener('input', updateDisplay);
  bindTap(toggleModeBtn, () => {
    mode = mode === 'MGA_TO_EUR' ? 'EUR_TO_MGA' : 'MGA_TO_EUR';
    sourceAmount.value = '';
    applyModeUI();
    updateDisplay();
    setTimeout(() => sourceAmount.focus(), 50);
  });
  quickButtons.forEach((button) => {
    bindTap(button, () => {
      sourceAmount.value = mode === 'MGA_TO_EUR' ? button.dataset.ar : button.dataset.eur;
      updateDisplay();
      setTimeout(() => sourceAmount.focus(), 50);
    });
  });
  bindTap(saveRateBtn, () => {
    const newRate = parseFloat(manualRate.value);
    if (!Number.isFinite(newRate) || newRate <= 0) {
      statusText.textContent = 'Entre un taux valide.';
      return;
    }
    saveRate(newRate, 'Manuelle');
    statusText.textContent = 'Taux manuel enregistré.';
  });
  bindTap(refreshRateBtn, refreshRate);
  bindTap(clearBtn, () => {
    sourceAmount.value = '';
    statusText.textContent = '';
    updateDisplay();
    setTimeout(() => sourceAmount.focus(), 50);
  });
  applyModeUI();
  updateDisplay();
});