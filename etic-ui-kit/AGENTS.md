# Instructions pour les agents

Ce dépôt contient un kit de ressources frontend ETIC réutilisables. Il ne contient pas et ne doit pas devenir une application de démonstration sans demande explicite.

Pour créer ou modifier une interface ETIC, lire [.agents/skills/etic-ui/SKILL.md](.agents/skills/etic-ui/SKILL.md).

- Ressources à réutiliser : `etic-ui/` (assets, CSS, composants React). Consulter le catalogue complet `etic-ui/asset-manifest.json` et `docs/assets.md`, pas seulement la sélection de `assets.ts`.
- Cartes et dégradés : `docs/cards.md` et `docs/gradients.md`. Références de toute la charte : `docs/charter-coverage.md`.
- Une seule famille de rubans colorés par page : warm OU cool, dans toutes les sections. Lire `ribbonFamily`, `containsRibbonFamilies` et `pairingGuidance`. Tous les rubans livrés se trouvent sous `etic-ui/assets/ribbons/`.
- Géométries : distinguer primitives, modules et compositions ; lire `docs/geometry.md`. Ne pas perdre le recadrage voulu d’un module.
- Direction artistique : lire `docs/art-direction.md` avant de composer une interface. Pour les grands bandeaux rouges, choisir un ruban chaud jaune/orange ou clair ; ne pas superposer un gros ruban vert/teal. Lire `pairingGuidance` dans le manifeste : cette association est une direction du propriétaire, pas une interdiction universelle inventée pour la charte.
- Règles de marque et adaptations UI : `docs/identity.md`.
- Imports, exemples React et HTML : `docs/usage.md`.
- Ne pas inventer des spécifications officielles, recréer un logo ou ajouter des polices non autorisées.
- Préserver les fichiers sans rapport avec la demande. Les styles spécifiques et la logique métier appartiennent au projet consommateur.
- Validation locale des composants : `npm ci`, puis `npm run check`. Après modification du manifeste, lancer `npm run catalog:generate`.

Tests navigateur reproductibles : `npm run test:browser` (installer Chromium au préalable). Ne pas transformer ce harnais de test en site de démonstration.
