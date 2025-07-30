import { Square } from "./modules/square";

const countNumberElement = document.querySelector("#count-number")! as HTMLSpanElement;
const startButton = document.querySelector("#click-button")! as HTMLButtonElement;
const digitsOfPiElem = document.querySelector("#number-of-digits")! as HTMLInputElement;

interface CanvasDetail {
  canvasHeight: number;
  canvasWidth: number;
}

class App {
  public smallSquare: Square | undefined;
  public largeSquare: Square | undefined;
  public audio: HTMLAudioElement | undefined;
  public audioPlayButton: HTMLDivElement | undefined;
  public canvasElement: HTMLCanvasElement;
  public canvas2dCtx: CanvasRenderingContext2D;
  public collisionCount: number;
  public digitsOfPi: number = 2;

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
      speed: 0,
    });
    this.largeSquare = new Square({
      startX: Math.floor(this.canvasElement.width / 2),
      startY: this.canvasElement.height - 100,
      width: 100,
      weight: Math.pow(100, this.digitsOfPi - 1),
      speed: -2,
    });
    this.audio = new Audio("src/assets/hit-sound.wav");
    this.audioPlayButton = document.createElement("div");
    this.audioPlayButton.addEventListener("click", () => this.audio?.play());

    return this;
  }

  update() {
    if (!this.smallSquare || !this.largeSquare) {
      throw new Error("small or large square undefined");
    }

    // detect collision on left wall
    if (this.smallSquare.startX <= 0) {
      // console.log("square collided with wall");
      this.collisionCount += 1;
      countNumberElement.innerText = this.collisionCount.toString();
      this.smallSquare.speed *= -1;
      this.audioPlayButton!.click();

      // console.log({
      //   smallSquare: {
      //     startX: this.smallSquare.startX,
      //     startY: this.smallSquare.startY,
      //     speed: this.smallSquare.speed,
      //   },
      //   largeSquare: {
      //     startX: this.largeSquare.startX,
      //     startY: this.largeSquare.startY,
      //     speed: this.largeSquare.speed,
      //   },
      // });
    }

    // detect collision with each other
    if (this.smallSquare.startX + this.smallSquare.width >= this.largeSquare.startX) {
      // console.log("squares collided with each other");
      this.collisionCount += 1;
      countNumberElement.innerText = this.collisionCount.toString();
      this.audioPlayButton!.click();

      const initialLargeSquareSpeed = this.largeSquare.speed;
      const initialSmallSquareSpeed = this.smallSquare.speed;

      // new largeSquare speed
      this.largeSquare.speed =
        ((this.largeSquare.weight - this.smallSquare.weight) / (this.largeSquare.weight + this.smallSquare.weight)) *
          initialLargeSquareSpeed +
        ((2 * this.smallSquare.weight) / (this.largeSquare.weight + this.smallSquare.weight)) * initialSmallSquareSpeed;

      // new smallSquare speed
      this.smallSquare.speed =
        ((2 * this.largeSquare.weight) / (this.largeSquare.weight + this.smallSquare.weight)) *
          initialLargeSquareSpeed +
        ((this.smallSquare.weight - this.largeSquare.weight) / (this.smallSquare.weight + this.largeSquare.weight)) *
          initialSmallSquareSpeed;

      // console.log({
      //   smallSquare: {
      //     startX: this.smallSquare.startX,
      //     startY: this.smallSquare.startY,
      //     speed: this.smallSquare.speed,
      //   },
      //   largeSquare: {
      //     startX: this.largeSquare.startX,
      //     startY: this.largeSquare.startY,
      //     speed: this.largeSquare.speed,
      //   },
      // });
    }

    this.smallSquare.startX += this.smallSquare.speed;
    this.largeSquare.startX += this.largeSquare.speed;

    // if (
    //   this.smallSquare!.speed > this.largeSquare!.speed &&
    //   this.largeSquare!.startX + this.largeSquare!.width >= this.canvasElement.width
    // ) {
    //   // this.extendCanvas();
    // }
  }

  extendCanvas() {
    // this.canvasElement.style.width = `${window.getComputedStyle(this.canvasElement).width.slice(0, -2)}`;
    this.canvasElement.style.width = "200px";
  }

  setDigitsOfPi(value: number) {
    this.digitsOfPi = value;
    return this;
  }

  draw() {
    const appRef = this;
    appRef.canvas2dCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

    function drawBoxes() {
      if (!appRef.smallSquare || !appRef.largeSquare) {
        throw new Error("small or large square undefined");
      }

      appRef.canvas2dCtx.strokeStyle = "#01012cff";
      [appRef.largeSquare, appRef.smallSquare].forEach((square) =>
        appRef.canvas2dCtx.strokeRect(square.startX, square.startY, square.width, square.height)
      );
    }

    drawBoxes();
  }

  renderLoop() {
    requestAnimationFrame(() => {
      this.update();
      this.draw();
      return this.renderLoop();
    });
  }

  start() {
    this.renderLoop();
  }
}

startButton.addEventListener("click", () => {
  new App(document.querySelector("canvas#canvas")! satisfies HTMLCanvasElement)
    .setDigitsOfPi(Number(digitsOfPiElem.value) <= 0 ? 1 : Number(digitsOfPiElem.value))
    .init({
      canvasHeight: 450,
      canvasWidth: 800,
    })
    .start();

  startButton.setAttribute("disabled", "true");
  startButton.style.opacity = "0.5";
  startButton.style.cursor = "context-menu";
});
