import color from "./assets/logos/etic-color.svg";
import white from "./assets/logos/etic-white.svg";
import headingLogo from "./assets/lettering/heading-logo.svg";
import headingVariation from "./assets/lettering/heading-variation.svg";
import eticLettering from "./assets/lettering/etic-lettering-cover.svg";
import wave from "./assets/ribbons/warm/wave-warm.svg";
import shapes from "./assets/decorations/shapes-stack.svg";
import pattern from "./assets/geometric/compositions/geometric-pattern.webp";

const assetUrl = (asset: string | { src: string }) =>
  typeof asset === "string" ? asset : asset.src;

/** Small legacy convenience selection. Use brandAssets / brandAssetIndex for the complete collection. */
export const assets = {
  color: assetUrl(color),
  white: assetUrl(white),
  headingLogo: assetUrl(headingLogo),
  headingVariation: assetUrl(headingVariation),
  eticLettering: assetUrl(eticLettering),
  wave: assetUrl(wave),
  shapes: assetUrl(shapes),
  pattern: assetUrl(pattern),
};
export { brandAssetIndex as assetIndex } from "./catalog";
