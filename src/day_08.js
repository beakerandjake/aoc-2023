/**
 * Contains solutions for Day 8
 * Puzzle Description: https://adventofcode.com/2023/day/8
 */

import { circularIterator } from "./util/array.js";
import { lcm } from "./util/math.js";

/**
 * Parses the input and returns the instructions and the graph of nodes.
 */
const parseMaps = (lines) => {
  const graph = {};
  for (let i = 2; i < lines.length; i++) {
    graph[lines[i].slice(0, 3)] = {
      left: lines[i].slice(7, 10),
      right: lines[i].slice(12, 15),
    };
  }
  return [lines[0], graph];
};

/**
 * Follows the instructions and counts the number of steps before the end condition is reached.
 */
const countSteps = (instructions, graph, startNode, endPredicateFn) => {
  const instructionIterator = circularIterator(instructions);
  let steps = 0;
  let node = startNode;
  while (!endPredicateFn(node)) {
    steps++;
    node =
      instructionIterator.next().value === "L"
        ? graph[node].left
        : graph[node].right;
  }
  return steps;
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  const [instructions, graph] = parseMaps(lines);
  return countSteps(instructions, graph, "AAA", (node) => node === "ZZZ");
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ lines }) => {
  const [instructions, graph] = parseMaps(lines);
  return lcm(
    ...Object.keys(graph)
      .filter((node) => node.endsWith("A"))
      .map((node) =>
        countSteps(instructions, graph, node, (x) => x.endsWith("Z"))
      )
  );
};
