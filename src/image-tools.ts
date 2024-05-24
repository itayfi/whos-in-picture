export async function scaleImage(imageUrl: string, width: number) {
  const image = new Image();
  const loaded = new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
  });
  image.crossOrigin = "anonymous";
  image.src = imageUrl;
  await loaded;

  const canvas = new OffscreenCanvas(
    width,
    image.height * (width / image.width)
  );
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Couldn't get context");
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return {
    data: await canvas.convertToBlob(),
    width,
    height: canvas.height,
  };
}
