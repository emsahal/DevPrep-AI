export interface DSAQuestion {
  id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  topic: string
  level: number
  problem: string
  examples: { input: string; output: string; explanation?: string }[]
  constraints: string[]
  intuition: string
  pseudocode: string[]
  dryRun: { text: string; steps: { title: string; content: string }[] }
  starterCode: { cpp: string; javascript: string }
  complexity: { time: string; space: string }
  tips: string[]
}

export interface LevelInfo {
  level: number
  name: string
  rating: number
  topics: { name: string; questionIds: string[] }[]
}

export const allQuestions: DSAQuestion[] = [
  // ============================================================
  // LEVEL 1 - Must Know (30 questions)
  // ============================================================

  // ---------- Arrays (10) ----------
  {
    id: 'reverse-array',
    title: 'Reverse an Array',
    difficulty: 'Easy',
    topic: 'Arrays',
    level: 1,
    problem:
      'Given an array of integers, reverse the order of its elements in-place. You must modify the original array without using extra space proportional to the input size.',
    examples: [
      { input: '[1, 2, 3, 4, 5]', output: '[5, 4, 3, 2, 1]', explanation: 'The first element becomes the last, the second becomes second-last, and so on.' },
      { input: '[10, 20, 30]', output: '[30, 20, 10]', explanation: 'Reversing a three-element array swaps the first and last elements.' },
    ],
    constraints: ['1 <= arr.length <= 10^5', '-10^9 <= arr[i] <= 10^9'],
    intuition:
      'Use two pointers - one at the start and one at the end of the array. Swap the elements at these pointers and move them inward until they meet. This runs in O(n) time and uses O(1) extra space.',
    pseudocode: [
      'function reverseArray(arr):',
      '  left = 0',
      '  right = arr.length - 1',
      '  while left < right:',
      '    swap(arr[left], arr[right])',
      '    left = left + 1',
      '    right = right - 1',
      '  return arr',
    ],
    dryRun: {
      text: 'Walk through reversing [1,2,3,4,5] step by step using two pointers.',
      steps: [
        { title: 'Initialize', content: 'arr = [1,2,3,4,5], left = 0, right = 4' },
        { title: 'Swap (left=0, right=4)', content: 'Swap 1 and 5 -> [5,2,3,4,1], left=1, right=3' },
        { title: 'Swap (left=1, right=3)', content: 'Swap 2 and 4 -> [5,4,3,2,1], left=2, right=2' },
        { title: 'Pointers meet', content: 'left == right -> loop ends. Final: [5,4,3,2,1]' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\nusing namespace std;\n\nvoid reverseArray(vector<int>& arr) {\n  int left = 0, right = arr.size() - 1;\n  while (left < right) {\n    swap(arr[left], arr[right]);\n    left++;\n    right--;\n  }\n}',
      javascript: 'function reverseArray(arr) {\n  let left = 0, right = arr.length - 1;\n  while (left < right) {\n    [arr[left], arr[right]] = [arr[right], arr[left]];\n    left++;\n    right--;\n  }\n  return arr;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    tips: [
      'Work with indices, not values.',
      'The loop condition is left < right, not left <= right.',
      'Remember to pass by reference in C++.',
    ],
  },

  {
    id: 'max-min',
    title: 'Find Maximum and Minimum',
    difficulty: 'Easy',
    topic: 'Arrays',
    level: 1,
    problem:
      'Given an array of integers, find both the maximum and the minimum element. Return them as a pair (min, max).',
    examples: [
      { input: '[3, 1, 8, 2, 5]', output: '(1, 8)', explanation: '1 is the smallest, 8 is the largest.' },
      { input: '[-5, -2, -10, 0]', output: '(-10, 0)', explanation: '-10 is the smallest, 0 is the largest.' },
    ],
    constraints: ['1 <= arr.length <= 10^5', '-10^9 <= arr[i] <= 10^9'],
    intuition:
      'Initialize both min and max with the first element. Traverse the array once, updating min when a smaller element is found and max when a larger element is found. This is a single-pass O(n) solution.',
    pseudocode: [
      'function findMinMax(arr):',
      '  if arr is empty: return null',
      '  min = arr[0], max = arr[0]',
      '  for i = 1 to arr.length - 1:',
      '    if arr[i] < min: min = arr[i]',
      '    if arr[i] > max: max = arr[i]',
      '  return (min, max)',
    ],
    dryRun: {
      text: 'Walk through finding min and max in [3,1,8,2,5].',
      steps: [
        { title: 'Initialize', content: 'arr = [3,1,8,2,5], min = 3, max = 3' },
        { title: 'i = 1, arr[1] = 1', content: '1 < 3 -> min = 1, max remains 3' },
        { title: 'i = 2, arr[2] = 8', content: '8 > 3 -> max = 8, min remains 1' },
        { title: 'i = 3, arr[3] = 2', content: '2 is between min and max -> no change' },
        { title: 'i = 4, arr[4] = 5', content: '5 is between min and max -> no change' },
        { title: 'Result', content: 'min = 1, max = 8' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\n#include <utility>\nusing namespace std;\n\npair<int,int> findMinMax(vector<int>& arr) {\n  int minVal = arr[0], maxVal = arr[0];\n  for (int i = 1; i < arr.size(); i++) {\n    if (arr[i] < minVal) minVal = arr[i];\n    if (arr[i] > maxVal) maxVal = arr[i];\n  }\n  return {minVal, maxVal};\n}',
      javascript: 'function findMinMax(arr) {\n  let min = arr[0], max = arr[0];\n  for (let i = 1; i < arr.length; i++) {\n    if (arr[i] < min) min = arr[i];\n    if (arr[i] > max) max = arr[i];\n  }\n  return [min, max];\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    tips: [
      'Initialize min/max with the first element, not 0 or Infinity.',
      'Single pass is optimal - O(n) time.',
      'Use std::pair in C++ to return two values.',
    ],
  },

  {
    id: 'second-largest',
    title: 'Second Largest Element',
    difficulty: 'Easy',
    topic: 'Arrays',
    level: 1,
    problem:
      'Given an array of integers, find the second largest distinct element. If no second largest exists, return -1.',
    examples: [
      { input: '[12, 35, 1, 10, 34, 1]', output: '34', explanation: 'The largest is 35, and the second largest distinct value is 34.' },
      { input: '[10, 10, 10]', output: '-1', explanation: 'All elements are the same, so there is no second largest.' },
    ],
    constraints: ['1 <= arr.length <= 10^5', '-10^9 <= arr[i] <= 10^9'],
    intuition:
      'Keep track of both the largest and second largest in a single pass. When a new larger value is found, demote the current largest to second largest. If a value is between largest and second largest, update second largest.',
    pseudocode: [
      'function secondLargest(arr):',
      '  first = -inf, second = -inf',
      '  for each num in arr:',
      '    if num > first:',
      '      second = first',
      '      first = num',
      '    else if num > second and num != first:',
      '      second = num',
      '  return second if second != -inf else -1',
    ],
    dryRun: {
      text: 'Walk through finding second largest in [12,35,1,10,34,1].',
      steps: [
        { title: 'Initialize', content: 'first = -inf, second = -inf' },
        { title: 'num = 12', content: '12 > -inf -> second = -inf, first = 12' },
        { title: 'num = 35', content: '35 > 12 -> second = 12, first = 35' },
        { title: 'num = 1', content: '1 < 12, 1 < 35 -> no change' },
        { title: 'num = 10', content: '10 < 12, 10 < 35 -> no change' },
        { title: 'num = 34', content: '34 > 12 and 34 != 35 -> second = 34' },
        { title: 'num = 1', content: '1 < 34 -> no change' },
        { title: 'Result', content: 'second = 34' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\n#include <climits>\nusing namespace std;\n\nint secondLargest(vector<int>& arr) {\n  int first = INT_MIN, second = INT_MIN;\n  for (int num : arr) {\n    if (num > first) {\n      second = first;\n      first = num;\n    } else if (num > second && num != first) {\n      second = num;\n    }\n  }\n  return (second == INT_MIN) ? -1 : second;\n}',
      javascript: 'function secondLargest(arr) {\n  let first = -Infinity, second = -Infinity;\n  for (let num of arr) {\n    if (num > first) {\n      second = first;\n      first = num;\n    } else if (num > second && num !== first) {\n      second = num;\n    }\n  }\n  return second === -Infinity ? -1 : second;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    tips: [
      'Handle duplicate values carefully - use the distinct condition.',
      'Use INT_MIN / -Infinity for initial values.',
      'Single pass is sufficient.',
    ],
  },

  {
    id: 'remove-duplicates',
    title: 'Remove Duplicates from Array',
    difficulty: 'Easy',
    topic: 'Arrays',
    level: 1,
    problem:
      'Given a sorted array, remove the duplicates in-place such that each element appears only once. Return the new length of the array.',
    examples: [
      { input: '[1, 1, 2]', output: '2 (array becomes [1, 2])', explanation: 'Two unique elements: 1 and 2.' },
      { input: '[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]', output: '5 (array becomes [0, 1, 2, 3, 4])', explanation: 'Five unique elements remain.' },
    ],
    constraints: ['1 <= arr.length <= 3 * 10^4', '-100 <= arr[i] <= 100', 'arr is sorted in non-decreasing order'],
    intuition:
      'Since the array is sorted, duplicates appear consecutively. Use two pointers: a slow pointer that marks the position to place the next unique element, and a fast pointer that scans for new values. When a new value is found, place it at the slow pointer position.',
    pseudocode: [
      'function removeDuplicates(arr):',
      '  if arr is empty: return 0',
      '  i = 0',
      '  for j = 1 to arr.length - 1:',
      '    if arr[j] != arr[i]:',
      '      i = i + 1',
      '      arr[i] = arr[j]',
      '  return i + 1',
    ],
    dryRun: {
      text: 'Walk through removing duplicates from [0,0,1,1,1,2,2].',
      steps: [
        { title: 'Initialize', content: 'arr = [0,0,1,1,1,2,2], i = 0' },
        { title: 'j = 1, arr[1] = 0', content: '0 == arr[0] -> skip' },
        { title: 'j = 2, arr[2] = 1', content: '1 != arr[0] -> i = 1, arr[1] = 1' },
        { title: 'j = 3, arr[3] = 1', content: '1 == arr[1] -> skip' },
        { title: 'j = 4, arr[4] = 1', content: '1 == arr[1] -> skip' },
        { title: 'j = 5, arr[5] = 2', content: '2 != arr[1] -> i = 2, arr[2] = 2' },
        { title: 'j = 6, arr[6] = 2', content: '2 == arr[2] -> skip' },
        { title: 'Result', content: 'i + 1 = 3, first 3 elements: [0,1,2]' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\nusing namespace std;\n\nint removeDuplicates(vector<int>& arr) {\n  if (arr.empty()) return 0;\n  int i = 0;\n  for (int j = 1; j < arr.size(); j++) {\n    if (arr[j] != arr[i]) {\n      i++;\n      arr[i] = arr[j];\n    }\n  }\n  return i + 1;\n}',
      javascript: 'function removeDuplicates(arr) {\n  if (arr.length === 0) return 0;\n  let i = 0;\n  for (let j = 1; j < arr.length; j++) {\n    if (arr[j] !== arr[i]) {\n      i++;\n      arr[i] = arr[j];\n    }\n  }\n  return i + 1;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    tips: [
      'Array must be sorted for this approach to work.',
      'The returned length is i + 1, not i.',
      'Elements beyond the new length are irrelevant.',
    ],
  },

  {
    id: 'rotate-array',
    title: 'Rotate Array',
    difficulty: 'Easy',
    topic: 'Arrays',
    level: 1,
    problem:
      'Given an array, rotate the array to the right by k steps, where k is non-negative. Rotate in-place without using extra space for a copy of the array.',
    examples: [
      { input: '[1, 2, 3, 4, 5, 6, 7], k = 3', output: '[5, 6, 7, 1, 2, 3, 4]', explanation: 'Rotate right by 3 steps - last 3 elements move to front.' },
      { input: '[-1, -100, 3, 99], k = 2', output: '[3, 99, -1, -100]', explanation: 'Rotate right by 2 steps.' },
    ],
    constraints: ['1 <= arr.length <= 10^5', '0 <= k <= 10^5', '-2^31 <= arr[i] <= 2^31 - 1'],
    intuition:
      'Reverse the entire array, then reverse the first k elements, then reverse the remaining n-k elements. This three-reversal technique achieves O(n) time with O(1) extra space.',
    pseudocode: [
      'function rotate(arr, k):',
      '  n = arr.length',
      '  k = k % n',
      '  reverse(arr, 0, n-1)',
      '  reverse(arr, 0, k-1)',
      '  reverse(arr, k, n-1)',
      '',
      'function reverse(arr, start, end):',
      '  while start < end:',
      '    swap(arr[start], arr[end])',
      '    start++, end--',
    ],
    dryRun: {
      text: 'Rotate [1,2,3,4,5,6,7] right by k=3 using three reversals.',
      steps: [
        { title: 'Original', content: '[1,2,3,4,5,6,7], k=3' },
        { title: 'Reverse all', content: '[7,6,5,4,3,2,1]' },
        { title: 'Reverse first k (0 to 2)', content: '[5,6,7,4,3,2,1]' },
        { title: 'Reverse rest (3 to 6)', content: '[5,6,7,1,2,3,4]' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\nusing namespace std;\n\nvoid rotate(vector<int>& arr, int k) {\n  int n = arr.size();\n  k = k % n;\n  auto rev = [&](int l, int r) {\n    while (l < r) swap(arr[l++], arr[r--]);\n  };\n  rev(0, n - 1);\n  rev(0, k - 1);\n  rev(k, n - 1);\n}',
      javascript: 'function rotate(arr, k) {\n  const n = arr.length;\n  k = k % n;\n  const rev = (l, r) => {\n    while (l < r) {\n      [arr[l], arr[r]] = [arr[r], arr[l]];\n      l++; r--;\n    }\n  };\n  rev(0, n - 1);\n  rev(0, k - 1);\n  rev(k, n - 1);\n  return arr;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    tips: [
      'Always take k modulo n first.',
      'The three-reversal trick avoids needing extra memory.',
      'Handle the edge case where k = 0 or k = n.',
    ],
  },

  {
    id: 'move-zeroes',
    title: 'Move Zeroes',
    difficulty: 'Easy',
    topic: 'Arrays',
    level: 1,
    problem:
      'Given an array of integers, move all zeroes to the end of the array while maintaining the relative order of the non-zero elements. Do this in-place.',
    examples: [
      { input: '[0, 1, 0, 3, 12]', output: '[1, 3, 12, 0, 0]', explanation: 'Non-zero elements 1, 3, 12 maintain order, zeroes move to end.' },
      { input: '[0, 0, 1]', output: '[1, 0, 0]', explanation: 'Single non-zero moves to front.' },
    ],
    constraints: ['1 <= arr.length <= 10^4', '-2^31 <= arr[i] <= 2^31 - 1'],
    intuition:
      'Use a pointer (lastNonZero) that tracks where the next non-zero element should be placed. Iterate through the array; when a non-zero is found, swap it with the element at the lastNonZero position and increment the pointer. All zeroes naturally bubble to the end.',
    pseudocode: [
      'function moveZeroes(arr):',
      '  lastNonZero = 0',
      '  for i = 0 to arr.length - 1:',
      '    if arr[i] != 0:',
      '      swap(arr[lastNonZero], arr[i])',
      '      lastNonZero++',
    ],
    dryRun: {
      text: 'Move zeroes in [0,1,0,3,12] to the end.',
      steps: [
        { title: 'Initialize', content: 'lastNonZero = 0, arr = [0,1,0,3,12]' },
        { title: 'i = 0, arr[0] = 0', content: 'Zero -> skip' },
        { title: 'i = 1, arr[1] = 1', content: 'Non-zero -> swap with index 0 -> [1,0,0,3,12], lastNonZero = 1' },
        { title: 'i = 2, arr[2] = 0', content: 'Zero -> skip' },
        { title: 'i = 3, arr[3] = 3', content: 'Non-zero -> swap with index 1 -> [1,3,0,0,12], lastNonZero = 2' },
        { title: 'i = 4, arr[4] = 12', content: 'Non-zero -> swap with index 2 -> [1,3,12,0,0], lastNonZero = 3' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\nusing namespace std;\n\nvoid moveZeroes(vector<int>& arr) {\n  int lastNonZero = 0;\n  for (int i = 0; i < arr.size(); i++) {\n    if (arr[i] != 0) {\n      swap(arr[lastNonZero], arr[i]);\n      lastNonZero++;\n    }\n  }\n}',
      javascript: 'function moveZeroes(arr) {\n  let lastNonZero = 0;\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] !== 0) {\n      [arr[lastNonZero], arr[i]] = [arr[i], arr[lastNonZero]];\n      lastNonZero++;\n    }\n  }\n  return arr;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    tips: [
      'The order of non-zero elements is preserved naturally.',
      'Avoid counting zeroes first - the swap approach is cleaner.',
      'Works in a single pass.',
    ],
  },

  {
    id: 'merge-sorted-arrays',
    title: 'Merge Two Sorted Arrays',
    difficulty: 'Easy',
    topic: 'Arrays',
    level: 1,
    problem:
      'Given two sorted arrays, merge them into a single sorted array. Return the merged array.',
    examples: [
      { input: '[1, 2, 3], [2, 5, 6]', output: '[1, 2, 2, 3, 5, 6]', explanation: 'Elements interleaved in sorted order.' },
      { input: '[1], []', output: '[1]', explanation: 'Merging with an empty array returns the non-empty array.' },
    ],
    constraints: ['0 <= arr1.length, arr2.length <= 1000', '-10^5 <= arr[i] <= 10^5', 'Both arrays are sorted in ascending order'],
    intuition:
      'Use two pointers, one for each array. Compare elements at the pointers, take the smaller one into the result, and advance the corresponding pointer. When one array is exhausted, append the remaining elements of the other array.',
    pseudocode: [
      'function mergeSorted(arr1, arr2):',
      '  i = 0, j = 0',
      '  result = []',
      '  while i < arr1.length and j < arr2.length:',
      '    if arr1[i] < arr2[j]:',
      '      result.push(arr1[i]), i++',
      '    else:',
      '      result.push(arr2[j]), j++',
      '  while i < arr1.length: result.push(arr1[i]), i++',
      '  while j < arr2.length: result.push(arr2[j]), j++',
      '  return result',
    ],
    dryRun: {
      text: 'Merge [1,2,3] and [2,5,6] step by step.',
      steps: [
        { title: 'Initialize', content: 'i = 0, j = 0, result = []' },
        { title: 'Compare 1 vs 2', content: '1 < 2 -> result = [1], i = 1' },
        { title: 'Compare 2 vs 2', content: '2 >= 2 -> result = [1,2], j = 1' },
        { title: 'Compare 2 vs 5', content: '2 < 5 -> result = [1,2,2], i = 2' },
        { title: 'Compare 3 vs 5', content: '3 < 5 -> result = [1,2,2,3], i = 3' },
        { title: 'arr1 exhausted', content: 'Append [5,6] from arr2 -> result = [1,2,2,3,5,6]' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\nusing namespace std;\n\nvector<int> mergeSorted(vector<int>& arr1, vector<int>& arr2) {\n  vector<int> result;\n  int i = 0, j = 0;\n  while (i < arr1.size() && j < arr2.size()) {\n    if (arr1[i] < arr2[j]) result.push_back(arr1[i++]);\n    else result.push_back(arr2[j++]);\n  }\n  while (i < arr1.size()) result.push_back(arr1[i++]);\n  while (j < arr2.size()) result.push_back(arr2[j++]);\n  return result;\n}',
      javascript: 'function mergeSorted(arr1, arr2) {\n  const result = [];\n  let i = 0, j = 0;\n  while (i < arr1.length && j < arr2.length) {\n    if (arr1[i] < arr2[j]) result.push(arr1[i++]);\n    else result.push(arr2[j++]);\n  }\n  while (i < arr1.length) result.push(arr1[i++]);\n  while (j < arr2.length) result.push(arr2[j++]);\n  return result;\n}',
    },
    complexity: { time: 'O(n + m)', space: 'O(n + m)' },
    tips: [
      'Both input arrays must be sorted individually.',
      'Use the two-pointer technique for linear merging.',
      'After one array is exhausted, append the rest of the other array.',
    ],
  },

  {
    id: 'find-missing-number',
    title: 'Find Missing Number',
    difficulty: 'Easy',
    topic: 'Arrays',
    level: 1,
    problem:
      'Given an array of n distinct integers from 0 to n, find the one number that is missing from the range.',
    examples: [
      { input: '[3, 0, 1]', output: '2', explanation: 'n = 3, range is [0,3], missing number is 2.' },
      { input: '[0, 1]', output: '2', explanation: 'n = 2, range is [0,2], missing number is 2.' },
    ],
    constraints: ['n == arr.length', '1 <= n <= 10^4', '0 <= arr[i] <= n', 'All elements are distinct'],
    intuition:
      'Compute the expected sum of numbers from 0 to n (which is n*(n+1)/2) and subtract the actual sum of the array. The difference is the missing number. Alternatively, XOR all numbers from 0 to n with all array elements - the result is the missing number.',
    pseudocode: [
      'function findMissing(arr):',
      '  n = arr.length',
      '  expectedSum = n * (n + 1) / 2',
      '  actualSum = sum(arr)',
      '  return expectedSum - actualSum',
    ],
    dryRun: {
      text: 'Find missing number in [3, 0, 1] using the sum formula.',
      steps: [
        { title: 'Array', content: '[3, 0, 1], n = 3' },
        { title: 'Expected sum', content: '3 * 4 / 2 = 6 (sum of 0+1+2+3)' },
        { title: 'Actual sum', content: '3 + 0 + 1 = 4' },
        { title: 'Missing', content: '6 - 4 = 2' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\nusing namespace std;\n\nint findMissing(vector<int>& arr) {\n  int n = arr.size();\n  int expected = n * (n + 1) / 2;\n  int actual = 0;\n  for (int num : arr) actual += num;\n  return expected - actual;\n}',
      javascript: 'function findMissing(arr) {\n  const n = arr.length;\n  const expected = n * (n + 1) / 2;\n  const actual = arr.reduce((sum, num) => sum + num, 0);\n  return expected - actual;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    tips: [
      'The sum formula works for 0..n range.',
      'Watch out for integer overflow when n is very large.',
      'XOR approach avoids overflow issues.',
    ],
  },

  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    topic: 'Arrays',
    level: 1,
    problem:
      'Given an array of integers and a target integer, return the indices of the two numbers that add up to the target. Each input has exactly one solution, and you may not use the same element twice.',
    examples: [
      { input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]', explanation: '2 + 7 = 9, so indices 0 and 1 are returned.' },
      { input: 'nums = [3, 2, 4], target = 6', output: '[1, 2]', explanation: '2 + 4 = 6, not 3 + 3 (cannot use same element twice).' },
    ],
    constraints: ['2 <= arr.length <= 10^4', '-10^9 <= arr[i] <= 10^9', '-10^9 <= target <= 10^9', 'Exactly one valid solution'],
    intuition:
      'Use a hash map to store each elements value and its index as you iterate. For each element, compute its complement (target - value). If the complement exists in the map, return the two indices. This gives O(n) time.',
    pseudocode: [
      'function twoSum(nums, target):',
      '  map = {}',
      '  for i = 0 to nums.length - 1:',
      '    complement = target - nums[i]',
      '    if complement in map:',
      '      return [map[complement], i]',
      '    map[nums[i]] = i',
    ],
    dryRun: {
      text: 'Find two numbers in [2,7,11,15] that sum to 9.',
      steps: [
        { title: 'i = 0, num = 2', content: 'complement = 9 - 2 = 7, not in map -> store map[2]=0' },
        { title: 'i = 1, num = 7', content: 'complement = 9 - 7 = 2, found in map at index 0 -> return [0,1]' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n  unordered_map<int,int> mp;\n  for (int i = 0; i < nums.size(); i++) {\n    int complement = target - nums[i];\n    if (mp.count(complement)) return {mp[complement], i};\n    mp[nums[i]] = i;\n  }\n  return {};\n}',
      javascript: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}',
    },
    complexity: { time: 'O(n)', space: 'O(n)' },
    tips: [
      'The complement is target - current value.',
      'Store each values index after checking - avoids self-pairing.',
      'There is exactly one solution per problem statement.',
    ],
  },

  {
    id: 'kadanes-algorithm',
    title: 'Kadane\'s Algorithm (Maximum Subarray)',
    difficulty: 'Medium',
    topic: 'Arrays',
    level: 1,
    problem:
      'Given an array of integers, find the contiguous subarray (containing at least one number) with the largest sum and return that sum.',
    examples: [
      { input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]', output: '6', explanation: 'The subarray [4, -1, 2, 1] has the largest sum = 6.' },
      { input: '[1]', output: '1', explanation: 'Single element subarray has sum 1.' },
    ],
    constraints: ['1 <= arr.length <= 10^5', '-10^4 <= arr[i] <= 10^4'],
    intuition:
      'Kadane\'s algorithm maintains a running sum of the current subarray. If the running sum becomes negative, reset it to 0 (start a new subarray). Track the maximum running sum encountered. This works because a negative prefix would only decrease any future sum.',
    pseudocode: [
      'function maxSubarray(arr):',
      '  maxSum = arr[0], currSum = 0',
      '  for each num in arr:',
      '    currSum = currSum + num',
      '    maxSum = max(maxSum, currSum)',
      '    if currSum < 0: currSum = 0',
      '  return maxSum',
    ],
    dryRun: {
      text: 'Run Kadane\'s on [-2,1,-3,4,-1,2,1,-5,4].',
      steps: [
        { title: 'Start', content: 'maxSum = -2, currSum = 0' },
        { title: 'num = -2', content: 'currSum = -2, maxSum = max(-2,-2) = -2, currSum < 0 -> currSum = 0' },
        { title: 'num = 1', content: 'currSum = 1, maxSum = max(-2,1) = 1' },
        { title: 'num = -3', content: 'currSum = -2, maxSum stays 1, currSum < 0 -> currSum = 0' },
        { title: 'num = 4', content: 'currSum = 4, maxSum = max(1,4) = 4' },
        { title: 'num = -1', content: 'currSum = 3, maxSum stays 4' },
        { title: 'num = 2', content: 'currSum = 5, maxSum = max(4,5) = 5' },
        { title: 'num = 1', content: 'currSum = 6, maxSum = max(5,6) = 6' },
        { title: 'num = -5', content: 'currSum = 1, maxSum stays 6' },
        { title: 'num = 4', content: 'currSum = 5, maxSum stays 6 -> result = 6' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint maxSubarray(vector<int>& arr) {\n  int maxSum = arr[0], currSum = 0;\n  for (int num : arr) {\n    currSum += num;\n    maxSum = max(maxSum, currSum);\n    if (currSum < 0) currSum = 0;\n  }\n  return maxSum;\n}',
      javascript: 'function maxSubarray(arr) {\n  let maxSum = arr[0], currSum = 0;\n  for (let num of arr) {\n    currSum += num;\n    maxSum = Math.max(maxSum, currSum);\n    if (currSum < 0) currSum = 0;\n  }\n  return maxSum;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    tips: [
      'Reset currSum to 0 when it goes negative.',
      'maxSum should be initialized with arr[0], not 0.',
      'This is a classic DP algorithm that is often asked on its own.',
    ],
  },

  // ---------- Strings (10) ----------
  {
    id: 'reverse-string',
    title: 'Reverse String',
    difficulty: 'Easy',
    topic: 'Strings',
    level: 1,
    problem:
      'Given a string, reverse it in-place. You must modify the original character array without using extra space.',
    examples: [
      { input: '"hello"', output: '"olleh"', explanation: 'Characters are reversed from back to front.' },
      { input: '"abcde"', output: '"edcba"', explanation: 'First and last are swapped, then second and second-last, etc.' },
    ],
    constraints: ['1 <= s.length <= 10^5', 's consists of printable ASCII characters'],
    intuition:
      'Use two pointers - one at the start and one at the end. Swap characters and move pointers inward until they meet.',
    pseudocode: [
      'function reverseString(s):',
      '  left = 0, right = s.length - 1',
      '  while left < right:',
      '    swap(s[left], s[right])',
      '    left++, right--',
    ],
    dryRun: {
      text: 'Reverse "hello" using two pointers.',
      steps: [
        { title: 'Start', content: 's = "hello", left = 0, right = 4' },
        { title: 'Swap h / o', content: '"oellh", left = 1, right = 3' },
        { title: 'Swap e / l', content: '"olleh", left = 2, right = 2' },
        { title: 'Done', content: 'Pointers met -> "olleh"' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvoid reverseString(vector<char>& s) {\n  int left = 0, right = s.size() - 1;\n  while (left < right) {\n    swap(s[left], s[right]);\n    left++;\n    right--;\n  }\n}',
      javascript: 'function reverseString(s) {\n  let left = 0, right = s.length - 1;\n  while (left < right) {\n    [s[left], s[right]] = [s[right], s[left]];\n    left++;\n    right--;\n  }\n  return s;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    tips: [
      'Works for both strings and character arrays.',
      'Use two-pointer technique for in-place reversal.',
      'In JavaScript strings are immutable - convert to array first.',
    ],
  },

  {
    id: 'palindrome',
    title: 'Palindrome Check',
    difficulty: 'Easy',
    topic: 'Strings',
    level: 1,
    problem:
      'Given a string, determine if it reads the same forwards and backwards (a palindrome). Ignore case and non-alphanumeric characters.',
    examples: [
      { input: '"A man, a plan, a canal: Panama"', output: 'true', explanation: 'After removing non-alphanumeric and lowercasing: "amanaplanacanalpanama" is a palindrome.' },
      { input: '"race a car"', output: 'false', explanation: 'After cleanup: "raceacar" is not a palindrome.' },
    ],
    constraints: ['1 <= s.length <= 2 * 10^5', 's consists of printable ASCII characters'],
    intuition:
      'Use two pointers, one at the start and one at the end. Skip non-alphanumeric characters. Compare characters after converting to lowercase. If any mismatch is found, return false.',
    pseudocode: [
      'function isPalindrome(s):',
      '  left = 0, right = s.length - 1',
      '  while left < right:',
      '    while left < right and not alnum(s[left]): left++',
      '    while left < right and not alnum(s[right]): right--',
      '    if lower(s[left]) != lower(s[right]): return false',
      '    left++, right--',
      '  return true',
    ],
    dryRun: {
      text: 'Check "A man, a plan, a canal: Panama" for palindrome.',
      steps: [
        { title: 'Initialize', content: 'left = 0 (A), right = 29 (a)' },
        { title: 'Skip non-alnum', content: 'left skips spaces/commas, right skips colon' },
        { title: 'Compare (left=0 vs right=29)', content: 'a == a -> move on' },
        { title: 'Continue inward...', content: 'All comparisons match -> true' },
      ],
    },
    starterCode: {
      cpp: '#include <string>\n#include <cctype>\nusing namespace std;\n\nbool isPalindrome(string s) {\n  int left = 0, right = s.size() - 1;\n  while (left < right) {\n    while (left < right && !isalnum(s[left])) left++;\n    while (left < right && !isalnum(s[right])) right--;\n    if (tolower(s[left]) != tolower(s[right])) return false;\n    left++; right--;\n  }\n  return true;\n}',
      javascript: 'function isPalindrome(s) {\n  let left = 0, right = s.length - 1;\n  const isAlphaNum = (c) => /[a-zA-Z0-9]/.test(c);\n  while (left < right) {\n    while (left < right && !isAlphaNum(s[left])) left++;\n    while (left < right && !isAlphaNum(s[right])) right--;\n    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;\n    left++; right--;\n  }\n  return true;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    tips: [
      'Use isalnum() / regex to check alphanumeric characters.',
      'Convert to lowercase before comparing.',
      'Two-pointer approach is O(n) time and O(1) space.',
    ],
  },

  {
    id: 'count-characters',
    title: 'Count Characters in String',
    difficulty: 'Easy',
    topic: 'Strings',
    level: 1,
    problem:
      'Given a string, count the frequency of each character (case-sensitive). Return the counts as a map or object.',
    examples: [
      { input: '"hello"', output: '{h:1, e:1, l:2, o:1}', explanation: 'Character l appears twice, others once.' },
      { input: '"aA"', output: '{a:1, A:1}', explanation: 'Case-sensitive, so a and A are counted separately.' },
    ],
    constraints: ['0 <= s.length <= 10^5', 's consists of printable ASCII characters'],
    intuition:
      'Iterate through the string. For each character, increment its count in a hash map. If the character is not yet in the map, initialize it to 1.',
    pseudocode: [
      'function countChars(s):',
      '  freq = {}',
      '  for each char c in s:',
      '    freq[c] = freq[c] + 1',
      '  return freq',
    ],
    dryRun: {
      text: 'Count characters in "hello".',
      steps: [
        { title: 'Initialize', content: 'freq = {}' },
        { title: 'c = h', content: 'freq[h] = 1' },
        { title: 'c = e', content: 'freq[e] = 1' },
        { title: 'c = l', content: 'freq[l] = 1' },
        { title: 'c = l', content: 'freq[l] = 2' },
        { title: 'c = o', content: 'freq[o] = 1' },
      ],
    },
    starterCode: {
      cpp: '#include <string>\n#include <unordered_map>\nusing namespace std;\n\nunordered_map<char,int> countChars(string s) {\n  unordered_map<char,int> freq;\n  for (char c : s) freq[c]++;\n  return freq;\n}',
      javascript: 'function countChars(s) {\n  const freq = {};\n  for (let c of s) freq[c] = (freq[c] || 0) + 1;\n  return freq;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(k)' },
    tips: [
      'Use a hash map for O(1) insertion and lookup.',
      'Case-sensitive by default.',
      'The space complexity depends on the number of distinct characters (k).',
    ],
  },

  {
    id: 'count-vowels',
    title: 'Count Vowels in String',
    difficulty: 'Easy',
    topic: 'Strings',
    level: 1,
    problem:
      'Given a string, count the number of vowels (a, e, i, o, u) in it. The check should be case-insensitive.',
    examples: [
      { input: '"hello"', output: '2', explanation: 'e and o are vowels -> count = 2.' },
      { input: '"AEIOU"', output: '5', explanation: 'All uppercase vowels -> count = 5.' },
    ],
    constraints: ['0 <= s.length <= 10^5', 's consists of printable ASCII characters'],
    intuition:
      'Define a set of vowels (both lowercase and uppercase). Iterate through the string and increment a counter when a character is found in the set.',
    pseudocode: [
      'function countVowels(s):',
      '  vowels = {"a","e","i","o","u","A","E","I","O","U"}',
      '  count = 0',
      '  for each char c in s:',
      '    if c in vowels: count++',
      '  return count',
    ],
    dryRun: {
      text: 'Count vowels in "hello".',
      steps: [
        { title: 'c = h', content: 'Not a vowel -> count = 0' },
        { title: 'c = e', content: 'Vowel -> count = 1' },
        { title: 'c = l', content: 'Not a vowel -> count = 1' },
        { title: 'c = l', content: 'Not a vowel -> count = 1' },
        { title: 'c = o', content: 'Vowel -> count = 2' },
      ],
    },
    starterCode: {
      cpp: '#include <string>\n#include <unordered_set>\nusing namespace std;\n\nint countVowels(string s) {\n  unordered_set<char> vowels = {\'a\',\'e\',\'i\',\'o\',\'u\',\'A\',\'E\',\'I\',\'O\',\'U\'};\n  int count = 0;\n  for (char c : s) {\n    if (vowels.count(c)) count++;\n  }\n  return count;\n}',
      javascript: 'function countVowels(s) {\n  const vowels = new Set([\'a\',\'e\',\'i\',\'o\',\'u\',\'A\',\'E\',\'I\',\'O\',\'U\']);\n  let count = 0;\n  for (let c of s) {\n    if (vowels.has(c)) count++;\n  }\n  return count;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    tips: [
      'Remember to handle both uppercase and lowercase.',
      'Use a set for O(1) lookup.',
      'Simple iteration is optimal.',
    ],
  },

  {
    id: 'check-anagram',
    title: 'Check Anagram',
    difficulty: 'Easy',
    topic: 'Strings',
    level: 1,
    problem:
      'Given two strings, determine if they are anagrams of each other (contain the same characters with the same frequencies).',
    examples: [
      { input: '"listen", "silent"', output: 'true', explanation: 'Both contain l,i,s,t,e,n with same frequencies.' },
      { input: '"hello", "world"', output: 'false', explanation: 'Character frequencies do not match.' },
    ],
    constraints: ['0 <= s.length, t.length <= 5 * 10^4', 's and t consist of lowercase English letters'],
    intuition:
      'If lengths differ, return false. Count character frequencies in one string, then decrement counts for the other. If all counts are zero at the end, they are anagrams.',
    pseudocode: [
      'function isAnagram(s, t):',
      '  if s.length != t.length: return false',
      '  count = [0] * 26',
      '  for i = 0 to s.length - 1:',
      '    count[s[i] - "a"]++',
      '    count[t[i] - "a"]--',
      '  return all count[i] == 0',
    ],
    dryRun: {
      text: 'Check if "listen" and "silent" are anagrams.',
      steps: [
        { title: 'Check lengths', content: 'Both length 6 -> continue' },
        { title: 'Process "listen", "silent"', content: 'Increment for l,i,s,t,e,n, decrement for s,i,l,e,n,t' },
        { title: 'Result', content: 'All counts are zero -> true' },
      ],
    },
    starterCode: {
      cpp: '#include <string>\n#include <vector>\nusing namespace std;\n\nbool isAnagram(string s, string t) {\n  if (s.size() != t.size()) return false;\n  vector<int> count(26, 0);\n  for (int i = 0; i < s.size(); i++) {\n    count[s[i] - \'a\']++;\n    count[t[i] - \'a\']--;\n  }\n  for (int c : count) if (c != 0) return false;\n  return true;\n}',
      javascript: 'function isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  const count = Array(26).fill(0);\n  for (let i = 0; i < s.length; i++) {\n    count[s.charCodeAt(i) - 97]++;\n    count[t.charCodeAt(i) - 97]--;\n  }\n  return count.every(c => c === 0);\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    tips: [
      'Using a size-26 array is more efficient than a hash map for lowercase letters.',
      'Early exit on length mismatch.',
      'For Unicode, use a hash map instead.',
    ],
  },

  {
    id: 'remove-duplicate-chars',
    title: 'Remove Duplicate Characters',
    difficulty: 'Easy',
    topic: 'Strings',
    level: 1,
    problem:
      'Given a string, remove all duplicate characters, keeping only the first occurrence of each character. Return the resulting string.',
    examples: [
      { input: '"programming"', output: '"progamin"', explanation: 'Repeated characters (r, g, m) appear only once in order of first occurrence.' },
      { input: '"aaaa"', output: '"a"', explanation: 'Only one a is kept.' },
    ],
    constraints: ['0 <= s.length <= 10^5', 's consists of printable ASCII characters'],
    intuition:
      'Use a boolean array or set to track seen characters. Iterate through the string and append characters that have not been seen before, marking them as seen.',
    pseudocode: [
      'function removeDuplicateChars(s):',
      '  seen = {}',
      '  result = ""',
      '  for each char c in s:',
      '    if c not in seen:',
      '      seen.add(c)',
      '      result = result + c',
      '  return result',
    ],
    dryRun: {
      text: 'Remove duplicates from "programming".',
      steps: [
        { title: 'Start', content: 'seen = {}, result = ""' },
        { title: 'c = p', content: 'not seen -> result = "p", seen = {p}' },
        { title: 'c = r', content: 'not seen -> result = "pr", seen.add(r)' },
        { title: 'c = o', content: 'not seen -> result = "pro", seen.add(o)' },
        { title: 'c = g', content: 'not seen -> result = "prog", seen.add(g)' },
        { title: 'c = r', content: 'already seen -> skip' },
        { title: 'c = a', content: 'not seen -> result = "proga", seen.add(a)' },
        { title: 'c = m', content: 'not seen -> result = "progam", seen.add(m)' },
        { title: 'c = m', content: 'already seen -> skip' },
        { title: 'c = i', content: 'not seen -> result = "progami", seen.add(i)' },
        { title: 'c = n', content: 'not seen -> result = "progamin", seen.add(n)' },
        { title: 'c = g', content: 'already seen -> skip' },
        { title: 'Final', content: '"progamin"' },
      ],
    },
    starterCode: {
      cpp: '#include <string>\n#include <unordered_set>\nusing namespace std;\n\nstring removeDuplicateChars(string s) {\n  unordered_set<char> seen;\n  string result;\n  for (char c : s) {\n    if (seen.find(c) == seen.end()) {\n      seen.insert(c);\n      result.push_back(c);\n    }\n  }\n  return result;\n}',
      javascript: 'function removeDuplicateChars(s) {\n  const seen = new Set();\n  let result = \'\';\n  for (let c of s) {\n    if (!seen.has(c)) {\n      seen.add(c);\n      result += c;\n    }\n  }\n  return result;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(min(n, k))' },
    tips: [
      'Order of first occurrence must be preserved.',
      'Use a set for O(1) lookup.',
      'Build the result string efficiently.',
    ],
  },

  {
    id: 'reverse-words',
    title: 'Reverse Words in a String',
    difficulty: 'Medium',
    topic: 'Strings',
    level: 1,
    problem:
      'Given a string of words separated by spaces, reverse the order of the words. Remove any extra spaces so that only single spaces separate words.',
    examples: [
      { input: '"the sky is blue"', output: '"blue is sky the"', explanation: 'Word order is reversed with single spaces.' },
      { input: '"  hello world  "', output: '"world hello"', explanation: 'Leading/trailing spaces are removed.' },
    ],
    constraints: ['0 <= s.length <= 10^4', 's consists of English letters and spaces'],
    intuition:
      'Split the string by spaces, filter out empty strings (from multiple spaces), reverse the array of words, and join them back with a single space.',
    pseudocode: [
      'function reverseWords(s):',
      '  words = s.trim().split(/\\\\s+/)',
      '  reverse(words)',
      '  return words.join(" ")',
    ],
    dryRun: {
      text: 'Reverse words in "the sky is blue".',
      steps: [
        { title: 'Trim and split', content: '["the", "sky", "is", "blue"]' },
        { title: 'Reverse', content: '["blue", "is", "sky", "the"]' },
        { title: 'Join', content: '"blue is sky the"' },
      ],
    },
    starterCode: {
      cpp: '#include <string>\n#include <sstream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nstring reverseWords(string s) {\n  istringstream iss(s);\n  vector<string> words;\n  string w;\n  while (iss >> w) words.push_back(w);\n  reverse(words.begin(), words.end());\n  string result;\n  for (size_t i = 0; i < words.size(); i++) {\n    if (i > 0) result += " ";\n    result += words[i];\n  }\n  return result;\n}',
      javascript: 'function reverseWords(s) {\n  return s.trim().split(/\\s+/).reverse().join(\' \');\n}',
    },
    complexity: { time: 'O(n)', space: 'O(n)' },
    tips: [
      'Use split with regex for multiple spaces.',
      'Trim leading/trailing spaces first.',
      'C++ stringstream handles space-delimited extraction naturally.',
    ],
  },

  {
    id: 'longest-common-prefix',
    title: 'Longest Common Prefix',
    difficulty: 'Easy',
    topic: 'Strings',
    level: 1,
    problem:
      'Given an array of strings, find the longest common prefix shared by all strings. If no common prefix exists, return an empty string.',
    examples: [
      { input: '["flower", "flow", "flight"]', output: '"fl"', explanation: '"fl" is the common prefix of all three strings.' },
      { input: '["dog", "racecar", "car"]', output: '""', explanation: 'No common prefix exists.' },
    ],
    constraints: ['1 <= strs.length <= 200', '0 <= strs[i].length <= 200', 'strs[i] consists of lowercase English letters'],
    intuition:
      'Start by assuming the first string is the prefix. For each subsequent string, reduce the prefix until it matches the start of that string. If the prefix becomes empty at any point, return empty string.',
    pseudocode: [
      'function longestCommonPrefix(strs):',
      '  if strs is empty: return ""',
      '  prefix = strs[0]',
      '  for i = 1 to strs.length - 1:',
      '    while strs[i].indexOf(prefix) != 0:',
      '      prefix = prefix[0..len-2]',
      '      if prefix is empty: return ""',
      '  return prefix',
    ],
    dryRun: {
      text: 'Find longest common prefix of ["flower", "flow", "flight"].',
      steps: [
        { title: 'Initialize', content: 'prefix = "flower"' },
        { title: 'Compare with "flow"', content: '"flower" -> "flowe" -> "flow" -> matches! prefix = "flow"' },
        { title: 'Compare with "flight"', content: '"flow" -> "flo" -> "fl" -> matches! prefix = "fl"' },
        { title: 'Result', content: '"fl"' },
      ],
    },
    starterCode: {
      cpp: '#include <string>\n#include <vector>\nusing namespace std;\n\nstring longestCommonPrefix(vector<string>& strs) {\n  if (strs.empty()) return "";\n  string prefix = strs[0];\n  for (int i = 1; i < strs.size(); i++) {\n    while (strs[i].find(prefix) != 0) {\n      prefix.pop_back();\n      if (prefix.empty()) return "";\n    }\n  }\n  return prefix;\n}',
      javascript: 'function longestCommonPrefix(strs) {\n  if (strs.length === 0) return \'\';\n  let prefix = strs[0];\n  for (let i = 1; i < strs.length; i++) {\n    while (strs[i].indexOf(prefix) !== 0) {\n      prefix = prefix.slice(0, -1);\n      if (prefix === \'\') return \'\';\n    }\n  }\n  return prefix;\n}',
    },
    complexity: { time: 'O(n * m)', space: 'O(1)' },
    tips: [
      'Start with the first string as the prefix.',
      'Reduce the prefix character by character until it matches.',
      'The prefix length is bounded by the shortest string.',
    ],
  },

  {
    id: 'first-unique-character',
    title: 'First Unique Character',
    difficulty: 'Easy',
    topic: 'Strings',
    level: 1,
    problem:
      'Given a string, find the index of the first non-repeating character. If no unique character exists, return -1.',
    examples: [
      { input: '"leetcode"', output: '0', explanation: 'Character l at index 0 is the first non-repeating character.' },
      { input: '"aabb"', output: '-1', explanation: 'All characters repeat, so no unique character exists.' },
    ],
    constraints: ['1 <= s.length <= 10^5', 's consists of lowercase English letters'],
    intuition:
      'First pass: count frequencies of all characters. Second pass: find the first character with frequency 1 and return its index.',
    pseudocode: [
      'function firstUniqueChar(s):',
      '  freq = [0] * 26',
      '  for each char c in s:',
      '    freq[c - "a"]++',
      '  for i = 0 to s.length - 1:',
      '    if freq[s[i] - "a"] == 1: return i',
      '  return -1',
    ],
    dryRun: {
      text: 'Find first unique character in "leetcode".',
      steps: [
        { title: 'Count frequencies', content: 'l:1, e:3, t:1, c:1, o:1, d:1' },
        { title: 'Scan for first with count 1', content: 'i=0 l->count=1 -> return 0' },
      ],
    },
    starterCode: {
      cpp: '#include <string>\n#include <vector>\nusing namespace std;\n\nint firstUniqueChar(string s) {\n  vector<int> freq(26, 0);\n  for (char c : s) freq[c - \'a\']++;\n  for (int i = 0; i < s.size(); i++) {\n    if (freq[s[i] - \'a\'] == 1) return i;\n  }\n  return -1;\n}',
      javascript: 'function firstUniqueChar(s) {\n  const freq = Array(26).fill(0);\n  for (let c of s) freq[c.charCodeAt(0) - 97]++;\n  for (let i = 0; i < s.length; i++) {\n    if (freq[s.charCodeAt(i) - 97] === 1) return i;\n  }\n  return -1;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    tips: [
      'Two-pass solution is optimal.',
      'Use an array of size 26 for lowercase letters.',
      'For broader character sets, use a hash map.',
    ],
  },

  {
    id: 'string-compression',
    title: 'String Compression',
    difficulty: 'Medium',
    topic: 'Strings',
    level: 1,
    problem:
      'Compress a string by replacing consecutive repeated characters with the character followed by its count. If the compressed string is not shorter, return the original string.',
    examples: [
      { input: '"aabcccccaaa"', output: '"a2b1c5a3"', explanation: 'a appears 2 times, b appears 1, c appears 5, a appears 3.' },
      { input: '"abc"', output: '"abc"', explanation: 'Compressed "a1b1c1" is longer, so original is returned.' },
    ],
    constraints: ['0 <= s.length <= 10^5', 's consists of uppercase and lowercase English letters'],
    intuition:
      'Iterate through the string, counting consecutive occurrences of each character. When a different character is encountered, append the character and its count to the result. At the end, return the shorter of original and compressed strings.',
    pseudocode: [
      'function compress(s):',
      '  if s is empty: return ""',
      '  result = ""',
      '  count = 1',
      '  for i = 1 to s.length:',
      '    if i == s.length or s[i] != s[i-1]:',
      '      result = result + s[i-1] + count',
      '      count = 1',
      '    else: count++',
      '  return result.length < s.length ? result : s',
    ],
    dryRun: {
      text: 'Compress "aabcccccaaa".',
      steps: [
        { title: 'Start', content: 'result = "", count = 1' },
        { title: 'i=1: s[1]=a == s[0]=a', content: 'count = 2' },
        { title: 'i=2: s[2]=b != s[1]=a', content: 'result = "a2", count = 1' },
        { title: 'i=3: s[3]=c != s[2]=b', content: 'result = "a2b1", count = 1' },
        { title: 'i=4: c==c', content: 'count = 2' },
        { title: 'i=5: c==c', content: 'count = 3' },
        { title: 'i=6: c==c', content: 'count = 4' },
        { title: 'i=7: c==c', content: 'count = 5' },
        { title: 'i=8: a != c', content: 'result = "a2b1c5", count = 1' },
        { title: 'i=9: a==a', content: 'count = 2' },
        { title: 'i=10: end', content: 'result = "a2b1c5a3", original longer -> return "a2b1c5a3"' },
      ],
    },
    starterCode: {
      cpp: '#include <string>\nusing namespace std;\n\nstring compress(string s) {\n  if (s.empty()) return "";\n  string result;\n  int count = 1;\n  for (int i = 1; i <= s.size(); i++) {\n    if (i == s.size() || s[i] != s[i - 1]) {\n      result += s[i - 1] + to_string(count);\n      count = 1;\n    } else {\n      count++;\n    }\n  }\n  return result.size() < s.size() ? result : s;\n}',
      javascript: 'function compress(s) {\n  if (s.length === 0) return \'\';\n  let result = \'\', count = 1;\n  for (let i = 1; i <= s.length; i++) {\n    if (i === s.length || s[i] !== s[i - 1]) {\n      result += s[i - 1] + count;\n      count = 1;\n    } else {\n      count++;\n    }\n  }\n  return result.length < s.length ? result : s;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(n)' },
    tips: [
      'Iterate one position ahead to detect character changes.',
      'Always check if compressed is shorter before returning.',
      'Single character counts are still written as c1.',
    ],
  },

  // ---------- Loops & Math (10) ----------
  {
    id: 'fibonacci',
    title: 'Fibonacci Sequence',
    difficulty: 'Easy',
    topic: 'Loops & Math',
    level: 1,
    problem:
      'Generate the first n Fibonacci numbers where F(0)=0, F(1)=1, and F(n)=F(n-1)+F(n-2). Return them as an array.',
    examples: [
      { input: 'n = 5', output: '[0, 1, 1, 2, 3]', explanation: 'First 5 Fibonacci numbers starting from F(0).' },
      { input: 'n = 1', output: '[0]', explanation: 'Only F(0) is included.' },
    ],
    constraints: ['1 <= n <= 10^5'],
    intuition:
      'Use a loop to iteratively compute each Fibonacci number by adding the previous two. Store results in an array or use variables depending on requirements.',
    pseudocode: [
      'function fibonacci(n):',
      '  if n <= 0: return []',
      '  result = [0]',
      '  if n == 1: return result',
      '  result.push(1)',
      '  for i = 2 to n - 1:',
      '    next = result[i-1] + result[i-2]',
      '    result.push(next)',
      '  return result',
    ],
    dryRun: {
      text: 'Generate first 5 Fibonacci numbers.',
      steps: [
        { title: 'Initialize', content: 'result = [0]' },
        { title: 'n == 1?', content: 'No -> push 1 -> result = [0,1]' },
        { title: 'i = 2', content: 'next = 1+0 = 1 -> result = [0,1,1]' },
        { title: 'i = 3', content: 'next = 1+1 = 2 -> result = [0,1,1,2]' },
        { title: 'i = 4', content: 'next = 2+1 = 3 -> result = [0,1,1,2,3]' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\nusing namespace std;\n\nvector<long long> fibonacci(int n) {\n  vector<long long> result;\n  if (n <= 0) return result;\n  result.push_back(0);\n  if (n == 1) return result;\n  result.push_back(1);\n  for (int i = 2; i < n; i++) {\n    result.push_back(result[i - 1] + result[i - 2]);\n  }\n  return result;\n}',
      javascript: 'function fibonacci(n) {\n  if (n <= 0) return [];\n  const result = [0];\n  if (n === 1) return result;\n  result.push(1);\n  for (let i = 2; i < n; i++) {\n    result.push(result[i - 1] + result[i - 2]);\n  }\n  return result;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(n)' },
    tips: [
      'Use long long in C++ to prevent overflow.',
      'F(0) = 0, F(1) = 1 by convention.',
      'Iterative approach is O(n) and avoids recursion overhead.',
    ],
  },

  {
    id: 'factorial',
    title: 'Factorial of a Number',
    difficulty: 'Easy',
    topic: 'Loops & Math',
    level: 1,
    problem:
      'Given a non-negative integer n, compute n! (n factorial), the product of all positive integers less than or equal to n.',
    examples: [
      { input: 'n = 5', output: '120', explanation: '5! = 5 * 4 * 3 * 2 * 1 = 120.' },
      { input: 'n = 0', output: '1', explanation: '0! is defined as 1.' },
    ],
    constraints: ['0 <= n <= 20 (fits in 64-bit integer)'],
    intuition:
      'Use a loop to multiply numbers from 1 to n. Start with result = 1 and multiply sequentially.',
    pseudocode: [
      'function factorial(n):',
      '  result = 1',
      '  for i = 2 to n:',
      '    result = result * i',
      '  return result',
    ],
    dryRun: {
      text: 'Compute 5! step by step.',
      steps: [
        { title: 'Initialize', content: 'result = 1' },
        { title: 'i = 2', content: 'result = 2' },
        { title: 'i = 3', content: 'result = 6' },
        { title: 'i = 4', content: 'result = 24' },
        { title: 'i = 5', content: 'result = 120' },
      ],
    },
    starterCode: {
      cpp: '#include <cstdint>\nusing namespace std;\n\nlong long factorial(int n) {\n  long long result = 1;\n  for (int i = 2; i <= n; i++) result *= i;\n  return result;\n}',
      javascript: 'function factorial(n) {\n  let result = 1;\n  for (let i = 2; i <= n; i++) result *= i;\n  return result;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    tips: [
      'n! grows very fast - use 64-bit integer for n <= 20.',
      '0! = 1 by convention.',
      'For very large n, use BigInt (JS) or arbitrary precision libraries.',
    ],
  },

  {
    id: 'prime-number',
    title: 'Check Prime Number',
    difficulty: 'Easy',
    topic: 'Loops & Math',
    level: 1,
    problem:
      'Given a positive integer n, determine if it is a prime number. A prime number is greater than 1 and has exactly two divisors: 1 and itself.',
    examples: [
      { input: 'n = 7', output: 'true', explanation: '7 is only divisible by 1 and 7.' },
      { input: 'n = 10', output: 'false', explanation: '10 is divisible by 2 and 5.' },
    ],
    constraints: ['1 <= n <= 10^9'],
    intuition:
      'Check divisibility up to sqrt(n). If n is divisible by any number from 2 to sqrt(n), it is not prime. Numbers less than 2 are not prime.',
    pseudocode: [
      'function isPrime(n):',
      '  if n < 2: return false',
      '  if n == 2: return true',
      '  if n % 2 == 0: return false',
      '  for i = 3 to sqrt(n) step 2:',
      '    if n % i == 0: return false',
      '  return true',
    ],
    dryRun: {
      text: 'Check if 7 is prime.',
      steps: [
        { title: 'n = 7', content: 'n >= 2, n != 2, n % 2 != 0' },
        { title: 'Check i=3', content: 'sqrt(7) ~ 2.6, i=3 > 2.6 -> loop not entered' },
        { title: 'Result', content: 'true -> 7 is prime' },
      ],
    },
    starterCode: {
      cpp: '#include <cmath>\nusing namespace std;\n\nbool isPrime(int n) {\n  if (n < 2) return false;\n  if (n == 2) return true;\n  if (n % 2 == 0) return false;\n  for (int i = 3; i <= sqrt(n); i += 2) {\n    if (n % i == 0) return false;\n  }\n  return true;\n}',
      javascript: 'function isPrime(n) {\n  if (n < 2) return false;\n  if (n === 2) return true;\n  if (n % 2 === 0) return false;\n  for (let i = 3; i <= Math.sqrt(n); i += 2) {\n    if (n % i === 0) return false;\n  }\n  return true;\n}',
    },
    complexity: { time: 'O(sqrt(n))', space: 'O(1)' },
    tips: [
      'Only need to check up to sqrt(n).',
      'Handle n < 2 and even numbers separately for efficiency.',
      'Increment by 2 after handling 2 separately.',
    ],
  },

  {
    id: 'armstrong-number',
    title: 'Check Armstrong Number',
    difficulty: 'Easy',
    topic: 'Loops & Math',
    level: 1,
    problem:
      'Given a positive integer n, determine if it is an Armstrong number. An Armstrong number is a number where the sum of its digits raised to the power of the number of digits equals the number itself.',
    examples: [
      { input: 'n = 153', output: 'true', explanation: '1^3 + 5^3 + 3^3 = 1 + 125 + 27 = 153.' },
      { input: 'n = 9474', output: 'true', explanation: '9^4 + 4^4 + 7^4 + 4^4 = 6561 + 256 + 2401 + 256 = 9474.' },
    ],
    constraints: ['1 <= n <= 10^9'],
    intuition:
      'Count the number of digits first. Then extract each digit, raise it to the power of the digit count, sum the results, and compare with the original number.',
    pseudocode: [
      'function isArmstrong(n):',
      '  digits = count of digits in n',
      '  sum = 0, temp = n',
      '  while temp > 0:',
      '    digit = temp % 10',
      '    sum = sum + digit^digits',
      '    temp = temp / 10',
      '  return sum == n',
    ],
    dryRun: {
      text: 'Check if 153 is an Armstrong number.',
      steps: [
        { title: 'Digit count', content: '153 has 3 digits' },
        { title: 'Extract 3', content: 'sum = 0 + 3^3 = 27, temp = 15' },
        { title: 'Extract 5', content: 'sum = 27 + 5^3 = 152, temp = 1' },
        { title: 'Extract 1', content: 'sum = 152 + 1^3 = 153, temp = 0' },
        { title: 'Result', content: 'sum (153) == n (153) -> true' },
      ],
    },
    starterCode: {
      cpp: '#include <cmath>\nusing namespace std;\n\nbool isArmstrong(int n) {\n  int digits = 0, temp = n;\n  while (temp) { digits++; temp /= 10; }\n  temp = n;\n  int sum = 0;\n  while (temp) {\n    int digit = temp % 10;\n    sum += pow(digit, digits);\n    temp /= 10;\n  }\n  return sum == n;\n}',
      javascript: 'function isArmstrong(n) {\n  const digits = String(n).length;\n  let sum = 0, temp = n;\n  while (temp > 0) {\n    const digit = temp % 10;\n    sum += Math.pow(digit, digits);\n    temp = Math.floor(temp / 10);\n  }\n  return sum === n;\n}',
    },
    complexity: { time: 'O(log n)', space: 'O(1)' },
    tips: [
      'Count digits first, then compute sum of powers.',
      'Use math functions for exponentiation.',
      'Also known as Narcissistic numbers.',
    ],
  },

  {
    id: 'palindrome-number',
    title: 'Palindrome Number',
    difficulty: 'Easy',
    topic: 'Loops & Math',
    level: 1,
    problem:
      'Given an integer x, return true if it is a palindrome integer (reads the same forwards and backwards). Negative numbers are not palindromes.',
    examples: [
      { input: 'x = 121', output: 'true', explanation: '121 reads as 121 from left to right and right to left.' },
      { input: 'x = -121', output: 'false', explanation: 'Negative numbers are not palindromes because of the minus sign.' },
    ],
    constraints: ['-2^31 <= x <= 2^31 - 1'],
    intuition:
      'Negative numbers are not palindromes. Reverse half of the number and compare with the other half. This avoids overflow issues of reversing the entire number.',
    pseudocode: [
      'function isPalindrome(x):',
      '  if x < 0 or (x % 10 == 0 and x != 0): return false',
      '  reversed = 0',
      '  while x > reversed:',
      '    reversed = reversed * 10 + x % 10',
      '    x = x / 10',
      '  return x == reversed or x == reversed / 10',
    ],
    dryRun: {
      text: 'Check if 1221 is a palindrome.',
      steps: [
        { title: 'Initialize', content: 'x = 1221, reversed = 0' },
        { title: 'Iteration 1', content: 'reversed = 1, x = 122' },
        { title: 'Iteration 2', content: 'reversed = 12, x = 12' },
        { title: 'Loop ends', content: 'x (12) > reversed (12)? No' },
        { title: 'Compare', content: 'x == reversed -> 12 == 12 -> true' },
      ],
    },
    starterCode: {
      cpp: '#include <cstdint>\nusing namespace std;\n\nbool isPalindrome(int x) {\n  if (x < 0 || (x % 10 == 0 && x != 0)) return false;\n  int reversed = 0;\n  while (x > reversed) {\n    reversed = reversed * 10 + x % 10;\n    x /= 10;\n  }\n  return x == reversed || x == reversed / 10;\n}',
      javascript: 'function isPalindrome(x) {\n  if (x < 0 || (x % 10 === 0 && x !== 0)) return false;\n  let reversed = 0;\n  while (x > reversed) {\n    reversed = reversed * 10 + x % 10;\n    x = Math.floor(x / 10);\n  }\n  return x === reversed || x === Math.floor(reversed / 10);\n}',
    },
    complexity: { time: 'O(log10 n)', space: 'O(1)' },
    tips: [
      'Reversing only half avoids integer overflow.',
      'Negative numbers are never palindromes.',
      'Numbers ending in 0 (except 0 itself) are never palindromes.',
    ],
  },

  {
    id: 'gcd',
    title: 'GCD of Two Numbers',
    difficulty: 'Easy',
    topic: 'Loops & Math',
    level: 1,
    problem:
      'Given two positive integers a and b, find their greatest common divisor (GCD) - the largest positive integer that divides both without leaving a remainder.',
    examples: [
      { input: 'a = 12, b = 18', output: '6', explanation: '6 divides both 12 and 18, and no larger number does.' },
      { input: 'a = 100, b = 10', output: '10', explanation: '10 divides both 100 and 10.' },
    ],
    constraints: ['1 <= a, b <= 10^9'],
    intuition:
      'Use the Euclidean algorithm: repeatedly replace the larger number by the remainder when dividing by the smaller number. When one becomes 0, the other is the GCD.',
    pseudocode: [
      'function gcd(a, b):',
      '  while b != 0:',
      '    temp = b',
      '    b = a % b',
      '    a = temp',
      '  return a',
    ],
    dryRun: {
      text: 'Find GCD of 12 and 18.',
      steps: [
        { title: 'Start', content: 'a = 12, b = 18' },
        { title: 'Iteration 1', content: 'temp = 18, b = 12 % 18 = 12, a = 18' },
        { title: 'Iteration 2', content: 'temp = 12, b = 18 % 12 = 6, a = 12' },
        { title: 'Iteration 3', content: 'temp = 6, b = 12 % 6 = 0, a = 6' },
        { title: 'b == 0', content: 'return a = 6' },
      ],
    },
    starterCode: {
      cpp: 'using namespace std;\n\nint gcd(int a, int b) {\n  while (b != 0) {\n    int temp = b;\n    b = a % b;\n    a = temp;\n  }\n  return a;\n}',
      javascript: 'function gcd(a, b) {\n  while (b !== 0) {\n    const temp = b;\n    b = a % b;\n    a = temp;\n  }\n  return a;\n}',
    },
    complexity: { time: 'O(log min(a, b))', space: 'O(1)' },
    tips: [
      'Euclidean algorithm is exponentially faster than iterating through divisors.',
      'GCD(a, b) = GCD(b, a % b).',
      'Built-in: __gcd (C++), or implement yourself.',
    ],
  },

  {
    id: 'lcm',
    title: 'LCM of Two Numbers',
    difficulty: 'Easy',
    topic: 'Loops & Math',
    level: 1,
    problem:
      'Given two positive integers a and b, find their least common multiple (LCM) - the smallest positive integer that is divisible by both a and b.',
    examples: [
      { input: 'a = 4, b = 6', output: '12', explanation: '12 is the smallest number divisible by both 4 and 6.' },
      { input: 'a = 7, b = 5', output: '35', explanation: '7 and 5 are coprime, so LCM is their product.' },
    ],
    constraints: ['1 <= a, b <= 10^6'],
    intuition:
      'LCM can be computed using GCD: LCM(a, b) = (a * b) / GCD(a, b). First compute GCD using the Euclidean algorithm, then compute LCM.',
    pseudocode: [
      'function lcm(a, b):',
      '  gcdVal = gcd(a, b)',
      '  return (a / gcdVal) * b',
    ],
    dryRun: {
      text: 'Find LCM of 4 and 6.',
      steps: [
        { title: 'Compute GCD', content: 'gcd(4,6) = 2' },
        { title: 'LCM formula', content: '(4 / 2) * 6 = 2 * 6 = 12' },
      ],
    },
    starterCode: {
      cpp: 'using namespace std;\n\nint gcd(int a, int b) {\n  while (b) { int t = b; b = a % b; a = t; }\n  return a;\n}\n\nint lcm(int a, int b) {\n  return (a / gcd(a, b)) * b;\n}',
      javascript: 'function lcm(a, b) {\n  const gcd = (x, y) => {\n    while (y) { const t = y; y = x % y; x = t; }\n    return x;\n  };\n  return (a / gcd(a, b)) * b;\n}',
    },
    complexity: { time: 'O(log min(a, b))', space: 'O(1)' },
    tips: [
      'Divide first (a / gcd) before multiplying to reduce overflow risk.',
      'Relies on Euclidean algorithm for GCD.',
      'LCM * GCD = a * b for positive integers.',
    ],
  },

  {
    id: 'power-function',
    title: 'Power Function (x^n)',
    difficulty: 'Medium',
    topic: 'Loops & Math',
    level: 1,
    problem:
      'Implement pow(x, n), which calculates x raised to the power n. Handle both positive and negative exponents.',
    examples: [
      { input: 'x = 2, n = 10', output: '1024', explanation: '2^10 = 1024.' },
      { input: 'x = 2, n = -2', output: '0.25', explanation: '2^(-2) = 1/4 = 0.25.' },
    ],
    constraints: ['-100.0 < x < 100.0', '-2^31 <= n <= 2^31 - 1', 'n is a 32-bit integer'],
    intuition:
      'Use binary exponentiation (fast power): repeatedly square x and multiply into result when the corresponding bit of n is set. For negative n, compute for -n and take reciprocal.',
    pseudocode: [
      'function myPow(x, n):',
      '  if n < 0: x = 1/x, n = -n',
      '  result = 1',
      '  while n > 0:',
      '    if n % 2 == 1: result = result * x',
      '    x = x * x',
      '    n = n / 2',
      '  return result',
    ],
    dryRun: {
      text: 'Compute 2^10 using binary exponentiation.',
      steps: [
        { title: 'Initialize', content: 'x = 2, n = 10, result = 1' },
        { title: 'n=10 (even)', content: 'x = 4, n = 5 (no multiplication)' },
        { title: 'n=5 (odd)', content: 'result = 4, x = 16, n = 2' },
        { title: 'n=2 (even)', content: 'x = 256, n = 1 (no multiplication)' },
        { title: 'n=1 (odd)', content: 'result = 4 * 256 = 1024, x = 65536, n = 0' },
        { title: 'Result', content: '1024' },
      ],
    },
    starterCode: {
      cpp: '#include <cstdint>\nusing namespace std;\n\ndouble myPow(double x, long long n) {\n  if (n < 0) { x = 1.0 / x; n = -n; }\n  double result = 1.0;\n  while (n) {\n    if (n & 1) result *= x;\n    x *= x;\n    n >>= 1;\n  }\n  return result;\n}',
      javascript: 'function myPow(x, n) {\n  if (n < 0) { x = 1 / x; n = -n; }\n  let result = 1;\n  while (n > 0) {\n    if (n & 1) result *= x;\n    x *= x;\n    n = Math.floor(n / 2);\n  }\n  return result;\n}',
    },
    complexity: { time: 'O(log n)', space: 'O(1)' },
    tips: [
      'Use long long in C++ to handle n = INT_MIN safely.',
      'Binary exponentiation is O(log n) instead of O(n).',
      'Handle negative exponents by taking reciprocal.',
    ],
  },

  {
    id: 'sum-of-digits',
    title: 'Sum of Digits',
    difficulty: 'Easy',
    topic: 'Loops & Math',
    level: 1,
    problem:
      'Given a positive integer n, compute the sum of its digits. Continue summing until a single digit is obtained (digital root).',
    examples: [
      { input: 'n = 12345', output: '6', explanation: '1+2+3+4+5 = 15, then 1+5 = 6.' },
      { input: 'n = 999', output: '9', explanation: '9+9+9 = 27, then 2+7 = 9.' },
    ],
    constraints: ['1 <= n <= 10^9'],
    intuition:
      'Repeatedly extract the last digit using modulo 10, add it to sum, and divide by 10. To get the digital root, repeat until the result is a single digit.',
    pseudocode: [
      'function sumOfDigits(n):',
      '  while n >= 10:',
      '    sum = 0',
      '    while n > 0:',
      '      sum = sum + n % 10',
      '      n = n / 10',
      '    n = sum',
      '  return n',
    ],
    dryRun: {
      text: 'Compute digital root of 12345.',
      steps: [
        { title: 'n = 12345', content: 'n >= 10' },
        { title: 'Sum digits', content: '1+2+3+4+5 = 15, n = 15' },
        { title: 'n = 15', content: 'n >= 10' },
        { title: 'Sum digits', content: '1+5 = 6, n = 6' },
        { title: 'Return', content: '6' },
      ],
    },
    starterCode: {
      cpp: 'using namespace std;\n\nint sumOfDigits(int n) {\n  while (n >= 10) {\n    int sum = 0;\n    while (n) { sum += n % 10; n /= 10; }\n    n = sum;\n  }\n  return n;\n}',
      javascript: 'function sumOfDigits(n) {\n  while (n >= 10) {\n    let sum = 0;\n    while (n > 0) { sum += n % 10; n = Math.floor(n / 10); }\n    n = sum;\n  }\n  return n;\n}',
    },
    complexity: { time: 'O(log n)', space: 'O(1)' },
    tips: [
      'Digital root can also be computed using modulo 9 formula.',
      'n % 10 extracts the last digit.',
      'n / 10 (integer division) removes the last digit.',
    ],
  },

  {
    id: 'reverse-number',
    title: 'Reverse a Number',
    difficulty: 'Easy',
    topic: 'Loops & Math',
    level: 1,
    problem:
      'Given a 32-bit signed integer, reverse its digits. If the reversed number overflows outside the 32-bit signed range, return 0.',
    examples: [
      { input: 'x = 123', output: '321', explanation: 'Digits reversed: 3,2,1.' },
      { input: 'x = -123', output: '-321', explanation: 'Negative sign preserved, digits reversed: 3,2,1.' },
    ],
    constraints: ['-2^31 <= x <= 2^31 - 1'],
    intuition:
      'Repeatedly extract the last digit using modulo and build the reversed number: rev = rev * 10 + digit. Check for overflow before each multiplication.',
    pseudocode: [
      'function reverse(x):',
      '  rev = 0',
      '  while x != 0:',
      '    digit = x % 10',
      '    x = x / 10',
      '    if rev > INT_MAX/10 or rev < INT_MIN/10: return 0',
      '    rev = rev * 10 + digit',
      '  return rev',
    ],
    dryRun: {
      text: 'Reverse 123.',
      steps: [
        { title: 'Initialize', content: 'x = 123, rev = 0' },
        { title: 'digit = 3', content: 'x = 12, rev = 0 * 10 + 3 = 3' },
        { title: 'digit = 2', content: 'x = 1, rev = 3 * 10 + 2 = 32' },
        { title: 'digit = 1', content: 'x = 0, rev = 32 * 10 + 1 = 321' },
        { title: 'Result', content: '321' },
      ],
    },
    starterCode: {
      cpp: '#include <climits>\nusing namespace std;\n\nint reverse(int x) {\n  int rev = 0;\n  while (x) {\n    int digit = x % 10;\n    x /= 10;\n    if (rev > INT_MAX / 10 || rev < INT_MIN / 10) return 0;\n    rev = rev * 10 + digit;\n  }\n  return rev;\n}',
      javascript: 'function reverse(x) {\n  const sign = x < 0 ? -1 : 1;\n  x = Math.abs(x);\n  let rev = 0;\n  while (x > 0) {\n    const digit = x % 10;\n    x = Math.floor(x / 10);\n    rev = rev * 10 + digit;\n  }\n  const result = sign * rev;\n  if (result > 2**31 - 1 || result < -(2**31)) return 0;\n  return result;\n}',
    },
    complexity: { time: 'O(log10 x)', space: 'O(1)' },
    tips: [
      'Check overflow before multiplying rev by 10.',
      'In C++, negative modulo yields negative digits - this is fine.',
      'Return 0 on overflow per problem specification.',
    ],
  },

  // ============================================================
  // LEVEL 2 - Very Common (15 questions)
  // ============================================================

  // ---------- Searching (5) ----------
  {
    id: 'linear-search',
    title: 'Linear Search',
    difficulty: 'Easy',
    topic: 'Searching',
    level: 2,
    problem:
      'Given an array of integers and a target value, find the index of the target in the array. If the target is not present, return -1. Perform a linear scan.',
    examples: [
      { input: 'arr = [4, 2, 7, 1, 9], target = 7', output: '2', explanation: '7 is found at index 2.' },
      { input: 'arr = [1, 2, 3], target = 5', output: '-1', explanation: '5 is not in the array.' },
    ],
    constraints: ['1 <= arr.length <= 10^5', '-10^9 <= arr[i] <= 10^9'],
    intuition:
      'Iterate through the array from index 0 to n-1 and compare each element with the target. Return the index when found, or -1 after the loop.',
    pseudocode: [
      'function linearSearch(arr, target):',
      '  for i = 0 to arr.length - 1:',
      '    if arr[i] == target: return i',
      '  return -1',
    ],
    dryRun: {
      text: 'Search target 7 in [4,2,7,1,9].',
      steps: [
        { title: 'i = 0', content: 'arr[0] = 4 != 7 -> continue' },
        { title: 'i = 1', content: 'arr[1] = 2 != 7 -> continue' },
        { title: 'i = 2', content: 'arr[2] = 7 == 7 -> return 2' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\nusing namespace std;\n\nint linearSearch(vector<int>& arr, int target) {\n  for (int i = 0; i < arr.size(); i++) {\n    if (arr[i] == target) return i;\n  }\n  return -1;\n}',
      javascript: 'function linearSearch(arr, target) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) return i;\n  }\n  return -1;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    tips: [
      'Linear search works on unsorted arrays.',
      'Time complexity is O(n) - optimal if array is unsorted.',
      'Returns the first occurrence index.',
    ],
  },

  {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: 'Easy',
    topic: 'Searching',
    level: 2,
    problem:
      'Given a sorted array of integers and a target value, find the index of the target using binary search. If not found, return -1.',
    examples: [
      { input: 'arr = [-1, 0, 3, 5, 9, 12], target = 9', output: '4', explanation: '9 is found at index 4.' },
      { input: 'arr = [-1, 0, 3, 5, 9, 12], target = 2', output: '-1', explanation: '2 is not in the array.' },
    ],
    constraints: ['1 <= arr.length <= 10^5', '-10^9 <= arr[i] <= 10^9', 'arr is sorted in ascending order'],
    intuition:
      'Maintain left and right pointers. At each step, check the middle element. If it matches, return the index. If the target is smaller, search the left half; otherwise, search the right half.',
    pseudocode: [
      'function binarySearch(arr, target):',
      '  left = 0, right = arr.length - 1',
      '  while left <= right:',
      '    mid = left + (right - left) / 2',
      '    if arr[mid] == target: return mid',
      '    if arr[mid] < target: left = mid + 1',
      '    else: right = mid - 1',
      '  return -1',
    ],
    dryRun: {
      text: 'Binary search for 9 in [-1,0,3,5,9,12].',
      steps: [
        { title: 'left=0, right=5', content: 'mid = 0 + (5-0)/2 = 2, arr[2]=3 < 9 -> left = 3' },
        { title: 'left=3, right=5', content: 'mid = 3 + (5-3)/2 = 4, arr[4]=9 == 9 -> return 4' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\nusing namespace std;\n\nint binarySearch(vector<int>& arr, int target) {\n  int left = 0, right = arr.size() - 1;\n  while (left <= right) {\n    int mid = left + (right - left) / 2;\n    if (arr[mid] == target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}',
      javascript: 'function binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    const mid = left + Math.floor((right - left) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}',
    },
    complexity: { time: 'O(log n)', space: 'O(1)' },
    tips: [
      'Array must be sorted for binary search to work.',
      'Use mid = left + (right - left) / 2 to avoid overflow.',
      'The loop condition is left <= right, not left < right.',
    ],
  },

  {
    id: 'first-occurrence',
    title: 'Find First Occurrence',
    difficulty: 'Easy',
    topic: 'Searching',
    level: 2,
    problem:
      'Given a sorted array with duplicates, find the index of the first occurrence of a target value. If the target is not found, return -1.',
    examples: [
      { input: 'arr = [1, 2, 2, 2, 3, 4], target = 2', output: '1', explanation: 'First 2 appears at index 1.' },
      { input: 'arr = [1, 1, 1, 1], target = 1', output: '0', explanation: 'First 1 appears at index 0.' },
    ],
    constraints: ['1 <= arr.length <= 10^5', '-10^9 <= arr[i] <= 10^9', 'arr is sorted in ascending order'],
    intuition:
      'Use binary search but modify the condition: when the target is found, continue searching the left half (by moving right to mid - 1) to find the first occurrence.',
    pseudocode: [
      'function firstOccurrence(arr, target):',
      '  left = 0, right = arr.length - 1, result = -1',
      '  while left <= right:',
      '    mid = left + (right - left) / 2',
      '    if arr[mid] == target:',
      '      result = mid',
      '      right = mid - 1',
      '    else if arr[mid] < target: left = mid + 1',
      '    else: right = mid - 1',
      '  return result',
    ],
    dryRun: {
      text: 'Find first occurrence of 2 in [1,2,2,2,3,4].',
      steps: [
        { title: 'left=0, right=5', content: 'mid=2, arr[2]=2 -> result=2, right=1' },
        { title: 'left=0, right=1', content: 'mid=0, arr[0]=1 < 2 -> left=1' },
        { title: 'left=1, right=1', content: 'mid=1, arr[1]=2 -> result=1, right=0' },
        { title: 'left > right', content: 'return result = 1' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\nusing namespace std;\n\nint firstOccurrence(vector<int>& arr, int target) {\n  int left = 0, right = arr.size() - 1, result = -1;\n  while (left <= right) {\n    int mid = left + (right - left) / 2;\n    if (arr[mid] == target) {\n      result = mid;\n      right = mid - 1;\n    } else if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return result;\n}',
      javascript: 'function firstOccurrence(arr, target) {\n  let left = 0, right = arr.length - 1, result = -1;\n  while (left <= right) {\n    const mid = left + Math.floor((right - left) / 2);\n    if (arr[mid] === target) {\n      result = mid;\n      right = mid - 1;\n    } else if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return result;\n}',
    },
    complexity: { time: 'O(log n)', space: 'O(1)' },
    tips: [
      'Same as binary search but continue left after a match.',
      'Standard variant for lower bound / first occurrence.',
      'Useful when duplicates exist in a sorted array.',
    ],
  },

  {
    id: 'last-occurrence',
    title: 'Find Last Occurrence',
    difficulty: 'Easy',
    topic: 'Searching',
    level: 2,
    problem:
      'Given a sorted array with duplicates, find the index of the last occurrence of a target value. If the target is not found, return -1.',
    examples: [
      { input: 'arr = [1, 2, 2, 2, 3, 4], target = 2', output: '3', explanation: 'Last 2 appears at index 3.' },
      { input: 'arr = [1, 1, 1, 1], target = 1', output: '3', explanation: 'Last 1 appears at index 3.' },
    ],
    constraints: ['1 <= arr.length <= 10^5', '-10^9 <= arr[i] <= 10^9', 'arr is sorted in ascending order'],
    intuition:
      'Use binary search but continue searching the right half when the target is found (by moving left to mid + 1) to find the last occurrence.',
    pseudocode: [
      'function lastOccurrence(arr, target):',
      '  left = 0, right = arr.length - 1, result = -1',
      '  while left <= right:',
      '    mid = left + (right - left) / 2',
      '    if arr[mid] == target:',
      '      result = mid',
      '      left = mid + 1',
      '    else if arr[mid] < target: left = mid + 1',
      '    else: right = mid - 1',
      '  return result',
    ],
    dryRun: {
      text: 'Find last occurrence of 2 in [1,2,2,2,3,4].',
      steps: [
        { title: 'left=0, right=5', content: 'mid=2, arr[2]=2 -> result=2, left=3' },
        { title: 'left=3, right=5', content: 'mid=4, arr[4]=3 > 2 -> right=3' },
        { title: 'left=3, right=3', content: 'mid=3, arr[3]=2 -> result=3, left=4' },
        { title: 'left > right', content: 'return result = 3' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\nusing namespace std;\n\nint lastOccurrence(vector<int>& arr, int target) {\n  int left = 0, right = arr.size() - 1, result = -1;\n  while (left <= right) {\n    int mid = left + (right - left) / 2;\n    if (arr[mid] == target) {\n      result = mid;\n      left = mid + 1;\n    } else if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return result;\n}',
      javascript: 'function lastOccurrence(arr, target) {\n  let left = 0, right = arr.length - 1, result = -1;\n  while (left <= right) {\n    const mid = left + Math.floor((right - left) / 2);\n    if (arr[mid] === target) {\n      result = mid;\n      left = mid + 1;\n    } else if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return result;\n}',
    },
    complexity: { time: 'O(log n)', space: 'O(1)' },
    tips: [
      'Same as first occurrence but continue right after a match.',
      'Standard variant for upper bound / last occurrence.',
      'The two (first + last) together define the range of target values.',
    ],
  },

  {
    id: 'search-in-sorted-array',
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Medium',
    topic: 'Searching',
    level: 2,
    problem:
      'Given a sorted array that has been rotated at an unknown pivot, find the index of a target value. If not found, return -1.',
    examples: [
      { input: 'arr = [4, 5, 6, 7, 0, 1, 2], target = 0', output: '4', explanation: '0 is at index 4 in the rotated array.' },
      { input: 'arr = [4, 5, 6, 7, 0, 1, 2], target = 3', output: '-1', explanation: '3 is not in the array.' },
    ],
    constraints: ['1 <= arr.length <= 10^5', '-10^4 <= arr[i] <= 10^4', 'All values are unique', 'arr is sorted and then rotated'],
    intuition:
      'Use modified binary search. Determine which half is sorted (left or right). Check if the target lies in the sorted half; if so, search there; otherwise, search the other half.',
    pseudocode: [
      'function searchRotated(arr, target):',
      '  left = 0, right = arr.length - 1',
      '  while left <= right:',
      '    mid = left + (right - left) / 2',
      '    if arr[mid] == target: return mid',
      '    if arr[left] <= arr[mid]:',
      '      if target >= arr[left] and target < arr[mid]: right = mid - 1',
      '      else: left = mid + 1',
      '    else:',
      '      if target > arr[mid] and target <= arr[right]: left = mid + 1',
      '      else: right = mid - 1',
      '  return -1',
    ],
    dryRun: {
      text: 'Search for 0 in [4,5,6,7,0,1,2].',
      steps: [
        { title: 'left=0, right=6', content: 'mid=3, arr[3]=7, arr[0]=4 <= 7 (left sorted), target 0 not in [4,7) -> left=4' },
        { title: 'left=4, right=6', content: 'mid=5, arr[5]=1, arr[4]=0 <= 1 (left sorted), target 0 in [0,1) -> right=4' },
        { title: 'left=4, right=4', content: 'mid=4, arr[4]=0 == target -> return 4' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\nusing namespace std;\n\nint searchRotated(vector<int>& arr, int target) {\n  int left = 0, right = arr.size() - 1;\n  while (left <= right) {\n    int mid = left + (right - left) / 2;\n    if (arr[mid] == target) return mid;\n    if (arr[left] <= arr[mid]) {\n      if (target >= arr[left] && target < arr[mid]) right = mid - 1;\n      else left = mid + 1;\n    } else {\n      if (target > arr[mid] && target <= arr[right]) left = mid + 1;\n      else right = mid - 1;\n    }\n  }\n  return -1;\n}',
      javascript: 'function searchRotated(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    const mid = left + Math.floor((right - left) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[left] <= arr[mid]) {\n      if (target >= arr[left] && target < arr[mid]) right = mid - 1;\n      else left = mid + 1;\n    } else {\n      if (target > arr[mid] && target <= arr[right]) left = mid + 1;\n      else right = mid - 1;\n    }\n  }\n  return -1;\n}',
    },
    complexity: { time: 'O(log n)', space: 'O(1)' },
    tips: [
      'Determine which half is sorted by comparing arr[left] and arr[mid].',
      'The sorted half can be used to decide search direction.',
      'Works with all unique elements - duplicates require a different approach.',
    ],
  },

  // ---------- Sorting (5) ----------
  {
    id: 'bubble-sort',
    title: 'Bubble Sort',
    difficulty: 'Easy',
    topic: 'Sorting',
    level: 2,
    problem:
      'Sort an array of integers in ascending order using the bubble sort algorithm. Repeatedly swap adjacent elements if they are in the wrong order.',
    examples: [
      { input: '[64, 34, 25, 12, 22, 11, 90]', output: '[11, 12, 22, 25, 34, 64, 90]', explanation: 'Sorted in ascending order using bubble sort.' },
      { input: '[5, 1, 4, 2, 8]', output: '[1, 2, 4, 5, 8]', explanation: 'Bubble sort with optimization for early exit.' },
    ],
    constraints: ['1 <= arr.length <= 10^3', '-10^5 <= arr[i] <= 10^5'],
    intuition:
      'In each pass, compare adjacent elements and swap if they are out of order. The largest element "bubbles up" to its correct position. Optimize by stopping early if no swaps occur in a pass.',
    pseudocode: [
      'function bubbleSort(arr):',
      '  n = arr.length',
      '  for i = 0 to n-2:',
      '    swapped = false',
      '    for j = 0 to n-2-i:',
      '      if arr[j] > arr[j+1]:',
      '        swap(arr[j], arr[j+1])',
      '        swapped = true',
      '    if not swapped: break',
      '  return arr',
    ],
    dryRun: {
      text: 'Bubble sort [5,1,4,2,8].',
      steps: [
        { title: 'Pass 1', content: 'Compare 5>1->swap -> [1,5,4,2,8], 5>4->swap -> [1,4,5,2,8], 5>2->swap -> [1,4,2,5,8], 5<8->no swap' },
        { title: 'Pass 2', content: '1<4->no swap, 4>2->swap -> [1,2,4,5,8], 4<5->no swap, 5<8->no swap' },
        { title: 'Pass 3', content: 'No swaps -> sorted' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvoid bubbleSort(vector<int>& arr) {\n  int n = arr.size();\n  for (int i = 0; i < n - 1; i++) {\n    bool swapped = false;\n    for (int j = 0; j < n - 1 - i; j++) {\n      if (arr[j] > arr[j + 1]) {\n        swap(arr[j], arr[j + 1]);\n        swapped = true;\n      }\n    }\n    if (!swapped) break;\n  }\n}',
      javascript: 'function bubbleSort(arr) {\n  const n = arr.length;\n  for (let i = 0; i < n - 1; i++) {\n    let swapped = false;\n    for (let j = 0; j < n - 1 - i; j++) {\n      if (arr[j] > arr[j + 1]) {\n        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n        swapped = true;\n      }\n    }\n    if (!swapped) break;\n  }\n  return arr;\n}',
    },
    complexity: { time: 'O(n^2)', space: 'O(1)' },
    tips: [
      'Optimize with a swapped flag for early termination.',
      'After each pass, the largest unsorted element is at the correct position.',
      'Simple but inefficient for large arrays.',
    ],
  },

  {
    id: 'selection-sort',
    title: 'Selection Sort',
    difficulty: 'Easy',
    topic: 'Sorting',
    level: 2,
    problem:
      'Sort an array of integers in ascending order using selection sort. Repeatedly find the minimum element from the unsorted part and place it at the beginning.',
    examples: [
      { input: '[64, 25, 12, 22, 11]', output: '[11, 12, 22, 25, 64]', explanation: 'Each iteration finds the minimum and swaps it to the front.' },
      { input: '[5, 3, 1, 2, 4]', output: '[1, 2, 3, 4, 5]', explanation: 'Sorted step by step via selection.' },
    ],
    constraints: ['1 <= arr.length <= 10^3', '-10^5 <= arr[i] <= 10^5'],
    intuition:
      'Divide the array into sorted and unsorted regions. In each iteration, find the smallest element in the unsorted region and swap it with the first unsorted element.',
    pseudocode: [
      'function selectionSort(arr):',
      '  n = arr.length',
      '  for i = 0 to n-2:',
      '    minIdx = i',
      '    for j = i+1 to n-1:',
      '      if arr[j] < arr[minIdx]: minIdx = j',
      '    if minIdx != i: swap(arr[i], arr[minIdx])',
      '  return arr',
    ],
    dryRun: {
      text: 'Selection sort [64,25,12,22,11].',
      steps: [
        { title: 'i=0', content: 'Find min from index 0-4: 11 at idx 4 -> swap(0,4) -> [11,25,12,22,64]' },
        { title: 'i=1', content: 'Find min from index 1-4: 12 at idx 2 -> swap(1,2) -> [11,12,25,22,64]' },
        { title: 'i=2', content: 'Find min from index 2-4: 22 at idx 3 -> swap(2,3) -> [11,12,22,25,64]' },
        { title: 'i=3', content: 'Find min from index 3-4: 25 at idx 3 -> no swap' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvoid selectionSort(vector<int>& arr) {\n  int n = arr.size();\n  for (int i = 0; i < n - 1; i++) {\n    int minIdx = i;\n    for (int j = i + 1; j < n; j++) {\n      if (arr[j] < arr[minIdx]) minIdx = j;\n    }\n    if (minIdx != i) swap(arr[i], arr[minIdx]);\n  }\n}',
      javascript: 'function selectionSort(arr) {\n  const n = arr.length;\n  for (let i = 0; i < n - 1; i++) {\n    let minIdx = i;\n    for (let j = i + 1; j < n; j++) {\n      if (arr[j] < arr[minIdx]) minIdx = j;\n    }\n    if (minIdx !== i) [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];\n  }\n  return arr;\n}',
    },
    complexity: { time: 'O(n^2)', space: 'O(1)' },
    tips: [
      'Always makes O(n) swaps - good when swapping is expensive.',
      'Not stable (may change relative order of equal elements).',
      'Always O(n^2) comparisons regardless of input.',
    ],
  },

  {
    id: 'insertion-sort',
    title: 'Insertion Sort',
    difficulty: 'Easy',
    topic: 'Sorting',
    level: 2,
    problem:
      'Sort an array of integers in ascending order using insertion sort. Build the sorted array one element at a time by inserting each element into its correct position.',
    examples: [
      { input: '[12, 11, 13, 5, 6]', output: '[5, 6, 11, 12, 13]', explanation: 'Each element is placed in correct position relative to already sorted elements.' },
      { input: '[2, 1]', output: '[1, 2]', explanation: '2 > 1, so they are swapped.' },
    ],
    constraints: ['1 <= arr.length <= 10^3', '-10^5 <= arr[i] <= 10^5'],
    intuition:
      'Start with the second element. Compare it with the elements before it, shifting larger elements to the right until the correct position is found. Insert the element there.',
    pseudocode: [
      'function insertionSort(arr):',
      '  for i = 1 to arr.length - 1:',
      '    key = arr[i]',
      '    j = i - 1',
      '    while j >= 0 and arr[j] > key:',
      '      arr[j+1] = arr[j]',
      '      j--',
      '    arr[j+1] = key',
      '  return arr',
    ],
    dryRun: {
      text: 'Insertion sort [12,11,13,5,6].',
      steps: [
        { title: 'i=1, key=11', content: 'j=0, 12 > 11 -> shift 12 right -> [12,12,13,5,6], arr[0]=11 -> [11,12,13,5,6]' },
        { title: 'i=2, key=13', content: 'j=1, 12 < 13 -> stop -> arr[2]=13 -> [11,12,13,5,6]' },
        { title: 'i=3, key=5', content: 'Shift 13,12,11 right -> [11,11,12,13,6] -> [5,11,12,13,6]' },
        { title: 'i=4, key=6', content: 'Shift 13,12,11 -> [5,11,11,12,13] -> arr[1]=6 -> [5,6,11,12,13]' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\nusing namespace std;\n\nvoid insertionSort(vector<int>& arr) {\n  int n = arr.size();\n  for (int i = 1; i < n; i++) {\n    int key = arr[i];\n    int j = i - 1;\n    while (j >= 0 && arr[j] > key) {\n      arr[j + 1] = arr[j];\n      j--;\n    }\n    arr[j + 1] = key;\n  }\n}',
      javascript: 'function insertionSort(arr) {\n  for (let i = 1; i < arr.length; i++) {\n    const key = arr[i];\n    let j = i - 1;\n    while (j >= 0 && arr[j] > key) {\n      arr[j + 1] = arr[j];\n      j--;\n    }\n    arr[j + 1] = key;\n  }\n  return arr;\n}',
    },
    complexity: { time: 'O(n^2)', space: 'O(1)' },
    tips: [
      'Efficient for small or nearly sorted arrays (O(n) in best case).',
      'Stable sort - maintains relative order of equal elements.',
      'Online algorithm - can sort as data arrives.',
    ],
  },

  {
    id: 'merge-sort',
    title: 'Merge Sort',
    difficulty: 'Medium',
    topic: 'Sorting',
    level: 2,
    problem:
      'Sort an array of integers in ascending order using merge sort. Use the divide-and-conquer approach: split the array into halves, sort recursively, then merge.',
    examples: [
      { input: '[38, 27, 43, 3, 9, 82, 10]', output: '[3, 9, 10, 27, 38, 43, 82]', explanation: 'Sorted using merge sort with O(n log n) time.' },
      { input: '[5, 2, 8, 1]', output: '[1, 2, 5, 8]', explanation: 'Simple case showing divide and conquer.' },
    ],
    constraints: ['1 <= arr.length <= 10^5', '-10^9 <= arr[i] <= 10^9'],
    intuition:
      'Divide the array into two halves recursively until each subarray has one element. Then merge the sorted subarrays back together by comparing elements and placing them in order.',
    pseudocode: [
      'function mergeSort(arr):',
      '  if arr.length <= 1: return arr',
      '  mid = arr.length / 2',
      '  left = mergeSort(arr[0..mid-1])',
      '  right = mergeSort(arr[mid..])',
      '  return merge(left, right)',
      '',
      'function merge(left, right):',
      '  result = [], i = 0, j = 0',
      '  while i < left.length and j < right.length:',
      '    if left[i] <= right[j]: result.push(left[i++])',
      '    else: result.push(right[j++])',
      '  result.push(...left[i..], ...right[j..])',
      '  return result',
    ],
    dryRun: {
      text: 'Merge sort [38,27,43,3].',
      steps: [
        { title: 'Divide', content: 'Split into [38,27] and [43,3]' },
        { title: 'Divide further', content: '[38] [27] [43] [3] (single elements)' },
        { title: 'Merge [38] & [27]', content: '27 < 38 -> [27,38]' },
        { title: 'Merge [43] & [3]', content: '3 < 43 -> [3,43]' },
        { title: 'Merge [27,38] & [3,43]', content: 'Compare: 3->[3], 27->[3,27], 38->[3,27,38], 43->[3,27,38,43]' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\nusing namespace std;\n\nvoid merge(vector<int>& arr, int l, int m, int r) {\n  vector<int> L(arr.begin() + l, arr.begin() + m + 1);\n  vector<int> R(arr.begin() + m + 1, arr.begin() + r + 1);\n  int i = 0, j = 0, k = l;\n  while (i < L.size() && j < R.size()) {\n    if (L[i] <= R[j]) arr[k++] = L[i++];\n    else arr[k++] = R[j++];\n  }\n  while (i < L.size()) arr[k++] = L[i++];\n  while (j < R.size()) arr[k++] = R[j++];\n}\n\nvoid mergeSort(vector<int>& arr, int l, int r) {\n  if (l >= r) return;\n  int m = l + (r - l) / 2;\n  mergeSort(arr, l, m);\n  mergeSort(arr, m + 1, r);\n  merge(arr, l, m, r);\n}',
      javascript: 'function mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  const mid = Math.floor(arr.length / 2);\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(mid));\n  return merge(left, right);\n}\n\nfunction merge(left, right) {\n  const result = [];\n  let i = 0, j = 0;\n  while (i < left.length && j < right.length) {\n    if (left[i] <= right[j]) result.push(left[i++]);\n    else result.push(right[j++]);\n  }\n  return result.concat(left.slice(i)).concat(right.slice(j));\n}',
    },
    complexity: { time: 'O(n log n)', space: 'O(n)' },
    tips: [
      'Stable sort - maintains relative order of equal elements.',
      'Always O(n log n) regardless of input.',
      'Uses O(n) extra space for merging.',
    ],
  },

  {
    id: 'quick-sort',
    title: 'Quick Sort',
    difficulty: 'Medium',
    topic: 'Sorting',
    level: 2,
    problem:
      'Sort an array of integers in ascending order using quick sort. Choose a pivot, partition the array so that elements less than pivot come before and greater come after, then recursively sort the subarrays.',
    examples: [
      { input: '[10, 7, 8, 9, 1, 5]', output: '[1, 5, 7, 8, 9, 10]', explanation: 'Sorted using quick sort with Lomuto partition scheme.' },
      { input: '[3, 1, 2]', output: '[1, 2, 3]', explanation: 'Quick sort on three elements.' },
    ],
    constraints: ['1 <= arr.length <= 10^5', '-10^9 <= arr[i] <= 10^9'],
    intuition:
      'Choose a pivot (e.g., last element). Partition the array such that all elements <= pivot are on the left, and all > pivot are on the right. Recursively sort the left and right partitions.',
    pseudocode: [
      'function quickSort(arr, low, high):',
      '  if low < high:',
      '    pivotIdx = partition(arr, low, high)',
      '    quickSort(arr, low, pivotIdx - 1)',
      '    quickSort(arr, pivotIdx + 1, high)',
      '',
      'function partition(arr, low, high):',
      '  pivot = arr[high]',
      '  i = low - 1',
      '  for j = low to high - 1:',
      '    if arr[j] <= pivot: i++, swap(arr[i], arr[j])',
      '  swap(arr[i+1], arr[high])',
      '  return i+1',
    ],
    dryRun: {
      text: 'Quick sort [10,7,8,9,1,5] with pivot = last element.',
      steps: [
        { title: 'Partition [10,7,8,9,1,5]', content: 'pivot=5, after partition: [1,5,8,9,10,7], pivotIdx=1' },
        { title: 'Left of pivot', content: 'quickSort([1]) -> [1]' },
        { title: 'Right of pivot', content: 'Partition [8,9,10,7] with pivot=7 -> [7,8,10,9], pivotIdx=0' },
        { title: 'Continue...', content: 'Eventually: [1,5,7,8,9,10]' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint partition(vector<int>& arr, int low, int high) {\n  int pivot = arr[high];\n  int i = low - 1;\n  for (int j = low; j < high; j++) {\n    if (arr[j] <= pivot) swap(arr[++i], arr[j]);\n  }\n  swap(arr[i + 1], arr[high]);\n  return i + 1;\n}\n\nvoid quickSort(vector<int>& arr, int low, int high) {\n  if (low < high) {\n    int pi = partition(arr, low, high);\n    quickSort(arr, low, pi - 1);\n    quickSort(arr, pi + 1, high);\n  }\n}',
      javascript: 'function quickSort(arr, low = 0, high = arr.length - 1) {\n  if (low < high) {\n    const pi = partition(arr, low, high);\n    quickSort(arr, low, pi - 1);\n    quickSort(arr, pi + 1, high);\n  }\n  return arr;\n}\n\nfunction partition(arr, low, high) {\n  const pivot = arr[high];\n  let i = low - 1;\n  for (let j = low; j < high; j++) {\n    if (arr[j] <= pivot) {\n      i++;\n      [arr[i], arr[j]] = [arr[j], arr[i]];\n    }\n  }\n  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];\n  return i + 1;\n}',
    },
    complexity: { time: 'O(n log n) average, O(n^2) worst', space: 'O(log n)' },
    tips: [
      'Average-case O(n log n), worst-case O(n^2) when pivot is always smallest/largest.',
      'In-place sorting with O(log n) stack space.',
      'Not stable - relative order of equal elements may change.',
    ],
  },

  // ---------- Recursion (5) ----------
  {
    id: 'recursive-factorial',
    title: 'Factorial using Recursion',
    difficulty: 'Easy',
    topic: 'Recursion',
    level: 2,
    problem:
      'Compute the factorial of a non-negative integer n using recursion. n! = n * (n-1)! with 0! = 1.',
    examples: [
      { input: 'n = 5', output: '120', explanation: '5! = 5 * 4 * 3 * 2 * 1 = 120.' },
      { input: 'n = 0', output: '1', explanation: '0! = 1 by definition.' },
    ],
    constraints: ['0 <= n <= 20'],
    intuition:
      'The recursive definition is: factorial(n) = 1 if n == 0, else n * factorial(n-1). Each recursive call reduces the problem size by 1 until the base case is reached.',
    pseudocode: [
      'function factorial(n):',
      '  if n <= 1: return 1',
      '  return n * factorial(n - 1)',
    ],
    dryRun: {
      text: 'Compute factorial(5) recursively.',
      steps: [
        { title: 'factorial(5)', content: '5 * factorial(4)' },
        { title: 'factorial(4)', content: '4 * factorial(3)' },
        { title: 'factorial(3)', content: '3 * factorial(2)' },
        { title: 'factorial(2)', content: '2 * factorial(1)' },
        { title: 'factorial(1)', content: '1 (base case)' },
        { title: 'Unwinding', content: '2*1=2, 3*2=6, 4*6=24, 5*24=120' },
      ],
    },
    starterCode: {
      cpp: 'using namespace std;\n\nlong long factorial(int n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}',
      javascript: 'function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}',
    },
    complexity: { time: 'O(n)', space: 'O(n)' },
    tips: [
      'Base case: n == 0 or n == 1 returns 1.',
      'Recursive calls consume stack space O(n).',
      'For large n, use iteration to avoid stack overflow.',
    ],
  },

  {
    id: 'recursive-fibonacci',
    title: 'Fibonacci using Recursion',
    difficulty: 'Easy',
    topic: 'Recursion',
    level: 2,
    problem:
      'Compute the nth Fibonacci number using recursion. F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2).',
    examples: [
      { input: 'n = 6', output: '8', explanation: 'F(6) = 8 (sequence: 0,1,1,2,3,5,8).' },
      { input: 'n = 0', output: '0', explanation: 'F(0) = 0 by definition.' },
    ],
    constraints: ['0 <= n <= 30 (to avoid excessive computation)'],
    intuition:
      'Recursive definition: fib(n) = n if n <= 1, else fib(n-1) + fib(n-2). This naive approach has exponential time due to repeated subproblems.',
    pseudocode: [
      'function fib(n):',
      '  if n <= 1: return n',
      '  return fib(n - 1) + fib(n - 2)',
    ],
    dryRun: {
      text: 'Compute fib(4) recursively.',
      steps: [
        { title: 'fib(4)', content: 'fib(3) + fib(2)' },
        { title: 'fib(3)', content: 'fib(2) + fib(1)' },
        { title: 'fib(2)', content: 'fib(1) + fib(0) = 1 + 0 = 1' },
        { title: 'fib(1)', content: '1 (base)' },
        { title: 'fib(0)', content: '0 (base)' },
        { title: 'Back to fib(3)', content: '1 + 1 = 2' },
        { title: 'Back to fib(4)', content: '2 + 1 = 3' },
      ],
    },
    starterCode: {
      cpp: 'using namespace std;\n\nint fib(int n) {\n  if (n <= 1) return n;\n  return fib(n - 1) + fib(n - 2);\n}',
      javascript: 'function fib(n) {\n  if (n <= 1) return n;\n  return fib(n - 1) + fib(n - 2);\n}',
    },
    complexity: { time: 'O(2^n)', space: 'O(n)' },
    tips: [
      'Very inefficient for large n due to exponential time.',
      'Use memoization or iterative approach for efficiency.',
      'Shows the importance of dynamic programming (overlapping subproblems).',
    ],
  },

  {
    id: 'recursive-reverse-string',
    title: 'Reverse String using Recursion',
    difficulty: 'Easy',
    topic: 'Recursion',
    level: 2,
    problem:
      'Reverse a string using recursion. Do not use any loops; rely only on recursive calls.',
    examples: [
      { input: '"hello"', output: '"olleh"', explanation: 'Recursively reverses the string.' },
      { input: '"abc"', output: '"cba"', explanation: 'Simple three-character reverse.' },
    ],
    constraints: ['0 <= s.length <= 10^3'],
    intuition:
      'Base case: empty or single-character string returns itself. Otherwise, swap the first and last characters and recursively reverse the substring between them.',
    pseudocode: [
      'function reverseStr(s):',
      '  if s.length <= 1: return s',
      '  return reverseStr(s[1..n-2]) + s[0]',
    ],
    dryRun: {
      text: 'Reverse "hello" recursively.',
      steps: [
        { title: 'reverse("hello")', content: 'reverse("ello") + "h"' },
        { title: 'reverse("ello")', content: 'reverse("llo") + "e"' },
        { title: 'reverse("llo")', content: 'reverse("lo") + "l"' },
        { title: 'reverse("lo")', content: 'reverse("o") + "l" = "ol"' },
        { title: 'Unwind', content: '"ol" + "l" = "oll", "oll" + "e" = "olle", "olle" + "h" = "olleh"' },
      ],
    },
    starterCode: {
      cpp: '#include <string>\nusing namespace std;\n\nstring reverseStr(string s) {\n  if (s.length() <= 1) return s;\n  return reverseStr(s.substr(1, s.length() - 2)) + s[0];\n}',
      javascript: 'function reverseStr(s) {\n  if (s.length <= 1) return s;\n  return reverseStr(s.slice(1, -1)) + s[0];\n}',
    },
    complexity: { time: 'O(n^2)', space: 'O(n)' },
    tips: [
      'Substring operations make this O(n^2) in many languages.',
      'In-place two-pointer recursion is more efficient.',
      'Good exercise for understanding recursion depth.',
    ],
  },

  {
    id: 'recursive-binary-search',
    title: 'Binary Search using Recursion',
    difficulty: 'Easy',
    topic: 'Recursion',
    level: 2,
    problem:
      'Implement binary search recursively. Given a sorted array and a target, return the index of the target or -1 if not found.',
    examples: [
      { input: 'arr = [1, 3, 5, 7, 9], target = 5', output: '2', explanation: 'Target 5 is at index 2.' },
      { input: 'arr = [1, 3, 5, 7, 9], target = 4', output: '-1', explanation: 'Target 4 is not in the array.' },
    ],
    constraints: ['1 <= arr.length <= 10^5', '-10^9 <= arr[i] <= 10^9', 'arr is sorted'],
    intuition:
      'Check the middle element. If it matches, return its index. If the target is smaller, recursively search the left half; otherwise, search the right half. Base case: if left > right, return -1.',
    pseudocode: [
      'function binarySearch(arr, target, left, right):',
      '  if left > right: return -1',
      '  mid = left + (right - left) / 2',
      '  if arr[mid] == target: return mid',
      '  if arr[mid] < target: return binarySearch(arr, target, mid+1, right)',
      '  else: return binarySearch(arr, target, left, mid-1)',
    ],
    dryRun: {
      text: 'Binary search recursively for 5 in [1,3,5,7,9].',
      steps: [
        { title: 'left=0, right=4', content: 'mid=2, arr[2]=5 == target -> return 2' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\nusing namespace std;\n\nint binarySearch(vector<int>& arr, int target, int left, int right) {\n  if (left > right) return -1;\n  int mid = left + (right - left) / 2;\n  if (arr[mid] == target) return mid;\n  if (arr[mid] < target) return binarySearch(arr, target, mid + 1, right);\n  return binarySearch(arr, target, left, mid - 1);\n}',
      javascript: 'function binarySearch(arr, target, left = 0, right = arr.length - 1) {\n  if (left > right) return -1;\n  const mid = left + Math.floor((right - left) / 2);\n  if (arr[mid] === target) return mid;\n  if (arr[mid] < target) return binarySearch(arr, target, mid + 1, right);\n  return binarySearch(arr, target, left, mid - 1);\n}',
    },
    complexity: { time: 'O(log n)', space: 'O(log n)' },
    tips: [
      'Recursive depth is O(log n) for balanced search.',
      'Iterative version uses O(1) space.',
      'Same logic as iterative binary search, just recursive.',
    ],
  },

  {
    id: 'generate-subsets',
    title: 'Generate All Subsets',
    difficulty: 'Medium',
    topic: 'Recursion',
    level: 2,
    problem:
      'Given an array of distinct integers, return all possible subsets (the power set). The solution set must not contain duplicate subsets.',
    examples: [
      { input: 'nums = [1, 2, 3]', output: '[[], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]]', explanation: 'All 8 subsets of a 3-element set.' },
      { input: 'nums = [0]', output: '[[], [0]]', explanation: 'Two subsets: empty and the element itself.' },
    ],
    constraints: ['1 <= nums.length <= 10', '-10 <= nums[i] <= 10', 'All elements are distinct'],
    intuition:
      'Use recursion with backtracking. At each step, decide whether to include the current element or not. When all elements have been considered, add the current subset to the result.',
    pseudocode: [
      'function subsets(nums):',
      '  result = [[]]',
      '  function backtrack(start, curr):',
      '    for i = start to nums.length - 1:',
      '      curr.push(nums[i])',
      '      result.add([...curr])',
      '      backtrack(i + 1, curr)',
      '      curr.pop()',
      '  backtrack(0, [])',
      '  return result',
    ],
    dryRun: {
      text: 'Generate subsets of [1,2,3].',
      steps: [
        { title: 'Start', content: 'result = [[]]' },
        { title: 'Include 1', content: 'result = [[], [1]], backtrack from index 1' },
        { title: 'Include 2', content: 'result adds [1,2], backtrack from index 2' },
        { title: 'Include 3', content: 'result adds [1,2,3]' },
        { title: 'Backtrack, exclude 3', content: 'pop 3' },
        { title: 'Backtrack, exclude 2, include 3', content: 'result adds [1,3]' },
        { title: 'Backtrack, exclude 1', content: 'Include 2 -> [2], then [2,3], then exclude 2 -> [3]' },
        { title: 'Final', content: '[[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\nusing namespace std;\n\nvoid backtrack(vector<int>& nums, int start, vector<int>& curr, vector<vector<int>>& result) {\n  for (int i = start; i < nums.size(); i++) {\n    curr.push_back(nums[i]);\n    result.push_back(curr);\n    backtrack(nums, i + 1, curr, result);\n    curr.pop_back();\n  }\n}\n\nvector<vector<int>> subsets(vector<int>& nums) {\n  vector<vector<int>> result = {{}};\n  vector<int> curr;\n  backtrack(nums, 0, curr, result);\n  return result;\n}',
      javascript: 'function subsets(nums) {\n  const result = [[]];\n  function backtrack(start, curr) {\n    for (let i = start; i < nums.length; i++) {\n      curr.push(nums[i]);\n      result.push([...curr]);\n      backtrack(i + 1, curr);\n      curr.pop();\n    }\n  }\n  backtrack(0, []);\n  return result;\n}',
    },
    complexity: { time: 'O(n * 2^n)', space: 'O(n * 2^n)' },
    tips: [
      'Backtracking is the standard approach for subsets/combinations.',
      'Total subsets = 2^n.',
      'The recursion tree has n levels with branching factor that decreases.',
    ],
  },

  // ============================================================
  // LEVEL 3 - Most Asked DSA (18 questions)
  // ============================================================

  // ---------- Linked List (5) ----------
  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    topic: 'Linked List',
    level: 3,
    problem:
      'Given the head of a singly linked list, reverse the list and return the new head.',
    examples: [
      { input: '1 -> 2 -> 3 -> 4 -> 5', output: '5 -> 4 -> 3 -> 2 -> 1', explanation: 'Each node points to the previous node; the tail becomes the new head.' },
      { input: '1 -> 2', output: '2 -> 1', explanation: 'Simple reversal of two nodes.' },
    ],
    constraints: ['0 <= number of nodes <= 5000', '-5000 <= Node.val <= 5000'],
    intuition:
      'Use three pointers: prev (null initially), curr (head), and next. In each step, save the next node, point curr.next to prev, then advance prev and curr. At the end, prev is the new head.',
    pseudocode: [
      'function reverseList(head):',
      '  prev = null, curr = head',
      '  while curr != null:',
      '    nextTemp = curr.next',
      '    curr.next = prev',
      '    prev = curr',
      '    curr = nextTemp',
      '  return prev',
    ],
    dryRun: {
      text: 'Reverse 1 -> 2 -> 3 -> null step by step.',
      steps: [
        { title: 'Initialize', content: 'prev = null, curr = 1' },
        { title: 'Step 1', content: 'next = 2, 1.next = null, prev = 1, curr = 2' },
        { title: 'Step 2', content: 'next = 3, 2.next = 1, prev = 2, curr = 3' },
        { title: 'Step 3', content: 'next = null, 3.next = 2, prev = 3, curr = null' },
        { title: 'Done', content: 'prev = 3 (new head): 3 -> 2 -> 1 -> null' },
      ],
    },
    starterCode: {
      cpp: '#include <cstddef>\nusing namespace std;\n\nstruct ListNode {\n  int val;\n  ListNode *next;\n  ListNode(int x) : val(x), next(nullptr) {}\n};\n\nListNode* reverseList(ListNode* head) {\n  ListNode* prev = nullptr;\n  ListNode* curr = head;\n  while (curr) {\n    ListNode* nextTemp = curr->next;\n    curr->next = prev;\n    prev = curr;\n    curr = nextTemp;\n  }\n  return prev;\n}',
      javascript: 'function ListNode(val, next) {\n  this.val = (val === undefined ? 0 : val);\n  this.next = (next === undefined ? null : next);\n}\n\nfunction reverseList(head) {\n  let prev = null, curr = head;\n  while (curr) {\n    const nextTemp = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = nextTemp;\n  }\n  return prev;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    tips: [
      'The key is to save curr.next before overwriting it.',
      'prev starts as null (new tail).',
      'Return prev at the end, not curr.',
    ],
  },

  {
    id: 'detect-loop',
    title: 'Detect Cycle in Linked List',
    difficulty: 'Easy',
    topic: 'Linked List',
    level: 3,
    problem:
      'Given the head of a linked list, determine if the linked list has a cycle. A cycle exists if a node can be reached again by following the next pointers.',
    examples: [
      { input: '3 -> 2 -> 0 -> -4 (points back to 2)', output: 'true', explanation: 'There is a cycle: -4.next = 2.' },
      { input: '1 -> 2 (2.next = null)', output: 'false', explanation: 'No cycle, list ends at null.' },
    ],
    constraints: ['0 <= number of nodes <= 10^4', '-10^5 <= Node.val <= 10^5'],
    intuition:
      'Use Floyd\\s Cycle Detection (tortoise and hare). Move slow pointer by 1 and fast pointer by 2. If they meet, there is a cycle. If fast reaches null, there is no cycle.',
    pseudocode: [
      'function hasCycle(head):',
      '  slow = head, fast = head',
      '  while fast != null and fast.next != null:',
      '    slow = slow.next',
      '    fast = fast.next.next',
      '    if slow == fast: return true',
      '  return false',
    ],
    dryRun: {
      text: 'Detect cycle in 3 -> 2 -> 0 -> -4 (points back to 2).',
      steps: [
        { title: 'Start', content: 'slow=3, fast=3' },
        { title: 'Step 1', content: 'slow=2, fast=0' },
        { title: 'Step 2', content: 'slow=0, fast=2 (after moving through cycle)' },
        { title: 'Step 3', content: 'slow=-4, fast=-4 -> meet! return true' },
      ],
    },
    starterCode: {
      cpp: '#include <cstddef>\nusing namespace std;\n\nstruct ListNode {\n  int val;\n  ListNode *next;\n  ListNode(int x) : val(x), next(nullptr) {}\n};\n\nbool hasCycle(ListNode* head) {\n  ListNode* slow = head;\n  ListNode* fast = head;\n  while (fast && fast->next) {\n    slow = slow->next;\n    fast = fast->next->next;\n    if (slow == fast) return true;\n  }\n  return false;\n}',
      javascript: 'function ListNode(val, next) {\n  this.val = (val === undefined ? 0 : val);\n  this.next = (next === undefined ? null : next);\n}\n\nfunction hasCycle(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow === fast) return true;\n  }\n  return false;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    tips: [
      'Floyd\\s algorithm uses O(1) space vs O(n) for hash set.',
      'Fast pointer moves 2 steps, slow moves 1 step.',
      'If fast reaches null, no cycle exists.',
    ],
  },

  {
    id: 'find-middle-node',
    title: 'Find Middle Node',
    difficulty: 'Easy',
    topic: 'Linked List',
    level: 3,
    problem:
      'Given the head of a singly linked list, return the middle node. If there are two middle nodes, return the second middle node.',
    examples: [
      { input: '1 -> 2 -> 3 -> 4 -> 5', output: '3', explanation: 'Node with value 3 is the middle.' },
      { input: '1 -> 2 -> 3 -> 4 -> 5 -> 6', output: '4', explanation: 'Two middle nodes (3 and 4), return the second (4).' },
    ],
    constraints: ['1 <= number of nodes <= 100', '-100 <= Node.val <= 100'],
    intuition:
      'Use slow and fast pointers. Move slow by 1 and fast by 2. When fast reaches the end (or null after last), slow will be at the middle.',
    pseudocode: [
      'function middleNode(head):',
      '  slow = head, fast = head',
      '  while fast != null and fast.next != null:',
      '    slow = slow.next',
      '    fast = fast.next.next',
      '  return slow',
    ],
    dryRun: {
      text: 'Find middle of 1 -> 2 -> 3 -> 4 -> 5.',
      steps: [
        { title: 'Start', content: 'slow=1, fast=1' },
        { title: 'Step 1', content: 'slow=2, fast=3' },
        { title: 'Step 2', content: 'slow=3, fast=5' },
        { title: 'Step 3', content: 'fast.next = null -> stop, return slow=3' },
      ],
    },
    starterCode: {
      cpp: '#include <cstddef>\nusing namespace std;\n\nstruct ListNode {\n  int val;\n  ListNode *next;\n  ListNode(int x) : val(x), next(nullptr) {}\n};\n\nListNode* middleNode(ListNode* head) {\n  ListNode* slow = head;\n  ListNode* fast = head;\n  while (fast && fast->next) {\n    slow = slow->next;\n    fast = fast->next->next;\n  }\n  return slow;\n}',
      javascript: 'function ListNode(val, next) {\n  this.val = (val === undefined ? 0 : val);\n  this.next = (next === undefined ? null : next);\n}\n\nfunction middleNode(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n  }\n  return slow;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    tips: [
      'Tortoise and hare technique again.',
      'Returns second middle for even-length lists.',
      'Single pass O(n), no length computation needed.',
    ],
  },

  {
    id: 'merge-two-lists',
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    topic: 'Linked List',
    level: 3,
    problem:
      'Given the heads of two sorted linked lists, merge them into one sorted list. Return the head of the merged list.',
    examples: [
      { input: '1 -> 2 -> 4, 1 -> 3 -> 4', output: '1 -> 1 -> 2 -> 3 -> 4 -> 4', explanation: 'Nodes interleaved in sorted order.' },
      { input: 'null, 1 -> 2', output: '1 -> 2', explanation: 'Merging with an empty list returns the non-empty list.' },
    ],
    constraints: ['0 <= number of nodes <= 50', '-100 <= Node.val <= 100', 'Both lists are sorted'],
    intuition:
      'Use a dummy node to simplify handling the head. Compare the heads of both lists, attach the smaller one, and advance that list. When one list is exhausted, attach the rest of the other list.',
    pseudocode: [
      'function mergeTwoLists(l1, l2):',
      '  dummy = new ListNode(0)',
      '  curr = dummy',
      '  while l1 != null and l2 != null:',
      '    if l1.val < l2.val:',
      '      curr.next = l1, l1 = l1.next',
      '    else:',
      '      curr.next = l2, l2 = l2.next',
      '    curr = curr.next',
      '  curr.next = l1 if l1 != null else l2',
      '  return dummy.next',
    ],
    dryRun: {
      text: 'Merge 1->2->4 and 1->3->4.',
      steps: [
        { title: 'Initialize', content: 'dummy = 0, curr = dummy' },
        { title: 'Compare 1 vs 1', content: 'Attach l2 (1) -> dummy.next=1, l2=3, curr=1' },
        { title: 'Compare 1 vs 3', content: 'Attach l1 (1) -> 1.next=1, l1=2, curr=1' },
        { title: 'Compare 2 vs 3', content: 'Attach l1 (2) -> 1.next=2, l1=4, curr=2' },
        { title: 'Compare 4 vs 3', content: 'Attach l2 (3) -> 2.next=3, l2=4, curr=3' },
        { title: 'Compare 4 vs 4', content: 'Attach l1 (4) -> 3.next=4, l1=null, curr=4' },
        { title: 'l1 exhausted', content: '4.next = l2 (4) -> 4->4->null' },
      ],
    },
    starterCode: {
      cpp: '#include <cstddef>\nusing namespace std;\n\nstruct ListNode {\n  int val;\n  ListNode *next;\n  ListNode(int x) : val(x), next(nullptr) {}\n};\n\nListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {\n  ListNode dummy(0);\n  ListNode* curr = &dummy;\n  while (l1 && l2) {\n    if (l1->val < l2->val) { curr->next = l1; l1 = l1->next; }\n    else { curr->next = l2; l2 = l2->next; }\n    curr = curr->next;\n  }\n  curr->next = l1 ? l1 : l2;\n  return dummy.next;\n}',
      javascript: 'function ListNode(val, next) {\n  this.val = (val === undefined ? 0 : val);\n  this.next = (next === undefined ? null : next);\n}\n\nfunction mergeTwoLists(l1, l2) {\n  const dummy = new ListNode(0);\n  let curr = dummy;\n  while (l1 && l2) {\n    if (l1.val < l2.val) { curr.next = l1; l1 = l1.next; }\n    else { curr.next = l2; l2 = l2.next; }\n    curr = curr.next;\n  }\n  curr.next = l1 || l2;\n  return dummy.next;\n}',
    },
    complexity: { time: 'O(n + m)', space: 'O(1)' },
    tips: [
      'Dummy node eliminates the need to handle head separately.',
      'Attach the smaller node each iteration.',
      'The remaining nodes of the non-empty list are appended at the end.',
    ],
  },

  {
    id: 'delete-node',
    title: 'Delete Node in Linked List',
    difficulty: 'Easy',
    topic: 'Linked List',
    level: 3,
    problem:
      'Given a node that is not the tail, delete it from the singly linked list. You will not have access to the head; only the node to delete is given.',
    examples: [
      { input: 'head = [4,5,1,9], node = 5', output: '[4,1,9]', explanation: 'Node with value 5 is deleted from the list.' },
      { input: 'head = [4,5,1,9], node = 1', output: '[4,5,9]', explanation: 'Node with value 1 is deleted.' },
    ],
    constraints: ['2 <= number of nodes <= 1000', '-1000 <= Node.val <= 1000', 'The given node is not the tail'],
    intuition:
      'Copy the value of the next node into the current node, then delete the next node. This effectively removes the current node without needing access to the head.',
    pseudocode: [
      'function deleteNode(node):',
      '  node.val = node.next.val',
      '  node.next = node.next.next',
    ],
    dryRun: {
      text: 'Delete node 5 from [4,5,1,9].',
      steps: [
        { title: 'Before deletion', content: '4 -> 5 -> 1 -> 9, node=5' },
        { title: 'Copy next value', content: 'node.val = 1' },
        { title: 'Skip next node', content: 'node.next = node.next.next -> 4 -> 1 -> 9' },
      ],
    },
    starterCode: {
      cpp: '#include <cstddef>\nusing namespace std;\n\nstruct ListNode {\n  int val;\n  ListNode *next;\n  ListNode(int x) : val(x), next(nullptr) {}\n};\n\nvoid deleteNode(ListNode* node) {\n  node->val = node->next->val;\n  node->next = node->next->next;\n}',
      javascript: 'function ListNode(val, next) {\n  this.val = (val === undefined ? 0 : val);\n  this.next = (next === undefined ? null : next);\n}\n\nfunction deleteNode(node) {\n  node.val = node.next.val;\n  node.next = node.next.next;\n}',
    },
    complexity: { time: 'O(1)', space: 'O(1)' },
    tips: [
      'We are not actually removing the current node; we overwrite it and skip the next node.',
      'This trick only works if node is not the tail.',
      'No need to free memory in C++ as the problem focuses on the algorithm.',
    ],
  },

  // ---------- Stack (5) ----------
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    topic: 'Stack',
    level: 3,
    problem:
      'Given a string containing just the characters ( ) { } [ ], determine if the input string is valid. Brackets must close in the correct order and every opening bracket must have a matching closing bracket.',
    examples: [
      { input: '"()[]{}"', output: 'true', explanation: 'All brackets are properly matched and nested.' },
      { input: '"(]"', output: 'false', explanation: 'Parenthesis ( is closed with ] which does not match.' },
    ],
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only: ()[]{}'],
    intuition:
      'Use a stack. When an opening bracket is encountered, push it onto the stack. When a closing bracket is encountered, check if the top of the stack matches it. If not, return false. At the end, the stack should be empty.',
    pseudocode: [
      'function isValid(s):',
      '  stack = []',
      '  map = {")": "(", "}": "{", "]": "["}',
      '  for each char c in s:',
      '    if c in map:',
      '      if stack is empty or stack.pop() != map[c]: return false',
      '    else: stack.push(c)',
      '  return stack is empty',
    ],
    dryRun: {
      text: 'Check if "()[]{}" is valid.',
      steps: [
        { title: 'c = (', content: 'Opening -> push ( -> stack = [ ( ]' },
        { title: 'c = )', content: 'Closing -> pop ( matches -> stack = []' },
        { title: 'c = [', content: 'Opening -> push [ -> stack = [ [ ]' },
        { title: 'c = ]', content: 'Closing -> pop [ matches -> stack = []' },
        { title: 'c = {', content: 'Opening -> push { -> stack = [ { ]' },
        { title: 'c = }', content: 'Closing -> pop { matches -> stack = []' },
        { title: 'Stack empty', content: 'return true' },
      ],
    },
    starterCode: {
      cpp: '#include <stack>\n#include <unordered_map>\n#include <string>\nusing namespace std;\n\nbool isValid(string s) {\n  stack<char> st;\n  unordered_map<char,char> mp = {{\')\',\'(\'}, {\'}\',\'{\'}, {\']\',\'[\'}};\n  for (char c : s) {\n    if (mp.count(c)) {\n      if (st.empty() || st.top() != mp[c]) return false;\n      st.pop();\n    } else {\n      st.push(c);\n    }\n  }\n  return st.empty();\n}',
      javascript: 'function isValid(s) {\n  const stack = [];\n  const map = {\')\': \'(\', \'}\': \'{\', \']\': \'[\'};\n  for (let c of s) {\n    if (c in map) {\n      if (!stack.length || stack.pop() !== map[c]) return false;\n    } else {\n      stack.push(c);\n    }\n  }\n  return stack.length === 0;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(n)' },
    tips: [
      'Always check if stack is empty before popping.',
      'Use a map to match closing to opening brackets.',
      'At the end, the stack must be empty for a valid string.',
    ],
  },

  {
    id: 'min-stack',
    title: 'Min Stack',
    difficulty: 'Medium',
    topic: 'Stack',
    level: 3,
    problem:
      'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.',
    examples: [
      { input: 'push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()', output: '-3, 0, -2', explanation: 'getMin() returns -3, after pop() the top is 0, getMin() returns -2.' },
    ],
    constraints: ['Operations: push, pop, top, getMin', '-2^31 <= val <= 2^31 - 1', 'Methods pop, top, getMin called on non-empty stack'],
    intuition:
      'Maintain two stacks: the main stack for values and a min stack that stores the current minimum. When pushing, compare with the top of the min stack and push the smaller value. When popping, pop from both stacks.',
    pseudocode: [
      'class MinStack:',
      '  stack = [], minStack = []',
      '  push(val):',
      '    stack.push(val)',
      '    if minStack is empty or val <= minStack.top(): minStack.push(val)',
      '  pop():',
      '    if stack.top() == minStack.top(): minStack.pop()',
      '    stack.pop()',
      '  top(): return stack.top()',
      '  getMin(): return minStack.top()',
    ],
    dryRun: {
      text: 'Push -2, 0, -3 then getMin, pop, top, getMin.',
      steps: [
        { title: 'push(-2)', content: 'stack=[-2], minStack=[-2]' },
        { title: 'push(0)', content: 'stack=[-2,0], minStack=[-2] (0 > -2)' },
        { title: 'push(-3)', content: 'stack=[-2,0,-3], minStack=[-2,-3]' },
        { title: 'getMin()', content: 'minStack.top() = -3' },
        { title: 'pop()', content: 'pop -3 from both stacks -> stack=[-2,0], minStack=[-2]' },
        { title: 'top()', content: 'stack.top() = 0' },
        { title: 'getMin()', content: 'minStack.top() = -2' },
      ],
    },
    starterCode: {
      cpp: '#include <stack>\nusing namespace std;\n\nclass MinStack {\npublic:\n  stack<int> st, minSt;\n  void push(int val) {\n    st.push(val);\n    if (minSt.empty() || val <= minSt.top()) minSt.push(val);\n  }\n  void pop() {\n    if (st.top() == minSt.top()) minSt.pop();\n    st.pop();\n  }\n  int top() { return st.top(); }\n  int getMin() { return minSt.top(); }\n};',
      javascript: 'class MinStack {\n  constructor() { this.stack = []; this.minStack = []; }\n  push(val) {\n    this.stack.push(val);\n    if (this.minStack.length === 0 || val <= this.minStack[this.minStack.length - 1]) {\n      this.minStack.push(val);\n    }\n  }\n  pop() {\n    if (this.stack[this.stack.length - 1] === this.minStack[this.minStack.length - 1]) {\n      this.minStack.pop();\n    }\n    this.stack.pop();\n  }\n  top() { return this.stack[this.stack.length - 1]; }\n  getMin() { return this.minStack[this.minStack.length - 1]; }\n}',
    },
    complexity: { time: 'O(1)', space: 'O(n)' },
    tips: [
      'Both stacks grow together; the min stack only grows when a new minimum is found.',
      'When popping, check if current top is the current minimum.',
      'getMin() is O(1) because we maintain the min stack.',
    ],
  },

  {
    id: 'next-greater-element',
    title: 'Next Greater Element',
    difficulty: 'Medium',
    topic: 'Stack',
    level: 3,
    problem:
      'Given an array, find the next greater element for each element. The next greater element is the first greater element to the right. If none exists, return -1.',
    examples: [
      { input: '[4, 5, 2, 25]', output: '[5, 25, 25, -1]', explanation: 'For 4, next greater is 5; for 5, next greater is 25; for 2, next greater is 25; for 25, no greater element.' },
      { input: '[13, 7, 6, 12]', output: '[-1, 12, 12, -1]', explanation: 'For 13, no greater; for 7, next greater is 12; for 6, next greater is 12; for 12, no greater.' },
    ],
    constraints: ['1 <= arr.length <= 10^5', '0 <= arr[i] <= 10^9'],
    intuition:
      'Use a stack to keep track of indices of elements. Iterate from left to right. While the current element is greater than the element at the top index, pop from stack and set the result.',
    pseudocode: [
      'function nextGreaterElement(arr):',
      '  result = [-1] * arr.length, stack = []',
      '  for i = 0 to arr.length - 1:',
      '    while stack not empty and arr[i] > arr[stack.top()]:',
      '      idx = stack.pop()',
      '      result[idx] = arr[i]',
      '    stack.push(i)',
      '  return result',
    ],
    dryRun: {
      text: 'Find next greater for [4,5,2,25].',
      steps: [
        { title: 'i=0, arr[0]=4', content: 'stack empty -> push 0, stack=[0]' },
        { title: 'i=1, arr[1]=5', content: '5 > arr[0]=4 -> pop 0, result[0]=5, push 1, stack=[1]' },
        { title: 'i=2, arr[2]=2', content: '2 < arr[1]=5 -> push 2, stack=[1,2]' },
        { title: 'i=3, arr[3]=25', content: '25 > arr[2]=2 -> pop 2, result[2]=25' },
        { title: 'Continue', content: '25 > arr[1]=5 -> pop 1, result[1]=25, push 3, stack=[3]' },
        { title: 'Result', content: '[5, 25, 25, -1]' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\n#include <stack>\nusing namespace std;\n\nvector<int> nextGreaterElement(vector<int>& arr) {\n  int n = arr.size();\n  vector<int> result(n, -1);\n  stack<int> st;\n  for (int i = 0; i < n; i++) {\n    while (!st.empty() && arr[i] > arr[st.top()]) {\n      result[st.top()] = arr[i];\n      st.pop();\n    }\n    st.push(i);\n  }\n  return result;\n}',
      javascript: 'function nextGreaterElement(arr) {\n  const result = new Array(arr.length).fill(-1);\n  const stack = [];\n  for (let i = 0; i < arr.length; i++) {\n    while (stack.length && arr[i] > arr[stack[stack.length - 1]]) {\n      result[stack.pop()] = arr[i];\n    }\n    stack.push(i);\n  }\n  return result;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(n)' },
    tips: [
      'Stack stores indices, not values.',
      'Each element is pushed and popped at most once -> O(n).',
      'Elements with no next greater remain -1.',
    ],
  },

  {
    id: 'evaluate-postfix',
    title: 'Evaluate Postfix Expression',
    difficulty: 'Medium',
    topic: 'Stack',
    level: 3,
    problem:
      'Evaluate a postfix (Reverse Polish Notation) expression. Operands are integers and operators are +, -, *, /. Return the result as an integer.',
    examples: [
      { input: '["2", "1", "+", "3", "*"]', output: '9', explanation: '((2 + 1) * 3) = 9.' },
      { input: '["4", "13", "5", "/", "+"]', output: '6', explanation: '(4 + (13 / 5)) = 6.' },
    ],
    constraints: ['1 <= tokens.length <= 10^4', 'tokens[i] is an integer or an operator (+, -, *, /)', 'Division truncates toward zero'],
    intuition:
      'Use a stack. For each token, if it is an operand, push it onto the stack. If it is an operator, pop two operands, apply the operator, and push the result back. At the end, the stack contains the result.',
    pseudocode: [
      'function evalRPN(tokens):',
      '  stack = []',
      '  for each token in tokens:',
      '    if token is operator:',
      '      b = stack.pop(), a = stack.pop()',
      '      if token == "+": result = a + b',
      '      if token == "-": result = a - b',
      '      if token == "*": result = a * b',
      '      if token == "/": result = trunc(a / b)',
      '      stack.push(result)',
      '    else: stack.push(parseInt(token))',
      '  return stack.top()',
    ],
    dryRun: {
      text: 'Evaluate ["2","1","+","3","*"].',
      steps: [
        { title: 'Token "2"', content: 'push 2 -> stack=[2]' },
        { title: 'Token "1"', content: 'push 1 -> stack=[2,1]' },
        { title: 'Token "+"', content: 'pop 1, pop 2 -> 2+1=3, push 3 -> stack=[3]' },
        { title: 'Token "3"', content: 'push 3 -> stack=[3,3]' },
        { title: 'Token "*"', content: 'pop 3, pop 3 -> 3*3=9, push 9 -> stack=[9]' },
        { title: 'Result', content: '9' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\n#include <string>\n#include <stack>\n#include <cstdlib>\nusing namespace std;\n\nint evalRPN(vector<string>& tokens) {\n  stack<int> st;\n  for (string& t : tokens) {\n    if (t == "+" || t == "-" || t == "*" || t == "/") {\n      int b = st.top(); st.pop();\n      int a = st.top(); st.pop();\n      if (t == "+") st.push(a + b);\n      else if (t == "-") st.push(a - b);\n      else if (t == "*") st.push(a * b);\n      else st.push(a / b);\n    } else {\n      st.push(stoi(t));\n    }\n  }\n  return st.top();\n}',
      javascript: 'function evalRPN(tokens) {\n  const stack = [];\n  for (const t of tokens) {\n    if (t === "+" || t === "-" || t === "*" || t === "/") {\n      const b = stack.pop();\n      const a = stack.pop();\n      if (t === "+") stack.push(a + b);\n      else if (t === "-") stack.push(a - b);\n      else if (t === "*") stack.push(a * b);\n      else stack.push(Math.trunc(a / b));\n    } else {\n      stack.push(parseInt(t));\n    }\n  }\n  return stack[0];\n}',
    },
    complexity: { time: 'O(n)', space: 'O(n)' },
    tips: [
      'Pop b first (right operand), then a (left operand).',
      'For subtraction and division, order matters: a - b, a / b.',
      'Division truncates toward zero in most languages.',
    ],
  },

  {
    id: 'balanced-parentheses',
    title: 'Balanced Parentheses',
    difficulty: 'Easy',
    topic: 'Stack',
    level: 3,
    problem:
      'Given a string containing parentheses, check if every opening parenthesis has a matching closing parenthesis in the correct order. Return true if balanced, false otherwise.',
    examples: [
      { input: '"((()))"', output: 'true', explanation: 'Each opening has a corresponding closing in order.' },
      { input: '"(()"', output: 'false', explanation: 'One opening parenthesis is not closed.' },
    ],
    constraints: ['1 <= s.length <= 10^4', 's consists of ( and ) only'],
    intuition:
      'Use a counter or stack. For each character, increment count on (, decrement on ). If count goes negative at any point, return false. At the end, count must be 0.',
    pseudocode: [
      'function isBalanced(s):',
      '  count = 0',
      '  for each char in s:',
      '    if char == "(": count++',
      '    else: count--',
      '    if count < 0: return false',
      '  return count == 0',
    ],
    dryRun: {
      text: 'Check if "((()))" is balanced.',
      steps: [
        { title: 'c = (', content: 'count = 1' },
        { title: 'c = (', content: 'count = 2' },
        { title: 'c = (', content: 'count = 3' },
        { title: 'c = )', content: 'count = 2' },
        { title: 'c = )', content: 'count = 1' },
        { title: 'c = )', content: 'count = 0 -> balanced' },
      ],
    },
    starterCode: {
      cpp: '#include <string>\nusing namespace std;\n\nbool isBalanced(string s) {\n  int count = 0;\n  for (char c : s) {\n    if (c == \'(\') count++;\n    else count--;\n    if (count < 0) return false;\n  }\n  return count == 0;\n}',
      javascript: 'function isBalanced(s) {\n  let count = 0;\n  for (let c of s) {\n    if (c === \'(\') count++;\n    else count--;\n    if (count < 0) return false;\n  }\n  return count === 0;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    tips: [
      'For single bracket type, a counter is sufficient instead of a stack.',
      'Count must never go negative - means a closing without opening.',
      'Final count must be exactly 0.',
    ],
  },

  // ---------- Queue (3) ----------
  {
    id: 'queue-using-stack',
    title: 'Implement Queue using Stacks',
    difficulty: 'Easy',
    topic: 'Queue',
    level: 3,
    problem:
      'Implement a first-in-first-out (FIFO) queue using only two stacks. The implemented queue should support push, pop, peek, and empty operations.',
    examples: [
      { input: 'push(1), push(2), peek(), pop(), empty()', output: '1, 1, false', explanation: 'After pushing 1 and 2, peek shows 1, pop returns 1, queue is not empty.' },
    ],
    constraints: ['1 <= val <= 9', 'At most 100 calls', 'All calls are valid'],
    intuition:
      'Use two stacks: one for input, one for output. For push, push onto input stack. For pop/peek, if output stack is empty, transfer all elements from input to output (reversing order). Then pop/peek from output stack.',
    pseudocode: [
      'class MyQueue:',
      '  input = [], output = []',
      '  push(x): input.push(x)',
      '  pop():',
      '    if output is empty: transfer input to output',
      '    return output.pop()',
      '  peek():',
      '    if output is empty: transfer input to output',
      '    return output.top()',
      '  empty(): return input.empty() and output.empty()',
    ],
    dryRun: {
      text: 'Push 1,2 then peek and pop.',
      steps: [
        { title: 'push(1)', content: 'input=[1], output=[]' },
        { title: 'push(2)', content: 'input=[1,2], output=[]' },
        { title: 'peek()', content: 'output is empty -> transfer: input->output (pop 2,1 push to output) -> input=[], output=[2,1], top=1' },
        { title: 'pop()', content: 'output=[2], pop returns 1' },
        { title: 'empty()', content: 'input=[], output=[2] -> not empty -> false' },
      ],
    },
    starterCode: {
      cpp: '#include <stack>\nusing namespace std;\n\nclass MyQueue {\npublic:\n  stack<int> in, out;\n  void push(int x) { in.push(x); }\n  int pop() {\n    if (out.empty()) transfer();\n    int x = out.top(); out.pop(); return x;\n  }\n  int peek() {\n    if (out.empty()) transfer();\n    return out.top();\n  }\n  bool empty() { return in.empty() && out.empty(); }\n  void transfer() {\n    while (!in.empty()) {\n      out.push(in.top()); in.pop();\n    }\n  }\n};',
      javascript: 'class MyQueue {\n  constructor() { this.in = []; this.out = []; }\n  push(x) { this.in.push(x); }\n  transfer() {\n    while (this.in.length) this.out.push(this.in.pop());\n  }\n  pop() {\n    if (!this.out.length) this.transfer();\n    return this.out.pop();\n  }\n  peek() {\n    if (!this.out.length) this.transfer();\n    return this.out[this.out.length - 1];\n  }\n  empty() { return !this.in.length && !this.out.length; }\n}',
    },
    complexity: { time: 'O(1) amortized per operation', space: 'O(n)' },
    tips: [
      'Amortized O(1) because each element is moved at most twice.',
      'Transfer only when output stack is empty.',
      'peek() and pop() share the same transfer logic.',
    ],
  },

  {
    id: 'stack-using-queue',
    title: 'Implement Stack using Queues',
    difficulty: 'Easy',
    topic: 'Queue',
    level: 3,
    problem:
      'Implement a last-in-first-out (LIFO) stack using only two queues. The implemented stack should support push, pop, top, and empty operations.',
    examples: [
      { input: 'push(1), push(2), top(), pop(), empty()', output: '2, 2, false', explanation: 'After pushing 1 and 2, top returns 2, pop returns 2, stack is not empty.' },
    ],
    constraints: ['1 <= val <= 9', 'At most 100 calls', 'All calls are valid'],
    intuition:
      'Use two queues. For push, push to q2, then move all elements from q1 to q2, then swap the queues. This ensures the last pushed element is at the front of the queue (which behaves like stack top).',
    pseudocode: [
      'class MyStack:',
      '  q1 = [], q2 = []',
      '  push(x):',
      '    q2.push(x)',
      '    while q1 not empty: q2.push(q1.pop())',
      '    swap(q1, q2)',
      '  pop(): return q1.pop()',
      '  top(): return q1.front()',
      '  empty(): return q1.empty()',
    ],
    dryRun: {
      text: 'Push 1, 2 then top and pop.',
      steps: [
        { title: 'push(1)', content: 'q2=[1], move from q1 (empty) -> swap -> q1=[1], q2=[]' },
        { title: 'push(2)', content: 'q2=[2], move from q1=[1] -> q2=[2,1], swap -> q1=[2,1], q2=[]' },
        { title: 'top()', content: 'q1.front() = 2' },
        { title: 'pop()', content: 'pop from q1 -> returns 2, q1=[1]' },
      ],
    },
    starterCode: {
      cpp: '#include <queue>\nusing namespace std;\n\nclass MyStack {\npublic:\n  queue<int> q1, q2;\n  void push(int x) {\n    q2.push(x);\n    while (!q1.empty()) { q2.push(q1.front()); q1.pop(); }\n    swap(q1, q2);\n  }\n  int pop() { int x = q1.front(); q1.pop(); return x; }\n  int top() { return q1.front(); }\n  bool empty() { return q1.empty(); }\n};',
      javascript: 'class MyStack {\n  constructor() { this.q1 = []; this.q2 = []; }\n  push(x) {\n    this.q2.push(x);\n    while (this.q1.length) this.q2.push(this.q1.shift());\n    [this.q1, this.q2] = [this.q2, this.q1];\n  }\n  pop() { return this.q1.shift(); }\n  top() { return this.q1[0]; }\n  empty() { return !this.q1.length; }\n}',
    },
    complexity: { time: 'O(n) push, O(1) pop/top', space: 'O(n)' },
    tips: [
      'Push is O(n) because we rotate elements to maintain order.',
      'Using a single queue with rotation is also possible.',
      'top() and pop() are O(1).',
    ],
  },

  {
    id: 'circular-queue',
    title: 'Circular Queue',
    difficulty: 'Medium',
    topic: 'Queue',
    level: 3,
    problem:
      'Design a circular queue (ring buffer) with fixed capacity. Support enQueue, deQueue, Front, Rear, isEmpty, and isFull operations.',
    examples: [
      { input: 'MyCircularQueue(3), enQueue(1), enQueue(2), enQueue(3), enQueue(4), Rear(), isFull(), deQueue(), enQueue(4), Rear()', output: 'true, true, true, false, 3, true, true, true, 4', explanation: 'Queue fills up, then after dequeue, new element can be added at the rear.' },
    ],
    constraints: ['1 <= k <= 1000', '0 <= value <= 1000'],
    intuition:
      'Use an array of fixed size, a head pointer, a tail pointer, and a count. Enqueue at tail (wrap around using modulo), dequeue at head. The modulo arithmetic handles the circular nature.',
    pseudocode: [
      'class MyCircularQueue:',
      '  init(k): arr = new int[k], capacity = k, head = 0, tail = -1, count = 0',
      '  enQueue(v): if isFull(): return false; tail = (tail + 1) % capacity; arr[tail] = v; count++; return true',
      '  deQueue(): if isEmpty(): return false; head = (head + 1) % capacity; count--; return true',
      '  Front(): return isEmpty() ? -1 : arr[head]',
      '  Rear(): return isEmpty() ? -1 : arr[tail]',
      '  isEmpty(): return count == 0',
      '  isFull(): return count == capacity',
    ],
    dryRun: {
      text: 'Circular queue of size 3: enqueue 1,2,3 then enqueue 4, dequeue, enqueue 4.',
      steps: [
        { title: 'enQueue(1)', content: 'tail = 0, arr[0]=1, count=1 -> true' },
        { title: 'enQueue(2)', content: 'tail = 1, arr[1]=2, count=2 -> true' },
        { title: 'enQueue(3)', content: 'tail = 2, arr[2]=3, count=3 -> true' },
        { title: 'enQueue(4)', content: 'isFull=true -> false' },
        { title: 'Rear()', content: '3' },
        { title: 'deQueue()', content: 'head = 1, count=2 -> true' },
        { title: 'enQueue(4)', content: 'tail = (2+1)%3=0, arr[0]=4, count=3 -> true' },
        { title: 'Rear()', content: '4' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\nusing namespace std;\n\nclass MyCircularQueue {\npublic:\n  vector<int> arr;\n  int head, tail, count, cap;\n  MyCircularQueue(int k) : arr(k), head(0), tail(-1), count(0), cap(k) {}\n  bool enQueue(int v) {\n    if (isFull()) return false;\n    tail = (tail + 1) % cap;\n    arr[tail] = v;\n    count++;\n    return true;\n  }\n  bool deQueue() {\n    if (isEmpty()) return false;\n    head = (head + 1) % cap;\n    count--;\n    return true;\n  }\n  int Front() { return isEmpty() ? -1 : arr[head]; }\n  int Rear() { return isEmpty() ? -1 : arr[tail]; }\n  bool isEmpty() { return count == 0; }\n  bool isFull() { return count == cap; }\n};',
      javascript: 'class MyCircularQueue {\n  constructor(k) {\n    this.arr = new Array(k);\n    this.cap = k;\n    this.head = 0;\n    this.tail = -1;\n    this.count = 0;\n  }\n  enQueue(v) {\n    if (this.isFull()) return false;\n    this.tail = (this.tail + 1) % this.cap;\n    this.arr[this.tail] = v;\n    this.count++;\n    return true;\n  }\n  deQueue() {\n    if (this.isEmpty()) return false;\n    this.head = (this.head + 1) % this.cap;\n    this.count--;\n    return true;\n  }\n  Front() { return this.isEmpty() ? -1 : this.arr[this.head]; }\n  Rear() { return this.isEmpty() ? -1 : this.arr[this.tail]; }\n  isEmpty() { return this.count === 0; }\n  isFull() { return this.count === this.cap; }\n}',
    },
    complexity: { time: 'O(1) per operation', space: 'O(k)' },
    tips: [
      'Modulo arithmetic is key for circular behavior.',
      'head and tail wrap around using % capacity.',
      'count distinguishes full from empty (when head == tail).',
    ],
  },

  // ---------- HashMap (5) ----------
  {
    id: 'two-sum-hashmap',
    title: 'Two Sum (HashMap approach)',
    difficulty: 'Easy',
    topic: 'HashMap',
    level: 3,
    problem:
      'Given an array of integers and a target, return indices of the two numbers that add up to the target. Use a hash map for O(n) time complexity.',
    examples: [
      { input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]', explanation: '2 + 7 = 9, indices 0 and 1.' },
      { input: 'nums = [3, 2, 4], target = 6', output: '[1, 2]', explanation: '2 + 4 = 6, indices 1 and 2.' },
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9'],
    intuition:
      'Iterate through the array. For each element, compute the complement (target - nums[i]). If the complement exists in the hash map, return its index and the current index. Otherwise, store the current element and its index in the map.',
    pseudocode: [
      'function twoSum(nums, target):',
      '  map = {}',
      '  for i = 0 to nums.length - 1:',
      '    complement = target - nums[i]',
      '    if complement in map: return [map[complement], i]',
      '    map[nums[i]] = i',
    ],
    dryRun: {
      text: 'Find indices for target 9 in [2,7,11,15].',
      steps: [
        { title: 'i=0, nums[0]=2', content: 'complement = 7, not in map -> map[2]=0' },
        { title: 'i=1, nums[1]=7', content: 'complement = 2, found at index 0 -> return [0,1]' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n  unordered_map<int,int> mp;\n  for (int i = 0; i < nums.size(); i++) {\n    int comp = target - nums[i];\n    if (mp.count(comp)) return {mp[comp], i};\n    mp[nums[i]] = i;\n  }\n  return {};\n}',
      javascript: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const comp = target - nums[i];\n    if (map.has(comp)) return [map.get(comp), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}',
    },
    complexity: { time: 'O(n)', space: 'O(n)' },
    tips: [
      'Store elements in the map after checking complement to avoid using the same element twice.',
      'This is the classic example of using a hash map for lookups.',
      'Always return the indices, not the values.',
    ],
  },

  {
    id: 'frequency-counter',
    title: 'Frequency Counter',
    difficulty: 'Easy',
    topic: 'HashMap',
    level: 3,
    problem:
      'Given an array of integers, count the frequency of each distinct element and return the frequencies in a hash map.',
    examples: [
      { input: '[1, 2, 2, 3, 3, 3]', output: '{1: 1, 2: 2, 3: 3}', explanation: '1 appears once, 2 twice, 3 three times.' },
      { input: '[5]', output: '{5: 1}', explanation: 'Single element has frequency 1.' },
    ],
    constraints: ['0 <= arr.length <= 10^5', '-10^9 <= arr[i] <= 10^9'],
    intuition:
      'Iterate through the array and increment the count for each element in a hash map. If an element is not yet in the map, initialize it to 1.',
    pseudocode: [
      'function freqCounter(arr):',
      '  freq = {}',
      '  for each num in arr: freq[num] = freq[num] + 1',
      '  return freq',
    ],
    dryRun: {
      text: 'Count frequencies of [1,2,2,3,3,3].',
      steps: [
        { title: 'num = 1', content: 'freq[1] = 1' },
        { title: 'num = 2', content: 'freq[2] = 1' },
        { title: 'num = 2', content: 'freq[2] = 2' },
        { title: 'num = 3', content: 'freq[3] = 1' },
        { title: 'num = 3', content: 'freq[3] = 2' },
        { title: 'num = 3', content: 'freq[3] = 3' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nunordered_map<int,int> freqCounter(vector<int>& arr) {\n  unordered_map<int,int> freq;\n  for (int num : arr) freq[num]++;\n  return freq;\n}',
      javascript: 'function freqCounter(arr) {\n  const freq = new Map();\n  for (let num of arr) freq.set(num, (freq.get(num) || 0) + 1);\n  return freq;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(n)' },
    tips: [
      'Hash map provides O(1) insertion and lookup on average.',
      'Map vs unordered_map - Map is ordered, unordered_map is faster (average O(1)).',
      'Common starter for many frequency-based problems.',
    ],
  },

  {
    id: 'first-non-repeating-char',
    title: 'First Non-Repeating Character',
    difficulty: 'Easy',
    topic: 'HashMap',
    level: 3,
    problem:
      'Given a string, find the first character that does not repeat anywhere in the string. Return the character; if none, return null.',
    examples: [
      { input: '"aabbcdd"', output: '"c"', explanation: 'c appears once and is the first non-repeating character.' },
      { input: '"aabb"', output: 'null', explanation: 'All characters repeat.' },
    ],
    constraints: ['0 <= s.length <= 10^5', 's consists of lowercase English letters'],
    intuition:
      'First pass: count frequencies of all characters. Second pass: find the first character with frequency 1 and return it.',
    pseudocode: [
      'function firstNonRepeating(s):',
      '  freq = {}',
      '  for each char c in s: freq[c]++',
      '  for each char c in s:',
      '    if freq[c] == 1: return c',
      '  return null',
    ],
    dryRun: {
      text: 'Find first non-repeating character in "aabbcdd".',
      steps: [
        { title: 'Count frequencies', content: 'a:2, b:2, c:1, d:2' },
        { title: 'Scan s', content: 'a:2 -> skip, a:2 -> skip, b:2 -> skip, b:2 -> skip, c:1 -> return c' },
      ],
    },
    starterCode: {
      cpp: '#include <string>\n#include <unordered_map>\nusing namespace std;\n\nchar firstNonRepeating(string s) {\n  unordered_map<char,int> freq;\n  for (char c : s) freq[c]++;\n  for (char c : s) if (freq[c] == 1) return c;\n  return \'\\0\';\n}',
      javascript: 'function firstNonRepeating(s) {\n  const freq = new Map();\n  for (let c of s) freq.set(c, (freq.get(c) || 0) + 1);\n  for (let c of s) if (freq.get(c) === 1) return c;\n  return null;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(k)' },
    tips: [
      'Two-pass solution is optimal - O(n) time.',
      'Return null (or \\\\0 in C++) if no unique character.',
      'Character sets larger than 26 may require hash maps instead of arrays.',
    ],
  },

  {
    id: 'group-anagrams',
    title: 'Group Anagrams',
    difficulty: 'Medium',
    topic: 'HashMap',
    level: 3,
    problem:
      'Given an array of strings, group the anagrams together. Anagrams are words that contain the same characters in different orders.',
    examples: [
      { input: '["eat", "tea", "tan", "ate", "nat", "bat"]', output: '[["eat","tea","ate"], ["tan","nat"], ["bat"]]', explanation: 'eat, tea, ate share sorted key "aet"; tan, nat share "ant"; bat has key "abt".' },
      { input: '[""]', output: '[[""]]', explanation: 'Empty string is its own anagram group.' },
    ],
    constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100', 'strs[i] consists of lowercase English letters'],
    intuition:
      'Use a hash map where the key is the sorted version of each string. Iterate through strings, sort each, and add the original string to the map under its sorted key.',
    pseudocode: [
      'function groupAnagrams(strs):',
      '  map = {}',
      '  for each str in strs:',
      '    key = sort(str)',
      '    if key not in map: map[key] = []',
      '    map[key].push(str)',
      '  return values of map as array',
    ],
    dryRun: {
      text: 'Group anagrams of ["eat","tea","tan","ate","nat","bat"].',
      steps: [
        { title: 'Key "aet"', content: 'add eat, tea, ate' },
        { title: 'Key "ant"', content: 'add tan, nat' },
        { title: 'Key "abt"', content: 'add bat' },
        { title: 'Result', content: '[["eat","tea","ate"], ["tan","nat"], ["bat"]]' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nvector<vector<string>> groupAnagrams(vector<string>& strs) {\n  unordered_map<string, vector<string>> mp;\n  for (string s : strs) {\n    string key = s;\n    sort(key.begin(), key.end());\n    mp[key].push_back(s);\n  }\n  vector<vector<string>> result;\n  for (auto& p : mp) result.push_back(p.second);\n  return result;\n}',
      javascript: 'function groupAnagrams(strs) {\n  const map = new Map();\n  for (const s of strs) {\n    const key = s.split(\'\').sort().join(\'\');\n    if (!map.has(key)) map.set(key, []);\n    map.get(key).push(s);\n  }\n  return Array.from(map.values());\n}',
    },
    complexity: { time: 'O(n * k log k)', space: 'O(n * k)' },
    tips: [
      'Sorting each string is O(k log k) where k is average string length.',
      'Alternative: count characters using a 26-element array as key.',
      'The map groups strings with the same sorted key.',
    ],
  },

  {
    id: 'contains-duplicate',
    title: 'Contains Duplicate',
    difficulty: 'Easy',
    topic: 'HashMap',
    level: 3,
    problem:
      'Given an array of integers, return true if any value appears at least twice in the array, and false if every element is distinct.',
    examples: [
      { input: '[1, 2, 3, 1]', output: 'true', explanation: 'Value 1 appears twice.' },
      { input: '[1, 2, 3, 4]', output: 'false', explanation: 'All elements are distinct.' },
    ],
    constraints: ['1 <= arr.length <= 10^5', '-10^9 <= arr[i] <= 10^9'],
    intuition:
      'Use a hash set to track elements seen so far. As we iterate, if an element is already in the set, return true. If we finish without duplicates, return false.',
    pseudocode: [
      'function containsDuplicate(arr):',
      '  seen = {}',
      '  for each num in arr:',
      '    if num in seen: return true',
      '    seen.add(num)',
      '  return false',
    ],
    dryRun: {
      text: 'Check if [1,2,3,1] contains duplicates.',
      steps: [
        { title: 'num = 1', content: 'not in seen -> add 1, seen={1}' },
        { title: 'num = 2', content: 'not in seen -> add 2, seen={1,2}' },
        { title: 'num = 3', content: 'not in seen -> add 3, seen={1,2,3}' },
        { title: 'num = 1', content: '1 in seen -> return true' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\n#include <unordered_set>\nusing namespace std;\n\nbool containsDuplicate(vector<int>& arr) {\n  unordered_set<int> seen;\n  for (int num : arr) {\n    if (seen.count(num)) return true;\n    seen.insert(num);\n  }\n  return false;\n}',
      javascript: 'function containsDuplicate(arr) {\n  const seen = new Set();\n  for (let num of arr) {\n    if (seen.has(num)) return true;\n    seen.add(num);\n  }\n  return false;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(n)' },
    tips: [
      'Hash set gives O(1) average lookup/insertion.',
      'Can also sort and check adjacent elements (O(n log n), O(1) space).',
      'For very large n, hash set approach is preferred.',
    ],
  },

  // ============================================================
  // LEVEL 4 - Trees (7 questions)
  // ============================================================
  {
    id: 'tree-traversals',
    title: 'Tree Traversals (In/Pre/Post-order)',
    difficulty: 'Medium',
    topic: 'Trees',
    level: 4,
    problem:
      'Given the root of a binary tree, return its inorder, preorder, and postorder traversals. Inorder: left-root-right. Preorder: root-left-right. Postorder: left-right-root.',
    examples: [
      { input: 'root = [1, null, 2, 3]', output: 'Inorder: [1,3,2], Preorder: [1,2,3], Postorder: [3,2,1]', explanation: 'Tree: 1 is root, 2 is right child, 3 is left child of 2.' },
      { input: 'root = [1]', output: 'Inorder: [1], Preorder: [1], Postorder: [1]', explanation: 'Single node has same output for all traversals.' },
    ],
    constraints: ['0 <= number of nodes <= 100', '-100 <= Node.val <= 100'],
    intuition:
      'Use recursion for all three traversals. Inorder: recurse left, visit root, recurse right. Preorder: visit root, recurse left, recurse right. Postorder: recurse left, recurse right, visit root.',
    pseudocode: [
      'function inorder(root):',
      '  if root == null: return',
      '  inorder(root.left)',
      '  visit(root)',
      '  inorder(root.right)',
      '',
      'function preorder(root):',
      '  if root == null: return',
      '  visit(root)',
      '  preorder(root.left)',
      '  preorder(root.right)',
      '',
      'function postorder(root):',
      '  if root == null: return',
      '  postorder(root.left)',
      '  postorder(root.right)',
      '  visit(root)',
    ],
    dryRun: {
      text: 'Traverse tree with root 1 (right child 2, 2 left child 3).',
      steps: [
        { title: 'Inorder', content: 'Go left (null), visit 1, go right to 2, go left to 3, visit 3, back to 2, visit 2 -> [1,3,2]' },
        { title: 'Preorder', content: 'Visit 1, go right to 2, visit 2, go left to 3, visit 3 -> [1,2,3]' },
        { title: 'Postorder', content: 'Go left (null), go right to 2, go left to 3, visit 3, back to 2, visit 2, back to 1, visit 1 -> [3,2,1]' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\n#include <cstddef>\nusing namespace std;\n\nstruct TreeNode {\n  int val;\n  TreeNode *left, *right;\n  TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};\n\nvoid inorder(TreeNode* root, vector<int>& res) {\n  if (!root) return;\n  inorder(root->left, res);\n  res.push_back(root->val);\n  inorder(root->right, res);\n}\n\nvoid preorder(TreeNode* root, vector<int>& res) {\n  if (!root) return;\n  res.push_back(root->val);\n  preorder(root->left, res);\n  preorder(root->right, res);\n}\n\nvoid postorder(TreeNode* root, vector<int>& res) {\n  if (!root) return;\n  postorder(root->left, res);\n  postorder(root->right, res);\n  res.push_back(root->val);\n}',
      javascript: 'function TreeNode(val, left, right) {\n  this.val = (val === undefined ? 0 : val);\n  this.left = (left === undefined ? null : left);\n  this.right = (right === undefined ? null : right);\n}\n\nfunction inorder(root, res = []) {\n  if (!root) return res;\n  inorder(root.left, res);\n  res.push(root.val);\n  inorder(root.right, res);\n  return res;\n}\n\nfunction preorder(root, res = []) {\n  if (!root) return res;\n  res.push(root.val);\n  preorder(root.left, res);\n  preorder(root.right, res);\n  return res;\n}\n\nfunction postorder(root, res = []) {\n  if (!root) return res;\n  postorder(root.left, res);\n  postorder(root.right, res);\n  res.push(root.val);\n  return res;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(n)' },
    tips: [
      'All three traversals visit each node exactly once -> O(n).',
      'Recursion uses O(h) stack space, h = height of tree.',
      'Iterative versions use explicit stack for O(n) time, O(h) space.',
    ],
  },

  {
    id: 'height-of-tree',
    title: 'Height of Binary Tree',
    difficulty: 'Easy',
    topic: 'Trees',
    level: 4,
    problem:
      'Given the root of a binary tree, find its height. The height is the number of edges on the longest path from root to a leaf. If the tree is empty, return -1.',
    examples: [
      { input: 'root = [3, 9, 20, null, null, 15, 7]', output: '2', explanation: 'Height is 2 (3->20->15 or 3->20->7).' },
      { input: 'root = [1]', output: '0', explanation: 'Single node has height 0 (no edges).' },
    ],
    constraints: ['0 <= number of nodes <= 10^4', '-100 <= Node.val <= 100'],
    intuition:
      'Recursively compute the height of left and right subtrees. The height of the current node is 1 + max(leftHeight, rightHeight). Base case: null node has height -1.',
    pseudocode: [
      'function height(root):',
      '  if root == null: return -1',
      '  leftH = height(root.left)',
      '  rightH = height(root.right)',
      '  return 1 + max(leftH, rightH)',
    ],
    dryRun: {
      text: 'Find height of tree [3,9,20,null,null,15,7].',
      steps: [
        { title: 'Node 15 (leaf)', content: 'height = 0 (no children)' },
        { title: 'Node 7 (leaf)', content: 'height = 0' },
        { title: 'Node 20', content: 'height = 1 + max(0, 0) = 1' },
        { title: 'Node 9 (leaf)', content: 'height = 0' },
        { title: 'Root 3', content: 'height = 1 + max(0, 1) = 2' },
      ],
    },
    starterCode: {
      cpp: '#include <algorithm>\n#include <cstddef>\nusing namespace std;\n\nstruct TreeNode {\n  int val;\n  TreeNode *left, *right;\n  TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};\n\nint height(TreeNode* root) {\n  if (!root) return -1;\n  return 1 + max(height(root->left), height(root->right));\n}',
      javascript: 'function TreeNode(val, left, right) {\n  this.val = (val === undefined ? 0 : val);\n  this.left = (left === undefined ? null : left);\n  this.right = (right === undefined ? null : right);\n}\n\nfunction height(root) {\n  if (!root) return -1;\n  return 1 + Math.max(height(root.left), height(root.right));\n}',
    },
    complexity: { time: 'O(n)', space: 'O(n)' },
    tips: [
      'Height = number of edges, depth = number of nodes on path.',
      'Empty tree height is -1, single node height is 0.',
      'Recursion visits each node once.',
    ],
  },

  {
    id: 'balanced-tree',
    title: 'Check Balanced Tree',
    difficulty: 'Easy',
    topic: 'Trees',
    level: 4,
    problem:
      'Given a binary tree, determine if it is height-balanced. A balanced tree is one where the heights of the two subtrees of every node differ by at most 1.',
    examples: [
      { input: 'root = [3, 9, 20, null, null, 15, 7]', output: 'true', explanation: 'Left subtree height 0, right subtree height 1, difference <= 1 for all nodes.' },
      { input: 'root = [1, 2, 2, 3, 3, null, null, 4, 4]', output: 'false', explanation: 'Left subtree of root has height 3, right has height 1, difference > 1.' },
    ],
    constraints: ['0 <= number of nodes <= 5000', '-10^4 <= Node.val <= 10^4'],
    intuition:
      'Modified height function that returns -1 when a subtree is unbalanced. Recursively check left and right, if either returns -1 or their height difference > 1, return -1. Otherwise return 1 + max height.',
    pseudocode: [
      'function isBalanced(root):',
      '  return checkHeight(root) != -1',
      '',
      'function checkHeight(root):',
      '  if root == null: return 0',
      '  left = checkHeight(root.left)',
      '  if left == -1: return -1',
      '  right = checkHeight(root.right)',
      '  if right == -1: return -1',
      '  if abs(left - right) > 1: return -1',
      '  return 1 + max(left, right)',
    ],
    dryRun: {
      text: 'Check if tree [3,9,20,null,null,15,7] is balanced.',
      steps: [
        { title: 'Leaves (9, 15, 7)', content: 'height = 0, balanced' },
        { title: 'Node 20', content: 'left=0 (15), right=0 (7), diff=0, height=1' },
        { title: 'Root 3', content: 'left=0 (9), right=1 (20), diff=1, height=2 -> balanced' },
      ],
    },
    starterCode: {
      cpp: '#include <algorithm>\n#include <cstdlib>\n#include <cstddef>\nusing namespace std;\n\nstruct TreeNode {\n  int val;\n  TreeNode *left, *right;\n  TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};\n\nint check(TreeNode* root) {\n  if (!root) return 0;\n  int l = check(root->left);\n  if (l == -1) return -1;\n  int r = check(root->right);\n  if (r == -1) return -1;\n  if (abs(l - r) > 1) return -1;\n  return 1 + max(l, r);\n}\n\nbool isBalanced(TreeNode* root) {\n  return check(root) != -1;\n}',
      javascript: 'function TreeNode(val, left, right) {\n  this.val = (val === undefined ? 0 : val);\n  this.left = (left === undefined ? null : left);\n  this.right = (right === undefined ? null : right);\n}\n\nfunction check(root) {\n  if (!root) return 0;\n  const l = check(root.left);\n  if (l === -1) return -1;\n  const r = check(root.right);\n  if (r === -1) return -1;\n  if (Math.abs(l - r) > 1) return -1;\n  return 1 + Math.max(l, r);\n}\n\nfunction isBalanced(root) {\n  return check(root) !== -1;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(n)' },
    tips: [
      'Return -1 as the unbalanced sentinel to avoid recomputation.',
      'A single traversal is sufficient (post-order).',
      'Naive approach computes height separately for each node -> O(n^2).',
    ],
  },

  {
    id: 'lowest-common-ancestor',
    title: 'Lowest Common Ancestor',
    difficulty: 'Medium',
    topic: 'Trees',
    level: 4,
    problem:
      'Given a binary tree and two nodes p and q, find their lowest common ancestor (LCA). The LCA is the lowest node in the tree that has both p and q as descendants.',
    examples: [
      { input: 'root = [3,5,1,6,2,0,8,null,null,7,4], p=5, q=1', output: '3', explanation: 'LCA of nodes 5 and 1 is 3.' },
      { input: 'root = [3,5,1,6,2,0,8,null,null,7,4], p=5, q=4', output: '5', explanation: 'LCA of nodes 5 and 4 is 5 (p is ancestor of q).' },
    ],
    constraints: ['2 <= number of nodes <= 10^5', '-10^9 <= Node.val <= 10^9', 'p and q exist in the tree', 'All values are unique'],
    intuition:
      'Recursively search the tree. If the current node is either p or q, return it. Recurse on left and right. If both sides return non-null, the current node is the LCA. If only one side returns a value, that side is the answer (since both nodes are in that subtree).',
    pseudocode: [
      'function lowestCommonAncestor(root, p, q):',
      '  if root == null or root == p or root == q: return root',
      '  left = lowestCommonAncestor(root.left, p, q)',
      '  right = lowestCommonAncestor(root.right, p, q)',
      '  if left and right: return root',
      '  return left ? left : right',
    ],
    dryRun: {
      text: 'Find LCA of nodes 5 and 1 in tree rooted at 3.',
      steps: [
        { title: 'Search from 3', content: 'Recurse left to 5, right to 1' },
        { title: 'Node 5', content: 'Found p=5 -> return 5' },
        { title: 'Node 1', content: 'Found q=1 -> return 1' },
        { title: 'Back to root 3', content: 'Both left and right not null -> return 3' },
      ],
    },
    starterCode: {
      cpp: '#include <cstddef>\nusing namespace std;\n\nstruct TreeNode {\n  int val;\n  TreeNode *left, *right;\n  TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};\n\nTreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {\n  if (!root || root == p || root == q) return root;\n  TreeNode* l = lowestCommonAncestor(root->left, p, q);\n  TreeNode* r = lowestCommonAncestor(root->right, p, q);\n  if (l && r) return root;\n  return l ? l : r;\n}',
      javascript: 'function TreeNode(val, left, right) {\n  this.val = (val === undefined ? 0 : val);\n  this.left = (left === undefined ? null : left);\n  this.right = (right === undefined ? null : right);\n}\n\nfunction lowestCommonAncestor(root, p, q) {\n  if (!root || root === p || root === q) return root;\n  const l = lowestCommonAncestor(root.left, p, q);\n  const r = lowestCommonAncestor(root.right, p, q);\n  if (l && r) return root;\n  return l || r;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(n)' },
    tips: [
      'Elegant recursive solution — traverses tree once.',
      'p or q could be ancestor of the other — handled by early return.',
      'Works for any binary tree (not just BST).',
    ],
  },

  {
    id: 'level-order-traversal',
    title: 'Level Order Traversal',
    difficulty: 'Medium',
    topic: 'Trees',
    level: 4,
    problem:
      'Given the root of a binary tree, return the level order traversal of its nodes values. Group nodes by level from left to right.',
    examples: [
      { input: 'root = [3, 9, 20, null, null, 15, 7]', output: '[[3], [9, 20], [15, 7]]', explanation: 'Level 0: [3], Level 1: [9,20], Level 2: [15,7].' },
      { input: 'root = [1]', output: '[[1]]', explanation: 'Single level with one node.' },
    ],
    constraints: ['0 <= number of nodes <= 2000', '-1000 <= Node.val <= 1000'],
    intuition:
      'Use a queue. Start with the root. While the queue is not empty, process all nodes at the current level (queue size determines level size). For each node, add its value to the level list and its children to the queue.',
    pseudocode: [
      'function levelOrder(root):',
      '  if root == null: return []',
      '  result = [], queue = [root]',
      '  while queue not empty:',
      '    levelSize = queue.size()',
      '    level = []',
      '    for i = 0 to levelSize - 1:',
      '      node = queue.dequeue()',
      '      level.push(node.val)',
      '      if node.left: queue.enqueue(node.left)',
      '      if node.right: queue.enqueue(node.right)',
      '    result.push(level)',
      '  return result',
    ],
    dryRun: {
      text: 'Level order traversal of [3,9,20,null,null,15,7].',
      steps: [
        { title: 'Queue = [3]', content: 'Level 0: [3], queue = [9,20]' },
        { title: 'Queue = [9,20]', content: 'Level 1: [9,20], queue = [15,7]' },
        { title: 'Queue = [15,7]', content: 'Level 2: [15,7], queue = []' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\n#include <queue>\n#include <cstddef>\nusing namespace std;\n\nstruct TreeNode {\n  int val;\n  TreeNode *left, *right;\n  TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};\n\nvector<vector<int>> levelOrder(TreeNode* root) {\n  if (!root) return {};\n  vector<vector<int>> result;\n  queue<TreeNode*> q;\n  q.push(root);\n  while (!q.empty()) {\n    int sz = q.size();\n    vector<int> level;\n    for (int i = 0; i < sz; i++) {\n      TreeNode* node = q.front(); q.pop();\n      level.push_back(node->val);\n      if (node->left) q.push(node->left);\n      if (node->right) q.push(node->right);\n    }\n    result.push_back(level);\n  }\n  return result;\n}',
      javascript: 'function TreeNode(val, left, right) {\n  this.val = (val === undefined ? 0 : val);\n  this.left = (left === undefined ? null : left);\n  this.right = (right === undefined ? null : right);\n}\n\nfunction levelOrder(root) {\n  if (!root) return [];\n  const result = [];\n  const queue = [root];\n  while (queue.length) {\n    const sz = queue.length;\n    const level = [];\n    for (let i = 0; i < sz; i++) {\n      const node = queue.shift();\n      level.push(node.val);\n      if (node.left) queue.push(node.left);\n      if (node.right) queue.push(node.right);\n    }\n    result.push(level);\n  }\n  return result;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(n)' },
    tips: [
      'BFS using queue is the standard for level order.',
      'Process all nodes at the current level before moving to the next.',
      'Use a for loop of size = queue.size() to group by level.',
    ],
  },

  {
    id: 'bst-search',
    title: 'Search in BST',
    difficulty: 'Easy',
    topic: 'Trees',
    level: 4,
    problem:
      'Given the root of a binary search tree and a target value, return the subtree rooted at the node containing the target. If the target does not exist, return null.',
    examples: [
      { input: 'root = [4,2,7,1,3], target = 2', output: '[2,1,3]', explanation: 'The subtree rooted at node 2.' },
      { input: 'root = [4,2,7,1,3], target = 5', output: 'null', explanation: '5 is not in the BST.' },
    ],
    constraints: ['0 <= number of nodes <= 5000', '-10^5 <= Node.val <= 10^5', 'All values are unique'],
    intuition:
      'BST property: left subtree values < root value < right subtree values. Compare target with root: if equal, return root; if target < root, search left; if target > root, search right.',
    pseudocode: [
      'function searchBST(root, target):',
      '  if root == null or root.val == target: return root',
      '  if target < root.val: return searchBST(root.left, target)',
      '  else: return searchBST(root.right, target)',
    ],
    dryRun: {
      text: 'Search for 2 in BST [4,2,7,1,3].',
      steps: [
        { title: 'root = 4', content: '2 < 4 -> go left' },
        { title: 'root = 2', content: '2 == 2 -> return this subtree' },
      ],
    },
    starterCode: {
      cpp: '#include <cstddef>\nusing namespace std;\n\nstruct TreeNode {\n  int val;\n  TreeNode *left, *right;\n  TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};\n\nTreeNode* searchBST(TreeNode* root, int target) {\n  if (!root || root->val == target) return root;\n  if (target < root->val) return searchBST(root->left, target);\n  return searchBST(root->right, target);\n}',
      javascript: 'function TreeNode(val, left, right) {\n  this.val = (val === undefined ? 0 : val);\n  this.left = (left === undefined ? null : left);\n  this.right = (right === undefined ? null : right);\n}\n\nfunction searchBST(root, target) {\n  if (!root || root.val === target) return root;\n  if (target < root.val) return searchBST(root.left, target);\n  return searchBST(root.right, target);\n}',
    },
    complexity: { time: 'O(h)', space: 'O(h)' },
    tips: [
      'Recursive or iterative — both are O(h) time.',
      'h = log n for balanced BST, h = n for skewed BST.',
      'BST property halves the search space at each step.',
    ],
  },

  {
    id: 'insert-into-bst',
    title: 'Insert into BST',
    difficulty: 'Medium',
    topic: 'Trees',
    level: 4,
    problem:
      'Insert a value into a binary search tree. Return the root of the BST after insertion. The BST property must be maintained: left < root < right.',
    examples: [
      { input: 'root = [4,2,7,1,3], val = 5', output: '[4,2,7,1,3,5]', explanation: '5 is less than 7 and greater than 4, so it becomes the left child of 7.' },
      { input: 'root = [], val = 5', output: '[5]', explanation: 'Empty tree, new node becomes root.' },
    ],
    constraints: ['0 <= number of nodes <= 10^4', '-10^8 <= Node.val <= 10^8', 'All values are unique', 'val not already in tree'],
    intuition:
      'Traverse the BST to find the correct insertion point. If val < root.val, go left; if val > root.val, go right. When reaching null, insert a new node with the value.',
    pseudocode: [
      'function insertIntoBST(root, val):',
      '  if root == null: return new TreeNode(val)',
      '  if val < root.val:',
      '    root.left = insertIntoBST(root.left, val)',
      '  else:',
      '    root.right = insertIntoBST(root.right, val)',
      '  return root',
    ],
    dryRun: {
      text: 'Insert 5 into BST [4,2,7,1,3].',
      steps: [
        { title: 'root = 4', content: '5 > 4 -> go right to 7' },
        { title: 'root = 7', content: '5 < 7 -> go left (null) -> insert new node(5) as left child' },
        { title: 'Return', content: 'Root 4 remains, with 5 as left of 7' },
      ],
    },
    starterCode: {
      cpp: '#include <cstddef>\nusing namespace std;\n\nstruct TreeNode {\n  int val;\n  TreeNode *left, *right;\n  TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};\n\nTreeNode* insertIntoBST(TreeNode* root, int val) {\n  if (!root) return new TreeNode(val);\n  if (val < root->val) root->left = insertIntoBST(root->left, val);\n  else root->right = insertIntoBST(root->right, val);\n  return root;\n}',
      javascript: 'function TreeNode(val, left, right) {\n  this.val = (val === undefined ? 0 : val);\n  this.left = (left === undefined ? null : left);\n  this.right = (right === undefined ? null : right);\n}\n\nfunction insertIntoBST(root, val) {\n  if (!root) return new TreeNode(val);\n  if (val < root.val) root.left = insertIntoBST(root.left, val);\n  else root.right = insertIntoBST(root.right, val);\n  return root;\n}',
    },
    complexity: { time: 'O(h)', space: 'O(h)' },
    tips: [
      'Always insert at a leaf position — never need to restructure.',
      'Return the original root (or the new node if root was null).',
      'The new node is always inserted as a leaf.',
    ],
  },

  // ============================================================
  // LEVEL 5 - Dynamic Programming Basics (5 questions)
  // ============================================================
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    topic: 'Dynamic Programming',
    level: 5,
    problem:
      'You are climbing a staircase with n steps. You can take either 1 step or 2 steps at a time. Count the number of distinct ways to reach the top.',
    examples: [
      { input: 'n = 2', output: '2', explanation: '1+1 or 2 -> 2 ways.' },
      { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, or 2+1 -> 3 ways.' },
    ],
    constraints: ['1 <= n <= 45'],
    intuition:
      'This is the Fibonacci sequence in disguise. The number of ways to reach step i is the sum of ways to reach i-1 and i-2 (since you can arrive from one step before or two steps before). Use DP with O(n) time and O(1) space.',
    pseudocode: [
      'function climbStairs(n):',
      '  if n <= 2: return n',
      '  oneStep = 1 (ways to reach step 1)',
      '  twoStep = 2 (ways to reach step 2)',
      '  for i = 3 to n:',
      '    curr = oneStep + twoStep',
      '    oneStep = twoStep',
      '    twoStep = curr',
      '  return twoStep',
    ],
    dryRun: {
      text: 'Find ways to climb 4 stairs.',
      steps: [
        { title: 'Base', content: 'n=1: 1 way, n=2: 2 ways' },
        { title: 'i=3', content: 'curr = 1 + 2 = 3' },
        { title: 'i=4', content: 'curr = 2 + 3 = 5' },
      ],
    },
    starterCode: {
      cpp: 'using namespace std;\n\nint climbStairs(int n) {\n  if (n <= 2) return n;\n  int one = 1, two = 2;\n  for (int i = 3; i <= n; i++) {\n    int curr = one + two;\n    one = two;\n    two = curr;\n  }\n  return two;\n}',
      javascript: 'function climbStairs(n) {\n  if (n <= 2) return n;\n  let one = 1, two = 2;\n  for (let i = 3; i <= n; i++) {\n    const curr = one + two;\n    one = two;\n    two = curr;\n  }\n  return two;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    tips: [
      'Classic DP problem — the recurrence is fib(n) = fib(n-1) + fib(n-2).',
      'O(1) space is achieved by only storing the last two values.',
      'Can also be solved with matrix exponentiation in O(log n).',
    ],
  },

  {
    id: 'house-robber',
    title: 'House Robber',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    level: 5,
    problem:
      'You are a robber planning to rob houses along a street. Each house has a certain amount of money. You cannot rob two adjacent houses. Find the maximum amount you can rob.',
    examples: [
      { input: '[1, 2, 3, 1]', output: '4', explanation: 'Rob house 1 (1) + house 3 (3) = 4.' },
      { input: '[2, 7, 9, 3, 1]', output: '12', explanation: 'Rob house 1 (2) + house 3 (9) + house 5 (1) = 12.' },
    ],
    constraints: ['1 <= nums.length <= 100', '0 <= nums[i] <= 400'],
    intuition:
      'DP where dp[i] = max amount for first i houses. At each house, either skip it (dp[i-1]) or rob it (nums[i] + dp[i-2]). dp[i] = max(dp[i-1], nums[i] + dp[i-2]).',
    pseudocode: [
      'function rob(nums):',
      '  if nums.length == 0: return 0',
      '  if nums.length == 1: return nums[0]',
      '  prev2 = nums[0]',
      '  prev1 = max(nums[0], nums[1])',
      '  for i = 2 to nums.length - 1:',
      '    curr = max(prev1, nums[i] + prev2)',
      '    prev2 = prev1',
      '    prev1 = curr',
      '  return prev1',
    ],
    dryRun: {
      text: 'Max rob from [2,7,9,3,1].',
      steps: [
        { title: 'Initialize', content: 'prev2 = 2, prev1 = max(2,7) = 7' },
        { title: 'i=2, house 9', content: 'curr = max(7, 9+2=11) = 11, prev2=7, prev1=11' },
        { title: 'i=3, house 3', content: 'curr = max(11, 3+7=10) = 11, prev2=11, prev1=11' },
        { title: 'i=4, house 1', content: 'curr = max(11, 1+11=12) = 12' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint rob(vector<int>& nums) {\n  int n = nums.size();\n  if (n == 0) return 0;\n  if (n == 1) return nums[0];\n  int prev2 = nums[0];\n  int prev1 = max(nums[0], nums[1]);\n  for (int i = 2; i < n; i++) {\n    int curr = max(prev1, nums[i] + prev2);\n    prev2 = prev1;\n    prev1 = curr;\n  }\n  return prev1;\n}',
      javascript: 'function rob(nums) {\n  const n = nums.length;\n  if (n === 0) return 0;\n  if (n === 1) return nums[0];\n  let prev2 = nums[0];\n  let prev1 = Math.max(nums[0], nums[1]);\n  for (let i = 2; i < n; i++) {\n    const curr = Math.max(prev1, nums[i] + prev2);\n    prev2 = prev1;\n    prev1 = curr;\n  }\n  return prev1;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    tips: [
      'Classic DP with a simple recurrence relation.',
      'Only two variables needed for O(1) space.',
      'Extension: houses in a circle (robber cannot rob first and last simultaneously).',
    ],
  },

  {
    id: 'coin-change',
    title: 'Coin Change',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    level: 5,
    problem:
      'Given an array of coin denominations and a target amount, return the minimum number of coins needed to make up that amount. If impossible, return -1.',
    examples: [
      { input: 'coins = [1, 2, 5], amount = 11', output: '3', explanation: '5 + 5 + 1 = 11, using 3 coins.' },
      { input: 'coins = [2], amount = 3', output: '-1', explanation: 'Cannot make 3 with only coin 2.' },
    ],
    constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
    intuition:
      'DP where dp[i] = min coins needed for amount i. Initialize dp[0] = 0, others = INF. For each coin, update dp[a] = min(dp[a], 1 + dp[a - coin]) for all amounts from coin to target.',
    pseudocode: [
      'function coinChange(coins, amount):',
      '  dp = [amount + 1] * (amount + 1)',
      '  dp[0] = 0',
      '  for a = 1 to amount:',
      '    for each coin in coins:',
      '      if a >= coin:',
      '        dp[a] = min(dp[a], 1 + dp[a - coin])',
      '  return dp[amount] > amount ? -1 : dp[amount]',
    ],
    dryRun: {
      text: 'Min coins for amount 11 with coins [1,2,5].',
      steps: [
        { title: 'Initialize', content: 'dp[0]=0, dp[1..11]=12' },
        { title: 'Process coin 1', content: 'dp[1]=1, dp[2]=2, ..., dp[11]=11' },
        { title: 'Process coin 2', content: 'dp[2]=min(2,1+dp[0]=1)=1, dp[4]=min(4,1+dp[2]=2)=2, etc.' },
        { title: 'Process coin 5', content: 'dp[5]=1, dp[10]=2, dp[11]=min(11,1+dp[6]=1+3=4)=4' },
        { title: 'Final dp[11]', content: 'After all coins: dp[11] = 3 (5+5+1)' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\n#include <algorithm>\n#include <climits>\nusing namespace std;\n\nint coinChange(vector<int>& coins, int amount) {\n  vector<int> dp(amount + 1, amount + 1);\n  dp[0] = 0;\n  for (int a = 1; a <= amount; a++) {\n    for (int coin : coins) {\n      if (a >= coin) dp[a] = min(dp[a], 1 + dp[a - coin]);\n    }\n  }\n  return dp[amount] > amount ? -1 : dp[amount];\n}',
      javascript: 'function coinChange(coins, amount) {\n  const dp = new Array(amount + 1).fill(amount + 1);\n  dp[0] = 0;\n  for (let a = 1; a <= amount; a++) {\n    for (const coin of coins) {\n      if (a >= coin) dp[a] = Math.min(dp[a], 1 + dp[a - coin]);\n    }\n  }\n  return dp[amount] > amount ? -1 : dp[amount];\n}',
    },
    complexity: { time: 'O(n * amount)', space: 'O(amount)' },
    tips: [
      'Initialize dp with a value larger than any possible answer (e.g., amount + 1).',
      'dp[0] = 0 is the base case (0 coins needed for 0 amount).',
      'If dp[amount] remains > amount, it means no combination works.',
    ],
  },

  {
    id: 'longest-increasing-subsequence',
    title: 'Longest Increasing Subsequence',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    level: 5,
    problem:
      'Given an array of integers, find the length of the longest strictly increasing subsequence. A subsequence is a sequence that can be derived by deleting some elements without changing the order.',
    examples: [
      { input: '[10, 9, 2, 5, 3, 7, 101, 18]', output: '4', explanation: 'LIS = [2, 3, 7, 101] of length 4.' },
      { input: '[0, 1, 0, 3, 2, 3]', output: '4', explanation: 'LIS = [0, 1, 2, 3].' },
    ],
    constraints: ['1 <= nums.length <= 2500', '-10^4 <= nums[i] <= 10^4'],
    intuition:
      'DP: dp[i] = length of LIS ending at index i. For each i, check all j < i. If nums[j] < nums[i], dp[i] = max(dp[i], dp[j] + 1). Result is the max in dp array. O(n^2) time.',
    pseudocode: [
      'function lengthOfLIS(nums):',
      '  dp = [1] * n',
      '  maxLen = 1',
      '  for i = 0 to n-1:',
      '    for j = 0 to i-1:',
      '      if nums[j] < nums[i]:',
      '        dp[i] = max(dp[i], dp[j] + 1)',
      '    maxLen = max(maxLen, dp[i])',
      '  return maxLen',
    ],
    dryRun: {
      text: 'Find LIS of [10, 9, 2, 5, 3, 7, 101, 18].',
      steps: [
        { title: 'i=0, num=10', content: 'dp[0]=1, maxLen=1' },
        { title: 'i=1, num=9', content: '9 < 10? No -> dp[1]=1' },
        { title: 'i=2, num=2', content: 'dp[2]=1' },
        { title: 'i=3, num=5', content: '2 < 5 -> dp[3]=max(1,1+1)=2, maxLen=2' },
        { title: 'i=4, num=3', content: '2 < 3 -> dp[4]=2, 5? No (5>3)' },
        { title: 'i=5, num=7', content: '2->dp=2, 5->dp=3, 3->dp=3 -> dp[5]=3' },
        { title: 'i=6, num=101', content: '7<101->dp[6]=max(1,3+1)=4, maxLen=4' },
        { title: 'i=7, num=18', content: '7<18->dp[7]=max(1,3+1)=4' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint lengthOfLIS(vector<int>& nums) {\n  int n = nums.size();\n  vector<int> dp(n, 1);\n  int maxLen = 1;\n  for (int i = 0; i < n; i++) {\n    for (int j = 0; j < i; j++) {\n      if (nums[j] < nums[i]) dp[i] = max(dp[i], dp[j] + 1);\n    }\n    maxLen = max(maxLen, dp[i]);\n  }\n  return maxLen;\n}',
      javascript: 'function lengthOfLIS(nums) {\n  const n = nums.length;\n  const dp = new Array(n).fill(1);\n  let maxLen = 1;\n  for (let i = 0; i < n; i++) {\n    for (let j = 0; j < i; j++) {\n      if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);\n    }\n    maxLen = Math.max(maxLen, dp[i]);\n  }\n  return maxLen;\n}',
    },
    complexity: { time: 'O(n^2)', space: 'O(n)' },
    tips: [
      'Standard O(n^2) DP approach.',
      'Optimized O(n log n) version uses patience sorting (binary search on tails array).',
      'dp[i] = 1 initially (each element is a subsequence of length 1).',
    ],
  },

  {
    id: 'maximum-subarray',
    title: 'Maximum Subarray (Kadane\'s)',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    level: 5,
    problem:
      'Given an array of integers, find the contiguous subarray with the largest sum. This is the same as Kadane\'s algorithm from Level 1.',
    examples: [
      { input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]', output: '6', explanation: '[4, -1, 2, 1] has sum 6.' },
      { input: '[1]', output: '1', explanation: 'Single element subarray.' },
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    intuition:
      'Kadane\'s algorithm: maintain a running sum of the current subarray. If the running sum goes negative, reset to 0. Track the maximum sum seen.',
    pseudocode: [
      'function maxSubArray(nums):',
      '  maxSum = nums[0], currSum = 0',
      '  for each num in nums:',
      '    currSum += num',
      '    maxSum = max(maxSum, currSum)',
      '    if currSum < 0: currSum = 0',
      '  return maxSum',
    ],
    dryRun: {
      text: 'Find max subarray sum of [-2,1,-3,4,-1,2,1,-5,4].',
      steps: [
        { title: 'Start', content: 'maxSum = -2, currSum = 0' },
        { title: '-2', content: 'currSum = -2, maxSum = -2, reset currSum = 0' },
        { title: '1', content: 'currSum = 1, maxSum = 1' },
        { title: '-3', content: 'currSum = -2, maxSum stays 1, reset to 0' },
        { title: '4', content: 'currSum = 4, maxSum = 4' },
        { title: '-1', content: 'currSum = 3' },
        { title: '2', content: 'currSum = 5, maxSum = 5' },
        { title: '1', content: 'currSum = 6, maxSum = 6' },
        { title: '-5', content: 'currSum = 1' },
        { title: '4', content: 'currSum = 5' },
        { title: 'Result', content: '6' },
      ],
    },
    starterCode: {
      cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint maxSubArray(vector<int>& nums) {\n  int maxSum = nums[0], currSum = 0;\n  for (int num : nums) {\n    currSum += num;\n    maxSum = max(maxSum, currSum);\n    if (currSum < 0) currSum = 0;\n  }\n  return maxSum;\n}',
      javascript: 'function maxSubArray(nums) {\n  let maxSum = nums[0], currSum = 0;\n  for (let num of nums) {\n    currSum += num;\n    maxSum = Math.max(maxSum, currSum);\n    if (currSum < 0) currSum = 0;\n  }\n  return maxSum;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    tips: [
      'Classic Kadane\'s algorithm — simple but powerful.',
      'Reset currSum to 0 when it goes negative.',
      'Initialize maxSum with nums[0], not 0.',
    ],
  },
];

export const LEVELS: LevelInfo[] = [
  {
    level: 1,
    name: 'Must Know',
    rating: 5,
    topics: [
      { name: 'Arrays', questionIds: ['reverse-array', 'max-min', 'second-largest', 'remove-duplicates', 'rotate-array', 'move-zeroes', 'merge-sorted-arrays', 'find-missing-number', 'two-sum', 'kadanes-algorithm'] },
      { name: 'Strings', questionIds: ['reverse-string', 'palindrome', 'count-characters', 'count-vowels', 'check-anagram', 'remove-duplicate-chars', 'reverse-words', 'longest-common-prefix', 'first-unique-character', 'string-compression'] },
      { name: 'Loops & Math', questionIds: ['fibonacci', 'factorial', 'prime-number', 'armstrong-number', 'palindrome-number', 'gcd', 'lcm', 'power-function', 'sum-of-digits', 'reverse-number'] },
    ],
  },
  {
    level: 2,
    name: 'Very Common',
    rating: 5,
    topics: [
      { name: 'Searching', questionIds: ['linear-search', 'binary-search', 'first-occurrence', 'last-occurrence', 'search-in-sorted-array'] },
      { name: 'Sorting', questionIds: ['bubble-sort', 'selection-sort', 'insertion-sort', 'merge-sort', 'quick-sort'] },
      { name: 'Recursion', questionIds: ['recursive-factorial', 'recursive-fibonacci', 'recursive-reverse-string', 'recursive-binary-search', 'generate-subsets'] },
    ],
  },
  {
    level: 3,
    name: 'Most Asked DSA',
    rating: 4,
    topics: [
      { name: 'Linked List', questionIds: ['reverse-linked-list', 'detect-loop', 'find-middle-node', 'merge-two-lists', 'delete-node'] },
      { name: 'Stack', questionIds: ['valid-parentheses', 'min-stack', 'next-greater-element', 'evaluate-postfix', 'balanced-parentheses'] },
      { name: 'Queue', questionIds: ['queue-using-stack', 'stack-using-queue', 'circular-queue'] },
      { name: 'HashMap', questionIds: ['two-sum-hashmap', 'frequency-counter', 'first-non-repeating-char', 'group-anagrams', 'contains-duplicate'] },
    ],
  },
  {
    level: 4,
    name: 'Trees',
    rating: 4,
    topics: [
      { name: 'Binary Trees', questionIds: ['tree-traversals', 'height-of-tree', 'balanced-tree', 'lowest-common-ancestor', 'level-order-traversal'] },
      { name: 'Binary Search Tree', questionIds: ['bst-search', 'insert-into-bst'] },
    ],
  },
  {
    level: 5,
    name: 'Dynamic Programming Basics',
    rating: 3,
    topics: [
      { name: 'Dynamic Programming', questionIds: ['climbing-stairs', 'house-robber', 'coin-change', 'longest-increasing-subsequence', 'maximum-subarray'] },
    ],
  },
];
