import usePythonVenv from "./lib/shell/python";
import Interface from "./Interface";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { useEffect } from "react";
import Titlebar from "./components/Titlebar";

function App() {
  const [done, loading, error] = usePythonVenv();

  useEffect(() => {
    if (loading) {
      toast.info("Loading environment...", { duration: 4000 });
    }
    if (error) {
      toast.error(error);
    }
    if (done) {
      toast.success("Environment loaded!", { duration: 4000 });
    }
  }, [done, loading, error]);

  return (
    <>
      <Titlebar />
      <Interface />
      <Toaster richColors visibleToasts={6} toastOptions={{ duration: 8000 }} />
    </>
  );
}

export default App;
