/**
 * Contains solutions for Day 7
 * Puzzle Description: https://adventofcode.com/2023/day/7
 */

import { sum } from "./util/array.js";
import { findKeyByValue } from "./util/map.js";
import { characterCounts } from "./util/string.js";

/**
 * The default strengths of each card face.
 */
const defaultCardStrengths = {
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
  7: 6,
  8: 7,
  9: 8,
  T: 9,
  J: 10,
  Q: 11,
  K: 12,
  A: 13,
};

/**
 * Parse a hand from a line of input.
 */
const parseHand = (line) => {
  const [hand, bid] = line.split(" ");
  return [hand, Number(bid)];
};

/**
 * Calculates the total winnings of all hands.
 */
const totalWinnings = (hands, countCardsFn, cardStrengths) => {
  // return the cards of the hand.
  const cards = (hand) => hand[0];

  // returns the bid of the hand.
  const bid = (hand) => hand[1];

  // returns the score of the hand, higher is better.
  const score = (cardCounts) => {
    switch (cardCounts.size) {
      case 1:
        // five of a kind.
        return 50000;
      case 2:
        // four of a kind or full house.
        return Math.max(...[...cardCounts.values()]) === 4 ? 41000 : 32000;
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

  // map each hand to its score.
  const scores = hands.reduce(
    (acc, hand) => acc.set(hand, score(countCardsFn(cards(hand)))),
    new Map()
  );

  // compares the hands card by card.
  // returns < 0 if a is weaker than b.
  // returns > 0 if a is stronger than b.
  // returns zero if a equals b.
  const highCard = (a, b, strengths) => {
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return strengths[a[i]] - strengths[b[i]];
      }
    }
    return 0;
  };

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
export const levelOne = ({ lines }) =>
  totalWinnings(lines.map(parseHand), characterCounts, defaultCardStrengths);

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ lines }) => {
  // modify card strengths so joker is weakest individual card.
  const strengthsWithJoker = { ...defaultCardStrengths, J: 0 };
  // returns a modified card count using jokers to create the strongest hand type possible.
  const countCards = (cards) => {
    const counts = characterCounts(cards);
    // no need to modify if no jokers in hand or hand of all jokers.
    if (!counts.has("J") || (counts.has("J") && counts.size === 1)) {
      return counts;
    }
    const jokerCount = counts.get("J");
    counts.delete("J");
    let maxCount = 0;
    let maxFace;
    for (const [face, count] of counts.entries()) {
      if (count > maxCount) {
        maxCount = count;
        maxFace = face;
      }
    }
    counts.set(maxFace, counts.get(maxFace) + jokerCount);
    return counts;
  };
  return totalWinnings(lines.map(parseHand), countCards, strengthsWithJoker);
};
