# Polices

Aucun fichier de police n’est livré avec ce kit.

La charte indique Gotham (calques Gotham Pro / Gotham Black), Humming et Noto Sans Arabic. L’accès aux noms de polices dans Figma ne fournit ni leurs fichiers ni l’autorisation de les redistribuer.

`tokens.css` utilise les noms officiels s’ils existent sur la machine, puis des fallbacks :

- UI : system-ui, -apple-system, Segoe UI, sans-serif.
- Expressif : Gotham Pro puis system-ui, sans-serif. Ce fallback ne reproduit pas l’écriture Humming.
- Arabe : Tahoma puis sans-serif.

Si ETIC fournit des fichiers autorisés pour le web et la redistribution, conserver leur licence ici, préférer WOFF2, déclarer les graisses exactes avec `@font-face` et `font-display: swap`. Charger ces déclarations dans le projet hôte. Ne pas ajouter de faux fichier ni télécharger une police commerciale depuis une source non autorisée.
