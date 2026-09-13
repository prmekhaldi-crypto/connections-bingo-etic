import {
  useId,
  forwardRef,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { assets } from "./assets";
const cx = (...values: (string | undefined | false)[]) =>
  values.filter(Boolean).join(" ");
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "quiet";
  loading?: boolean;
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      loading = false,
      disabled,
      className,
      children,
      type = "button",
      ...props
    },
    ref,
  ) {
    return (
      <button
        {...props}
        ref={ref}
        type={type}
        className={cx("etic-button", `etic-button--${variant}`, className)}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
      >
        {loading && <span aria-hidden="true">◌</span>}
        {children}
        {loading && <span className="etic-sr-only">, chargement</span>}
      </button>
    );
  },
);
export type IconButtonProps = Omit<ButtonProps, "aria-label"> & {
  label: string;
};
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ label, children, ...props }, ref) {
    return (
      <Button
        {...props}
        ref={ref}
        className={cx("etic-icon-button", props.className)}
        aria-label={label}
        title={label}
      >
        {children}
      </Button>
    );
  },
);
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cx("etic-card", className)} />;
}
export function Panel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cx("etic-panel", className)} />;
}
export type Tone = "neutral" | "success" | "error";
export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  return (
    <span className={`etic-badge etic-badge--${tone}`}>
      {tone !== "neutral" && (
        <span aria-hidden="true">{tone === "success" ? "✓" : "!"}</span>
      )}
      {children}
    </span>
  );
}
export function StatusMessage({
  tone = "neutral",
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  return (
    <div
      className={`etic-status etic-status--${tone}`}
      role={tone === "error" ? "alert" : "status"}
    >
      <span aria-hidden="true">
        {tone === "success" ? "✓" : tone === "error" ? "!" : "i"}
      </span>
      <div>{children}</div>
    </div>
  );
}
export function Instructions({ steps }: { steps: readonly string[] }) {
  return (
    <ol className="etic-instructions">
      {steps.map((step, i) => (
        <li key={i}>{step}</li>
      ))}
    </ol>
  );
}
export function Progress({
  value,
  max = 100,
  label,
}: {
  value: number;
  max?: number;
  label: string;
}) {
  const id = useId();
  const limit = Number.isFinite(max) && max > 0 ? max : 1;
  const current = Number.isFinite(value)
    ? Math.min(limit, Math.max(0, value))
    : 0;
  return (
    <div className="etic-progress">
      <label htmlFor={id} className="etic-progress__label">
        <span>{label}</span>
        <span>
          {current} / {limit}
        </span>
      </label>
      <progress
        id={id}
        className="etic-progress__track"
        value={current}
        max={limit}
      />
    </div>
  );
}
export function Logo({
  variant = "color",
  width = 72,
}: {
  variant?: "color" | "white";
  width?: number;
}) {
  return (
    <span
      className="etic-logo"
      style={{ "--etic-logo-width": `${width}px` } as CSSProperties}
    >
      <img className="etic-logo__image" src={assets[variant]} alt="ETIC" />
    </span>
  );
}
