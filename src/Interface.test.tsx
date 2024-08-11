import { expect } from "@wdio/globals";
import { render, screen } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
expect.extend(matchers);

import Interface from "./Interface";

describe("React Component Tests", () => {
  it("should have container", async () => {
    render(<Interface />);
    expect(screen.getByRole("main")).toHaveElementClass("container");
  });
});
