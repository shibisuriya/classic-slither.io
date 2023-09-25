import { useState } from "react";
import { generateKey } from "../utils";

const useOrderedHash = (list = []) => {
  const hash = {};
  const keys = [];

  list.forEach(([x, y]) => {
    const key = generateKey(x, y);
    if (!keys.includes(key)) {
      keys.push(key);
    } else {
      throw new Error("Error: The key already exists in the 'OrderedHash'.");
    }
    hash[key] = [x, y];
  });


  const getHead = () => {
    const key = keys[0];
    return { key, value: hash[key] };
  };

  const getTail = () => {
    return hash[keys[keys.length - 1]];
  };

  const getNeck = () => {
    // TODO:
    // Note: A snake should have atleast two cells, a head and a neck... Snake with only one
    // cell (only head doesn't make sense).
    return hash[keys[keys[1]]];
  };

  const moveForward = () => {
    console.log("move forward invoked -> ", Date.now());
  };

  return { list, hash, moveForward, getHead, getTail, getNeck };
};

export default useOrderedHash;
