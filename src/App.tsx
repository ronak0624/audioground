import usePythonVenv from "./lib/shell/python";
import Interface from "./Interface";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { Suspense, useEffect } from "react";
import { FullScreenLoader } from "./components/Loader";

function App() {
  const [done, loading, error] = usePythonVenv();

  useEffect(() => {
    if (loading) {
      toast.info("Loading environment...", { duration: 4000 });
    }
    if (error) {
      toast.error(JSON.stringify(error));
    }
    if (done) {
      toast.success("Environment loaded!", { duration: 4000 });
    }
  }, [done, loading, error]);

  return (
    <Suspense fallback={<FullScreenLoader />}>
      <Interface />
      <Toaster richColors visibleToasts={6} toastOptions={{ duration: 8000 }} />
    </Suspense>
  );
}

export default App;
