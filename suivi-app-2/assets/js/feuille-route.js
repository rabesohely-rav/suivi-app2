const ROUTE_STORAGE_KEY = 'madagascar_route_notes_v1';
const itinerary = [
  {id:'2026-07-09',date:'2026-07-09',dateLabel:'Jeudi 9 juillet 2026',title:'Départ de Toulouse',route:'Toulouse → Paris → Antananarivo',stay:'Nuit à Antananarivo — chez Aurélien',contact:'Aurélien',reservation:'',highlight:'Vols Air France AF 7423 puis AF 934. Arrivée à 21h20 à Ivato.',activities:['Immigration et visa','Récupération des bagages','Accueil famille','Transfert hébergement']},
  {id:'2026-07-10',date:'2026-07-10',dateLabel:'Vendredi 10 juillet 2026',title:'Antananarivo — récupération',route:'Journée sur place',stay:'Nuit à Antananarivo',contact:'Aurélien / Rina',reservation:'',highlight:'Journée calme, tri des valises et préparation du road trip.',activities:['Repos et sieste','Tri des valises','Préparation sacs enfants','Brief road trip avec Rina']},
  {id:'2026-07-11',date:'2026-07-11',dateLabel:'Samedi 11 juillet 2026',title:'Antananarivo → Antsirabe',route:'RN7 — départ tôt',stay:'Lycée catholique Picot de Clorivière',contact:'+261 34 81 850 69',reservation:'6146568078',highlight:'Première grande étape du road trip avec pauses régulières.',activities:['Trajet','Pauses régulières','Installation à Antsirabe']},
  {id:'2026-07-12',date:'2026-07-12',dateLabel:'Dimanche 12 juillet 2026',title:'Antsirabe — découvertes et souvenirs',route:'Journée locale',stay:'Antsirabe',contact:'',reservation:'',highlight:'Journée artisanat, lac et souvenirs ciblés.',activities:['Ateliers artisanaux','Lac Andraikiba','Temps libre enfants','Souvenirs ciblés']},
  {id:'2026-07-13',date:'2026-07-13',dateLabel:'Lundi 13 juillet 2026',title:'Antsirabe → Miandrivazo',route:'Trajet routier',stay:'Hôtel Princesse Tsiribihina',contact:'032 11 301 72 / 034 83 874 23',reservation:'',highlight:'Étape de liaison vers l’ouest.',activities:['Trajet','Installation hôtel']},
  {id:'2026-07-14',date:'2026-07-14',dateLabel:'Mardi 14 juillet 2026',title:'Miandrivazo → Morondava',route:'Trajet routier',stay:'Select Hôtel Morondava',contact:'+261 34 07 035 98',reservation:'5143833524',highlight:'Arrivée vers la côte.',activities:['Trajet','Installation hôtel']},
  {id:'2026-07-15',date:'2026-07-15',dateLabel:'Mercredi 15 juillet 2026',title:'Morondava',route:'Journée locale',stay:'Morondava',contact:'',reservation:'',highlight:'Allée des Baobabs et temps plage.',activities:['Allée des Baobabs','Temps plage','Repos']},
  {id:'2026-07-16',date:'2026-07-16',dateLabel:'Jeudi 16 juillet 2026',title:'Morondava → Belo sur Mer',route:'Trajet côtier',stay:'ENTREMER — Belo sur Mer',contact:'+261 32 11 472 45',reservation:'6932740368',highlight:'Arrivée bord de mer.',activities:['Trajet','Installation','Temps calme']},
  {id:'2026-07-17',date:'2026-07-17',dateLabel:'Vendredi 17 juillet 2026',title:'Belo sur Mer',route:'Journée locale',stay:'Belo sur Mer',contact:'',reservation:'',highlight:'Repos et activités plage.',activities:['Baignade','Boutres en construction','Jeux plage enfants','Repos']},
  {id:'2026-07-19',date:'2026-07-19',dateLabel:'Dimanche 19 juillet 2026',title:'Belo → Miandrivazo',route:'Trajet retour',stay:'Hôtel Princesse Tsiribihina',contact:'',reservation:'',highlight:'Retour vers l’intérieur.',activities:['Trajet','Installation hôtel']},
  {id:'2026-07-20',date:'2026-07-20',dateLabel:'Lundi 20 juillet 2026',title:'Miandrivazo → Antsirabe',route:'Trajet retour',stay:'Lycée Picot de Clorivière',contact:'',reservation:'6512386248',highlight:'Retour à Antsirabe.',activities:['Trajet','Installation']},
  {id:'2026-07-21',date:'2026-07-21',dateLabel:'Mardi 21 juillet 2026',title:'Antsirabe → Antananarivo',route:'Trajet retour',stay:'Appartement IIT 18D Mboohmanga — Iavoloha',contact:'+33 6 98 52 61 60',reservation:'6396489455',highlight:'Retour à l’hébergement principal.',activities:['Trajet','Installation à Iavoloha']},
  {id:'2026-07-22',date:'2026-07-22',dateLabel:'Mercredi 22 juillet 2026',title:'Récupération AVIS Ivato',route:'Antananarivo / Ivato',stay:'Iavoloha',contact:'AVIS — Aéroport International Ivato',reservation:'08120195FR6',highlight:'Prise du Toyota Land Cruiser Prado à 08:00.',activities:['Prévoir 45–60 min','Photos et vidéos complètes','Vérification contrat et franchise']},
  {id:'2026-07-28',date:'2026-07-28',dateLabel:'Mardi 28 juillet 2026',title:'Le Marais Restaurant',route:'Sortie resto à 4',stay:'Iavoloha',contact:'',reservation:'',highlight:'Restaurant prévu pour vous 4 seulement.',activities:['Dîner au Marais']},
  {id:'2026-07-30',date:'2026-07-30',dateLabel:'Jeudi 30 juillet 2026',title:'Rova Ambohimanga',route:'Visite culturelle',stay:'Iavoloha',contact:'',reservation:'',highlight:'Visite du Rova Ambohimanga.',activities:['Visite culturelle']},
  {id:'2026-08-01',date:'2026-08-01',dateLabel:'Samedi 1 août 2026',title:'Ampefy',route:'Séjour court',stay:'Ampefy',contact:'',reservation:'',highlight:'Début du passage à Ampefy.',activities:['Déplacement','Séjour']},
  {id:'2026-08-04',date:'2026-08-04',dateLabel:'Mardi 4 août 2026',title:'Départ pour Andasibe',route:'Antananarivo → Andasibe',stay:'Longoza Ecolodge',contact:'+261 34 49 777 05',reservation:'6007078069',highlight:'Début du séjour Andasibe.',activities:['Trajet','Installation au lodge']},
  {id:'2026-08-09',date:'2026-08-09',dateLabel:'Dimanche 9 août 2026',title:'Retour sans stress',route:'Iavoloha → Ivato → Paris',stay:'Vol retour',contact:'AVIS Ivato',reservation:'Retour voiture 19:30',highlight:'Départ recommandé 16h30, restitution AVIS 18h00, vol AF 935 à 00h25.',activities:['Départ Iavoloha 16h30','Restitution AVIS 18h00','Dîner léger','Enregistrement','Décollage 00h25']},
  {id:'2026-08-10',date:'2026-08-10',dateLabel:'Lundi 10 août 2026',title:'Retour à Toulouse',route:'Paris → Toulouse',stay:'Retour maison',contact:'',reservation:'',highlight:'AF 7410, arrivée à 13h35.',activities:['Arrivée Paris 09h35','Départ Paris 12h10','Arrivée Toulouse 13h35']}
];
function routeNormalize(value){return (value||'').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
document.addEventListener('DOMContentLoaded', () => {
  const routeList = document.getElementById('routeList');
  const searchInput = document.getElementById('searchInput');
  const filterSelect = document.getElementById('filterSelect');
  const saveStatus = document.getElementById('saveStatus');
  const expandAllBtn = document.getElementById('expandAllBtn');
  const collapseAllBtn = document.getElementById('collapseAllBtn');
  const resetNotesBtn = document.getElementById('resetNotesBtn');

  let notesState = loadNotes();
  let expandedState = {};
  itinerary.forEach(item => { expandedState[item.id] = item.id === '2026-07-09'; });

  function loadNotes() {
    try {
      const raw = localStorage.getItem(ROUTE_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (error) { return {}; }
  }
  function saveNotes(message) {
    try {
      localStorage.setItem(ROUTE_STORAGE_KEY, JSON.stringify(notesState));
      saveStatus.textContent = message || 'Notes sauvegardées localement.';
      saveStatus.className = 'status-ok';
    } catch (error) {
      saveStatus.textContent = 'Impossible de sauvegarder localement dans ce navigateur.';
      saveStatus.className = 'status-warn';
    }
  }
  function getStatus(item) {
    const ref = new Date('2026-07-09T00:00:00').getTime();
    const itemDate = new Date(item.date + 'T00:00:00').getTime();
    if (itemDate === ref) return 'today';
    if (itemDate < ref) return 'done';
    return 'upcoming';
  }
  function getBadge(status) {
    if (status === 'today') return {label:'Aujourd’hui', className:'badge badge-today'};
    if (status === 'done') return {label:'Passé', className:'badge badge-done'};
    return {label:'À venir', className:'badge badge-upcoming'};
  }
  function matchesFilter(item, search, filter) {
    const haystack = routeNormalize([
      item.dateLabel, item.title, item.route, item.stay, item.contact,
      item.reservation, item.highlight, item.activities.join(' '), notesState[item.id] || ''
    ].join(' '));
    if (search && !haystack.includes(search)) return false;
    const status = getStatus(item);
    if (filter === 'today') return status === 'today';
    if (filter === 'upcoming') return status === 'upcoming';
    if (filter === 'withReservation') return !!item.reservation;
    return true;
  }
  function buildCard(item) {
    const status = getStatus(item);
    const badge = getBadge(status);
    const noteValue = notesState[item.id] || '';
    const isExpanded = expandedState[item.id] !== false;
    return `
      <article class="day-card">
        <div class="day-header" data-toggle-id="${item.id}">
          <div class="day-top">
            <div>
              <div class="day-date">${item.dateLabel}</div>
              <div class="day-title">${item.title}</div>
            </div>
            <span class="${badge.className}">${badge.label}</span>
          </div>
          <div class="note">${item.route} • ${item.stay}</div>
        </div>
        <div class="day-body ${isExpanded ? '' : 'hidden'}" id="body-${item.id}">
          <div class="grid-2">
            <div class="info-card">
              <div class="card-label">Infos clés</div>
              <div class="info-list">
                <div class="info-row"><strong>Trajet / lieu</strong><span>${item.route || '—'}</span></div>
                <div class="info-row"><strong>Nuit / base</strong><span>${item.stay || '—'}</span></div>
                <div class="info-row"><strong>Contact</strong><span>${item.contact || '—'}</span></div>
                <div class="info-row"><strong>Réservation</strong><span>${item.reservation || '—'}</span></div>
                <div class="info-row"><strong>Point d’attention</strong><span>${item.highlight || '—'}</span></div>
              </div>
            </div>
            <div class="info-card">
              <div class="card-label">Programme</div>
              <ul class="activities-list">${item.activities.map(a => `<li>${a}</li>`).join('')}</ul>
            </div>
          </div>
          <div class="notes-card">
            <label class="card-label" for="note-${item.id}">Notes personnelles modifiables</label>
            <textarea id="note-${item.id}" data-note-id="${item.id}" placeholder="Ajouter une note utile...">${noteValue}</textarea>
          </div>
        </div>
      </article>`;
  }
  function bindDynamicEvents() {
    document.querySelectorAll('[data-toggle-id]').forEach(header => {
      header.addEventListener('click', function() {
        const id = this.dataset.toggleId;
        expandedState[id] = !(expandedState[id] !== false);
        render();
      });
    });
    document.querySelectorAll('[data-note-id]').forEach(area => {
      area.addEventListener('input', function() {
        notesState[this.dataset.noteId] = this.value;
        saveNotes('Notes enregistrées localement.');
      });
    });
  }
  function render() {
    const search = routeNormalize(searchInput.value.trim());
    const filter = filterSelect.value;
    const items = itinerary.filter(item => matchesFilter(item, search, filter));
    routeList.innerHTML = items.length ? items.map(buildCard).join('') : '<div class="panel">Aucun résultat pour ce filtre.</div>';
    bindDynamicEvents();
  }
  searchInput.addEventListener('input', render);
  filterSelect.addEventListener('change', render);
  expandAllBtn.addEventListener('click', () => { itinerary.forEach(i => expandedState[i.id] = true); render(); });
  collapseAllBtn.addEventListener('click', () => { itinerary.forEach(i => expandedState[i.id] = false); render(); });
  resetNotesBtn.addEventListener('click', () => {
    if (!window.confirm('Tu vas effacer toutes les notes personnelles enregistrées localement. Continuer ?')) return;
    notesState = {};
    saveNotes('Toutes les notes ont été réinitialisées.');
    render();
  });
  render();
});