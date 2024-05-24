import { useEffect, useState } from "react";
import { scaleImage } from "../lib/image-tools";
import { LoaderCircle } from "lucide-react";
import { getScaleFactor } from "../lib/consts";
import { WIDTH } from "../lib/consts";

export function ImagePreview({
  image,
  stage,
  height,
}: {
  image: string | undefined;
  stage: number;
  height: number;
}) {
  const [scaledImage, setScaledImage] = useState<string>();

  useEffect(() => {
    if (!image) return;
    scaleImage(image, WIDTH / getScaleFactor(stage)).then((b) =>
      setScaledImage(URL.createObjectURL(b.data))
    );
  }, [image, stage]);

  const scaleFactor = getScaleFactor(stage);

  return (
    <div className="overflow-hidden w-full" style={{ height: `${height}px` }}>
      {scaledImage ? (
        <div
          className="origin-top-right"
          style={{
            transform: `scale(${scaleFactor})`,
            imageRendering: scaleFactor === 1 ? "auto" : "pixelated",
          }}
        >
          <img
            width={`${Math.ceil(WIDTH / scaleFactor)}px`}
            src={scaledImage}
          />
        </div>
      ) : (
        <LoaderCircle className="size-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin stroke-gray-200" />
      )}
    </div>
  );
}
