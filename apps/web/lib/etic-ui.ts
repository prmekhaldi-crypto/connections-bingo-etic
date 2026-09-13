// Stable application-facing entry point for the repository-root ETIC UI kit.
// Keep game and screen-specific behavior in the consuming application.
export {
  Badge,
  BrandArtwork,
  BrandCard,
  BrandHeading,
  Button,
  Card,
  IconButton,
  Instructions,
  Logo,
  Panel,
  Progress,
  StatusMessage,
  assetIndex,
  assets,
  brandAssetIndex,
  brandAssetInfo,
  brandAssets,
  ribbonsByFamily,
} from '../../../etic-ui-kit/etic-ui';

export type {
  BrandArtworkName,
  BrandCardVariant,
  ButtonProps,
  IconButtonProps,
  RibbonFamily,
  RibbonName,
  Tone,
} from '../../../etic-ui-kit/etic-ui';
