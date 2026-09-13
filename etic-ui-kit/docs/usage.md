# Utiliser le kit

## React + TypeScript

Copier le dossier `etic-ui/` dans `src/etic-ui/` de l’application existante. Dans son point d’entrée :

```tsx
import './etic-ui/styles.css';
```

Dans une interface située directement dans `src/` :

```tsx
import { Button, Card, Instructions, Logo, Progress, StatusMessage } from './etic-ui';

export function InstructionsPanel({ onStart }: { onStart: () => void }) {
  return (
    <section className="etic-theme etic-stack" aria-label="Instructions">
      <Logo width={72} />
      <Card>
        <h2 className="etic-heading">À toi de jouer</h2>
        <Instructions steps={['Lis les consignes.', 'Sélectionne une réponse.']} />
      </Card>
      <Progress label="Étapes terminées" value={1} max={4} />
      <StatusMessage>Tu peux avancer à ton rythme.</StatusMessage>
      <div><Button onClick={onStart}>Commencer</Button></div>
    </section>
  );
}
```

Depuis `src/features/mon-interface/`, l’import sera `../../etic-ui`. Les imports sont relatifs : aucun alias n’est requis.

### Composants disponibles

| Export | Rôle | Paramètres utiles |
| --- | --- | --- |
| `Button` | Action native | `variant`: primary, secondary, quiet ; `loading`, `disabled`, attributs button |
| `IconButton` | Action avec icône | `label` obligatoire, icône passée comme enfant |
| `Card` | Contenu autonome | Attributs HTML de div, `className`, enfants |
| `Panel` | Contenu nécessitant un cadre plus marqué | Attributs HTML de div |
| `Badge` | État compact statique | `tone`: neutral, success, error |
| `StatusMessage` | Retour d’action annoncé | `tone`: neutral, success, error ; enfants |
| `Instructions` | Consignes numérotées | `steps`: tableau de textes |
| `Progress` | Progression native étiquetée | `label`, `value`, `max` (100 par défaut) |
| `Logo` | Emblème officiel avec espace réservé | `variant`: color ou white ; `width` en pixels |
| `assets` | URLs locales importées | color, white, headingLogo, headingVariation, eticLettering, wave, shapes, pattern |
| `assetIndex` / `brandAssetIndex` | Catalogue complet | nom, URL, usage, dimensions, source Figma |

Le chargement de Button doit être piloté par le projet : le kit affiche l’état occupé et désactive le bouton, il ne déclenche pas d’appel réseau. Éviter de monter des messages d’erreur avant qu’une erreur réelle existe.

```tsx
<IconButton label="Fermer le panneau" variant="quiet" onClick={onClose}>
  <span aria-hidden="true">×</span>
</IconButton>
<Button loading={saving} disabled={!valid} onClick={save}>Enregistrer</Button>
<Badge tone="success">Terminé</Badge>
```

### Images et décors

```tsx
import { assets } from './etic-ui';

<img className="etic-decoration" src={assets.wave} alt="" aria-hidden="true" />
```

Placer les décors dans une marge dédiée. Ils ne doivent pas recouvrir du texte, le logo ou les contrôles. Le composant Logo préserve les proportions et réserve une marge de 17 % de sa largeur sur chaque côté. Le lettrage horizontal ETIC est une illustration typographique distincte ; il ne remplace pas l’emblème. Les anciens exports mal nommés wordmark/tagline ont été reclassés en headingLogo/headingVariation.

Le projet hôte doit prendre en charge les imports SVG/PNG comme URLs (par exemple avec Vite ou un bundler configuré pour les assets). Si le framework renvoie un objet image au lieu d’une URL, adapter uniquement `assets.ts`, ou copier les images dans son répertoire public et y définir les URLs. Ne pas changer les vecteurs pour résoudre un problème d’import.

`images.d.ts` permet la vérification autonome. Dans un projet qui fournit déjà ces déclarations, utiliser celles du projet et ne pas copier ce fichier si elles entrent en conflit.

## HTML/CSS sans React

Copier `etic-ui/` à côté de la page, ou garder les mêmes chemins relatifs. Aucun npm n’est nécessaire pour ce cas.

```html
<link rel="stylesheet" href="./etic-ui/styles.css">

<section class="etic-theme etic-stack" aria-labelledby="title">
  <span class="etic-logo" style="--etic-logo-width:72px">
    <img class="etic-logo__image" src="./etic-ui/assets/logos/etic-color.svg" alt="ETIC">
  </span>
  <h2 id="title" class="etic-heading">À toi de jouer</h2>
  <div class="etic-card">
    <ol class="etic-instructions">
      <li>Lis les consignes.</li>
      <li>Sélectionne une réponse.</li>
    </ol>
  </div>
  <div>
    <button type="button" class="etic-button">Commencer</button>
    <button type="button" class="etic-button etic-button--secondary" disabled>Indisponible</button>
  </div>
  <div class="etic-progress">
    <label for="steps" class="etic-progress__label">Étapes terminées : 1 / 4</label>
    <progress id="steps" class="etic-progress__track" value="1" max="4"></progress>
  </div>
  <div class="etic-status etic-status--success" role="status">✓ Étape terminée.</div>
</section>
```

Ces classes ne fournissent pas de logique JavaScript en HTML. Brancher les actions avec des événements natifs. Définir `disabled` et `aria-busy="true"` pendant le chargement.

## Étendre une interface

Les variables sont définies sous `.etic-theme`, sans modifier `:root`, body ou tous les boutons de la page. Les seules règles transversales sont la typographie héritée et le focus clavier dans le conteneur. Elles sont intentionnelles ; le contenu d’un canvas reste sous la responsabilité de l’application.

Préfixer les classes locales (`mon-jeu__...`) ou utiliser CSS Modules. Utiliser `var(--etic-space-4)`, `var(--etic-radius-md)`, `var(--etic-text)`, etc. La logique métier, le démarrage d’un jeu, les callbacks de résultat, les scores et la navigation appartiennent au projet hôte, pas à ce kit.

## Collection complète

`brandAssets` expose les 139 fichiers avec des noms typés ; `BrandArtwork` les affiche en conservant leurs proportions. Voir [le catalogue](assets.md). `BrandCard` propose huit traitements documentés dans [les cartes](cards.md), et `BrandHeading` reproduit la hiérarchie en texte modifiable.

```tsx
import { BrandArtwork, BrandCard } from './etic-ui';

<div className="etic-theme etic-stack">
  <BrandArtwork name="ribbon-cool-loop-01" width={180} />
  <BrandCard variant="paper">Mon contenu HTML ou React</BrandCard>
</div>
```

En HTML, utiliser les chemins du manifeste. Les styles `brand.css` et `art-gradients.css` sont déjà importés par `styles.css`. Conserver ces fichiers ensemble. Les PNG/WebP restent des images ; aucune dépendance React n’est nécessaire pour les utiliser.

`BrandArtwork` accepte les noms d’illustrations et de pictogrammes. Les noms de logos ou de cartes de référence sont rejetés par TypeScript : utiliser `Logo` pour réserver 2x et `BrandCard` pour les surfaces interactives. Les dimensions et le ratio sont réservés avant le chargement de l’image.

Pour un pictogramme dans un bouton, conserver un nom accessible :

```tsx
<IconButton label="Nous contacter" onClick={onContact}>
  <BrandArtwork name="icon-mail" width={24} />
</IconButton>
```

`Button` et `IconButton` transmettent une ref vers le bouton natif (React 18 et 19), pour restaurer le focus après une navigation ou la fermeture d’un panneau. Le projet hôte garde la responsabilité de choisir le moment de ce déplacement de focus.

## Choisir une famille de rubans

Définir un seul choix pour la page : `RibbonName<'warm'>` ou `RibbonName<'cool'>`. Les noms disponibles sont dans `ribbonsByFamily`. Tous les rubans sont regroupés sous `assets/ribbons/`, même les vagues et slogans précédemment rangés ailleurs. Voir [le parcours de composition](composition-workflow.md).

Pour les géométries, `kind` indique primitive, module ou composition. Les anciens noms d’import documentés restent des alias ; les imports directs de fichiers doivent suivre [la table de migration](migration.md).
