import { Child, Command } from "@tauri-apps/api/shell";

export default class TagRunner {
  public command: Command;
  private process: Child | undefined;

  constructor(
    paths: string[],
    onStdout: (line?: string) => void,
    onStderr: (line?: string) => void,
    pypath: string,
    onComplete?: (data?: { signal: string; code: string }) => void,
  ) {
    const sanitized = paths.map((path) => `"${path.replaceAll('"', '\\"')}"`);

    this.command = new Command(
      "sh",
      [
        "-c",
        `${pypath}/.venv/bin/python ${pypath}/main.py --paths ${sanitized.join(
          " ",
        )}`,
      ],
      { cwd: pypath },
    );
    this.command.on("error", onStderr);
    this.command.on("close", onComplete ? onComplete : () => {});

    this.command.stdout.on("data", onStdout);
    this.command.stderr.on("data", onStderr);
  }

  async spawn() {
    if (!!this.process) return;
    const cmd = await this.command.spawn();
    this.process = cmd;
    window.onbeforeunload = function () {
      return "You are in the middle of a run. You will have to restart it if you leave. ";
    };
    console.log(this.process.pid);
  }

  async kill() {
    if (!this.process) return;
    window.onbeforeunload = () => {};
    await this.process.kill();
  }
}
