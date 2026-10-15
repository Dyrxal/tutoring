import type {QuestionOptions} from "./question-types";

// Previous published versions for changed seed rows. Used only as a strict match guard.
export const previousYear10SeedRows:Record<string,{prompt:string;options:QuestionOptions;correct_index:number;explanation:string}> = {
  "10c10068-0000-4000-8000-000000000003": {
    "prompt": "Solve 5x − 4 = 2x + 11.",
    "options": {
      "kind": "short_answer",
      "accepted": [
        "x = 5"
      ],
      "exact": false
    },
    "correct_index": 0,
    "explanation": "Subtract 2x and add 4: 3x=15, so x=5."
  },
  "10c10068-0000-4000-8000-000000000007": {
    "prompt": "Solve 4(x + 1) − 3 = 2(x + 5).",
    "options": {
      "kind": "short_answer",
      "accepted": [
        "x = 9/2"
      ],
      "exact": false
    },
    "correct_index": 0,
    "explanation": "Expand: 4x+1=2x+10; subtract 2x and 1 to get 2x=9, so x=9/2."
  },
  "10c10068-0000-4000-8000-000000000008": {
    "prompt": "Solve (2x + 1)/5 = (x − 3)/2.",
    "options": {
      "kind": "short_answer",
      "accepted": [
        "x = 17"
      ],
      "exact": false
    },
    "correct_index": 0,
    "explanation": "Multiply by 10: 4x+2=5x−15; rearrange to x=17."
  },
  "10c10068-0000-4000-8000-000000000013": {
    "prompt": "Solve 7 − (2x − 3) = 4x + 1.",
    "options": {
      "kind": "short_answer",
      "accepted": [
        "x = 3/2"
      ],
      "exact": false
    },
    "correct_index": 0,
    "explanation": "Expand carefully: 10−2x=4x+1. Thus 9=6x and x=3/2."
  },
  "10c10068-0000-4000-8000-000000000018": {
    "prompt": "Solve (x + 2)/3 − (x − 1)/4 = 2.",
    "options": {
      "kind": "short_answer",
      "accepted": [
        "x = 13"
      ],
      "exact": false
    },
    "correct_index": 0,
    "explanation": "Multiply by 12: 4(x+2)−3(x−1)=24, so x+11=24 and x=13."
  },
  "10c10068-0000-4000-8000-000000000019": {
    "prompt": "A student solves 4 − 2x = 10 and reports x = 3. What sign error likely occurred?",
    "options": [
      "They added 4 to both sides twice",
      "They divided 6 by 2 without retaining the negative coefficient",
      "They multiplied rather than divided",
      "They should have squared both sides"
    ],
    "correct_index": 1,
    "explanation": "Subtract 4 to get −2x=6, then divide by −2: x=−3."
  },
  "10c10068-0000-4000-8000-000000000020": {
    "prompt": "Solve 2 − (3x − 4)/5 = 1.",
    "options": {
      "kind": "short_answer",
      "accepted": [
        "x = 3"
      ],
      "exact": false
    },
    "correct_index": 0,
    "explanation": "Subtract 2: −(3x−4)/5=−1, so 3x−4=5. Therefore 3x=9."
  },
  "10c10074-0000-4000-8000-000000000004": {
    "prompt": "Solve y = 2x + 1 and 3x + y = 16. Give x and y.",
    "options": {
      "kind": "short_answer",
      "accepted": [
        "x = 3, y = 7"
      ],
      "exact": false
    },
    "correct_index": 0,
    "explanation": "Substitute: 3x+2x+1=16, so x=3; then y=7."
  },
  "10c10074-0000-4000-8000-000000000011": {
    "prompt": "Solve x = 2y − 1 and x + 3y = 14.",
    "options": {
      "kind": "short_answer",
      "accepted": [
        "x = 5, y = 3"
      ],
      "exact": false
    },
    "correct_index": 0,
    "explanation": "Substitute: 2y−1+3y=14 gives y=3; x=5."
  },
  "10c10074-0000-4000-8000-000000000016": {
    "prompt": "Solve 2x + y = 8 and x − y = 1.",
    "options": {
      "kind": "short_answer",
      "accepted": [
        "x = 3, y = 2"
      ],
      "exact": false
    },
    "correct_index": 0,
    "explanation": "From the second equation y=x−1. Substitute: 2x+x−1=8, so x=3 and y=2."
  },
  "10c10075-0000-4000-8000-000000000004": {
    "prompt": "Solve 2x + 3y = 13 and 2x − y = 5.",
    "options": {
      "kind": "short_answer",
      "accepted": [
        "x = 7/2, y = 2"
      ],
      "exact": false
    },
    "correct_index": 0,
    "explanation": "Subtract the second equation from the first: 4y=8, so y=2. Then 2x−2=5, giving x=7/2."
  },
  "10c10075-0000-4000-8000-000000000008": {
    "prompt": "Solve 3x + 2y = 4 and 6x − 2y = 14.",
    "options": {
      "kind": "short_answer",
      "accepted": [
        "x = 2, y = −1"
      ],
      "exact": false
    },
    "correct_index": 0,
    "explanation": "Add: 9x=18, so x=2. Substitute: 6+2y=4, hence y=−1."
  },
  "10c10075-0000-4000-8000-000000000012": {
    "prompt": "Solve 4x + y = 13 and 2x − y = 2.",
    "options": {
      "kind": "short_answer",
      "accepted": [
        "x = 5/2, y = 3"
      ],
      "exact": false
    },
    "correct_index": 0,
    "explanation": "Add to get 6x=15, x=5/2. Then y=13−4x=3."
  },
  "10c10075-0000-4000-8000-000000000016": {
    "prompt": "Solve 2x − 3y = 1 and 4x + 3y = 17.",
    "options": {
      "kind": "short_answer",
      "accepted": [
        "x = 3, y = 5/3"
      ],
      "exact": false
    },
    "correct_index": 0,
    "explanation": "Add to get 6x=18, x=3. Then 6−3y=1, so y=5/3."
  },
  "10c10075-0000-4000-8000-000000000020": {
    "prompt": "Solve 5x + 2y = 1 and 3x − 4y = 19.",
    "options": {
      "kind": "short_answer",
      "accepted": [
        "x = 21/13, y = −46/13"
      ],
      "exact": false
    },
    "correct_index": 0,
    "explanation": "Multiply the first equation by −3 and the second by 5: −15x−6y=−3 and 15x−20y=95. Thus −26y=92, y=−46/13; substitution gives x=21/13."
  },
  "10c10076-0000-4000-8000-000000000004": {
    "prompt": "A number pair has sum 34 and difference 8. Find the larger and smaller numbers.",
    "options": {
      "kind": "short_answer",
      "accepted": [
        "21 and 13"
      ],
      "exact": false
    },
    "correct_index": 0,
    "explanation": "Let larger L and smaller S. L+S=34 and L−S=8; adding gives 2L=42, so L=21 and S=13."
  },
  "10c10076-0000-4000-8000-000000000008": {
    "prompt": "A jar contains 26 coins, all 20-cent or 50-cent coins. Their total value is $9.40. How many of each coin?",
    "options": {
      "kind": "short_answer",
      "accepted": [
        "12 twenty-cent coins and 14 fifty-cent coins"
      ],
      "exact": false
    },
    "correct_index": 0,
    "explanation": "Let n and f be counts. n+f=26 and 20n+50f=940. Substitute n=26−f: 520+30f=940, so f=14 and n=12."
  },
  "10c10076-0000-4000-8000-000000000016": {
    "prompt": "A set of 3 notebooks and 2 pens costs $17. A set of 2 notebooks and 5 pens costs $15. Find each price.",
    "options": {
      "kind": "short_answer",
      "accepted": [
        "Notebook $5; pen $1"
      ],
      "exact": false
    },
    "correct_index": 0,
    "explanation": "Let n,p. 3n+2p=17 and 2n+5p=15. Solving gives p=1 and n=5."
  }
};
