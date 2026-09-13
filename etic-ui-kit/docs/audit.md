# Revue approfondie du kit

## La collection est-elle exhaustive ?

Elle couvre les familles exploitables des 33 planches et inclut des éléments présents hors de ces planches. **Elle n’est pas un export brut de chaque calque du fichier.** Un masque technique, une occurrence dupliquée, un texte de démonstration ou un exemple interdit n’est pas une nouvelle ressource frontend.

L’inventaire reste traçable par nœud Figma et chaque fichier livré est vérifié. Une extraction totalement exhaustive de tous les calques, y compris leurs sources et effets originaux, nécessiterait le fichier Figma natif et les fichiers de polices autorisés. Les rendus raster et les adaptations CSS ne remplacent pas ce document source.

## Ce que cette revue a ajouté ou corrigé

- Boucle fine noire 1:2400, auparavant accessible seulement dans une composition avec pastilles.
- Trois compositions utilisées par les stories : 1:3281, 1:3326, 1:3367.
- Six pictogrammes complets du banner : TikTok, email, web, Instagram, Facebook et YouTube. Les copies libres 1:131/132/133/6068 étaient vides ; les occurrences réelles se trouvent dans 1:97/102/107/112/117/123.
- Lecture de la direction artistique et des quatre niveaux de typographie avec propriétés vérifiées.
- Empreintes SHA-256 pour détecter une modification de fichier, même si sa taille reste identique.
- Vérification que le catalogue TypeScript et les pages générées sont à jour.
- Dimensions intrinsèques et ratio sur `BrandArtwork` pour réserver l’espace avant chargement.
- Restriction typée de `BrandArtwork` aux illustrations et pictogrammes : le logo passe par `Logo`, les cartes interactives par `BrandCard`.
- Tests navigateur reproductibles dans le dépôt, sans site de démonstration.

## Niveau de fidélité

| Élément | Garantie fournie | Limite réelle |
| --- | --- | --- |
| Palette | Valeurs officielles relevées | Les tokens UI dérivés restent distincts |
| Logos | Vecteurs existants et espace réservé | L’interface consommatrice doit respecter l’espace extérieur |
| SVG d’illustration | Tracés et peintures source conservés | Les moteurs peuvent rendre différemment certains effets de bruit |
| WebP d’illustration | Détourage, textures et transparence conservés après rendu | Résolution finie ; ce n’est pas un fichier vectoriel original |
| Dégradés | Stops officiels et variantes documentés | Directions CSS adaptées ; SVG pour la géométrie source |
| Cartes | Rayons/opacités/ombres relevés | Padding, dimensions, interactivité et traitement accessible adaptés |
| Typographie | Familles et rôles documentés | Pas de binaires redistribuables ; dépend des polices disponibles |

## Avant diffusion aux membres

Exécuter `npm ci`, `npm run check`, puis `npx playwright install chromium` et `npm run test:browser`. Lire [la direction artistique](art-direction.md) et [la copie du kit](distribution.md). Le projet ne publie rien et ne contient pas de serveur d’application.

## Révision du rangement et de la décomposition

Le packaging a été abandonné. La collection contient désormais 139 assets, dont 41 ressources de rubans regroupées et 31 géométries classées. La géométrie centrale conserve maintenant son recadrage carré comme module distinct des disques libres. Des contreformes, primitives et modules supplémentaires ont été extraits.

La direction du propriétaire impose une seule famille de rubans colorés sur toute la page. Le skill général a été recentré sur un parcours de composition et de revue visuelle. Les anciens noms d’import sont maintenus comme alias lorsque nécessaire ; les chemins directs déplacés sont documentés dans [la migration](migration.md).
