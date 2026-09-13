# Les cartes de la charte, en assets et en code

[Voir tous les fonds et cartes composées](assets/cards.md).

Les traitements ci-dessous ont été relevés dans Figma. Les dimensions fixes des planches ne sont pas imposées au contenu web. Le composant `BrandCard` garde les rayons, la transparence et l’ombre ; son padding, sa taille automatique et son absence de rotation sont des adaptations d’interface.

| Variante React / suffixe CSS | Source | Fond | Rayon | Ombre observée |
| --- | --- | --- | --- | --- |
| `paper` | 1:2092 et 1:2232 | blanc 88 % | 21,4289 px | y 2,3166 ; flou 34,7495 ; noir 17 % |
| `wide` | 1:1003 | blanc 96 % | 38 px | y 4 ; flou 60 ; noir 7 % |
| `wide-soft` | 1:1490, 1:3651, 1:3706 | blanc 88 % | 38 px | y 4 ; flou 60 ; noir 7 % |
| `story` | 1:3352 et 1:3439 | blanc 88 % | 22 px | y 4 ; flou 16,3 ; spread -3 ; noir 25 % |
| `label` | 1:2863 | blanc 88 % | 38 px | y 4 ; flou 16,3 ; spread -3 ; noir 25 % |
| `caption` | 1:2670 et 1:2794 | blanc 88 % | 22 px | aucune sur le frame ; le groupe parent de la planche porte une ombre |
| `amber` | 1:1228 et 1:1235 | dégradé 2 | 43,0622 px | y 12,8703 ; flou 40,327 ; noir 35 % |
| `tab` | 1:1229 | blanc opaque | 28,3147 px | y 3,4321 ; flou 8,5802 ; noir 25 % |

Figma et CSS ne calculent pas nécessairement le flou de façon identique. Les paramètres sont conservés ; les SVG de référence permettent de comparer. Les deux grandes cartes de rubans sont exportées avec leurs décors sous les noms `card-ribbons-cool-reference` et `card-ribbons-warm-reference`. Elles sont uniquement des références visuelles.

## React

```tsx
import { BrandCard, BrandHeading, Button } from './etic-ui';

<BrandCard variant="story" className="etic-stack">
  <BrandHeading accent="À toi de jouer">Le collectif</BrandHeading>
  <p className="etic-copy">Des consignes lisibles et un vrai bouton.</p>
  <div><Button onClick={onStart}>Commencer</Button></div>
</BrandCard>
```

L’UI doit être placée sous `.etic-theme`. `BrandHeading` peut prendre `as="h1"`, `h2` ou `h3`. La partie expressive utilise Humming si disponible ; sinon le fallback est visible et assumé. Ne pas utiliser une image de lettrage pour un titre qui doit rester modifiable.

## HTML/CSS

```html
<div class="etic-theme">
  <section class="etic-brand-card etic-brand-card--paper etic-stack">
    <h2 class="etic-brand-heading">Le collectif
      <span class="etic-brand-heading__accent">À toi de jouer</span>
    </h2>
    <p class="etic-copy">Des consignes lisibles.</p>
    <div><button type="button" class="etic-button">Commencer</button></div>
  </section>
</div>
```

## Cas particulier : carte orangée

La planche d’introduction contient du petit texte blanc sur orange. Cette combinaison n’est pas assez contrastée pour être reproduite telle quelle dans une interface. `BrandCard variant="amber"` conserve le cadre dégradé et place le contenu dans une surface beige opaque. **Cette surface intérieure est une adaptation d’accessibilité**, pas une prescription Figma.

En HTML, ajouter explicitement ce conteneur :

```html
<div class="etic-brand-card etic-brand-card--amber">
  <div class="etic-brand-safe-content etic-brand-card__content">
    <h2 class="etic-heading">Instructions</h2>
    <p class="etic-copy">Le décor reste autour du contenu.</p>
  </div>
</div>
```

Les autres cartes translucides doivent aussi être placées sur un fond calme. Si du texte ou une texture passe dessous, utiliser `etic-brand-safe-content` pour garantir la lecture. Les rotations des cartes de la charte sont conservées dans les assets, pas appliquées aux boutons ou formulaires.

## Rendu des composants

Captures de vérification des vrais composants, avec les polices disponibles sur la machine de test. Elles ne constituent pas une application livrée et ne garantissent pas que les polices officielles sont installées sur une autre machine.

[Desktop](brand/card-treatments-desktop.png) · [Mobile](brand/card-treatments-mobile.png)
