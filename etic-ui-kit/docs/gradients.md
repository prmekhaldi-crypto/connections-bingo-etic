# Tous les dégradés relevés

## Les cinq définitions officielles

- `--etic-gradient-1` : rouge, orange et jaune.
- `--etic-gradient-2` : orange et beige doré.
- `--etic-gradient-3` : jaune et blanc rosé.
- `--etic-gradient-4` : teal et mint.
- `--etic-gradient-5` : teal et green.

Les stops et positions sont vérifiés. Les matrices exactes sont conservées dans [figma-gradients.json](brand/figma-gradients.json). Les versions SVG sans légendes se trouvent dans [le catalogue des dégradés](assets/gradients.md). Elles gardent la géométrie et la direction de la planche. Les dégradés CSS standard adaptent la direction au web ; ne pas les présenter comme une reconstruction exacte de la matrice Figma sur tout ratio.

```css
.my-decoration {
  background: var(--etic-gradient-1);
}
```

## Les seize combinaisons de stops observées dans les illustrations

L’inspection de toutes les planches trouve **16 combinaisons uniques** de couleurs et de positions, dont les cinq officielles et onze variantes d’application. Elles sont disponibles dans `art-gradients.css` sous `--etic-art-gradient-01` à `--etic-art-gradient-16`.

| Token art | Exemple de nœud | Particularité |
| --- | --- | --- |
| 01 | 1:1594 | Dégradé officiel 3 |
| 02 | 1:1580 | Dégradé officiel 1 |
| 03 | 1:1587 | Dégradé officiel 2 |
| 04 | 1:1354 | Rouge/orange/jaune, positions différentes sur le chiffre 2 |
| 05 | 1:1357 | Rouge vers orange, deux stops |
| 06 | 1:1358 | Rouge vers une nuance orangée |
| 07 | 1:1359 | Ordre inverse de la variante 06 |
| 08 | 1:1360 | Orange vers une nuance rouge |
| 09 | 1:1601 | Dégradé officiel 4 |
| 10 | 1:1608 | Dégradé officiel 5 |
| 11 | 1:2537 | Jaune/blanc rosé, départ à 0 % |
| 12 | 1:2810 | Pink vers red |
| 13 | 1:2814 | Mint vers teal |
| 14 | 1:2845 | Blanc partiellement transparent vers teal |
| 15 | 1:3070 | Teal vers teal assombri |
| 16 | 1:3498 | Rouge/orange/jaune, départ avancé sur le chiffre 7 |

[Valeurs brutes et occurrences sources](brand/figma-paint-variants.json). Les tokens art utilisent une direction CSS commune de 90° pour rendre ces combinaisons disponibles ; ce choix est explicitement applicatif. Pour une illustration fidèle avec sa direction, ses masques et sa texture, utiliser le fichier exporté.

Les dégradés contenus dans les images raster ne sont pas réinterprétés en faux stops CSS : l’image d’origine est conservée dans le rendu du ruban ou de la forme.

## Choisir le bon support

- Fond de composition : la charte autorise rouge, beige ou dégradés **1, 2, 5**.
- Les dégradés 3 et 4 restent utilisables comme accents/décors selon la charte ; ils ne sont pas automatiquement des fonds de page autorisés.
- Pas de texte essentiel directement sur une zone dont le contraste varie. Mettre le contenu sur une carte opaque si nécessaire.
- Les variantes d’illustration ne constituent pas une extension de la palette officielle.
