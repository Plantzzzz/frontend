export const sowingCalendar: Record<string, {
  sow?: number[];         // sowing months (1–12)
  transplant?: number[];  // transplanting months
  harvest?: number[];     // harvesting months
  prune?: number[];       // pruning months
  fertilize?: number[];   // fertilizing months
}> = {
  // 🥕 Common vegetables
  "tomato": {
    sow: [3, 4],
    transplant: [5],
    harvest: [7, 8, 9]
  },
  "lettuce": {
    sow: [3, 4, 8, 9],
    transplant: [4, 9],
    harvest: [5, 6, 10]
  },
  "carrot": {
    sow: [3, 4, 5],
    harvest: [7, 8, 9]
  },
  "cucumber": {
    sow: [4, 5],
    transplant: [5],
    harvest: [7, 8]
  },
  "zucchini": {
    sow: [4, 5],
    transplant: [5],
    harvest: [7, 8, 9]
  },
  "onion": {
    sow: [2, 3],
    harvest: [7, 8]
  },
  "garlic": {
    sow: [10, 11],
    harvest: [6, 7]
  },
  "pepper": {
    sow: [2, 3],
    transplant: [5],
    harvest: [7, 8, 9]
  },
  "spinach": {
    sow: [3, 4, 8, 9],
    harvest: [5, 6, 10]
  },
  "radish": {
    sow: [3, 4, 8, 9],
    harvest: [4, 5, 9]
  },
  "broccoli": {
    sow: [3, 4],
    transplant: [5],
    harvest: [7, 8]
  },
  "cauliflower": {
    sow: [3, 4],
    transplant: [5],
    harvest: [7, 8]
  },
  "beans": {
    sow: [5, 6],
    harvest: [7, 8, 9]
  },
  "peas": {
    sow: [3, 4],
    harvest: [6, 7]
  },
  "potato": {
    sow: [3, 4],
    harvest: [7, 8, 9]
  },
  "beetroot": {
    sow: [3, 4, 5],
    harvest: [7, 8]
  },
  "cabbage": {
    sow: [2, 3],
    transplant: [4],
    harvest: [7, 8, 9]
  },
  "celery": {
    sow: [2, 3],
    transplant: [5],
    harvest: [8, 9]
  },
  "pumpkin": {
    sow: [4, 5],
    transplant: [5],
    harvest: [9, 10]
  },
  "leek": {
    sow: [2, 3],
    transplant: [5],
    harvest: [9, 10]
  },

  // 🪴 Common houseplants
  "spider plant": {
    transplant: [3, 4],
    prune: [3, 4],
    fertilize: [4, 5, 6, 7, 8]
  },
  "snake plant": {
    transplant: [4, 5],
    prune: [5],
    fertilize: [5, 6, 7]
  },
  "pothos": {
    transplant: [4, 5],
    prune: [3, 4, 5],
    fertilize: [4, 5, 6, 7, 8]
  },
  "peace lily": {
    transplant: [3, 4],
    prune: [4],
    fertilize: [4, 5, 6, 7]
  },
  "monstera": {
    transplant: [4, 5],
    prune: [4],
    fertilize: [5, 6, 7, 8]
  },
  "dracaena": {
    transplant: [4, 5],
    prune: [5],
    fertilize: [4, 5, 6, 7]
  },
  "ficus": {
    transplant: [3, 4],
    prune: [3],
    fertilize: [4, 5, 6, 7]
  },
  "rubber plant": {
    transplant: [4, 5],
    prune: [5],
    fertilize: [5, 6, 7]
  },
  "jade plant": {
    transplant: [4],
    prune: [3, 4],
    fertilize: [4, 5, 6]
  },
  "aloe vera": {
    transplant: [4],
    prune: [3],
    fertilize: [4, 5, 6]
  },
  "zz plant": {
    transplant: [4],
    prune: [4],
    fertilize: [4, 5, 6, 7]
  },
  "philodendron": {
    transplant: [4, 5],
    prune: [4],
    fertilize: [5, 6, 7]
  },
  "calathea": {
    transplant: [4],
    prune: [4],
    fertilize: [5, 6, 7]
  },
  "anthurium": {
    transplant: [3, 4],
    prune: [4],
    fertilize: [5, 6, 7]
  },
  "begonia": {
    transplant: [4],
    prune: [4],
    fertilize: [5, 6, 7]
  },
  "orchid": {
    transplant: [3, 4],
    prune: [4],
    fertilize: [4, 5, 6]
  },
  "geranium": {
    transplant: [4],
    prune: [3, 4],
    fertilize: [4, 5, 6, 7]
  },
  "coleus": {
    transplant: [4],
    prune: [4],
    fertilize: [5, 6, 7]
  },
  "hibiscus": {
    transplant: [4],
    prune: [3, 4],
    fertilize: [5, 6, 7]
  },
  "dieffenbachia": {
    transplant: [4, 5],
    prune: [4],
    fertilize: [5, 6, 7]
  }
};
