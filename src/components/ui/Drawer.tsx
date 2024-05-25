import { DialogTriggerProps } from "@radix-ui/react-dialog";
import { PropsWithChildren } from "react";
import { Drawer } from "vaul";
import { cn } from "../../lib/utils";

export const DrawerRoot = Drawer.Root;

export const DrawerTrigger = ({ className, ...props }: DialogTriggerProps) => (
  <Drawer.Trigger className={cn("cursor-pointer p-2", className)} {...props} />
);

export const DrawerContent = ({ children }: PropsWithChildren) => (
  <Drawer.Portal>
    <Drawer.Overlay className="fixed inset-0 z-50 bg-black/80" />
    <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-white max-h-screen">
      <Drawer.Handle className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-gray-300" />
      <div className="overflow-y-auto">{children}</div>
    </Drawer.Content>
    <Drawer.Overlay />
  </Drawer.Portal>
);
