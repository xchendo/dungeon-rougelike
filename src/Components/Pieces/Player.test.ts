// https://codingwithmanny.medium.com/quick-jest-setup-with-vitejs-react-typescript-82f325e4323f

import { CellTypes } from './Cell';
import Player from './Player';

const createPlayer = ({
  position = { x: 0, y: 0 },
  health = 10,
  attack = 1,
  level = 1,
  type = CellTypes.HERO,
  experience = 45,
}) => {
  return new Player({ position, health, attack, type, level, experience });
};

test('Player can move', () => {
  const player = createPlayer({});

  player.setPosition(player.moveDown());
  expect(player.getXCoord()).toBe(0);
  expect(player.getYCoord()).toBe(1);

  player.setPosition(player.moveRight());
  expect(player.getXCoord()).toBe(1);
  expect(player.getYCoord()).toBe(1);

  player.setPosition(player.moveUp());
  expect(player.getXCoord()).toBe(1);
  expect(player.getYCoord()).toBe(0);

  player.setPosition(player.moveLeft());
  expect(player.getXCoord()).toBe(0);
  expect(player.getYCoord()).toBe(0);
});

test('Player can gain health', () => {
  const player = createPlayer({});
  player.changeHP(5);
  expect(player.getHP()).toBe(15);
});

test('Player can lose health', () => {
  const player = createPlayer({});
  player.changeHP(-5);
  expect(player.getHP()).toBe(5);
});

test('Player can die', () => {
  const player = createPlayer({});
  player.changeHP(-10);
  expect(player.getHP()).toBe(0);
  expect(player.isDead()).toBe(true);
});

test('Player can attack enemy', () => {
  const player = createPlayer({});
  const enemy = createPlayer({ type: CellTypes.ENEMY });

  player.battle(enemy);
  expect(enemy.getHP()).toBe(8);
});

test('Player can be attacked', () => {
  const player = createPlayer({});
  const enemy = createPlayer({ type: CellTypes.ENEMY });

  enemy.battle(player);
  expect(player.getHP()).toBe(8);
});
