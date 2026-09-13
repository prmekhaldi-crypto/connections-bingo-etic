import { createRef } from "react";
import {
  BrandArtwork,
  BrandCard,
  Button,
  IconButton,
  type BrandArtworkName,
} from "../etic-ui";
const validName: BrandArtworkName = "ribbon-cool-loop-01";
const valid = (
  <BrandCard variant="story">
    <BrandArtwork name={validName} width={120} />
    <Button ref={createRef<HTMLButtonElement>()} disabled>
      Action
    </Button>
    <IconButton ref={createRef<HTMLButtonElement>()} label="Fermer">
      ×
    </IconButton>
  </BrandCard>
);
// @ts-expect-error An icon-only action needs a name for assistive technology.
const unnamed = <IconButton>×</IconButton>;
// @ts-expect-error Logos must use Logo, which reserves the exclusion zone.
const logo = <BrandArtwork name="etic-color" />;
// @ts-expect-error Reference images are not interactive interface components.
const reference = <BrandArtwork name="card-ribbons-cool-reference" />;
// @ts-expect-error Asset keys must exist in the shared catalogue.
const missing = <BrandArtwork name="not-an-etic-asset" />;
void [valid, unnamed, logo, reference, missing];

import type { RibbonName } from "../etic-ui";
const warmRibbon: RibbonName<"warm"> = "ribbon-warm-loop-01";
// @ts-expect-error A cool ribbon is not a warm-page selection.
const mixedPage: RibbonName<"warm"> = "ribbon-cool-loop-01";
const legacyGeometry = <BrandArtwork name="semicircle-mint" />;
void [warmRibbon, mixedPage, legacyGeometry];
