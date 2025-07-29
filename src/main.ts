import { Square } from "./modules/square";

const countNumberElement = document.querySelector("#count-number")!;

interface CanvasDetail {
  canvasHeight: number;
  canvasWidth: number;
}

class App {
  public smallSquare: Square | undefined;
  public largeSquare: Square | undefined;
  public canvasElement: HTMLCanvasElement;
  public canvas2dCtx: CanvasRenderingContext2D;
  public collisionCount: number;
  constructor(canvasElement: HTMLCanvasElement) {
    this.canvasElement = canvasElement;
    this.canvas2dCtx = this.canvasElement.getContext("2d")!;
    this.collisionCount = 0;
  }

  init({ canvasHeight, canvasWidth }: CanvasDetail) {
    this.canvasElement.height = canvasHeight;
    this.canvasElement.width = canvasWidth;
    this.smallSquare = new Square({
      startX: Math.floor(this.canvasElement.width / 4),
      startY: this.canvasElement.height - 50,
      width: 50,
      weight: 1,
    });
    this.largeSquare = new Square({
      startX: Math.floor(this.canvasElement.width / 2),
      startY: this.canvasElement.height - 100,
      width: 100,
      weight: 100,
    });

    this.renderLoop();
  }

  update() {
    if (!this.smallSquare || !this.largeSquare) {
      throw new Error("small or large square undefined");
    }

    this.smallSquare.startX -= this.smallSquare.startX === 0 ? 0 : 2;
    this.largeSquare.startX -=
      this.largeSquare.startX === this.smallSquare.width ? 0 : 1;
  }

  draw() {
    const appRef = this;
    appRef.canvas2dCtx.clearRect(
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );

    function drawBoxes() {
      if (!appRef.smallSquare || !appRef.largeSquare) {
        throw new Error("small or large square undefined");
      }

      appRef.canvas2dCtx.strokeStyle = "#080840";
      [appRef.largeSquare, appRef.smallSquare].forEach((square) =>
        appRef.canvas2dCtx.strokeRect(
          square.startX,
          square.startY,
          square.width,
          square.height
        )
      );
    }

    drawBoxes();
  }

  detectCollision() {}

  renderLoop() {
    requestAnimationFrame((timesamp) => {
      this.update();
      this.draw();
      return this.renderLoop();
    });
  }
}

new App(
  document.querySelector("canvas#canvas")! satisfies HTMLCanvasElement
).init({ canvasHeight: 600, canvasWidth: 1200 });
