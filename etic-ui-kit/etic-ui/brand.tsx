import type { HTMLAttributes, ImgHTMLAttributes, ReactNode } from "react";
import { brandAssets, brandAssetInfo, type BrandArtworkName } from "./catalog";

/** A source artwork, with proportions preserved. Empty alt means decoration. */
export function BrandArtwork({
  name,
  alt = "",
  className = "",
  style,
  ...props
}: Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & {
  name: BrandArtworkName;
  alt?: string;
}) {
  return (
    <img
      width={brandAssetInfo[name].width}
      height={brandAssetInfo[name].height}
      {...props}
      style={{
        aspectRatio: `${brandAssetInfo[name].width} / ${brandAssetInfo[name].height}`,
        ...style,
      }}
      src={brandAssets[name]}
      alt={alt}
      aria-hidden={alt === "" ? true : undefined}
      className={`etic-brand-artwork ${className}`}
    />
  );
}
export type BrandCardVariant =
  | "paper"
  | "wide"
  | "wide-soft"
  | "story"
  | "label"
  | "caption"
  | "amber"
  | "tab";
/** Source card treatments. Sizing and padding adapt to real HTML content. */
export function BrandCard({
  variant = "paper",
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { variant?: BrandCardVariant }) {
  return (
    <div
      {...props}
      className={`etic-brand-card etic-brand-card--${variant} ${className}`}
    >
      {variant === "amber" ? (
        <div className="etic-brand-safe-content etic-brand-card__content">
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
/** Hierarchy inspired by the official typography page; requires licensed fonts for full fidelity. */
export function BrandHeading({
  as: Tag = "h2",
  accent,
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLHeadingElement> & {
  as?: "h1" | "h2" | "h3";
  accent?: ReactNode;
}) {
  return (
    <Tag {...props} className={`etic-brand-heading ${className}`}>
      {children}
      {accent != null && (
        <span className="etic-brand-heading__accent">{accent}</span>
      )}
    </Tag>
  );
}
