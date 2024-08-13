import { Search as SearchIcon } from "lucide-react";
import { Input, InputProps } from "@/components/ui/input";
// import { Kbd } from "@tailus-ui/typography";

interface SearchProps extends InputProps {}

export const Search = (props: SearchProps) => (
  <div className="relative w-full">
    <SearchIcon className="text-[--foreground] absolute inset-y-0 my-auto size-4 left-3 opacity-50 pointer-events-none" />
    <Input type="text" className="pl-10" placeholder="Search" {...props} />
  </div>
);
