// Shared inline SVG symbols (the leaf icon), referenced elsewhere via <use href="#leaf-icon"/>.
// Rendered once per page in the (site) and admin layouts.
export default function WreathDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <symbol id="leaf-icon" viewBox="0 0 24 24">
        <path d="M4 20c8-1 14-7 15-15-8 1-14 7-15 15Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M6 18C9 13 13 9 18 6" fill="none" stroke="currentColor" strokeWidth="1.4" />
      </symbol>
    </svg>
  );
}

