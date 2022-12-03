import { Coordinate } from "./Character";

const WIDTH = 400;
const HEIGHT = 400;
const BOX_SIZE = 40;

export enum CellTypes {
  ENEMY = 'red',
  HERO = 'black'
}

export default class Canvas {
  canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  getCanvas() {
    return this.canvas;
  }

  drawBlankBoard(): void {  
    const context =  this.canvas.getContext('2d');
    if (!context) {
      throw Error('Canvas not defined');
    }

    context.strokeStyle='black';

    for (let x = 0; x <= WIDTH / BOX_SIZE; x ++) {
      for (let y = 0; y <= HEIGHT / BOX_SIZE; y++) {
        let xPos = x * BOX_SIZE;
        let yPos = y * BOX_SIZE;
        context.strokeRect(xPos, yPos, BOX_SIZE, BOX_SIZE);;
      }
    }
  }

  placeOnBoard(position: Coordinate, type: CellTypes): void {
    const context =  this.canvas.getContext('2d');
    if (!context) {
      throw Error('Canvas not defined');
    }

    context.fillStyle = type;
    context.strokeStyle = 'black';
    context.fillRect(position.x * 40, position.y * 40, BOX_SIZE, BOX_SIZE);
  }

  removeFromBoard(position: Coordinate): void {
    const context =  this.canvas.getContext('2d');
    if (!context) {
      throw Error('Canvas not defined');
    }

    context.fillStyle = 'white';
    context.strokeStyle = 'black';

    context.fillRect(position.x * 40, position.y * 40, BOX_SIZE, BOX_SIZE);
    context.strokeRect(position.x * 40,position.y * 40, BOX_SIZE, BOX_SIZE);
  }
}