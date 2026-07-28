import type { QuestionData } from '../types'

export const level2Questions: QuestionData[] = [
  // ==============================
  // SEARCHING (5 questions)
  // ==============================
  {
    id: 'linear-search',
    title: 'Linear Search',
    difficulty: 'Easy',
    topic: 'Searching',
    level: 2,
    problem: 'Given an array of integers and a target value, return the index of the target if it exists. If not, return -1. Perform a linear scan from left to right.',
    example: 'Input: arr = [4, 2, 7, 1, 9, 3], target = 7\nOutput: 2\nExplanation: Scanning from index 0, we find 7 at index 2.',
    intuition: 'Linear search checks every element sequentially until the target is found or the array ends. It works on unsorted data and is the simplest searching technique.',
    steps: [
      {
        title: 'Initialize',
        description: 'Start scanning from the first element (index 0). Set a pointer i = 0.',
        why: 'We begin at the leftmost element because arrays are zero-indexed and we scan left to right.',
        animations: [
          { type: 'showVariable', target: 'i', value: 0, label: 'Current Index', color: '#3B82F6' },
          { type: 'highlight', target: '0', index: 0, color: '#3B82F6', label: 'Start scanning from index 0' },
        ],
      },
      {
        title: 'Compare with target',
        description: 'Check if arr[0] = 4 equals target 7. Since 4 !== 7, move to next element.',
        why: 'We compare each element with the target. If equal, we have found the answer.',
        animations: [
          { type: 'compare', target: '0', index: 0, color: '#EAB308', label: 'Comparing 4 vs 7' },
          { type: 'showText', value: '4 !== 7, continue', color: '#F97316' },
        ],
      },
      {
        title: 'Move to index 1',
        description: 'Increment i to 1. Check arr[1] = 2. 2 !== 7, so continue.',
        why: 'Each mismatch narrows the search space by one element from the left.',
        animations: [
          { type: 'moveArrow', from: 0, to: 1, color: '#3B82F6', label: 'i = 1' },
          { type: 'compare', target: '1', index: 1, color: '#EAB308', label: 'Comparing 2 vs 7' },
          { type: 'showText', value: '2 !== 7, continue', color: '#F97316' },
        ],
      },
      {
        title: 'Move to index 2',
        description: 'Increment i to 2. Check arr[2] = 7. 7 === 7 — match found!',
        why: 'The target matches the current element, so we return the index immediately.',
        animations: [
          { type: 'moveArrow', from: 1, to: 2, color: '#3B82F6', label: 'i = 2' },
          { type: 'compare', target: '2', index: 2, color: '#22C55E', label: '7 === 7, match!' },
          { type: 'glow', target: '2', index: 2, color: '#22C55E', label: 'Target found!' },
        ],
      },
      {
        title: 'Return result',
        description: 'Target is found at index 2. Return 2.',
        why: 'The function returns the index where the target was found.',
        animations: [
          { type: 'showVariable', target: 'result', value: 2, label: 'Returned Index', color: '#22C55E' },
          { type: 'showText', value: 'Linear Search Complete: Found at index 2', color: '#22C55E' },
        ],
      },
    ],
    pseudocode: [
      'function linearSearch(arr, target):',
      '  for i = 0 to arr.length - 1:',
      '    if arr[i] == target:',
      '      return i',
      '  return -1',
    ],
    code: {
      cpp: `int linearSearch(vector<int>& arr, int target) {
  for (int i = 0; i < arr.size(); i++) {
    if (arr[i] == target) return i;
  }
  return -1;
}`,
      javascript: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    commonMistakes: [
      'Returning the element value instead of its index',
      'Off-by-one errors in loop condition (using <= instead of <)',
      'Forgetting to return -1 when the target is not in the array',
    ],
    tips: [
      'Linear search is best for small or unsorted arrays',
      'If the array is sorted, prefer binary search for O(log n) time',
      'The array is not modified, so it works on const/read-only data',
    ],
    inputExample: { array: [4, 2, 7, 1, 9, 3], target: 7 },
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: 'Easy',
    topic: 'Searching',
    level: 2,
    problem: 'Given a sorted array of integers and a target value, return the index of the target. If not found, return -1. Use the divide-and-conquer binary search approach.',
    example: 'Input: arr = [1, 3, 5, 7, 9, 11, 13], target = 7\nOutput: 3\nExplanation: The array is sorted. Binary search repeatedly divides the search interval in half.',
    intuition: 'Binary search works on sorted arrays by comparing the target to the middle element and eliminating the half where the target cannot exist.',
    steps: [
      {
        title: 'Initialize pointers',
        description: 'Set low = 0 (first index), high = 6 (last index). The search space spans the entire array.',
        why: 'Binary search maintains a contiguous range [low, high] where the target might be.',
        animations: [
          { type: 'showVariable', target: 'low', value: 0, label: 'low', color: '#3B82F6' },
          { type: 'showVariable', target: 'high', value: 6, label: 'high', color: '#3B82F6' },
          { type: 'highlight', target: '0-6', indices: [0, 1, 2, 3, 4, 5, 6], color: '#6B7280', label: 'Search space' },
        ],
      },
      {
        title: 'Calculate mid',
        description: 'mid = low + (high - low) / 2 = 0 + (6 - 0) / 2 = 3. arr[3] = 7.',
        why: 'Using this formula avoids integer overflow compared to (low + high) / 2.',
        animations: [
          { type: 'showVariable', target: 'mid', value: 3, label: 'mid = 3', color: '#F97316' },
          { type: 'highlight', target: '3', index: 3, color: '#EAB308', label: 'arr[3] = 7 (middle)' },
        ],
      },
      {
        title: 'Compare arr[mid] with target',
        description: 'arr[3] = 7 equals target = 7. Match found!',
        why: 'When the middle element equals the target, we immediately return its index.',
        animations: [
          { type: 'compare', target: '3', index: 3, color: '#22C55E', label: '7 === 7' },
          { type: 'glow', target: '3', index: 3, color: '#22C55E', label: 'Target found!' },
        ],
      },
      {
        title: 'Return result',
        description: 'Target 7 is at index 3. Return 3.',
        animations: [
          { type: 'showVariable', target: 'result', value: 3, label: 'Found at index', color: '#22C55E' },
          { type: 'showText', value: 'Binary Search Complete: Found at index 3', color: '#22C55E' },
        ],
      },
    ],
    pseudocode: [
      'function binarySearch(arr, target):',
      '  low = 0, high = arr.length - 1',
      '  while low <= high:',
      '    mid = low + (high - low) / 2',
      '    if arr[mid] == target: return mid',
      '    if arr[mid] < target: low = mid + 1',
      '    else: high = mid - 1',
      '  return -1',
    ],
    code: {
      cpp: `int binarySearch(vector<int>& arr, int target) {
  int low = 0, high = arr.size() - 1;
  while (low <= high) {
    int mid = low + (high - low) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
      javascript: `function binarySearch(arr, target) {
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
    },
    complexity: { time: 'O(log n)', space: 'O(1)' },
    commonMistakes: [
      'Using (low + high) / 2 which can overflow for large arrays',
      'Using while (low < high) instead of <=, missing the last element',
      'Forgetting the array must be sorted before calling binary search',
    ],
    tips: [
      'Always use mid = low + (high - low) / 2 to avoid overflow',
      'Works only on sorted arrays — sort first if needed',
      'For descending order, reverse the comparison operators',
    ],
    inputExample: { array: [1, 3, 5, 7, 9, 11, 13], target: 7 },
  },
  {
    id: 'first-occurrence',
    title: 'First Occurrence (Lower Bound)',
    difficulty: 'Medium',
    topic: 'Searching',
    level: 2,
    problem: 'Given a sorted array with possible duplicates, find the index of the first occurrence of a target. If the target is not present, return -1.',
    example: 'Input: arr = [1, 2, 2, 2, 3, 4, 5], target = 2\nOutput: 1\nExplanation: The first 2 is at index 1, even though 2 appears at indices 1, 2, and 3.',
    intuition: 'We modify binary search so that when we find the target, we continue searching leftward to find the first occurrence.',
    steps: [
      {
        title: 'Initialize pointers',
        description: 'Set low = 0, high = 6, result = -1.',
        animations: [
          { type: 'showVariable', target: 'low', value: 0, label: 'low', color: '#3B82F6' },
          { type: 'showVariable', target: 'high', value: 6, label: 'high', color: '#3B82F6' },
          { type: 'showVariable', target: 'result', value: -1, label: 'result', color: '#6B7280' },
        ],
      },
      {
        title: 'First mid calculation',
        description: 'mid = 0 + (6 - 0) / 2 = 3. arr[3] = 2. Target found, but we continue left.',
        why: 'Since we want the first occurrence, we store index 3 and search the left half [low, mid-1].',
        animations: [
          { type: 'showVariable', target: 'mid', value: 3, label: 'mid = 3', color: '#F97316' },
          { type: 'compare', target: '3', index: 3, color: '#22C55E', label: 'arr[3] = 2 == target' },
          { type: 'showVariable', target: 'result', value: 3, label: 'result = 3 (candidate)', color: '#F97316' },
          { type: 'showText', value: 'Found target at 3, searching left half', color: '#F97316' },
        ],
      },
      {
        title: 'Search left half',
        description: 'Set high = mid - 1 = 2. Search in [low=0, high=2]. mid = 1. arr[1] = 2. Found again!',
        why: 'We found another 2 at index 1, which is earlier. Update result = 1 and continue left.',
        animations: [
          { type: 'updateVariable', target: 'high', value: 2, label: 'high = 2', color: '#3B82F6' },
          { type: 'showVariable', target: 'mid', value: 1, label: 'mid = 1', color: '#F97316' },
          { type: 'compare', target: '1', index: 1, color: '#22C55E', label: 'arr[1] = 2 == target' },
          { type: 'updateVariable', target: 'result', value: 1, label: 'result = 1', color: '#F97316' },
        ],
      },
      {
        title: 'Search further left',
        description: 'Set high = mid - 1 = 0. Search [low=0, high=0]. mid = 0. arr[0] = 1 < target.',
        why: 'arr[0] is less than target, so target does not exist at or before index 0. We stop.',
        animations: [
          { type: 'updateVariable', target: 'high', value: 0, label: 'high = 0', color: '#3B82F6' },
          { type: 'showVariable', target: 'mid', value: 0, label: 'mid = 0', color: '#F97316' },
          { type: 'compare', target: '0', index: 0, color: '#EAB308', label: 'arr[0] = 1 < 2' },
          { type: 'showText', value: 'No more candidates to the left', color: '#6B7280' },
        ],
      },
      {
        title: 'Return result',
        description: 'The last stored result is 1. Return 1 as the first occurrence.',
        animations: [
          { type: 'showVariable', target: 'result', value: 1, label: 'First occurrence at', color: '#22C55E' },
          { type: 'glow', target: '1', index: 1, color: '#22C55E', label: 'First 2 is at index 1' },
        ],
      },
    ],
    pseudocode: [
      'function firstOccurrence(arr, target):',
      '  low = 0, high = arr.length - 1, result = -1',
      '  while low <= high:',
      '    mid = low + (high - low) / 2',
      '    if arr[mid] == target:',
      '      result = mid',
      '      high = mid - 1   // search left',
      '    else if arr[mid] < target: low = mid + 1',
      '    else: high = mid - 1',
      '  return result',
    ],
    code: {
      cpp: `int firstOccurrence(vector<int>& arr, int target) {
  int low = 0, high = arr.size() - 1, result = -1;
  while (low <= high) {
    int mid = low + (high - low) / 2;
    if (arr[mid] == target) {
      result = mid;
      high = mid - 1;
    } else if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return result;
}`,
      javascript: `function firstOccurrence(arr, target) {
  let low = 0, high = arr.length - 1, result = -1;
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (arr[mid] === target) {
      result = mid;
      high = mid - 1;
    } else if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return result;
}`,
    },
    complexity: { time: 'O(log n)', space: 'O(1)' },
    commonMistakes: [
      'Returning immediately when finding the target instead of continuing left',
      'Using > instead of >= in the while condition',
      'Not initializing result to -1, causing false positives',
    ],
    tips: [
      'This is also called "lower bound" or "first occurrence" binary search',
      'Same technique works for finding last occurrence (search right instead)',
      'Always store the candidate index before narrowing the search space',
    ],
    inputExample: { array: [1, 2, 2, 2, 3, 4, 5], target: 2 },
  },
  {
    id: 'last-occurrence',
    title: 'Last Occurrence (Upper Bound)',
    difficulty: 'Medium',
    topic: 'Searching',
    level: 2,
    problem: 'Given a sorted array with possible duplicates, find the index of the last occurrence of a target. If the target is not present, return -1.',
    example: 'Input: arr = [1, 2, 2, 2, 3, 4, 5], target = 2\nOutput: 3\nExplanation: The last 2 is at index 3, even though 2 appears at indices 1, 2, and 3.',
    intuition: 'We modify binary search so that when we find the target, we continue searching rightward to find the last occurrence.',
    steps: [
      {
        title: 'Initialize pointers',
        description: 'Set low = 0, high = 6, result = -1.',
        animations: [
          { type: 'showVariable', target: 'low', value: 0, label: 'low', color: '#3B82F6' },
          { type: 'showVariable', target: 'high', value: 6, label: 'high', color: '#3B82F6' },
          { type: 'showVariable', target: 'result', value: -1, label: 'result', color: '#6B7280' },
        ],
      },
      {
        title: 'First mid calculation',
        description: 'mid = 3. arr[3] = 2. Found! Store result = 3, search right half [mid+1, high].',
        why: 'We store the index and continue right to see if there are more occurrences.',
        animations: [
          { type: 'showVariable', target: 'mid', value: 3, label: 'mid = 3', color: '#F97316' },
          { type: 'compare', target: '3', index: 3, color: '#22C55E', label: 'arr[3] = 2 == target' },
          { type: 'updateVariable', target: 'result', value: 3, label: 'result = 3', color: '#F97316' },
          { type: 'showText', value: 'Found at 3, searching right half', color: '#F97316' },
        ],
      },
      {
        title: 'Search right half',
        description: 'Set low = mid + 1 = 4. Search [low=4, high=6]. mid = 5. arr[5] = 4 > target.',
        why: 'Middle element 4 is greater than 2, so the target (if present) must be to the left.',
        animations: [
          { type: 'updateVariable', target: 'low', value: 4, label: 'low = 4', color: '#3B82F6' },
          { type: 'showVariable', target: 'mid', value: 5, label: 'mid = 5', color: '#F97316' },
          { type: 'compare', target: '5', index: 5, color: '#EAB308', label: 'arr[5] = 4 > 2' },
          { type: 'showText', value: '4 > 2, search left', color: '#F97316' },
        ],
      },
      {
        title: 'Continue left',
        description: 'Set high = mid - 1 = 4. Search [low=4, high=4]. mid = 4. arr[4] = 3 > target.',
        why: 'arr[4] = 3 is still greater than 2, so we continue. The last occurrence was at index 3.',
        animations: [
          { type: 'updateVariable', target: 'high', value: 4, label: 'high = 4', color: '#3B82F6' },
          { type: 'showVariable', target: 'mid', value: 4, label: 'mid = 4', color: '#F97316' },
          { type: 'compare', target: '4', index: 4, color: '#EAB308', label: 'arr[4] = 3 > 2' },
        ],
      },
      {
        title: 'Return result',
        description: 'The last stored result is 3. Return 3 as the last occurrence.',
        animations: [
          { type: 'showVariable', target: 'result', value: 3, label: 'Last occurrence at', color: '#22C55E' },
          { type: 'glow', target: '3', index: 3, color: '#22C55E', label: 'Last 2 is at index 3' },
        ],
      },
    ],
    pseudocode: [
      'function lastOccurrence(arr, target):',
      '  low = 0, high = arr.length - 1, result = -1',
      '  while low <= high:',
      '    mid = low + (high - low) / 2',
      '    if arr[mid] == target:',
      '      result = mid',
      '      low = mid + 1    // search right',
      '    else if arr[mid] < target: low = mid + 1',
      '    else: high = mid - 1',
      '  return result',
    ],
    code: {
      cpp: `int lastOccurrence(vector<int>& arr, int target) {
  int low = 0, high = arr.size() - 1, result = -1;
  while (low <= high) {
    int mid = low + (high - low) / 2;
    if (arr[mid] == target) {
      result = mid;
      low = mid + 1;
    } else if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return result;
}`,
      javascript: `function lastOccurrence(arr, target) {
  let low = 0, high = arr.length - 1, result = -1;
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (arr[mid] === target) {
      result = mid;
      low = mid + 1;
    } else if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return result;
}`,
    },
    complexity: { time: 'O(log n)', space: 'O(1)' },
    commonMistakes: [
      'Confusing first and last occurrence logic (when to move low vs high)',
      'Forgetting to update result before moving the pointer',
      'Returning -1 when the target is not found instead of the stored result',
    ],
    tips: [
      'Combine with firstOccurrence to find the range of a target in O(log n)',
      'Use firstOccurrence(arr, target) and lastOccurrence(arr, target) to get full range',
      'If result remains -1 after the loop, the target is not in the array',
    ],
    inputExample: { array: [1, 2, 2, 2, 3, 4, 5], target: 2 },
  },
  {
    id: 'search-in-sorted-array',
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Hard',
    topic: 'Searching',
    level: 2,
    problem: 'There is a sorted array that has been rotated at an unknown pivot. Given this rotated sorted array and a target, return the index of the target. If not found, return -1.',
    example: 'Input: arr = [4, 5, 6, 7, 0, 1, 2], target = 0\nOutput: 4\nExplanation: The array was originally [0,1,2,4,5,6,7] and rotated at pivot 3.',
    intuition: 'In a rotated sorted array, one half is always fully sorted. We check which half the target belongs to and eliminate the other half.',
    steps: [
      {
        title: 'Initialize pointers',
        description: 'Set low = 0, high = 6. Find the sorted half by comparing arr[mid] with arr[low].',
        animations: [
          { type: 'showVariable', target: 'low', value: 0, label: 'low', color: '#3B82F6' },
          { type: 'showVariable', target: 'high', value: 6, label: 'high', color: '#3B82F6' },
          { type: 'highlight', target: '0-6', indices: [0, 1, 2, 3, 4, 5, 6], color: '#6B7280', label: 'Rotated array' },
        ],
      },
      {
        title: 'Calculate mid',
        description: 'mid = 0 + (6 - 0) / 2 = 3. arr[3] = 7. Check if left half is sorted: arr[low] <= arr[mid] → 4 <= 7, yes.',
        why: 'If the left half is sorted, we can determine if the target lies in it by range check.',
        animations: [
          { type: 'showVariable', target: 'mid', value: 3, label: 'mid = 3', color: '#F97316' },
          { type: 'highlight', target: '3', index: 3, color: '#EAB308', label: 'arr[3] = 7' },
          { type: 'showText', value: 'Left half [4,5,6,7] is sorted', color: '#22C55E' },
        ],
      },
      {
        title: 'Check if target in left half',
        description: 'Check if 0 is in [4, 7]. arr[low] = 4, arr[mid] = 7. Target = 0 < 4, so it is not in left half.',
        why: '0 is less than 4, so it cannot be in the sorted left half. Eliminate the left half.',
        animations: [
          { type: 'compare', target: '0', index: 0, color: '#EAB308', label: 'arr[0] = 4' },
          { type: 'showText', value: 'Target 0 < 4, not in left half', color: '#F97316' },
          { type: 'fade', target: '0-3', indices: [0, 1, 2, 3], color: '#6B7280', label: 'Eliminate left half' },
        ],
      },
      {
        title: 'Search right half',
        description: 'Set low = mid + 1 = 4. Now search [low=4, high=6]. mid = 5. arr[5] = 1.',
        why: 'The right half starts at index 4. We check if it is sorted and if target lies in it.',
        animations: [
          { type: 'updateVariable', target: 'low', value: 4, label: 'low = 4', color: '#3B82F6' },
          { type: 'moveArrow', from: 3, to: 5, color: '#3B82F6' },
          { type: 'highlight', target: '5', index: 5, color: '#EAB308', label: 'arr[5] = 1' },
        ],
      },
      {
        title: 'Check right half',
        description: 'arr[mid] = 1 <= arr[high] = 2, so right half [1,2] is sorted. Target 0 < 1, not here either.',
        why: 'Target is 0, which is less than the smallest element in the right half. Target cannot be in the right half.',
        animations: [
          { type: 'showText', value: 'Right half [1,2] is sorted', color: '#22C55E' },
          { type: 'compare', target: '5', index: 5, color: '#EAB308', label: 'arr[5] = 1 > 0' },
          { type: 'fade', target: '4-6', indices: [4, 5, 6], color: '#6B7280', label: 'Target not in right half' },
        ],
      },
      {
        title: 'Search remaining',
        description: 'Set high = mid - 1 = 4. Now low = 4, high = 4. mid = 4. arr[4] = 0 === target!',
        why: 'Only one element remains. We found the target at index 4.',
        animations: [
          { type: 'updateVariable', target: 'high', value: 4, label: 'high = 4', color: '#3B82F6' },
          { type: 'showVariable', target: 'mid', value: 4, label: 'mid = 4', color: '#F97316' },
          { type: 'compare', target: '4', index: 4, color: '#22C55E', label: 'arr[4] = 0 === target!' },
          { type: 'glow', target: '4', index: 4, color: '#22C55E' },
        ],
      },
      {
        title: 'Return result',
        description: 'Target found at index 4.',
        animations: [
          { type: 'showVariable', target: 'result', value: 4, label: 'Index', color: '#22C55E' },
          { type: 'showText', value: 'Search Complete: Found at index 4', color: '#22C55E' },
        ],
      },
    ],
    pseudocode: [
      'function searchRotated(arr, target):',
      '  low = 0, high = arr.length - 1',
      '  while low <= high:',
      '    mid = low + (high - low) / 2',
      '    if arr[mid] == target: return mid',
      '    if arr[low] <= arr[mid]:  // left half sorted',
      '      if arr[low] <= target < arr[mid]: high = mid - 1',
      '      else: low = mid + 1',
      '    else:  // right half sorted',
      '      if arr[mid] < target <= arr[high]: low = mid + 1',
      '      else: high = mid - 1',
      '  return -1',
    ],
    code: {
      cpp: `int searchRotated(vector<int>& arr, int target) {
  int low = 0, high = arr.size() - 1;
  while (low <= high) {
    int mid = low + (high - low) / 2;
    if (arr[mid] == target) return mid;
    if (arr[low] <= arr[mid]) {
      if (arr[low] <= target && target < arr[mid]) high = mid - 1;
      else low = mid + 1;
    } else {
      if (arr[mid] < target && target <= arr[high]) low = mid + 1;
      else high = mid - 1;
    }
  }
  return -1;
}`,
      javascript: `function searchRotated(arr, target) {
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (arr[mid] === target) return mid;
    if (arr[low] <= arr[mid]) {
      if (arr[low] <= target && target < arr[mid]) high = mid - 1;
      else low = mid + 1;
    } else {
      if (arr[mid] < target && target <= arr[high]) low = mid + 1;
      else high = mid - 1;
    }
  }
  return -1;
}`,
    },
    complexity: { time: 'O(log n)', space: 'O(1)' },
    commonMistakes: [
      'Not handling the case where the array is not actually rotated',
      'Using <= vs < incorrectly in boundary checks, causing off-by-one',
      'Forgetting that duplicates can break the condition arr[low] <= arr[mid]',
    ],
    tips: [
      'Draw the rotated array to visualize the two sorted segments',
      'Always check which half is sorted first, then check if target fits in that half',
      'When duplicates exist, you may need to increment low when arr[low] == arr[mid]',
    ],
    inputExample: { array: [4, 5, 6, 7, 0, 1, 2], target: 0 },
  },

  // ==============================
  // SORTING (5 questions)
  // ==============================
  {
    id: 'bubble-sort',
    title: 'Bubble Sort',
    difficulty: 'Easy',
    topic: 'Sorting',
    level: 2,
    problem: 'Sort an array of integers in ascending order using the Bubble Sort algorithm. Repeatedly step through the array, compare adjacent elements, and swap them if they are in the wrong order.',
    example: 'Input: arr = [5, 1, 4, 2, 8]\nOutput: [1, 2, 4, 5, 8]\nExplanation: After each pass, the largest unsorted element "bubbles up" to its correct position.',
    intuition: 'Bubble sort repeatedly compares adjacent elements and swaps them if they are out of order. With each pass, the largest element moves to its final position at the end.',
    steps: [
      {
        title: 'Start Pass 1',
        description: 'Begin the first pass. Compare adjacent pairs from index 0 to 3.',
        why: 'Each pass places the next largest element at its correct position at the end of the array.',
        animations: [
          { type: 'showText', value: 'Pass 1: Bubble the largest element to index 4', color: '#3B82F6' },
          { type: 'highlight', target: '0-4', indices: [0, 1, 2, 3, 4], color: '#6B7280', label: 'Unsorted' },
        ],
      },
      {
        title: 'Compare 5 and 1',
        description: 'arr[0] = 5, arr[1] = 1. 5 > 1, so swap them.',
        why: 'Since 5 > 1, they are in wrong order. Swapping moves the larger element rightward.',
        animations: [
          { type: 'compare', target: '0,1', indices: [0, 1], color: '#EAB308', label: '5 > 1, swap' },
          { type: 'swap', target: '0,1', from: 0, to: 1, color: '#F97316', label: 'Swapping 5 and 1' },
        ],
      },
      {
        title: 'Compare 5 and 4',
        description: 'After swap: arr = [1, 5, 4, 2, 8]. Compare arr[1] = 5 and arr[2] = 4. 5 > 4, swap.',
        animations: [
          { type: 'compare', target: '1,2', indices: [1, 2], color: '#EAB308', label: '5 > 4, swap' },
          { type: 'swap', target: '1,2', from: 1, to: 2, color: '#F97316', label: 'Swapping 5 and 4' },
        ],
      },
      {
        title: 'Compare 5 and 2',
        description: 'arr = [1, 4, 5, 2, 8]. Compare arr[2] = 5 and arr[3] = 2. 5 > 2, swap.',
        animations: [
          { type: 'compare', target: '2,3', indices: [2, 3], color: '#EAB308', label: '5 > 2, swap' },
          { type: 'swap', target: '2,3', from: 2, to: 3, color: '#F97316', label: 'Swapping 5 and 2' },
        ],
      },
      {
        title: 'Compare 5 and 8',
        description: 'arr = [1, 4, 2, 5, 8]. Compare arr[3] = 5 and arr[4] = 8. 5 < 8, no swap needed.',
        why: '5 is already less than 8, so they are in correct order. End of Pass 1. 8 is now at its final position.',
        animations: [
          { type: 'compare', target: '3,4', indices: [3, 4], color: '#22C55E', label: '5 < 8, no swap' },
          { type: 'glow', target: '4', index: 4, color: '#22C55E', label: '8 is in correct position' },
        ],
      },
      {
        title: 'Start Pass 2',
        description: 'Begin Pass 2. Compare pairs from index 0 to 2 (last element already sorted).',
        why: 'After each pass, one more element at the end is sorted and can be ignored.',
        animations: [
          { type: 'showText', value: 'Pass 2: Bubble the next largest element', color: '#3B82F6' },
          { type: 'fade', target: '4', index: 4, color: '#6B7280', label: 'Already sorted' },
        ],
      },
      {
        title: 'Compare 1 and 4',
        description: 'arr[0] = 1, arr[1] = 4. 1 < 4, no swap.',
        animations: [
          { type: 'compare', target: '0,1', indices: [0, 1], color: '#22C55E', label: '1 < 4, no swap' },
        ],
      },
      {
        title: 'Compare 4 and 2',
        description: 'arr[1] = 4, arr[2] = 2. 4 > 2, swap.',
        animations: [
          { type: 'compare', target: '1,2', indices: [1, 2], color: '#EAB308', label: '4 > 2, swap' },
          { type: 'swap', target: '1,2', from: 1, to: 2, color: '#F97316', label: 'Swapping 4 and 2' },
        ],
      },
      {
        title: 'Compare 4 and 5',
        description: 'arr[2] = 4, arr[3] = 5. 4 < 5, no swap. End of Pass 2. 5 is now sorted.',
        animations: [
          { type: 'compare', target: '2,3', indices: [2, 3], color: '#22C55E', label: '4 < 5, no swap' },
          { type: 'glow', target: '3', index: 3, color: '#22C55E', label: '5 is in correct position' },
        ],
      },
      {
        title: 'Final sorted array',
        description: 'After Pass 3 and 4 (no swaps needed), the array is fully sorted: [1, 2, 4, 5, 8].',
        why: 'When a pass completes without any swaps, the array is sorted and we can terminate early.',
        animations: [
          { type: 'showText', value: 'Array sorted! [1, 2, 4, 5, 8]', color: '#22C55E' },
          { type: 'glow', target: '0-4', indices: [0, 1, 2, 3, 4], color: '#22C55E', label: 'Sorted' },
        ],
      },
    ],
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
    code: {
      cpp: `void bubbleSort(vector<int>& arr) {
  int n = arr.size();
  for (int i = 0; i < n - 1; i++) {
    bool swapped = false;
    for (int j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr[j], arr[j + 1]);
        swapped = true;
      }
    }
    if (!swapped) break;
  }
}`,
      javascript: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`,
    },
    complexity: { time: 'O(n²)', space: 'O(1)' },
    commonMistakes: [
      'Not using the swapped flag to optimize early termination',
      'Iterating j up to n-1 instead of n-1-i, wasting comparisons',
      'Using > instead of >= — stable sort requires > only',
    ],
    tips: [
      'Bubble sort is rarely used in practice due to O(n²) time complexity',
      'The swapped flag optimization makes it O(n) for already sorted arrays',
      'It is a stable sorting algorithm (does not change relative order of equal elements)',
    ],
    inputExample: { array: [5, 1, 4, 2, 8] },
  },
  {
    id: 'selection-sort',
    title: 'Selection Sort',
    difficulty: 'Easy',
    topic: 'Sorting',
    level: 2,
    problem: 'Sort an array of integers in ascending order using Selection Sort. Repeatedly find the minimum element from the unsorted portion and place it at the beginning.',
    example: 'Input: arr = [64, 25, 12, 22, 11]\nOutput: [11, 12, 22, 25, 64]\nExplanation: Each pass selects the smallest element from the unsorted part and swaps it to the correct position.',
    intuition: 'Selection sort divides the array into sorted (left) and unsorted (right) parts. In each pass, it finds the minimum in the unsorted part and swaps it to the boundary.',
    steps: [
      {
        title: 'Pass 1: Find global minimum',
        description: 'Scan from index 0 to 4. Track the minimum element and its index.',
        why: 'The first pass finds the smallest element in the entire array to place at index 0.',
        animations: [
          { type: 'showText', value: 'Pass 1: Find minimum in [0..4]', color: '#3B82F6' },
          { type: 'highlight', target: '0-4', indices: [0, 1, 2, 3, 4], color: '#6B7280', label: 'Search space' },
        ],
      },
      {
        title: 'Compare 64 and 25',
        description: 'Start with minIdx = 0 (64). Compare arr[1] = 25. 25 < 64, update minIdx = 1.',
        animations: [
          { type: 'compare', target: '0', index: 0, color: '#EAB308', label: 'min = 64 at idx 0' },
          { type: 'compare', target: '1', index: 1, color: '#EAB308', label: '25 < 64, new min' },
          { type: 'showVariable', target: 'minIdx', value: 1, label: 'minIdx = 1', color: '#F97316' },
        ],
      },
      {
        title: 'Continue scanning',
        description: 'Compare with arr[2] = 12. 12 < 25, update minIdx = 2.',
        animations: [
          { type: 'compare', target: '2', index: 2, color: '#EAB308', label: '12 < 25, new min' },
          { type: 'updateVariable', target: 'minIdx', value: 2, label: 'minIdx = 2', color: '#F97316' },
        ],
      },
      {
        title: 'Compare with 22 and 11',
        description: 'arr[3] = 22 > 12, skip. arr[4] = 11 < 12, update minIdx = 4.',
        animations: [
          { type: 'compare', target: '3', index: 3, color: '#22C55E', label: '22 > 12, skip' },
          { type: 'compare', target: '4', index: 4, color: '#EAB308', label: '11 < 12, new min' },
          { type: 'updateVariable', target: 'minIdx', value: 4, label: 'minIdx = 4', color: '#F97316' },
        ],
      },
      {
        title: 'Swap minimum to front',
        description: 'Swap arr[0] = 64 with arr[4] = 11. Now 11 is at index 0 (sorted).',
        why: 'The smallest element (11) belongs at the beginning. Swapping places it in its final position.',
        animations: [
          { type: 'swap', target: '0,4', from: 0, to: 4, color: '#F97316', label: 'Swap 64 and 11' },
          { type: 'glow', target: '0', index: 0, color: '#22C55E', label: '11 is now sorted' },
        ],
      },
      {
        title: 'Pass 2: Find min in [1..4]',
        description: 'Array: [11, 25, 12, 22, 64]. Find minimum from index 1 to 4. Minimum is 12 at index 2.',
        why: 'Index 0 is sorted. Now we find the minimum of the remaining elements.',
        animations: [
          { type: 'showText', value: 'Pass 2: Find minimum in [1..4]', color: '#3B82F6' },
          { type: 'fade', target: '0', index: 0, color: '#6B7280', label: 'Sorted' },
          { type: 'compare', target: '2', index: 2, color: '#EAB308', label: '12 is minimum' },
        ],
      },
      {
        title: 'Swap with index 1',
        description: 'Swap arr[1] = 25 with arr[2] = 12.',
        animations: [
          { type: 'swap', target: '1,2', from: 1, to: 2, color: '#F97316', label: 'Swap 25 and 12' },
          { type: 'glow', target: '1', index: 1, color: '#22C55E', label: '12 is now sorted' },
        ],
      },
      {
        title: 'Remaining passes',
        description: 'Pass 3: Swap 22 into index 2. Pass 4: Swap 25 into index 3. Array becomes [11, 12, 22, 25, 64].',
        why: 'Selection sort continues until all elements are in their correct positions.',
        animations: [
          { type: 'swap', target: '2,3', from: 2, to: 3, color: '#F97316', label: 'Swap 22 and 25' },
          { type: 'glow', target: '2', index: 2, color: '#22C55E', label: '22 sorted' },
          { type: 'glow', target: '3', index: 3, color: '#22C55E', label: '25 sorted' },
          { type: 'glow', target: '4', index: 4, color: '#22C55E', label: '64 sorted' },
        ],
      },
    ],
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
    code: {
      cpp: `void selectionSort(vector<int>& arr) {
  int n = arr.size();
  for (int i = 0; i < n - 1; i++) {
    int minIdx = i;
    for (int j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx != i) swap(arr[i], arr[minIdx]);
  }
}`,
      javascript: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return arr;
}`,
    },
    complexity: { time: 'O(n²)', space: 'O(1)' },
    commonMistakes: [
      'Starting inner loop from i instead of i+1 (unnecessary comparison)',
      'Forgetting to swap when minIdx != i, causing no change',
      'Using > instead of <, sorting in descending order',
    ],
    tips: [
      'Selection sort makes O(n) swaps, which is minimal among O(n²) sorts',
      'Not stable — equal elements may have their relative order changed',
      'Good for situations where writing to memory is expensive (few swaps)',
    ],
    inputExample: { array: [64, 25, 12, 22, 11] },
  },
  {
    id: 'insertion-sort',
    title: 'Insertion Sort',
    difficulty: 'Easy',
    topic: 'Sorting',
    level: 2,
    problem: 'Sort an array of integers in ascending order using Insertion Sort. Build the sorted array one element at a time by inserting each element into its correct position.',
    example: 'Input: arr = [12, 11, 13, 5, 6]\nOutput: [5, 6, 11, 12, 13]\nExplanation: Each element is picked and inserted into its correct position among previously sorted elements.',
    intuition: 'Insertion sort builds the sorted array from left to right. For each element, it shifts larger elements to the right and inserts the current element in the correct gap.',
    steps: [
      {
        title: 'Start with first element',
        description: 'Consider arr[0] = 12 as already sorted. Begin with key = arr[1] = 11.',
        why: 'A single-element array is trivially sorted. We insert subsequent elements one by one.',
        animations: [
          { type: 'showText', value: 'Sorted: [12] | Unsorted: [11, 13, 5, 6]', color: '#3B82F6' },
          { type: 'highlight', target: '0', index: 0, color: '#22C55E', label: 'Sorted' },
          { type: 'highlight', target: '1', index: 1, color: '#EAB308', label: 'Current key = 11' },
        ],
      },
      {
        title: 'Insert 11',
        description: 'Compare key = 11 with arr[0] = 12. Since 11 < 12, shift 12 right to index 1. Insert 11 at index 0.',
        why: '11 belongs before 12. We shift 12 to make room and place 11 at the start.',
        animations: [
          { type: 'compare', target: '0', index: 0, color: '#EAB308', label: '11 < 12, shift right' },
          { type: 'moveArrow', from: 0, to: 1, color: '#F97316', label: '12 moves to index 1' },
          { type: 'insert', target: '0', index: 0, value: 11, color: '#22C55E', label: 'Insert 11 at index 0' },
        ],
      },
      {
        title: 'Insert 13',
        description: 'Sorted: [11, 12]. Key = arr[2] = 13. Compare with arr[1] = 12. 13 > 12, no shift needed. Insert 13 at index 2.',
        animations: [
          { type: 'showText', value: 'Sorted: [11, 12] | Key = 13', color: '#3B82F6' },
          { type: 'compare', target: '1', index: 1, color: '#22C55E', label: '13 > 12, no shift' },
          { type: 'insert', target: '2', index: 2, value: 13, color: '#22C55E', label: 'Insert 13 at index 2' },
        ],
      },
      {
        title: 'Insert 5',
        description: 'Key = arr[3] = 5. Compare with arr[2]=13, shift; arr[1]=12, shift; arr[0]=11, shift. Insert 5 at index 0.',
        why: '5 is the smallest so far. It must be shifted all the way to the front.',
        animations: [
          { type: 'showText', value: 'Key = 5, shifting elements right', color: '#F97316' },
          { type: 'moveArrow', from: 2, to: 3, color: '#F97316', label: '13 shifts right' },
          { type: 'moveArrow', from: 1, to: 2, color: '#F97316', label: '12 shifts right' },
          { type: 'moveArrow', from: 0, to: 1, color: '#F97316', label: '11 shifts right' },
          { type: 'insert', target: '0', index: 0, value: 5, color: '#22C55E', label: 'Insert 5 at index 0' },
        ],
      },
      {
        title: 'Insert 6',
        description: 'Key = arr[4] = 6. Compare with arr[3]=13, shift; arr[2]=12, shift; arr[1]=11, shift; arr[0]=5 < 6, stop. Insert 6 at index 1.',
        why: '6 belongs between 5 and 11. We stop shifting when we find an element <= key.',
        animations: [
          { type: 'showText', value: 'Key = 6, shifting until correct position', color: '#F97316' },
          { type: 'moveArrow', from: 3, to: 4, color: '#F97316', label: '13 shifts right' },
          { type: 'moveArrow', from: 2, to: 3, color: '#F97316', label: '12 shifts right' },
          { type: 'moveArrow', from: 1, to: 2, color: '#F97316', label: '11 shifts right' },
          { type: 'compare', target: '0', index: 0, color: '#22C55E', label: '5 < 6, stop' },
          { type: 'insert', target: '1', index: 1, value: 6, color: '#22C55E', label: 'Insert 6 at index 1' },
        ],
      },
      {
        title: 'Array sorted',
        description: 'All elements inserted. Final sorted array: [5, 6, 11, 12, 13].',
        animations: [
          { type: 'glow', target: '0-4', indices: [0, 1, 2, 3, 4], color: '#22C55E', label: 'Sorted!' },
          { type: 'showText', value: 'Insertion Sort Complete: [5, 6, 11, 12, 13]', color: '#22C55E' },
        ],
      },
    ],
    pseudocode: [
      'function insertionSort(arr):',
      '  for i = 1 to arr.length-1:',
      '    key = arr[i]',
      '    j = i - 1',
      '    while j >= 0 and arr[j] > key:',
      '      arr[j+1] = arr[j]',
      '      j--',
      '    arr[j+1] = key',
      '  return arr',
    ],
    code: {
      cpp: `void insertionSort(vector<int>& arr) {
  int n = arr.size();
  for (int i = 1; i < n; i++) {
    int key = arr[i];
    int j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
}`,
      javascript: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
    },
    complexity: { time: 'O(n²)', space: 'O(1)' },
    commonMistakes: [
      'Using arr[j] >= key instead of >, making the sort unstable',
      'Forgetting the j-- in the while loop, causing an infinite loop',
      'Off-by-one when writing arr[j+1] = key after the while loop',
    ],
    tips: [
      'Insertion sort is O(n) for nearly sorted arrays — best among O(n²) sorts',
      'It is stable and adaptive (performance improves with sortedness)',
      'Used as the base case in Timsort and other hybrid sorting algorithms',
    ],
    inputExample: { array: [12, 11, 13, 5, 6] },
  },
  {
    id: 'merge-sort',
    title: 'Merge Sort',
    difficulty: 'Medium',
    topic: 'Sorting',
    level: 2,
    problem: 'Sort an array of integers in ascending order using the Merge Sort algorithm. Divide the array into halves, recursively sort each half, then merge the sorted halves.',
    example: 'Input: arr = [38, 27, 43, 3, 9, 82, 10]\nOutput: [3, 9, 10, 27, 38, 43, 82]\nExplanation: The array is split into halves until single elements, then merged back in sorted order.',
    intuition: 'Merge sort is a divide-and-conquer algorithm. It splits the array into two halves, recursively sorts each half, then merges the two sorted halves into one sorted array.',
    steps: [
      {
        title: 'Initial Array',
        description: 'Array: [38, 27, 43, 3, 9, 82, 10]. Find middle: mid = 3 (0-based index).',
        why: 'We divide the array at the midpoint to create left and right subarrays.',
        animations: [
          { type: 'showText', value: 'Divide: Split array into left and right halves', color: '#3B82F6' },
          { type: 'highlight', target: '0-2', indices: [0, 1, 2], color: '#3B82F6', label: 'Left half' },
          { type: 'highlight', target: '3-6', indices: [3, 4, 5, 6], color: '#F97316', label: 'Right half' },
        ],
      },
      {
        title: 'Divide left half',
        description: 'Left: [38, 27, 43]. mid = 1. Further split into [38] and [27, 43].',
        why: 'Recursive division continues until each subarray has one element (trivially sorted).',
        animations: [
          { type: 'highlight', target: '0', index: 0, color: '#22C55E', label: '[38]' },
          { type: 'highlight', target: '1-2', indices: [1, 2], color: '#EAB308', label: '[27, 43]' },
        ],
      },
      {
        title: 'Divide right half',
        description: 'Right: [3, 9, 82, 10]. mid = 5. Split into [3, 9] and [82, 10].',
        animations: [
          { type: 'highlight', target: '3-4', indices: [3, 4], color: '#EAB308', label: '[3, 9]' },
          { type: 'highlight', target: '5-6', indices: [5, 6], color: '#EAB308', label: '[82, 10]' },
        ],
      },
      {
        title: 'Merge [27] and [43]',
        description: 'Left [27], Right [43]. Compare 27 < 43. Merged: [27, 43].',
        why: 'Single-element arrays are sorted. When merging, we compare and place the smaller element first.',
        animations: [
          { type: 'compare', target: '1', index: 1, color: '#EAB308', label: '27 < 43' },
          { type: 'insert', target: '1', index: 1, value: 27, color: '#22C55E' },
          { type: 'insert', target: '2', index: 2, value: 43, color: '#22C55E' },
        ],
      },
      {
        title: 'Merge [38] and [27, 43]',
        description: 'Compare 38 vs 27 → 27 < 38, take 27. Then 38 vs 43 → 38 < 43, take 38. Then take 43. Merged: [27, 38, 43].',
        why: 'Merge two sorted subarrays by repeatedly taking the smaller element from either side.',
        animations: [
          { type: 'compare', target: '0', index: 0, color: '#EAB308', label: '38 vs 27' },
          { type: 'insert', target: '0', index: 0, value: 27, color: '#22C55E', label: '27 inserted' },
          { type: 'compare', target: '0', index: 0, color: '#EAB308', label: '38 vs 43' },
          { type: 'insert', target: '1', index: 1, value: 38, color: '#22C55E', label: '38 inserted' },
          { type: 'insert', target: '2', index: 2, value: 43, color: '#22C55E', label: '43 inserted' },
        ],
      },
      {
        title: 'Merge right half [3,9] and [10,82]',
        description: 'Compare: 3<10→3, 9<10→9, 10, 82. Merged: [3, 9, 10, 82].',
        animations: [
          { type: 'compare', target: '3', index: 3, color: '#EAB308', label: '3 < 10, take 3' },
          { type: 'compare', target: '4', index: 4, color: '#EAB308', label: '9 < 10, take 9' },
          { type: 'insert', target: '3', index: 3, value: 3, color: '#22C55E' },
          { type: 'insert', target: '4', index: 4, value: 9, color: '#22C55E' },
          { type: 'insert', target: '5', index: 5, value: 10, color: '#22C55E' },
          { type: 'insert', target: '6', index: 6, value: 82, color: '#22C55E' },
        ],
      },
      {
        title: 'Final merge',
        description: 'Merge [27, 38, 43] and [3, 9, 10, 82]. Compare and insert one by one: 3, 9, 10, 27, 38, 43, 82.',
        why: 'The final merge combines the two sorted halves into the fully sorted array.',
        animations: [
          { type: 'showText', value: 'Final merge: [27,38,43] + [3,9,10,82]', color: '#3B82F6' },
          { type: 'compare', target: '0', index: 0, color: '#EAB308', label: '27 vs 3 → 3' },
          { type: 'compare', target: '0,1', indices: [0, 1], color: '#EAB308', label: '27 vs 9 → 9' },
          { type: 'compare', target: '0,2', indices: [0, 2], color: '#EAB308', label: '27 vs 10 → 10' },
          { type: 'compare', target: '0,3', indices: [0, 3], color: '#22C55E', label: '27 vs 82 → 27' },
          { type: 'glow', target: '0-6', indices: [0, 1, 2, 3, 4, 5, 6], color: '#22C55E', label: 'Array sorted!' },
        ],
      },
    ],
    pseudocode: [
      'function mergeSort(arr, left, right):',
      '  if left >= right: return',
      '  mid = left + (right - left) / 2',
      '  mergeSort(arr, left, mid)',
      '  mergeSort(arr, mid + 1, right)',
      '  merge(arr, left, mid, right)',
      '',
      'function merge(arr, left, mid, right):',
      '  create temp arrays L and R',
      '  copy data into L and R',
      '  i = j = 0, k = left',
      '  while i < L.len and j < R.len:',
      '    if L[i] <= R[j]: arr[k++] = L[i++]',
      '    else: arr[k++] = R[j++]',
      '  copy remaining elements',
    ],
    code: {
      cpp: `void merge(vector<int>& arr, int left, int mid, int right) {
  int n1 = mid - left + 1, n2 = right - mid;
  vector<int> L(n1), R(n2);
  for (int i = 0; i < n1; i++) L[i] = arr[left + i];
  for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];
  int i = 0, j = 0, k = left;
  while (i < n1 && j < n2) {
    if (L[i] <= R[j]) arr[k++] = L[i++];
    else arr[k++] = R[j++];
  }
  while (i < n1) arr[k++] = L[i++];
  while (j < n2) arr[k++] = R[j++];
}

void mergeSort(vector<int>& arr, int left, int right) {
  if (left >= right) return;
  int mid = left + (right - left) / 2;
  mergeSort(arr, left, mid);
  mergeSort(arr, mid + 1, right);
  merge(arr, left, mid, right);
}`,
      javascript: `function mergeSort(arr, left = 0, right = arr.length - 1) {
  if (left >= right) return;
  const mid = left + Math.floor((right - left) / 2);
  mergeSort(arr, left, mid);
  mergeSort(arr, mid + 1, right);
  merge(arr, left, mid, right);
  return arr;
}

function merge(arr, left, mid, right) {
  const L = arr.slice(left, mid + 1);
  const R = arr.slice(mid + 1, right + 1);
  let i = 0, j = 0, k = left;
  while (i < L.length && j < R.length) {
    if (L[i] <= R[j]) arr[k++] = L[i++];
    else arr[k++] = R[j++];
  }
  while (i < L.length) arr[k++] = L[i++];
  while (j < R.length) arr[k++] = R[j++];
}`,
    },
    complexity: { time: 'O(n log n)', space: 'O(n)' },
    commonMistakes: [
      'Using incorrect mid calculation that causes infinite recursion',
      'Creating new arrays in merge every time instead of reusing space',
      'Forgetting to copy remaining elements from L or R after the main loop',
    ],
    tips: [
      'Merge sort is stable and always O(n log n), even in the worst case',
      'Space complexity can be reduced to O(1) with in-place merge (but it is complex)',
      'It is the basis for Timsort (Python, Java, JS engine) and other hybrid sorts',
    ],
    inputExample: { array: [38, 27, 43, 3, 9, 82, 10] },
  },
  {
    id: 'quick-sort',
    title: 'Quick Sort',
    difficulty: 'Medium',
    topic: 'Sorting',
    level: 2,
    problem: 'Sort an array of integers in ascending order using Quick Sort. Choose a pivot, partition the array so that elements smaller than pivot come before it and larger come after, then recursively sort the subarrays.',
    example: 'Input: arr = [10, 7, 8, 9, 1, 5]\nOutput: [1, 5, 7, 8, 9, 10]\nExplanation: Using Lomuto partition scheme, elements are rearranged around a pivot.',
    intuition: 'Quick sort picks a pivot, partitions the array around it, and then recursively sorts the left and right partitions. The pivot ends up in its final sorted position after each partition.',
    steps: [
      {
        title: 'Choose pivot',
        description: 'Array: [10, 7, 8, 9, 1, 5]. Choose last element arr[5] = 5 as pivot.',
        why: 'Using the last element as pivot is the simplest Lomuto partition scheme.',
        animations: [
          { type: 'showText', value: 'Pivot = arr[5] = 5', color: '#EAB308' },
          { type: 'highlight', target: '5', index: 5, color: '#EAB308', label: 'Pivot: 5' },
          { type: 'showVariable', target: 'pivot', value: 5, label: 'Pivot value', color: '#EAB308' },
        ],
      },
      {
        title: 'Partition: Initialize i',
        description: 'Set i = low - 1 = -1. This tracks the boundary of elements <= pivot.',
        why: 'Variable i points to the last element in the "processed smaller than pivot" section.',
        animations: [
          { type: 'showVariable', target: 'i', value: -1, label: 'i = low - 1', color: '#3B82F6' },
          { type: 'showText', value: 'Partition step: rearrange elements around pivot', color: '#3B82F6' },
        ],
      },
      {
        title: 'Compare 10 with pivot',
        description: 'j = 0. arr[0] = 10 > 5. No swap, just move j forward.',
        animations: [
          { type: 'compare', target: '0', index: 0, color: '#EAB308', label: '10 > 5, no swap' },
          { type: 'moveArrow', from: 0, to: 1, color: '#6B7280', label: 'j = 1' },
        ],
      },
      {
        title: 'Compare 7 and 8 with pivot',
        description: 'j = 1: 7 > 5, no swap. j = 2: 8 > 5, no swap.',
        animations: [
          { type: 'compare', target: '1', index: 1, color: '#EAB308', label: '7 > 5, no swap' },
          { type: 'compare', target: '2', index: 2, color: '#EAB308', label: '8 > 5, no swap' },
        ],
      },
      {
        title: 'Compare 9 with pivot',
        description: 'j = 3: 9 > 5, no swap.',
        animations: [
          { type: 'compare', target: '3', index: 3, color: '#EAB308', label: '9 > 5, no swap' },
        ],
      },
      {
        title: 'Compare 1 with pivot',
        description: 'j = 4: 1 < 5. Increment i to 0. Swap arr[0] = 10 with arr[4] = 1.',
        why: 'Element 1 belongs on the left side. Swap it with the first element larger than pivot.',
        animations: [
          { type: 'compare', target: '4', index: 4, color: '#22C55E', label: '1 < 5, swap!' },
          { type: 'updateVariable', target: 'i', value: 0, label: 'i = 0', color: '#F97316' },
          { type: 'swap', target: '0,4', from: 0, to: 4, color: '#F97316', label: 'Swap 10 and 1' },
        ],
      },
      {
        title: 'Place pivot in correct position',
        description: 'After loop: i = 0. Swap arr[i+1] = arr[1] = 7 with arr[high] = 5 (pivot).',
        why: 'The pivot belongs at index i+1, between elements <= pivot and > pivot.',
        animations: [
          { type: 'swap', target: '1,5', from: 1, to: 5, color: '#F97316', label: 'Swap pivot 5 with arr[1] = 7' },
          { type: 'glow', target: '1', index: 1, color: '#22C55E', label: 'Pivot 5 is in final position' },
        ],
      },
      {
        title: 'Recursively sort left and right',
        description: 'Left subarray [1] (trivial). Right subarray [10, 7, 8, 9] sorted recursively with pivot 9.',
        why: 'After partition, the pivot is sorted. Recursively sort the left and right partitions.',
        animations: [
          { type: 'showText', value: 'Recursively sort right: [10, 7, 8, 9]', color: '#3B82F6' },
          { type: 'highlight', target: '2-5', indices: [2, 3, 4, 5], color: '#EAB308', label: 'Sort right half' },
        ],
      },
    ],
    pseudocode: [
      'function quickSort(arr, low, high):',
      '  if low < high:',
      '    pi = partition(arr, low, high)',
      '    quickSort(arr, low, pi - 1)',
      '    quickSort(arr, pi + 1, high)',
      '',
      'function partition(arr, low, high):',
      '  pivot = arr[high]',
      '  i = low - 1',
      '  for j = low to high - 1:',
      '    if arr[j] <= pivot:',
      '      i++',
      '      swap(arr[i], arr[j])',
      '  swap(arr[i + 1], arr[high])',
      '  return i + 1',
    ],
    code: {
      cpp: `int partition(vector<int>& arr, int low, int high) {
  int pivot = arr[high];
  int i = low - 1;
  for (int j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      swap(arr[i], arr[j]);
    }
  }
  swap(arr[i + 1], arr[high]);
  return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
  if (low < high) {
    int pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}`,
      javascript: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
    },
    complexity: { time: 'O(n log n) average, O(n²) worst', space: 'O(log n)' },
    commonMistakes: [
      'Using pivot = arr[low] and then getting stuck with already sorted arrays',
      'Incorrect partition boundary causing infinite recursion',
      'Forgetting that quick sort is not stable (equal elements may swap)',
    ],
    tips: [
      'Randomized pivot selection avoids O(n²) worst case',
      'For small subarrays (size < 10), switch to insertion sort for performance',
      'Use three-way partitioning when many duplicates exist',
    ],
    inputExample: { array: [10, 7, 8, 9, 1, 5] },
  },

  // ==============================
  // RECURSION (5 questions)
  // ==============================
  {
    id: 'recursive-factorial',
    title: 'Recursive Factorial',
    difficulty: 'Easy',
    topic: 'Recursion',
    level: 2,
    problem: 'Given a non-negative integer n, compute n! (n factorial) using recursion. n! = n * (n-1) * (n-2) * ... * 1, with 0! = 1.',
    example: 'Input: n = 5\nOutput: 120\nExplanation: 5! = 5 × 4 × 3 × 2 × 1 = 120',
    intuition: 'Factorial follows the recurrence relation n! = n * (n-1)!, with base case 0! = 1. This makes it a natural fit for recursion.',
    steps: [
      {
        title: 'Call factorial(5)',
        description: 'n = 5, not base case. Recurrence: 5 * factorial(4). Push onto call stack.',
        why: 'Since 5 > 0, we cannot return 1. We must compute factorial(4) first.',
        animations: [
          { type: 'showStack', data: { stack: ['factorial(5)'] }, label: 'Call stack' },
          { type: 'showVariable', target: 'n', value: 5, label: 'n = 5', color: '#3B82F6' },
          { type: 'showText', value: '5 * factorial(4)', color: '#EAB308' },
        ],
      },
      {
        title: 'Call factorial(4)',
        description: 'n = 4. Recurrence: 4 * factorial(3).',
        animations: [
          { type: 'showStack', data: { stack: ['factorial(5)', 'factorial(4)'] }, label: 'Call stack' },
          { type: 'updateVariable', target: 'n', value: 4, color: '#3B82F6' },
          { type: 'showText', value: '4 * factorial(3)', color: '#EAB308' },
        ],
      },
      {
        title: 'Call factorial(3)',
        description: 'n = 3. Recurrence: 3 * factorial(2).',
        animations: [
          { type: 'showStack', data: { stack: ['factorial(5)', 'factorial(4)', 'factorial(3)'] }, label: 'Call stack' },
          { type: 'updateVariable', target: 'n', value: 3, color: '#3B82F6' },
          { type: 'showText', value: '3 * factorial(2)', color: '#EAB308' },
        ],
      },
      {
        title: 'Call factorial(2)',
        description: 'n = 2. Recurrence: 2 * factorial(1).',
        animations: [
          { type: 'showStack', data: { stack: ['factorial(5)', 'factorial(4)', 'factorial(3)', 'factorial(2)'] }, label: 'Call stack' },
          { type: 'updateVariable', target: 'n', value: 2, color: '#3B82F6' },
          { type: 'showText', value: '2 * factorial(1)', color: '#EAB308' },
        ],
      },
      {
        title: 'Call factorial(1)',
        description: 'n = 1. Recurrence: 1 * factorial(0).',
        animations: [
          { type: 'showStack', data: { stack: ['factorial(5)', 'factorial(4)', 'factorial(3)', 'factorial(2)', 'factorial(1)'] }, label: 'Call stack' },
          { type: 'updateVariable', target: 'n', value: 1, color: '#3B82F6' },
          { type: 'showText', value: '1 * factorial(0)', color: '#EAB308' },
        ],
      },
      {
        title: 'Base case: factorial(0)',
        description: 'n = 0. Return 1 (base case). Start unwinding the stack.',
        why: '0! = 1 by definition. This is the base case that stops recursion.',
        animations: [
          { type: 'showStack', data: { stack: ['factorial(5)', 'factorial(4)', 'factorial(3)', 'factorial(2)', 'factorial(1)'] }, label: 'Call stack' },
          { type: 'glow', target: 'base', color: '#22C55E', label: 'Base case: return 1' },
          { type: 'showVariable', target: 'result', value: 1, label: 'factorial(0) = 1', color: '#22C55E' },
        ],
      },
      {
        title: 'Unwind: factorial(1)',
        description: '1 * factorial(0) = 1 * 1 = 1. Return 1. Pop from stack.',
        animations: [
          { type: 'pop', target: 'factorial(1)', label: 'Return 1' },
          { type: 'updateVariable', target: 'result', value: 1, label: 'factorial(1) = 1', color: '#F97316' },
        ],
      },
      {
        title: 'Unwind: factorial(2)',
        description: '2 * factorial(1) = 2 * 1 = 2.',
        animations: [
          { type: 'pop', target: 'factorial(2)', label: 'Return 2' },
          { type: 'updateVariable', target: 'result', value: 2, label: 'factorial(2) = 2', color: '#F97316' },
        ],
      },
      {
        title: 'Unwind: factorial(3)',
        description: '3 * factorial(2) = 3 * 2 = 6.',
        animations: [
          { type: 'pop', target: 'factorial(3)', label: 'Return 6' },
          { type: 'updateVariable', target: 'result', value: 6, label: 'factorial(3) = 6', color: '#F97316' },
        ],
      },
      {
        title: 'Unwind: factorial(4) and factorial(5)',
        description: '4 * 6 = 24. 5 * 24 = 120. Final result: 120.',
        why: 'The call stack unwinds completely, yielding the final result at the original call.',
        animations: [
          { type: 'pop', target: 'factorial(4)', label: 'Return 24' },
          { type: 'pop', target: 'factorial(5)', label: 'Return 120' },
          { type: 'showVariable', target: 'result', value: 120, label: '5! = 120', color: '#22C55E' },
          { type: 'glow', target: 'final', color: '#22C55E', label: 'Factorial computed!' },
        ],
      },
    ],
    pseudocode: [
      'function factorial(n):',
      '  if n == 0: return 1        // base case',
      '  return n * factorial(n-1)  // recursive case',
    ],
    code: {
      cpp: `int factorial(int n) {
  if (n == 0) return 1;
  return n * factorial(n - 1);
}`,
      javascript: `function factorial(n) {
  if (n === 0) return 1;
  return n * factorial(n - 1);
}`,
    },
    complexity: { time: 'O(n)', space: 'O(n)' },
    commonMistakes: [
      'Forgetting the base case, causing infinite recursion and stack overflow',
      'Using n == 1 as base case but not handling n = 0',
      'Not using long long for large n in C++ (overflow for n > 12)',
    ],
    tips: [
      'Factorial grows very fast — use a 64-bit integer or BigInt for large n',
      'Iterative solution is O(n) time and O(1) space, more efficient',
      'The recursive solution demonstrates the call stack mechanism clearly',
    ],
    inputExample: { n: 5 },
  },
  {
    id: 'recursive-fibonacci',
    title: 'Recursive Fibonacci',
    difficulty: 'Easy',
    topic: 'Recursion',
    level: 2,
    problem: 'Given a non-negative integer n, return the nth Fibonacci number. The Fibonacci sequence is defined as: F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2) for n ≥ 2.',
    example: 'Input: n = 6\nOutput: 8\nExplanation: The sequence is 0, 1, 1, 2, 3, 5, 8. F(6) = 8.',
    intuition: 'Fibonacci has a natural recursive definition with two base cases (n=0 and n=1). Each number is the sum of the two preceding numbers.',
    steps: [
      {
        title: 'Call fib(6)',
        description: 'n = 6 ≥ 2. Compute fib(5) + fib(4). First compute fib(5).',
        why: 'Each Fibonacci call spawns two recursive calls, forming a binary tree of computations.',
        animations: [
          { type: 'showVariable', target: 'n', value: 6, label: 'n = 6', color: '#3B82F6' },
          { type: 'showText', value: 'fib(6) = fib(5) + fib(4)', color: '#EAB308' },
          { type: 'showTree', data: { tree: 'fib(6)' }, label: 'Recursion tree' },
        ],
      },
      {
        title: 'Call fib(5)',
        description: 'Compute fib(5) = fib(4) + fib(3).',
        animations: [
          { type: 'showTree', data: { tree: 'fib(6)->fib(5)' }, label: 'Recursion tree' },
          { type: 'showText', value: 'fib(5) = fib(4) + fib(3)', color: '#EAB308' },
        ],
      },
      {
        title: 'Call fib(4)',
        description: 'Compute fib(4) = fib(3) + fib(2).',
        animations: [
          { type: 'showTree', data: { tree: 'fib(6)->fib(5)->fib(4)' }, label: 'Recursion tree' },
          { type: 'showText', value: 'fib(4) = fib(3) + fib(2)', color: '#EAB308' },
        ],
      },
      {
        title: 'Call fib(3)',
        description: 'Compute fib(3) = fib(2) + fib(1).',
        animations: [
          { type: 'showTree', data: { tree: 'fib(6)->fib(5)->fib(4)->fib(3)' }, label: 'Recursion tree' },
          { type: 'showText', value: 'fib(3) = fib(2) + fib(1)', color: '#EAB308' },
        ],
      },
      {
        title: 'Call fib(2) and base cases',
        description: 'fib(2) = fib(1) + fib(0) = 1 + 0 = 1. fib(1) = 1, fib(0) = 0 (base cases).',
        why: 'The recursion bottoms out at the base cases n=0 and n=1, which return known values.',
        animations: [
          { type: 'showTree', data: { tree: 'fib(6)->fib(5)->fib(4)->fib(3)->fib(2)' }, label: 'Reaching base cases' },
          { type: 'showVariable', target: 'fib(0)', value: 0, label: 'fib(0) = 0', color: '#22C55E' },
          { type: 'showVariable', target: 'fib(1)', value: 1, label: 'fib(1) = 1', color: '#22C55E' },
          { type: 'showVariable', target: 'fib(2)', value: 1, label: 'fib(2) = 1 + 0 = 1', color: '#F97316' },
        ],
      },
      {
        title: 'Backtrack: compute fib(3)',
        description: 'fib(3) = fib(2) + fib(1) = 1 + 1 = 2.',
        animations: [
          { type: 'showVariable', target: 'fib(3)', value: 2, label: 'fib(3) = 2', color: '#F97316' },
          { type: 'showTree', data: { tree: 'fib(6)->fib(5)->fib(4)' }, label: 'Backtracking' },
        ],
      },
      {
        title: 'Backtrack: compute fib(4)',
        description: 'fib(4) = fib(3) + fib(2) = 2 + 1 = 3.',
        animations: [
          { type: 'showVariable', target: 'fib(4)', value: 3, label: 'fib(4) = 3', color: '#F97316' },
          { type: 'showTree', data: { tree: 'fib(6)->fib(5)' }, label: 'Backtracking' },
        ],
      },
      {
        title: 'Backtrack: compute fib(5)',
        description: 'Need fib(3) for the second branch: fib(3) = fib(2) + fib(1) = 1 + 1 = 2. fib(5) = 3 + 2 = 5.',
        why: 'Notice fib(3) is computed twice! This shows the redundancy of naive recursion.',
        animations: [
          { type: 'showVariable', target: 'fib(5)', value: 5, label: 'fib(5) = 5', color: '#F97316' },
          { type: 'showText', value: 'fib(3) computed again (redundant!)', color: '#EF4444' },
        ],
      },
      {
        title: 'Compute fib(6)',
        description: 'Need fib(4) for the second branch: fib(4) = fib(3) + fib(2) = 2 + 1 = 3. fib(6) = 5 + 3 = 8.',
        why: 'Both fib(5) and fib(4) are now known. Summing gives the final answer.',
        animations: [
          { type: 'showVariable', target: 'fib(6)', value: 8, label: 'fib(6) = 8', color: '#22C55E' },
          { type: 'glow', target: 'final', color: '#22C55E', label: 'F(6) = 8' },
          { type: 'showText', value: 'Fibonacci completed!', color: '#22C55E' },
        ],
      },
    ],
    pseudocode: [
      'function fib(n):',
      '  if n == 0: return 0',
      '  if n == 1: return 1',
      '  return fib(n-1) + fib(n-2)',
    ],
    code: {
      cpp: `int fib(int n) {
  if (n == 0) return 0;
  if (n == 1) return 1;
  return fib(n - 1) + fib(n - 2);
}`,
      javascript: `function fib(n) {
  if (n === 0) return 0;
  if (n === 1) return 1;
  return fib(n - 1) + fib(n - 2);
}`,
    },
    complexity: { time: 'O(2ⁿ)', space: 'O(n)' },
    commonMistakes: [
      'Using only one base case (e.g., if n <= 1 return n) — correct but less explicit',
      'Not realizing the naive recursion has exponential time complexity',
      'Stack overflow for moderately large n (n > 40) due to deep recursion',
    ],
    tips: [
      'Naive recursion is O(2ⁿ) — inefficient for large n. Use memoization or iteration.',
      'The recursion tree shows many repeated computations (overlapping subproblems)',
      'Iterative DP: O(n) time, O(1) space. Matrix exponentiation: O(log n).',
    ],
    inputExample: { n: 6 },
  },
  {
    id: 'recursive-reverse-string',
    title: 'Recursive Reverse String',
    difficulty: 'Easy',
    topic: 'Recursion',
    level: 2,
    problem: 'Given a string, reverse it using recursion. Do not use any built-in reverse functions or loops.',
    example: 'Input: s = "hello"\nOutput: "olleh"\nExplanation: Using recursion, swap characters from both ends moving inward.',
    intuition: 'Reverse by recursively swapping the first and last characters, then reversing the substring between them.',
    steps: [
      {
        title: 'Initial call',
        description: 'Call reverse(s, 0, 4) where s = "hello". Swap s[0] and s[4].',
        why: 'We use two pointers: left starts at 0, right at the last index. Swap them and recurse inward.',
        animations: [
          { type: 'showVariable', target: 'left', value: 0, label: 'left = 0', color: '#3B82F6' },
          { type: 'showVariable', target: 'right', value: 4, label: 'right = 4', color: '#3B82F6' },
          { type: 'showText', value: 'Swap s[0]=h and s[4]=o', color: '#EAB308' },
          { type: 'highlight', target: '0', index: 0, color: '#EAB308', label: 'h' },
          { type: 'highlight', target: '4', index: 4, color: '#EAB308', label: 'o' },
        ],
      },
      {
        title: 'Swap h and o',
        description: 's[0] = "h", s[4] = "o". After swap: s = "oellh".',
        why: 'The characters at the ends are swapped. Now we recurse on the inner substring.',
        animations: [
          { type: 'swap', target: '0,4', from: 0, to: 4, color: '#F97316', label: 'Swap h and o' },
          { type: 'updateVariable', target: 's', value: 'oellh', label: 'String: oellh', color: '#F97316' },
        ],
      },
      {
        title: 'Recurse inward',
        description: 'Call reverse(s, 1, 3). left = 1 (e), right = 3 (l). Swap s[1] and s[3].',
        why: 'Each recursive call moves the pointers one step inward, reducing the problem size by 2.',
        animations: [
          { type: 'showVariable', target: 'left', value: 1, label: 'left = 1', color: '#3B82F6' },
          { type: 'showVariable', target: 'right', value: 3, label: 'right = 3', color: '#3B82F6' },
          { type: 'highlight', target: '1', index: 1, color: '#EAB308', label: 'e' },
          { type: 'highlight', target: '3', index: 3, color: '#EAB308', label: 'l' },
        ],
      },
      {
        title: 'Swap e and l',
        description: 'After swap: s = "olleh".',
        animations: [
          { type: 'swap', target: '1,3', from: 1, to: 3, color: '#F97316', label: 'Swap e and l' },
          { type: 'updateVariable', target: 's', value: 'olleh', label: 'String: olleh', color: '#F97316' },
        ],
      },
      {
        title: 'Base case',
        description: 'Call reverse(s, 2, 2). left = 2, right = 2. left >= right, so return (base case).',
        why: 'When the pointers meet or cross, the string is fully reversed. This is the base case.',
        animations: [
          { type: 'showVariable', target: 'left', value: 2, label: 'left = 2', color: '#3B82F6' },
          { type: 'showVariable', target: 'right', value: 2, label: 'right = 2', color: '#3B82F6' },
          { type: 'glow', target: 'base', color: '#22C55E', label: 'Base case: left >= right, return' },
        ],
      },
      {
        title: 'Return result',
        description: 'The string is now fully reversed: "olleh".',
        animations: [
          { type: 'showVariable', target: 'result', value: 'olleh', label: 'Reversed string', color: '#22C55E' },
          { type: 'glow', target: 'final', color: '#22C55E', label: 'Reverse complete!' },
        ],
      },
    ],
    pseudocode: [
      'function reverseString(s, left, right):',
      '  if left >= right: return',
      '  swap(s[left], s[right])',
      '  reverseString(s, left + 1, right - 1)',
    ],
    code: {
      cpp: `void reverseString(string& s, int left, int right) {
  if (left >= right) return;
  swap(s[left], s[right]);
  reverseString(s, left + 1, right - 1);
}`,
      javascript: `function reverseString(s, left = 0, right = s.length - 1) {
  if (left >= right) return;
  [s[left], s[right]] = [s[right], s[left]];
  reverseString(s, left + 1, right - 1);
}`,
    },
    complexity: { time: 'O(n)', space: 'O(n)' },
    commonMistakes: [
      'Forgetting the base case condition (left >= right)',
      'Passing the string by value instead of reference in C++ (causes O(n²) time)',
      'Incrementing/decrementing the wrong pointer',
    ],
    tips: [
      'The recursion depth equals n/2, which could overflow the stack for very long strings',
      'In practice, use the iterative two-pointer approach for O(1) extra space',
      'This can also be done by recursively taking the last char + reverse(rest)',
    ],
    inputExample: { s: 'hello' },
  },
  {
    id: 'recursive-binary-search',
    title: 'Recursive Binary Search',
    difficulty: 'Easy',
    topic: 'Recursion',
    level: 2,
    problem: 'Given a sorted array of integers and a target, implement binary search recursively. Return the index of the target, or -1 if not found.',
    example: 'Input: arr = [1, 3, 5, 7, 9, 11, 13], target = 7\nOutput: 3\nExplanation: Binary search divides the range in half at each recursive step.',
    intuition: 'Binary search recursively narrows the search space by comparing the target with the middle element and recursing on the appropriate half.',
    steps: [
      {
        title: 'Initial recursive call',
        description: 'Call binarySearch(arr, 7, 0, 6). Search range: [0, 6].',
        why: 'We start with the full range. The recursive function takes low and high as parameters.',
        animations: [
          { type: 'showVariable', target: 'low', value: 0, label: 'low = 0', color: '#3B82F6' },
          { type: 'showVariable', target: 'high', value: 6, label: 'high = 6', color: '#3B82F6' },
          { type: 'highlight', target: '0-6', indices: [0, 1, 2, 3, 4, 5, 6], color: '#6B7280', label: 'Search range' },
        ],
      },
      {
        title: 'Compute mid',
        description: 'mid = 0 + (6 - 0) / 2 = 3. arr[3] = 7.',
        why: 'The mid index splits the search range into two halves.',
        animations: [
          { type: 'showVariable', target: 'mid', value: 3, label: 'mid = 3', color: '#F97316' },
          { type: 'highlight', target: '3', index: 3, color: '#EAB308', label: 'arr[3] = 7' },
        ],
      },
      {
        title: 'Compare and match',
        description: 'arr[3] = 7 === target = 7. Base case: return 3.',
        why: 'When the middle element equals the target, we have found the answer and return.',
        animations: [
          { type: 'compare', target: '3', index: 3, color: '#22C55E', label: '7 === 7, found!' },
          { type: 'glow', target: '3', index: 3, color: '#22C55E', label: 'Target found at index 3' },
        ],
      },
      {
        title: 'Return result',
        description: 'Return index 3 up the recursion chain.',
        animations: [
          { type: 'showVariable', target: 'result', value: 3, label: 'Return: 3', color: '#22C55E' },
          { type: 'showText', value: 'Recursive Binary Search Complete', color: '#22C55E' },
        ],
      },
    ],
    pseudocode: [
      'function binarySearch(arr, target, low, high):',
      '  if low > high: return -1',
      '  mid = low + (high - low) / 2',
      '  if arr[mid] == target: return mid',
      '  if arr[mid] > target:',
      '    return binarySearch(arr, target, low, mid - 1)',
      '  return binarySearch(arr, target, mid + 1, high)',
    ],
    code: {
      cpp: `int binarySearch(vector<int>& arr, int target, int low, int high) {
  if (low > high) return -1;
  int mid = low + (high - low) / 2;
  if (arr[mid] == target) return mid;
  if (arr[mid] > target)
    return binarySearch(arr, target, low, mid - 1);
  return binarySearch(arr, target, mid + 1, high);
}`,
      javascript: `function binarySearch(arr, target, low = 0, high = arr.length - 1) {
  if (low > high) return -1;
  const mid = low + Math.floor((high - low) / 2);
  if (arr[mid] === target) return mid;
  if (arr[mid] > target)
    return binarySearch(arr, target, low, mid - 1);
  return binarySearch(arr, target, mid + 1, high);
}`,
    },
    complexity: { time: 'O(log n)', space: 'O(log n)' },
    commonMistakes: [
      'Using low < high as base case, missing the case where low == high',
      'Forgetting to return the result of the recursive call',
      'Using (low + high) / 2 which can overflow for large integers',
    ],
    tips: [
      'Recursive binary search has O(log n) space due to call stack, iterative is O(1)',
      'The recursion depth is at most log₂(n), so stack overflow is unlikely',
      'Always pass the array by reference to avoid O(n) copying overhead',
    ],
    inputExample: { array: [1, 3, 5, 7, 9, 11, 13], target: 7 },
  },
  {
    id: 'generate-subsets',
    title: 'Generate Subsets (Power Set)',
    difficulty: 'Medium',
    topic: 'Recursion',
    level: 2,
    problem: 'Given an array of distinct integers, generate all possible subsets (the power set). Use recursion to build subsets by either including or excluding each element.',
    example: 'Input: arr = [1, 2, 3]\nOutput: [[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]\nExplanation: Each element can be either included or excluded, giving 2ⁿ subsets.',
    intuition: 'For each element, we make a recursive choice: either include it in the current subset or exclude it. This creates a binary decision tree with 2ⁿ leaves.',
    steps: [
      {
        title: 'Start with empty subset',
        description: 'Call helper(arr, 0, []). Index = 0, current subset = [].',
        why: 'We start at index 0 with an empty subset. At each step, we branch on including or excluding the current element.',
        animations: [
          { type: 'showVariable', target: 'index', value: 0, label: 'Index = 0 (element 1)', color: '#3B82F6' },
          { type: 'showVariable', target: 'subset', value: '[]', label: 'Current subset', color: '#6B7280' },
          { type: 'showText', value: 'Decision for element 1: include or exclude?', color: '#EAB308' },
        ],
      },
      {
        title: 'Exclude 1 branch',
        description: 'First branch: exclude 1. Recurse to index 1 with subset [].',
        why: 'We explore the "exclude" branch first. The element is simply skipped.',
        animations: [
          { type: 'showVariable', target: 'subset', value: '[]', label: 'Excluded 1', color: '#F97316' },
          { type: 'moveArrow', from: 0, to: 1, color: '#3B82F6', label: 'index = 1' },
        ],
      },
      {
        title: 'Exclude 2, Exclude 3',
        description: 'Continue excluding: index 2 (element 3), then base case. Add [] to result.',
        why: 'When index reaches the array length, we have formed a complete subset and add it to the result.',
        animations: [
          { type: 'showText', value: 'Reached end. Add subset: []', color: '#22C55E' },
          { type: 'insert', target: 'result', value: '[]', color: '#22C55E', label: 'Added []' },
        ],
      },
      {
        title: 'Backtrack and include 3',
        description: 'Backtrack to index 2 (element 3). Now include 3: subset = [3]. Recurse to end, add [3].',
        why: 'After the "exclude" branch finishes, we backtrack and try the "include" branch.',
        animations: [
          { type: 'showText', value: 'Include 3: subset becomes [3]', color: '#F97316' },
          { type: 'insert', target: 'result', value: '[3]', color: '#22C55E', label: 'Added [3]' },
          { type: 'showVariable', target: 'subset', value: '[3]', color: '#F97316' },
        ],
      },
      {
        title: 'Backtrack and include 2',
        description: 'Backtrack to index 1 (element 2). Include 2: subset = [2]. Recurse to index 2.',
        why: 'Backtracking restores the subset to its state before the previous branch, enabling the next path.',
        animations: [
          { type: 'showText', value: 'Include 2: subset becomes [2]', color: '#F97316' },
          { type: 'showVariable', target: 'subset', value: '[2]', color: '#F97316' },
        ],
      },
      {
        title: 'From [2], exclude 3 and include 3',
        description: 'Exclude 3: add [2]. Include 3: add [2, 3].',
        animations: [
          { type: 'insert', target: 'result', value: '[2]', color: '#22C55E', label: 'Added [2]' },
          { type: 'insert', target: 'result', value: '[2,3]', color: '#22C55E', label: 'Added [2,3]' },
        ],
      },
      {
        title: 'Backtrack and include 1',
        description: 'Backtrack to index 0. Include 1: subset = [1]. Recurse through indices 1, 2.',
        why: 'Now we explore the entire subtree where element 1 is included.',
        animations: [
          { type: 'showText', value: 'Include 1: subset becomes [1]', color: '#F97316' },
          { type: 'showVariable', target: 'subset', value: '[1]', color: '#F97316' },
        ],
      },
      {
        title: 'Generate subsets with 1 included',
        description: 'From [1]: exclude 2,3 → [1]; include 3 → [1,3]. Include 2: [1,2]; include 3: [1,2,3].',
        why: 'All combinations starting with 1 are generated: [1], [1,2], [1,3], [1,2,3].',
        animations: [
          { type: 'insert', target: 'result', value: '[1]', color: '#22C55E', label: 'Added [1]' },
          { type: 'insert', target: 'result', value: '[1,2]', color: '#22C55E', label: 'Added [1,2]' },
          { type: 'insert', target: 'result', value: '[1,3]', color: '#22C55E', label: 'Added [1,3]' },
          { type: 'insert', target: 'result', value: '[1,2,3]', color: '#22C55E', label: 'Added [1,2,3]' },
        ],
      },
      {
        title: 'All subsets generated',
        description: 'Done. All 8 subsets: [[], [3], [2], [2,3], [1], [1,3], [1,2], [1,2,3]].',
        why: 'The recursion tree has 2ⁿ leaves, one for each subset. Total subsets = 2ⁿ.',
        animations: [
          { type: 'showText', value: 'Generated 2^3 = 8 subsets', color: '#22C55E' },
          { type: 'glow', target: 'final', color: '#22C55E', label: 'Power set complete!' },
        ],
      },
    ],
    pseudocode: [
      'function subsets(arr):',
      '  result = []',
      '  helper(arr, 0, [], result)',
      '  return result',
      '',
      'function helper(arr, index, current, result):',
      '  if index == arr.length:',
      '    result.add(current.copy())',
      '    return',
      '  // exclude current element',
      '  helper(arr, index + 1, current, result)',
      '  // include current element',
      '  current.add(arr[index])',
      '  helper(arr, index + 1, current, result)',
      '  current.removeLast()  // backtrack',
    ],
    code: {
      cpp: `void helper(vector<int>& arr, int idx, vector<int>& curr, vector<vector<int>>& res) {
  if (idx == arr.size()) {
    res.push_back(curr);
    return;
  }
  // exclude
  helper(arr, idx + 1, curr, res);
  // include
  curr.push_back(arr[idx]);
  helper(arr, idx + 1, curr, res);
  curr.pop_back(); // backtrack
}

vector<vector<int>> subsets(vector<int>& arr) {
  vector<vector<int>> res;
  vector<int> curr;
  helper(arr, 0, curr, res);
  return res;
}`,
      javascript: `function subsets(arr) {
  const result = [];
  function helper(idx, curr) {
    if (idx === arr.length) {
      result.push([...curr]);
      return;
    }
    // exclude
    helper(idx + 1, curr);
    // include
    curr.push(arr[idx]);
    helper(idx + 1, curr);
    curr.pop(); // backtrack
  }
  helper(0, []);
  return result;
}`,
    },
    complexity: { time: 'O(n × 2ⁿ)', space: 'O(n)' },
    commonMistakes: [
      'Forgetting to make a copy of the current subset before adding to result',
      'Not backtracking (popping) after the include branch, corrupting subsequent branches',
      'Using pass-by-reference incorrectly in C++ — modifying the same vector across branches',
    ],
    tips: [
      'The order of include/exclude does not matter, but be consistent',
      'Use a bitmask approach for an iterative O(1) extra space solution',
      'For arrays with duplicates, sort first and skip duplicates during recursion',
    ],
    inputExample: { array: [1, 2, 3] },
  },
]
