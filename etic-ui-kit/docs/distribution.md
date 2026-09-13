# Partager le kit avec les membres

## Copie complète recommandée pour partager

Depuis ce dépôt :

```sh
npm run copy:kit -- /chemin/vers/un/nouveau-dossier/etic-kit
```

Le script copie le kit, sa documentation, ses consignes et ses tests dans un nouveau dossier en conservant tous les liens relatifs. Il refuse une destination existante et ne copie pas `node_modules`. Aucune publication n’est effectuée.

Ce dossier peut rester une référence commune à l’équipe, ou se trouver à la racine d’une application sous `etic-kit/`. Dans ce second cas, depuis `src/screens/MonEcran.tsx`, importer `../../etic-kit/etic-ui`. Depuis `src/main.tsx`, importer `../etic-kit/etic-ui/styles.css`. Ajouter au `AGENTS.md` du projet hôte un lien vers `etic-kit/.agents/skills/etic-ui/SKILL.md` pour que l’agent utilise les consignes de cette copie.

Si le framework impose que tout le code soit sous `src/`, utiliser l’option suivante.

## Copie du code uniquement dans src/

Copier **tout `etic-ui/`** dans `src/etic-ui/` du projet consommateur. Conserver les sous-dossiers d’assets et les fichiers CSS ensemble : `styles.css` importe `tokens.css`, `brand.css` et `art-gradients.css`.

Pour les consignes humaines et agent, copier aussi `docs/` et `.agents/skills/etic-ui/`. Fusionner `AGENTS.md` sans écraser les instructions du projet hôte. Les liens des guides supposent le kit à la racine ; après copie sous `src/`, le code utilise les imports du projet et l’agent sait retrouver le kit. Pour garder tous les liens Markdown directement cliquables, on peut aussi conserver ce dépôt comme documentation de référence séparée.

## Dépendances du projet consommateur

- HTML/CSS et images : aucune dépendance npm.
- React : React 18+ ; React DOM est déjà fourni par l’application React hôte.
- TypeScript : JSX activé et bundler capable de résoudre SVG/PNG/WebP en URLs. Utiliser les déclarations d’images du framework ; copier `images.d.ts` seulement si elles n’existent pas déjà.
- Ne pas copier `node_modules`, les outils de test ou le package-lock du kit dans une application existante. Le projet hôte garde ses dépendances et commandes.

Depuis `src/features/mon-ecran/`, importer `../../etic-ui`. Importer `./etic-ui/styles.css` une fois depuis le point d’entrée situé dans `src/`.

## Ce qui appartient à chaque membre

Le membre compose son écran, ses contrôles métier et ses éventuels effets/canvas dans son propre dossier. Il réutilise les assets et composants partagés. Les changements de tokens, de logos ou de composants utilisés par d’autres membres passent par une modification du kit commun, accompagnée des vérifications.

Les callbacks de démarrage/résultat, le routing, les scores et le stockage appartiennent au projet. Le kit ne les impose pas. Les styles de jeu sont préfixés ou isolés en CSS Modules.

## Mettre à jour une copie existante

1. Comparer le dossier commun avant remplacement ; préserver les changements locaux et identifier leur propriétaire.
2. Mettre à jour les imports d’assets si un nom a changé. Le manifeste est la référence, pas les noms approximatifs d’une ancienne conversation.
3. Exécuter le build du projet consommateur et vérifier les interfaces concernées sur mobile et au clavier.
4. Garder ensemble code, assets et documentation de la même révision. Les fichiers générés se régénèrent depuis le manifeste dans le dépôt du kit.

## Police et fidélité

Les polices de cette machine ne sont pas automatiquement disponibles sur celles des membres. Une installation locale peut rendre les captures très proches de Figma sans que les polices soient livrées. Pour un rendu homogène entre tous les projets, ETIC doit fournir les fichiers web et leurs droits d’usage/redistribution. Jusqu’alors, le fallback est explicite dans [les informations polices](../etic-ui/assets/fonts/README.md).
