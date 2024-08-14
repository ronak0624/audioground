import { PropsWithChildren } from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type ComoboxValue = {
  value: string;
  label?: string;
  selected: boolean;
};

type ComboboxProps = {
  list: ComoboxValue[];
  open: boolean;
  setOpen: (value: boolean) => void;
  onSelect: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
};

export default function Combobox(props: PropsWithChildren<ComboboxProps>) {
  const { list, open, setOpen, onSelect, children, emptyText, placeholder } =
    props;
  const renderList = list.sort((a, b) => {
    if (a.selected === b.selected) {
      return a.value.localeCompare(b.value);
    }
    return a.selected ? -1 : 1;
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" role="combobox" aria-expanded={open}>
          {children}
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" className="p-0">
        <Command>
          <CommandInput placeholder={placeholder ?? "Search tag..."} />
          <CommandList>
            <CommandEmpty className="py-6 text-sm">
              {emptyText ?? "Add new tag."}
            </CommandEmpty>
            <CommandGroup>
              {renderList.map((tag) => (
                <CommandItem
                  key={tag.value}
                  value={tag.value}
                  onSelect={onSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      tag.selected ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {tag.label ?? tag.value}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
