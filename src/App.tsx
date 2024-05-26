import { FormEvent, useCallback, useEffect, useState } from "react";
import { scaleImage } from "./lib/image-tools";
import { ImagePreview } from "./components/ImagePreview";
import { WIDTH, STAGES } from "./lib/consts";
import { StagesProgress } from "./components/StagesProgress";
import { cn } from "./lib/utils";
import { SettingDialog, Settings } from "./components/SettingsDialog";
import { getGame } from "./lib/games";

function App() {
  const [originalImage, setOriginalImage] = useState<string>();
  const [correctAnswers, setCorrectAnswers] = useState(["חתול", "חתולה"]);
  const [stage, setStage] = useState(0);
  const [guess, setGuess] = useState("");
  const [height, setHeight] = useState(426);
  const [userStatus, setUserStatus] = useState<
    "initial" | "correct" | "incorrect"
  >("initial");

  const getInitialUrl = useCallback(async () => {
    if (location.search.length > 1) {
      const gameId = location.search.slice(1);
      try {
        const gameData = await getGame(gameId);
        if (gameData) {
          setCorrectAnswers(gameData.answers);
          return URL.createObjectURL(gameData.imageData);
        }
      } catch (e) {
        console.log(e);
      }
    }

    return "https://cataas.com/cat?width=300&height=400";
  }, []);

  useEffect(() => {
    getInitialUrl()
      .then((url) => scaleImage(url, WIDTH))
      .then((result) => {
        setHeight(result.height);
        setOriginalImage(URL.createObjectURL(result.data));
      });
  }, []);

  const onGuess = (event: FormEvent) => {
    event.preventDefault();
    if (guess.length === 0 || stage === STAGES - 1) return;

    if (correctAnswers.includes(guess.trim())) {
      setUserStatus("correct");
    } else {
      setUserStatus("incorrect");
      setGuess("");
      setStage((s) => s + 1);
    }
  };

  const onChangeSettings = ({ image, correctAnswers }: Settings) => {
    scaleImage(URL.createObjectURL(image), WIDTH).then((result) => {
      setHeight(result.height);
      setOriginalImage(URL.createObjectURL(result.data));
      setCorrectAnswers(correctAnswers);
      setStage(0);
      setUserStatus("initial");
      setGuess("");
    });
  };

  const getPlaceholder = () => {
    if (userStatus === "correct") {
      return guess;
    }
    if (stage === STAGES - 1) {
      return correctAnswers[0];
    }
    if (userStatus === "initial") {
      return "מי בתמונה?";
    }
    return "תשובה לא נכונה, נסו שנית";
  };

  return (
    <>
      <div className="border-b border-b-black px-2 leading-none">
        <SettingDialog onChange={onChangeSettings} />
      </div>
      <div className="w-80 mx-auto my-0 mb-8">
        <h1 className="text-4xl text-center my-2">מי אני?</h1>
        <header className="text-lg text-center mb-4">
          גלו מי בתמונה בכמה שפחות צעדים
        </header>
        <ImagePreview
          height={height}
          image={originalImage}
          stage={userStatus === "correct" ? STAGES - 1 : stage}
        />
        <button
          className="mx-auto h-10 -mt-5 px-5 text-lg rounded-full block bg-yellow-300 relative cursor-pointer transition-colors disabled:bg-gray-200 disabled:text-gray-700 disabled:cursor-default"
          onClick={() => {
            setStage((s) => s + 1);
            if (stage === STAGES - 2) {
              setUserStatus("incorrect");
            }
          }}
          disabled={stage >= STAGES - 1 || userStatus === "correct"}
        >
          לתמונה ברורה יותר &gt;
        </button>
        <StagesProgress stage={stage} />
        <form
          className={cn("border p-1.5 rounded-full flex focus-within:ring", {
            "border-black": userStatus === "initial",
            "border-green-500": userStatus === "correct",
            "border-red-500": userStatus === "incorrect",
          })}
          onSubmit={onGuess}
        >
          <input
            className="border-none h-8 grow px-3 outline-none"
            placeholder={getPlaceholder()}
            required
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
          />
          <button
            type="submit"
            className="transition-colors rounded-full size-8 bg-yellow-300 cursor-pointer disabled:bg-gray-200 disabled:text-gray-700 disabled:cursor-default"
            disabled={
              guess.length === 0 ||
              stage >= STAGES - 1 ||
              userStatus === "correct"
            }
          >
            &gt;
          </button>
        </form>
        {userStatus === "correct" && (
          <div className="text-green-700 p-2">
            כל הכבוד! הצלחתם לזהות תוך {stage + 1} צעדים
          </div>
        )}
        {userStatus === "incorrect" && stage === STAGES - 1 && (
          <div className="text-red-700 p-2">לא הצלחת לזהות הפעם, לא נורא</div>
        )}
      </div>
    </>
  );
}

export default App;
