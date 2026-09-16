// Shared inline SVG symbols (laurel wreath mark + leaf icon), referenced elsewhere via <use href="#wreath"/>.
// Rendered once per page in the (site) and admin layouts.
export default function WreathDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <symbol id="wreath" viewBox="0 0 220 220">
        <g fill="var(--laurel)">
          <g>
            <ellipse cx="112" cy="188" rx="9" ry="19" transform="rotate(15 112 188)" />
            <ellipse cx="120" cy="165" rx="9.5" ry="20" transform="rotate(30 120 165)" />
            <ellipse cx="131" cy="141" rx="10" ry="21" transform="rotate(46 131 141)" />
            <ellipse cx="146" cy="119" rx="10" ry="21" transform="rotate(60 146 119)" />
            <ellipse cx="165" cy="101" rx="9.5" ry="20" transform="rotate(74 165 101)" />
            <ellipse cx="186" cy="90" rx="9" ry="19" transform="rotate(86 186 90)" />
            <ellipse cx="108" cy="188" rx="9" ry="19" transform="rotate(-15 108 188)" />
            <ellipse cx="100" cy="165" rx="9.5" ry="20" transform="rotate(-30 100 165)" />
            <ellipse cx="89" cy="141" rx="10" ry="21" transform="rotate(-46 89 141)" />
            <ellipse cx="74" cy="119" rx="10" ry="21" transform="rotate(-60 74 119)" />
            <ellipse cx="55" cy="101" rx="9.5" ry="20" transform="rotate(-74 55 101)" />
            <ellipse cx="34" cy="90" rx="9" ry="19" transform="rotate(-86 34 90)" />
          </g>
        </g>
        <path d="M108,196 Q60,190 34,90" stroke="var(--gold)" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M112,196 Q160,190 186,90" stroke="var(--gold)" strokeWidth="3" fill="none" strokeLinecap="round" />
        <text x="110" y="150" textAnchor="middle" fontFamily="Fraunces, serif" fontWeight="650" fontSize="34" fill="var(--laurel-deep)">
          LGS
        </text>
      </symbol>
      <symbol id="leaf-icon" viewBox="0 0 24 24">
        <path d="M4 20c8-1 14-7 15-15-8 1-14 7-15 15Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M6 18C9 13 13 9 18 6" fill="none" stroke="currentColor" strokeWidth="1.4" />
      </symbol>
    </svg>
  );
}

export function WreathMark({ className = "mark" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 220" aria-hidden="true">
      <use href="#wreath" />
    </svg>
  );
}
