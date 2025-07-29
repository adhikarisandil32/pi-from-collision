export class Square {
  public startX: number;
  public startY: number;
  public height: number;
  public width: number;
  public weight: number;
  constructor({
    startX,
    startY,
    width,
    weight,
  }: {
    startX: number;
    startY: number;
    width: number;
    weight: number;
  }) {
    this.startX = startX;
    this.startY = startY;
    this.height = this.width = width;
    this.weight = weight;
  }
}
