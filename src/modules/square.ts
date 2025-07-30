export class Square {
  public startX: number;
  public startY: number;
  public height: number;
  public width: number;
  public weight: number;
  public speed: number;
  public endX: number;
  public endY: number;

  constructor({
    startX,
    startY,
    width,
    weight,
    speed,
  }: {
    startX: number;
    startY: number;
    width: number;
    weight: number;
    speed: number;
  }) {
    this.startX = startX;
    this.startY = startY;
    this.height = this.width = width;
    this.endX = this.startX + this.width;
    this.endY = this.startY + this.height;
    this.weight = weight;
    this.speed = speed ?? 1;
  }
}
