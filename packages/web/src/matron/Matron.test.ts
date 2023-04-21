import { MatronTestHarness } from "./MatronTestHarness";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "./constants";

describe("Matron", () => {
  const harness = new MatronTestHarness();

  beforeEach(async () => {
    await harness.setUp();
  });

  it("draws text", () => {
    const buffer = harness.draw(`
screen.move(64, 32)
screen.level(15)
screen.text_center("Welcome to Runes!")
screen.stroke()
    `);
    expect(buffer).toMatchImageSnapshot();
  });

  it("draws lines", () => {
    const buffer = harness.draw(`
screen.aa(0)
screen.move(64, 32)
screen.level(15)
screen.line_width(2)
screen.line(80, 48)
screen.stroke()

screen.aa(1)
screen.move(80, 16)
screen.level(8)
screen.line_width(8)
screen.line_rel(16, 16)
screen.stroke()
    `);
    expect(buffer).toMatchImageSnapshot();
  });

  it("draws outlined circles", () => {
    const buffer = harness.draw(`
screen.aa(0)
screen.level(15)
screen.line_width(2)
screen.circle(64, 32, 16)
screen.stroke()
    `);
    expect(buffer).toMatchImageSnapshot();
  });

  it("draws filled circles", () => {
    const buffer = harness.draw(`
screen.aa(0)
screen.level(15)
screen.circle(64, 32, 16)
screen.fill()
    `);
    expect(buffer).toMatchImageSnapshot();
  });

  it("draws outlined rectangles", () => {
    const buffer = harness.draw(`
screen.aa(0)
screen.level(15)
screen.line_width(2)
screen.rect(64, 32, 16, 16)
screen.stroke()
    `);
    expect(buffer).toMatchImageSnapshot();
  });

  it("draws filled rectangles", () => {
    const buffer = harness.draw(`
screen.aa(0)
screen.level(15)
screen.line_width(2)
screen.rect(64, 32, 16, 16)
screen.fill()
    `);
    expect(buffer).toMatchImageSnapshot();
  });

  it("draws curves", () => {
    const buffer = harness.draw(`
screen.aa(0)
screen.level(15)
screen.line_width(8)
screen.line_cap("round")
screen.curve(10, 50, 64, 0, 118, 50)
screen.stroke()
`);
    expect(buffer).toMatchImageSnapshot();
  });

  it("draws pixels", () => {
    let code = `
screen.aa(0)
screen.level(15)
`;

    for (let y = 0; y < SCREEN_HEIGHT; y += 10) {
      for (let x = 0; x < SCREEN_WIDTH; x += 10) {
        code += `
screen.pixel(${x},${y})
`;
      }
    }

    code += `
screen.fill()
`;

    const buffer = harness.draw(code);
    expect(buffer).toMatchImageSnapshot();
  });
});
