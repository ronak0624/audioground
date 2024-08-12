import usePythonVenv from "./lib/shell/python";
import Interface from "./Interface";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { useEffect } from "react";

function App() {
  const [done, loading, error] = usePythonVenv();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (done) {
      toast.success("Dependencies installed!");
    }
    if (loading) {
      toast.info("Installing dependencies...");
    }
  }, [done, loading, error]);

  return (
    <>
      <Interface />
      <Toaster />
    </>
  );
}

export default App;
