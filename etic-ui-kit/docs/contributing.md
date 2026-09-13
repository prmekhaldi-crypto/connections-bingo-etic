# Construire une interface avec le kit

## Répartition des responsabilités

- `etic-ui/` : identité partagée, tokens, assets et composants génériques.
- Dossiers de fonctionnalités du projet hôte : mise en page spécifique, logique métier, navigation, canvas, état, callbacks, scores et éventuels jeux.
- `docs/` : référence humaine, utilisable indépendamment de l’agent.
- `.agents/skills/etic-ui/` : instructions ciblées pour trouver et appliquer ces ressources.

Ne pas modifier les composants partagés pour un détail propre à une seule interface. Composer les composants ou utiliser une classe locale. Ajouter un composant partagé lorsque plusieurs interfaces ont réellement besoin du même comportement.

## Visuel : faire / éviter

| Faire | Éviter |
| --- | --- |
| Ink sur beige : **texte courant lisible** | Jaune sur beige : texte peu lisible |
| Blanc sur rouge : **action principale** | Petit texte blanc sur la zone jaune d’un dégradé |
| Logo original, hauteur automatique, marge 2x | Logo étiré, tourné, recoloré ou avec ombre |
| Courbe dans une marge libre | Motif derrière une consigne ou un contrôle |
| Message « ✓ Terminé » avec une couleur d’état | Couleur seule comme signe de réussite |

Voir les [aperçus des assets](assets.md) et le [schéma officiel d’exclusion](brand/logo-clearspace.png). Ne pas utiliser une mauvaise combinaison comme style réel d’interface.

## Responsive et accessibilité

- Construire la mise en page mobile avant d’ajouter des colonnes. Utiliser `minmax(0, 1fr)` dans les grilles et vérifier le retour à la ligne des textes longs.
- Garder les boutons tactiles d’au moins 44 × 44 px ; les boutons du kit font au moins 48 px de haut.
- Employer les éléments natifs : button, link, input, progress. Nommer les actions icônes avec `IconButton label`.
- Vérifier Tab, Maj+Tab, Entrée et Espace. Le focus clavier doit rester visible et ne pas être coupé par un conteneur.
- Conserver un contraste de texte d’au moins 4,5:1 pour le texte courant ; vérifier aussi les contours des contrôles. Le token border sert à des séparations décoratives, pas à signaler seul un contrôle.
- Donner un titre à chaque région importante, une étiquette aux champs, un texte aux résultats et des messages d’erreur utiles.
- Pour un canvas, fournir des commandes accessibles et un équivalent textuel de l’état. Le CSS ne rend pas les pixels accessibles.
- Utiliser les propriétés logiques (`padding-inline`, etc.) et vérifier le RTL lorsqu’il est nécessaire.
- Respecter `prefers-reduced-motion`. Ne pas ajouter de mouvement décoratif permanent.
- Nettoyer les timers, listeners et boucles d’animation dans le retour des effets React. Garder l’état métier en dehors des composants purement visuels.

## Checklist courte

- [ ] Assets existants et tokens réutilisés ; aucune spécification officielle inventée.
- [ ] Aucun style global non préfixé ajouté au kit.
- [ ] Actions nommées, états disabled/loading utiles, focus visible.
- [ ] Mobile, textes longs, clavier, contrastes et réduction des animations vérifiés dans le projet hôte.
- [ ] `npm run check` passe ; `npm run test:browser` passe pour une modification de composant.
- [ ] Documentation et index des assets mis à jour si le contrat partagé change.

Ce dépôt ne lance pas d’application. La validation visuelle d’une interface complète se fait dans le projet consommateur.
