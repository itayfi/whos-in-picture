import { Camera, CircleHelp, Upload } from "lucide-react";
import { DrawerContent, DrawerRoot, DrawerTrigger } from "./ui/Drawer";
import { useMemo, useRef, useState } from "react";

export type Settings = { image: File; correctAnswers: string[] };

export const SettingDialog = ({
  onChange,
}: {
  onChange: (settings: Settings) => void;
}) => {
  const [file, setFile] = useState<File>();
  const [open, setOpen] = useState(false);
  const correctAnswersRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !correctAnswersRef.current) return;
    onChange({
      image: file,
      correctAnswers: correctAnswersRef.current.value
        .split("\n")
        .map((x) => x.trim())
        .filter((x) => x.length > 0),
    });
    setOpen(false);
  };

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    setFile(undefined);
  };

  const fileImageUrl = useMemo(() => file && URL.createObjectURL(file), [file]);

  return (
    <DrawerRoot open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger>
        <CircleHelp />
      </DrawerTrigger>
      <DrawerContent>
        <form
          className="grid gap-2.5 mx-auto my-4 w-80"
          onSubmit={handleSubmit}
        >
          <h1 className="text-lg font-semibold">הגדרות</h1>
          <div className="font-medium h-8 flex items-bottom">
            בחר תמונה
            {file ? (
              <button
                className="text-xs py-2 px-4 text-gray-500 cursor-pointer"
                onClick={() => setFile(undefined)}
              >
                ניקוי
              </button>
            ) : null}
          </div>
          <div className="relative size-80 rounded border-2 border-gray-200 border-dashed flex flex-col items-center justify-center gap-2">
            {file ? (
              <img className="max-w-80 max-h-80" src={fileImageUrl} />
            ) : (
              <>
                <label className="bg-yellow-300 py-2 px-2 w-32 rounded cursor-pointer flex gap-1.5 items-center">
                  <Upload className="size-5 stroke-1.5" />
                  בחר קובץ
                  <input
                    className="hidden"
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0])}
                    accept="image/*"
                  />
                </label>
                <div className="text-sm text-gray-600 md:hidden">או</div>
                <label className="bg-yellow-300 py-2 px-2 w-32 rounded cursor-pointer flex gap-1.5 items-center md:hidden">
                  <Camera className="size-5 stroke-1.5" />
                  צלם תמונה
                  <input
                    className="hidden"
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0])}
                    accept="image/*"
                    capture="environment"
                  />
                </label>
              </>
            )}
          </div>
          <label>
            <div className="font-medium">אפשרויות לתשובה נכונה:</div>
            <textarea
              required
              ref={correctAnswersRef}
              className="border border-black rounded px-2 py-1 w-full outline-none focus-visible:ring focus-visible:ring-yellow-500 focus-visible:ring-offset-1"
            />
          </label>
          <div className="flex justify-end gap-1.5">
            <DrawerTrigger
              type="reset"
              className="bg-gray-200 py-1.5 px-3 rounded cursor-pointer"
            >
              ביטול
            </DrawerTrigger>
            <button
              type="submit"
              className="bg-yellow-300 py-1.5 px-3 rounded cursor-pointer"
            >
              שמור
            </button>
          </div>
        </form>
      </DrawerContent>
    </DrawerRoot>
  );
};
