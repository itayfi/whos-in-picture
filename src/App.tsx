import { FormEvent, useEffect, useState } from "react";
import { scaleImage } from "./lib/image-tools";
import { CircleHelp } from "lucide-react";
import { ImagePreview } from "./components/ImagePreview";
import { WIDTH, STAGES } from "./lib/consts";
import { StagesProgress } from "./components/StagesProgress";

const CORRECT_ANSWERS = ["חתול", "חתולה"];

function App() {
  const [originalImage, setOriginalImage] = useState<string>();
  const [stage, setStage] = useState(0);
  const [guess, setGuess] = useState("");
  const [height, setHeight] = useState(426);

  useEffect(() => {
    scaleImage("https://cataas.com/cat?width=300&height=400", WIDTH).then(
      (result) => {
        setHeight(result.height);
        setOriginalImage(URL.createObjectURL(result.data));
      }
    );
  }, []);

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
        <ImagePreview height={height} image={originalImage} stage={stage} />
        <button
          className="mx-auto h-10 -mt-5 px-5 text-lg rounded-full block bg-yellow-300 relative cursor-pointer disabled:bg-gray-200 disabled:text-gray-700 disabled:cursor-default"
          onClick={() => setStage((s) => s + 1)}
          disabled={stage >= STAGES - 1}
        >
          לתמונה ברורה יותר &gt;
        </button>
        <StagesProgress stage={stage} />
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
