/**
 * Contains solutions for Day 7
 * Puzzle Description: https://adventofcode.com/2023/day/7
 */

import { sum } from "./util/array.js";
import { characterCounts } from "./util/string.js";

const parseLine = (line) => {
  const [hand, bid] = line.split(" ");
  return [hand, Number(bid)];
};

const score = (cards) => {
  const cardCounts = characterCounts(cards);
  switch (cardCounts.size) {
    case 1:
      return 50000;
    case 2:
      return Math.max(...[...cardCounts.values()]) === 4 ? 41000 : 32100;
    case 3:
      return Math.max(...[...cardCounts.values()]) === 3 ? 31100 : 22100;
    case 4:
      return 21110;
    default:
      return 11111;
  }
};

const cardStrengths = [2, 3, 4, 5, 6, 7, 8, 9, "T", "J", "Q", "K", "A"].reduce(
  (acc, x, i) => ({ ...acc, [x]: i }),
  {}
);

const highCard = (a, b) => {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      const aStrength = cardStrengths[a[i]];
      const bStrength = cardStrengths[b[i]];
      if (aStrength < bStrength) {
        return -1;
      } else if (aStrength > bStrength) {
        return 1;
      }
    }
  }
  return 0;
};

const compareHands = (a, b, scoreMap) => {
  const aScore = scoreMap.get(a);
  const bScore = scoreMap.get(b);
  if (aScore < bScore) {
    return -1;
  } else if (aScore > bScore) {
    return 1;
  }
  return highCard(a, b);
};

const cards = (hand) => hand[0];

const bid = (hand) => hand[1];

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  const hands = lines.map(parseLine);
  const scoreMap = hands.reduce(
    (acc, hand) => acc.set(cards(hand), score(cards(hand))),
    new Map()
  );
  hands.sort((a, b) => compareHands(cards(a), cards(b), scoreMap));
  return sum(hands.map((x, i) => bid(x) * (i + 1)));
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ input, lines }) => {
  // your code here
};
