import type {QuestionValues} from "./QuestionEditor";
import {chapter2Practice} from "./year9-ch2-practice";
export type Chapter2Fixup={code:string;index:number;before:QuestionValues;after:QuestionValues};
export const chapter2Fixups:Chapter2Fixup[]=[
  {
    "code": "2A",
    "index": 4,
    "before": {
      "prompt": "A ticket costs $t. What do 4 tickets and a $3 booking fee cost?",
      "options": [
        "4t + 3",
        "4(t + 3)",
        "t + 12",
        "7t"
      ],
      "correct_index": 0,
      "explanation": "Four tickets cost 4t; add the one-off $3 fee."
    },
    "after": {
      "prompt": "A ticket costs t dollars. What do 4 tickets and a $3 booking fee cost?",
      "options": [
        "4t + 3",
        "4(t + 3)",
        "t + 12",
        "7t"
      ],
      "correct_index": 0,
      "explanation": "Four tickets cost 4t; add the one-off $3 fee."
    }
  },
  {
    "code": "2A",
    "index": 14,
    "before": {
      "prompt": "A taxi charges $f per kilometre plus a fixed $6 fee. What is the fare for d kilometres?",
      "options": [
        "fd + 6",
        "6fd",
        "f(d + 6)",
        "d + f + 6"
      ],
      "correct_index": 0,
      "explanation": "The distance charge is fd; then add the fixed fee."
    },
    "after": {
      "prompt": "A taxi charges f dollars per kilometre plus a fixed $6 fee. What is the fare for d kilometres?",
      "options": [
        "fd + 6",
        "6fd",
        "f(d + 6)",
        "d + f + 6"
      ],
      "correct_index": 0,
      "explanation": "The distance charge is fd; then add the fixed fee."
    }
  },
  {
    "code": "2A",
    "index": 15,
    "before": {
      "prompt": "Which expression is equivalent to ‘half the sum of u and v’?",
      "options": [
        "u/2 + v",
        "(u + v)/2",
        "u + v/2",
        "2u + 2v"
      ],
      "correct_index": 1,
      "explanation": "The whole sum is divided by 2."
    },
    "after": {
      "prompt": "Which expression is equivalent to ‘half the sum of u and v’?",
      "options": [
        "u/2 + v",
        "$\\frac{u+v}{2}$",
        "u + v/2",
        "2u + 2v"
      ],
      "correct_index": 1,
      "explanation": "The whole sum is divided by 2."
    }
  },
  {
    "code": "2A",
    "index": 20,
    "before": {
      "prompt": "A triangle has base b and height h. Which expression gives its area?",
      "options": [
        "2bh",
        "(b + h)/2",
        "bh/2",
        "b + h"
      ],
      "correct_index": 2,
      "explanation": "Triangle area is half base times height: bh/2."
    },
    "after": {
      "prompt": "A triangle has base b and height h. Which expression gives its area?",
      "options": [
        "2bh",
        "$\\frac{b+h}{2}$",
        "$\\frac{bh}{2}$",
        "b + h"
      ],
      "correct_index": 2,
      "explanation": "Triangle area is half base times height: bh/2."
    }
  },
  {
    "code": "2D",
    "index": 4,
    "before": {
      "prompt": "Solve x/4 + 3 = 8.",
      "options": [
        "x = 20",
        "x = 11/4",
        "x = 5",
        "x = 2"
      ],
      "correct_index": 0,
      "explanation": "Subtract 3, then multiply by 4."
    },
    "after": {
      "prompt": "Solve $\\frac{x}{4} + 3 = 8$.",
      "options": [
        "x = 20",
        "x = 11/4",
        "x = 5",
        "x = 2"
      ],
      "correct_index": 0,
      "explanation": "Subtract 3, then multiply by 4."
    }
  },
  {
    "code": "2D",
    "index": 9,
    "before": {
      "prompt": "Solve 6x/3 = 14.",
      "options": [
        "x = 7",
        "x = 42",
        "x = 4",
        "x = 21"
      ],
      "correct_index": 0,
      "explanation": "Simplify 6x/3 to 2x, then divide by 2."
    },
    "after": {
      "prompt": "Solve $\\frac{6x}{3} = 14$.",
      "options": [
        "x = 7",
        "x = 42",
        "x = 4",
        "x = 21"
      ],
      "correct_index": 0,
      "explanation": "Simplify 6x/3 to 2x, then divide by 2."
    }
  },
  {
    "code": "2D",
    "index": 10,
    "before": {
      "prompt": "Solve (2x + 1)/3 = 5.",
      "options": [
        "x = 8",
        "x = 7",
        "x = 14",
        "x = 4"
      ],
      "correct_index": 1,
      "explanation": "Multiply by 3, subtract 1, then divide by 2."
    },
    "after": {
      "prompt": "Solve $\\frac{2x + 1}{3} = 5$.",
      "options": [
        "x = 8",
        "x = 7",
        "x = 14",
        "x = 4"
      ],
      "correct_index": 1,
      "explanation": "Multiply by 3, subtract 1, then divide by 2."
    }
  },
  {
    "code": "2D",
    "index": 12,
    "before": {
      "prompt": "Solve 9 − x/2 = 3.",
      "options": [
        "x = 3",
        "x = −12",
        "x = 6",
        "x = 12"
      ],
      "correct_index": 3,
      "explanation": "Subtract 9 to get −x/2 = −6; hence x = 12."
    },
    "after": {
      "prompt": "Solve $9 − \\frac{x}{2} = 3$.",
      "options": [
        "x = 3",
        "x = −12",
        "x = 6",
        "x = 12"
      ],
      "correct_index": 3,
      "explanation": "Subtract 9 to get −x/2 = −6; hence x = 12."
    }
  },
  {
    "code": "2D",
    "index": 16,
    "before": {
      "prompt": "Solve 2x/5 = 6.",
      "options": [
        "x = 12/5",
        "x = 3",
        "x = 30",
        "x = 15"
      ],
      "correct_index": 3,
      "explanation": "Multiply by 5, then divide by 2."
    },
    "after": {
      "prompt": "Solve $\\frac{2x}{5} = 6$.",
      "options": [
        "x = 12/5",
        "x = 3",
        "x = 30",
        "x = 15"
      ],
      "correct_index": 3,
      "explanation": "Multiply by 5, then divide by 2."
    }
  },
  {
    "code": "2G",
    "index": 14,
    "before": {
      "prompt": "Solve (x + 2)/3 ≤ 4.",
      "options": [
        "x ≥ 10",
        "x ≤ 14",
        "x ≤ 10",
        "x ≥ 14"
      ],
      "correct_index": 2,
      "explanation": "Multiply by 3 and subtract 2."
    },
    "after": {
      "prompt": "Solve $\\frac{x + 2}{3} ≤ 4$.",
      "options": [
        "x ≥ 10",
        "x ≤ 14",
        "x ≤ 10",
        "x ≥ 14"
      ],
      "correct_index": 2,
      "explanation": "Multiply by 3 and subtract 2."
    }
  },
  {
    "code": "2H",
    "index": 5,
    "before": {
      "prompt": "For s = d/t, find t when s = 15 and d = 90.",
      "options": [
        "1350",
        "75",
        "6",
        "1/6"
      ],
      "correct_index": 2,
      "explanation": "Substitute and solve 15 = 90/t."
    },
    "after": {
      "prompt": "For $s = \\frac{d}{t}$, find t when s = 15 and d = 90.",
      "options": [
        "1350",
        "75",
        "6",
        "1/6"
      ],
      "correct_index": 2,
      "explanation": "Substitute and solve 15 = 90/t."
    }
  },
  {
    "code": "2H",
    "index": 6,
    "before": {
      "prompt": "Given P = 2l + 2w, make w the subject.",
      "options": [
        "w = P − 2l",
        "w = (P − l)/2",
        "w = 2P − l",
        "w = P/2 − l"
      ],
      "correct_index": 3,
      "explanation": "Subtract 2l, then divide by 2."
    },
    "after": {
      "prompt": "Given $P = 2l + 2w$, make w the subject.",
      "options": [
        "w = P − 2l",
        "$w = \\frac{P − l}{2}$",
        "w = 2P − l",
        "$w = \\frac{P}{2} − l$"
      ],
      "correct_index": 3,
      "explanation": "Subtract 2l, then divide by 2."
    }
  },
  {
    "code": "2H",
    "index": 8,
    "before": {
      "prompt": "From v = u + at, make t the subject.",
      "options": [
        "t = v − u/a",
        "t = (v − u)/a",
        "t = a(v − u)",
        "t = (u − v)/a"
      ],
      "correct_index": 1,
      "explanation": "Subtract u, then divide by a."
    },
    "after": {
      "prompt": "From $v = u + at$, make t the subject.",
      "options": [
        "t = v − u/a",
        "$t = \\frac{v − u}{a}$",
        "t = a(v − u)",
        "$t = \\frac{u − v}{a}$"
      ],
      "correct_index": 1,
      "explanation": "Subtract u, then divide by a."
    }
  },
  {
    "code": "2H",
    "index": 13,
    "before": {
      "prompt": "For V = πr²h, make h the subject.",
      "options": [
        "h = Vπr²",
        "h = V/(πr²)",
        "h = V − πr²",
        "h = √(V/πr)"
      ],
      "correct_index": 1,
      "explanation": "Divide both sides by πr²."
    },
    "after": {
      "prompt": "For $V = πr^2h$, make h the subject.",
      "options": [
        "h = Vπr²",
        "$h = \\frac{V}{πr^2}$",
        "h = V − πr²",
        "$h = \\sqrt{\\frac{V}{πr}}$"
      ],
      "correct_index": 1,
      "explanation": "Divide both sides by πr²."
    }
  },
  {
    "code": "2H",
    "index": 14,
    "before": {
      "prompt": "In y = 3x − 7, make x the subject.",
      "options": [
        "x = y/3 − 7",
        "x = 3(y + 7)",
        "x = (y + 7)/3",
        "x = (y − 7)/3"
      ],
      "correct_index": 2,
      "explanation": "Add 7, then divide by 3."
    },
    "after": {
      "prompt": "In $y = 3x − 7$, make x the subject.",
      "options": [
        "x = y/3 − 7",
        "x = 3(y + 7)",
        "$x = \\frac{y + 7}{3}$",
        "$x = \\frac{y − 7}{3}$"
      ],
      "correct_index": 2,
      "explanation": "Add 7, then divide by 3."
    }
  },
  {
    "code": "2I",
    "index": 10,
    "before": {
      "prompt": "Solve y = (x + 2)/2 and x + y = 10.",
      "options": [
        "(4, 6)",
        "(5, 5)",
        "(8, 2)",
        "(6, 4)"
      ],
      "correct_index": 3,
      "explanation": "Substitute: 2x + 2 = 20, so x = 6 and y = 4."
    },
    "after": {
      "prompt": "Solve $y = \\frac{x + 2}{2}$ and x + y = 10.",
      "options": [
        "(4, 6)",
        "(5, 5)",
        "(8, 2)",
        "(6, 4)"
      ],
      "correct_index": 3,
      "explanation": "Substitute: 2x + 2 = 20, so x = 6 and y = 4."
    }
  }
];

// Second-stage repair for the already migrated row: the legacy prompt above
// is also migrated first when present, while this matches the in-between value.
chapter2Fixups.push({code:"2D",index:12,before:{...chapter2Practice["2D"][12],prompt:"Solve $9 − \\frac{x}{2} = 3$."},after:chapter2Practice["2D"][12]});
// Repair the migrated prompt once more so the inline-math parser treats the
// leading numeral as part of an equation, not a currency value.
chapter2Fixups.push({code:"2D",index:12,before:{...chapter2Practice["2D"][12],prompt:"Solve the equation $9 − \\frac{x}{2} = 3$."},after:chapter2Practice["2D"][12]});
