// Garder ces déclarations si le projet hôte ne déclare pas déjà les imports d'images.
declare module "*.svg" {
  const url: string;
  export default url;
}
declare module "*.png" {
  const url: string;
  export default url;
}

declare module "*.webp" {
  const url: string;
  export default url;
}
