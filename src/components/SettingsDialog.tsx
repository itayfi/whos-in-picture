import { Camera, CircleHelp, Upload } from "lucide-react";
import { DrawerContent, DrawerRoot, DrawerTrigger } from "./ui/Drawer";
import { useRef, useState } from "react";

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
          <div className="font-medium">בחר תמונה</div>
          <label>
            <div className="flex items-center">
              <div className="grow">{file ? file.name : "בחר קובץ"}</div>
              <div className="bg-yellow-300 py-1 px-2 w-32 rounded cursor-pointer flex gap-1.5 items-center">
                <Upload className="size-5 stroke-1.5" />
                בחר...
              </div>
            </div>
            <input
              className="hidden"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0])}
              accept="image/*"
            />
          </label>
          <div className="flex md:hidden items-center justify-end gap-2.5">
            <div className="text-sm text-gray-600">או</div>
            <label>
              <div className="bg-yellow-300 py-2 px-2 w-32 rounded cursor-pointer flex gap-1.5 items-center">
                <Camera className="size-5 stroke-1.5" />
                צלם תמונה
              </div>
              <input
                className="hidden"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0])}
                accept="image/*"
                capture="environment"
              />
            </label>
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
