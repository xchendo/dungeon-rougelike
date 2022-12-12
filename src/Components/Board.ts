import Canvas from './Canvas';
import Cell from './Cell';
import Character, { Coordinate } from './Character';
import Enemy from './Enemy';
import GameMap from './GameMap';
import Item from './Item';
import Player from './Player';
import PlayerStats from './PlayerStats';

interface BoardProps {
  player: Player;
  canvas: Canvas;
  playerStats: PlayerStats;
  gameMap: GameMap;
}

class Board {
  player: Player;
  canvas: Canvas;
  playerStats: PlayerStats;
  gameMap: GameMap;
  gameOver: boolean;


  constructor({ canvas, player, playerStats, gameMap }: BoardProps) {
    this.player = player;
    this.canvas = canvas;
    this.playerStats = playerStats;
    this.gameMap = gameMap;
    this.gameOver = false;
  }

  handleKeyPress = (e: { keyCode: number }): void => {
    const previousCoordinate = this.player.getPosition();
    const updatedCoordinate = this.player.move(e.keyCode);

    /**
     * move possibilities
     * 1. empty square -> update player move
     * 2. enemy -> prevent move, do a damage calculation, update player and enemy HP
     * 3. item -> update player move, remove item,
     */

    if (updatedCoordinate && this.moveInBounds(updatedCoordinate)) {
      const cell = this.gameMap.getCell(updatedCoordinate);
      
      if (cell instanceof Character) {
        this.player.battle(cell);
        console.log(cell.getHP());
        

        if (this.player.isDead()) {
          this.gameOver = true;
        } else if (cell.isDead()) {
          // remove enemy from map and board
          this.gameMap.remove(cell.getPosition());
          this.canvas.removeFromBoard(cell.getPosition());

          // update the players position on map
          this.player.setPosition(updatedCoordinate);
          this.gameMap.update(cell, updatedCoordinate, previousCoordinate);

          // update the players position on the board
          this.canvas.placeOnBoard(updatedCoordinate, 'yellow');
          this.canvas.removeFromBoard(previousCoordinate);
        }
      } else if (cell instanceof Item ) {
        // apply item buffs to player
        this.player.pickUp(cell);

        // remove item from the board and the game
        this.gameMap.remove(cell.getPosition());
        this.canvas.removeFromBoard(cell.getPosition());

        // move the player to the spot where the item was
        this.player.setPosition(updatedCoordinate);
        this.canvas.placeOnBoard(updatedCoordinate, 'yellow');
        this.canvas.removeFromBoard(previousCoordinate);
      } else {
        // no interactions, move the player to the empty square
        this.gameMap.update(cell, updatedCoordinate, previousCoordinate);
        this.player.setPosition(updatedCoordinate);
        this.canvas.placeOnBoard(updatedCoordinate, 'yellow');
        this.canvas.removeFromBoard(previousCoordinate);
      }
      this.playerStats.displayStats(this.player);
    }
  };

  // TODO: vertical bound and horizonal bounds defined by canvas H*W
  moveInBounds(coordinate: Coordinate): boolean {
    return (
      this.inVerticalBounds(coordinate.y) &&
      this.inHoriziontalBounds(coordinate.x)
    );
  }

  landOnSquare(position: Coordinate, board: Cell[][]): Cell {
    return board[position.x][position.y];
  }

  itemPickUp(playerPosition: Coordinate, items: Item[]): Item | undefined {
    return items.find((item: Item) => {
      const x = item.getXCoord();
      const y = item.getYCoord();
      if (x === playerPosition.x && y === playerPosition.y) {
        return item;
      }
      return undefined;
    });
  }

  enemyEncounter(playerPosition: Coordinate, enemy: Enemy): boolean {
    const enemyPosition = enemy.getPosition();
    return (
      playerPosition.x == enemyPosition.x &&
      playerPosition.y === enemyPosition.y
    );
  }

  inVerticalBounds(coordinate: number): boolean {
    return coordinate >= 0 && coordinate < 10;
  }

  inHoriziontalBounds(coordinate: number): boolean {
    return coordinate >= 0 && coordinate < 10;
  }

  addArrowKeyListener(): void {
    document.addEventListener('keydown', this.handleKeyPress);
  }
}

export default Board;
