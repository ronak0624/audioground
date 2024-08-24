import { Search as SearchIcon } from "lucide-react";
import { Input, InputProps } from "@/components/ui/input";
import useOnMount from "@lib/hooks/useOnMount";
import { useEffect, useRef } from "react";
// import { Kbd } from "@tailus-ui/typography";

interface SearchProps extends InputProps {}

export const Search = (props: SearchProps) => {
  const ref = useRef<HTMLInputElement>(null);

  useOnMount(() => {
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  });

  useEffect(() => {}, []);

  const listener = (e: KeyboardEvent) => {
    const isHotkeyAndNoFocusedElement =
      e.key === "/" &&
      ref.current &&
      !document.activeElement?.tagName.match(/input|textarea/i);
    if (isHotkeyAndNoFocusedElement) {
      e.preventDefault();
      ref.current.focus();
    }
  };

  return (
    <div className="relative w-full">
      <SearchIcon className="text-[--foreground] absolute inset-y-0 my-auto size-4 left-3 opacity-50 pointer-events-none" />
      <Input
        ref={ref}
        type="text"
        className="pl-10"
        placeholder="Search"
        {...props}
      />
      <kbd className="pointer-events-none absolute inset-y-0 right-3 my-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
        /
      </kbd>
    </div>
  );
};
