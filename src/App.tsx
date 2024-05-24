import { FormEvent, Fragment, useEffect, useState } from "react";
import { cn } from "./utils";
import { scaleImage } from "./image-tools";
import { CircleHelp, LoaderCircle } from "lucide-react";

const WIDTH = 320;
const STAGES = 7;
const FIRST_STAGE = 32;
const LAST_STAGE = 1;

const CORRECT_ANSWERS = ["חתול", "חתולה"];

const getScaleFactor = (stage: number) => {
  const v = (STAGES - stage - 1) / STAGES;
  return FIRST_STAGE * v + LAST_STAGE * (1 - v);
};

function App() {
  const [originalImage, setOriginalImage] = useState<string>();
  const [stage, setStage] = useState(0);
  const [scaledImage, setScaledImage] = useState<string>();
  const [height, setHeight] = useState(426);
  const [guess, setGuess] = useState("");

  useEffect(() => {
    scaleImage("https://cataas.com/cat?width=300&height=400", WIDTH).then(
      (result) => {
        setHeight(result.height);
        setOriginalImage(URL.createObjectURL(result.data));
      }
    );
  }, []);

  useEffect(() => {
    if (!originalImage) return;
    scaleImage(originalImage, WIDTH / getScaleFactor(stage)).then((b) =>
      setScaledImage(URL.createObjectURL(b.data))
    );
  }, [originalImage, stage]);

  const onGuess = (event: FormEvent) => {
    event.preventDefault();
    if (guess.length === 0) return;

    if (CORRECT_ANSWERS.includes(guess.trim())) {
      setStage(STAGES - 1);
    } else {
      setGuess("");
      setStage((s) => s + 1);
    }
  };

  return (
    <>
      <div className="border-b border-b-black px-2 leading-none">
        <button className="cursor-pointer p-2">
          <CircleHelp />
        </button>
      </div>
      <div className="w-80 mx-auto my-0 mb-8">
        <h1 className="text-4xl text-center my-2">מי אני?</h1>
        <header className="text-lg text-center mb-4">
          גלו מי בתמונה בכמה שפחות צעדים
        </header>
        <div
          className="overflow-hidden w-full"
          style={{ height: `${height}px` }}
        >
          {scaledImage ? (
            <div
              className="origin-top-right"
              style={{
                transform: `scale(${getScaleFactor(stage)})`,
                imageRendering: "pixelated",
              }}
            >
              <img
                width={`${Math.ceil(WIDTH / getScaleFactor(stage))}px`}
                src={scaledImage}
              />
            </div>
          ) : (
            <LoaderCircle className="size-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin stroke-gray-200" />
          )}
        </div>
        <button
          className="mx-auto h-10 -mt-5 px-5 text-lg rounded-full block bg-yellow-300 relative cursor-pointer disabled:bg-gray-200 disabled:text-gray-700 disabled:cursor-default"
          onClick={() => setStage((s) => s + 1)}
          disabled={stage >= STAGES - 1}
        >
          לתמונה ברורה יותר &gt;
        </button>
        <div className="flex flex-row items-center justify-center my-5">
          {[...new Array(STAGES)].map((_, i) => (
            <Fragment key={i}>
              <div
                className={cn(
                  "rounded-full size-6 bg-gray-200 text-gray-700 relative text-center",
                  {
                    "bg-yellow-300 font-bold": i <= stage,
                  }
                )}
              >
                {i + 1}
              </div>
              {i < 6 && (
                <div
                  className={cn("h-2 w-6 -mx-1 bg-gray-200", {
                    "bg-yellow-300": i < stage,
                  })}
                />
              )}
            </Fragment>
          ))}
        </div>
        <form
          className="border border-black p-1.5 rounded-full flex focus-within:ring"
          onSubmit={onGuess}
        >
          <input
            className="border-none h-8 grow px-3 outline-none"
            placeholder="מי בתמונה?"
            required
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
          />
          <button
            type="submit"
            className="rounded-full size-8 bg-yellow-300 cursor-pointer disabled:bg-gray-200 disabled:text-gray-700 disabled:cursor-default"
            disabled={guess.length === 0}
          >
            &gt;
          </button>
        </form>
      </div>
    </>
  );
}

export default App;
