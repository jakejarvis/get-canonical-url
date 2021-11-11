/* eslint-env node, mocha */
import path from "path";
import { fileURLToPath } from "url";
import { JSDOM } from "jsdom";
import { expect } from "chai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("with canonical tag", () => {
  beforeEach(async () => {
    const domWithTag = await JSDOM.fromFile(path.resolve(__dirname, "fixtures", "with-canonical-tag.html"), {
      runScripts: "dangerously",
      resources: "usable",
    });

    // TODO: be better.
    await wait(500);

    global.window = domWithTag.window;
  });

  it("all defaults", () => {
    expect(window.canonicalUrl())
      .to.equal("https://test.example.com/this/doesnt/exist.aspx?no=really&it=doesnt#gocheck");
  });

  it("normalized (default options)", () => {
    expect(window.canonicalUrl({
      normalize: true,
    })).to.equal("https://test.example.com/this/doesnt/exist.aspx");
  });

  it("normalized (custom options)", () => {
    expect(window.canonicalUrl({
      normalize: true,
      normalizeOptions: {
        stripProtocol: true,
        stripHash: true,
      },
    })).to.equal("test.example.com/this/doesnt/exist.aspx?it=doesnt&no=really");
  });
});

describe("without canonical tag", () => {
  beforeEach(async () => {
    const domWithoutTag = await JSDOM.fromFile(path.resolve(__dirname, "fixtures", "without-canonical-tag.html"), {
      runScripts: "dangerously",
      resources: "usable",
    });
    domWithoutTag.reconfigure({ url: "https://test.example.com/this/doesnt/exist.aspx?no=really&it=doesnt#gocheck" });

    // TODO: be better.
    await wait(500);

    global.window = domWithoutTag.window;
  });

  it("no guess, should give up", () => {
    expect(window.canonicalUrl()).to.be.undefined;
  });

  it("guess from window.location.href", () => {
    expect(window.canonicalUrl({
      guess: true,
      normalize: false,
    })).to.equal("https://test.example.com/this/doesnt/exist.aspx?no=really&it=doesnt#gocheck");
  });
});

async function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
