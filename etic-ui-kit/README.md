# ETIC · Kit de ressources frontend

Un dossier à copier dans tes projets : **139 assets**, les styles de la charte et des composants React/TypeScript. Aucun site, serveur de démonstration ni mini-jeu.

## Commencer par une composition cohérente

**Une seule famille de rubans colorés par page : warm OU cool.** Ne pas changer de famille entre le bandeau et le reste de la page. Pour un grand fond rouge, choisir des rubans chauds jaune/orange ou clairs. Le skill général explique comment choisir le fond, les formes et la hiérarchie avant de coder.

[Parcours de composition](docs/composition-workflow.md) · [README des rubans](etic-ui/assets/ribbons/README.md) · [Décomposition géométrique](docs/geometry.md)

Le projet reste un dossier partagé. Le packaging npm et la commande de setup en cours ont été abandonnés. Les commandes npm ci-dessous servent seulement à développer et vérifier le kit.

## Explorer les ressources

[**Comprendre la direction artistique**](docs/art-direction.md) · [**Ouvrir le catalogue avec aperçus**](docs/assets.md)

| Ressources | Contenu |
| --- | --- |
| Logos | 2 emblèmes officiels, couleur et blanc |
| Rubans | 41 ressources regroupées dans `ribbons/warm`, `cool` et `neutral`, y compris courbes, slogans et variantes de supports |
| Géométries | 31 primitives, modules et compositions, avec découpes clarifiées |
| Formes libres | 22 éléments organiques |
| Autres compositions | 3 compositions isolées |
| Pictogrammes | 6 icônes complètes du banner |
| Stickers et lettrages | 13 stickers et 6 lettrages fixes |
| Cartes | 10 assets de surface/référence et 8 traitements en CSS/React |
| Dégradés | 5 exports officiels et 16 combinaisons de stops documentées, dont 11 variantes observées dans les illustrations |
| Documentation de source | Les 33 planches de la charte, consultables localement |

Les fichiers ont des noms, dimensions, usages et références Figma dans `etic-ui/asset-manifest.json`. Les cartes interactives restent du vrai HTML/React. Les lettrages « LOGO » et « variation », mal classés dans le premier lot, sont maintenant identifiés comme titres de planche.

## Partager une copie autonome

```sh
npm run copy:kit -- /chemin/vers/un/nouveau-dossier/etic-kit
```

Cette copie conserve les liens de documentation et le skill, sans `node_modules`. Une destination existante est refusée pour préserver son contenu. [Imports selon la disposition choisie](docs/distribution.md).

## Copier le code dans un projet

1. Copier `etic-ui/` dans `src/etic-ui/`.
2. Importer `./etic-ui/styles.css` une seule fois dans le point d’entrée.
3. Placer l’interface dans un conteneur `className="etic-theme"`.
4. Réutiliser les assets, composants et tokens.

```tsx
import { BrandArtwork, BrandCard, Button } from './etic-ui';

<div className="etic-theme etic-stack">
  <BrandArtwork name="ribbon-cool-loop-01" width={180} />
  <BrandCard variant="paper">
    <h2 className="etic-heading">À toi de jouer</h2>
    <Button onClick={onStart}>Commencer</Button>
  </BrandCard>
</div>
```

React 18+ est nécessaire uniquement pour les composants. Les images et le CSS fonctionnent aussi en HTML, sans npm. Le projet consommateur compile les sources et résout les imports d’images ; aucun routeur ni framework CSS n’est imposé. [Exemples et chemins d’import](docs/usage.md).

## Guider l’agent

Copier aussi `.agents/skills/etic-ui/` et `docs/`, puis fusionner `AGENTS.md` avec les consignes du projet hôte. Le [skill](.agents/skills/etic-ui/SKILL.md) indique comment consulter la collection complète et choisir les assets, cartes et styles avant de créer de nouveaux éléments.

## Organisation

```text
etic-ui/
  assets/                   Fichiers classés par famille
  asset-manifest.json       Index portable, indépendant de React
  catalog.ts                Imports typés de toute la collection
  tokens.css                Palette et tokens UI
  art-gradients.css         Variantes de dégradés observées
  brand.css                 Traitements visuels de la charte
  styles.css                Point d’entrée CSS
  components.tsx            Boutons, panels, badges, consignes, progression, logo
  brand.tsx                 BrandArtwork, BrandCard, BrandHeading
  index.ts                  Exports publics
.agents/skills/etic-ui/      Skill pour les agents
scripts/                    Génération et vérification du catalogue
docs/                       Guides, aperçus et planches sources
```

## Vérifier et maintenir

```sh
npm ci
npm run check
# Première installation du navigateur de test :
npx playwright install chromium
npm run test:browser
# Après modification du manifeste :
npm run catalog:generate
```

`check` vérifie TypeScript, les empreintes des fichiers, les sources, les liens de documentation et la synchronisation des index générés. `test:browser` vérifie les composants, le clavier, les layouts mobile/desktop et le décodage des images. Il ne remplace pas les tests de l’interface dans le projet consommateur.

- [Migration des anciens chemins et noms](docs/migration.md)
- [Direction artistique et recettes de composition](docs/art-direction.md)
- [Revue d’exhaustivité et limites](docs/audit.md)
- [Diffusion et mises à jour entre membres](docs/distribution.md)
- [Identité et règles officielles](docs/identity.md)
- [Catalogue graphique](docs/assets.md)
- [Cartes réutilisables](docs/cards.md)
- [Dégradés](docs/gradients.md)
- [Contribution et accessibilité](docs/contributing.md)
- [Couverture des 33 planches](docs/charter-coverage.md)
- [Extraction et limites](docs/extraction.md)
- [Vérifications effectuées](docs/validation.md)

Source : [charte Figma ETIC](https://www.figma.com/design/eofQFq1bCM8Ooe5KXBDRsk/ETIC-s-visual-ID?node-id=0-1), inspectée via le MCP. Les polices officielles ne sont pas incluses faute de fichiers redistribuables fournis. Les copies libres de quatre pictogrammes sont vides, mais six versions complètes ont été retrouvées et exportées depuis le banner. Les limites et adaptations sont documentées.
