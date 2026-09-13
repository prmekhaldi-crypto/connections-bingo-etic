# Mise à jour du rangement des assets

Le kit reste un dossier à copier. Le travail de packaging npm et la commande `etic-ui-setup` ont été abandonnés et retirés.

## Rubans

Toutes les vagues, lignes avec slogans et grands rubans livrés sont désormais dans :

```text
etic-ui/assets/ribbons/
  warm/       Rouge, orange, jaune
  cool/       Teal / bleu-vert, vert
  neutral/    Trait noir
  README.md   Aperçus et consignes
```

Les anciens dossiers `waves/` et les fichiers de rubans auparavant dans `compositions/` ou `decorations/` ne sont plus les chemins canoniques. **Les noms d’import via `brandAssets` sont conservés.** Les usages HTML ou imports directs de fichiers doivent suivre les nouveaux chemins du manifeste.

## Géométries

Les fichiers sont classés sous `geometric/primitives`, `geometric/modules` et `geometric/compositions`. Certains contours ont été réexportés sans les marges artificielles de l’ancienne extraction. Les modules conservent leur recadrage voulu.

| Ancien nom d’import | Nouveau nom recommandé | Comportement |
| --- | --- | --- |
| `semicircle-mint` | `half-ellipse-mint` | Ancien nom maintenu comme alias |
| `semicircle-white` | `half-disc-white` | Ancien nom maintenu comme alias |
| `semicircle-teal` | `d-shape-teal` | Ancien nom maintenu comme alias |
| `geometric-ribbon-warm` | `double-disc-warm-free` | Ancien nom maintenu ; pour le carré recadré, sélectionner `module-warm-square` |

[Table des chemins déplacés](brand/path-migration.json). Ce fichier liste les changements de cette réorganisation ; le manifeste donne le chemin actuel, les alias et `previousPaths`.

## Mettre à jour un projet consommateur

1. Comparer les changements locaux dans sa copie du kit avant remplacement.
2. Copier ensemble le dossier `etic-ui/`, les documents et le skill de la même révision.
3. Rechercher les imports directs ou URLs d’anciens dossiers ; les adapter avec la table des chemins. Les imports par nom du catalogue restent valides grâce aux alias.
4. Revoir les pages : choisir une seule famille de rubans par page et inspecter le nouveau cadrage des géométries.
5. Exécuter le build et les tests du projet consommateur.

Ne pas remplacer aveuglément toute une application pour mettre à jour le kit. La logique métier et les styles locaux restent sous la responsabilité de leurs auteurs.
