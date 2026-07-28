import type { QuestionData } from '../types'

export const level5Questions: QuestionData[] = [
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    topic: 'Dynamic Programming',
    level: 5,
    problem: 'You are climbing a staircase with n steps. You can take either 1 step or 2 steps at a time. In how many distinct ways can you reach the top?',
    example: 'Input: n = 4\nOutput: 5\nExplanation: There are 5 ways: (1,1,1,1), (1,1,2), (1,2,1), (2,1,1), (2,2).',
    intuition: 'This is the Fibonacci sequence in disguise. To reach step i, you must have come from step i-1 (taking 1 step) or step i-2 (taking 2 steps). So ways[i] = ways[i-1] + ways[i-2].',
    steps: [
      {
        title: 'Base cases',
        description: 'ways[0] = 1 (one way to stand at ground), ways[1] = 1 (one way: take 1 step).',
        why: 'The recurrence needs two base cases. ways[0]=1 is a convention: there is exactly 1 way to be at step 0 (do nothing).',
        animations: [
          { type: 'showTable', data: { type: 'dp-table', rows: 1, cols: 5, headers: ['i=0', 'i=1', 'i=2', 'i=3', 'i=4'], values: [['1', '1', '-', '-', '-']] } },
          { type: 'showVariable', target: 'ways[0]', value: 1, label: 'ways[0] = 1', color: '#3B82F6' },
          { type: 'showVariable', target: 'ways[1]', value: 1, label: 'ways[1] = 1', color: '#3B82F6' },
          { type: 'highlightCode', value: 'dp[0] = 1; dp[1] = 1;', color: '#EAB308' },
        ],
      },
      {
        title: 'Compute ways[2]',
        description: 'ways[2] = ways[1] + ways[0] = 1 + 1 = 2. Two ways: (1,1) and (2).',
        why: 'From step 2, you can come from step 1 (take 1 step) or step 0 (take 2 steps).',
        animations: [
          { type: 'highlight', target: 'i=2', value: 'i=2', color: '#F97316', label: 'Computing ways[2]' },
          { type: 'compare', target: 'ways[1]', value: 1, color: '#EAB308', label: 'ways[1] = 1' },
          { type: 'compare', target: 'ways[0]', value: 1, color: '#EAB308', label: 'ways[0] = 1' },
          { type: 'updateVariable', target: 'ways[2]', value: 2, label: 'ways[2] = 1 + 1 = 2', color: '#22C55E' },
          { type: 'updateVariable', target: 'dp[2]', value: 2, label: 'ways[2] = 2', color: '#22C55E' },
        ],
      },
      {
        title: 'Compute ways[3]',
        description: 'ways[3] = ways[2] + ways[1] = 2 + 1 = 3. Three ways to reach step 3.',
        why: 'From step 3, you can come from step 2 (1 step) or step 1 (2 steps).',
        animations: [
          { type: 'highlight', target: 'i=3', value: 'i=3', color: '#F97316', label: 'Computing ways[3]' },
          { type: 'compare', target: 'ways[2]', value: 2, color: '#EAB308', label: 'ways[2] = 2' },
          { type: 'compare', target: 'ways[1]', value: 1, color: '#EAB308', label: 'ways[1] = 1' },
          { type: 'updateVariable', target: 'ways[3]', value: 3, label: 'ways[3] = 2 + 1 = 3', color: '#22C55E' },
        ],
      },
      {
        title: 'Compute ways[4]',
        description: 'ways[4] = ways[3] + ways[2] = 3 + 2 = 5. This is our answer.',
        why: 'The same recurrence applies. ways[4] is the final answer for n=4.',
        animations: [
          { type: 'highlight', target: 'i=4', value: 'i=4', color: '#F97316', label: 'Computing ways[4]' },
          { type: 'compare', target: 'ways[3]', value: 3, color: '#EAB308', label: 'ways[3] = 3' },
          { type: 'compare', target: 'ways[2]', value: 2, color: '#EAB308', label: 'ways[2] = 2' },
          { type: 'updateVariable', target: 'ways[4]', value: 5, label: 'ways[4] = 3 + 2 = 5', color: '#22C55E' },
          { type: 'glow', target: 'i=4', value: '5', color: '#22C55E', label: 'Answer: 5 ways' },
        ],
      },
      {
        title: 'Result',
        description: 'There are 5 distinct ways to climb 4 steps using 1 or 2 step moves.',
        animations: [
          { type: 'showText', value: 'Final Answer: 5 ways to climb 4 steps', color: '#22C55E' },
          { type: 'showTable', data: { type: 'dp-table', rows: 1, cols: 5, headers: ['i=0', 'i=1', 'i=2', 'i=3', 'i=4'], values: [['1', '1', '2', '3', '5']], highlight: [4] } },
          { type: 'pulse', target: 'ways[4]', value: 5, color: '#22C55E' },
        ],
      },
    ],
    pseudocode: [
      'function climbStairs(n):',
      '  if n <= 1: return 1',
      '  dp = array of size n+1',
      '  dp[0] = 1, dp[1] = 1',
      '  for i = 2 to n:',
      '    dp[i] = dp[i-1] + dp[i-2]',
      '  return dp[n]',
    ],
    code: {
      cpp: `int climbStairs(int n) {
  if (n <= 1) return 1;
  vector<int> dp(n + 1);
  dp[0] = dp[1] = 1;
  for (int i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}`,
      javascript: `function climbStairs(n) {
  if (n <= 1) return 1;
  const dp = new Array(n + 1);
  dp[0] = dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}`,
    },
    complexity: { time: 'O(n)', space: 'O(n)' },
    commonMistakes: [
      'Using dp[0] = 0 instead of dp[0] = 1 (there is 1 way to be at step 0)',
      'Off-by-one: iterating i from 1 instead of starting at 2',
      'Forgetting to handle n = 0 or n = 1 as edge cases',
    ],
    tips: [
      'Space can be optimized to O(1) using two variables (Fibonacci-style)',
      'The answer grows exponentially — use 64-bit integers for large n',
      'This is the classic "1D DP" introductory problem',
    ],
    inputExample: { n: 4 },
  },
  {
    id: 'house-robber',
    title: 'House Robber',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    level: 5,
    problem: 'You are a robber planning to rob houses along a street. Each house has a certain amount of money. Adjacent houses have security systems that alert police if two adjacent houses are robbed. Find the maximum amount you can rob without alerting police.',
    example: 'Input: nums = [2, 7, 9, 3, 1]\nOutput: 12\nExplanation: Rob houses at indices 0 (2), 2 (9), 4 (1) = 12. Or rob index 1 (7) and 3 (3) = 10. Max is 12.',
    intuition: 'At each house i, we decide: either rob it (take nums[i] + dp[i-2]) or skip it (keep dp[i-1]). The recurrence is dp[i] = max(dp[i-1], nums[i] + dp[i-2]).',
    steps: [
      {
        title: 'Base cases',
        description: 'dp[0] = nums[0] = 2. dp[1] = max(nums[0], nums[1]) = max(2, 7) = 7.',
        why: 'With one house, we must rob it. With two houses, we can only rob the richer one (can\'t rob both adjacent).',
        animations: [
          { type: 'showTable', data: { type: 'dp-table', rows: 1, cols: 5, headers: ['0:2', '1:7', '2:9', '3:3', '4:1'], values: [['2', '7', '-', '-', '-']] } },
          { type: 'showVariable', target: 'dp[0]', value: 2, label: 'dp[0] = 2', color: '#3B82F6' },
          { type: 'updateVariable', target: 'dp[1]', value: 7, label: 'dp[1] = max(2,7) = 7', color: '#22C55E' },
          { type: 'highlightCode', value: 'dp[0] = nums[0]; dp[1] = max(nums[0], nums[1]);', color: '#EAB308' },
        ],
      },
      {
        title: 'Process house 2 (value 9)',
        description: 'dp[2] = max(dp[1], nums[2] + dp[0]) = max(7, 9 + 2) = max(7, 11) = 11.',
        why: 'Either skip house 2 (keep dp[1]=7) or rob it (9 + best 2 houses ago = 9 + 2 = 11).',
        animations: [
          { type: 'highlight', target: '2:9', value: 'i=2', color: '#F97316', label: 'House 2 (value=9)' },
          { type: 'compare', target: 'dp[1]', value: 7, color: '#EAB308', label: 'Skip: dp[1] = 7' },
          { type: 'compare', target: 'nums[2]+dp[0]', value: 11, color: '#EAB308', label: 'Rob: 9 + dp[0] = 11' },
          { type: 'updateVariable', target: 'dp[2]', value: 11, label: 'dp[2] = max(7, 11) = 11', color: '#22C55E' },
        ],
      },
      {
        title: 'Process house 3 (value 3)',
        description: 'dp[3] = max(dp[2], nums[3] + dp[1]) = max(11, 3 + 7) = max(11, 10) = 11.',
        why: 'Robing house 3 gives 3 + dp[1] = 10, which is less than skipping it (dp[2] = 11).',
        animations: [
          { type: 'highlight', target: '3:3', value: 'i=3', color: '#F97316', label: 'House 3 (value=3)' },
          { type: 'compare', target: 'dp[2]', value: 11, color: '#EAB308', label: 'Skip: dp[2] = 11' },
          { type: 'compare', target: 'nums[3]+dp[1]', value: 10, color: '#EAB308', label: 'Rob: 3 + dp[1] = 10' },
          { type: 'updateVariable', target: 'dp[3]', value: 11, label: 'dp[3] = max(11, 10) = 11', color: '#22C55E' },
        ],
      },
      {
        title: 'Process house 4 (value 1)',
        description: 'dp[4] = max(dp[3], nums[4] + dp[2]) = max(11, 1 + 11) = max(11, 12) = 12.',
        why: 'Robing house 4 (1) + dp[2] (11) = 12 beats skipping it (dp[3] = 11).',
        animations: [
          { type: 'highlight', target: '4:1', value: 'i=4', color: '#F97316', label: 'House 4 (value=1)' },
          { type: 'compare', target: 'dp[3]', value: 11, color: '#EAB308', label: 'Skip: dp[3] = 11' },
          { type: 'compare', target: 'nums[4]+dp[2]', value: 12, color: '#EAB308', label: 'Rob: 1 + dp[2] = 12' },
          { type: 'updateVariable', target: 'dp[4]', value: 12, label: 'dp[4] = max(11, 12) = 12', color: '#22C55E' },
        ],
      },
      {
        title: 'Result',
        description: 'Maximum amount that can be robbed is dp[4] = 12. Optimal: rob houses 0, 2, 4 (2+9+1=12).',
        animations: [
          { type: 'showText', value: 'Maximum loot: 12', color: '#22C55E' },
          { type: 'showTable', data: { type: 'dp-table', rows: 1, cols: 5, headers: ['0:2', '1:7', '2:9', '3:3', '4:1'], values: [['2', '7', '11', '11', '12']], highlight: [4] } },
          { type: 'glow', target: 'dp[4]', value: 12, color: '#22C55E', label: 'Optimal: 12' },
          { type: 'pulse', target: 'result', value: 12, color: '#22C55E' },
        ],
      },
    ],
    pseudocode: [
      'function rob(nums):',
      '  if nums.length == 0: return 0',
      '  if nums.length == 1: return nums[0]',
      '  dp = array of size n',
      '  dp[0] = nums[0]',
      '  dp[1] = max(nums[0], nums[1])',
      '  for i = 2 to n-1:',
      '    dp[i] = max(dp[i-1], nums[i] + dp[i-2])',
      '  return dp[n-1]',
    ],
    code: {
      cpp: `int rob(vector<int>& nums) {
  int n = nums.size();
  if (n == 0) return 0;
  if (n == 1) return nums[0];
  vector<int> dp(n);
  dp[0] = nums[0];
  dp[1] = max(nums[0], nums[1]);
  for (int i = 2; i < n; i++) {
    dp[i] = max(dp[i - 1], nums[i] + dp[i - 2]);
  }
  return dp[n - 1];
}`,
      javascript: `function rob(nums) {
  const n = nums.length;
  if (n === 0) return 0;
  if (n === 1) return nums[0];
  const dp = new Array(n);
  dp[0] = nums[0];
  dp[1] = Math.max(nums[0], nums[1]);
  for (let i = 2; i < n; i++) {
    dp[i] = Math.max(dp[i - 1], nums[i] + dp[i - 2]);
  }
  return dp[n - 1];
}`,
    },
    complexity: { time: 'O(n)', space: 'O(n)' },
    commonMistakes: [
      'Starting with dp[0] = 0 and dp[1] = nums[0], which shifts the recurrence',
      'Only considering robbing every other house (greedy) instead of DP',
      'Forgetting to handle arrays of length 0 or 1',
    ],
    tips: [
      'Space can be optimized to O(1) with two variables (prev2, prev1)',
      'The same problem extends to circular houses (House Robber II)',
      'The decision at each step is: rob or skip — classic DP trade-off',
    ],
    inputExample: { nums: [2, 7, 9, 3, 1] },
  },
  {
    id: 'coin-change',
    title: 'Coin Change (Fewest Coins)',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    level: 5,
    problem: 'Given an array of coin denominations (unlimited supply of each) and a target amount, find the minimum number of coins needed to make that amount. If impossible, return -1.',
    example: 'Input: coins = [1, 2, 5], amount = 11\nOutput: 3\nExplanation: 11 = 5 + 5 + 1 (3 coins). Alternative: 5 + 2 + 2 + 1 + 1 (5 coins) is worse.',
    intuition: 'DP where dp[i] = minimum coins to make amount i. For each coin c, dp[i] = min(dp[i], dp[i-c] + 1). We build up from 0 to the target amount.',
    steps: [
      {
        title: 'Initialize DP array',
        description: 'dp[0] = 0 (0 coins to make amount 0). Initialize dp[1..11] = infinity.',
        why: 'We start from the base case (amount 0) and compute upward. Infinity represents "unreachable" amounts.',
        animations: [
          { type: 'showTable', data: { type: 'dp-table', rows: 1, cols: 12, headers: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'], values: [['0', '∞', '∞', '∞', '∞', '∞', '∞', '∞', '∞', '∞', '∞', '∞']] } },
          { type: 'showVariable', target: 'dp[0]', value: 0, label: 'dp[0] = 0', color: '#3B82F6' },
          { type: 'highlightCode', value: 'dp[0] = 0; for i = 1..amount: dp[i] = INF', color: '#EAB308' },
        ],
      },
      {
        title: 'Process coin 1',
        description: 'For coin=1, update all amounts from 1 to 11: dp[i] = min(dp[i], dp[i-1] + 1). After coin 1: dp[1]=1, dp[2]=2, ..., dp[11]=11.',
        why: 'Coin 1 can contribute to any amount. After this pass, every amount becomes reachable.',
        animations: [
          { type: 'showText', value: 'Using coin 1: update dp[1..11]', color: '#F97316' },
          { type: 'updateVariable', target: 'dp[1]', value: 1, label: 'dp[1] = min(∞, dp[0]+1) = 1', color: '#22C55E' },
          { type: 'updateVariable', target: 'dp[2]', value: 2, label: 'dp[2] = min(∞, dp[1]+1) = 2', color: '#EAB308' },
          { type: 'showText', value: 'After coin 1: [0,1,2,3,4,5,6,7,8,9,10,11]', color: '#6B7280' },
        ],
      },
      {
        title: 'Process coin 2',
        description: 'For coin=2, update dp[i] = min(dp[i], dp[i-2] + 1). i=2: dp[2]=min(2, dp[0]+1)=1. i=3: min(3, dp[1]+1)=2. Continue optimizing.',
        why: 'Coin 2 provides better combinations. For example, 2 = 1 coin of 2 instead of 2 coins of 1.',
        animations: [
          { type: 'showText', value: 'Using coin 2: optimize dp[2..11]', color: '#F97316' },
          { type: 'compare', target: 'dp[2]', value: 2, color: '#EAB308', label: 'dp[2]=2 vs dp[0]+1=1 → dp[2]=1' },
          { type: 'updateVariable', target: 'dp[2]', value: 1, label: 'dp[2] = 1 (coin 2)', color: '#22C55E' },
          { type: 'updateVariable', target: 'dp[3]', value: 2, label: 'dp[3] = min(3, dp[1]+1) = 2', color: '#22C55E' },
          { type: 'updateVariable', target: 'dp[4]', value: 2, label: 'dp[4] = min(4, dp[2]+1) = 2', color: '#22C55E' },
        ],
      },
      {
        title: 'Process coin 5',
        description: 'For coin=5, update dp[i] = min(dp[i], dp[i-5] + 1). Key: i=5: dp[5]=min(5, dp[0]+1)=1. i=10: dp[10]=min(10, dp[5]+1)=2. i=11: dp[11]=min(11, dp[6]+1)=3.',
        why: 'Large denominations reduce coin count significantly. 5+5+1=3 coins beats the previous best for 11.',
        animations: [
          { type: 'showText', value: 'Using coin 5: optimize dp[5..11]', color: '#F97316' },
          { type: 'updateVariable', target: 'dp[5]', value: 1, label: 'dp[5] = min(5, dp[0]+1) = 1', color: '#22C55E' },
          { type: 'updateVariable', target: 'dp[10]', value: 2, label: 'dp[10] = min(10, dp[5]+1) = 2', color: '#22C55E' },
          { type: 'compare', target: 'dp[11]', value: 11, color: '#EAB308', label: 'dp[11]=11 vs dp[6]+1=3 → dp[11]=3' },
          { type: 'updateVariable', target: 'dp[11]', value: 3, label: 'dp[11] = 3 (5+5+1)', color: '#22C55E' },
        ],
      },
      {
        title: 'Final result',
        description: 'dp[11] = 3. Minimum coins: three coins (5 + 5 + 1).',
        why: 'The DP table now contains the optimal solution for every amount up to 11.',
        animations: [
          { type: 'showTable', data: { type: 'dp-table', rows: 1, cols: 12, headers: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'], values: [['0', '1', '1', '2', '2', '1', '2', '2', '3', '3', '2', '3']], highlight: [11] } },
          { type: 'showText', value: 'Answer: 3 coins (5 + 5 + 1)', color: '#22C55E' },
          { type: 'glow', target: 'dp[11]', value: 3, color: '#22C55E', label: 'Minimum coins: 3' },
          { type: 'pulse', target: 'result', value: 3, color: '#22C55E' },
        ],
      },
    ],
    pseudocode: [
      'function coinChange(coins, amount):',
      '  dp = array of size amount+1, filled with INF',
      '  dp[0] = 0',
      '  for i = 1 to amount:',
      '    for each coin in coins:',
      '      if i >= coin:',
      '        dp[i] = min(dp[i], dp[i-coin] + 1)',
      '  return dp[amount] == INF ? -1 : dp[amount]',
    ],
    code: {
      cpp: `int coinChange(vector<int>& coins, int amount) {
  vector<int> dp(amount + 1, INT_MAX);
  dp[0] = 0;
  for (int i = 1; i <= amount; i++) {
    for (int coin : coins) {
      if (i >= coin && dp[i - coin] != INT_MAX) {
        dp[i] = min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] == INT_MAX ? -1 : dp[amount];
}`,
      javascript: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i >= coin) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
    },
    complexity: { time: 'O(amount * coins)', space: 'O(amount)' },
    commonMistakes: [
      'Forgetting to check if dp[i-coin] is reachable (not INF), leading to INT_MAX overflow',
      'Returning 0 instead of -1 when amount cannot be made',
      'Using greedy (largest coin first) — fails for denominations like [1, 3, 4], amount=6',
    ],
    tips: [
      'Unbounded knapsack pattern: each coin can be used unlimited times',
      'The outer loop should be over amounts (not coins) for this "minimum coins" variant',
      'If order of coins doesn\'t matter, this is the correct DP ordering',
    ],
    inputExample: { coins: [1, 2, 5], amount: 11 },
  },
  {
    id: 'longest-increasing-subsequence',
    title: 'Longest Increasing Subsequence',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    level: 5,
    problem: 'Given an array of integers, find the length of the longest strictly increasing subsequence. A subsequence is a sequence that can be derived by deleting some elements without changing the order of the remaining elements.',
    example: 'Input: nums = [10, 9, 2, 5, 3, 7, 101, 18]\nOutput: 4\nExplanation: The LIS is [2, 3, 7, 101] (or [2, 5, 7, 101]), length 4.',
    intuition: 'DP where dp[i] = length of LIS ending at index i. For each i, check all j < i: if nums[j] < nums[i], dp[i] = max(dp[i], dp[j] + 1). The answer is max(dp).',
    steps: [
      {
        title: 'Initialize DP',
        description: 'Each element is a length-1 subsequence by itself. Set all dp[i] = 1.',
        why: 'Every single element is a valid increasing subsequence of length 1.',
        animations: [
          { type: 'showTable', data: { type: 'dp-table', rows: 2, cols: 8, headers: ['10', '9', '2', '5', '3', '7', '101', '18'], values: [['1', '1', '1', '1', '1', '1', '1', '1'], ['', '', '', '', '', '', '', '']] } },
          { type: 'showText', value: 'Initialize: each element is its own subsequence of length 1', color: '#3B82F6' },
          { type: 'highlightCode', value: 'dp[i] = 1 for all i', color: '#EAB308' },
        ],
      },
      {
        title: 'Process i=1 (value 9)',
        description: 'Check j=0 (10). Is 10 < 9? No. dp[1] stays 1.',
        why: 'No preceding element is smaller than 9, so LIS ending at 9 is just [9].',
        animations: [
          { type: 'highlight', target: 'i=1', value: 'nums[1]=9', color: '#F97316', label: 'Processing index 1' },
          { type: 'compare', target: 'nums[0]=10', value: 10, color: '#EAB308', label: '10 < 9? No' },
          { type: 'showVariable', target: 'dp[1]', value: 1, label: 'dp[1] = 1', color: '#6B7280' },
        ],
      },
      {
        title: 'Process i=2 (value 2)',
        description: 'Check j=0 (10): 10<2? No. j=1 (9): 9<2? No. dp[2] stays 1.',
        animations: [
          { type: 'highlight', target: 'i=2', value: 'nums[2]=2', color: '#F97316', label: 'Processing index 2' },
          { type: 'compare', target: 'nums[0]=10', value: 10, color: '#EAB308', label: '10 < 2? No' },
          { type: 'compare', target: 'nums[1]=9', value: 9, color: '#EAB308', label: '9 < 2? No' },
          { type: 'showVariable', target: 'dp[2]', value: 1, label: 'dp[2] = 1', color: '#6B7280' },
        ],
      },
      {
        title: 'Process i=3 (value 5)',
        description: 'Check j=0 (10): No. j=1 (9): No. j=2 (2): 2<5, so dp[3] = max(1, dp[2]+1) = max(1, 2) = 2.',
        why: 'We can extend the subsequence ending at 2 (length 1) with 5 → [2, 5] length 2.',
        animations: [
          { type: 'highlight', target: 'i=3', value: 'nums[3]=5', color: '#F97316', label: 'Processing index 3' },
          { type: 'compare', target: 'nums[2]=2', value: 2, color: '#22C55E', label: '2 < 5, can extend!' },
          { type: 'updateVariable', target: 'dp[3]', value: 2, label: 'dp[3] = dp[2] + 1 = 2', color: '#22C55E' },
        ],
      },
      {
        title: 'Process i=4 (value 3)',
        description: 'Check j=2 (2): 2<3, dp[4] = max(1, dp[2]+1) = 2. j=3 (5): 5<3? No.',
        why: 'We can extend [2] with 3 → [2, 3] length 2. Cannot extend beyond 5.',
        animations: [
          { type: 'highlight', target: 'i=4', value: 'nums[4]=3', color: '#F97316', label: 'Processing index 4' },
          { type: 'compare', target: 'nums[2]=2', value: 2, color: '#22C55E', label: '2 < 3, dp[4] = 2' },
          { type: 'compare', target: 'nums[3]=5', value: 5, color: '#EAB308', label: '5 < 3? No' },
          { type: 'updateVariable', target: 'dp[4]', value: 2, label: 'dp[4] = 2', color: '#22C55E' },
        ],
      },
      {
        title: 'Process i=5 (value 7)',
        description: 'Check j=2 (2): 2<7, dp[5]=2. j=3 (5): 5<7, dp[5]=max(2, dp[3]+1)=3. j=4 (3): 3<7, dp[5]=max(3, dp[4]+1)=3.',
        why: 'Best is [2, 5, 7] via j=3 giving length 3. Also [2, 3, 7] via j=4.',
        animations: [
          { type: 'highlight', target: 'i=5', value: 'nums[5]=7', color: '#F97316', label: 'Processing index 5' },
          { type: 'compare', target: 'nums[3]=5', value: 5, color: '#22C55E', label: '5 < 7, dp[3]+1 = 3' },
          { type: 'updateVariable', target: 'dp[5]', value: 3, label: 'dp[5] = 3 (2→5→7 or 2→3→7)', color: '#22C55E' },
        ],
      },
      {
        title: 'Process i=6 (value 101)',
        description: 'Check all j < 6. Maximum comes from j=5 (7): dp[6] = dp[5] + 1 = 4.',
        why: '101 is larger than all previous elements, so it extends the longest LIS ending at 7. [2,5,7,101] length 4.',
        animations: [
          { type: 'highlight', target: 'i=6', value: 'nums[6]=101', color: '#F97316', label: 'Processing index 6' },
          { type: 'compare', target: 'nums[5]=7', value: 7, color: '#22C55E', label: '7 < 101, dp[5]+1 = 4' },
          { type: 'updateVariable', target: 'dp[6]', value: 4, label: 'dp[6] = 4 (LIS: [2,5,7,101])', color: '#22C55E' },
        ],
      },
      {
        title: 'Result',
        description: 'Maximum dp value is 4. LIS length = 4 (e.g., [2, 3, 7, 101] or [2, 5, 7, 101]).',
        animations: [
          { type: 'showTable', data: { type: 'dp-table', rows: 2, cols: 8, headers: ['10', '9', '2', '5', '3', '7', '101', '18'], values: [['1', '1', '1', '2', '2', '3', '4', '4'], ['', '', '', '', '', '', '', '']], highlight: [6] } },
          { type: 'showText', value: 'LIS Length = 4', color: '#22C55E' },
          { type: 'glow', target: 'result', value: 4, color: '#22C55E', label: 'Longest Increasing Subsequence: 4' },
          { type: 'pulse', target: 'dp[6]', value: 4, color: '#22C55E' },
        ],
      },
    ],
    pseudocode: [
      'function lengthOfLIS(nums):',
      '  n = nums.length, dp = array of n filled with 1',
      '  for i = 1 to n-1:',
      '    for j = 0 to i-1:',
      '      if nums[j] < nums[i]:',
      '        dp[i] = max(dp[i], dp[j] + 1)',
      '  return max(dp)',
    ],
    code: {
      cpp: `int lengthOfLIS(vector<int>& nums) {
  int n = nums.size();
  vector<int> dp(n, 1);
  int ans = 1;
  for (int i = 1; i < n; i++) {
    for (int j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = max(dp[i], dp[j] + 1);
      }
    }
    ans = max(ans, dp[i]);
  }
  return ans;
}`,
      javascript: `function lengthOfLIS(nums) {
  const n = nums.length;
  const dp = new Array(n).fill(1);
  let ans = 1;
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    ans = Math.max(ans, dp[i]);
  }
  return ans;
}`,
    },
    complexity: { time: 'O(n²)', space: 'O(n)' },
    commonMistakes: [
      'Using ≤ instead of < for strict increasing (should be strictly increasing)',
      'Not updating the global maximum as the answer (returning dp[n-1] instead of max)',
      'Assuming the subsequence must be contiguous (that is a subarray, not subsequence)',
    ],
    tips: [
      'A greedy + binary search solution achieves O(n log n) time',
      'Patience sorting analogy: place each card on the leftmost pile whose top card ≥ it',
      'To reconstruct the actual subsequence, maintain a parent pointer array',
    ],
    inputExample: { nums: [10, 9, 2, 5, 3, 7, 101, 18] },
  },
  {
    id: 'maximum-subarray',
    title: 'Maximum Subarray (Kadane\'s Algorithm)',
    difficulty: 'Easy',
    topic: 'Dynamic Programming',
    level: 5,
    problem: 'Given an integer array, find the contiguous subarray (containing at least one number) with the largest sum and return its sum.',
    example: 'Input: nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\nOutput: 6\nExplanation: The subarray [4, -1, 2, 1] has the largest sum = 6.',
    intuition: 'Kadane\'s algorithm: maintain current sum = max(element, current sum + element). If the current sum becomes negative, reset to 0 (start new subarray). Track the global maximum separately.',
    steps: [
      {
        title: 'Initialize',
        description: 'Set currentSum = 0, maxSum = -Infinity. Start iterating through the array.',
        why: 'currentSum tracks the running sum of the current subarray. maxSum stores the best seen so far.',
        animations: [
          { type: 'showTable', data: { type: 'dp-table', rows: 2, cols: 9, headers: ['-2', '1', '-3', '4', '-1', '2', '1', '-5', '4'], values: [['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '']] } },
          { type: 'showVariable', target: 'currentSum', value: 0, label: 'currentSum = 0', color: '#3B82F6' },
          { type: 'showVariable', target: 'maxSum', value: '-∞', label: 'maxSum = -∞', color: '#3B82F6' },
          { type: 'highlightCode', value: 'currentSum = 0; maxSum = -INFINITY;', color: '#EAB308' },
        ],
      },
      {
        title: 'Process -2',
        description: 'currentSum = max(-2, 0 + (-2)) = -2. maxSum = max(-∞, -2) = -2.',
        why: 'The subarray [-2] has sum -2. It\'s negative, so we might reset it later.',
        animations: [
          { type: 'highlight', target: 'i=0', value: '-2', color: '#F97316', label: 'Processing -2' },
          { type: 'updateVariable', target: 'currentSum', value: -2, label: 'currentSum = max(-2, -2) = -2', color: '#F97316' },
          { type: 'updateVariable', target: 'maxSum', value: -2, label: 'maxSum = max(-∞, -2) = -2', color: '#F97316' },
        ],
      },
      {
        title: 'Process 1',
        description: 'currentSum = max(1, -2 + 1) = max(1, -1) = 1. maxSum = max(-2, 1) = 1.',
        why: 'Starting fresh at 1 gives a better sum than extending the previous negative subarray.',
        animations: [
          { type: 'highlight', target: 'i=1', value: '1', color: '#F97316', label: 'Processing 1' },
          { type: 'compare', target: '1', value: 1, color: '#EAB308', label: 'max(1, -2+1) = max(1, -1) = 1' },
          { type: 'updateVariable', target: 'currentSum', value: 1, label: 'currentSum = 1', color: '#22C55E' },
          { type: 'updateVariable', target: 'maxSum', value: 1, label: 'maxSum = max(-2, 1) = 1', color: '#22C55E' },
        ],
      },
      {
        title: 'Process -3',
        description: 'currentSum = max(-3, 1 + (-3)) = max(-3, -2) = -2. maxSum stays 1.',
        why: 'Extending the subarray with -3 gives -2, which is better than starting fresh at -3. But it\'s still negative.',
        animations: [
          { type: 'highlight', target: 'i=2', value: '-3', color: '#F97316', label: 'Processing -3' },
          { type: 'updateVariable', target: 'currentSum', value: -2, label: 'currentSum = max(-3, -2) = -2', color: '#F97316' },
          { type: 'showText', value: 'maxSum stays 1 (best so far)', color: '#6B7280' },
        ],
      },
      {
        title: 'Process 4',
        description: 'currentSum = max(4, -2 + 4) = max(4, 2) = 4. maxSum = max(1, 4) = 4.',
        why: 'Starting fresh at 4 gives sum 4, beating the previous best of 1.',
        animations: [
          { type: 'highlight', target: 'i=3', value: '4', color: '#F97316', label: 'Processing 4' },
          { type: 'compare', target: '4', value: 4, color: '#EAB308', label: 'max(4, -2+4) = max(4, 2) = 4' },
          { type: 'updateVariable', target: 'currentSum', value: 4, label: 'currentSum = 4', color: '#22C55E' },
          { type: 'updateVariable', target: 'maxSum', value: 4, label: 'maxSum = max(1, 4) = 4', color: '#22C55E' },
        ],
      },
      {
        title: 'Process -1',
        description: 'currentSum = max(-1, 4 + (-1)) = 3. maxSum = max(4, 3) = 4.',
        animations: [
          { type: 'highlight', target: 'i=4', value: '-1', color: '#F97316', label: 'Processing -1' },
          { type: 'updateVariable', target: 'currentSum', value: 3, label: 'currentSum = 4 + (-1) = 3', color: '#22C55E' },
        ],
      },
      {
        title: 'Process 2 and 1',
        description: 'currentSum = 3+2=5, then 5+1=6. maxSum = max(4, 5, 6) = 6.',
        why: 'Extending through positive elements builds the sum. [4, -1, 2, 1] = 6 becomes the new maximum.',
        animations: [
          { type: 'highlight', target: 'i=5', value: '2', color: '#F97316', label: 'Processing 2' },
          { type: 'updateVariable', target: 'currentSum', value: 5, label: 'currentSum = 3 + 2 = 5', color: '#22C55E' },
          { type: 'highlight', target: 'i=6', value: '1', color: '#F97316', label: 'Processing 1' },
          { type: 'updateVariable', target: 'currentSum', value: 6, label: 'currentSum = 5 + 1 = 6', color: '#22C55E' },
          { type: 'updateVariable', target: 'maxSum', value: 6, label: 'maxSum = 6 (new best!)', color: '#22C55E' },
          { type: 'glow', target: 'maxSum', value: 6, color: '#22C55E', label: 'Best subarray: [4, -1, 2, 1]' },
        ],
      },
      {
        title: 'Process remaining',
        description: '-5: currentSum = max(-5, 6-5) = 1. 4: currentSum = max(4, 1+4) = 5. maxSum stays 6.',
        why: 'Even though 4 is positive, extending from the reset point gives 5, which doesn\'t beat 6.',
        animations: [
          { type: 'highlight', target: 'i=7', value: '-5', color: '#F97316', label: 'Processing -5' },
          { type: 'updateVariable', target: 'currentSum', value: 1, label: 'currentSum = max(-5, 6-5) = 1', color: '#F97316' },
          { type: 'highlight', target: 'i=8', value: '4', color: '#F97316', label: 'Processing 4' },
          { type: 'updateVariable', target: 'currentSum', value: 5, label: 'currentSum = max(4, 1+4) = 5', color: '#F97316' },
          { type: 'showText', value: 'maxSum remains 6', color: '#6B7280' },
        ],
      },
      {
        title: 'Result',
        description: 'Maximum subarray sum is 6 (subarray: [4, -1, 2, 1]).',
        animations: [
          { type: 'showText', value: 'Maximum Subarray Sum = 6', color: '#22C55E' },
          { type: 'showVariable', target: 'maxSum', value: 6, label: 'maxSum = 6', color: '#22C55E' },
          { type: 'pulse', target: 'result', value: 6, color: '#22C55E', label: 'Kadane\'s complete' },
        ],
      },
    ],
    pseudocode: [
      'function maxSubArray(nums):',
      '  currentSum = 0',
      '  maxSum = -INFINITY',
      '  for each num in nums:',
      '    currentSum = max(num, currentSum + num)',
      '    maxSum = max(maxSum, currentSum)',
      '  return maxSum',
    ],
    code: {
      cpp: `int maxSubArray(vector<int>& nums) {
  int currentSum = 0;
  int maxSum = INT_MIN;
  for (int num : nums) {
    currentSum = max(num, currentSum + num);
    maxSum = max(maxSum, currentSum);
  }
  return maxSum;
}`,
      javascript: `function maxSubArray(nums) {
  let currentSum = 0;
  let maxSum = -Infinity;
  for (const num of nums) {
    currentSum = Math.max(num, currentSum + num);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}`,
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    commonMistakes: [
      'Initializing maxSum to 0 instead of -Infinity (fails for all-negative arrays)',
      'Resetting currentSum to 0 when it goes negative (Kadane keeps it as-is)',
      'Confusing subarray (contiguous) with subsequence (not necessarily contiguous)',
    ],
    tips: [
      'Kadane\'s algorithm is optimal: O(n) time, O(1) space',
      'For circular arrays, compute max subarray sum with and without wrapping',
      'Divide and conquer also solves this in O(n log n) but is not as efficient',
    ],
    inputExample: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] },
  },
]
