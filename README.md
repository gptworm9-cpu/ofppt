# OFPPT Notes (React + Laravel)

Plateforme de gestion des notes/stagiaires selon le scénario demandé.

## Structure

- `frontend/` : interface React (Vite)
- `backend/` : fichiers API Laravel (routes, contrôleurs, modèles, migrations, seeder)

## Fonctionnalités implémentées

### Côté stagiaire Full Stack
- Inscription avec : Nom, Prénom, Gmail, Téléphone, Groupe (`DEV201`/`DEV202`), Password + Confirm.
- Login par Gmail + Password.
- Message d’erreur `incorrect` si les identifiants sont faux.
- Lien **I forget my password**.
- Vérification identité par : nom, prénom, téléphone, gmail.
- Formulaire **New password + Confirm password** après validation identité.
- Tableau de modules : UML, Laravel, React, PIE, English, French, Approche Agile.
- Affichage des notes (Contrôle 1/2/3 + EFM + Regional) par module.
- Affichage des notifications envoyées par les formateurs.

### Côté formateur
- Login dédié formateur (bloque les comptes non-formateurs sur cette page).
- Choix du groupe (`DEV201`/`DEV202`) puis récupération des stagiaires du groupe.
- Saisie/édition des notes par module et stagiaire.
- Upload ressource (PDF/image) + choix groupe => notification générée pour les stagiaires du groupe sélectionné.

### Côté options/profils
- Carte **Tronc Commun** affichée en **Coming soon**.
- Page **Développeurs** avec Azzedine Oubaid et Loubna Azmam.

## Comptes formateurs seedés

- hamzareact@ofppt.ma / react123456
- piepie@ofppt.ma / pie123456
- francaiefr@ofppt.ma / fr123456
- englisheng@ofppt.ma / eng123456
- umluml@ofppt.ma / uml123456
- laraveltoufella@ofppt.ma / toufella123456
- approcheagile@ofppt.ma / approche123456

## Assets à placer

- `frontend/public/assets/logo.png`
- `frontend/public/assets/azzedine.jpg`
- `frontend/public/assets/loubna.jpg`

## Quick start

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend (dans un vrai projet Laravel)
Copier le contenu de `backend/` dans un projet Laravel existant puis:
```bash
php artisan migrate
php artisan db:seed
php artisan serve
```

URL API attendue côté frontend : `http://127.0.0.1:8000/api` (modifiable via `VITE_API_URL`).
