# Vérifications reproductibles

```sh
npm ci
npm run check
npx playwright install chromium
npm run test:browser
```

- **TypeScript strict** : composants et contrat d’usage, dont les erreurs attendues pour une icône sans label, un asset inexistant ou un logo utilisé sans son composant de protection.
- **Catalogue** : 139 fichiers, chemins, tailles, empreintes SHA-256, formats et sources cohérents ; liens Markdown valides.
- **Génération** : le code TypeScript et les catalogues Markdown correspondent exactement au manifeste ; `--check` ne réécrit pas les fichiers.
- **Tests des contrôles** : corruption de même taille détectée par empreinte ; index périmé rejeté sans écrasement silencieux, puis régénération validée en copie temporaire.
- **Organisation** : familles des rubans, niveaux géométriques, alias sans collision et liens des README dans les dossiers d’assets vérifiés.
- **Références** : les 33 planches sont présentes.
- **Navigateur Chromium** : rendu à 390 et 1400 px, clic et Entrée, focus, disabled/loading, progression et bornes invalides, espace du logo, absence de débordement, isolation du CSS et réduction des animations.
- **HTML sans React** : les mêmes styles s’appliquent aux contrôles natifs.
- **Fichiers graphiques** : chaque image se décode et chaque SVG est analysable en XML dans le navigateur.
- **Skill** : frontmatter et structure validés avec le validateur skill-creator.

Les tests utilisent `page.setContent` en mémoire et ne livrent aucun site ni serveur d’application. Les dépendances esbuild, playwright et react-dom servent uniquement au développement du kit ; elles ne sont pas nécessaires pour utiliser les assets ou le CSS.

Les aperçus des familles et des cartes ont été inspectés visuellement. Les captures de la première vérification des cartes restent dans [le guide des cartes](cards.md). Les polices installées sur la machine peuvent différer de celles des membres.

Ces vérifications ne sont pas une certification de toute future interface : valider dans le projet consommateur ses fonds réels, ses contenus longs, son éventuel canvas et les navigateurs ciblés. Les limites d’export sont listées dans [la revue](audit.md).
