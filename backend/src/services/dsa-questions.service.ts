export interface DSAQuestion {
  id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  topic: string
  level: number
  problem: string
  example?: string
  intuition: string
  pseudocode: string[]
  code: { cpp: string; javascript: string }
  complexity: { time: string; space: string }
  commonMistakes: string[]
  tips: string[]
}

export interface DSALevel {
  level: number
  name: string
  rating: number
  topics: {
    name: string
    questions: string[]
  }[]
}

const LEVELS: DSALevel[] = [
  { level: 1, name: 'Must Know', rating: 5, topics: [
    { name: 'Arrays', questions: ['reverse-array', 'max-min', 'second-largest', 'remove-duplicates', 'rotate-array', 'move-zeroes', 'merge-sorted-arrays', 'find-missing-number', 'two-sum', 'kadanes-algorithm'] },
    { name: 'Strings', questions: ['reverse-string', 'palindrome', 'count-characters', 'count-vowels', 'check-anagram', 'remove-duplicate-chars', 'reverse-words', 'longest-common-prefix', 'first-unique-character', 'string-compression'] },
    { name: 'Loops & Math', questions: ['fibonacci', 'factorial', 'prime-number', 'armstrong-number', 'palindrome-number', 'gcd', 'lcm', 'power-function', 'sum-of-digits', 'reverse-number'] },
  ]},
  { level: 2, name: 'Very Common', rating: 5, topics: [
    { name: 'Searching', questions: ['linear-search', 'binary-search', 'first-occurrence', 'last-occurrence', 'search-in-sorted-array'] },
    { name: 'Sorting', questions: ['bubble-sort', 'selection-sort', 'insertion-sort', 'merge-sort', 'quick-sort'] },
    { name: 'Recursion', questions: ['recursive-factorial', 'recursive-fibonacci', 'recursive-reverse-string', 'recursive-binary-search', 'generate-subsets'] },
  ]},
  { level: 3, name: 'Most Asked DSA', rating: 4, topics: [
    { name: 'Linked List', questions: ['reverse-linked-list', 'detect-loop', 'find-middle-node', 'merge-two-lists', 'delete-node'] },
    { name: 'Stack', questions: ['valid-parentheses', 'min-stack', 'next-greater-element', 'evaluate-postfix', 'balanced-parentheses'] },
    { name: 'Queue', questions: ['queue-using-stack', 'stack-using-queue', 'circular-queue'] },
    { name: 'HashMap', questions: ['two-sum-hashmap', 'frequency-counter', 'first-non-repeating-char', 'group-anagrams', 'contains-duplicate'] },
  ]},
  { level: 4, name: 'Trees', rating: 4, topics: [
    { name: 'Binary Trees', questions: ['tree-traversals', 'height-of-tree', 'balanced-tree', 'lowest-common-ancestor', 'level-order-traversal', 'bst-search', 'insert-into-bst'] },
  ]},
  { level: 5, name: 'Dynamic Programming', rating: 3, topics: [
    { name: 'DP Basics', questions: ['climbing-stairs', 'house-robber', 'coin-change', 'longest-increasing-subsequence', 'maximum-subarray'] },
  ]},
]

class DSAQuestionsService {
  private questions: Map<string, DSAQuestion> = new Map()

  constructor() {
    this.seedQuestions()
  }

  private seedQuestions() {
    const questions: DSAQuestion[] = [
      {
        id: 'two-sum',
        title: 'Two Sum',
        difficulty: 'Easy',
        topic: 'Arrays',
        level: 1,
        problem: 'Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.',
        example: 'Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: nums[0] + nums[1] = 2 + 7 = 9',
        intuition: 'Use a hash map to store each number\'s index as you iterate. For each number, check if target - number exists in the map.',
        pseudocode: [
          'Create empty hash map',
          'For each element at index i:',
          '  complement = target - nums[i]',
          '  If complement exists in map:',
          '    Return [map[complement], i]',
          '  Store nums[i] -> i in map',
          'Return [] if no solution',
        ],
        code: {
          cpp: 'vector<int> twoSum(vector<int>& nums, int target) {\n  unordered_map<int, int> mp;\n  for (int i = 0; i < nums.size(); i++) {\n    int complement = target - nums[i];\n    if (mp.count(complement))\n      return {mp[complement], i};\n    mp[nums[i]] = i;\n  }\n  return {};\n}',
          javascript: 'var twoSum = function(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement))\n      return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n  return [];\n};',
        },
        complexity: { time: 'O(n) - single pass through the array', space: 'O(n) - hash map stores up to n elements' },
        commonMistakes: ['Using the same element twice', 'Returning indices in wrong order', 'Not handling no-solution case'],
        tips: ['hash map lookup is O(1) average', 'Only one valid answer exists per problem statement', 'Return indices, not values'],
      },
      {
        id: 'binary-search',
        title: 'Binary Search',
        difficulty: 'Easy',
        topic: 'Searching',
        level: 2,
        problem: 'Given a sorted array of integers and a target value, return the index of the target if found, or -1 otherwise.',
        example: 'Input: nums = [-1,0,3,5,9,12], target = 9\nOutput: 4',
        intuition: 'Repeatedly divide the search interval in half. Compare the middle element with the target and eliminate the half that cannot contain the target.',
        pseudocode: [
          'left = 0, right = n - 1',
          'While left <= right:',
          '  mid = left + (right - left) / 2',
          '  If nums[mid] == target: return mid',
          '  If nums[mid] < target: left = mid + 1',
          '  Else: right = mid - 1',
          'Return -1',
        ],
        code: {
          cpp: 'int binarySearch(vector<int>& nums, int target) {\n  int left = 0, right = nums.size() - 1;\n  while (left <= right) {\n    int mid = left + (right - left) / 2;\n    if (nums[mid] == target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}',
          javascript: 'var search = function(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    const mid = left + Math.floor((right - left) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n};',
        },
        complexity: { time: 'O(log n) - halves the search space each iteration', space: 'O(1) - constant extra space' },
        commonMistakes: ['Off-by-one errors in boundary conditions', 'Integer overflow when computing mid', 'Forgetting array must be sorted'],
        tips: ['Use mid = left + (right - left) / 2 to avoid overflow', 'While condition is left <= right for inclusive bounds', 'Always update left or right to mid +/- 1'],
      },
      {
        id: 'bubble-sort',
        title: 'Bubble Sort',
        difficulty: 'Easy',
        topic: 'Sorting',
        level: 2,
        problem: 'Sort an array of integers in ascending order using Bubble Sort.',
        example: 'Input: [64, 34, 25, 12, 22, 11, 90]\nOutput: [11, 12, 22, 25, 34, 64, 90]',
        intuition: 'Repeatedly step through the array, compare adjacent elements, and swap them if they are in the wrong order. Larger elements "bubble up" to the end.',
        pseudocode: [
          'For i = 0 to n-1:',
          '  For j = 0 to n-i-2:',
          '    If arr[j] > arr[j+1]:',
          '      Swap arr[j] and arr[j+1]',
          'Return arr',
        ],
        code: {
          cpp: 'void bubbleSort(vector<int>& arr) {\n  int n = arr.size();\n  for (int i = 0; i < n - 1; i++) {\n    bool swapped = false;\n    for (int j = 0; j < n - i - 1; j++) {\n      if (arr[j] > arr[j + 1]) {\n        swap(arr[j], arr[j + 1]);\n        swapped = true;\n      }\n    }\n    if (!swapped) break;\n  }\n}',
          javascript: 'function bubbleSort(arr) {\n  const n = arr.length;\n  for (let i = 0; i < n - 1; i++) {\n    let swapped = false;\n    for (let j = 0; j < n - i - 1; j++) {\n      if (arr[j] > arr[j + 1]) {\n        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n        swapped = true;\n      }\n    }\n    if (!swapped) break;\n  }\n  return arr;\n}',
        },
        complexity: { time: 'O(n^2) worst/avg, O(n) best when already sorted', space: 'O(1) in-place' },
        commonMistakes: ['Wrong inner loop boundary causing out-of-bounds', 'Not optimizing with swapped flag', 'Using > instead of < for wrong order'],
        tips: ['Optimize by breaking early if no swaps occurred', 'After i passes, the last i elements are in place', 'Simple but inefficient for large datasets'],
      },
      {
        id: 'valid-parentheses',
        title: 'Valid Parentheses',
        difficulty: 'Easy',
        topic: 'Stack',
        level: 3,
        problem: 'Given a string containing just the characters (), {}, [], determine if it is valid. A string is valid if brackets close in the correct order.',
        example: 'Input: "({[]})"\nOutput: true\nInput: "([)]"\nOutput: false',
        intuition: 'Use a stack. When seeing an opening bracket, push it. When seeing a closing bracket, check if it matches the top of the stack.',
        pseudocode: [
          'Create empty stack',
          'For each char in string:',
          '  If char is opening bracket: push to stack',
          '  Else (closing bracket):',
          '    If stack empty: return false',
          '    Pop top and check if it matches char',
          '    If not match: return false',
          'Return stack empty (true)',
        ],
        code: {
          cpp: 'bool isValid(string s) {\n  stack<char> st;\n  for (char c : s) {\n    if (c == \'(\' || c == \'{\' || c == \'[\')\n      st.push(c);\n    else {\n      if (st.empty()) return false;\n      char top = st.top(); st.pop();\n      if ((c == \')\' && top != \'(\') ||\n          (c == \'}\' && top != \'{\') ||\n          (c == \']\' && top != \'[\'))\n        return false;\n    }\n  }\n  return st.empty();\n}',
          javascript: 'var isValid = function(s) {\n  const stack = [];\n  const map = {")":"(", "}":"{", "]":"["};\n  for (const c of s) {\n    if (c === "(" || c === "{" || c === "[")\n      stack.push(c);\n    else {\n      if (stack.pop() !== map[c])\n        return false;\n    }\n  }\n  return stack.length === 0;\n};',
        },
        complexity: { time: 'O(n) - single pass', space: 'O(n) - stack can hold up to n brackets' },
        commonMistakes: ['Using stack.pop() when stack is empty', 'Not checking bracket type match', 'Forgetting to check if stack is empty at end'],
        tips: ['Use a hash map to pair brackets for cleaner code', 'The stack should be empty for a valid string', 'Length is always even for valid brackets'],
      },
      {
        id: 'climbing-stairs',
        title: 'Climbing Stairs',
        difficulty: 'Easy',
        topic: 'Dynamic Programming',
        level: 5,
        problem: 'You are climbing a staircase with n steps. Each time you can climb 1 or 2 steps. Find the number of distinct ways to reach the top.',
        example: 'Input: n = 3\nOutput: 3\nExplanation: (1+1+1), (1+2), (2+1)',
        intuition: 'This is the Fibonacci sequence. To reach step i, you can come from step i-1 (1 step) or step i-2 (2 steps). So dp[i] = dp[i-1] + dp[i-2].',
        pseudocode: [
          'If n <= 2: return n',
          'Initialize dp[1] = 1, dp[2] = 2',
          'For i = 3 to n:',
          '  dp[i] = dp[i-1] + dp[i-2]',
          'Return dp[n]',
        ],
        code: {
          cpp: 'int climbStairs(int n) {\n  if (n <= 2) return n;\n  vector<int> dp(n + 1);\n  dp[1] = 1; dp[2] = 2;\n  for (int i = 3; i <= n; i++)\n    dp[i] = dp[i - 1] + dp[i - 2];\n  return dp[n];\n}',
          javascript: 'var climbStairs = function(n) {\n  if (n <= 2) return n;\n  let prev1 = 1, prev2 = 2;\n  for (let i = 3; i <= n; i++) {\n    const curr = prev1 + prev2;\n    prev1 = prev2;\n    prev2 = curr;\n  }\n  return prev2;\n};',
        },
        complexity: { time: 'O(n) - single loop', space: 'O(1) with space optimization, O(n) with DP array' },
        commonMistakes: ['Forgetting base cases for n = 1 and n = 2', 'Starting DP array at wrong index', 'Using recursion without memoization (exponential)'],
        tips: ['Space can be optimized to O(1) using two variables', 'This is exactly the Fibonacci sequence shifted by 1', 'Think in terms of subproblems - how many ways to reach step i'],
      },
      {
        id: 'reverse-linked-list',
        title: 'Reverse Linked List',
        difficulty: 'Easy',
        topic: 'Linked List',
        level: 3,
        problem: 'Given the head of a singly linked list, reverse the list and return the new head.',
        example: 'Input: 1 -> 2 -> 3 -> 4 -> 5\nOutput: 5 -> 4 -> 3 -> 2 -> 1',
        intuition: 'Iteratively reverse the pointers. Keep track of previous, current, and next nodes. Point current.next to previous and move forward.',
        pseudocode: [
          'prev = null, curr = head',
          'While curr is not null:',
          '  nextTemp = curr.next',
          '  curr.next = prev',
          '  prev = curr',
          '  curr = nextTemp',
          'Return prev (new head)',
        ],
        code: {
          cpp: 'ListNode* reverseList(ListNode* head) {\n  ListNode* prev = nullptr;\n  ListNode* curr = head;\n  while (curr) {\n    ListNode* nextTemp = curr->next;\n    curr->next = prev;\n    prev = curr;\n    curr = nextTemp;\n  }\n  return prev;\n}',
          javascript: 'var reverseList = function(head) {\n  let prev = null;\n  let curr = head;\n  while (curr) {\n    const nextTemp = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = nextTemp;\n  }\n  return prev;\n};',
        },
        complexity: { time: 'O(n) - single pass through the list', space: 'O(1) - iterative, constant extra space' },
        commonMistakes: ['Losing reference to the rest of the list', 'Forgetting to return the new head', 'Not handling empty list case'],
        tips: ['Always save curr.next before overwriting it', 'Draw the pointer changes on paper first', 'The new head is the last node of the original list'],
      },
      {
        id: 'reverse-array',
        title: 'Reverse an Array',
        difficulty: 'Easy',
        topic: 'Arrays',
        level: 1,
        problem: 'Given an array, reverse its elements in-place.',
        example: 'Input: [1, 2, 3, 4, 5]\nOutput: [5, 4, 3, 2, 1]',
        intuition: 'Use two pointers: one at the start and one at the end. Swap elements and move pointers toward the center.',
        pseudocode: [
          'left = 0, right = n - 1',
          'While left < right:',
          '  Swap arr[left] and arr[right]',
          '  left++, right--',
        ],
        code: {
          cpp: 'void reverseArray(vector<int>& arr) {\n  int left = 0, right = arr.size() - 1;\n  while (left < right) {\n    swap(arr[left], arr[right]);\n    left++; right--;\n  }\n}',
          javascript: 'function reverseArray(arr) {\n  let left = 0, right = arr.length - 1;\n  while (left < right) {\n    [arr[left], arr[right]] = [arr[right], arr[left]];\n    left++; right--;\n  }\n  return arr;\n}',
        },
        complexity: { time: 'O(n) - processes each element once', space: 'O(1) - in-place' },
        commonMistakes: ['Using extra array instead of in-place', 'Off-by-one in while condition', 'Not handling empty array'],
        tips: ['Two-pointer technique is fundamental for many problems', 'Works for both arrays and strings', 'Middle element stays in place for odd-length arrays'],
      },
    ]

    for (const q of questions) {
      this.questions.set(q.id, q)
    }
  }

  getAll(): DSAQuestion[] {
    return Array.from(this.questions.values())
  }

  getById(id: string): DSAQuestion | undefined {
    return this.questions.get(id)
  }

  getByLevel(level: number): DSAQuestion[] {
    return this.getAll().filter(q => q.level === level)
  }

  getByTopic(topic: string): DSAQuestion[] {
    return this.getAll().filter(q => q.topic.toLowerCase() === topic.toLowerCase())
  }

  getLevels(): DSALevel[] {
    return LEVELS
  }

  getSearchSuggestions(query: string): DSAQuestion[] {
    const q = query.toLowerCase()
    return this.getAll().filter(
      question =>
        question.id.includes(q) ||
        question.title.toLowerCase().includes(q) ||
        question.topic.toLowerCase().includes(q)
    )
  }
}

export const dsaQuestionsService = new DSAQuestionsService()
