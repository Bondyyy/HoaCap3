import { useState } from "react";
import { photos } from "../../data/assets";
import LabArtwork from "./LabArtwork";
export default function EditorialPhoto({
  photo = "laboratory",
  className = "",
  priority = false,
}: {
  photo?: keyof typeof photos;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false),
    asset = photos[photo];
  return (
    <figure className={`editorial-photo ${className}`}>
      <LabArtwork
        kind={photo === "solutions" ? "biuret" : "ester"}
        className="photo-fallback"
      />
      {!failed && (
        <img
          src={asset.src}
          alt={asset.alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      )}
      <figcaption>
        {failed ? (
          "Minh họa dụng cụ thí nghiệm"
        ) : (
          <>
            Ảnh minh họa · <span title={asset.source}>{asset.author}</span>
          </>
        )}
      </figcaption>
    </figure>
  );
}
