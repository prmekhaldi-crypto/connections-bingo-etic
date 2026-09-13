# Parcours pour créer une bonne interface ETIC

Ce guide s’applique à la création d’un écran comme à la refonte d’une interface existante. Il définit une méthode de choix, pas un modèle de site à recopier.

## 1. Partir du contenu et de la tâche

Identifier ce que la personne doit comprendre et faire. Conserver les fonctionnalités de l’application existante. Organiser le titre, les informations et les actions avant de choisir la décoration.

Pour une refonte, distinguer les problèmes de hiérarchie, de disposition et de cohérence. Un changement de palette seul ne règle pas un écran mal organisé.

## 2. Choisir une seule famille de rubans pour toute la page

**Direction du propriétaire du projet : une page utilise les rubans warm OU cool.**

- `warm` : rouge, orange, jaune et variantes claires de cette famille.
- `cool` : teal/bleu-vert et vert.
- `neutral` : trait noir discret, sans deuxième famille colorée.

La règle s’applique au bandeau, au corps, aux panneaux latéraux et au pied de la même page. Ne pas choisir une famille différente à chaque section. Il n’est pas nécessaire de mettre des rubans sur un écran qui n’en a pas besoin.

Un grand bandeau rouge appelle une famille **warm** avec des parties jaune/orange claires visibles. Un ruban cool ne doit pas être superposé à ce bandeau. Les couleurs de boutons, d’états, de géométries ou de l’emblème ne constituent pas automatiquement une seconde famille de rubans.

Les références Figma peuvent présenter les deux familles pour les comparer. Elles ne sont pas un modèle à recopier tel quel dans une page produit. Une illustration finie qui contient des rubans des deux familles reste une référence ; ne pas l’utiliser pour contourner cette règle.

## 3. Choisir une forme pour son rôle

Consulter le [README des rubans](../etic-ui/assets/ribbons/README.md), puis l’aperçu du fichier :

- boucle ou croisement : accent expressif près d’un titre ;
- vague ou grande courbe : rythme en bordure, avec une zone calme pour lire ;
- ruban avec slogan : illustration éditoriale fixe ; ne pas couper les mots nécessaires ;
- trait fin : détail plus discret.

Prendre une ressource de la famille retenue. Il n’existe pas forcément une version chaude et froide de chaque forme. Ne pas fabriquer une variante avec un filtre CSS ou une recoloration improvisée. Pour un grand visuel, choisir une résolution suffisante ou un SVG ; ne pas agrandir excessivement un petit WebP.

Les variantes observées dans différents supports restent identifiées par leur contexte (`banner`, `contents`, `card`, etc.). Elles ne signifient pas qu’il existe autant de formes entièrement nouvelles.

## 4. Choisir le bon niveau de géométrie

Lire [la décomposition géométrique](geometry.md). Une primitive donne une liberté de composition ; un module conserve un assemblage ; une composition constitue déjà un visuel complet. Ne pas appeler un ensemble de disques « ruban », ni un masque concave « quart de cercle ».

## 5. Définir un bref parti pris avant de coder

Écrire quelques lignes, puis avancer si aucune question ne bloque :

```text
Page et action principale : …
Fond et surface de lecture : …
Famille de rubans pour toute la page : warm / cool / aucun
Fichiers choisis, rôle et emplacement : …
Géométries : primitive / module / composition, avec noms exacts
Typographie : titre structuré, accent expressif éventuel, corps lisible
Mobile : ce qui se déplace, diminue ou disparaît
```

Un raisonnement tel que « cet asset est ETIC, donc il convient » est insuffisant. Le choix doit expliquer son association avec le fond, le contenu et les autres éléments de la page.

## 6. Implémenter avec le kit

Réutiliser les composants, tokens et fichiers. Garder les textes et contrôles en HTML/React. Préserver la zone 2x du logo. Les ombres et transparences des cartes ne donnent pas la permission d’en mettre sur le logo.

Le catalogue expose la sélection par famille et un type pour vérifier un choix dans le code :

```tsx
import { BrandArtwork, type RibbonName } from './etic-ui';

const pageRibbon: RibbonName<'warm'> = 'ribbon-warm-loop-01';
// Un nom de ruban cool est rejeté par ce type.
<BrandArtwork name={pageRibbon} width={180} />;
```

`ribbonsByFamily.warm`, `.cool` et `.neutral` donnent les noms disponibles. Ces outils aident à choisir ; ils ne peuvent pas garantir à eux seuls la cohérence d’une page entière.

## 7. Vérifier le résultat réel

Inspecter une capture de **toute la page**, puis ses détails sur mobile :

- Une seule famille de rubans colorés est-elle utilisée partout ?
- Le décor et le fond fonctionnent-ils ensemble ?
- Le recadrage d’une géométrie est-il volontaire et fidèle au niveau choisi ?
- Les titres, les paragraphes et l’action principale restent-ils clairement hiérarchisés ?
- Le logo a-t-il de l’espace et les contrôles restent-ils accessibles ?
- Peut-on retirer un décor sans perdre d’information ? Si oui et s’il surcharge la page, le retirer.

Les tests de code ne valident pas la direction artistique. Rendre compte séparément de la validation technique et de la revue visuelle. Ne pas annoncer une fidélité parfaite si les polices ou des éléments sources manquent.
