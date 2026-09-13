# Catalogue des assets ETIC

139 fichiers graphiques locaux. Les aperçus ci-dessous sont des documents Markdown, pas un site. Chaque fichier possède une source, des dimensions et un usage dans [le manifeste](../etic-ui/asset-manifest.json).

| Famille | Fichiers | Catalogue |
| --- | ---: | --- |
| Logos | 2 | [Ouvrir](assets/logos.md) |
| Pictogrammes de contact et réseaux | 6 | [Ouvrir](assets/icons.md) |
| Rubans | 41 | [Ouvrir](assets/ribbons.md) |
| Formes libres | 22 | [Ouvrir](assets/organic.md) |
| Formes géométriques | 31 | [Ouvrir](assets/geometric.md) |
| Compositions | 3 | [Ouvrir](assets/compositions.md) |
| Stickers | 13 | [Ouvrir](assets/stickers.md) |
| Lettrages fixes | 6 | [Ouvrir](assets/lettering.md) |
| Cartes | 10 | [Ouvrir](assets/cards.md) |
| Dégradés officiels | 5 | [Ouvrir](assets/gradients.md) |

## Choisir rapidement

- **Logo institutionnel** : `etic-color` ou `etic-white`, via le composant `Logo`.
- **Rubans** : choisir warm OU cool pour toute la page, puis consulter ribbons/ ; vagues, slogans et grands rubans y sont regroupés. neutral contient le trait noir.
- **Visuel plus expressif** : une composition ou un motif géométrique dans un espace dédié.
- **Message de club** : sticker ou lettrage existant, sans réinterpréter le logo.
- **Contenu interactif** : `BrandCard`, avec du vrai HTML ; les images de cartes restent des références/surfaces.

Les stickers illustrent des compositions spécifiques ; leurs variations ne donnent pas la permission de recolorer le logo de base. Les lettrages « LOGO » et « variation » sont des titres de planche, explicitement séparés des logos.

## Utilisation

```tsx
import { BrandArtwork, brandAssets } from './etic-ui';
<BrandArtwork name="ribbon-cool-loop-01" width={180} />
<img src={brandAssets["dots-nine"]} width={96} alt="" />
```

Les imports directs des fichiers restent possibles en React ou HTML. Le manifeste fournit les chemins relatifs à `etic-ui/assets/`. Les variantes blanches se consultent sur fond rouge.

[Parcours de composition](composition-workflow.md) · [Décomposition géométrique](geometry.md) · [Cartes en code](cards.md) · [Dégradés](gradients.md) · [Couverture des 33 planches](charter-coverage.md) · [Méthode et limites](extraction.md)
