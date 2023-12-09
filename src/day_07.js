/**
 * Contains solutions for Day 7
 * Puzzle Description: https://adventofcode.com/2023/day/7
 */

import { sum } from "./util/array.js";
import { characterCounts } from "./util/string.js";

/**
 * Parse a hand from a line of input.
 */
const parseHand = (line) => {
  const [hand, bid] = line.split(" ");
  return [hand, Number(bid)];
};

/**
 * Compares the individual cards of two hands.
 * Returns < 0 if a is weaker than b.
 * Returns > 1 if a is stronger than b.
 * Returns zero if equal.
 */
const highCard = (a, b, strengths) => {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return strengths[a[i]] - strengths[b[i]];
    }
  }
  return 0;
};

/**
 * Returns the cards of the hand.
 */
const cards = (hand) => hand[0];

/**
 * Returns the bid of the hand.
 */
const bid = (hand) => hand[1];

/**
 * Calculates the total winnings of all hands.
 */
const totalWinnings = (hands, handScoreFn, cardStrengths) => {
  // map each hand to the score of its hand.
  const scores = hands.reduce(
    (acc, hand) => acc.set(hand, handScoreFn(characterCounts(cards(hand)))),
    new Map()
  );

  // sort the hands by their score ascending.
  const sorted = [...hands].sort((a, b) => {
    const aScore = scores.get(a);
    const bScore = scores.get(b);
    if (aScore < bScore) {
      return -1;
    } else if (aScore > bScore) {
      return 1;
    }
    return highCard(cards(a), cards(b), cardStrengths);
  });

  // total winnings are the sum of each hand multiplied by its rank.
  return sum(sorted.map((hand, i) => bid(hand) * (i + 1)));
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  // create object which maps a card label to its strength.
  const strengths = [2, 3, 4, 5, 6, 7, 8, 9, "T", "J", "Q", "K", "A"].reduce(
    (acc, x, i) => ({ ...acc, [x]: i }),
    {}
  );

  // returns the score of the hand, higher is better.
  const score = (cardCounts) => {
    switch (cardCounts.size) {
      case 1:
        // five of a kind.
        return 50000;
      case 2:
        // four of a kind or full house.
        return Math.max(...[...cardCounts.values()]) === 4 ? 41000 : 32100;
      case 3:
        // three of a kind or two pair.
        return Math.max(...[...cardCounts.values()]) === 3 ? 31100 : 22100;
      case 4:
        // one pair
        return 21110;
      default:
        // high card.
        return 11111;
    }
  };

  return totalWinnings(lines.map(parseHand), score, strengths);
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ input, lines }) => {
  // your code here
};
