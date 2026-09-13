# Choisir et assembler les géométries

Le problème corrigé n’était pas uniquement le nombre de fichiers : certaines extractions avaient supprimé le cadrage qui donnait son sens au motif. Les géométries sont désormais séparées en trois niveaux dans `etic-ui/assets/geometric/`.

| Niveau | Dossier | À quoi il sert |
| --- | --- | --- |
| Primitive | `primitives/` | Forme seule : barre, point, découpe concave, demi-ellipse, demi-disque incliné, capsule, bloc de dégradé |
| Module | `modules/` | Assemblage source utilisable comme unité : disque sur orange, D sur teal, neuf pastilles, colonne, carré chaud |
| Composition | `compositions/` | Visuel réunissant plusieurs parties : les trois colonnes, la mosaïque, les disques libres |

Les modules sont des illustrations, pas des cartes interactives. Les textes et boutons de l’application restent du vrai HTML/React.

## Exemple important : carré chaud et disques libres

- **`module-warm-square`** reproduit le cadre carré du nœud [1:2848](https://www.figma.com/design/eofQFq1bCM8Ooe5KXBDRsk?node-id=1-2848), avec son fond rouge et le recadrage voulu. Les deux légendes imprimées sont retirées.
- **`double-disc-warm-free`** expose les formes du groupe [1:2849](https://www.figma.com/design/eofQFq1bCM8Ooe5KXBDRsk?node-id=1-2849) hors de ce cadre. Ce n’est pas le même résultat visuel.
- **`half-disc-warm-01` à `04`** donnent les quatre pièces inclinées de ce groupe, avec leurs peintures d’origine.

L’ancien nom d’import `geometric-ribbon-warm` reste un alias de `double-disc-warm-free` pour ne pas casser le code. Il faut choisir explicitement `module-warm-square` pour retrouver la composition carrée de la planche. Ce motif géométrique n’est pas un ruban souple.

## Les noms décrivent désormais le contour

- `half-ellipse-mint` et `half-ellipse-teal` : demi-ellipses verticales, pas des demi-cercles parfaits.
- `corner-cutout-teal-top` et `corner-cutout-teal-bottom` : formes à découpe concave servant de contreformes ; ce ne sont pas des quarts de disque pleins.
- `d-shape-teal` : forme en D avec une partie rectiligne et une extrémité courbe.
- `half-disc-white` : demi-disque horizontal clair.

Les anciens imports `semicircle-mint`, `semicircle-teal` et `semicircle-white` sont conservés comme alias. Utiliser les nouveaux noms dans le nouveau code.

## Modules extraits de la mosaïque

Ces modules conservent les coordonnées et le contenu de leurs fenêtres d’origine ; ils ne sont pas redessinés :

| Module | Cadre source | Contenu conservé |
| --- | --- | --- |
| `module-dots` | 1:2817 | Neuf pastilles sur fond blanc |
| `module-disc-orange` | 1:2817 | Disque chaud centré sur orange |
| `module-d-teal` | 1:2817 | Forme en D sur teal |
| `module-stripes-warm` | 1:2817 | Les deux bandes de dégradé |
| `module-teal-column` | 1:2804 | Fond teal et demi-ellipse |
| `module-orange-column` | 1:2804 | Fond orange, disque texturé et demi-disque blanc |
| `module-yellow-column` | 1:2804 | Fond jaune et capsule claire |

Le champ `extraction.rect` du manifeste donne `(x, y, largeur, hauteur)` dans le cadre source. Le fond blanc d’un module n’est pas une marge parasite : il peut faire partie de la composition. À l’inverse, une primitive isolée conserve sa transparence.

## Comment choisir

1. Pour reproduire un morceau reconnaissable de la charte, commencer par le **module** approprié.
2. Pour faire une composition spécifique, utiliser les **primitives** et choisir délibérément leur alignement, échelle et relation. Ne pas supposer qu’une grille de primitives arbitraires reconstitue la source.
3. Pour utiliser une illustration entière, choisir la **composition** ; éviter de la découper une deuxième fois sans raison.
4. Respecter les proportions. Ne pas appliquer `object-fit: cover` par défaut aux modules : cela changerait leur recadrage.
5. Une forme pleine, un masque technique et une composition ne sont pas interchangeables. Vérifier l’aperçu avant usage.

[Catalogue illustré](assets/geometric.md) · [Dossier des géométries](../etic-ui/assets/geometric/README.md) · [Planche source](brand/boards/1-2796.webp)
