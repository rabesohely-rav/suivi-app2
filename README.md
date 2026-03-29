# Suivi voyage Madagascar

Application web statique mobile-friendly pour centraliser :
- accueil / tableau de bord
- convertisseur AR ↔ €
- suivi des dépenses
- feuille de route modifiable par notes
- réservations
- agenda
- infos utiles

## Structure

- `index.html` : accueil
- `pages/` : pages métiers
- `assets/css/style.css` : styles communs
- `assets/js/` : logique par module
- `assets/data/` : données statiques JSON

## Mise en ligne GitHub Pages

1. Garde `index.html` à la racine.
2. Pousse tout le dossier sur GitHub.
3. Active Pages sur `main / (root)`.
4. Ajoute `.nojekyll` à la racine.

## Notes

- Les notes de feuille de route et les données de dépenses utilisent le `localStorage`.
- Le convertisseur et les dépenses tentent de charger un taux réseau puis basculent sur le dernier taux sauvegardé.
- Pour un usage terrain, teste au moins une fois en mode avion après un premier chargement réseau.