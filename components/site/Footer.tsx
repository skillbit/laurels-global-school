import Link from "next/link";
import { WreathMark } from "./WreathDefs";

export default function Footer() {
  return (
    <footer>
      <div className="wrap foot-row">
        <div className="foot-brand">
          <WreathMark />
          <div>
            <strong style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 650 }}>
              The Laurels Global School
            </strong>
            <p>Near Jln College, NH2, Pahleja Road, Dehri-on-Sone, Rohtas, Bihar</p>
          </div>
        </div>
        <div className="foot-links">
          <div className="foot-col">
            <h4>Explore</h4>
            <Link href="/about">About</Link>
            <Link href="/academics">Academics</Link>
            <Link href="/admissions">Admissions</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/notices">Notices</Link>
          </div>
          <div className="foot-col">
            <h4>Contact</h4>
            <a href="tel:+919771020700">97710 20700</a>
            <a href="tel:+917764069741">77640 69741</a>
            <span>CBSE &middot; Nursery&ndash;X</span>
          </div>
        </div>
      </div>
      <div className="wrap foot-note">
        <span>&copy; {new Date().getFullYear()} The Laurels Global School. All rights reserved.</span>
        <span>Affiliation No. — TODO</span>
      </div>
    </footer>
  );
}
