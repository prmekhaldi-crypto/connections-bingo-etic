# Extraction, transformations et limites

La bibliothèque a été extraite avec le MCP Figma du fichier `eofQFq1bCM8Ooe5KXBDRsk`, puis inspectée par familles. Les identifiants de nœuds sont conservés dans le manifeste. Aucune modification du fichier Figma n’était nécessaire.

## Ce qui est livré

- Les éléments autonomes : emblèmes, rubans, courbes, formes, motifs, stickers et lettrages.
- Les cinq échantillons de dégradés, sans les légendes imprimées sur la planche.
- Les fonds de cartes sans texte et deux compositions de cartes avec rubans comme références.
- Les 33 planches de charte sous forme de références WebP, avec un index.
- Huit traitements de cartes en vrai CSS/React, des tokens et un catalogue typé.

## Traitement des exports

1. Les exports vectoriels isolés sont préférés lorsqu’ils correspondent à l’objet entier.
2. Les rendus SVG complets incluent parfois le fond gris artificiel du renderer, le fond de planche et la carte parente. Ces éléments étrangers sont supprimés en conservant le groupe cible, ses définitions, ses masques, ses transformations et ses effets propres.
3. Pour une forme libre, le viewBox peut être ajusté pour restituer les parties hors de la planche. Pour un module géométrique, conserver au contraire le clipping intentionnel de son frame. Les extractions antérieures qui confondaient ces niveaux ont été corrigées ; les tracés ne sont pas redessinés.
4. Les SVG contenant des images raster sont rendus en WebP lossless avec alpha, jusqu’à 2× et au maximum 1600 px sur le grand côté. La compression est sans perte après rendu ; il s’agit cependant d’une rasterisation, pas d’un original vectoriel infini. Les petites dimensions sources peuvent limiter la qualité à très grande taille.
5. Les fichiers entièrement vectoriels restent des SVG. Les définitions inutilisées sont retirées ; les tracés ne sont pas simplifiés. `preserveAspectRatio` conserve le ratio. La notation rgba des flood colors est normalisée en couleur + opacité équivalentes pour la compatibilité des renderers.
6. Les planches de référence sont compressées en WebP à 1200 px de large. Pour lire un détail minuscule, ouvrir le nœud Figma source.

Les effets de bruit procédural SVG peuvent varier légèrement entre moteurs. Les modes de fusion de formes isolées peuvent aussi donner un résultat différent selon le fond sur lequel elles sont placées. Comparer à la planche lorsque la composition exacte compte.

## Ne pas confondre les usages

Un sticker qui contient une variation colorée du logo est une œuvre fixe existante ; ce n’est pas une permission de recolorer le composant Logo. Les titres « LOGO » et « variation » sont des lettrages de planche, pas des wordmarks ETIC. Cette erreur du premier index a été corrigée.

Les numéros de chapitres, les textes éditoriaux et les exemples interdits sont consultables dans les planches. Ils ne sont pas proposés comme variantes officielles. La bibliothèque ne prétend pas fournir chaque calque technique, masque ou doublon du fichier comme un asset indépendant.

## Maintenance

Après un ajout, renseigner `etic-ui/asset-manifest.json` (nom unique, famille, chemin, dimensions, taille, rôle et source), puis lancer :

```sh
npm run assets:refresh # uniquement après revue des fichiers modifiés
npm run catalog:generate
npm run check
```

La génération des index n’ajoute aucun framework, ne télécharge rien et ne crée pas de site. Vérifier également l’image visuellement. Pour un nouvel export Figma, inspecter le nœud avant de choisir SVG ou raster ; éviter un SVG lourd qui ne contient que des images.

Les exports vides, nœuds masqués et fonds incomplets sont explicités dans [la couverture](charter-coverage.md). Les polices restent absentes faute de fichiers redistribuables fournis.

Les empreintes SHA-256 sont un repère de contenu validé. `check` ne les modifie jamais. Après une modification volontaire, vérifier visuellement le fichier et ses dimensions avant de renouveler son empreinte avec `assets:refresh`.

## Décomposition vérifiée

Le carré chaud 1:2848 garde son cadre et son fond ; ses légendes sont retirées. Les modules de 1:2804 et 1:2817 sont extraits aux coordonnées des colonnes ou cellules sources, avec uniquement leurs parties correspondantes. Leur fenêtre est conservée dans le manifeste. La paire de disques hors cadre reste disponible sous un nom explicite, distinct du module carré. Voir [geometry.md](geometry.md).

Les 41 ressources du dossier ribbons comprennent les familles de formes de la charte et leurs variantes observées dans les supports. Ce nombre ne prétend pas compter 41 formes entièrement distinctes : orientation, texture et contexte peuvent varier. Aucune version chaude/froide n’est inventée pour compléter artificiellement une paire.
