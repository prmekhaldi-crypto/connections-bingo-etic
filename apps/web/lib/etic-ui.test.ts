import { describe, expect, it } from 'vitest';
import { BrandArtwork, BrandCard, Button, Logo, assets, brandAssets } from './etic-ui';

function assetUrl(asset: unknown): string {
  if (typeof asset === 'string') return asset;
  if (
    typeof asset === 'object' &&
    asset !== null &&
    'src' in asset &&
    typeof asset.src === 'string'
  ) {
    return asset.src;
  }
  return '';
}

describe('ETIC UI kit integration', () => {
  it('resolves React components and bundled image URLs', () => {
    expect(Button).toBeDefined();
    expect(BrandCard).toBeTypeOf('function');
    expect(BrandArtwork).toBeTypeOf('function');
    expect(Logo).toBeTypeOf('function');
    expect(assetUrl(assets.color).length).toBeGreaterThan(0);
    expect(assetUrl(brandAssets['ribbon-warm-loop-01']).length).toBeGreaterThan(0);
  });
});
