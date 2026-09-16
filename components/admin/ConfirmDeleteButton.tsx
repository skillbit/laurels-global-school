"use client";

export default function ConfirmDeleteButton({
  label = "Delete",
  confirmText = "Delete this? This can't be undone.",
  style,
}: {
  label?: string;
  confirmText?: string;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="submit"
      className="btn btn-ghost btn-row"
      style={{ color: "var(--laurel-deep)", ...style }}
      onClick={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      {label}
    </button>
  );
}
