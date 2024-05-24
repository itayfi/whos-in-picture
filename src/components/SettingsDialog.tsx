import { CircleHelp } from "lucide-react";
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
          <label>
            <div className="font-medium">בחר תמונה</div>
            <div className="flex items-center">
              <div className="grow">{file ? file.name : "לא נבחר קובץ"}</div>
              <div className="bg-yellow-300 py-1 px-2 rounded cursor-pointer">
                בחר...
              </div>
            </div>
            <input
              className="hidden"
              type="file"
              required
              onChange={(e) => setFile(e.target.files?.[0])}
              accept="image/*"
            />
          </label>
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
              className="bg-gray-200 py-1 px-2 rounded cursor-pointer"
            >
              ביטול
            </DrawerTrigger>
            <button
              type="submit"
              className="bg-yellow-300 py-1 px-2 rounded cursor-pointer"
            >
              שמור
            </button>
          </div>
        </form>
      </DrawerContent>
    </DrawerRoot>
  );
};
