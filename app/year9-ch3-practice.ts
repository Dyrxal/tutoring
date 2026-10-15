import type {QuestionValues} from "./QuestionEditor";

type SeedQuestion=QuestionValues & {seed_id:string;diagram?:{asset:string;alt:string}};
// Each existing section: eight core questions followed by thirteen optional questions.
// Stable IDs protect tutor edits and make retries idempotent. 3A starters stay in place.
export const chapter3Practice:Record<string,SeedQuestion[]> = {
  "3A": [
    {
      "prompt": "A right-angled triangle has shorter sides 5 cm and 12 cm. Find its longest side.",
      "options": [
        "13 cm",
        "11 cm",
        "17 cm",
        "169 cm"
      ],
      "correct_index": 0,
      "explanation": "c² = 5² + 12² = 169, hence c = 13 cm.",
      "seed_id": "5f162b4c-30b4-5409-a18f-c69b5a175a0e"
    },
    {
      "prompt": "The shorter sides are 9 cm and 12 cm. What is the hypotenuse?",
      "options": [
        "21 cm",
        "15 cm",
        "225 cm",
        "3 cm"
      ],
      "correct_index": 1,
      "explanation": "9² + 12² = 225, so the hypotenuse is √225 = 15 cm.",
      "seed_id": "089d944f-6c60-5fe1-ac06-0e0e1814e5a3"
    },
    {
      "prompt": "Triangle PQR is right-angled at Q. Which side is the hypotenuse?",
      "options": [
        "PQ",
        "QR",
        "PR",
        "Whichever side is horizontal"
      ],
      "correct_index": 2,
      "explanation": "The hypotenuse is opposite the right angle at Q, regardless of the drawing’s orientation.",
      "seed_id": "eec2bddc-761e-5cea-83bb-077429cfb612",
      "diagram": {
        "asset": "/ch3-diagrams/3A-3.png",
        "alt": "Triangle PQR, with a right-angle square at Q. PR joins the other two vertices."
      }
    },
    {
      "prompt": "A right triangle has hypotenuse p and shorter sides q and r. Which equation is correct?",
      "options": [
        "q² = p² + r²",
        "p = q + r",
        "p² = (q + r)²",
        "p² = q² + r²"
      ],
      "correct_index": 3,
      "explanation": "Square the hypotenuse and equate it to the sum of the other two squares.",
      "seed_id": "09491d48-d3ba-56ad-ab82-3e1f9e5fa620"
    },
    {
      "prompt": "Squares on the two shorter sides of a right triangle have areas 20 cm² and 29 cm². How long is the hypotenuse in cm? Enter only the number.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "7"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "The square on the hypotenuse has area 49 cm², so its side is √49 = 7 cm. Answer: 7.",
      "seed_id": "80dcc3f0-7f54-5042-a757-98718c80d03a"
    },
    {
      "prompt": "A right triangle has legs 4 cm and 6 cm. Which is its exact hypotenuse length?",
      "options": [
        "10 cm",
        "√52 cm",
        "52 cm",
        "√20 cm"
      ],
      "correct_index": 1,
      "explanation": "The sum of squares is 16 + 36 = 52. √52 (or 2√13) is exact.",
      "seed_id": "d001d099-08b7-5ab1-b576-10409fe3a704"
    },
    {
      "prompt": "A right triangle has legs 2.4 m and 3.7 m. Find its hypotenuse in metres. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "4.41"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Use c = √(2.4² + 3.7²); retain all calculator digits until the final rounding. Answer: 4.41.",
      "seed_id": "0aa9b0ec-976d-56c8-9047-4b9742b2c376"
    },
    {
      "prompt": "Two perpendicular sides measure 0.9 m and 120 cm. Find the hypotenuse in centimetres. Enter only the number.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "150"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "Convert 0.9 m to 90 cm, then √(90² + 120²) = 150 cm. Answer: 150.",
      "seed_id": "c395a533-4039-5628-ae5f-fa2fa9cecd80"
    },
    {
      "prompt": "A square tile has side length 7 cm. Which expression gives its diagonal?",
      "options": [
        "7√2 cm",
        "14 cm",
        "49√2 cm",
        "7 cm"
      ],
      "correct_index": 0,
      "explanation": "The diagonal is √(7² + 7²) = √98 = 7√2.",
      "seed_id": "047a35a9-ee31-5d7f-92a8-657759e371c1"
    },
    {
      "prompt": "A right triangle has legs 1.5 m and 2 m. Find its perimeter in metres. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "6.00"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Its hypotenuse is √(2.25 + 4) = 2.5 m; add all three sides: 1.5 + 2 + 2.5. Answer: 6.00.",
      "seed_id": "6dad2fcf-c293-54d3-9a95-bf148bd3dde7"
    },
    {
      "prompt": "Every side of a right triangle is tripled. How does the area of the square on its hypotenuse change?",
      "options": [
        "It is multiplied by 3",
        "It stays unchanged",
        "It is multiplied by 9",
        "It is multiplied by 6"
      ],
      "correct_index": 2,
      "explanation": "Lengths scale by 3, while squared lengths scale by 3².",
      "seed_id": "8a71dd98-eb35-58cf-8624-d8ce9e2e5122"
    },
    {
      "prompt": "A student writes √(8² + 11²) = 8 + 11. What is the error?",
      "options": [
        "The two sides should be subtracted",
        "The root should be replaced by division by 2",
        "Pythagoras never uses square roots",
        "A square root cannot be distributed over a sum"
      ],
      "correct_index": 3,
      "explanation": "√(a² + b²) is not √a² + √b²; the squares must be added inside the root first.",
      "seed_id": "dc9c8ce7-1141-5058-8a88-89271859e4dc"
    },
    {
      "prompt": "Two sides of a triangle are 6 m and 10 m. No angles are known. Can its third side be found using c² = 6² + 10²?",
      "options": [
        "No; the sides must be known to meet at a right angle",
        "Yes, for every triangle",
        "Yes, because 10 is larger than 6",
        "Only if all lengths are integers"
      ],
      "correct_index": 0,
      "explanation": "Two side lengths alone do not justify treating them as perpendicular legs.",
      "seed_id": "85b7c283-bb62-5ed6-943f-ad602b4cd96f"
    },
    {
      "prompt": "A triangle has sides 16, 30 and 34 units. Is it right-angled?",
      "options": [
        "No, because 16 + 30 ≠ 34",
        "Yes, because 16² + 30² = 34²",
        "Yes, because all sides are even",
        "No, because 16² + 34² ≠ 30²"
      ],
      "correct_index": 1,
      "explanation": "256 + 900 = 1156, which equals 34². Use the longest side as the candidate hypotenuse.",
      "seed_id": "cd37cbd8-940d-5816-8a67-aaede418207c"
    },
    {
      "prompt": "A triangle has sides 6, 8 and 11 units. Which test correctly rules out a right angle?",
      "options": [
        "6 + 8 is greater than 11",
        "11 is odd",
        "6² + 8² = 100, but 11² = 121",
        "6² + 11² is greater than 8²"
      ],
      "correct_index": 2,
      "explanation": "The square of the longest side must equal the sum of the other squares.",
      "seed_id": "4e163e03-e516-5131-b966-87062b52c648"
    },
    {
      "prompt": "Without a calculator, between which consecutive whole numbers is a right triangle’s hypotenuse if its legs are 5 and 7?",
      "options": [
        "7 and 8",
        "9 and 10",
        "12 and 13",
        "8 and 9"
      ],
      "correct_index": 3,
      "explanation": "The hypotenuse is √74; 64 < 74 < 81.",
      "seed_id": "64f7b10a-f7d8-54a1-a46c-4b2efdf631a4"
    },
    {
      "prompt": "A right triangle has legs √11 cm and √14 cm. Find its hypotenuse in cm. Enter only the number.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "5"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "Squaring the legs gives 11 and 14; c = √25 = 5. Answer: 5.",
      "seed_id": "11d26857-1919-5ca6-a71c-74bb33d93f30"
    },
    {
      "prompt": "A robot moves 18 m east then 24 m north. How many metres shorter is the direct route from start to finish? Enter only the number.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "12"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "The direct distance is √(18² + 24²) = 30 m; the travelled route is 42 m, so the saving is 12 m. Answer: 12.",
      "seed_id": "7991b126-fb64-51b3-a06c-600a774b03fd"
    },
    {
      "prompt": "An altitude of 12 cm splits a triangle’s base into segments of 5 cm and 16 cm. Find the perimeter in cm. Enter only the number.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "54"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "The two sloping sides are √(12² + 5²) = 13 and √(12² + 16²) = 20. Add the full base 21. Answer: 54.",
      "seed_id": "f59284c4-6e04-5a90-8c42-3e985d78ceb6"
    },
    {
      "prompt": "A straight straw joins opposite edges of the circular ends of a cylinder, through its interior. The cylinder is 15 cm tall and 8 cm across. Find the straw length in cm. Enter only the number.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "17"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "The axial cross-section is a rectangle, so the straw length is √(15² + 8²) = 17 cm. Answer: 17.",
      "seed_id": "4ea9cddb-6793-5df6-bf80-2c04ecbef469"
    },
    {
      "prompt": "A right triangle has perpendicular sides x and 2x, with x > 0. What is its hypotenuse?",
      "options": [
        "x√5",
        "3x",
        "x√3",
        "5x"
      ],
      "correct_index": 0,
      "explanation": "c² = x² + (2x)² = 5x², so c = x√5.",
      "seed_id": "289b8bfb-0f1f-5021-8f02-087a7ae8a643"
    }
  ],
  "3B": [
    {
      "prompt": "A right triangle has hypotenuse h and legs a and b. Which gives b²?",
      "options": [
        "h² − a²",
        "a² − h²",
        "h² + a²",
        "(h − a)²"
      ],
      "correct_index": 0,
      "explanation": "Subtract a² from h² = a² + b².",
      "seed_id": "355bdcb8-7ba2-5971-b6eb-e949bb5b675a"
    },
    {
      "prompt": "The hypotenuse is 29 cm and one leg is 20 cm. Find the other leg in cm. Enter only the number.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "21"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "b = √(29² − 20²) = √441 = 21. Answer: 21.",
      "seed_id": "e1f7adb2-f1ab-5bef-94be-de71c007c558"
    },
    {
      "prompt": "A right triangle has hypotenuse 8 m and one leg 3 m. Give the other leg exactly.",
      "options": [
        "√73 m",
        "5 m",
        "√55 m",
        "55 m"
      ],
      "correct_index": 2,
      "explanation": "b² = 64 − 9 = 55; keep the root for an exact value.",
      "seed_id": "ce75b055-63be-5565-8e41-de09d80eaa0d"
    },
    {
      "prompt": "A right triangle has hypotenuse 7.5 m and one leg 4.2 m. Find the other leg in metres. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "6.21"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Subtract squared lengths before taking the square root: √(7.5² − 4.2²). Answer: 6.21.",
      "seed_id": "ea2d91e3-6be9-57bc-a818-5dee8e4a7f10"
    },
    {
      "prompt": "Triangle ABC is right-angled at B. AC = 13, AB = 5 and BC = x. Which equation finds x?",
      "options": [
        "x² = 13² − 5²",
        "x² = 13² + 5²",
        "x = 13 − 5",
        "x² = 5² − 13²"
      ],
      "correct_index": 0,
      "explanation": "AC is opposite B, so it is the hypotenuse. BC is a shorter side.",
      "seed_id": "81fef4dd-2584-5192-b18e-4a03910e5a7c",
      "diagram": {
        "asset": "/ch3-diagrams/3B-5.png",
        "alt": "Triangle ABC is right-angled at B. AB = 5, BC = x, and AC = 13."
      }
    },
    {
      "prompt": "A diagonal is 1.7 m long and the perpendicular height is 80 cm. Find the horizontal length in cm. Enter only the number.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "150"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "Convert the diagonal to 170 cm; √(170² − 80²) = 150. Answer: 150.",
      "seed_id": "5ba4aff4-14b9-5c8d-84e9-aae803840d7d"
    },
    {
      "prompt": "A right-angled isosceles triangle has hypotenuse 12 cm. What is each shorter side?",
      "options": [
        "6 cm",
        "12√2 cm",
        "6√2 cm",
        "√6 cm"
      ],
      "correct_index": 2,
      "explanation": "2x² = 144, so x² = 72 and x = 6√2.",
      "seed_id": "058366ed-7633-532f-931e-133bfdcdc960"
    },
    {
      "prompt": "A 6.5 m ladder rests against a vertical wall, with its foot 2.5 m from the wall. How high does it reach, in metres? Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "6.00"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "The ladder is the hypotenuse: h = √(6.5² − 2.5²) = 6 m. Write 6.00 for two decimal places. Answer: 6.00.",
      "seed_id": "a344e95b-cb4d-5b7e-bb63-6ca4f84f69f4"
    },
    {
      "prompt": "Solving a missing-side equation gives x² = 81. Why is the length x = 9 rather than −9?",
      "options": [
        "A physical length is positive",
        "Negative numbers cannot be squared",
        "−9 squared equals −81",
        "The theorem always adds 9"
      ],
      "correct_index": 0,
      "explanation": "Both numbers square to 81, but only the positive root represents a length.",
      "seed_id": "e62e1b52-1ed6-5ea0-adca-2ea2a5aac454"
    },
    {
      "prompt": "Can a right triangle have hypotenuse 9 cm and a shorter side 10 cm?",
      "options": [
        "Yes; the other side is 1 cm",
        "No; the hypotenuse must be longest",
        "Yes; the other side is √19 cm",
        "Only if the triangle is rotated"
      ],
      "correct_index": 1,
      "explanation": "The proposed other leg would have square 9² − 10² = −19, impossible for a real length.",
      "seed_id": "5bcefda0-b183-537d-b56b-7429138ea030"
    },
    {
      "prompt": "A right triangle with hypotenuse 10 and one leg 6 is enlarged by factor 2.5. Find the enlarged missing leg. Enter only the number.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "20"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "The original missing leg is √(100 − 36) = 8; scaling gives 8 × 2.5 = 20. Answer: 20.",
      "seed_id": "6bb203a1-bfa4-5645-918d-b65e562466fb"
    },
    {
      "prompt": "A right triangle has hypotenuse 37 cm and one leg 12 cm. Find its perimeter in cm. Enter only the number.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "84"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "The other leg is √(1369 − 144) = 35; the perimeter is 37 + 12 + 35. Answer: 84.",
      "seed_id": "a0586d73-bc19-5ef3-9fd1-5ac59c571dba"
    },
    {
      "prompt": "A right triangle has hypotenuse 26 mm and a leg of 24 mm. Find its area in mm². Enter only the number.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "120"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "The missing perpendicular leg is √(26² − 24²) = 10; area = 24 × 10 ÷ 2. Answer: 120.",
      "seed_id": "bcb56123-b112-5d9c-b446-2ea0436aa272"
    },
    {
      "prompt": "An isosceles trapezium has parallel sides 10 cm and 22 cm, and equal sloping sides of 10 cm. Find its perpendicular height in cm. Enter only the number.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "8"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "Each overhang is (22 − 10) ÷ 2 = 6 cm. The height is √(10² − 6²) = 8 cm. Answer: 8.",
      "seed_id": "2b1fa323-5f92-5fa7-baf5-25af733e33fe"
    },
    {
      "prompt": "A rectangular display is 16 cm high and its diagonal is 34 cm. Find its width in cm. Enter only the number.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "30"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "The width and height are perpendicular: √(34² − 16²) = 30. Answer: 30.",
      "seed_id": "be25146c-fd45-5b99-8a7c-573d24936c61"
    },
    {
      "prompt": "A right triangle has hypotenuse 5/4 m and one leg 3/4 m. What is its other leg?",
      "options": [
        "1/2 m",
        "2 m",
        "$\\frac{\\sqrt{34}}{4}$ m",
        "1 m"
      ],
      "correct_index": 3,
      "explanation": "The square is 25/16 − 9/16 = 1, so the positive root is 1.",
      "seed_id": "85200440-528b-503e-a913-a2a788530af7"
    },
    {
      "prompt": "The legs of a right triangle are x and 3x. Its hypotenuse is 6. Find x exactly.",
      "options": [
        "$\\frac{6}{\\sqrt{10}}$",
        "$\\frac{6}{\\sqrt{3}}$",
        "6/4",
        "6√10"
      ],
      "correct_index": 0,
      "explanation": "x² + 9x² = 36, so x² = 36/10.",
      "seed_id": "9b6124e4-0a45-5a5a-b707-344f4795fb3a"
    },
    {
      "prompt": "A right triangle has hypotenuse 3x and shorter sides x and 10. Find x exactly.",
      "options": [
        "5",
        "$\\frac{5}{\\sqrt{2}}$",
        "√10",
        "$\\frac{10}{\\sqrt{10}}$"
      ],
      "correct_index": 1,
      "explanation": "9x² = x² + 100, giving 8x² = 100.",
      "seed_id": "38f1874c-a51d-5951-b2af-41b2f602be1e"
    },
    {
      "prompt": "A rectangle has diagonal √130 cm and width 7 cm. Find its height in cm. Enter only the number.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "9"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "Use the exact square of the diagonal: h² = 130 − 49 = 81. Answer: 9.",
      "seed_id": "d161c258-cb82-50f7-9681-57f60c08d464"
    },
    {
      "prompt": "Why should an intermediate diagonal √65 stay unrounded when finding another side?",
      "options": [
        "Square roots cannot be squared",
        "Pythagoras requires integers",
        "Rounding always makes lengths larger",
        "Rounding it early can change the final rounded answer"
      ],
      "correct_index": 3,
      "explanation": "Retain the exact value or calculator memory until the final step.",
      "seed_id": "74309fb9-0960-5be8-8a08-1707b401db0d"
    },
    {
      "prompt": "A right triangle has hypotenuse 2a and one leg a, where a > 0. What is the other leg?",
      "options": [
        "a√3",
        "a",
        "3a",
        "a√5"
      ],
      "correct_index": 0,
      "explanation": "b² = (2a)² − a² = 3a².",
      "seed_id": "da8e925d-2927-573c-a406-61023a610c1e"
    }
  ],
  "3C": [
    {
      "prompt": "Two vertical posts stand on level ground, 9 m apart, with heights 4 m and 10 m. Which triangle models the straight join between their tops?",
      "options": [
        "Legs 9 m and 6 m",
        "Legs 9 m and 14 m",
        "Hypotenuse 9 m and leg 6 m",
        "Legs 4 m and 10 m"
      ],
      "correct_index": 0,
      "explanation": "The vertical separation is 10 − 4 = 6 m, not the sum of the heights.",
      "seed_id": "b4c22dd7-b6d6-5732-8254-6b84b4daab54"
    },
    {
      "prompt": "Two vertical lighting towers on level ground are 28 m apart and 15 m and 36 m tall. Find the straight distance between their tops in metres. Enter only the number.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "35"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "The vertical difference is 21 m; √(28² + 21²) = 35 m. Answer: 35.",
      "seed_id": "e724ecb7-4e1c-59b7-9d41-40388c7dd3c5"
    },
    {
      "prompt": "A straight 25 m beam joins two vertical poles 24 m apart on level ground. The taller pole is 18 m tall. Find the shorter pole’s height in metres. Enter only the number.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "11"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "The height difference is √(25² − 24²) = 7 m, so the shorter height is 18 − 7. Answer: 11.",
      "seed_id": "f0fb8cf6-8a51-550c-b9b3-5f241229f076"
    },
    {
      "prompt": "A flat rectangular panel is 2.4 m wide and has diagonal 3 m. Find its height in metres. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "1.80"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Use h = √(3² − 2.4²). Answer: 1.80.",
      "seed_id": "65bad43e-25cd-52b0-aeeb-772f1d854969"
    },
    {
      "prompt": "On a grid measured in metres, A = (−4, 2) and B = (8, 7). Find their direct distance in metres. Enter only the number.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "13"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "Horizontal change is 12 and vertical change is 5. Distance = √(12² + 5²). Answer: 13.",
      "seed_id": "52c26e19-5f5a-542e-9d64-e5c9f8b370ca"
    },
    {
      "prompt": "A garden path changes direction by 60°. Why can the two path lengths not be used directly as the legs of a right triangle?",
      "options": [
        "The path lengths must be equal",
        "The given angle is not 90°",
        "Pythagoras only works indoors",
        "Angles cannot be used with lengths"
      ],
      "correct_index": 1,
      "explanation": "Identify a genuine right triangle before applying Pythagoras.",
      "seed_id": "3479b267-37ae-508d-8826-1bf8c4edc844"
    },
    {
      "prompt": "An isosceles triangle has equal sides of 17 cm and base 16 cm. Find its perpendicular height in cm. Enter only the number.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "15"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "The altitude bisects the base into 8 cm parts, so h = √(17² − 8²). Answer: 15.",
      "seed_id": "8209008a-a88e-5419-a089-b300b74490bd",
      "diagram": {
        "asset": "/ch3-diagrams/3C-7.png",
        "alt": "Isosceles triangle, equal sides 17 cm, base 16 cm and perpendicular altitude h to the midpoint."
      }
    },
    {
      "prompt": "A survey route goes 13 m east, 9 m north and 7 m west. Find the direct distance from start to finish in metres. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "10.82"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Net eastward movement is 13 − 7 = 6 m. Use √(6² + 9²), not the full path length. Answer: 10.82.",
      "seed_id": "75b96d60-716c-55ae-8ca8-66cab8579763"
    },
    {
      "prompt": "AB is a diameter of a circle of radius 5 cm. C lies on the circle and AC = 6 cm. What is BC?",
      "options": [
        "8 cm",
        "4 cm",
        "√11 cm",
        "√136 cm"
      ],
      "correct_index": 0,
      "explanation": "Angle ACB is right; AB = 10 cm. BC = √(10² − 6²) = 8.",
      "seed_id": "f1e510a0-b419-50fe-bcb8-45b67f484be1"
    },
    {
      "prompt": "A square is inscribed in a circle of diameter 18 cm. What is the square’s side length?",
      "options": [
        "18 cm",
        "9√2 cm",
        "9 cm",
        "18√2 cm"
      ],
      "correct_index": 1,
      "explanation": "Its diagonal is 18, so 2s² = 18² and s = √162.",
      "seed_id": "aca9ca1d-7449-59c1-9d3d-da757f48b404"
    },
    {
      "prompt": "A single-slope roof rises 1.8 m over a horizontal span of 2.4 m. It extends a further 0.3 m along its slope at each end. Find the total sloping length in metres. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "3.60"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Between walls the slope is √(1.8² + 2.4²) = 3 m; add 0.6 m of sloping overhang. Answer: 3.60.",
      "seed_id": "48ff2abd-989b-5e59-a399-6a7233bb7ee3"
    },
    {
      "prompt": "Three anchors are each 15 m from a mast. Each anchor needs one straight cable to a height of 8 m and one to 20 m. Find the total cable length in metres. Enter only the number.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "126"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "Each pair needs √(15² + 8²) + √(15² + 20²) = 17 + 25 = 42 m. There are three pairs. Answer: 126.",
      "seed_id": "ed82ecb6-0347-573e-b720-db7ec7db09f9"
    },
    {
      "prompt": "Two equal 41 m beams meet above the midpoint between two equal-height supports. The meeting point is 9 m above the supports. Find the distance between supports in metres. Enter only the number.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "80"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "Each half-span is √(41² − 9²) = 40 m; double it. Answer: 80.",
      "seed_id": "8d71e4e9-557d-5a31-9196-a41189f6a26e"
    },
    {
      "prompt": "A walker goes 4 km east, then 2√2 km north-east at 45°. Find the straight distance from the start in km. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "6.32"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "The second leg adds 2 km east and 2 km north. The net displacement is 6 east and 2 north. Answer: 6.32.",
      "seed_id": "feea51ac-83bf-5efd-b27f-0921eff48952"
    },
    {
      "prompt": "A ramp joins a platform 1.2 m high to one 3.6 m high. The horizontal gap is 7 m. Find the ramp length in metres. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "7.40"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "The rise is 3.6 − 1.2 = 2.4 m; √(7² + 2.4²) = 7.4 m. Answer: 7.40.",
      "seed_id": "102fa4a0-5080-5a5a-abf2-f292398327b3"
    },
    {
      "prompt": "A rigid 2.6 m bar must lie completely inside a flat rectangular tray 1 m by 2.4 m. Ignoring thickness, will it fit?",
      "options": [
        "No; it exceeds the longest edge",
        "Yes; the perimeter is larger",
        "No; the diagonal is 2.5 m",
        "Yes; it exactly matches the diagonal"
      ],
      "correct_index": 3,
      "explanation": "The longest straight line in the rectangle is √(1² + 2.4²) = 2.6 m.",
      "seed_id": "e0574241-996c-5fc2-8829-9d6999831767"
    },
    {
      "prompt": "A square of side 14 cm is folded along a diagonal. Find the perimeter of the resulting triangle in cm. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "47.80"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "The two legs are 14 cm; the fold has length 14√2. Add 28 + 14√2 without rounding early. Answer: 47.80.",
      "seed_id": "56c854e9-50a7-5677-ae34-e1a5b2797849"
    },
    {
      "prompt": "An isosceles triangular sign is 24 cm wide and has perpendicular height 16 cm. Find its perimeter in cm. Enter only the number.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "64"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "Each sloping edge is √(12² + 16²) = 20 cm. Add 24 + 20 + 20. Answer: 64.",
      "seed_id": "cd7e71bd-e1fb-51bc-b02c-b63366f294a2"
    },
    {
      "prompt": "To use the difference of two building heights as their tops’ vertical separation, what must also be known?",
      "options": [
        "Their widths are equal",
        "Their roofs have equal area",
        "Their bases are at the same elevation and the heights are vertical",
        "Their heights are whole numbers"
      ],
      "correct_index": 2,
      "explanation": "Otherwise the change in ground level must also be included.",
      "seed_id": "40d458ce-9d6e-59b4-868d-59e549937cba"
    },
    {
      "prompt": "Two right triangles share a side d. In the first, d² = 10² + 3². In the second, d is the hypotenuse and another side is 6. What is the remaining side?",
      "options": [
        "√145",
        "√43",
        "√109 − 6",
        "√73"
      ],
      "correct_index": 3,
      "explanation": "Use d² directly: x² = 109 − 36 = 73.",
      "seed_id": "8ec5b2e2-e721-5a73-b096-d4af84629b97"
    },
    {
      "prompt": "Vertical poles have heights h and k (h > k), with bases on level ground d metres apart. Which formula gives the distance L between their tops?",
      "options": [
        "$L=\\sqrt{d^2+(h-k)^2}$",
        "$L=\\sqrt{d^2+(h+k)^2}$",
        "$L=d+h-k$",
        "$L=\\sqrt{d^2+h^2-k^2}$"
      ],
      "correct_index": 0,
      "explanation": "The perpendicular legs are d and h − k.",
      "seed_id": "633e8cc3-64cc-590d-9ab8-7d1a55b2d53b"
    }
  ],
  "3D": [
    {
      "prompt": "Which measurements form perpendicular legs for the slant height of a right circular cone?",
      "options": [
        "Its vertical height and base radius",
        "Its height and base diameter",
        "Its radius and circumference",
        "Its slant height and diameter"
      ],
      "correct_index": 0,
      "explanation": "Use the triangle through the apex, base centre and a point on the base rim.",
      "seed_id": "6043bb64-fb71-5c18-a1d6-cd788dde19a9"
    },
    {
      "prompt": "A rectangular prism has base diagonal 12 cm and vertical height 5 cm. Find its space diagonal in cm. Enter only the number.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "13"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "The base diagonal is perpendicular to the vertical height, giving √(12² + 5²). Answer: 13.",
      "seed_id": "9fdb4eec-058b-5cda-89ea-71ec493f5893"
    },
    {
      "prompt": "A box measures 4 cm by 8 cm by 9 cm. Find the distance between opposite corners in cm. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "12.69"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Square the three perpendicular dimensions: d = √(4² + 8² + 9²). Answer: 12.69.",
      "seed_id": "cc4b3eb9-ddf7-5b0b-ae47-b181f2d50db0",
      "diagram": {
        "asset": "/ch3-diagrams/3D-3.png",
        "alt": "Rectangular box with perpendicular dimensions 8 cm, 4 cm and 9 cm. The dotted line d joins opposite corners."
      }
    },
    {
      "prompt": "A right cone has height 12 cm and base diameter 10 cm. Find its slant height in cm. Enter only the number.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "13"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "The radius is 5 cm, so s = √(12² + 5²). Answer: 13.",
      "seed_id": "046c43c0-dd2b-5210-a16e-26566791e667"
    },
    {
      "prompt": "A right cone has slant height 25 mm and radius 7 mm. Find its vertical height in mm. Enter only the number.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "24"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "The slant height is the hypotenuse: h = √(25² − 7²). Answer: 24.",
      "seed_id": "637ca284-ea3c-535e-9e58-2f8aac470690"
    },
    {
      "prompt": "A cylinder is 24 cm tall with radius 5 cm. Find the longest straight rod that fits inside, in cm. Enter only the number.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "26"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "The rod spans the full diameter 10 cm, not the radius: √(24² + 10²). Answer: 26.",
      "seed_id": "cef0a2e5-d339-5c46-b289-dea84995fa6f"
    },
    {
      "prompt": "A box measures 30 cm by 0.4 m by 120 mm. Find its space diagonal in centimetres. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "51.42"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Convert dimensions to 30, 40 and 12 cm, then take √(30² + 40² + 12²). Answer: 51.42.",
      "seed_id": "e333151c-c9f6-594b-b99a-dde1f40022aa"
    },
    {
      "prompt": "What is the exact space diagonal of a cube with edge 6 cm?",
      "options": [
        "6√2 cm",
        "18 cm",
        "36√3 cm",
        "6√3 cm"
      ],
      "correct_index": 3,
      "explanation": "d² = 6² + 6² + 6² = 108.",
      "seed_id": "10c9b142-fca7-5ef4-ab16-a1b028e5ed9d"
    },
    {
      "prompt": "A rectangular prism has space diagonal 15 cm, length 10 cm and width 5 cm. Find its height in cm. Enter only the number.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "10"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "h² = 15² − 10² − 5² = 100. Answer: 10.",
      "seed_id": "184f2a7c-c954-5dd3-bb8e-678d2eb99566"
    },
    {
      "prompt": "A right square pyramid has base edge 16 cm and vertical height 15 cm. Find the slant height from the apex to the midpoint of a base edge, in cm. Enter only the number.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "17"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "The horizontal leg is half the base edge, 8 cm. The face slant height is √(15² + 8²). Answer: 17.",
      "seed_id": "c14bb9ac-8eb2-5e4b-9299-5aabc0e60520"
    },
    {
      "prompt": "A right square pyramid has base edge 10 cm and vertical height 10 cm. Find an apex-to-corner edge exactly.",
      "options": [
        "5√5 cm",
        "10√2 cm",
        "5√6 cm",
        "15 cm"
      ],
      "correct_index": 2,
      "explanation": "The base centre-to-corner distance has square 5² + 5² = 50. The slant edge is √(100 + 50).",
      "seed_id": "4763f53c-59a6-586a-9db2-4a8c4ca8166a"
    },
    {
      "prompt": "A right square pyramid has base edge 12 cm and each apex-to-corner edge √97 cm. Find its vertical height in cm. Enter only the number.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "5"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "The centre-to-corner distance squared is 6² + 6² = 72. Height squared is 97 − 72 = 25. Answer: 5.",
      "seed_id": "e75405e8-7f1b-55c1-b4a8-5d45eb291dc5"
    },
    {
      "prompt": "A hemispherical bowl has radius 13 cm. Its horizontal water surface has radius 12 cm. Find the water depth measured from the bottom, in cm. Enter only the number.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "8"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "The surface is √(13² − 12²) = 5 cm below the sphere centre. Depth = 13 − 5 = 8. Answer: 8.",
      "seed_id": "464a64be-b2fc-5a4c-81ed-6805ae3a3cff"
    },
    {
      "prompt": "A cube of edge a fits inside a sphere, with all eight vertices on the sphere. What is the sphere’s radius?",
      "options": [
        "$a\\sqrt{3}$",
        "$\\frac{a\\sqrt{3}}{2}$",
        "$\\frac{a\\sqrt{2}}{2}$",
        "$\\frac{a}{2}$"
      ],
      "correct_index": 1,
      "explanation": "The cube’s space diagonal a√3 is the sphere’s diameter.",
      "seed_id": "f0eed322-3efb-5563-863d-61062e6acb55"
    },
    {
      "prompt": "Unfolding two adjacent faces of a box produces a 9 cm by 12 cm rectangle. A surface route joins opposite corners of this rectangle. Find its length in cm. Enter only the number.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "15"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "The shortest path across this unfolded rectangle is its diagonal, √(9² + 12²). Answer: 15.",
      "seed_id": "53523769-5e21-5f79-adfb-a7fe634564fb"
    },
    {
      "prompt": "A 2 × 3 × 7 box has three unfolded routes between opposite corners. Their lengths are √74, √90 and √104. Which is shortest?",
      "options": [
        "√90",
        "√104",
        "All routes have equal length",
        "√74"
      ],
      "correct_index": 3,
      "explanation": "Compare the squared lengths; the square root function preserves the order of positive numbers.",
      "seed_id": "8d95b096-1ed4-5dba-8dd5-5ed5f483930e"
    },
    {
      "prompt": "A student adds a box’s three edge lengths to find its space diagonal. Why is that wrong?",
      "options": [
        "That gives an edge-following route, not the straight interior distance",
        "Every diagonal equals the longest edge",
        "A space diagonal uses only two dimensions",
        "Three dimensions must be multiplied"
      ],
      "correct_index": 0,
      "explanation": "For perpendicular dimensions l, w and h, the straight diagonal is √(l² + w² + h²).",
      "seed_id": "20aa1ed6-6654-5b07-bb94-fc2f172e9255"
    },
    {
      "prompt": "A rigid 16 cm rod is to fit fully inside a 4 × 8 × 12 cm box. Ignoring thickness, does it fit?",
      "options": [
        "Yes; 4 + 8 + 12 > 16",
        "No; the longest interior straight line is √224 cm, less than 16 cm",
        "Yes; 12 + 8 > 16",
        "No; all rods longer than 12 cm fail"
      ],
      "correct_index": 1,
      "explanation": "Compare squares: 224 < 256.",
      "seed_id": "67e7fb3b-518e-57f1-bd41-c37792c877dd"
    },
    {
      "prompt": "Every dimension of a prism doubles. What happens to its space diagonal?",
      "options": [
        "It quadruples",
        "It increases eightfold",
        "It doubles",
        "It stays the same"
      ],
      "correct_index": 2,
      "explanation": "d becomes √(4l² + 4w² + 4h²) = 2d.",
      "seed_id": "718cf91a-5120-5b69-8e4d-d225a7a324f7"
    },
    {
      "prompt": "A box has dimensions 3, 5 and 7. Which calculation avoids unnecessary intermediate rounding?",
      "options": [
        "√(5.8² + 7²)",
        "3 + 5 + 7",
        "√34 + 7",
        "√(3² + 5² + 7²)"
      ],
      "correct_index": 3,
      "explanation": "Use the exact squared base diagonal 34; do not replace √34 by a rounded decimal first.",
      "seed_id": "b2b7fe97-52b1-5510-bd98-6058e0c90f85"
    },
    {
      "prompt": "Two points in space differ by 2 m horizontally east, 6 m horizontally north and 9 m vertically. Find their direct distance in metres. Enter only the number.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "11"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "Their orthogonal separation gives √(2² + 6² + 9²) = √121. Answer: 11.",
      "seed_id": "37ef891b-2d8a-54cb-b839-e4cabd93fa3d"
    }
  ],
  "3E": [
    {
      "prompt": "Triangle ABC is right-angled at C. Relative to angle A, which side is opposite?",
      "options": [
        "BC",
        "AC",
        "AB",
        "Both AC and AB"
      ],
      "correct_index": 0,
      "explanation": "BC does not touch vertex A and lies across from it.",
      "seed_id": "56839c9c-f616-50b2-b7b7-98783f64a67d",
      "diagram": {
        "asset": "/ch3-diagrams/3E-1.png",
        "alt": "Triangle ABC is right-angled at C, with reference angle θ at A."
      }
    },
    {
      "prompt": "In the same right triangle (right angle C), which side is adjacent to angle A?",
      "options": [
        "AB",
        "AC",
        "BC",
        "Any side touching A"
      ],
      "correct_index": 1,
      "explanation": "AC touches angle A and is not the hypotenuse AB.",
      "seed_id": "703dd144-ed87-5e42-bd4a-a24428807a20"
    },
    {
      "prompt": "In a right triangle, the reference angle changes from one acute angle to the other. What happens to the hypotenuse?",
      "options": [
        "It becomes the opposite side",
        "It becomes the shortest side",
        "It stays the same side",
        "It switches with the adjacent side"
      ],
      "correct_index": 2,
      "explanation": "The hypotenuse is fixed by the right angle, not by the chosen acute angle.",
      "seed_id": "70367922-905f-5c6b-b548-e21c3180b31f"
    },
    {
      "prompt": "Relative to θ, a right triangle has opposite side 9 and hypotenuse 15. What is sin θ?",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "3/5"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "Sine is opposite ÷ hypotenuse: 9/15 = 3/5.",
      "seed_id": "0d5b260d-83fd-53a4-af70-777d7180ce70"
    },
    {
      "prompt": "A right triangle has adjacent side 20 and hypotenuse 29 relative to θ. What is cos θ?",
      "options": [
        "20/29",
        "29/20",
        "21/29",
        "21/20"
      ],
      "correct_index": 0,
      "explanation": "Cosine uses adjacent ÷ hypotenuse.",
      "seed_id": "e6113846-b0a1-53ee-bb21-b19fe04bb3ab"
    },
    {
      "prompt": "A right triangle has opposite side 15 and adjacent side 8 relative to θ. What is tan θ?",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "15/8"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "Tangent is opposite ÷ adjacent and may exceed 1.",
      "seed_id": "e664959f-82c1-5bc2-8cda-d7f08ce687a1"
    },
    {
      "prompt": "For t > 0, a right triangle’s opposite side is 6t and hypotenuse is 10t. Simplify sin θ.",
      "options": [
        "3t/5",
        "5/3",
        "3/5",
        "3/5t"
      ],
      "correct_index": 2,
      "explanation": "The common positive factor t cancels in 6t/(10t).",
      "seed_id": "4e2428a0-138f-5e42-b900-0e1fbb1ba9a7"
    },
    {
      "prompt": "In a right triangle, sin A = 7/25. B is the other acute angle. What is cos B?",
      "options": [
        "24/25",
        "25/7",
        "7/24",
        "7/25"
      ],
      "correct_index": 3,
      "explanation": "The side opposite A is adjacent to B; both ratios divide that side by the hypotenuse.",
      "seed_id": "cdcf9e6e-562f-502d-a67b-5c36e244b771"
    },
    {
      "prompt": "Relative to θ, the opposite and adjacent sides are 2a and 3b. Write tan θ.",
      "options": [
        "$\\frac{2a}{3b}$",
        "$\\frac{3b}{2a}$",
        "$\\frac{2}{3}$",
        "$\\frac{a}{b}$"
      ],
      "correct_index": 0,
      "explanation": "Keep the different variables; only common factors can cancel.",
      "seed_id": "9fce0684-ab8c-581d-911f-6eb08b40ec6d"
    },
    {
      "prompt": "Two right triangles have the same acute angle, but one is five times larger. How do their sine ratios compare?",
      "options": [
        "The larger triangle’s ratio is five times larger",
        "They are equal",
        "The smaller triangle’s ratio is five times larger",
        "Their ratio depends on their area"
      ],
      "correct_index": 1,
      "explanation": "Both opposite and hypotenuse scale by five, so their ratio is unchanged.",
      "seed_id": "f5cbca2d-d321-555b-ba00-f6db61955021"
    },
    {
      "prompt": "The opposite side is 30 cm and the hypotenuse is 0.5 m. What is sin θ?",
      "options": [
        "60",
        "1/60",
        "3/5",
        "1/6"
      ],
      "correct_index": 2,
      "explanation": "Convert 0.5 m to 50 cm before calculating 30/50.",
      "seed_id": "0fcd736d-2ce8-58af-bd99-42e338e585ec"
    },
    {
      "prompt": "For an acute angle in a right triangle, cos θ = 12/13. Find tan θ.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "5/12"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "Take adjacent 12 and hypotenuse 13. The opposite is √(169 − 144) = 5.",
      "seed_id": "7ea02a73-7124-548e-b4a3-5a7f46670630"
    },
    {
      "prompt": "Which condition is possible for an acute angle in a right triangle?",
      "options": [
        "tan θ = 2",
        "sin θ = 2",
        "cos θ = 2",
        "sin θ = −1"
      ],
      "correct_index": 0,
      "explanation": "The opposite leg can be twice the adjacent leg. Sine and cosine must each lie strictly between 0 and 1.",
      "seed_id": "bffd3253-30f7-5346-95a9-c38efc56fa80"
    },
    {
      "prompt": "A calculation gives sin θ = 1.4 for an acute angle in a right triangle. What does this indicate?",
      "options": [
        "θ is an especially large acute angle",
        "A side was misidentified or the data/calculation is inconsistent",
        "The triangle must be isosceles",
        "Use radians to make the ratio valid"
      ],
      "correct_index": 1,
      "explanation": "An opposite side cannot exceed the hypotenuse.",
      "seed_id": "eb052330-9593-5c48-ae05-77ff0b94fa78"
    },
    {
      "prompt": "Which ratio equals sin 38°?",
      "options": [
        "cos 38°",
        "tan 52°",
        "cos 52°",
        "sin 52°"
      ],
      "correct_index": 2,
      "explanation": "Sine of an acute angle equals cosine of its complement: 90° − 38° = 52°.",
      "seed_id": "a923462f-99b1-5b0b-9468-593be3bd28be"
    },
    {
      "prompt": "Can cos θ equal 0 when θ is an acute angle in a non-degenerate right triangle?",
      "options": [
        "Yes, whenever the legs are equal",
        "Yes, at θ = 45°",
        "Yes, if the triangle is very small",
        "No; both the adjacent side and hypotenuse are positive"
      ],
      "correct_index": 3,
      "explanation": "Cos θ = 0 corresponds to a 90° boundary angle, not an acute angle.",
      "seed_id": "4dbc7519-29d0-51f1-a455-85f0bacfd2ad"
    },
    {
      "prompt": "A right triangle has two equal legs. What is tan of either acute angle?",
      "options": [
        "1",
        "0",
        "1/2",
        "√2"
      ],
      "correct_index": 0,
      "explanation": "Opposite ÷ adjacent = 1 when the legs are equal.",
      "seed_id": "f6374e7f-9a00-5cbb-808a-10f6090f9583"
    },
    {
      "prompt": "Relative to θ, the opposite side is √3 and the hypotenuse is 2. What is sin θ?",
      "options": [
        "$\\frac{2}{\\sqrt{3}}$",
        "$\\frac{\\sqrt{3}}{2}$",
        "$\\frac{1}{2}$",
        "$\\frac{3}{2}$"
      ],
      "correct_index": 1,
      "explanation": "Divide the given opposite length by the hypotenuse.",
      "seed_id": "6a9ea337-76a4-5b2b-b231-19ff06501aa6"
    },
    {
      "prompt": "A vertical sculpture 8 m high casts a 14 m shadow on level ground. Which ratio describes the angle θ of sunlight above the ground?",
      "options": [
        "sin θ = 4/7",
        "cos θ = 4/7",
        "tan θ = 4/7",
        "tan θ = 7/4"
      ],
      "correct_index": 2,
      "explanation": "The height is opposite and shadow is adjacent, so tan θ = 8/14.",
      "seed_id": "cfac4e9a-9c8a-5b8f-9e81-fad1fa452fe4"
    },
    {
      "prompt": "A right triangle has sin θ = 8/17 and cos θ = 15/17. What is sin²θ + cos²θ?",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "1"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "(64 + 225)/289 = 289/289 = 1, reflecting Pythagoras’ theorem.",
      "seed_id": "5414534e-12ea-50d9-bb54-13595a876df1"
    },
    {
      "prompt": "A right-triangle diagram is rotated 180° without changing its labels. Do the ratios for its labelled angle θ change?",
      "options": [
        "No; the side relationships and lengths are unchanged",
        "Yes; sine becomes negative",
        "Yes; sine and cosine always swap",
        "Yes; tangent becomes its reciprocal"
      ],
      "correct_index": 0,
      "explanation": "Opposite and adjacent refer to the labelled angle, not to directions on the page.",
      "seed_id": "f2bd392b-e9c5-5418-84c2-2bc63f103ee9"
    }
  ],
  "3F": [
    {
      "prompt": "In degree mode, evaluate sin 32°. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "0.53"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Use the sine key with the calculator set to degrees, then round once. Answer: 0.53.",
      "seed_id": "a6423952-5852-554f-8226-7d582c156869"
    },
    {
      "prompt": "Evaluate cos 61.5° in degree mode. Enter only the number, to 3 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "0.477"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Enter the decimal angle as 61.5 degrees, not 61 degrees 5 minutes. Answer: 0.477.",
      "seed_id": "dfd655b4-0d97-583c-a5fd-b88c093c9f1f"
    },
    {
      "prompt": "Which is a sensible value for tan 68°?",
      "options": [
        "About −2.48",
        "Exactly 0.68",
        "About 2.48",
        "It is impossible because the value exceeds 1"
      ],
      "correct_index": 2,
      "explanation": "Tangent can exceed 1 when the opposite leg is longer than the adjacent leg.",
      "seed_id": "219d4003-8657-538d-be96-d0c50c4cdc38"
    },
    {
      "prompt": "Rearrange sin 27° = x/9 to make x the subject.",
      "options": [
        "x = 9/sin 27°",
        "x = sin 27°/9",
        "x = sin⁻¹(9/27)",
        "x = 9 sin 27°"
      ],
      "correct_index": 3,
      "explanation": "Multiply both sides by 9.",
      "seed_id": "6487c440-e567-56df-b94e-53dea0d1959a"
    },
    {
      "prompt": "A right triangle has hypotenuse 14 cm and an acute angle of 33°. Find the side opposite this angle in cm. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "7.62"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Opposite = hypotenuse × sine: 14 sin 33°. Answer: 7.62.",
      "seed_id": "665d5d55-0292-5597-873a-41d65f508d17",
      "diagram": {
        "asset": "/ch3-diagrams/3F-5.png",
        "alt": "Right triangle, hypotenuse 14 cm, reference angle 33°, and opposite side x."
      }
    },
    {
      "prompt": "A right triangle has hypotenuse 18 mm and angle 56°. Find the adjacent leg in mm. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "10.07"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Adjacent = hypotenuse × cosine: 18 cos 56°. Answer: 10.07.",
      "seed_id": "cef6ade5-7cb7-5ff0-82e9-630326156325"
    },
    {
      "prompt": "Relative to a 37° angle, the adjacent leg is 9 m. Find the opposite leg in metres. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "6.78"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Use O/A = tan 37°, so O = 9 tan 37°. Answer: 6.78.",
      "seed_id": "af4aaaca-6275-545a-b5e5-6a1bbd50b18b"
    },
    {
      "prompt": "Triangle ABC is right-angled at C, with A = 28° and AB = 11. Which two expressions both give AC?",
      "options": [
        "11 sin 28° and 11 cos 62°",
        "11 tan 28° and 11 sin 62°",
        "11 cos 28° and 11 cos 62°",
        "11 cos 28° and 11 sin 62°"
      ],
      "correct_index": 3,
      "explanation": "AC is adjacent to A and opposite the complementary angle B = 62°.",
      "seed_id": "7283c34e-03e0-5e38-8f8c-2d898304e64a"
    },
    {
      "prompt": "A wheelchair travels 7.8 m along a straight ramp inclined 9° above horizontal. Find its vertical rise in metres. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "1.22"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "The travelled distance is the hypotenuse, so rise = 7.8 sin 9°. Answer: 1.22.",
      "seed_id": "f3f9790f-78c5-5ede-a181-bc7aa0cd31a8"
    },
    {
      "prompt": "A taut 16 m tether makes an angle of 23° with a vertical mast. Find the vertical separation of its endpoints in metres. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "14.73"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "The angle is measured from vertical, so the vertical component is adjacent: 16 cos 23°. Answer: 14.73.",
      "seed_id": "48b869f5-6ca6-56c8-bfbc-8c4cfdb58e5e"
    },
    {
      "prompt": "A support beam is 0.75 m long and slopes 41° above horizontal. Find its horizontal reach in centimetres. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "56.60"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Convert to 75 cm and calculate the adjacent component 75 cos 41°. Answer: 56.60.",
      "seed_id": "89e37ece-d7c6-5296-928c-eecbfe8a7ac5"
    },
    {
      "prompt": "An isosceles triangle has equal sides of 9 cm and base angles of 58°. Find its full base in cm. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "9.54"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Splitting it down the middle gives half-base 9 cos 58°. Double this result. Answer: 9.54.",
      "seed_id": "1c72129b-dfe4-59a3-8e20-406666199a9b"
    },
    {
      "prompt": "An isosceles triangle has equal sides of 11 cm and included apex angle 110°. Find its base in cm. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "18.02"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "The altitude bisects the 110° angle, giving half-base 11 sin 55°. Answer: 18.02.",
      "seed_id": "cd9df50e-0170-5804-9f04-e8989b12bf83"
    },
    {
      "prompt": "A right triangle has hypotenuse 10 cm and acute angle 31°. Find its area in cm². Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "22.07"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "The legs are 10 sin 31° and 10 cos 31°. Multiply them and divide by 2. Answer: 22.07.",
      "seed_id": "1f807326-1cfb-552d-91b5-d3ef85b19c76"
    },
    {
      "prompt": "A right triangle has hypotenuse 12 cm and an acute angle of 40°. Find its perimeter in cm. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "28.91"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Add the hypotenuse and both legs: 12 + 12 sin 40° + 12 cos 40°. Answer: 28.91.",
      "seed_id": "8f3a9999-5eae-51e4-9ccd-27fca7e06ca4"
    },
    {
      "prompt": "Two right triangles share hypotenuse length 20. Their marked acute angles are 24° and 64°. Which has the longer opposite side?",
      "options": [
        "The triangle with the 24° angle",
        "They have equal opposite sides",
        "There is insufficient information",
        "The triangle with the 64° angle"
      ],
      "correct_index": 3,
      "explanation": "For a fixed hypotenuse, the opposite side grows as the acute angle grows.",
      "seed_id": "f8da0e7c-4316-516e-bc7c-72018bdd8dea"
    },
    {
      "prompt": "To solve x = 8 cos 36°, a student uses cos⁻¹(36). Why is this wrong?",
      "options": [
        "The angle is already known; cosine gives the side ratio",
        "The student should use cos⁻¹(8)",
        "All cosine answers are angles",
        "36 must first be squared"
      ],
      "correct_index": 0,
      "explanation": "Inverse cosine finds an angle from a ratio, not a length from an angle.",
      "seed_id": "3ca84de2-71ed-5503-989a-d64021bf05a3"
    },
    {
      "prompt": "A 2 m laser path makes an angle of 1.2° above horizontal. Find its vertical rise in metres. Enter only the number, to 3 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "0.042"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Rise = 2 sin 1.2°. A small angle gives a small rise; keep three decimal places. Answer: 0.042.",
      "seed_id": "ff4269e8-4213-563c-baad-463526728d78"
    },
    {
      "prompt": "A right triangle has hypotenuse 14 cm and angle 45°. What is the exact opposite side?",
      "options": [
        "7 cm",
        "14√2 cm",
        "7√2 cm",
        "√7 cm"
      ],
      "correct_index": 2,
      "explanation": "14 sin 45° = 14/√2 = 7√2.",
      "seed_id": "925d4c90-7a14-5195-9c58-e5e985e0daf6"
    },
    {
      "prompt": "A 10 m diagonal makes 35° with horizontal. Which pair gives its horizontal and vertical components, in that order?",
      "options": [
        "10 sin 35°, 10 cos 35°",
        "10 tan 35°, 10 cos 35°",
        "10/cos 35°, 10/sin 35°",
        "10 cos 35°, 10 sin 35°"
      ],
      "correct_index": 3,
      "explanation": "The horizontal component is adjacent; the vertical component is opposite.",
      "seed_id": "5cc441e1-4fa2-5692-a549-e11c1f489b90"
    },
    {
      "prompt": "A ramp’s angle is unchanged and its length is multiplied by 1.5. What happens to its vertical rise?",
      "options": [
        "It is multiplied by 1.5",
        "It is multiplied by 2.25",
        "It is unchanged",
        "Its angle also increases by 1.5"
      ],
      "correct_index": 0,
      "explanation": "The sine ratio is unchanged, and rise = length × sin(angle).",
      "seed_id": "779fbc68-df70-50bf-9693-41a84ec2edf5"
    }
  ],
  "3G": [
    {
      "prompt": "Solve 18/x = 3 for positive x. Enter only the number.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "6"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "Multiply by x and divide by 3: 18 = 3x, so x = 6. Answer: 6.",
      "seed_id": "d8b5c6e6-5a0f-51b8-99e4-b102e3029634"
    },
    {
      "prompt": "A right triangle has angle 47° and adjacent leg 9 cm. Find its hypotenuse in cm. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "13.20"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "cos 47° = 9/h, so h = 9/cos 47°. Answer: 13.20.",
      "seed_id": "0a06d8df-a7f0-57d0-9eb7-255389ab6704"
    },
    {
      "prompt": "A right triangle has angle 52° and opposite side 11 mm. Find its hypotenuse in mm. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "13.96"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "sin 52° = 11/h, so h = 11/sin 52°. Answer: 13.96.",
      "seed_id": "32646a44-36c0-58c7-bef3-952989a8eff6",
      "diagram": {
        "asset": "/ch3-diagrams/3G-3.png",
        "alt": "Right triangle with reference angle 52°, opposite leg 11 mm and hypotenuse h."
      }
    },
    {
      "prompt": "Relative to a 63° angle, the opposite leg is 14 m. Find the adjacent leg in metres. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "7.13"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "tan 63° = 14/a, giving a = 14/tan 63°. Answer: 7.13.",
      "seed_id": "233e7ba0-0664-5b58-9939-311cd05edf36"
    },
    {
      "prompt": "Which expression solves cos 26° = 7/x?",
      "options": [
        "7/cos 26°",
        "7 cos 26°",
        "cos 26°/7",
        "cos⁻¹(7)"
      ],
      "correct_index": 0,
      "explanation": "The unknown is in the denominator; multiply by x, then divide by cos 26°.",
      "seed_id": "8762c679-7b0f-52d9-81be-754ae15dc4a5"
    },
    {
      "prompt": "In a right triangle, A = 19°, the side opposite A is 6 and the hypotenuse is h. Which pair both gives h?",
      "options": [
        "6 sin 19° and 6 cos 71°",
        "6/sin 19° and 6/cos 71°",
        "6/cos 19° and 6/sin 71°",
        "6/tan 19° and 6/tan 71°"
      ],
      "correct_index": 1,
      "explanation": "The other acute angle is 71°, and the given side is adjacent to it.",
      "seed_id": "950cf3ed-8580-5a84-95b5-1bda62408fcc"
    },
    {
      "prompt": "Solve sin 30° = 4/x. Give x to two decimal places. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "8.00"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Since sin 30° = 0.5, x = 4/0.5 = 8. The requested written form is 8.00. Answer: 8.00.",
      "seed_id": "f77f393e-617d-557b-b899-d1cc1bdec084"
    },
    {
      "prompt": "A right triangle’s opposite side doubles while its acute angle stays fixed. What happens to h = O/sin θ?",
      "options": [
        "h halves",
        "h quadruples",
        "h stays unchanged",
        "h doubles"
      ],
      "correct_index": 3,
      "explanation": "The sine value is fixed, so doubling the numerator doubles the quotient.",
      "seed_id": "5db6d30b-6f18-5203-a292-1e457f2e5cd5"
    },
    {
      "prompt": "A kite is 32 m above level ground. Its taut string starts 2 m above ground and rises at 48° to horizontal. Find the string length in metres. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "40.37"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Use vertical separation 32 − 2 = 30 m, then length = 30/sin 48°. Answer: 40.37.",
      "seed_id": "92f71c89-77e7-518e-8a31-6bb52f521905"
    },
    {
      "prompt": "A glider loses 650 m of altitude along a straight descent at 7° below horizontal. Find its flight-path length, to the nearest metre. Enter only the whole number.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "5334"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "The lost altitude is opposite the 7° angle: distance = 650/sin 7°. Answer: 5334.",
      "seed_id": "a8a17abc-c3d3-5f05-ab99-ff61556981e5"
    },
    {
      "prompt": "A symmetric roof spans 8.4 m horizontally between equal-height walls. Each sloping half makes 32° with horizontal. Find one sloping half-length in metres, excluding overhang. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "4.95"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Half the horizontal span is 4.2 m. The rafter length is 4.2/cos 32°. Answer: 4.95.",
      "seed_id": "0a5a8327-6177-5025-a440-4493a9ea6c32"
    },
    {
      "prompt": "A right triangle has opposite leg 7 cm relative to angle 34°. Find its perimeter in cm. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "29.90"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "The adjacent side is 7/tan 34° and the hypotenuse is 7/sin 34°; add all three. Answer: 29.90.",
      "seed_id": "9998c37f-cc3b-5a8a-afe1-522080b39a83"
    },
    {
      "prompt": "A kite stays at a fixed height above its anchor. As its string angle above horizontal decreases from 50° to 20°, what happens to the required taut string length?",
      "options": [
        "It increases",
        "It decreases",
        "It stays fixed",
        "It becomes negative"
      ],
      "correct_index": 0,
      "explanation": "Length = height/sin θ. A smaller positive sine in the denominator gives a larger length.",
      "seed_id": "02817046-085b-5fc0-a5e9-6b27a75929dc"
    },
    {
      "prompt": "If tan θ = 3 and the opposite leg is 12, which adjacent length is correct?",
      "options": [
        "36",
        "4",
        "9",
        "15"
      ],
      "correct_index": 1,
      "explanation": "A = 12/3 = 4. The adjacent leg can be shorter than the opposite leg.",
      "seed_id": "ba725aa6-3fa6-53bf-b574-b3f3db7ee97c"
    },
    {
      "prompt": "A right triangle has opposite side 450 mm and angle 38°. Find its hypotenuse in metres. Enter only the number, to 3 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "0.731"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Convert 450 mm to 0.45 m; divide by sin 38°. Answer: 0.731.",
      "seed_id": "06f63008-c6e8-55b9-9cb0-6c5f425cffd9"
    },
    {
      "prompt": "From x cos 42° = 13, a student writes x = cos 42°/13. How should it be corrected?",
      "options": [
        "x = 13 cos 42°",
        "x = 13 − cos 42°",
        "x = cos⁻¹(13/42)",
        "x = 13/cos 42°"
      ],
      "correct_index": 3,
      "explanation": "Divide both sides by cos 42°, preserving the order of the quotient.",
      "seed_id": "b05a98dd-df1f-5817-982d-22d81680791a"
    },
    {
      "prompt": "To find 8/sin 17°, should sin 17° be rounded to 0.29 before division?",
      "options": [
        "No; keep the calculator’s full value until the final answer",
        "Yes; two decimals in the ratio guarantees two correct decimals in the answer",
        "Yes; all trig ratios must use two decimals",
        "No; sine values must be integers"
      ],
      "correct_index": 0,
      "explanation": "Premature rounding of a denominator can noticeably change the quotient.",
      "seed_id": "4584a5fb-9a12-5ed5-a422-6b48136289a6"
    },
    {
      "prompt": "A right triangle has opposite leg 6 cm relative to angle 29°. Find its area in cm². Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "32.47"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Adjacent = 6/tan 29°. Area = ½ × 6 × (6/tan 29°). Answer: 32.47.",
      "seed_id": "c06bf7ae-5dc3-57e8-a6cb-8e2ef5fa26b0"
    },
    {
      "prompt": "For an acute angle, which expression equals sin θ/cos θ?",
      "options": [
        "1/tan θ",
        "sin θ × cos θ",
        "tan θ",
        "1"
      ],
      "correct_index": 2,
      "explanation": "(O/H)/(A/H) simplifies to O/A.",
      "seed_id": "dd0fbfa4-ecbd-5189-a000-786df72c6e74"
    },
    {
      "prompt": "A hypotenuse calculation uses 9/cos 40°. Which result can be rejected without calculating?",
      "options": [
        "11.7",
        "11.75",
        "11.8",
        "6.9"
      ],
      "correct_index": 3,
      "explanation": "For an acute angle, 0 < cos 40° < 1, so dividing 9 by it gives more than 9.",
      "seed_id": "25957654-022e-582c-aecc-d36c16288cae"
    },
    {
      "prompt": "A right triangle has opposite leg 5 m and angle 36°. A horizontal strip covers the adjacent leg and extends 1.2 m beyond it. Find the strip length in metres. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "8.08"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "First find the adjacent leg 5/tan 36°, then add the separate 1.2 m extension. Answer: 8.08.",
      "seed_id": "4f877419-cf76-5d1c-85a9-3d99ed7f34a9"
    }
  ],
  "3H": [
    {
      "prompt": "A right triangle has opposite side 7 and hypotenuse 16 relative to θ. Which calculation finds θ?",
      "options": [
        "$\\sin^{-1}(7/16)$",
        "$\\sin(7/16)$",
        "$\\cos^{-1}(7/16)$",
        "$\\sin^{-1}(16/7)$"
      ],
      "correct_index": 0,
      "explanation": "Use inverse sine because the known sides are opposite and hypotenuse.",
      "seed_id": "ab75f8a9-b04f-53dd-a69d-4276604060c2"
    },
    {
      "prompt": "In degree mode, solve sin θ = 0.62 for an acute angle θ. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "38.32"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Use θ = sin⁻¹(0.62). Answer: 38.32.",
      "seed_id": "ae4ef61f-0b9f-5735-9514-56e2036f62b8"
    },
    {
      "prompt": "Solve cos θ = 5/8 for an acute angle θ, in degrees. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "51.32"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Use θ = cos⁻¹(5/8), keeping the fraction unrounded. Answer: 51.32.",
      "seed_id": "378e947a-44df-57f9-baf5-d6a63b0f013e"
    },
    {
      "prompt": "Solve tan θ = 2.4 for an acute angle θ, in degrees. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "67.38"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "A tangent ratio above 1 gives an angle above 45°, not an error. Answer: 67.38.",
      "seed_id": "27368baf-b8db-5ea0-a74a-bffc76e4fe26"
    },
    {
      "prompt": "Triangle XYZ is right-angled at Y. XY = 8 cm and YZ = 15 cm. Find angle X in degrees. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "61.93"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Relative to X, YZ is opposite and XY adjacent, so X = tan⁻¹(15/8). Answer: 61.93.",
      "seed_id": "c2e4f141-b849-5857-a6be-b52775b140b8",
      "diagram": {
        "asset": "/ch3-diagrams/3H-5.png",
        "alt": "Triangle XYZ is right-angled at Y. XY = 8 cm and YZ = 15 cm, with unknown angle θ at X."
      }
    },
    {
      "prompt": "A right triangle has an opposite side of 40 cm and hypotenuse 0.9 m. Find the reference angle in degrees. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "26.39"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Convert 0.9 m to 90 cm, then use sin⁻¹(40/90). Answer: 26.39.",
      "seed_id": "301343b7-c76e-5e45-85a1-cd1fb9d27a9e"
    },
    {
      "prompt": "A right triangle has adjacent leg 11 and hypotenuse 18. Find the reference angle to the nearest degree. Enter only the whole number.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "52"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Use cos⁻¹(11/18), then round the angle rather than the ratio. Answer: 52.",
      "seed_id": "1e15bdca-90fa-5141-aa44-180c16661cd5"
    },
    {
      "prompt": "One acute angle of a right triangle is sin⁻¹(0.3). Find the other acute angle in degrees. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "72.54"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Acute angles in a right triangle sum to 90°; subtract the unrounded inverse-sine result. Answer: 72.54.",
      "seed_id": "64a75877-6e75-56d4-9a4a-0d11141b728f"
    },
    {
      "prompt": "What does sin⁻¹(0.7) mean in an angle calculation?",
      "options": [
        "The angle whose sine is 0.7",
        "1 divided by sin(0.7)",
        "sin(−0.7)",
        "The negative of sin(0.7)"
      ],
      "correct_index": 0,
      "explanation": "The −1 denotes an inverse function here, not the reciprocal 1/sin(0.7).",
      "seed_id": "2bf8d84d-9019-5b8d-913f-d02facdc0b77"
    },
    {
      "prompt": "A right triangle has opposite leg 4 and adjacent leg 9. A student uses tan⁻¹(9/4). What angle have they found?",
      "options": [
        "The requested angle",
        "The other acute angle",
        "The right angle",
        "An impossible angle"
      ],
      "correct_index": 1,
      "explanation": "They swapped opposite and adjacent, obtaining the complement of the requested angle.",
      "seed_id": "89f1a49a-5300-5ed7-b347-458ac75455fc"
    },
    {
      "prompt": "A calculator gives about 0.524 for sin⁻¹(0.5), but the answer is required in degrees. What should you change?",
      "options": [
        "Multiply the side ratio by 100",
        "Use the reciprocal of 0.5",
        "Set the angle mode to degrees",
        "Round 0.524 to 1°"
      ],
      "correct_index": 2,
      "explanation": "0.524 is approximately the radian value; in degrees the angle is 30°.",
      "seed_id": "654c9884-98fa-54f5-bef0-d9f05d1426b7"
    },
    {
      "prompt": "A right triangle has legs 7 cm and 10 cm. At the acute angle opposite the 7 cm side, an exterior angle is formed by extending the adjacent side. Find this exterior angle in degrees. Enter only the number, to 1 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "145.0"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "The interior angle is tan⁻¹(7/10). Its straight-line exterior angle is 180° minus that angle. Answer: 145.0.",
      "seed_id": "721ddf4f-a922-5370-8782-02fcacb60591"
    },
    {
      "prompt": "An isosceles triangle has equal sides 13 cm and base 10 cm. Find a base angle in degrees. Enter only the number, to 1 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "67.4"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "The altitude halves the base to 5 cm; cos(base angle) = 5/13. Answer: 67.4.",
      "seed_id": "e9e5f2b7-6d1c-558b-b82a-f132e654aaef"
    },
    {
      "prompt": "A rectangle is 18 cm wide and 7 cm high. Find the angle its diagonal makes with its horizontal width, in degrees. Enter only the number, to 1 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "21.3"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "The height is opposite and width adjacent, so use tan⁻¹(7/18). Answer: 21.3.",
      "seed_id": "eb21f7b7-cef5-55fa-8149-9e2a9082c0dc"
    },
    {
      "prompt": "A path rises 2 m for every 15 m measured horizontally. Find its angle above horizontal in degrees. Enter only the number, to 1 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "7.6"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Gradient is rise/run = tan θ, not sine. Answer: 7.6.",
      "seed_id": "cf8c9854-28d0-5bae-9f7c-46a5d5b7cf3d"
    },
    {
      "prompt": "A vertical sign extends from 2 m to 5 m above an observer’s eye level. The observer is 8 m horizontally away. Find the angle between the two lines of sight, in degrees. Enter only the number, to 1 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "18.0"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Find both elevation angles, then subtract: tan⁻¹(5/8) − tan⁻¹(2/8). Answer: 18.0.",
      "seed_id": "b3cfeda0-c179-5140-9d46-b54febca2ea0"
    },
    {
      "prompt": "A vertical segment AB is 6 m high. C is 8 m horizontally from A at A’s level, and M is the midpoint of AB. Is angle ACM half of angle ACB?",
      "options": [
        "No; tan⁻¹(3/8) is not half of tan⁻¹(6/8)",
        "Yes; midpoint always means angle bisector",
        "Yes; both triangles share C",
        "No; ACM must be larger than ACB"
      ],
      "correct_index": 0,
      "explanation": "Halving an opposite side does not halve the angle because tangent is not linear.",
      "seed_id": "95bc7e48-815d-5d91-a637-d8aabebd6992"
    },
    {
      "prompt": "Slope P rises 5 m over 12 m horizontally. Slope Q rises 7 m over 20 m horizontally. Which is steeper?",
      "options": [
        "Q, because it rises more metres",
        "P",
        "They are equally steep",
        "The hypotenuses must be known first"
      ],
      "correct_index": 1,
      "explanation": "Compare tan θ: 5/12 ≈ 0.417 exceeds 7/20 = 0.35.",
      "seed_id": "d40070ab-6bf8-5049-9801-05a420933c6a"
    },
    {
      "prompt": "For an acute angle θ, sin θ = cos θ. Find θ in degrees. Enter only the number.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "45"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "Equal sine and cosine mean equal opposite and adjacent legs, giving an isosceles right triangle. Answer: 45.",
      "seed_id": "6cc51f2a-ac0e-512d-8d93-8ec9c003e78b"
    },
    {
      "prompt": "A right triangle has legs 20 and 21 and hypotenuse 29. What are all its angles, rounded to whole degrees?",
      "options": [
        "20°, 21°, 139°",
        "45°, 45°, 90°",
        "40°, 50°, 90°",
        "44°, 46°, 90°"
      ],
      "correct_index": 3,
      "explanation": "tan⁻¹(20/21) ≈ 43.60°; its complement is 46.40°.",
      "seed_id": "aae6a2a2-65c3-590c-93d6-b2e42143677a"
    },
    {
      "prompt": "An observer’s eye is level with the bottom of a tall sign. As their positive horizontal distance to it approaches zero, what happens to the angle to its top?",
      "options": [
        "It approaches 90° from below",
        "It approaches 0°",
        "It approaches 180°",
        "It stays constant"
      ],
      "correct_index": 0,
      "explanation": "tan θ = height/distance grows without bound, so θ approaches but does not exceed 90°.",
      "seed_id": "1cc0d59b-0592-54c4-a103-6d8a3c736564"
    }
  ],
  "3I": [
    {
      "prompt": "An angle of elevation is measured between a line of sight and which reference?",
      "options": [
        "The horizontal through the observer",
        "The vertical through the observer",
        "The object’s top edge",
        "Any nearby sloping surface"
      ],
      "correct_index": 0,
      "explanation": "It is measured upward from horizontal, not from vertical or from the ground’s slope.",
      "seed_id": "f3fc1359-2cb4-51f6-a047-0c02ff6c6a57"
    },
    {
      "prompt": "A camera looks down at a marker with an angle of depression of 28°. What is the marker’s angle of elevation to the camera, assuming parallel horizontals?",
      "options": [
        "62°",
        "28°",
        "152°",
        "90°"
      ],
      "correct_index": 1,
      "explanation": "The line of sight is a transversal of parallel horizontals, so alternate angles are equal.",
      "seed_id": "76e05596-92f5-53ad-a8ca-789193e83691"
    },
    {
      "prompt": "A sensor at ground level is 45 m horizontally from a vertical antenna. The top has elevation 31°. Find the antenna height in metres. Enter only the number, to 1 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "27.0"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Height is opposite and horizontal distance adjacent: h = 45 tan 31°. Answer: 27.0.",
      "seed_id": "a7d63860-f558-5200-b973-5ad7720c3af1"
    },
    {
      "prompt": "A light is 22 m above a level plaza. From ground level its elevation is 39°. Find the horizontal distance to the point directly below it, in metres. Enter only the number, to 1 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "27.2"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "tan 39° = 22/d, so d = 22/tan 39°. Answer: 27.2.",
      "seed_id": "61c61f5a-04cc-5c3d-82c4-622956ec915f"
    },
    {
      "prompt": "A cliff camera is 54 m above the sea and a buoy is 120 m horizontally from the cliff. Find the angle of depression in degrees. Enter only the number, to 1 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "24.2"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Use the equal elevation angle: tan θ = 54/120. Answer: 24.2.",
      "seed_id": "da0d7513-16dc-5c01-be4c-edfee57810ff"
    },
    {
      "prompt": "An observer’s eyes are 1.6 m above level ground, 24 m horizontally from a tree. The top’s elevation is 42°. Find the tree’s total height in metres. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "23.21"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "The trig triangle gives height above eye level; add 1.6 m afterwards. Answer: 23.21.",
      "seed_id": "b96943d1-351c-5a5d-a3b7-be84dd88225b",
      "diagram": {
        "asset": "/ch3-diagrams/3I-6.png",
        "alt": "Observer at eye height 1.6 m, horizontally 24 m from a tree; the line of sight to the top is 42° above eye-level horizontal."
      }
    },
    {
      "prompt": "Two platform tops are 5.4 m and 14.1 m above the same level ground and 26 m horizontally apart. Find the elevation of the higher top from the lower, in degrees. Enter only the number, to 1 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "18.5"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "The vertical separation is 14.1 − 5.4 = 8.7 m, so use tan⁻¹(8.7/26). Answer: 18.5.",
      "seed_id": "aa24fdc8-d22a-5067-bfee-972a1fd5426c"
    },
    {
      "prompt": "A drone starts at altitude 80 m and climbs at 14° above horizontal. A ridge 600 m horizontally ahead is 220 m high. Will the straight flight path clear it?",
      "options": [
        "No; its altitude is about 149.60 m",
        "Yes; its altitude is 680 m",
        "No; use 600 sin 14° as the altitude",
        "Yes; the predicted altitude is about 229.60 m"
      ],
      "correct_index": 3,
      "explanation": "Altitude = 80 + 600 tan 14° ≈ 229.60 m, roughly 9.60 m above the ridge.",
      "seed_id": "21bc3eac-2258-58a5-8d39-8d57cb7e74c6"
    },
    {
      "prompt": "A spotlight’s beam to a ground marker is 35 m long and slopes 24° below horizontal. Find the marker’s horizontal distance from the light in metres. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "31.97"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "The beam is the hypotenuse, so horizontal distance = 35 cos 24°. Answer: 31.97.",
      "seed_id": "353d5658-4c52-5033-8df1-ddf1f40178a1"
    },
    {
      "prompt": "A symmetric roof spans 9 m between walls and has 0.4 m of horizontal eave overhang on each side. Its pitch is 27°. Find one sloping roof half-length in metres. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "5.50"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Half the horizontal run is 9/2 + 0.4 = 4.9 m. Divide by cos 27°. Answer: 5.50.",
      "seed_id": "b7c23413-c6d1-50b4-ae3a-fbfd524185ff"
    },
    {
      "prompt": "A swing hangs on 2.8 m chains. Its seat is 0.45 m above ground at rest. At 35° from vertical, find the seat height above ground in metres. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "0.96"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "The seat rises by 2.8 − 2.8 cos 35°. Add the resting height. Answer: 0.96.",
      "seed_id": "6e890d8a-261d-52e2-892c-6166b8fee3d2"
    },
    {
      "prompt": "An underwater robot starts 18 m below the surface and descends 160 m horizontally at 8° below horizontal. Find its final depth in metres. Enter only the number, to 1 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "40.5"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "The extra depth is 160 tan 8°; add the initial depth of 18 m. Answer: 40.5.",
      "seed_id": "7ee1a2d0-c6e7-59bf-bd12-d4eeb555c830"
    },
    {
      "prompt": "A model aircraft climbs along a straight path at 72 km/h for 5 minutes, at 18° above horizontal. Find its height gain in km. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "1.85"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Path length = 72 × 5/60 = 6 km. Height gain = 6 sin 18°. Answer: 1.85.",
      "seed_id": "c1e669d5-cde9-5780-9152-3c8f7c7f926d"
    },
    {
      "prompt": "A drone flies horizontally at a constant height of 150 m. It passes directly above a marker; 12 seconds later its elevation from that marker is 40°. Find its speed in m/s. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "14.90"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Horizontal distance = 150/tan 40°. Divide by 12 seconds. Answer: 14.90.",
      "seed_id": "ecdc4784-fa88-5891-9afa-3ac0d45facdb"
    },
    {
      "prompt": "A right triangle has adjacent leg a relative to θ. Which formula gives its area?",
      "options": [
        "$a^2\\tan\\theta$",
        "$\\frac{a^2\\sin\\theta}{2}$",
        "$\\frac{a^2\\tan\\theta}{2}$",
        "$\\frac{a\\tan\\theta}{2}$"
      ],
      "correct_index": 2,
      "explanation": "The opposite leg is a tan θ; area = ½ × a × a tan θ.",
      "seed_id": "3993e09b-1a1a-5c60-9f99-07d0d52aa6eb"
    },
    {
      "prompt": "On level ground, two observers stand on the same side of a mast, 20 m apart. The nearer observer sees its top at 60° and the farther at 30°. Ignoring eye height, find the mast height in metres. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "17.32"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Let the near distance be x. x tan 60° = (x + 20) tan 30°, giving x = 10 and h = 10√3. Answer: 17.32.",
      "seed_id": "5fcd40ba-3dce-5dd6-bbb6-994d0f24fc60"
    },
    {
      "prompt": "At the same time, a 2 m vertical pole casts a 3 m shadow. A second vertical object casts a 12 m shadow on the same level ground. What is its height?",
      "options": [
        "8 m",
        "18 m",
        "6 m",
        "24 m"
      ],
      "correct_index": 0,
      "explanation": "The sunlight angle is common, so height/shadow = 2/3; 12 × 2/3 = 8.",
      "seed_id": "36578585-3f78-5889-9a31-df7258c52637"
    },
    {
      "prompt": "A surveyor reports a line of sight at 17° from the upward vertical. What is its angle of elevation?",
      "options": [
        "17°",
        "73°",
        "107°",
        "163°"
      ],
      "correct_index": 1,
      "explanation": "Horizontal and vertical are perpendicular, so elevation = 90° − 17°.",
      "seed_id": "0877a17b-a97d-5bfe-8d41-dc3272958b72"
    },
    {
      "prompt": "A tethered balloon is 40 m vertically above its ground anchor. Its elevation from the anchor is 53°. Find the taut tether length in metres. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "50.09"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Use 40/sin 53°. You can check with √(40² + (40/tan 53°)²). Answer: 50.09.",
      "seed_id": "e752b01d-9b0f-573f-a578-5b5273bd9212"
    },
    {
      "prompt": "For h = 30 tan θ + 1.5 with acute θ, a measured θ is too large. How does this affect the estimated height?",
      "options": [
        "It makes the estimate too small",
        "It leaves the height unchanged",
        "It makes the height negative",
        "It makes the estimate too large"
      ],
      "correct_index": 3,
      "explanation": "Tangent increases through acute angles; adding the fixed eye height does not change that direction.",
      "seed_id": "7a3a06fd-080d-5492-aa14-74d853e60d8c"
    },
    {
      "prompt": "A trolley travels up a 12° ramp at 1.5 m/s for 40 seconds. Find its vertical rise in metres. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "12.47"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "The path distance is 1.5 × 40 = 60 m. The rise is 60 sin 12°. Answer: 12.47.",
      "seed_id": "a7387079-1bb1-561a-9d11-fcd019fa4279"
    }
  ],
  "3J": [
    {
      "prompt": "How is a true bearing measured?",
      "options": [
        "Clockwise from north at the starting point",
        "Anticlockwise from east",
        "Clockwise from south",
        "From the destination back to the start"
      ],
      "correct_index": 0,
      "explanation": "Face north at the point you are travelling from, then turn clockwise toward the destination.",
      "seed_id": "9508fff5-3e89-5273-938d-74344fc0c645"
    },
    {
      "prompt": "Write the true bearing for north-east as exactly three digits, without a degree sign.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "045"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "North-east is 45° clockwise from north. Bearings use three digits, so write 045.",
      "seed_id": "217767aa-5e71-543a-b4f7-772e8221cc0c"
    },
    {
      "prompt": "A track points 37° east of north. Write its bearing as three digits, without a degree sign.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "037"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "East of north is a clockwise turn from north, so the bearing is 037°.",
      "seed_id": "fd525f01-8ea0-57a4-b68e-b48477cdf6ef"
    },
    {
      "prompt": "A track points 22° west of north. Write its bearing as three digits, without a degree sign.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "338"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "This is 22° anticlockwise from north, equivalent to 360° − 22° = 338° clockwise.",
      "seed_id": "19d199be-8792-549f-9efb-fd6bdc2dd625"
    },
    {
      "prompt": "The bearing of Q from P is 128°. Write the bearing of P from Q as three digits, without a degree sign.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "308"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Reverse directions differ by 180°: 128° + 180° = 308°.",
      "seed_id": "21d37801-0234-5511-b599-f4584b6decdd"
    },
    {
      "prompt": "The bearing of a depot from a vehicle is 286°. Write the vehicle’s bearing from the depot as three digits, without a degree sign.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "106"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Subtract 180° because 286° is already greater than 180°.",
      "seed_id": "95348a5b-e852-53de-83eb-316d758d681a"
    },
    {
      "prompt": "A survey cart travels 6 km on bearing 042°. How far east of its start is it, in km? Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "4.01"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "The bearing angle is measured from north, so east is the opposite component: 6 sin 42°. Answer: 4.01.",
      "seed_id": "e9e78998-c4b7-5ae5-ae10-e7b3d3e20b9e",
      "diagram": {
        "asset": "/ch3-diagrams/3J-7.png",
        "alt": "Bearing diagram: a 6 km route is 42° clockwise from north; its eastward component is shown horizontally."
      }
    },
    {
      "prompt": "A patrol travels 9 km on bearing 025°. How far north of its start is it, in km? Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "8.16"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "North is adjacent to the bearing angle, so use 9 cos 25°. Answer: 8.16.",
      "seed_id": "90d77573-54bd-59f3-b74e-e5776fbc052b"
    },
    {
      "prompt": "A delivery vessel travels 14 km on bearing 154°. Find its southward displacement in km. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "12.58"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "The route is 26° east of south; the southward component is 14 cos 26°. Answer: 12.58.",
      "seed_id": "3fc3d418-e98c-5e65-b16a-c2004e1b6ab6"
    },
    {
      "prompt": "A rover travels 18 km on bearing 235°. Find its westward displacement in km. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "14.74"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "The bearing is 55° west of south. Westward component = 18 sin 55°. Answer: 14.74.",
      "seed_id": "d48f016f-0322-56fd-b7f7-efa8392bae86"
    },
    {
      "prompt": "A balloon moves 11 km on bearing 312°. Find its northward displacement in km. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "7.36"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "The route is 48° west of north, so the northward component is 11 cos 48°. Answer: 7.36.",
      "seed_id": "2594ed0f-fa65-5428-a665-4e0656ba56b2"
    },
    {
      "prompt": "A campsite lies 5 km east and 12 km north of a trailhead. Find its bearing from the trailhead, to the nearest degree. Enter three digits only.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "023"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "The angle east of north is tan⁻¹(5/12) ≈ 22.62°, giving 023°.",
      "seed_id": "17bdc682-a1cd-5412-ae1f-7912a5bb6f6f"
    },
    {
      "prompt": "A marker is 8 km west and 6 km south of a station. Find its bearing from the station to the nearest degree. Enter three digits only.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "233"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "The angle west of south is tan⁻¹(8/6) ≈ 53.13°. Add 180° to get 233°.",
      "seed_id": "185a9a59-6b71-52a3-b0db-72095b3ba42b"
    },
    {
      "prompt": "A buoy is 7 km east and 7 km south of a pier. What is the bearing of the pier from the buoy? Enter three digits only.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "315"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "From the buoy the pier is north-west, so its bearing is 315°; this is the reverse of 135°.",
      "seed_id": "c42899b7-0a01-5456-9302-cd700ae4d5a9"
    },
    {
      "prompt": "A vessel travels 20 km on bearing 125°, then 13 km due west. How far east of its original start is it, in km? Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "3.38"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "The first eastward component is 20 sin 55°. Subtract the 13 km westward leg. Answer: 3.38.",
      "seed_id": "a7e6558a-34f3-5261-b4f7-159801c72f23"
    },
    {
      "prompt": "A hiker walks 6 km south, then on bearing 040° until reaching a point due east of the start. Find the final distance east of the start in km. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "5.03"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "The second leg must recover 6 km north. East/north = tan 40°, so east = 6 tan 40°. Answer: 5.03.",
      "seed_id": "4a5baaf2-4a3b-52bd-bd59-1fd7c42adb96"
    },
    {
      "prompt": "Two robots leave the same point. One goes due west. The other travels 15 m on bearing 218° and stops due south of the first robot. How far did the first robot travel, in metres? Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "9.23"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "They have equal westward displacement. The second robot’s is 15 sin 38°. Answer: 9.23.",
      "seed_id": "97e178e6-fe75-5ae8-818d-9f7c4dd76099"
    },
    {
      "prompt": "A path from A to B has bearing 146°. At B, the direction toward C is 60° anticlockwise from the direction back toward A. Find the bearing from B to C. Enter three digits only.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "266"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "The back bearing BA is 326°. Turning anticlockwise by 60° gives 266°.",
      "seed_id": "b3e225f6-b5f6-585d-8591-065a625b204e"
    },
    {
      "prompt": "An airship moves at 80 km/h for 45 minutes on bearing 162°. Find its southward displacement in km. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "57.06"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "Distance travelled is 80 × 45/60 = 60 km. The route is 18° east of south, so south = 60 cos 18°. Answer: 57.06.",
      "seed_id": "8ef104ac-293a-5034-b0b1-67904b9845f5"
    },
    {
      "prompt": "A destination is 100 km due north of a base. A drone first flies 40 km on bearing 300°, then directly to the destination. Find the total route length in km. Enter only the number, to 2 decimal places.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "127.18"
        ],
        "exact": true
      },
      "correct_index": 0,
      "explanation": "The first leg gains 20 km north and 20√3 km west. The remaining distance is √(80² + (20√3)²). Answer: 127.18.",
      "seed_id": "ee2b34ec-b1bc-5d9c-b686-066879a3639a"
    },
    {
      "prompt": "A boat detours 10 km east, then travels directly to a destination 24 km north of its original start. At a constant 12 km/h, how many extra minutes does this take compared with sailing directly north? Enter only the number.",
      "options": {
        "kind": "short_answer",
        "accepted": [
          "60"
        ],
        "exact": false
      },
      "correct_index": 0,
      "explanation": "The diagonal leg is √(10² + 24²) = 26 km. The detour is 36 km rather than 24 km: 12 km extra at 12 km/h takes 60 minutes. Answer: 60.",
      "seed_id": "da0492b6-8fd0-5c79-98af-4b1a2ad1fb1a"
    }
  ]
};
