import Image from "next/image";
import SchoolLogo from "./SchoolLogo";

// A fixed photo spot set in Admin -> Page Images. Until a photo is uploaded it shows
// a warm patterned placeholder with a faint school shield.
export default function PagePhoto({
  url,
  alt,
  className,
  sizes,
  priority = false,
}: {
  url?: string | null;
  alt: string;
  className: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <div className={`${className}${url ? "" : " b-tile photo-placeholder"}`}>
      {url ? (
        <Image src={url} alt={alt} fill sizes={sizes} priority={priority} />
      ) : (
        <SchoolLogo className="photo-placeholder-mark" />
      )}
    </div>
  );
}
