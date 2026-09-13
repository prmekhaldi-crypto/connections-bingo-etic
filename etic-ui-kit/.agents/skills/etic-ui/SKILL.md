---
name: etic-ui
description: Concevoir ou refondre une interface ETIC en composant les rubans, géométries, cartes, typographies et tokens du kit. Guide général de direction visuelle et d’intégration React/TypeScript ou HTML/CSS ; ne concerne pas une tâche backend sans interface.
---

# Composer une interface ETIC

Le but est d’obtenir une interface cohérente et utile avec les ressources locales. Ce kit est un dossier partagé, pas un package à publier ni une application de démonstration. Réaliser l’écran demandé, y compris lorsqu’il s’agit de refondre une UI existante.

## 1. Comprendre l’écran avant de choisir les assets

Lire les instructions et conventions du projet hôte. Repérer les tâches, les contenus, les composants et les interactions existantes. Pour une refonte, inspecter le rendu actuel et conserver les fonctions métier. Ne pas confondre une interface propre avec une bonne composition ETIC.

Trouver `etic-ui/` à la racine, sous `src/` ou dans `etic-kit/`. Consulter le manifeste complet, pas seulement la sélection `assets.ts`.

- [Parcours de composition](../../../docs/composition-workflow.md) : méthode générale et brief de page.
- [Direction artistique](../../../docs/art-direction.md) : structure, expression, couleurs et rapports entre éléments.
- [Identité](../../../docs/identity.md) : règles officielles et adaptations distinctes.
- [Rubans](../../../etic-ui/assets/ribbons/README.md) : toutes les formes livrées, classées par famille.
- [Géométries](../../../docs/geometry.md) et [aperçus](../../../etic-ui/assets/geometric/README.md) : primitives, modules et compositions.
- [Catalogue complet](../../../docs/assets.md), [cartes](../../../docs/cards.md), [dégradés](../../../docs/gradients.md), [intégration](../../../docs/usage.md).

Si le dossier a été déplacé, retrouver ces fichiers par nom. Les liens correspondent à la structure du kit complet.

## 2. Fixer un parti pris pour toute la page

Décrire brièvement la tâche principale, le fond, la surface de lecture, la famille de rubans, les fichiers choisis et leur rôle, la hiérarchie typographique et le comportement mobile. Si rien ne bloque, poursuivre sans demander une validation de routine.

**Règle du propriétaire : une seule famille de rubans colorés sur toute la page.** Choisir `warm` (rouge/orange/jaune) OU `cool` (teal/bleu-vert/vert). Garder ce choix dans le bandeau, le corps, les panneaux et le pied de page. Ne pas alterner de famille entre sections. Aucun ruban n’est nécessaire si l’écran n’en a pas besoin ; le trait noir `neutral` ne constitue pas une deuxième famille colorée.

Pour un grand bandeau rouge, choisir un ruban chaud jaune/orange ou clair. Ne pas y superposer un gros ruban vert/teal. Vérifier `ribbonFamily`, `containsRibbonFamilies` et `pairingGuidance` dans le manifeste. Une illustration finie avec des rubans mixtes n’est pas un moyen de contourner le choix de page.

Ces règles viennent de la direction du projet, pas d’une interdiction universelle inventée dans Figma. Elles ne commandent pas de recolorer l’emblème, les boutons ou toutes les géométries pour les rendre monochromes.

## 3. Choisir une ressource pour un rôle précis

- Un ruban doit servir un geste graphique : boucle, arc, croisement, vague, slogan ou trait. Consulter son aperçu ; ne pas choisir le premier fichier par défaut. Ne pas fabriquer une variante absente avec un filtre CSS.
- Pour la géométrie, lire `kind`. Une `primitive` est une forme seule ; un `module` conserve l’assemblage et le recadrage de la source ; une `composition` réunit plusieurs parties.
- Pour le carré chaud de la charte, choisir `module-warm-square`. `double-disc-warm-free` est sa version hors cadre, avec un résultat différent. L’ancien nom `geometric-ribbon-warm` n’en fait pas un ruban souple.
- Vérifier la transparence et les dimensions. Un blanc inclus dans un module peut être intentionnel. Ne pas appliquer `object-fit: cover` à tous les assets ni agrandir un petit WebP jusqu’à le rendre flou.
- Réserver un espace calme pour lire et agir. Le décor n’est pas un remplissage obligatoire des espaces vides.

## 4. Construire une hiérarchie, puis implémenter

Gotham structure les titres et le corps ; Humming apporte une courte expression. Ne pas mettre toutes les étiquettes et actions en police expressive. Les tailles des planches Figma ne sont pas des tailles mobiles obligatoires. Les polices officielles ne sont pas livrées : annoncer le fallback lorsque la fidélité compte.

Réutiliser les boutons, états et cartes. Les contenus interactifs restent en HTML/React. `BrandArtwork` affiche les illustrations ; `Logo` réserve 2x ; `BrandCard` fournit les surfaces. Importer `styles.css` une fois et placer la zone dans `.etic-theme`. Garder les styles propres à l’écran dans sa fonctionnalité, avec un préfixe ou CSS Modules.

Exemple depuis `src/features/mon-ecran/`, kit dans `src/etic-ui/` :

```tsx
import { BrandArtwork, BrandCard, Button, type RibbonName } from '../../etic-ui';

const pageRibbon: RibbonName<'warm'> = 'ribbon-warm-loop-01';

export function Instructions({ onStart }: { onStart: () => void }) {
  return <section className="etic-stack">
    <BrandArtwork name={pageRibbon} width={180} />
    <BrandCard variant="paper" className="etic-stack">
      <h2 className="etic-heading">À toi de jouer</h2>
      <p className="etic-copy">Les consignes nécessaires pour commencer.</p>
      <div><Button onClick={onStart}>Commencer</Button></div>
    </BrandCard>
  </section>;
}
```

Le parent porte `.etic-theme`. `ribbonsByFamily` donne les sélections disponibles ; `RibbonName<'warm'>` ou `RibbonName<'cool'>` aide à typer le choix. En HTML, prendre les fichiers du sous-dossier de la famille choisie et les classes communes. Le type ne remplace pas une revue de toute la page.

Ne pas redessiner, étirer, tourner, ombrer ou recolorer le logo. Les stickers sont des œuvres fixes ; les mots « LOGO » et « variation » sont des titres de planche, pas des emblèmes.

## 5. Vérifier le résultat visuel et le comportement

Inspecter toute la page sur desktop et mobile, pas seulement un composant isolé. Vérifier la famille de rubans, l’association fond/décor, le niveau de géométrie, le recadrage, la hiérarchie, les espaces du logo et les contrôles. Corriger un décor qui surcharge ou contredit la composition, même si les tests de code passent.

Exécuter les commandes du projet hôte. Tester clavier, focus, états, contrastes, textes longs et réduction des animations. Garder les timers/listeners/animations propres à la fonctionnalité et nettoyer leurs effets.

Dans le dépôt du kit : `npm run check` et, si les composants changent, `npm run test:browser`. Ne pas créer un site pour présenter le kit. Pour un asset manquant, consulter [la couverture](../../../docs/charter-coverage.md) avant une nouvelle extraction ; ne pas prétendre que chaque masque ou doublon est une forme nouvelle.

Pour modifier les ressources partagées, suivre [l’extraction](../../../docs/extraction.md). Pour une copie existante, lire [la migration](../../../docs/migration.md) et [la diffusion](../../../docs/distribution.md). Préserver les modifications des membres. Les nouveaux noms d’import sont préférés ; les alias maintenus évitent de casser les anciens usages.
