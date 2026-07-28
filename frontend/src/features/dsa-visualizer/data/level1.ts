import type { QuestionData } from '../types';

export const level1Questions: QuestionData[] = [
  // ===================== ARRAYS (10) =====================
  // 1. Reverse Array
  {
    id: 'reverse-array',
    title: 'Reverse an Array',
    difficulty: 'Easy',
    topic: 'Arrays',
    level: 1,
    problem: 'Given an array of integers, reverse the array in-place. You must modify the original array without using extra space proportional to the input size.',
    example: 'Input:  [1, 2, 3, 4, 5]\nOutput: [5, 4, 3, 2, 1]\n\nInput:  [1]\nOutput: [1]\n\nInput:  []\nOutput: []',
    intuition: 'Use two pointers: one at the start and one at the end. Swap the elements at these pointers, then move the start pointer forward and the end pointer backward until they meet or cross. This gives O(n) time and O(1) space.',
    steps: [
      {
        title: 'Initialize Two Pointers',
        description: 'Place a pointer `i` at the first index (0) and a pointer `j` at the last index (n-1).',
        why: 'Using two pointers lets us swap elements from opposite ends, processing the entire array in a single pass.',
        animations: [
          { type: 'showVariable', target: 'i', value: 0, description: 'Left pointer initialized to index 0' },
          { type: 'showVariable', target: 'j', value: 4, description: 'Right pointer initialized to last index' },
          { type: 'highlight', target: 'array', indices: [0, 4], color: '#3B82F6', label: 'i and j' },
        ],
      },
      {
        title: 'Swap Elements at i and j',
        description: 'Swap arr[i] and arr[j]. Then increment i and decrement j.',
        why: 'Swapping the outer pair ensures those two elements land in their correct reversed positions.',
        animations: [
          { type: 'compare', target: 'array', indices: [0, 4], color: '#EAB308', label: 'Comparing arr[0]=1 and arr[4]=5' },
          { type: 'swap', target: 'array', from: 1, to: 5, index: 0, indices: [0, 4], color: '#22C55E', label: 'Swapping 1 and 5' },
          { type: 'updateVariable', target: 'i', value: 1, label: 'i++' },
          { type: 'updateVariable', target: 'j', value: 3, label: 'j--' },
        ],
      },
      {
        title: 'Continue Swapping Inward',
        description: 'Swap arr[1] and arr[3]. After the swap, i becomes 2 and j becomes 2.',
        why: 'We keep moving inward until the pointers cross or meet, which means every element has been swapped exactly once.',
        animations: [
          { type: 'compare', target: 'array', indices: [1, 3], color: '#EAB308', label: 'Comparing arr[1]=2 and arr[3]=4' },
          { type: 'swap', target: 'array', from: 2, to: 4, index: 1, indices: [1, 3], color: '#22C55E', label: 'Swapping 2 and 4' },
          { type: 'updateVariable', target: 'i', value: 2, label: 'i++' },
          { type: 'updateVariable', target: 'j', value: 2, label: 'j--' },
        ],
      },
      {
        title: 'Pointers Meet — Done',
        description: 'Now i === j, so the loop ends. The array is fully reversed.',
        why: 'When i >= j, every element has been processed. No more swaps are needed.',
        animations: [
          { type: 'highlight', target: 'array', indices: [2], color: '#22C55E', label: 'Middle element stays in place' },
          { type: 'showText', value: 'Array reversed successfully!', label: 'Done', color: '#22C55E' },
        ],
      },
    ],
    pseudocode: [
      'function reverseArray(arr):',
      '  i = 0',
      '  j = arr.length - 1',
      '  while i < j:',
      '    swap(arr[i], arr[j])',
      '    i++',
      '    j--',
      '  return arr',
    ],
    code: {
      cpp: 'void reverseArray(vector<int>& arr) {\n  int i = 0, j = arr.size() - 1;\n  while (i < j) {\n    swap(arr[i], arr[j]);\n    i++;\n    j--;\n  }\n}',
      javascript: 'function reverseArray(arr) {\n  let i = 0, j = arr.length - 1;\n  while (i < j) {\n    [arr[i], arr[j]] = [arr[j], arr[i]];\n    i++;\n    j--;\n  }\n  return arr;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    commonMistakes: [
      'Using i <= j instead of i < j causes unnecessary swap of the middle element.',
      'Creating a new array instead of reversing in-place.',
      'Off-by-one errors with the right pointer initialization (arr.length vs arr.length - 1).',
    ],
    tips: [
      'Always verify edge cases: empty array and single-element array.',
      'Drawing the two pointers on paper helps visualize the process.',
      'The same technique applies to reversing parts of an array (e.g., first k elements).',
    ],
    inputExample: { array: [1, 2, 3, 4, 5] },
  },
  // 2. Maximum and Minimum
  {
    id: 'max-min',
    title: 'Maximum and Minimum in an Array',
    difficulty: 'Easy',
    topic: 'Arrays',
    level: 1,
    problem: 'Given an array of integers, find both the maximum and minimum elements in the array with a single pass (linear time).',
    example: 'Input:  [3, 5, 1, 8, -2, 7]\nOutput: max = 8, min = -2\n\nInput:  [10]\nOutput: max = 10, min = 10',
    intuition: 'Initialize max and min as the first element. Traverse the rest of the array once, updating max when a larger element is found and min when a smaller element is found. This is O(n) time and O(1) space.',
    steps: [
      {
        title: 'Initialize Max and Min',
        description: 'Set both max and min to the first element arr[0] = 3.',
        why: 'Starting with the first element gives us a baseline to compare against.',
        animations: [
          { type: 'showVariable', target: 'max', value: 3, label: 'max = arr[0]' },
          { type: 'showVariable', target: 'min', value: 3, label: 'min = arr[0]' },
          { type: 'highlight', target: 'array', indices: [0], color: '#3B82F6', label: 'Starting element' },
        ],
      },
      {
        title: 'Compare arr[1] = 5',
        description: '5 > max (3), so update max to 5. 5 > min (3), so min stays.',
        why: 'If the current element is larger than max, it becomes the new max. If smaller than min, it becomes the new min.',
        animations: [
          { type: 'compare', target: 'array', indices: [1], color: '#EAB308', label: 'Comparing arr[1]=5' },
          { type: 'updateVariable', target: 'max', value: 5, color: '#F97316', label: 'max updated to 5' },
          { type: 'moveArrow', target: 'pointer', to: 1, label: 'i = 1' },
        ],
      },
      {
        title: 'Compare arr[2] = 1',
        description: '1 < min (3), so update min to 1. 1 < max (5), so max stays.',
        animations: [
          { type: 'compare', target: 'array', indices: [2], color: '#EAB308' },
          { type: 'updateVariable', target: 'min', value: 1, color: '#F97316', label: 'min updated to 1' },
          { type: 'moveArrow', target: 'pointer', to: 2 },
        ],
      },
      {
        title: 'Compare arr[3] = 8',
        description: '8 > max (5), so update max to 8.',
        animations: [
          { type: 'compare', target: 'array', indices: [3], color: '#EAB308' },
          { type: 'updateVariable', target: 'max', value: 8, color: '#F97316', label: 'max updated to 8' },
          { type: 'moveArrow', target: 'pointer', to: 3 },
        ],
      },
      {
        title: 'Compare arr[4] = -2',
        description: '-2 < min (1), so update min to -2.',
        animations: [
          { type: 'compare', target: 'array', indices: [4], color: '#EAB308' },
          { type: 'updateVariable', target: 'min', value: -2, color: '#F97316', label: 'min updated to -2' },
          { type: 'moveArrow', target: 'pointer', to: 4 },
        ],
      },
      {
        title: 'Compare arr[5] = 7',
        description: '7 < max (8), 7 > min (-2). No updates needed.',
        animations: [
          { type: 'compare', target: 'array', indices: [5], color: '#6B7280', label: 'No change needed' },
          { type: 'moveArrow', target: 'pointer', to: 5 },
        ],
      },
      {
        title: 'Final Result',
        description: 'max = 8, min = -2. Array traversal complete.',
        animations: [
          { type: 'showText', value: 'max = 8, min = -2', color: '#22C55E', label: 'Result' },
          { type: 'glow', target: 'array', indices: [3], color: '#22C55E', label: 'Maximum' },
          { type: 'glow', target: 'array', indices: [4], color: '#22C55E', label: 'Minimum' },
        ],
      },
    ],
    pseudocode: [
      'function findMaxMin(arr):',
      '  max = arr[0]',
      '  min = arr[0]',
      '  for i = 1 to arr.length - 1:',
      '    if arr[i] > max: max = arr[i]',
      '    if arr[i] < min: min = arr[i]',
      '  return (max, min)',
    ],
    code: {
      cpp: 'pair<int,int> findMaxMin(vector<int>& arr) {\n  int maxVal = arr[0], minVal = arr[0];\n  for (int i = 1; i < arr.size(); i++) {\n    if (arr[i] > maxVal) maxVal = arr[i];\n    if (arr[i] < minVal) minVal = arr[i];\n  }\n  return {maxVal, minVal};\n}',
      javascript: 'function findMaxMin(arr) {\n  let max = arr[0], min = arr[0];\n  for (let i = 1; i < arr.length; i++) {\n    if (arr[i] > max) max = arr[i];\n    if (arr[i] < min) min = arr[i];\n  }\n  return { max, min };\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    commonMistakes: [
      'Initializing max to 0 or a very small number instead of the first element — fails for all-negative arrays.',
      'Using two separate loops (one for max, one for min) instead of one pass.',
      'Not handling the empty array case.',
    ],
    tips: [
      'A single pass is optimal — O(n) is the best possible time complexity.',
      'For very large arrays, this method is cache-friendly.',
      'This technique is called "linear scan" and is foundational for many problems.',
    ],
    inputExample: { array: [3, 5, 1, 8, -2, 7] },
  },
  // 3. Second Largest
  {
    id: 'second-largest',
    title: 'Second Largest Element',
    difficulty: 'Easy',
    topic: 'Arrays',
    level: 1,
    problem: 'Given an array of integers, find the second largest element. If there is no second largest (all elements are the same or array has fewer than 2 elements), return a sentinel value like -1.',
    example: 'Input:  [12, 35, 1, 10, 34, 1]\nOutput: 34\n\nInput:  [10, 10, 10]\nOutput: -1\n\nInput:  [5]\nOutput: -1',
    intuition: 'Track both the largest and second largest in a single pass. When a new largest is found, the old largest becomes the second largest. If a number is between largest and second largest, update second largest only.',
    steps: [
      {
        title: 'Initialize Variables',
        description: 'Set first = arr[0] = 12, second = -1 (sentinel for not found).',
        why: 'We start with the first element as the largest. Second is initialized to a value that indicates it has not been found yet.',
        animations: [
          { type: 'showVariable', target: 'first', value: 12, label: 'first = arr[0]' },
          { type: 'showVariable', target: 'second', value: -1, label: 'second = -1 (not found)' },
        ],
      },
      {
        title: 'Process arr[1] = 35',
        description: '35 > first (12). So second becomes old first (12), first becomes 35.',
        why: 'When we find an element larger than the current largest, the current largest becomes the second largest.',
        animations: [
          { type: 'compare', target: 'array', indices: [1], color: '#EAB308', label: '35 > 12' },
          { type: 'updateVariable', target: 'second', value: 12, color: '#F97316', label: 'second = old first (12)' },
          { type: 'updateVariable', target: 'first', value: 35, color: '#F97316', label: 'first = 35' },
          { type: 'highlight', target: 'array', indices: [1], color: '#3B82F6', label: 'New largest' },
        ],
      },
      {
        title: 'Process arr[2] = 1',
        description: '1 < second (12), so no updates.',
        why: 'If the element is smaller than both first and second, it does not affect the result.',
        animations: [
          { type: 'compare', target: 'array', indices: [2], color: '#6B7280', label: '1 < 12, ignored' },
        ],
      },
      {
        title: 'Process arr[3] = 10',
        description: '10 is between first (35) and second (12). 10 < 12, no update.',
        animations: [
          { type: 'compare', target: 'array', indices: [3], color: '#6B7280', label: '10 < 12, ignored' },
        ],
      },
      {
        title: 'Process arr[4] = 34',
        description: '34 is between first (35) and second (12). Since 34 > second (12), update second = 34.',
        why: 'An element that is not larger than the largest but is still larger than the current second becomes the new second largest.',
        animations: [
          { type: 'compare', target: 'array', indices: [4], color: '#EAB308', label: '34 is between first and second' },
          { type: 'updateVariable', target: 'second', value: 34, color: '#F97316', label: 'second updated to 34' },
          { type: 'highlight', target: 'array', indices: [4], color: '#22C55E', label: 'New second largest' },
        ],
      },
      {
        title: 'Process arr[5] = 1',
        description: '1 < second (34), no update.',
        animations: [
          { type: 'compare', target: 'array', indices: [5], color: '#6B7280', label: '1 < 34, ignored' },
        ],
      },
      {
        title: 'Result',
        description: 'Second largest = 34.',
        animations: [
          { type: 'showText', value: 'Second largest = 34', color: '#22C55E' },
          { type: 'glow', target: 'array', indices: [4], color: '#22C55E', label: 'Answer' },
        ],
      },
    ],
    pseudocode: [
      'function secondLargest(arr):',
      '  if arr.length < 2: return -1',
      '  first = arr[0]',
      '  second = -1',
      '  for i = 1 to arr.length - 1:',
      '    if arr[i] > first:',
      '      second = first',
      '      first = arr[i]',
      '    else if arr[i] > second and arr[i] != first:',
      '      second = arr[i]',
      '  return second',
    ],
    code: {
      cpp: 'int secondLargest(vector<int>& arr) {\n  if (arr.size() < 2) return -1;\n  int first = arr[0], second = -1;\n  for (int i = 1; i < arr.size(); i++) {\n    if (arr[i] > first) {\n      second = first;\n      first = arr[i];\n    } else if (arr[i] > second && arr[i] != first) {\n      second = arr[i];\n    }\n  }\n  return second;\n}',
      javascript: 'function secondLargest(arr) {\n  if (arr.length < 2) return -1;\n  let first = arr[0], second = -1;\n  for (let i = 1; i < arr.length; i++) {\n    if (arr[i] > first) {\n      second = first;\n      first = arr[i];\n    } else if (arr[i] > second && arr[i] !== first) {\n      second = arr[i];\n    }\n  }\n  return second;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    commonMistakes: [
      'Forgetting to handle the case where arr[i] equals first — should not update second.',
      'Initializing second to INT_MIN and not handling duplicates properly.',
      'Not returning -1 when the array has fewer than 2 elements.',
    ],
    tips: [
      'The else-if condition prevents updating second when we just updated first.',
      'This single-pass approach is optimal and similar to finding top-K elements with K=2.',
      'Test with all duplicates, increasing, decreasing, and mixed arrays.',
    ],
    inputExample: { array: [12, 35, 1, 10, 34, 1] },
  },
  // 4. Remove Duplicates from Sorted Array
  {
    id: 'remove-duplicates',
    title: 'Remove Duplicates from Sorted Array',
    difficulty: 'Easy',
    topic: 'Arrays',
    level: 1,
    problem: 'Given a sorted array, remove the duplicates in-place such that each element appears only once. Return the new length. The first k elements of the array should hold the final result.',
    example: 'Input:  [1, 1, 2]\nOutput: 2, array = [1, 2, _]\n\nInput:  [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]\nOutput: 5, array = [0, 1, 2, 3, 4, _, _, _, _, _]',
    intuition: 'Use two pointers: a slow pointer (j) tracks the position where unique elements should be placed, and a fast pointer (i) scans the array. When arr[i] != arr[j], move j forward and copy arr[i] to arr[j].',
    steps: [
      {
        title: 'Initialize Pointers',
        description: 'j = 0 (slow pointer). i starts at 1 (fast pointer).',
        why: 'j marks the boundary of processed unique elements. i iterates through the array.',
        animations: [
          { type: 'showVariable', target: 'j', value: 0, label: 'j = 0 (last unique index)' },
          { type: 'highlight', target: 'array', indices: [0], color: '#3B82F6', label: 'j = 0' },
        ],
      },
      {
        title: 'Compare arr[1] with arr[0]',
        description: 'arr[1] = 1, arr[0] = 1. They are equal, so skip.',
        why: 'When equal, we do nothing — the duplicate is simply ignored by the fast pointer.',
        animations: [
          { type: 'compare', target: 'array', indices: [0, 1], color: '#EAB308', label: 'arr[1] == arr[0], duplicate' },
          { type: 'moveArrow', target: 'pointer', to: 1, label: 'i = 1' },
        ],
      },
      {
        title: 'Compare arr[2] with arr[0]',
        description: 'arr[2] = 2, arr[0] = 1. They are different. Increment j to 1, set arr[1] = 2.',
        animations: [
          { type: 'compare', target: 'array', indices: [0, 2], color: '#EAB308', label: 'arr[2] != arr[0]' },
          { type: 'updateVariable', target: 'j', value: 1, color: '#F97316', label: 'j++' },
          { type: 'insert', target: 'array', index: 1, value: 2, color: '#22C55E', label: 'arr[1] = 2' },
          { type: 'moveArrow', target: 'pointer', to: 2, label: 'i = 2' },
        ],
      },
      {
        title: 'Array Processed',
        description: 'New length = j + 1 = 2. The unique elements are [1, 2].',
        why: 'j+1 is the count of unique elements since j is zero-indexed.',
        animations: [
          { type: 'showText', value: 'Unique count = 2', color: '#22C55E' },
          { type: 'highlight', target: 'array', indices: [0, 1], color: '#22C55E', label: 'Unique elements' },
        ],
      },
    ],
    pseudocode: [
      'function removeDuplicates(nums):',
      '  if nums.length == 0: return 0',
      '  j = 0',
      '  for i = 1 to nums.length - 1:',
      '    if nums[i] != nums[j]:',
      '      j++',
      '      nums[j] = nums[i]',
      '  return j + 1',
    ],
    code: {
      cpp: 'int removeDuplicates(vector<int>& nums) {\n  if (nums.empty()) return 0;\n  int j = 0;\n  for (int i = 1; i < nums.size(); i++) {\n    if (nums[i] != nums[j]) {\n      j++;\n      nums[j] = nums[i];\n    }\n  }\n  return j + 1;\n}',
      javascript: 'function removeDuplicates(nums) {\n  if (nums.length === 0) return 0;\n  let j = 0;\n  for (let i = 1; i < nums.length; i++) {\n    if (nums[i] !== nums[j]) {\n      j++;\n      nums[j] = nums[i];\n    }\n  }\n  return j + 1;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    commonMistakes: [
      'Returning j instead of j + 1 for the length.',
      'Using j++ and then assigning — order matters.',
      'Forgetting to handle the empty array edge case.',
    ],
    tips: [
      'This only works for sorted arrays — for unsorted, use a hash set.',
      'The first k elements hold the result; elements beyond k are irrelevant.',
      'Drawing the two pointers step by step clarifies the algorithm.',
    ],
    inputExample: { array: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4] },
  },
  // 5. Rotate Array
  {
    id: 'rotate-array',
    title: 'Rotate Array',
    difficulty: 'Medium',
    topic: 'Arrays',
    level: 1,
    problem: 'Given an array of integers and a number k, rotate the array to the right by k steps. k is non-negative. Do it in-place with O(1) extra space.',
    example: 'Input:  nums = [1, 2, 3, 4, 5, 6, 7], k = 3\nOutput: [5, 6, 7, 1, 2, 3, 4]\n\nInput:  nums = [-1, -100, 3, 99], k = 2\nOutput: [3, 99, -1, -100]',
    intuition: 'Reverse the entire array, then reverse the first k elements, then reverse the remaining n-k elements. This three-reversal technique achieves O(1) extra space while correctly rotating the array.',
    steps: [
      {
        title: 'Normalize k',
        description: 'k = k % n. For k=3 and n=7, k stays 3.',
        why: 'Rotating by n brings the array back to its original order, so we take modulo to avoid unnecessary work.',
        animations: [
          { type: 'showVariable', target: 'k', value: 3, label: 'k = 3 % 7 = 3' },
        ],
      },
      {
        title: 'Reverse Entire Array',
        description: 'Reverse [1, 2, 3, 4, 5, 6, 7] to get [7, 6, 5, 4, 3, 2, 1].',
        why: 'Reversing the whole array is the first step of the three-reversal approach.',
        animations: [
          { type: 'highlight', target: 'array', indices: [0, 6], color: '#3B82F6', label: 'Reversing full array' },
          { type: 'swap', target: 'array', indices: [0, 6], color: '#EAB308' },
          { type: 'swap', target: 'array', indices: [1, 5], color: '#EAB308' },
          { type: 'swap', target: 'array', indices: [2, 4], color: '#EAB308' },
          { type: 'showText', value: 'After full reverse: [7,6,5,4,3,2,1]', color: '#F97316' },
        ],
      },
      {
        title: 'Reverse First k Elements',
        description: 'Reverse [7, 6, 5] to get [5, 6, 7].',
        why: 'The first k elements after the full reverse are now in reverse order. Reversing them back puts them in the correct order for the rotated array.',
        animations: [
          { type: 'highlight', target: 'array', indices: [0, 2], color: '#3B82F6', label: 'Reversing first k=3 elements' },
          { type: 'swap', target: 'array', indices: [0, 2], color: '#EAB308' },
          { type: 'showText', value: 'After first k reverse: [5,6,7,4,3,2,1]', color: '#F97316' },
        ],
      },
      {
        title: 'Reverse Remaining n-k Elements',
        description: 'Reverse [4, 3, 2, 1] to get [1, 2, 3, 4].',
        why: 'The remaining elements are also in reverse order from the full reverse. Reversing them completes the rotation.',
        animations: [
          { type: 'highlight', target: 'array', indices: [3, 6], color: '#3B82F6', label: 'Reversing remaining n-k=4 elements' },
          { type: 'swap', target: 'array', indices: [3, 6], color: '#EAB308' },
          { type: 'swap', target: 'array', indices: [4, 5], color: '#EAB308' },
          { type: 'showText', value: 'Final: [5,6,7,1,2,3,4]', color: '#22C55E' },
        ],
      },
      {
        title: 'Rotation Complete',
        description: 'The array is now rotated right by 3 positions.',
        animations: [
          { type: 'glow', target: 'array', color: '#22C55E', label: 'Done' },
        ],
      },
    ],
    pseudocode: [
      'function rotate(nums, k):',
      '  k = k % nums.length',
      '  reverse(nums, 0, nums.length - 1)',
      '  reverse(nums, 0, k - 1)',
      '  reverse(nums, k, nums.length - 1)',
      '',
      'function reverse(nums, left, right):',
      '  while left < right:',
      '    swap(nums[left], nums[right])',
      '    left++',
      '    right--',
    ],
    code: {
      cpp: 'void rotate(vector<int>& nums, int k) {\n  k %= nums.size();\n  reverse(nums, 0, nums.size() - 1);\n  reverse(nums, 0, k - 1);\n  reverse(nums, k, nums.size() - 1);\n}\n\nvoid reverse(vector<int>& nums, int l, int r) {\n  while (l < r) {\n    swap(nums[l], nums[r]);\n    l++;\n    r--;\n  }\n}',
      javascript: 'function rotate(nums, k) {\n  k %= nums.length;\n  reverse(nums, 0, nums.length - 1);\n  reverse(nums, 0, k - 1);\n  reverse(nums, k, nums.length - 1);\n}\n\nfunction reverse(nums, l, r) {\n  while (l < r) {\n    [nums[l], nums[r]] = [nums[r], nums[l]];\n    l++;\n    r--;\n  }\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    commonMistakes: [
      'Not normalizing k with modulo — leads to unnecessary full rotations.',
      'Forgetting that k could be larger than the array length.',
      'Reversing the wrong segments — the order of the three reverses matters.',
    ],
    tips: [
      'The three-reversal trick works for both left and right rotation with slight adjustments.',
      'An alternative approach is cyclic replacements, but reversal is easier to implement bug-free.',
      'Edge case: k=0 or k=n should leave the array unchanged.',
    ],
    inputExample: { array: [1, 2, 3, 4, 5, 6, 7], k: 3 },
  },
  // 6. Move Zeroes
  {
    id: 'move-zeroes',
    title: 'Move Zeroes',
    difficulty: 'Easy',
    topic: 'Arrays',
    level: 1,
    problem: 'Given an array of integers, move all zeroes to the end while maintaining the relative order of non-zero elements. Do this in-place without making a copy of the array.',
    example: 'Input:  [0, 1, 0, 3, 12]\nOutput: [1, 3, 12, 0, 0]\n\nInput:  [0]\nOutput: [0]',
    intuition: 'Use a pointer `pos` to track where the next non-zero element should go. Iterate through the array; whenever a non-zero is found, place it at `pos` and increment `pos`. After the pass, fill the remaining positions with zeroes.',
    steps: [
      {
        title: 'Initialize Position Pointer',
        description: 'Set pos = 0. This is where the next non-zero will be placed.',
        why: 'pos tracks the boundary between processed non-zero elements and the rest.',
        animations: [
          { type: 'showVariable', target: 'pos', value: 0, label: 'pos = 0' },
        ],
      },
      {
        title: 'Find First Non-Zero',
        description: 'arr[0] = 0, skip. arr[1] = 1, non-zero! Place at pos=0.',
        animations: [
          { type: 'moveArrow', target: 'pointer', to: 0, label: 'i = 0' },
          { type: 'compare', target: 'array', indices: [0], color: '#6B7280', label: 'arr[0] is zero, skip' },
          { type: 'moveArrow', target: 'pointer', to: 1, label: 'i = 1' },
          { type: 'compare', target: 'array', indices: [1], color: '#EAB308', label: 'arr[1] = 1, non-zero' },
          { type: 'swap', target: 'array', indices: [0, 1], color: '#22C55E', label: 'Move 1 to pos=0' },
          { type: 'updateVariable', target: 'pos', value: 1, label: 'pos++' },
        ],
      },
      {
        title: 'Process arr[2] = 0',
        description: 'arr[2] = 0, skip.',
        animations: [
          { type: 'moveArrow', target: 'pointer', to: 2, label: 'i = 2' },
          { type: 'compare', target: 'array', indices: [2], color: '#6B7280', label: 'arr[2] is zero, skip' },
        ],
      },
      {
        title: 'Process arr[3] = 3',
        description: 'arr[3] = 3, non-zero. Move to pos=1.',
        animations: [
          { type: 'moveArrow', target: 'pointer', to: 3, label: 'i = 3' },
          { type: 'compare', target: 'array', indices: [3], color: '#EAB308' },
          { type: 'swap', target: 'array', indices: [1, 3], color: '#22C55E', label: 'Move 3 to pos=1' },
          { type: 'updateVariable', target: 'pos', value: 2, label: 'pos++' },
        ],
      },
      {
        title: 'Process arr[4] = 12',
        description: 'arr[4] = 12, non-zero. Move to pos=2.',
        animations: [
          { type: 'moveArrow', target: 'pointer', to: 4, label: 'i = 4' },
          { type: 'compare', target: 'array', indices: [4], color: '#EAB308' },
          { type: 'swap', target: 'array', indices: [2, 4], color: '#22C55E', label: 'Move 12 to pos=2' },
          { type: 'updateVariable', target: 'pos', value: 3, label: 'pos++' },
        ],
      },
      {
        title: 'Fill Remaining with Zeroes',
        description: 'From pos=3 to end, fill with zeroes. The array is now [1, 3, 12, 0, 0].',
        animations: [
          { type: 'highlight', target: 'array', indices: [3, 4], color: '#6B7280', label: 'Fill zeroes' },
          { type: 'fade', target: 'array', indices: [3, 4], color: '#6B7280' },
          { type: 'showText', value: 'Final: [1, 3, 12, 0, 0]', color: '#22C55E' },
        ],
      },
    ],
    pseudocode: [
      'function moveZeroes(nums):',
      '  pos = 0',
      '  for i = 0 to nums.length - 1:',
      '    if nums[i] != 0:',
      '      swap(nums[pos], nums[i])',
      '      pos++',
    ],
    code: {
      cpp: 'void moveZeroes(vector<int>& nums) {\n  int pos = 0;\n  for (int i = 0; i < nums.size(); i++) {\n    if (nums[i] != 0) {\n      swap(nums[pos], nums[i]);\n      pos++;\n    }\n  }\n}',
      javascript: 'function moveZeroes(nums) {\n  let pos = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (nums[i] !== 0) {\n      [nums[pos], nums[i]] = [nums[i], nums[pos]];\n      pos++;\n    }\n  }\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    commonMistakes: [
      'Using a separate array (not in-place).',
      'Swapping zeroes to the end one by one (O(n^2) approach).',
      'Not maintaining relative order of non-zero elements.',
    ],
    tips: [
      'This two-pointer approach is optimal — O(n) time, O(1) space.',
      'The relative order is preserved because we always swap with the leftmost available position.',
      'The same technique works for partitioning arrays by any condition.',
    ],
    inputExample: { array: [0, 1, 0, 3, 12] },
  },
  // 7. Merge Two Sorted Arrays
  {
    id: 'merge-sorted-arrays',
    title: 'Merge Two Sorted Arrays',
    difficulty: 'Easy',
    topic: 'Arrays',
    level: 1,
    problem: 'Given two sorted arrays arr1 and arr2, merge them into a single sorted array. The result should be a new array containing all elements from both arrays in non-decreasing order.',
    example: 'Input:  arr1 = [1, 3, 5], arr2 = [2, 4, 6]\nOutput: [1, 2, 3, 4, 5, 6]\n\nInput:  arr1 = [1, 2, 3], arr2 = [4, 5, 6]\nOutput: [1, 2, 3, 4, 5, 6]',
    intuition: 'Use three pointers: i for arr1, j for arr2, and k for the result array. Compare arr1[i] and arr2[j], put the smaller into result[k], and advance the corresponding pointer. When one array is exhausted, copy the remaining elements from the other.',
    steps: [
      {
        title: 'Initialize Pointers',
        description: 'i = 0 (arr1), j = 0 (arr2), result = [].',
        animations: [
          { type: 'showVariable', target: 'i', value: 0, label: 'i for arr1' },
          { type: 'showVariable', target: 'j', value: 0, label: 'j for arr2' },
          { type: 'showVariable', target: 'k', value: 0, label: 'k for result' },
        ],
      },
      {
        title: 'Compare arr1[0]=1 and arr2[0]=2',
        description: '1 < 2, so result[0] = 1. i++.',
        animations: [
          { type: 'compare', target: 'elements', indices: [0, 0], color: '#EAB308', label: 'Compare 1 and 2' },
          { type: 'insert', target: 'result', index: 0, value: 1, color: '#22C55E', label: 'result[0] = 1' },
          { type: 'moveArrow', target: 'i', to: 1, label: 'i++' },
        ],
      },
      {
        title: 'Compare arr1[1]=3 and arr2[0]=2',
        description: '2 < 3, so result[1] = 2. j++.',
        animations: [
          { type: 'compare', target: 'elements', indices: [1, 0], color: '#EAB308', label: 'Compare 3 and 2' },
          { type: 'insert', target: 'result', index: 1, value: 2, color: '#22C55E', label: 'result[1] = 2' },
          { type: 'moveArrow', target: 'j', to: 1, label: 'j++' },
        ],
      },
      {
        title: 'Compare arr1[1]=3 and arr2[1]=4',
        description: '3 < 4, so result[2] = 3. i++.',
        animations: [
          { type: 'compare', target: 'elements', indices: [1, 1], color: '#EAB308' },
          { type: 'insert', target: 'result', index: 2, value: 3, color: '#22C55E' },
          { type: 'moveArrow', target: 'i', to: 2, label: 'i++' },
        ],
      },
      {
        title: 'Compare arr1[2]=5 and arr2[1]=4',
        description: '4 < 5, so result[3] = 4. j++.',
        animations: [
          { type: 'compare', target: 'elements', indices: [2, 1], color: '#EAB308' },
          { type: 'insert', target: 'result', index: 3, value: 4, color: '#22C55E' },
          { type: 'moveArrow', target: 'j', to: 2, label: 'j++' },
        ],
      },
      {
        title: 'arr2 Exhausted, Copy Rest of arr1',
        description: 'j === arr2.length. Copy remaining arr1[2]=5 to result[4].',
        animations: [
          { type: 'insert', target: 'result', index: 4, value: 5, color: '#22C55E' },
          { type: 'showText', value: 'Copied remaining 5 from arr1', color: '#F97316' },
        ],
      },
      {
        title: 'Merge Complete',
        description: 'Final sorted array: [1, 2, 3, 4, 5, 6].',
        animations: [
          { type: 'glow', target: 'result', color: '#22C55E', label: 'Merged result' },
        ],
      },
    ],
    pseudocode: [
      'function mergeSorted(arr1, arr2):',
      '  i = 0, j = 0, result = []',
      '  while i < arr1.length and j < arr2.length:',
      '    if arr1[i] < arr2[j]:',
      '      result.push(arr1[i])',
      '      i++',
      '    else:',
      '      result.push(arr2[j])',
      '      j++',
      '  while i < arr1.length: result.push(arr1[i]); i++',
      '  while j < arr2.length: result.push(arr2[j]); j++',
      '  return result',
    ],
    code: {
      cpp: 'vector<int> mergeSorted(vector<int>& arr1, vector<int>& arr2) {\n  vector<int> result;\n  int i = 0, j = 0;\n  while (i < arr1.size() && j < arr2.size()) {\n    if (arr1[i] < arr2[j]) result.push_back(arr1[i++]);\n    else result.push_back(arr2[j++]);\n  }\n  while (i < arr1.size()) result.push_back(arr1[i++]);\n  while (j < arr2.size()) result.push_back(arr2[j++]);\n  return result;\n}',
      javascript: 'function mergeSorted(arr1, arr2) {\n  const result = [];\n  let i = 0, j = 0;\n  while (i < arr1.length && j < arr2.length) {\n    if (arr1[i] < arr2[j]) result.push(arr1[i++]);\n    else result.push(arr2[j++]);\n  }\n  while (i < arr1.length) result.push(arr1[i++]);\n  while (j < arr2.length) result.push(arr2[j++]);\n  return result;\n}',
    },
    complexity: { time: 'O(n + m)', space: 'O(n + m)' },
    commonMistakes: [
      'Forgetting to copy remaining elements from the non-exhausted array.',
      'Using arr1[i] <= arr2[j] vs < — either works but <= makes the merge stable.',
      'Modifying input arrays instead of creating a new result array.',
    ],
    tips: [
      'This is the core of the merge sort algorithm.',
      'The pointers technique generalizes to merging K sorted arrays.',
      'For in-place merging (e.g., with extra space at the end), start from the back.',
    ],
    inputExample: { arr1: [1, 3, 5], arr2: [2, 4, 6] },
  },
  // 8. Find Missing Number
  {
    id: 'find-missing-number',
    title: 'Find Missing Number',
    difficulty: 'Easy',
    topic: 'Arrays',
    level: 1,
    problem: 'Given an array containing n distinct numbers taken from the range [0, n], find the one number that is missing from the array.',
    example: 'Input:  [3, 0, 1]\nOutput: 2\n\nInput:  [0, 1]\nOutput: 2\n\nInput:  [9, 6, 4, 2, 3, 5, 7, 0, 1]\nOutput: 8',
    intuition: 'Compute the expected sum of numbers from 0 to n using the formula n*(n+1)/2. Subtract the actual sum of the array elements. The difference is the missing number. This uses O(1) extra space and O(n) time.',
    steps: [
      {
        title: 'Find n and Compute Expected Sum',
        description: 'n = arr.length = 3. Expected sum = 3*4/2 = 6.',
        why: 'The range [0, n] has n+1 numbers but the array has only n elements, so the missing number is the difference.',
        animations: [
          { type: 'showVariable', target: 'n', value: 3, label: 'n = 3' },
          { type: 'showVariable', target: 'expectedSum', value: 6, label: 'Expected sum = 3*4/2 = 6' },
        ],
      },
      {
        title: 'Compute Actual Sum',
        description: 'Traverse the array: 3 + 0 + 1 = 4.',
        animations: [
          { type: 'highlight', target: 'array', indices: [0], color: '#3B82F6', label: 'Add 3' },
          { type: 'highlight', target: 'array', indices: [1], color: '#3B82F6', label: 'Add 0' },
          { type: 'highlight', target: 'array', indices: [2], color: '#3B82F6', label: 'Add 1' },
          { type: 'showVariable', target: 'actualSum', value: 4, label: 'Actual sum = 4' },
        ],
      },
      {
        title: 'Compute Missing Number',
        description: 'Missing = expectedSum - actualSum = 6 - 4 = 2.',
        animations: [
          { type: 'updateVariable', target: 'missing', value: 2, color: '#22C55E', label: 'Missing = 6 - 4 = 2' },
          { type: 'showText', value: 'Missing number is 2', color: '#22C55E' },
        ],
      },
    ],
    pseudocode: [
      'function missingNumber(nums):',
      '  n = nums.length',
      '  expectedSum = n * (n + 1) / 2',
      '  actualSum = sum(nums)',
      '  return expectedSum - actualSum',
    ],
    code: {
      cpp: 'int missingNumber(vector<int>& nums) {\n  int n = nums.size();\n  int expected = n * (n + 1) / 2;\n  int actual = 0;\n  for (int num : nums) actual += num;\n  return expected - actual;\n}',
      javascript: 'function missingNumber(nums) {\n  const n = nums.length;\n  const expected = (n * (n + 1)) / 2;\n  const actual = nums.reduce((sum, num) => sum + num, 0);\n  return expected - actual;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    commonMistakes: [
      'Using n = nums.length - 1 instead of nums.length (the array has n elements, range is [0, n]).',
      'Integer overflow in languages with fixed-width integers — use XOR approach for safety.',
      'Forgetting that the range includes n itself.',
    ],
    tips: [
      'The XOR approach (XOR all indices and values) avoids overflow entirely.',
      'This problem can also be solved by marking visited indices as negative.',
      'The sum formula works for any sequence of consecutive integers.',
    ],
    inputExample: { array: [3, 0, 1] },
  },
  // 9. Two Sum
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    topic: 'Arrays',
    level: 1,
    problem: 'Given an array of integers and a target integer, return the indices of the two numbers that add up to the target. Each input has exactly one solution, and you may not use the same element twice.',
    example: 'Input:  nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1] (because 2 + 7 = 9)\n\nInput:  nums = [3, 2, 4], target = 6\nOutput: [1, 2]',
    intuition: 'Use a hash map to store each number and its index as we traverse the array. For each element, compute its complement (target - current). If the complement exists in the map, we have found the two numbers.',
    steps: [
      {
        title: 'Initialize Hash Map',
        description: 'Create an empty map to store {value: index} pairs.',
        why: 'The hash map gives us O(1) lookup for the complement, making the overall algorithm O(n).',
        animations: [
          { type: 'showVariable', target: 'map', value: {}, label: 'map = {}' },
          { type: 'showVariable', target: 'target', value: 9, label: 'target = 9' },
        ],
      },
      {
        title: 'Process nums[0] = 2',
        description: 'complement = 9 - 2 = 7. 7 is not in the map. Add 2 -> 0 to the map.',
        animations: [
          { type: 'highlight', target: 'array', indices: [0], color: '#3B82F6', label: 'Current: 2' },
          { type: 'showVariable', target: 'complement', value: 7, label: 'complement = 9 - 2 = 7' },
          { type: 'insert', target: 'map', index: 0, value: '2 -> 0', color: '#F97316', label: 'Store 2 at index 0' },
        ],
      },
      {
        title: 'Process nums[1] = 7',
        description: 'complement = 9 - 7 = 2. 2 IS in the map at index 0! Return [0, 1].',
        animations: [
          { type: 'highlight', target: 'array', indices: [1], color: '#3B82F6', label: 'Current: 7' },
          { type: 'showVariable', target: 'complement', value: 2, label: 'complement = 9 - 7 = 2' },
          { type: 'compare', target: 'map', value: 'found 2', color: '#22C55E', label: '2 exists in map!' },
          { type: 'glow', target: 'array', indices: [0, 1], color: '#22C55E', label: 'Solution: indices [0, 1]' },
          { type: 'showText', value: 'Found: 2 + 7 = 9', color: '#22C55E' },
        ],
      },
    ],
    pseudocode: [
      'function twoSum(nums, target):',
      '  map = {}',
      '  for i = 0 to nums.length - 1:',
      '    complement = target - nums[i]',
      '    if complement in map:',
      '      return [map[complement], i]',
      '    map[nums[i]] = i',
      '  return []',
    ],
    code: {
      cpp: 'vector<int> twoSum(vector<int>& nums, int target) {\n  unordered_map<int, int> mp;\n  for (int i = 0; i < nums.size(); i++) {\n    int complement = target - nums[i];\n    if (mp.count(complement)) {\n      return {mp[complement], i};\n    }\n    mp[nums[i]] = i;\n  }\n  return {};\n}',
      javascript: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}',
    },
    complexity: { time: 'O(n)', space: 'O(n)' },
    commonMistakes: [
      'Checking the map before adding the current element (would use the same element twice if complement equals current).',
      'Returning indices in the wrong order.',
      'Using the brute-force O(n^2) approach instead of the hash map.',
    ],
    tips: [
      'If the array is sorted, use the two-pointer technique for O(1) space.',
      'The hash map approach generalizes to Three Sum with careful handling.',
      'Always handle the case where no solution exists, even if the problem guarantees one.',
    ],
    inputExample: { array: [2, 7, 11, 15], target: 9 },
  },
  // 10. Kadane's Algorithm
  {
    id: 'kadanes-algorithm',
    title: "Kadane's Algorithm (Maximum Subarray)",
    difficulty: 'Medium',
    topic: 'Arrays',
    level: 1,
    problem: 'Given an array of integers, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
    example: 'Input:  [-2, 1, -3, 4, -1, 2, 1, -5, 4]\nOutput: 6 (subarray [4, -1, 2, 1])\n\nInput:  [1]\nOutput: 1\n\nInput:  [-1]\nOutput: -1',
    intuition: 'Maintain two variables: currentSum (max ending here) and maxSum (global max). For each element, decide whether to extend the existing subarray or start a new one at the current element. currentSum = max(num, currentSum + num). Update maxSum at each step.',
    steps: [
      {
        title: 'Initialize Variables',
        description: 'maxSum = -2, currentSum = -2. Start at index 0.',
        why: 'We initialize both to the first element to handle arrays with all negative numbers correctly.',
        animations: [
          { type: 'showVariable', target: 'maxSum', value: -2, label: 'maxSum = -2' },
          { type: 'showVariable', target: 'currentSum', value: -2, label: 'currentSum = -2' },
          { type: 'highlight', target: 'array', indices: [0], color: '#3B82F6' },
        ],
      },
      {
        title: 'Process index 1: value = 1',
        description: 'currentSum = max(1, -2 + 1) = max(1, -1) = 1. maxSum = max(-2, 1) = 1.',
        why: 'Starting a new subarray at 1 is better than extending the previous (-2 + 1 = -1).',
        animations: [
          { type: 'compare', target: 'array', indices: [1], color: '#EAB308' },
          { type: 'updateVariable', target: 'currentSum', value: 1, color: '#F97316', label: 'currentSum = max(1, -1) = 1' },
          { type: 'updateVariable', target: 'maxSum', value: 1, color: '#22C55E', label: 'maxSum = max(-2, 1) = 1' },
          { type: 'moveArrow', target: 'pointer', to: 1 },
        ],
      },
      {
        title: 'Process index 2: value = -3',
        description: 'currentSum = max(-3, 1 + (-3)) = max(-3, -2) = -2. maxSum stays 1.',
        animations: [
          { type: 'compare', target: 'array', indices: [2], color: '#EAB308' },
          { type: 'updateVariable', target: 'currentSum', value: -2, color: '#F97316', label: 'currentSum = max(-3, -2) = -2' },
        ],
      },
      {
        title: 'Process index 3: value = 4',
        description: 'currentSum = max(4, -2 + 4) = max(4, 2) = 4. maxSum = max(1, 4) = 4.',
        animations: [
          { type: 'compare', target: 'array', indices: [3], color: '#EAB308' },
          { type: 'updateVariable', target: 'currentSum', value: 4, color: '#F97316', label: 'currentSum = max(4, 2) = 4' },
          { type: 'updateVariable', target: 'maxSum', value: 4, color: '#22C55E', label: 'maxSum = max(1, 4) = 4' },
        ],
      },
      {
        title: 'Process index 4: value = -1',
        description: 'currentSum = max(-1, 4 + (-1)) = max(-1, 3) = 3. maxSum stays 4.',
        animations: [
          { type: 'compare', target: 'array', indices: [4], color: '#EAB308' },
          { type: 'updateVariable', target: 'currentSum', value: 3, color: '#F97316' },
        ],
      },
      {
        title: 'Process index 5: value = 2',
        description: 'currentSum = max(2, 3 + 2) = max(2, 5) = 5. maxSum = max(4, 5) = 5.',
        animations: [
          { type: 'compare', target: 'array', indices: [5], color: '#EAB308' },
          { type: 'updateVariable', target: 'currentSum', value: 5, color: '#F97316' },
          { type: 'updateVariable', target: 'maxSum', value: 5, color: '#22C55E' },
        ],
      },
      {
        title: 'Process index 6: value = 1',
        description: 'currentSum = max(1, 5 + 1) = max(1, 6) = 6. maxSum = max(5, 6) = 6.',
        animations: [
          { type: 'compare', target: 'array', indices: [6], color: '#EAB308' },
          { type: 'updateVariable', target: 'currentSum', value: 6, color: '#F97316' },
          { type: 'updateVariable', target: 'maxSum', value: 6, color: '#22C55E', label: 'maxSum = 6!' },
        ],
      },
      {
        title: 'Process remaining (index 7, 8)',
        description: 'index 7 (-5): currentSum = max(-5, 6-5=1) = 1. index 8 (4): currentSum = max(4, 1+4=5) = 5. maxSum stays 6.',
        animations: [
          { type: 'compare', target: 'array', indices: [7, 8], color: '#6B7280' },
          { type: 'showText', value: 'maxSum = 6 (subarray [4, -1, 2, 1])', color: '#22C55E' },
        ],
      },
    ],
    pseudocode: [
      'function maxSubarray(nums):',
      '  maxSum = nums[0]',
      '  currentSum = nums[0]',
      '  for i = 1 to nums.length - 1:',
      '    currentSum = max(nums[i], currentSum + nums[i])',
      '    maxSum = max(maxSum, currentSum)',
      '  return maxSum',
    ],
    code: {
      cpp: 'int maxSubArray(vector<int>& nums) {\n  int maxSum = nums[0];\n  int currentSum = nums[0];\n  for (int i = 1; i < nums.size(); i++) {\n    currentSum = max(nums[i], currentSum + nums[i]);\n    maxSum = max(maxSum, currentSum);\n  }\n  return maxSum;\n}',
      javascript: 'function maxSubArray(nums) {\n  let maxSum = nums[0];\n  let currentSum = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    currentSum = Math.max(nums[i], currentSum + nums[i]);\n    maxSum = Math.max(maxSum, currentSum);\n  }\n  return maxSum;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    commonMistakes: [
      'Initializing maxSum to 0 — fails for all-negative arrays.',
      'Resetting currentSum to 0 when it goes negative (Kadane does not reset, it compares).',
      'Confusing Kadane with the sliding window approach for subarray problems.',
    ],
    tips: [
      'To also get the subarray indices, track start and end when currentSum is reset.',
      'Kadane extends to 2D arrays (maximum submatrix).',
      'Divide and conquer also solves this in O(n log n), but Kadane is optimal.',
    ],
    inputExample: { array: [-2, 1, -3, 4, -1, 2, 1, -5, 4] },
  },
  // ===================== STRINGS (10) =====================
  // 11. Reverse String
  {
    id: 'reverse-string',
    title: 'Reverse a String',
    difficulty: 'Easy',
    topic: 'Strings',
    level: 1,
    problem: 'Given a string of characters, reverse it in-place. You must modify the input array in-place with O(1) extra memory.',
    example: 'Input:  ["h", "e", "l", "l", "o"]\nOutput: ["o", "l", "l", "e", "h"]\n\nInput:  ["a"]\nOutput: ["a"]',
    intuition: 'Use the two-pointer technique: swap the characters at the left and right pointers, then move the pointers toward each other until they meet in the middle.',
    steps: [
      {
        title: 'Initialize Pointers',
        description: 'left = 0, right = 4 (last index).',
        animations: [
          { type: 'showVariable', target: 'left', value: 0, label: 'left = 0' },
          { type: 'showVariable', target: 'right', value: 4, label: 'right = 4' },
          { type: 'highlight', target: 'string', indices: [0, 4], color: '#3B82F6', label: 'Left and Right' },
        ],
      },
      {
        title: 'Swap s[0] and s[4]',
        description: "Swap 'h' and 'o'. Array becomes [o, e, l, l, h]. Increment left, decrement right.",
        animations: [
          { type: 'compare', target: 'string', indices: [0, 4], color: '#EAB308', label: 'Swapping h and o' },
          { type: 'swap', target: 'string', indices: [0, 4], color: '#22C55E' },
          { type: 'updateVariable', target: 'left', value: 1 },
          { type: 'updateVariable', target: 'right', value: 3 },
        ],
      },
      {
        title: 'Swap s[1] and s[3]',
        description: "Swap 'e' and 'l'. Array becomes [o, l, l, e, h]. left=2, right=2.",
        animations: [
          { type: 'compare', target: 'string', indices: [1, 3], color: '#EAB308', label: 'Swapping e and l' },
          { type: 'swap', target: 'string', indices: [1, 3], color: '#22C55E' },
          { type: 'updateVariable', target: 'left', value: 2 },
          { type: 'updateVariable', target: 'right', value: 2 },
        ],
      },
      {
        title: 'Pointers Meet',
        description: 'left >= right, loop ends. String is reversed.',
        animations: [
          { type: 'highlight', target: 'string', indices: [2], color: '#22C55E', label: 'Middle char stays' },
          { type: 'showText', value: 'Reversed: [o, l, l, e, h]', color: '#22C55E' },
        ],
      },
    ],
    pseudocode: [
      'function reverseString(s):',
      '  left = 0',
      '  right = s.length - 1',
      '  while left < right:',
      '    swap(s[left], s[right])',
      '    left++',
      '    right--',
    ],
    code: {
      cpp: 'void reverseString(vector<char>& s) {\n  int left = 0, right = s.size() - 1;\n  while (left < right) {\n    swap(s[left], s[right]);\n    left++;\n    right--;\n  }\n}',
      javascript: 'function reverseString(s) {\n  let left = 0, right = s.length - 1;\n  while (left < right) {\n    [s[left], s[right]] = [s[right], s[left]];\n    left++;\n    right--;\n  }\n  return s;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    commonMistakes: [
      'Using extra space by creating a new string.',
      'Using s.reverse() in JavaScript instead of implementing manually (if that is the requirement).',
      'Off-by-one with right = s.length instead of s.length - 1.',
    ],
    tips: [
      'The two-pointer swap technique is fundamental for many string and array problems.',
      'For strings in languages with immutable strings (like Python), convert to a mutable list first.',
    ],
    inputExample: { string: ['h', 'e', 'l', 'l', 'o'] },
  },
  // 12. Palindrome Check
  {
    id: 'palindrome',
    title: 'Palindrome Check',
    difficulty: 'Easy',
    topic: 'Strings',
    level: 1,
    problem: 'Given a string, determine if it reads the same forwards and backward, ignoring case and non-alphanumeric characters.',
    example: 'Input:  "A man, a plan, a canal: Panama"\nOutput: true\n\nInput:  "race a car"\nOutput: false\n\nInput:  " "\nOutput: true',
    intuition: 'Use two pointers starting from both ends. Skip non-alphanumeric characters. Compare the characters (case-insensitive). If any mismatch is found, return false. If pointers cross, return true.',
    steps: [
      {
        title: 'Initialize Pointers',
        description: 'left = 0, right = string length - 1.',
        animations: [
          { type: 'showVariable', target: 'left', value: 0 },
          { type: 'showVariable', target: 'right', value: 29 },
          { type: 'highlight', target: 'string', indices: [0, 29], color: '#3B82F6' },
        ],
      },
      {
        title: 'Skip Non-Alphanumeric (Left)',
        description: "s[0] = 'A', which is alphanumeric. Move to compare.",
        animations: [
          { type: 'moveArrow', target: 'leftPointer', to: 0, label: 'left at A' },
        ],
      },
      {
        title: 'Skip Non-Alphanumeric (Right)',
        description: "s[29] = 'a', which is alphanumeric. Compare.",
        animations: [
          { type: 'moveArrow', target: 'rightPointer', to: 29, label: 'right at a' },
        ],
      },
      {
        title: 'Compare Characters',
        description: "'A' vs 'a' — case-insensitive match. Move both pointers inward.",
        animations: [
          { type: 'compare', target: 'string', indices: [0, 29], color: '#22C55E', label: "'A' == 'a' (case-insensitive)" },
          { type: 'updateVariable', target: 'left', value: 1 },
          { type: 'updateVariable', target: 'right', value: 28 },
        ],
      },
      {
        title: 'Continue Comparison',
        description: 'Skip non-alphanumeric characters and compare subsequent pairs.',
        animations: [
          { type: 'compare', target: 'string', indices: [2, 27], color: '#22C55E', label: 'All comparisons pass' },
          { type: 'moveArrow', target: 'leftPointer', to: 2 },
          { type: 'moveArrow', target: 'rightPointer', to: 27 },
        ],
      },
      {
        title: 'Pointers Cross',
        description: 'All characters matched. String is a palindrome.',
        animations: [
          { type: 'showText', value: 'It is a palindrome!', color: '#22C55E' },
          { type: 'glow', target: 'string', color: '#22C55E' },
        ],
      },
    ],
    pseudocode: [
      'function isPalindrome(s):',
      '  left = 0, right = s.length - 1',
      '  while left < right:',
      '    while left < right and not alnum(s[left]): left++',
      '    while left < right and not alnum(s[right]): right--',
      '    if lower(s[left]) != lower(s[right]): return false',
      '    left++',
      '    right--',
      '  return true',
    ],
    code: {
      cpp: 'bool isPalindrome(string s) {\n  int left = 0, right = s.size() - 1;\n  while (left < right) {\n    while (left < right && !isalnum(s[left])) left++;\n    while (left < right && !isalnum(s[right])) right--;\n    if (tolower(s[left]) != tolower(s[right])) return false;\n    left++;\n    right--;\n  }\n  return true;\n}',
      javascript: 'function isPalindrome(s) {\n  let left = 0, right = s.length - 1;\n  while (left < right) {\n    while (left < right && !/[a-zA-Z0-9]/.test(s[left])) left++;\n    while (left < right && !/[a-zA-Z0-9]/.test(s[right])) right--;\n    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;\n    left++;\n    right--;\n  }\n  return true;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    commonMistakes: [
      'Not handling non-alphanumeric characters correctly.',
      'Case-sensitive comparison when case-insensitive is required.',
      'Using extra space by filtering and reversing the string.',
    ],
    tips: [
      'The two-pointer approach avoids creating a new filtered string.',
      'Always check the character filtering logic with edge cases like empty strings.',
      'This problem is often asked with variations like palindrome linked list, palindrome number, etc.',
    ],
    inputExample: { string: 'A man, a plan, a canal: Panama' },
  },
  // 13. Count Characters
  {
    id: 'count-characters',
    title: 'Count Character Frequencies',
    difficulty: 'Easy',
    topic: 'Strings',
    level: 1,
    problem: 'Given a string, count the frequency of each character and return the result as a mapping of character to count. Case-sensitive.',
    example: 'Input:  "hello"\nOutput: {h: 1, e: 1, l: 2, o: 1}\n\nInput:  "aabbbcccc"\nOutput: {a: 2, b: 3, c: 4}',
    intuition: 'Iterate through the string character by character. For each character, increment its count in a hash map (or array of size 256 for ASCII).',
    steps: [
      {
        title: 'Initialize Frequency Map',
        description: 'Create an empty map to store character frequencies.',
        animations: [
          { type: 'showVariable', target: 'freq', value: {}, label: 'Freq map initialized' },
        ],
      },
      {
        title: "Process s[0] = 'h'",
        description: "'h' is not in the map. Add h -> 1.",
        animations: [
          { type: 'highlight', target: 'string', indices: [0], color: '#3B82F6', label: 'Processing h' },
          { type: 'insert', target: 'freq', value: 'h -> 1', color: '#F97316' },
        ],
      },
      {
        title: "Process s[1] = 'e'",
        description: "'e' is not in the map. Add e -> 1.",
        animations: [
          { type: 'highlight', target: 'string', indices: [1], color: '#3B82F6', label: 'Processing e' },
          { type: 'insert', target: 'freq', value: 'e -> 1', color: '#F97316' },
        ],
      },
      {
        title: "Process s[2] = 'l'",
        description: "'l' is not in the map. Add l -> 1.",
        animations: [
          { type: 'highlight', target: 'string', indices: [2], color: '#3B82F6', label: 'Processing l' },
          { type: 'insert', target: 'freq', value: 'l -> 1', color: '#F97316' },
        ],
      },
      {
        title: "Process s[3] = 'l'",
        description: "'l' IS in the map. Increment l -> 2.",
        animations: [
          { type: 'highlight', target: 'string', indices: [3], color: '#3B82F6', label: 'Processing l again' },
          { type: 'updateVariable', target: 'freq[l]', value: 2, color: '#F97316', label: 'l incremented to 2' },
        ],
      },
      {
        title: "Process s[4] = 'o'",
        description: "'o' is not in the map. Add o -> 1.",
        animations: [
          { type: 'highlight', target: 'string', indices: [4], color: '#3B82F6', label: 'Processing o' },
          { type: 'insert', target: 'freq', value: 'o -> 1', color: '#F97316' },
        ],
      },
      {
        title: 'Final Frequencies',
        description: 'Complete map: {h: 1, e: 1, l: 2, o: 1}.',
        animations: [
          { type: 'showText', value: 'h:1, e:1, l:2, o:1', color: '#22C55E' },
        ],
      },
    ],
    pseudocode: [
      'function countChars(s):',
      '  freq = {}',
      '  for each char c in s:',
      '    if c in freq:',
      '      freq[c]++',
      '    else:',
      '      freq[c] = 1',
      '  return freq',
    ],
    code: {
      cpp: 'unordered_map<char, int> countChars(string s) {\n  unordered_map<char, int> freq;\n  for (char c : s) {\n    freq[c]++;\n  }\n  return freq;\n}',
      javascript: 'function countChars(s) {\n  const freq = {};\n  for (const c of s) {\n    freq[c] = (freq[c] || 0) + 1;\n  }\n  return freq;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(k) where k is the character set size' },
    commonMistakes: [
      'Using an array of size 26 and forgetting about uppercase or non-alphabetic characters.',
      'Not handling empty string input.',
      'Using case-insensitive counting when case-sensitive is expected.',
    ],
    tips: [
      'In C++, unordered_map gives O(1) average insertion and lookup.',
      'For ASCII strings, an array of size 128 or 256 is faster than a hash map.',
      'This is the building block for problems like anagram check, character sorting, etc.',
    ],
    inputExample: { string: 'hello' },
  },
  // 14. Count Vowels
  {
    id: 'count-vowels',
    title: 'Count Vowels in a String',
    difficulty: 'Easy',
    topic: 'Strings',
    level: 1,
    problem: 'Given a string, count the number of vowels (a, e, i, o, u) in it. The count should be case-insensitive.',
    example: 'Input:  "Hello World"\nOutput: 3 (e, o, o)\n\nInput:  "AEIOUaeiou"\nOutput: 10\n\nInput:  "bcdfg"\nOutput: 0',
    intuition: 'Define a set of vowels (both lowercase and uppercase). Iterate through the string and increment a counter each time a character is in the vowel set.',
    steps: [
      {
        title: 'Define Vowel Set',
        description: 'Create a set: {a, e, i, o, u, A, E, I, O, U}. Initialize count = 0.',
        animations: [
          { type: 'showVariable', target: 'vowels', value: 'aeiouAEIOU', label: 'Vowel set' },
          { type: 'showVariable', target: 'count', value: 0, label: 'count = 0' },
        ],
      },
      {
        title: "Check s[0] = 'H'",
        description: "'H' is not a vowel. No increment.",
        animations: [
          { type: 'highlight', target: 'string', indices: [0], color: '#6B7280', label: 'H: not a vowel' },
        ],
      },
      {
        title: "Check s[1] = 'e'",
        description: "'e' is a vowel. count = 1.",
        animations: [
          { type: 'highlight', target: 'string', indices: [1], color: '#3B82F6', label: 'e: vowel!' },
          { type: 'updateVariable', target: 'count', value: 1, color: '#22C55E' },
        ],
      },
      {
        title: "Check s[2] = 'l'",
        description: "'l' is not a vowel.",
        animations: [
          { type: 'highlight', target: 'string', indices: [2], color: '#6B7280', label: 'l: not a vowel' },
        ],
      },
      {
        title: "Check s[3] = 'l'",
        description: "'l' is not a vowel.",
        animations: [
          { type: 'highlight', target: 'string', indices: [3], color: '#6B7280' },
        ],
      },
      {
        title: "Check s[4] = 'o'",
        description: "'o' is a vowel. count = 2.",
        animations: [
          { type: 'highlight', target: 'string', indices: [4], color: '#3B82F6', label: 'o: vowel!' },
          { type: 'updateVariable', target: 'count', value: 2, color: '#22C55E' },
        ],
      },
      {
        title: "Check s[5] = ' ' (space)",
        description: 'Space is not a vowel.',
        animations: [
          { type: 'highlight', target: 'string', indices: [5], color: '#6B7280', label: 'space: ignored' },
        ],
      },
      {
        title: "Check s[6] = 'W' to s[10] = 'd'",
        description: "Check remaining characters. s[7]='o' is a vowel. count = 3.",
        animations: [
          { type: 'highlight', target: 'string', indices: [6, 7, 8, 9, 10], color: '#EAB308' },
          { type: 'updateVariable', target: 'count', value: 3, color: '#22C55E', label: 'o at index 7: count=3' },
        ],
      },
      {
        title: 'Final Count',
        description: 'Total vowels: 3.',
        animations: [
          { type: 'showText', value: 'Total vowels: 3', color: '#22C55E' },
        ],
      },
    ],
    pseudocode: [
      'function countVowels(s):',
      '  vowels = set("aeiouAEIOU")',
      '  count = 0',
      '  for each char c in s:',
      '    if c in vowels: count++',
      '  return count',
    ],
    code: {
      cpp: 'int countVowels(string s) {\n  unordered_set<char> vowels = {\'a\',\'e\',\'i\',\'o\',\'u\',\'A\',\'E\',\'I\',\'O\',\'U\'};\n  int count = 0;\n  for (char c : s) {\n    if (vowels.count(c)) count++;\n  }\n  return count;\n}',
      javascript: 'function countVowels(s) {\n  const vowels = new Set(\'aeiouAEIOU\');\n  let count = 0;\n  for (const c of s) {\n    if (vowels.has(c)) count++;\n  }\n  return count;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    commonMistakes: [
      'Only checking lowercase vowels and missing uppercase ones.',
      "Counting 'y' as a vowel when it is not in the standard definition.",
      'Using a regex replace approach that may be less efficient.',
    ],
    tips: [
      'A set gives O(1) lookup — much faster than checking each vowel individually.',
      'For ASCII only, a boolean array of size 128 is even faster.',
      'This problem often appears as a warm-up in coding interviews.',
    ],
    inputExample: { string: 'Hello World' },
  },
  // 15. Check Anagram
  {
    id: 'check-anagram',
    title: 'Check if Two Strings are Anagrams',
    difficulty: 'Easy',
    topic: 'Strings',
    level: 1,
    problem: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise. An anagram is a word formed by rearranging the letters of another word, using all original letters exactly once.',
    example: 'Input:  s = "anagram", t = "nagaram"\nOutput: true\n\nInput:  s = "rat", t = "car"\nOutput: false',
    intuition: 'Count character frequencies in both strings. If the frequency maps are identical, they are anagrams. For O(1) space, we can use a single array of size 26 (for lowercase letters) — increment for s, decrement for t, and check if all are zero.',
    steps: [
      {
        title: 'Check Lengths',
        description: 's.length = 7, t.length = 7. Lengths match, continue.',
        why: 'Anagrams must have the same length — a quick filter.',
        animations: [
          { type: 'compare', target: 'lengths', value: 'both 7', color: '#22C55E', label: 'Lengths match' },
        ],
      },
      {
        title: 'Initialize Count Array',
        description: 'Create an array count[26] = [0, ..., 0].',
        animations: [
          { type: 'showVariable', target: 'count', value: new Array(26).fill(0), label: 'count[26] = all zeros' },
        ],
      },
      {
        title: 'Count Characters in s',
        description: "For each char in \"anagram\", increment count[char - 'a'].",
        animations: [
          { type: 'highlight', target: 'str1', indices: [0], color: '#3B82F6', label: 'a: count[0]=1' },
          { type: 'highlight', target: 'str1', indices: [1], color: '#3B82F6', label: 'n: count[13]=1' },
          { type: 'highlight', target: 'str1', indices: [2], color: '#3B82F6', label: 'a: count[0]=2' },
          { type: 'highlight', target: 'str1', indices: [3], color: '#3B82F6', label: 'g: count[6]=1' },
          { type: 'highlight', target: 'str1', indices: [4], color: '#3B82F6', label: 'r: count[17]=1' },
          { type: 'highlight', target: 'str1', indices: [5], color: '#3B82F6', label: 'a: count[0]=3' },
          { type: 'highlight', target: 'str1', indices: [6], color: '#3B82F6', label: 'm: count[12]=1' },
        ],
      },
      {
        title: 'Decrement Using t',
        description: "For each char in \"nagaram\", decrement count[char - 'a'].",
        animations: [
          { type: 'highlight', target: 'str2', indices: [0], color: '#F97316', label: 'n: count[13]=0' },
          { type: 'highlight', target: 'str2', indices: [1], color: '#F97316', label: 'a: count[0]=2' },
          { type: 'highlight', target: 'str2', indices: [2], color: '#F97316', label: 'g: count[6]=0' },
          { type: 'highlight', target: 'str2', indices: [3], color: '#F97316', label: 'a: count[0]=1' },
          { type: 'highlight', target: 'str2', indices: [4], color: '#F97316', label: 'r: count[17]=0' },
          { type: 'highlight', target: 'str2', indices: [5], color: '#F97316', label: 'a: count[0]=0' },
          { type: 'highlight', target: 'str2', indices: [6], color: '#F97316', label: 'm: count[12]=0' },
        ],
      },
      {
        title: 'Verify All Zeroes',
        description: 'All entries in count[] are 0. Strings are anagrams.',
        animations: [
          { type: 'showText', value: 'All counts are zero. They are anagrams!', color: '#22C55E' },
          { type: 'glow', target: 'result', color: '#22C55E' },
        ],
      },
    ],
    pseudocode: [
      'function isAnagram(s, t):',
      '  if s.length != t.length: return false',
      '  count = array of 26 zeros',
      '  for i = 0 to s.length - 1:',
      '    count[s[i] - "a"]++',
      '    count[t[i] - "a"]--',
      '  return all(count[i] == 0)',
    ],
    code: {
      cpp: 'bool isAnagram(string s, string t) {\n  if (s.size() != t.size()) return false;\n  vector<int> count(26, 0);\n  for (int i = 0; i < s.size(); i++) {\n    count[s[i] - \'a\']++;\n    count[t[i] - \'a\']--;\n  }\n  for (int c : count) if (c != 0) return false;\n  return true;\n}',
      javascript: 'function isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  const count = new Array(26).fill(0);\n  for (let i = 0; i < s.length; i++) {\n    count[s.charCodeAt(i) - 97]++;\n    count[t.charCodeAt(i) - 97]--;\n  }\n  return count.every(c => c === 0);\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    commonMistakes: [
      'Sorting both strings and comparing (O(n log n) instead of O(n)).',
      'Using a single hash map with increment for s and decrement for t, but not accounting for extra characters.',
      'Not handling Unicode characters — the array approach only works for lowercase letters.',
    ],
    tips: [
      'For Unicode, use a hash map instead of a fixed array.',
      'The single-array increment/decrement technique avoids needing two separate maps.',
      'Sorting is simpler to implement but the counting approach is more efficient.',
    ],
    inputExample: { s: 'anagram', t: 'nagaram' },
  },
  // 16. Remove Duplicate Characters
  {
    id: 'remove-duplicate-chars',
    title: 'Remove Duplicate Characters',
    difficulty: 'Easy',
    topic: 'Strings',
    level: 1,
    problem: 'Given a string, remove all duplicate characters, keeping only the first occurrence of each character. Return the resulting string preserving the original order.',
    example: 'Input:  "bcabc"\nOutput: "bca"\n\nInput:  "abracadabra"\nOutput: "abrcd"',
    intuition: 'Use a boolean array or hash set to track seen characters. Iterate through the string and build a result by appending characters that have not been seen before.',
    steps: [
      {
        title: 'Initialize Seen Set',
        description: 'Create an empty set to track characters already seen.',
        animations: [
          { type: 'showVariable', target: 'seen', value: '{}', label: 'Seen set empty' },
          { type: 'showVariable', target: 'result', value: '""', label: 'Result empty' },
        ],
      },
      {
        title: "Process s[0] = 'b'",
        description: "'b' not seen. Add to result and mark as seen.",
        animations: [
          { type: 'highlight', target: 'string', indices: [0], color: '#3B82F6', label: 'b: new char' },
          { type: 'insert', target: 'result', value: 'b', color: '#22C55E', label: 'result += b' },
          { type: 'insert', target: 'seen', value: 'b', color: '#F97316' },
        ],
      },
      {
        title: "Process s[1] = 'c'",
        description: "'c' not seen. Add to result and mark as seen.",
        animations: [
          { type: 'highlight', target: 'string', indices: [1], color: '#3B82F6', label: 'c: new char' },
          { type: 'insert', target: 'result', value: 'c', color: '#22C55E', label: 'result = bc' },
        ],
      },
      {
        title: "Process s[2] = 'a'",
        description: "'a' not seen. Add to result and mark as seen.",
        animations: [
          { type: 'highlight', target: 'string', indices: [2], color: '#3B82F6', label: 'a: new char' },
          { type: 'insert', target: 'result', value: 'a', color: '#22C55E', label: 'result = bca' },
        ],
      },
      {
        title: "Process s[3] = 'b'",
        description: "'b' already seen. Skip.",
        animations: [
          { type: 'highlight', target: 'string', indices: [3], color: '#6B7280', label: 'b: duplicate, skip' },
        ],
      },
      {
        title: "Process s[4] = 'c'",
        description: "'c' already seen. Skip.",
        animations: [
          { type: 'highlight', target: 'string', indices: [4], color: '#6B7280', label: 'c: duplicate, skip' },
        ],
      },
      {
        title: 'Final Result',
        description: 'String with duplicates removed: "bca".',
        animations: [
          { type: 'showText', value: 'Result: "bca"', color: '#22C55E' },
          { type: 'glow', target: 'result', color: '#22C55E' },
        ],
      },
    ],
    pseudocode: [
      'function removeDuplicates(s):',
      '  seen = {}',
      '  result = ""',
      '  for each char c in s:',
      '    if c not in seen:',
      '      result += c',
      '      seen.add(c)',
      '  return result',
    ],
    code: {
      cpp: 'string removeDuplicates(string s) {\n  unordered_set<char> seen;\n  string result;\n  for (char c : s) {\n    if (!seen.count(c)) {\n      result += c;\n      seen.insert(c);\n    }\n  }\n  return result;\n}',
      javascript: 'function removeDuplicates(s) {\n  const seen = new Set();\n  let result = \'\';\n  for (const c of s) {\n    if (!seen.has(c)) {\n      result += c;\n      seen.add(c);\n    }\n  }\n  return result;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(n)' },
    commonMistakes: [
      'Using a boolean array of size 26 and forgetting about uppercase or other characters.',
      'Modifying the string while iterating (use a separate result).',
      'Removing characters directly from the string (inefficient O(n^2) due to shifting).',
    ],
    tips: [
      'A hash set gives O(1) lookup for seen characters.',
      'For ASCII, a boolean array of size 128 is more memory efficient.',
      'This problem is related to "first unique character" and "character frequency" problems.',
    ],
    inputExample: { string: 'bcabc' },
  },
  // 17. Reverse Words
  {
    id: 'reverse-words',
    title: 'Reverse Words in a String',
    difficulty: 'Medium',
    topic: 'Strings',
    level: 1,
    problem: 'Given a string, reverse the order of words. A word is defined as a sequence of non-space characters. The result should not contain leading or trailing spaces, and multiple spaces between words should be reduced to a single space.',
    example: 'Input:  "the sky is blue"\nOutput: "blue is sky the"\n\nInput:  "  hello world  "\nOutput: "world hello"\n\nInput:  "a good   example"\nOutput: "example good a"',
    intuition: 'Reverse the entire string, then reverse each individual word. This two-pass approach works in-place in languages with mutable strings. Alternatively, split the string by spaces, reverse the word array, and join.',
    steps: [
      {
        title: 'Reverse Entire String',
        description: 'Reverse "the sky is blue" to "eulb si yks eht".',
        why: 'Reversing the whole string puts the words in reverse order, but each word is also reversed internally.',
        animations: [
          { type: 'highlight', target: 'string', indices: [0, 14], color: '#3B82F6', label: 'Reverse entire string' },
          { type: 'swap', target: 'string', color: '#EAB308' },
          { type: 'showText', value: 'After full reverse: "eulb si yks eht"', color: '#F97316' },
        ],
      },
      {
        title: 'Reverse First Word',
        description: 'Identify "eulb" and reverse it to "blue".',
        why: 'Reversing each word individually corrects the internal reversal caused by the full-string reverse.',
        animations: [
          { type: 'highlight', target: 'string', indices: [0, 3], color: '#3B82F6', label: 'Reverse "eulb"' },
          { type: 'swap', target: 'string', indices: [0, 3], color: '#22C55E' },
          { type: 'swap', target: 'string', indices: [1, 2], color: '#22C55E' },
        ],
      },
      {
        title: 'Reverse Second Word',
        description: 'Identify "si" and reverse it to "is".',
        animations: [
          { type: 'highlight', target: 'string', indices: [5, 6], color: '#3B82F6', label: 'Reverse "si"' },
          { type: 'swap', target: 'string', indices: [5, 6], color: '#22C55E' },
        ],
      },
      {
        title: 'Reverse Third Word',
        description: 'Identify "yks" and reverse it to "sky".',
        animations: [
          { type: 'highlight', target: 'string', indices: [8, 10], color: '#3B82F6', label: 'Reverse "yks"' },
          { type: 'swap', target: 'string', indices: [8, 10], color: '#22C55E' },
          { type: 'swap', target: 'string', indices: [8, 9], color: '#22C55E' },
        ],
      },
      {
        title: 'Reverse Fourth Word',
        description: 'Identify "eht" and reverse it to "the".',
        animations: [
          { type: 'highlight', target: 'string', indices: [12, 14], color: '#3B82F6', label: 'Reverse "eht"' },
          { type: 'swap', target: 'string', indices: [12, 14], color: '#22C55E' },
          { type: 'swap', target: 'string', indices: [12, 13], color: '#22C55E' },
        ],
      },
      {
        title: 'Final Result',
        description: 'All words reversed: "blue is sky the".',
        animations: [
          { type: 'showText', value: 'Result: "blue is sky the"', color: '#22C55E' },
          { type: 'glow', target: 'string', color: '#22C55E' },
        ],
      },
    ],
    pseudocode: [
      'function reverseWords(s):',
      '  reverse(s, 0, s.length - 1)',
      '  i = 0',
      '  while i < s.length:',
      '    if s[i] != " ":',
      '      start = i',
      '      while i < s.length and s[i] != " ": i++',
      '      reverse(s, start, i - 1)',
      '    else:',
      '      i++',
      '  return s (with trimmed spaces)',
    ],
    code: {
      cpp: 'string reverseWords(string s) {\n  reverse(s.begin(), s.end());\n  int i = 0, n = s.size();\n  while (i < n) {\n    if (s[i] != \' \') {\n      int start = i;\n      while (i < n && s[i] != \' \') i++;\n      reverse(s.begin() + start, s.begin() + i);\n    } else {\n      i++;\n    }\n  }\n  return s;\n}',
      javascript: 'function reverseWords(s) {\n  return s.trim().split(/\\\\s+/).reverse().join(\' \');\n}',
    },
    complexity: { time: 'O(n)', space: 'O(n)' },
    commonMistakes: [
      'Not handling multiple spaces between words.',
      'Not trimming leading/trailing spaces.',
      'Trying to do it in-place in JavaScript (strings are immutable).',
    ],
    tips: [
      'The C++ approach uses two reverses which is O(1) space.',
      'In JavaScript, the split-reverse-join approach is idiomatic but uses O(n) space.',
      'The two-reverse technique is a classic trick that appears in array rotation as well.',
    ],
    inputExample: { string: 'the sky is blue' },
  },
  // 18. Longest Common Prefix
  {
    id: 'longest-common-prefix',
    title: 'Longest Common Prefix',
    difficulty: 'Easy',
    topic: 'Strings',
    level: 1,
    problem: 'Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string "".',
    example: 'Input:  ["flower", "flow", "flight"]\nOutput: "fl"\n\nInput:  ["dog", "racecar", "car"]\nOutput: ""\n\nInput:  ["a"]\nOutput: "a"',
    intuition: 'Start with the first string as the initial prefix. For each subsequent string, repeatedly shorten the prefix until it matches the start of the current string. If the prefix becomes empty, return "".',
    steps: [
      {
        title: 'Select First String as Prefix',
        description: 'prefix = "flower". Prefix length = 6.',
        why: 'The longest common prefix cannot be longer than any individual string, so starting with the first is a safe upper bound.',
        animations: [
          { type: 'showVariable', target: 'prefix', value: 'flower', label: 'prefix = "flower"' },
          { type: 'highlight', target: 'strings', indices: [0], color: '#3B82F6', label: 'Reference string' },
        ],
      },
      {
        title: 'Compare with "flow"',
        description: '"flow" starts with "flow", not "flower". Reduce prefix to "flow". "flow" matches!',
        animations: [
          { type: 'compare', target: 'strings', indices: [0, 1], color: '#EAB308', label: 'Compare "flower" vs "flow"' },
          { type: 'updateVariable', target: 'prefix', value: 'flow', color: '#F97316', label: 'Shrink to "flow"' },
          { type: 'highlight', target: 'prefix', color: '#22C55E', label: '"flow" matches start of "flow"' },
        ],
      },
      {
        title: 'Compare with "flight"',
        description: '"flight" starts with "fl", not "flow". Reduce prefix to "fl". "fl" matches!',
        animations: [
          { type: 'compare', target: 'strings', indices: [0, 2], color: '#EAB308', label: 'Compare "flow" vs "flight"' },
          { type: 'updateVariable', target: 'prefix', value: 'fl', color: '#F97316', label: 'Shrink to "fl"' },
          { type: 'highlight', target: 'prefix', color: '#22C55E', label: '"fl" matches start of "flight"' },
        ],
      },
      {
        title: 'All Strings Processed',
        description: 'Longest common prefix = "fl".',
        animations: [
          { type: 'showText', value: 'Longest common prefix: "fl"', color: '#22C55E' },
          { type: 'glow', target: 'prefix', color: '#22C55E' },
        ],
      },
    ],
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
    code: {
      cpp: 'string longestCommonPrefix(vector<string>& strs) {\n  if (strs.empty()) return "";\n  string prefix = strs[0];\n  for (int i = 1; i < strs.size(); i++) {\n    while (strs[i].find(prefix) != 0) {\n      prefix = prefix.substr(0, prefix.size() - 1);\n      if (prefix.empty()) return "";\n    }\n  }\n  return prefix;\n}',
      javascript: 'function longestCommonPrefix(strs) {\n  if (strs.length === 0) return \'\';\n  let prefix = strs[0];\n  for (let i = 1; i < strs.length; i++) {\n    while (strs[i].indexOf(prefix) !== 0) {\n      prefix = prefix.slice(0, -1);\n      if (prefix === \'\') return \'\';\n    }\n  }\n  return prefix;\n}',
    },
    complexity: { time: 'O(n * m)', space: 'O(1)' },
    commonMistakes: [
      'Not handling the empty array edge case.',
      'Using startsWith or find incorrectly — the prefix must be at the very start.',
      'Assuming the first string is the shortest, which can be inefficient.',
    ],
    tips: [
      'Sorting the array first and comparing only the first and last strings is an alternative O(n log n) approach.',
      'The horizontal scanning approach is simple but can be optimized with vertical scanning.',
      'For a large number of strings, consider using a trie (prefix tree).',
    ],
    inputExample: { strings: ['flower', 'flow', 'flight'] },
  },
  // 19. First Unique Character
  {
    id: 'first-unique-character',
    title: 'First Unique Character in a String',
    difficulty: 'Easy',
    topic: 'Strings',
    level: 1,
    problem: 'Given a string, find the first non-repeating character and return its index. If it does not exist, return -1.',
    example: 'Input:  "leetcode"\nOutput: 0 (l is the first unique character)\n\nInput:  "loveleetcode"\nOutput: 2 (v is the first unique character)\n\nInput:  "aabb"\nOutput: -1',
    intuition: 'Count character frequencies in a first pass. In a second pass, find the first character with frequency 1. This uses O(n) time and O(1) space (since alphabet size is bounded).',
    steps: [
      {
        title: 'Count Frequencies',
        description: 'First pass: count occurrences of each character.',
        why: 'We need the frequency of every character to determine which ones are unique.',
        animations: [
          { type: 'highlight', target: 'string', indices: [0, 1, 2, 3], color: '#3B82F6', label: 'Counting l=2, e=3, t=1, c=1...' },
          { type: 'showVariable', target: 'freq', value: { l: 2, e: 3, t: 1, c: 1, o: 1, d: 1 }, label: 'Frequency map' },
        ],
      },
      {
        title: 'Find First Unique (Pass 2)',
        description: "Check s[0] = 'l'. freq[l] = 2, not unique.",
        animations: [
          { type: 'moveArrow', target: 'pointer', to: 0, color: '#EAB308', label: 'l: freq=2, not unique' },
        ],
      },
      {
        title: "Check s[1] = 'e'",
        description: "freq[e] = 3, not unique.",
        animations: [
          { type: 'moveArrow', target: 'pointer', to: 1, color: '#EAB308', label: 'e: freq=3, not unique' },
        ],
      },
      {
        title: "Check s[2] = 't'",
        description: "freq[t] = 1, unique! Return index 2.",
        animations: [
          { type: 'moveArrow', target: 'pointer', to: 2, color: '#22C55E', label: 't: freq=1, unique!' },
          { type: 'glow', target: 'string', indices: [2], color: '#22C55E', label: 'First unique: index 2' },
          { type: 'showText', value: 'Answer: index 2 (t)', color: '#22C55E' },
        ],
      },
    ],
    pseudocode: [
      'function firstUniqChar(s):',
      '  freq = {}',
      '  for each char c in s: freq[c]++',
      '  for i = 0 to s.length - 1:',
      '    if freq[s[i]] == 1: return i',
      '  return -1',
    ],
    code: {
      cpp: 'int firstUniqChar(string s) {\n  int freq[26] = {0};\n  for (char c : s) freq[c - \'a\']++;\n  for (int i = 0; i < s.size(); i++) {\n    if (freq[s[i] - \'a\'] == 1) return i;\n  }\n  return -1;\n}',
      javascript: 'function firstUniqChar(s) {\n  const freq = {};\n  for (const c of s) freq[c] = (freq[c] || 0) + 1;\n  for (let i = 0; i < s.length; i++) {\n    if (freq[s[i]] === 1) return i;\n  }\n  return -1;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    commonMistakes: [
      'Returning the character instead of its index.',
      'Using only one pass and trying to track uniqueness (need two passes).',
      'Forgetting to handle the case where no unique character exists.',
    ],
    tips: [
      'A boolean array of size 26 works for lowercase letters only.',
      'For Unicode, use a hash map instead of a fixed array.',
      'The two-pass approach is optimal — you cannot find the first unique without counting first.',
    ],
    inputExample: { string: 'loveleetcode' },
  },
  // 20. String Compression
  {
    id: 'string-compression',
    title: 'String Compression',
    difficulty: 'Medium',
    topic: 'Strings',
    level: 1,
    problem: 'Given an array of characters, compress it in-place. Each group of consecutive repeating characters is replaced by the character followed by the count (if count > 1). Return the new length of the compressed array.',
    example: 'Input:  ["a","a","b","b","c","c","c"]\nOutput: 6, array becomes ["a","2","b","2","c","3"]\n\nInput:  ["a"]\nOutput: 1, array stays ["a"]',
    intuition: 'Use two pointers: one to read (i) and one to write (writeIdx). Count consecutive equal characters. Write the character, and if the count > 1, write the count as individual digits.',
    steps: [
      {
        title: 'Initialize Pointers',
        description: 'writeIdx = 0 (where to write), i = 0 (read pointer).',
        animations: [
          { type: 'showVariable', target: 'writeIdx', value: 0, label: 'writeIdx = 0' },
          { type: 'showVariable', target: 'i', value: 0, label: 'i = 0 (read)' },
        ],
      },
      {
        title: 'Count Group at i=0',
        description: "s[0]='a'. Count consecutive 'a's: count=2.",
        animations: [
          { type: 'highlight', target: 'array', indices: [0, 1], color: '#3B82F6', label: "Counting a's: 2" },
        ],
      },
      {
        title: "Write Character 'a'",
        description: "Write 'a' at writeIdx=0. writeIdx=1.",
        animations: [
          { type: 'insert', target: 'array', index: 0, value: 'a', color: '#22C55E' },
          { type: 'updateVariable', target: 'writeIdx', value: 1 },
        ],
      },
      {
        title: 'Write Count 2',
        description: "Count=2 > 1, so write '2' at writeIdx=1. writeIdx=2.",
        animations: [
          { type: 'insert', target: 'array', index: 1, value: '2', color: '#22C55E' },
          { type: 'updateVariable', target: 'writeIdx', value: 2 },
        ],
      },
      {
        title: 'Count Next Group at i=2',
        description: "s[2]='b'. Count consecutive 'b's: count=2.",
        animations: [
          { type: 'highlight', target: 'array', indices: [2, 3], color: '#3B82F6', label: "Counting b's: 2" },
        ],
      },
      {
        title: "Write 'b' and '2'",
        description: 'Write character then count.',
        animations: [
          { type: 'insert', target: 'array', index: 2, value: 'b', color: '#22C55E' },
          { type: 'insert', target: 'array', index: 3, value: '2', color: '#22C55E' },
          { type: 'updateVariable', target: 'writeIdx', value: 4 },
        ],
      },
      {
        title: 'Count Next Group at i=4',
        description: "s[4]='c'. Count consecutive 'c's: count=3.",
        animations: [
          { type: 'highlight', target: 'array', indices: [4, 5, 6], color: '#3B82F6', label: "Counting c's: 3" },
        ],
      },
      {
        title: "Write 'c' and '3'",
        description: 'Write character then count.',
        animations: [
          { type: 'insert', target: 'array', index: 4, value: 'c', color: '#22C55E' },
          { type: 'insert', target: 'array', index: 5, value: '3', color: '#22C55E' },
          { type: 'updateVariable', target: 'writeIdx', value: 6 },
        ],
      },
      {
        title: 'Compression Complete',
        description: 'New length = 6. Compressed: ["a","2","b","2","c","3"].',
        animations: [
          { type: 'showText', value: 'New length: 6', color: '#22C55E' },
          { type: 'glow', target: 'array', indices: [0, 1, 2, 3, 4, 5], color: '#22C55E' },
        ],
      },
    ],
    pseudocode: [
      'function compress(chars):',
      '  writeIdx = 0, i = 0',
      '  while i < chars.length:',
      '    ch = chars[i]',
      '    count = 0',
      '    while i < chars.length and chars[i] == ch:',
      '      i++',
      '      count++',
      '    chars[writeIdx] = ch',
      '    writeIdx++',
      '    if count > 1:',
      '      for each digit d in str(count):',
      '        chars[writeIdx] = d',
      '        writeIdx++',
      '  return writeIdx',
    ],
    code: {
      cpp: 'int compress(vector<char>& chars) {\n  int writeIdx = 0, i = 0;\n  while (i < chars.size()) {\n    char ch = chars[i];\n    int count = 0;\n    while (i < chars.size() && chars[i] == ch) { i++; count++; }\n    chars[writeIdx++] = ch;\n    if (count > 1) {\n      for (char d : to_string(count)) chars[writeIdx++] = d;\n    }\n  }\n  return writeIdx;\n}',
      javascript: 'function compress(chars) {\n  let writeIdx = 0, i = 0;\n  while (i < chars.length) {\n    const ch = chars[i];\n    let count = 0;\n    while (i < chars.length && chars[i] === ch) { i++; count++; }\n    chars[writeIdx++] = ch;\n    if (count > 1) {\n      for (const d of String(count)) chars[writeIdx++] = d;\n    }\n  }\n  return writeIdx;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    commonMistakes: [
      'Writing the count as a single character for counts >= 10 (must write each digit).',
      'Not handling count = 1 (should not write the count).',
      'Returning the original length instead of the compressed length.',
    ],
    tips: [
      'The count must be written digit by digit (e.g., 12 -> \'1\', \'2\').',
      'This is in-place compression — the first writeIdx elements hold the result.',
      'For single characters, no count is written, just the character.',
    ],
    inputExample: { chars: ['a', 'a', 'b', 'b', 'c', 'c', 'c'] },
  },
  // ===================== LOOPS & MATH (10) =====================
  // 21. Fibonacci
  {
    id: 'fibonacci',
    title: 'Fibonacci Series',
    difficulty: 'Easy',
    topic: 'Loops & Math',
    level: 1,
    problem: 'Generate the first n numbers of the Fibonacci series. The Fibonacci sequence starts with 0 and 1, and each subsequent number is the sum of the previous two.',
    example: 'Input:  n = 5\nOutput: [0, 1, 1, 2, 3]\n\nInput:  n = 8\nOutput: [0, 1, 1, 2, 3, 5, 8, 13]',
    intuition: 'Use a loop with two variables tracking the previous two numbers. Each iteration computes the next number as the sum of the previous two, then shifts the window forward. O(n) time, O(1) space.',
    steps: [
      {
        title: 'Handle Base Cases',
        description: 'If n = 0, return []. If n = 1, return [0]. If n = 2, return [0, 1].',
        why: 'The Fibonacci sequence has fixed starting values that must be handled separately.',
        animations: [
          { type: 'showText', value: 'Starting with [0, 1] for n=8', color: '#3B82F6' },
        ],
      },
      {
        title: 'Initialize Variables',
        description: 'a = 0 (first), b = 1 (second). result = [0, 1].',
        animations: [
          { type: 'showVariable', target: 'a', value: 0, label: 'a = 0' },
          { type: 'showVariable', target: 'b', value: 1, label: 'b = 1' },
          { type: 'highlight', target: 'result', indices: [0, 1], color: '#3B82F6', label: 'Initial: [0, 1]' },
        ],
      },
      {
        title: 'Compute Next: 0 + 1 = 1',
        description: 'next = a + b = 0 + 1 = 1. Shift: a = 1, b = 1. Append 1.',
        why: 'Each new number is the sum of the previous two. Then we shift the window forward.',
        animations: [
          { type: 'showVariable', target: 'next', value: 1, label: 'next = 0 + 1 = 1' },
          { type: 'insert', target: 'result', index: 2, value: 1, color: '#22C55E', label: 'result[2] = 1' },
          { type: 'updateVariable', target: 'a', value: 1, label: 'a = 1 (was b)' },
          { type: 'updateVariable', target: 'b', value: 1, label: 'b = 1 (was next)' },
        ],
      },
      {
        title: 'Compute Next: 1 + 1 = 2',
        description: 'next = 1 + 1 = 2. a = 1, b = 2. Append 2.',
        animations: [
          { type: 'showVariable', target: 'next', value: 2, label: 'next = 1 + 1 = 2' },
          { type: 'insert', target: 'result', index: 3, value: 2, color: '#22C55E' },
          { type: 'updateVariable', target: 'a', value: 1 },
          { type: 'updateVariable', target: 'b', value: 2 },
        ],
      },
      {
        title: 'Compute Next: 1 + 2 = 3',
        description: 'next = 1 + 2 = 3. a = 2, b = 3. Append 3.',
        animations: [
          { type: 'showVariable', target: 'next', value: 3, label: 'next = 1 + 2 = 3' },
          { type: 'insert', target: 'result', index: 4, value: 3, color: '#22C55E' },
          { type: 'updateVariable', target: 'a', value: 2 },
          { type: 'updateVariable', target: 'b', value: 3 },
        ],
      },
      {
        title: 'Compute Remaining (5, 8, 13)',
        description: 'Continue until we have 8 numbers.',
        animations: [
          { type: 'insert', target: 'result', index: 5, value: 5, color: '#22C55E' },
          { type: 'insert', target: 'result', index: 6, value: 8, color: '#22C55E' },
          { type: 'insert', target: 'result', index: 7, value: 13, color: '#22C55E' },
        ],
      },
      {
        title: 'Complete Sequence',
        description: 'Fibonacci sequence of 8 numbers: [0, 1, 1, 2, 3, 5, 8, 13].',
        animations: [
          { type: 'showText', value: 'Sequence complete!', color: '#22C55E' },
          { type: 'glow', target: 'result', color: '#22C55E' },
        ],
      },
    ],
    pseudocode: [
      'function fibonacci(n):',
      '  if n <= 0: return []',
      '  if n == 1: return [0]',
      '  result = [0, 1]',
      '  a = 0, b = 1',
      '  for i = 2 to n - 1:',
      '    next = a + b',
      '    result.push(next)',
      '    a = b',
      '    b = next',
      '  return result',
    ],
    code: {
      cpp: 'vector<int> fibonacci(int n) {\n  if (n <= 0) return {};\n  if (n == 1) return {0};\n  vector<int> result = {0, 1};\n  int a = 0, b = 1;\n  for (int i = 2; i < n; i++) {\n    int next = a + b;\n    result.push_back(next);\n    a = b;\n    b = next;\n  }\n  return result;\n}',
      javascript: 'function fibonacci(n) {\n  if (n <= 0) return [];\n  if (n === 1) return [0];\n  const result = [0, 1];\n  let a = 0, b = 1;\n  for (let i = 2; i < n; i++) {\n    const next = a + b;\n    result.push(next);\n    a = b;\n    b = next;\n  }\n  return result;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(n)' },
    commonMistakes: [
      'Not handling n = 0 or n = 1 as edge cases.',
      'Using recursion without memoization (exponential time).',
      'Off-by-one: generating n+1 or n-1 numbers.',
    ],
    tips: [
      'The iterative approach is O(n) and avoids the stack overflow of recursion.',
      'For very large n, use matrix exponentiation for O(log n) time.',
      'Fibonacci appears in many problems: climbing stairs, tiling problems, etc.',
    ],
    inputExample: { n: 8 },
  },
  // 22. Factorial
  {
    id: 'factorial',
    title: 'Factorial',
    difficulty: 'Easy',
    topic: 'Loops & Math',
    level: 1,
    problem: 'Compute the factorial of a non-negative integer n, denoted as n!. Factorial is the product of all positive integers less than or equal to n. By definition, 0! = 1.',
    example: 'Input:  n = 5\nOutput: 120 (5! = 5 x 4 x 3 x 2 x 1)\n\nInput:  n = 0\nOutput: 1\n\nInput:  n = 10\nOutput: 3628800',
    intuition: 'Use a loop to multiply numbers from 1 to n. Initialize result = 1 and multiply by each integer up to n. O(n) time and O(1) space.',
    steps: [
      {
        title: 'Handle Base Case',
        description: 'If n = 0, factorial is 1.',
        animations: [
          { type: 'showText', value: '0! = 1 (base case)', color: '#3B82F6' },
        ],
      },
      {
        title: 'Initialize Result',
        description: 'result = 1. Iterate from 1 to n=5.',
        animations: [
          { type: 'showVariable', target: 'result', value: 1, label: 'result = 1' },
        ],
      },
      {
        title: 'Multiply by 1',
        description: 'result = 1 x 1 = 1.',
        animations: [
          { type: 'showVariable', target: 'i', value: 1, label: 'i = 1' },
          { type: 'updateVariable', target: 'result', value: 1, label: 'result = 1 * 1 = 1' },
        ],
      },
      {
        title: 'Multiply by 2',
        description: 'result = 1 x 2 = 2.',
        animations: [
          { type: 'updateVariable', target: 'i', value: 2, label: 'i = 2' },
          { type: 'updateVariable', target: 'result', value: 2, color: '#F97316', label: 'result = 1 * 2 = 2' },
        ],
      },
      {
        title: 'Multiply by 3',
        description: 'result = 2 x 3 = 6.',
        animations: [
          { type: 'updateVariable', target: 'i', value: 3 },
          { type: 'updateVariable', target: 'result', value: 6, color: '#F97316', label: 'result = 2 * 3 = 6' },
        ],
      },
      {
        title: 'Multiply by 4',
        description: 'result = 6 x 4 = 24.',
        animations: [
          { type: 'updateVariable', target: 'i', value: 4 },
          { type: 'updateVariable', target: 'result', value: 24, color: '#F97316', label: 'result = 6 * 4 = 24' },
        ],
      },
      {
        title: 'Multiply by 5',
        description: 'result = 24 x 5 = 120.',
        animations: [
          { type: 'updateVariable', target: 'i', value: 5 },
          { type: 'updateVariable', target: 'result', value: 120, color: '#22C55E', label: 'result = 24 * 5 = 120' },
        ],
      },
      {
        title: 'Final Result',
        description: '5! = 120.',
        animations: [
          { type: 'showText', value: '5! = 120', color: '#22C55E' },
        ],
      },
    ],
    pseudocode: [
      'function factorial(n):',
      '  if n == 0: return 1',
      '  result = 1',
      '  for i = 1 to n:',
      '    result = result * i',
      '  return result',
    ],
    code: {
      cpp: 'int factorial(int n) {\n  if (n == 0) return 1;\n  int result = 1;\n  for (int i = 1; i <= n; i++) result *= i;\n  return result;\n}',
      javascript: 'function factorial(n) {\n  if (n === 0) return 1;\n  let result = 1;\n  for (let i = 1; i <= n; i++) result *= i;\n  return result;\n}',
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    commonMistakes: [
      'Forgetting the base case 0! = 1.',
      'Starting the loop from 0 instead of 1 (multiplying by 0 gives 0).',
      'Not handling large values that overflow integer bounds.',
    ],
    tips: [
      'Use long long or BigInt for larger inputs.',
      'The iterative approach is simple and efficient.',
      'Factorial grows very fast — 20! is already too large for a 64-bit integer.',
    ],
    inputExample: { n: 5 },
  },
  // 23. Prime Number
  {
    id: 'prime-number',
    title: 'Check Prime Number',
    difficulty: 'Easy',
    topic: 'Loops & Math',
    level: 1,
    problem: 'Given a positive integer n, determine if it is a prime number. A prime number is a number greater than 1 that has no positive divisors other than 1 and itself.',
    example: 'Input:  n = 7\nOutput: true\n\nInput:  n = 10\nOutput: false (2 x 5 = 10)\n\nInput:  n = 1\nOutput: false',
    intuition: 'Check divisibility from 2 to sqrt(n). If n is divisible by any number in that range, it is not prime. We only need to check up to sqrt(n) because if n has a divisor larger than sqrt(n), the complementary divisor is smaller than sqrt(n).',
    steps: [
      {
        title: 'Edge Cases',
        description: 'n = 7. Numbers <= 1 are not prime. Skip edge case check since 7 > 1.',
        animations: [
          { type: 'showText', value: 'n = 7 > 1, continuing...', color: '#3B82F6' },
        ],
      },
      {
        title: 'Check Divisor 2',
        description: '7 % 2 = 1 (not divisible). 2 <= sqrt(7) ≈ 2.64, continue.',
        why: '2 is the smallest prime. If n is even (except 2), it is not prime.',
        animations: [
          { type: 'highlight', target: 'divisor', value: 2, color: '#EAB308', label: 'Checking 2' },
          { type: 'showVariable', target: 'remainder', value: 1, label: '7 % 2 = 1' },
        ],
      },
      {
        title: 'Check Divisor 3',
        description: '7 % 3 = 1 (not divisible). 3 > sqrt(7) ≈ 2.64, stop.',
        why: 'Once the divisor exceeds sqrt(n), we can stop because any factor would have already been found with a smaller partner.',
        animations: [
          { type: 'highlight', target: 'divisor', value: 3, color: '#EAB308', label: 'Checking 3' },
          { type: 'showVariable', target: 'remainder', value: 1, label: '7 % 3 = 1' },
          { type: 'showText', value: '3 > sqrt(7), stop checking', color: '#F97316' },
        ],
      },
      {
        title: 'Result',
        description: 'No divisors found. 7 is prime.',
        animations: [
          { type: 'showText', value: '7 is PRIME', color: '#22C55E' },
          { type: 'glow', target: 'result', color: '#22C55E' },
        ],
      },
    ],
    pseudocode: [
      'function isPrime(n):',
      '  if n <= 1: return false',
      '  if n <= 3: return true',
      '  if n % 2 == 0 or n % 3 == 0: return false',
      '  for i = 5 to sqrt(n) step 6:',
      '    if n % i == 0 or n % (i + 2) == 0: return false',
      '  return true',
    ],
    code: {
      cpp: 'bool isPrime(int n) {\n  if (n <= 1) return false;\n  if (n <= 3) return true;\n  if (n % 2 == 0 || n % 3 == 0) return false;\n  for (int i = 5; i * i <= n; i += 6) {\n    if (n % i == 0 || n % (i + 2) == 0) return false;\n  }\n  return true;\n}',
      javascript: 'function isPrime(n) {\n  if (n <= 1) return false;\n  if (n <= 3) return true;\n  if (n % 2 === 0 || n % 3 === 0) return false;\n  for (let i = 5; i * i <= n; i += 6) {\n    if (n % i === 0 || n % (i + 2) === 0) return false;\n  }\n  return true;\n}',
    },
    complexity: { time: 'O(sqrt(n))', space: 'O(1)' },
    commonMistakes: [
      'Not handling n = 1 (not prime) and n = 2 (prime) correctly.',
      'Checking all numbers up to n instead of sqrt(n).',
      'Using i <= n/2 instead of i * i <= n — less efficient.',
    ],
    tips: [
      'Checking up to sqrt(n) is optimal for a single number.',
      'The 6k +/- 1 optimization skips multiples of 2 and 3.',
      'For checking many numbers, use the Sieve of Eratosthenes.',
    ],
    inputExample: { n: 7 },
  },
  // 24. Armstrong Number
  {
    id: 'armstrong-number',
    title: 'Check Armstrong Number',
    difficulty: 'Easy',
    topic: 'Loops & Math',
    level: 1,
    problem: 'An Armstrong number (also called narcissistic number) is a number that equals the sum of its own digits each raised to the power of the number of digits. For example, 153 is an Armstrong number because 1^3 + 5^3 + 3^3 = 153.',
    example: 'Input:  n = 153\nOutput: true (1^3 + 5^3 + 3^3 = 153)\n\nInput:  n = 9474\nOutput: true (9^4 + 4^4 + 7^4 + 4^4 = 9474)\n\nInput:  n = 123\nOutput: false',
    intuition: 'Count the number of digits first. Then extract each digit, raise it to the power of digit count, and sum them. Compare the sum with the original number. O(d) time where d is the number of digits.',
    steps: [
      {
        title: 'Count Digits',
        description: 'n = 153. Digits: 1, 5, 3. d = 3 digits.',
        why: 'The power each digit is raised to equals the total number of digits.',
        animations: [
          { type: 'showVariable', target: 'original', value: 153, label: 'original = 153' },
          { type: 'showVariable', target: 'digits', value: 3, label: 'Number of digits = 3' },
        ],
      },
      {
        title: 'Extract and Process Digit 3',
        description: 'Last digit = 3. 3^3 = 27. Sum = 27. Remove last digit: n = 15.',
        animations: [
          { type: 'highlight', target: 'number', index: 2, color: '#3B82F6', label: 'Digit: 3' },
          { type: 'showVariable', target: 'term', value: 27, label: '3^3 = 27' },
          { type: 'showVariable', target: 'sum', value: 27, label: 'sum = 27' },
        ],
      },
      {
        title: 'Extract and Process Digit 5',
        description: 'Last digit = 5. 5^3 = 125. Sum = 27 + 125 = 152. n = 1.',
        animations: [
          { type: 'highlight', target: 'number', index: 1, color: '#3B82F6', label: 'Digit: 5' },
          { type: 'showVariable', target: 'term', value: 125, label: '5^3 = 125' },
          { type: 'updateVariable', target: 'sum', value: 152, label: 'sum = 152' },
        ],
      },
      {
        title: 'Extract and Process Digit 1',
        description: 'Last digit = 1. 1^3 = 1. Sum = 152 + 1 = 153. n = 0.',
        animations: [
          { type: 'highlight', target: 'number', index: 0, color: '#3B82F6', label: 'Digit: 1' },
          { type: 'showVariable', target: 'term', value: 1, label: '1^3 = 1' },
          { type: 'updateVariable', target: 'sum', value: 153, label: 'sum = 153' },
        ],
      },
      {
        title: 'Compare with Original',
        description: 'Sum (153) === original (153). It is an Armstrong number!',
        animations: [
          { type: 'compare', target: 'values', value: '153 === 153', color: '#22C55E', label: 'Sum matches original!' },
          { type: 'showText', value: '153 is an Armstrong number!', color: '#22C55E' },
        ],
      },
    ],
    pseudocode: [
      'function isArmstrong(n):',
      '  original = n',
      '  d = number of digits in n',
      '  sum = 0',
      '  while n > 0:',
      '    digit = n % 10',
      '    sum += digit ^ d',
      '    n = floor(n / 10)',
      '  return sum == original',
    ],
    code: {
      cpp: 'bool isArmstrong(int n) {\n  int original = n, sum = 0;\n  int d = to_string(n).size();\n  while (n > 0) {\n    int digit = n % 10;\n    sum += pow(digit, d);\n    n /= 10;\n  }\n  return sum == original;\n}',
      javascript: 'function isArmstrong(n) {\n  const original = n;\n  const d = String(n).length;\n  let sum = 0;\n  while (n > 0) {\n    const digit = n % 10;\n    sum += Math.pow(digit, d);\n    n = Math.floor(n / 10);\n  }\n  return sum === original;\n}',
    },
    complexity: { time: 'O(d) where d is the number of digits', space: 'O(1)' },
    commonMistakes: [
      'Using the wrong exponent (e.g., always using ^3 instead of number of digits).',
      'Modifying the original number and then comparing with it (need to store a copy).',
      'Not handling single-digit numbers (all single-digit numbers are Armstrong numbers).',
    ],
    tips: [
      'The number of digits determines the exponent for each digit.',
      'Single-digit numbers (0-9) are always Armstrong numbers.',
      'There are only 88 Armstrong numbers total in base 10.',
    ],
    inputExample: { n: 153 },
  },
  // 25. Palindrome Number
  {
    id: 'palindrome-number',
    title: 'Palindrome Number',
    difficulty: 'Easy',
    topic: 'Loops & Math',
    level: 1,
    problem: 'Given an integer, determine if it reads the same forwards and backwards. Negative numbers are not palindromes because of the minus sign.',
    example: 'Input:  n = 121\nOutput: true\n\nInput:  n = -121\nOutput: false (because -121 != 121-)\n\nInput:  n = 10\nOutput: false',
    intuition: 'Reverse half of the number and compare with the other half. This avoids overflow issues from reversing the entire number. Extract digits from the end and build a reversed number until the reversed part is >= the remaining part.',
    steps: [
      {
        title: 'Handle Edge Cases',
        description: 'n = 121. Negative numbers are not palindromes. Numbers ending in 0 (except 0) are not palindromes.',
        animations: [
          { type: 'showText', value: 'n = 121, positive, does not end in 0', color: '#3B82F6' },
        ],
      },
      {
        title: 'Build Reversed Half',
        description: 'Extract last digit: 121 % 10 = 1. reversed = 1. n = 12.',
        why: 'We reverse only half the digits to avoid potential integer overflow.',
        animations: [
          { type: 'showVariable', target: 'digit', value: 1, label: 'Extracted: 1' },
          { type: 'showVariable', target: 'reversed', value: 1, label: 'reversed = 0 * 10 + 1 = 1' },
          { type: 'updateVariable', target: 'n', value: 12, label: 'n = 121 / 10 = 12' },
        ],
      },
      {
        title: 'Continue Reversal',
        description: 'Extract last digit: 12 % 10 = 2. reversed = 1 * 10 + 2 = 12. n = 1.',
        animations: [
          { type: 'showVariable', target: 'digit', value: 2, label: 'Extracted: 2' },
          { type: 'updateVariable', target: 'reversed', value: 12, label: 'reversed = 1*10 + 2 = 12' },
          { type: 'updateVariable', target: 'n', value: 1, label: 'n = 12 / 10 = 1' },
        ],
      },
      {
        title: 'Compare Halves',
        description: 'reversed (12) > n (1), so we have reversed at least half. For even digit count, check reversed === n. For odd, ignore middle digit: reversed / 10 === n.',
        animations: [
          { type: 'compare', target: 'values', value: '12/10 === 1', color: '#22C55E', label: 'reversed/10 (1) === n (1)' },
          { type: 'showText', value: '121 is a palindrome!', color: '#22C55E' },
        ],
      },
    ],
    pseudocode: [
      'function isPalindromeNumber(n):',
      '  if n < 0 or (n % 10 == 0 and n != 0): return false',
      '  reversed = 0',
      '  while n > reversed:',
      '    reversed = reversed * 10 + n % 10',
      '    n = floor(n / 10)',
      '  return n == reversed or n == floor(reversed / 10)',
    ],
    code: {
      cpp: 'bool isPalindromeNumber(int n) {\n  if (n < 0 || (n % 10 == 0 && n != 0)) return false;\n  int reversed = 0;\n  while (n > reversed) {\n    reversed = reversed * 10 + n % 10;\n    n /= 10;\n  }\n  return n == reversed || n == reversed / 10;\n}',
      javascript: 'function isPalindromeNumber(n) {\n  if (n < 0 || (n % 10 === 0 && n !== 0)) return false;\n  let reversed = 0;\n  while (n > reversed) {\n    reversed = reversed * 10 + (n % 10);\n    n = Math.floor(n / 10);\n  }\n  return n === reversed || n === Math.floor(reversed / 10);\n}',
    },
    complexity: { time: 'O(log n)', space: 'O(1)' },
    commonMistakes: [
      'Converting to string — expected to solve mathematically.',
      'Not handling negative numbers and numbers ending in 0.',
      'Overflow when reversing the entire number.',
    ],
    tips: [
      'Reversing only half avoids integer overflow.',
      'The middle digit can be ignored for odd-length numbers.',
      'This is a common follow-up to the string palindrome problem.',
    ],
    inputExample: { n: 121 },
  },
  // 26. GCD
  {
    id: 'gcd',
    title: 'GCD (Greatest Common Divisor)',
    difficulty: 'Easy',
    topic: 'Loops & Math',
    level: 1,
    problem: 'Find the greatest common divisor (GCD) of two integers a and b using the Euclidean algorithm.',
    example: 'Input:  a = 48, b = 18\nOutput: 6\n\nInput:  a = 56, b = 98\nOutput: 14\n\nInput:  a = 7, b = 13\nOutput: 1',
    intuition: 'Use the Euclidean algorithm: gcd(a, b) = gcd(b, a % b). Repeatedly replace the larger number with the remainder of division until the remainder is 0. The non-zero number at that point is the GCD.',
    steps: [
      {
        title: 'Initial Values',
        description: 'a = 48, b = 18.',
        animations: [
          { type: 'showVariable', target: 'a', value: 48, label: 'a = 48' },
          { type: 'showVariable', target: 'b', value: 18, label: 'b = 18' },
        ],
      },
      {
        title: 'Compute 48 % 18',
        description: '48 = 18 * 2 + 12. Remainder = 12. Swap: a = 18, b = 12.',
        why: 'gcd(48, 18) = gcd(18, 48 % 18) = gcd(18, 12). The remainder replaces the larger number.',
        animations: [
          { type: 'showVariable', target: 'remainder', value: 12, label: '48 % 18 = 12' },
          { type: 'updateVariable', target: 'a', value: 18, label: 'a = 18 (was b)' },
          { type: 'updateVariable', target: 'b', value: 12, label: 'b = 12 (was remainder)' },
        ],
      },
      {
        title: 'Compute 18 % 12',
        description: '18 = 12 * 1 + 6. Remainder = 6. Swap: a = 12, b = 6.',
        animations: [
          { type: 'showVariable', target: 'remainder', value: 6, label: '18 % 12 = 6' },
          { type: 'updateVariable', target: 'a', value: 12, label: 'a = 12' },
          { type: 'updateVariable', target: 'b', value: 6, label: 'b = 6' },
        ],
      },
      {
        title: 'Compute 12 % 6',
        description: '12 = 6 * 2 + 0. Remainder = 0. Stop.',
        why: 'When remainder is 0, the current b (6) is the GCD.',
        animations: [
          { type: 'showVariable', target: 'remainder', value: 0, label: '12 % 6 = 0' },
          { type: 'showText', value: 'Remainder = 0. GCD found!', color: '#22C55E' },
        ],
      },
      {
        title: 'Result',
        description: 'GCD(48, 18) = 6.',
        animations: [
          { type: 'showText', value: 'GCD = 6', color: '#22C55E' },
          { type: 'glow', target: 'result', color: '#22C55E' },
        ],
      },
    ],
    pseudocode: [
      'function gcd(a, b):',
      '  while b != 0:',
      '    remainder = a % b',
      '    a = b',
      '    b = remainder',
      '  return a',
    ],
    code: {
      cpp: 'int gcd(int a, int b) {\n  while (b != 0) {\n    int temp = b;\n    b = a % b;\n    a = temp;\n  }\n  return a;\n}',
      javascript: 'function gcd(a, b) {\n  while (b !== 0) {\n    const temp = b;\n    b = a % b;\n    a = temp;\n  }\n  return a;\n}',
    },
    complexity: { time: 'O(log min(a, b))', space: 'O(1)' },
    commonMistakes: [
      'Not handling cases where a or b is 0.',
      'Using subtraction instead of modulo (slower for large numbers).',
      'Forgetting to use the absolute value for negative inputs.',
    ],
    tips: [
      'The Euclidean algorithm is one of the oldest algorithms still in common use.',
      'The modulo-based version is much faster than the subtraction-based version.',
      'GCD is used in many applications: fraction reduction, RSA cryptography, etc.',
    ],
    inputExample: { a: 48, b: 18 },
  },
  // 27. LCM
  {
    id: 'lcm',
    title: 'LCM (Least Common Multiple)',
    difficulty: 'Easy',
    topic: 'Loops & Math',
    level: 1,
    problem: 'Find the least common multiple (LCM) of two integers a and b. The LCM is the smallest positive integer that is divisible by both a and b.',
    example: 'Input:  a = 12, b = 15\nOutput: 60\n\nInput:  a = 7, b = 5\nOutput: 35',
    intuition: 'Use the relationship: LCM(a, b) = |a * b| / GCD(a, b). First compute the GCD using the Euclidean algorithm, then use the formula.',
    steps: [
      {
        title: 'Find GCD First',
        description: 'Compute GCD of 12 and 15: GCD(12, 15) = 3.',
        why: 'The LCM formula requires the GCD. It is much more efficient to compute via GCD than by brute-force multiples.',
        animations: [
          { type: 'showText', value: 'GCD(12, 15) = 3', color: '#3B82F6' },
        ],
      },
      {
        title: 'Apply LCM Formula',
        description: 'LCM = (12 * 15) / 3 = 180 / 3 = 60.',
        animations: [
          { type: 'showVariable', target: 'product', value: 180, label: '12 * 15 = 180' },
          { type: 'showVariable', target: 'lcm', value: 60, label: 'LCM = 180 / 3 = 60' },
        ],
      },
      {
        title: 'Result',
        description: 'LCM(12, 15) = 60. This is the smallest number divisible by both 12 and 15.',
        animations: [
          { type: 'showText', value: 'LCM = 60', color: '#22C55E' },
          { type: 'glow', target: 'result', color: '#22C55E' },
        ],
      },
    ],
    pseudocode: [
      'function lcm(a, b):',
      '  return |a * b| / gcd(a, b)',
    ],
    code: {
      cpp: 'int lcm(int a, int b) {\n  return a / gcd(a, b) * b; // avoid overflow\n}\n\nint gcd(int a, int b) {\n  while (b != 0) {\n    int temp = b;\n    b = a % b;\n    a = temp;\n  }\n  return a;\n}',
      javascript: 'function lcm(a, b) {\n  return Math.abs(a * b) / gcd(a, b);\n}\n\nfunction gcd(a, b) {\n  while (b !== 0) {\n    const temp = b;\n    b = a % b;\n    a = temp;\n  }\n  return a;\n}',
    },
    complexity: { time: 'O(log min(a, b))', space: 'O(1)' },
    commonMistakes: [
      'Using the formula (a * b) / gcd(a, b) — can overflow. Use a / gcd * b instead.',
      'Not taking absolute value (important for negative inputs).',
      'Forgetting that LCM is always positive.',
    ],
    tips: [
      'Always divide first, then multiply to avoid integer overflow: a / gcd(a,b) * b.',
      'LCM can also be computed iteratively for more than two numbers.',
      'The LCM of coprime numbers (GCD = 1) is simply their product.',
    ],
    inputExample: { a: 12, b: 15 },
  },
  // 28. Power Function
  {
    id: 'power-function',
    title: 'Power Function (x^n)',
    difficulty: 'Medium',
    topic: 'Loops & Math',
    level: 1,
    problem: 'Implement the power function pow(x, n) that calculates x raised to the power n (x^n). Handle positive, negative, and zero exponents efficiently. Do not use the built-in pow function.',
    example: 'Input:  x = 2, n = 10\nOutput: 1024\n\nInput:  x = 2, n = -2\nOutput: 0.25\n\nInput:  x = 0, n = 5\nOutput: 0',
    intuition: 'Use binary exponentiation (exponentiation by squaring). For each bit of n, square x and multiply result when the bit is 1. This gives O(log n) time instead of O(n). Handle negative n by computing with positive n and taking reciprocal.',
    steps: [
      {
        title: 'Handle Negative Exponent',
        description: 'x = 2, n = -2. Since n < 0, compute for n = 2 and return reciprocal.',
        why: 'x^(-n) = 1 / x^n. We handle this by computing the positive power and taking the reciprocal.',
        animations: [
          { type: 'showVariable', target: 'x', value: 2, label: 'x = 2' },
          { type: 'showVariable', target: 'n', value: -2, label: 'n = -2 (negative)' },
          { type: 'showText', value: 'Will compute 1 / 2^2', color: '#F97316' },
        ],
      },
      {
        title: 'Binary Exponentiation',
        description: 'n = 2 (binary: 10). result = 1. x = 2.',
        why: 'Binary exponentiation processes the exponent bit by bit, squaring x at each step.',
        animations: [
          { type: 'showVariable', target: 'result', value: 1, label: 'result = 1' },
          { type: 'showVariable', target: 'x', value: 2, label: 'current x = 2' },
        ],
      },
      {
        title: 'Process Bit 0 (LSB = 0)',
        description: 'LSB of 2 (10) is 0. Square x: x = 2^2 = 4. n becomes 1.',
        animations: [
          { type: 'showVariable', target: 'bit', value: 0, label: 'LSB = 0, skip multiply' },
          { type: 'updateVariable', target: 'x', value: 4, label: 'x = 2^2 = 4' },
          { type: 'updateVariable', target: 'n', value: 1, label: 'n >>= 1, n = 1' },
        ],
      },
      {
        title: 'Process Bit 1 (LSB = 1)',
        description: 'LSB of 1 (1) is 1. result = 1 * 4 = 4. n becomes 0. Loop ends.',
        animations: [
          { type: 'showVariable', target: 'bit', value: 1, label: 'LSB = 1, multiply!' },
          { type: 'updateVariable', target: 'result', value: 4, label: 'result = 1 * 4 = 4' },
        ],
      },
      {
        title: 'Apply Negative Exponent',
        description: 'Since original n was -2, result = 1 / 4 = 0.25.',
        animations: [
          { type: 'updateVariable', target: 'result', value: 0.25, label: '2^-2 = 1/4 = 0.25' },
          { type: 'showText', value: '2^-2 = 0.25', color: '#22C55E' },
        ],
      },
    ],
    pseudocode: [
      'function power(x, n):',
      '  if n == 0: return 1',
      '  if n < 0: x = 1 / x; n = -n',
      '  result = 1',
      '  while n > 0:',
      '    if n & 1: result *= x',
      '    x *= x',
      '    n >>= 1',
      '  return result',
    ],
    code: {
      cpp: 'double power(double x, int n) {\n  if (n == 0) return 1;\n  if (n < 0) { x = 1 / x; n = -n; }\n  double result = 1;\n  while (n > 0) {\n    if (n & 1) result *= x;\n    x *= x;\n    n >>= 1;\n  }\n  return result;\n}',
      javascript: 'function power(x, n) {\n  if (n === 0) return 1;\n  if (n < 0) { x = 1 / x; n = -n; }\n  let result = 1;\n  while (n > 0) {\n    if (n & 1) result *= x;\n    x *= x;\n    n >>>= 1;\n  }\n  return result;\n}',
    },
    complexity: { time: 'O(log n)', space: 'O(1)' },
    commonMistakes: [
      'Using linear multiplication (O(n) instead of O(log n)).',
      'Not handling negative exponents correctly.',
      'Integer overflow when n = INT_MIN (negating it overflows).',
    ],
    tips: [
      'Binary exponentiation is O(log n) and extremely efficient.',
      'Be careful with the edge case n = INT_MIN — use long long.',
      'This technique is also called exponentiation by squaring.',
    ],
    inputExample: { x: 2, n: 10 },
  },
  // 29. Sum of Digits
  {
    id: 'sum-of-digits',
    title: 'Sum of Digits',
    difficulty: 'Easy',
    topic: 'Loops & Math',
    level: 1,
    problem: 'Given a positive integer, find the sum of its digits.',
    example: 'Input:  n = 12345\nOutput: 15 (1 + 2 + 3 + 4 + 5 = 15)\n\nInput:  n = 1001\nOutput: 2\n\nInput:  n = 9\nOutput: 9',
    intuition: 'Repeatedly extract the last digit using modulo 10, add it to the sum, and remove it by dividing by 10. Continue until the number becomes 0.',
    steps: [
      {
        title: 'Initialize',
        description: 'n = 12345, sum = 0.',
        animations: [
          { type: 'showVariable', target: 'n', value: 12345, label: 'n = 12345' },
          { type: 'showVariable', target: 'sum', value: 0, label: 'sum = 0' },
        ],
      },
      {
        title: 'Extract Digit 5',
        description: '12345 % 10 = 5. sum = 0 + 5 = 5. n = 1234.',
        animations: [
          { type: 'highlight', target: 'number', index: 4, color: '#3B82F6', label: 'Digit: 5' },
          { type: 'updateVariable', target: 'sum', value: 5, color: '#F97316', label: 'sum = 0 + 5 = 5' },
          { type: 'updateVariable', target: 'n', value: 1234, label: 'n = 12345 / 10 = 1234' },
        ],
      },
      {
        title: 'Extract Digit 4',
        description: '1234 % 10 = 4. sum = 5 + 4 = 9. n = 123.',
        animations: [
          { type: 'highlight', target: 'number', index: 3, color: '#3B82F6', label: 'Digit: 4' },
          { type: 'updateVariable', target: 'sum', value: 9, color: '#F97316', label: 'sum = 5 + 4 = 9' },
          { type: 'updateVariable', target: 'n', value: 123, label: 'n = 1234 / 10 = 123' },
        ],
      },
      {
        title: 'Extract Digit 3',
        description: '123 % 10 = 3. sum = 9 + 3 = 12. n = 12.',
        animations: [
          { type: 'highlight', target: 'number', index: 2, color: '#3B82F6', label: 'Digit: 3' },
          { type: 'updateVariable', target: 'sum', value: 12, color: '#F97316' },
          { type: 'updateVariable', target: 'n', value: 12 },
        ],
      },
      {
        title: 'Extract Digit 2',
        description: '12 % 10 = 2. sum = 12 + 2 = 14. n = 1.',
        animations: [
          { type: 'highlight', target: 'number', index: 1, color: '#3B82F6', label: 'Digit: 2' },
          { type: 'updateVariable', target: 'sum', value: 14, color: '#F97316' },
          { type: 'updateVariable', target: 'n', value: 1 },
        ],
      },
      {
        title: 'Extract Digit 1',
        description: '1 % 10 = 1. sum = 14 + 1 = 15. n = 0.',
        animations: [
          { type: 'highlight', target: 'number', index: 0, color: '#3B82F6', label: 'Digit: 1' },
          { type: 'updateVariable', target: 'sum', value: 15, color: '#22C55E', label: 'sum = 14 + 1 = 15' },
          { type: 'updateVariable', target: 'n', value: 0, label: 'n = 0, done' },
        ],
      },
      {
        title: 'Final Result',
        description: 'Sum of digits: 1 + 2 + 3 + 4 + 5 = 15.',
        animations: [
          { type: 'showText', value: 'Sum of digits = 15', color: '#22C55E' },
        ],
      },
    ],
    pseudocode: [
      'function sumOfDigits(n):',
      '  sum = 0',
      '  while n > 0:',
      '    sum += n % 10',
      '    n = floor(n / 10)',
      '  return sum',
    ],
    code: {
      cpp: 'int sumOfDigits(int n) {\n  int sum = 0;\n  while (n > 0) {\n    sum += n % 10;\n    n /= 10;\n  }\n  return sum;\n}',
      javascript: 'function sumOfDigits(n) {\n  let sum = 0;\n  while (n > 0) {\n    sum += n % 10;\n    n = Math.floor(n / 10);\n  }\n  return sum;\n}',
    },
    complexity: { time: 'O(log n)', space: 'O(1)' },
    commonMistakes: [
      'Not handling n = 0 (should return 0).',
      'Using recursion and hitting stack overflow for large numbers.',
      'Treating sumOfDigits of a negative number incorrectly.',
    ],
    tips: [
      'The digit extraction technique (mod and divide) is used in many math problems.',
      'Digital root is the recursive sum of digits until single digit.',
      'This is a building block for problems like happy number, additive persistence, etc.',
    ],
    inputExample: { n: 12345 },
  },
  // 30. Reverse Number
  {
    id: 'reverse-number',
    title: 'Reverse a Number',
    difficulty: 'Easy',
    topic: 'Loops & Math',
    level: 1,
    problem: 'Given a signed 32-bit integer, reverse its digits. If reversing causes the number to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], return 0.',
    example: 'Input:  n = 123\nOutput: 321\n\nInput:  n = -123\nOutput: -321\n\nInput:  n = 120\nOutput: 21\n\nInput:  n = 1534236469\nOutput: 0 (overflows 32-bit)',
    intuition: 'Repeatedly extract the last digit using modulo and build the reversed number. Check for overflow before adding each digit by comparing with INT_MAX/10 and INT_MIN/10.',
    steps: [
      {
        title: 'Initialize',
        description: 'n = 123, reversed = 0. Handle negative sign.',
        animations: [
          { type: 'showVariable', target: 'n', value: 123, label: 'n = 123' },
          { type: 'showVariable', target: 'reversed', value: 0, label: 'reversed = 0' },
        ],
      },
      {
        title: 'Extract Digit 3',
        description: '123 % 10 = 3. reversed = 0 * 10 + 3 = 3. n = 12.',
        animations: [
          { type: 'highlight', target: 'number', index: 2, color: '#3B82F6', label: 'Extracting: 3' },
          { type: 'updateVariable', target: 'reversed', value: 3, label: 'reversed = 0*10 + 3 = 3' },
          { type: 'updateVariable', target: 'n', value: 12, label: 'n = 123 / 10 = 12' },
        ],
      },
      {
        title: 'Extract Digit 2',
        description: '12 % 10 = 2. reversed = 3 * 10 + 2 = 32. n = 1.',
        animations: [
          { type: 'highlight', target: 'number', index: 1, color: '#3B82F6', label: 'Extracting: 2' },
          { type: 'updateVariable', target: 'reversed', value: 32, label: 'reversed = 3*10 + 2 = 32' },
          { type: 'updateVariable', target: 'n', value: 1, label: 'n = 12 / 10 = 1' },
        ],
      },
      {
        title: 'Extract Digit 1',
        description: '1 % 10 = 1. reversed = 32 * 10 + 1 = 321. n = 0. Done.',
        animations: [
          { type: 'highlight', target: 'number', index: 0, color: '#3B82F6', label: 'Extracting: 1' },
          { type: 'updateVariable', target: 'reversed', value: 321, color: '#22C55E', label: 'reversed = 32*10 + 1 = 321' },
          { type: 'updateVariable', target: 'n', value: 0, label: 'n = 0, done' },
        ],
      },
      {
        title: 'Check Overflow',
        description: '321 is within [-2^31, 2^31 - 1]. Return 321.',
        animations: [
          { type: 'compare', target: 'overflow', value: '321 in range', color: '#22C55E' },
          { type: 'showText', value: 'Reversed: 321', color: '#22C55E' },
        ],
      },
    ],
    pseudocode: [
      'function reverseNumber(n):',
      '  reversed = 0',
      '  while n != 0:',
      '    digit = n % 10',
      '    if reversed > INT_MAX/10 or reversed < INT_MIN/10: return 0',
      '    reversed = reversed * 10 + digit',
      '    n = floor(n / 10)',
      '  return reversed',
    ],
    code: {
      cpp: 'int reverseNumber(int n) {\n  int reversed = 0;\n  while (n != 0) {\n    int digit = n % 10;\n    if (reversed > INT_MAX / 10 || reversed < INT_MIN / 10) return 0;\n    reversed = reversed * 10 + digit;\n    n /= 10;\n  }\n  return reversed;\n}',
      javascript: 'function reverseNumber(n) {\n  let reversed = 0;\n  const sign = n < 0 ? -1 : 1;\n  n = Math.abs(n);\n  while (n > 0) {\n    const digit = n % 10;\n    if (reversed > Math.pow(2, 31) / 10) return 0;\n    reversed = reversed * 10 + digit;\n    n = Math.floor(n / 10);\n  }\n  return reversed * sign;\n}',
    },
    complexity: { time: 'O(log n)', space: 'O(1)' },
    commonMistakes: [
      'Not handling overflow — critical for 32-bit integer constraint.',
      'Not handling negative numbers correctly.',
      'Not handling numbers ending in 0 (the reverse loses trailing zeros, which is correct).',
    ],
    tips: [
      'Always check overflow before multiplying by 10, not after.',
      'Negative numbers can be handled with a sign flag.',
      'In C++, n % 10 can be negative for negative n — adjust accordingly.',
    ],
    inputExample: { n: 123 },
  },
];
