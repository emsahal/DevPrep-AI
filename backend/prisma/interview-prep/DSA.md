<!--LANG:roman-->

# DSA Interview Questions

## 1. Reverse a linked list (iteratively and recursively).

**Asaan Urdu mein:**  
Iterative method mein teen pointers – **prev**, **curr**, **next** – use karte hain aur ek hi pass mein links ko ulta kar dete hain. Recursive approach tail tak recursion karta hai, phir unwind hote hue har node ka `next` pointer set karta hai. Iterative ka extra space **O(1)** hota hai, jabke recursive ka **O(n)** call‑stack hota hai. Dono ka time complexity **O(n)** hai.

```javascript
class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

function reverseIterative(head) {
  let prev = null, curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}

function reverseRecursive(head) {
  if (!head || !head.next) return head;
  const newHead = reverseRecursive(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}
```

---



---

## 2. Detect a cycle in a linked list (Floyd's cycle detection).

**Asaan Urdu mein:**  
Do pointers – **slow** (ek step) aur **fast** (do step) – se list ko traverse karte hain. Agar dono kabhi milte hain, to cycle exist karti hai. Cycle ka start point find karne ke liye, ek pointer ko head par reset karte hain aur dono ko ek step se aage badhate hain jab tak phir milte nahi. Time **O(n)**, extra space **O(1)**.

```javascript
function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

function detectCycleStart(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {
      slow = head;
      while (slow !== fast) {
        slow = slow.next;
        fast = fast.next;
      }
      return slow;
    }
  }
  return null;
}
```

---



---

## 3. Find the middle element of a linked list in one pass.

**Asaan Urdu mein:**  
**Slow** aur **fast** pointers ka istemal karte hain; fast har iteration mein do step aage badhta hai, jabke slow ek step. Jab fast end tak pohanchta hai, slow middle node par hota hai. Even length list ke liye second middle return hota hai. Time **O(n)**, space **O(1)**.

```javascript
function middleNode(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}
```

---



---

## 4. Merge two sorted linked lists.

**Asaan Urdu mein:**  
Dono lists ke heads compare karte hain, chhota node result list mein attach karte hain, phir us list ko aage badhate hain. Iterative approach extra space **O(1)**, recursive approach call‑stack **O(n+m)** use karta hai. Total time **O(n+m)**.

```javascript
function mergeTwoLists(l1, l2) {
  const dummy = new ListNode(0);
  let curr = dummy;
  while (l1 && l2) {
    if (l1.val < l2.val) {
      curr.next = l1;
      l1 = l1.next;
    } else {
      curr.next = l2;
      l2 = l2.next;
    }
    curr = curr.next;
  }
  curr.next = l1 || l2;
  return dummy.next;
}
```

---



---

## 5. Implement a stack using two queues (and vice versa).

**Asaan Urdu mein:**  
**Stack‑using‑queues:** push element ko `q1` mein daalte hain. Pop karne ke liye `q1` ke sab elements ko `q2` mein transfer karte hain except last, jo pop hota hai, phir queues swap karte hain. **Queue‑using‑stacks:** push element ko `s1` mein push karte hain. Pop karne ke liye `s1` ko `s2` mein transfer karte hain (agar `s2` empty ho) aur `s2` se pop karte hain. Push **O(1)**, pop amortized **O(1)**.

```javascript
class StackUsingQueues {
  constructor() {
    this.q1 = [];
    this.q2 = [];
  }
  push(x) {
    this.q1.push(x);
  }
  pop() {
    while (this.q1.length > 1) this.q2.push(this.q1.shift());
    const val = this.q1.shift();
    [this.q1, this.q2] = [this.q2, this.q1];
    return val;
  }
  top() {
    while (this.q1.length > 1) this.q2.push(this.q1.shift());
    const val = this.q1[0];
    this.q2.push(this.q1.shift());
    [this.q1, this.q2] = [this.q2, this.q1];
    return val;
  }
  empty() {
    return this.q1.length === 0;
  }
}

class QueueUsingStacks {
  constructor() {
    this.s1 = [];
    this.s2 = [];
  }
  push(x) {
    this.s1.push(x);
  }
  pop() {
    if (this.s2.length === 0) {
      while (this.s1.length) this.s2.push(this.s1.pop());
    }
    return this.s2.pop();
  }
  peek() {
    if (this.s2.length === 0) {
      while (this.s1.length) this.s2.push(this.s1.pop());
    }
    return this.s2[this.s2.length - 1];
  }
  empty() {
    return this.s1.length === 0 && this.s2.length === 0;
  }
}
```

---



---

## 6. Find the first non-repeating character in a string.

**Asaan Urdu mein:**  
Pehle ek hash map banate hain jo har character ki frequency count karta hai. Phir string ko dobara traverse karte hain aur pehla aisa character return karte hain jiska count **1** ho. Time **O(n)**, extra space **O(1)** (alphabet size limited).

```javascript
function firstUniqChar(s) {
  const map = {};
  for (const ch of s) map[ch] = (map[ch] || 0) + 1;
  for (let i = 0; i < s.length; i++) {
    if (map[s[i]] === 1) return i;
  }
  return -1;
}
```

---



---

## 7. Check if a string is a valid palindrome.

**Asaan Urdu mein:**  
Do pointers left aur right se start karte hain, non‑alphanumeric characters ko skip karte hain, aur case‑insensitive compare karte hain. Agar koi mismatch milta hai to false, warna true. Time **O(n)**, space **O(1)**.

```javascript
function isPalindrome(s) {
  let l = 0, r = s.length - 1;
  while (l < r) {
    while (l < r && !/[a-zA-Z0-9]/.test(s[l])) l++;
    while (l < r && !/[a-zA-Z0-9]/.test(s[r])) r--;
    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;
    l++; r--;
  }
  return true;
}
```

---



---

## 8. Find the longest substring without repeating characters.

**Asaan Urdu mein:**  
Sliding window technique use karte hain. Hash map har character ka last index store karta hai. Right pointer ko expand karte hain, agar repeat milta hai to left pointer ko `max(left, lastIndex+1)` tak move karte hain. Max length track karte hain. Time **O(n)**, space **O(min(n, m))**.

```javascript
function lengthOfLongestSubstring(s) {
  const map = {};
  let left = 0, maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (map[ch] !== undefined) left = Math.max(left, map[ch] + 1);
    map[ch] = right;
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}
```

---



---

## 9. Implement binary search on a sorted array.

**Asaan Urdu mein:**  
Array ke beech ka middle index nikalte hain, usse target se compare karte hain. Agar match mil jaye to index return, warna target ke hisaab se left ya right half ko discard karte hain. Logarithmic time **O(log n)**, constant space **O(1)**.

```javascript
function binarySearch(arr, target) {
  let l = 0, r = arr.length - 1;
  while (l <= r) {
    const mid = Math.floor((l + r) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) l = mid + 1;
    else r = mid - 1;
  }
  return -1;
}
```

---



---

## 10. Find the kth largest element in an unsorted array.

**Asaan Urdu mein:**  
Min‑heap size **k** maintain karte hain. Har element ko heap mein push karte hain; agar size **k** se zyada ho jaye to smallest element pop kar dete hain. Final heap top **kth largest** hota hai. Time **O(n log k)**, space **O(k)**.

```javascript
function findKthLargest(nums, k) {
  const minHeap = [];
  const push = (val) => {
    minHeap.push(val);
    let i = minHeap.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (minHeap[p] <= minHeap[i]) break;
      [minHeap[p], minHeap[i]] = [minHeap[i], minHeap[p]];
      i = p;
    }
  };
  const pop = () => {
    const top = minHeap[0];
    const last = minHeap.pop();
    if (minHeap.length) {
      minHeap[0] = last;
      let i = 0;
      while (true) {
        let smallest = i;
        const l = 2 * i + 1, r = 2 * i + 2;
        if (l < minHeap.length && minHeap[l] < minHeap[smallest]) smallest = l;
        if (r < minHeap.length && minHeap[r] < minHeap[smallest]) smallest = r;
        if (smallest === i) break;
        [minHeap[i], minHeap[smallest]] = [minHeap[smallest], minHeap[i]];
        i = smallest;
      }
    }
    return top;
  };
  for (const num of nums) {
    push(num);
    if (minHeap.length > k) pop();
  }
  return minHeap[0];
}
```

---



---

## 11. Merge overlapping intervals.

**Asaan Urdu mein:**  
Intervals ko start time ke hisaab se sort karte hain. Result list mein pehla interval push karte hain, phir har next interval ke start ko previous interval ke end se compare karte hain. Overlap ho to end ko max se update karte hain, warna new interval push karte hain. Time **O(n log n)**, space **O(n)**.

```javascript
function merge(intervals) {
  if (!intervals.length) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  const result = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    const last = result[result.length - 1];
    if (start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      result.push([start, end]);
    }
  }
  return result;
}
```

---



---

## 12. Find two numbers in an array that sum to a target (Two Sum).

**Asaan Urdu mein:**  
Hash map mein har number ka complement (`target - num`) store karte hain. Jab current number pehle se map mein mil jaye, to dono indices return karte hain. Time **O(n)**, space **O(n)**.

```javascript
function twoSum(nums, target) {
  const map = {};
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map[complement] !== undefined) return [map[complement], i];
    map[nums[i]] = i;
  }
  return [];
}
```

---



---

## 13. Implement a queue using a fixed-size array (circular queue).

**Asaan Urdu mein:**  
Head aur tail pointers modulo array size se manage karte hain. Enqueue tail ko increment karke value store karta hai, dequeue head ko increment karta hai. Full condition: `(tail + 1) % size == head`. Time **O(1)** per operation, space **O(n)**.

```javascript
class CircularQueue {
  constructor(k) {
    this.buffer = new Array(k);
    this.capacity = k;
    this.head = 0;
    this.tail = -1;
    this.count = 0;
  }
  enQueue(val) {
    if (this.isFull()) return false;
    this.tail = (this.tail + 1) % this.capacity;
    this.buffer[this.tail] = val;
    this.count++;
    return true;
  }
  deQueue() {
    if (this.isEmpty()) return false;
    this.head = (this.head + 1) % this.capacity;
    this.count--;
    return true;
  }
  Front() {
    return this.isEmpty() ? -1 : this.buffer[this.head];
  }
  Rear() {
    return this.isEmpty() ? -1 : this.buffer[this.tail];
  }
  isEmpty() {
    return this.count === 0;
  }
  isFull() {
    return this.count === this.capacity;
  }
}
```

---



---

## 14. Find the maximum subarray sum (Kadane's algorithm).

**Asaan Urdu mein:**  
Running sum maintain karte hain; agar sum negative ho jaye to zero se reset kar dete hain. Har step par max sum ko update karte hain. Linear time **O(n)**, constant space **O(1)**.

```javascript
function maxSubArray(nums) {
  let maxSum = -Infinity, currSum = 0;
  for (const num of nums) {
    currSum += num;
    maxSum = Math.max(maxSum, currSum);
    if (currSum < 0) currSum = 0;
  }
  return maxSum;
}
```

---



---

## 15. Check if two strings are anagrams of each other.

**Asaan Urdu mein:**  
Pehli string ke characters ki frequency increment karte hain, doosri string ke characters ko decrement karte hain. Agar koi count non‑zero rahe to anagram nahi, warna hain. Time **O(n)**, space **O(1)** (alphabet limited).

```javascript
function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = {};
  for (const ch of s) count[ch] = (count[ch] || 0) + 1;
  for (const ch of t) {
    if (!count[ch]) return false;
    count[ch]--;
  }
  return true;
}
```

---



---

## 16. Implement a binary search tree with insert, search, and delete operations.

**Asaan Urdu mein:**  
BST node ke left child chhoti values aur right child badi values store karta hai. Insert recursively appropriate leaf tak jata hai. Search linear traversal based on comparison. Delete ke liye teen cases handle karte hain: leaf, single child, ya dono children – is case mein in‑order successor se replace karte hain. Average **O(log n)**, worst **O(n)**.

```javascript
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

class BST {
  constructor() {
    this.root = null;
  }
  insert(val) {
    this.root = this._insert(this.root, val);
  }
  _insert(node, val) {
    if (!node) return new TreeNode(val);
    if (val < node.val) node.left = this._insert(node.left, val);
    else node.right = this._insert(node.right, val);
    return node;
  }
  search(val) {
    let curr = this.root;
    while (curr) {
      if (curr.val === val) return true;
      curr = val < curr.val ? curr.left : curr.right;
    }
    return false;
  }
  delete(val) {
    this.root = this._delete(this.root, val);
  }
  _delete(node, val) {
    if (!node) return null;
    if (val < node.val) node.left = this._delete(node.left, val);
    else if (val > node.val) node.right = this._delete(node.right, val);
    else {
      if (!node.left) return node.right;
      if (!node.right) return node.left;
      let succ = node.right;
      while (succ.left) succ = succ.left;
      node.val = succ.val;
      node.right = this._delete(node.right, succ.val);
    }
    return node;
  }
}
```

---



---

## 17. Find the height/depth of a binary tree.

**Asaan Urdu mein:**  
Recursively left aur right subtree ki heights calculate karte hain, phir unmein se max le kar 1 add karte hain. Null node ki height **0** (ya -1) hoti hai. Time **O(n)**, recursion stack **O(h)**.

```javascript
function height(root) {
  if (!root) return 0;
  return 1 + Math.max(height(root.left), height(root.right));
}
```

---



---

## 18. Check if a binary tree is balanced.

**Asaan Urdu mein:**  
Har node ke left aur right subtree ki heights ko compare karte hain; difference >1 ho to unbalanced. Recursive helper height return karta hai, ya **-1** agar koi subtree already unbalanced ho. Time **O(n)**, space **O(h)**.

```javascript
function isBalanced(root) {
  function check(node) {
    if (!node) return 0;
    const left = check(node.left);
    const right = check(node.right);
    if (left === -1 || right === -1 || Math.abs(left - right) > 1) return -1;
    return 1 + Math.max(left, right);
  }
  return check(root) !== -1;
}
```

---



---

## 19. Perform level-order traversal (BFS) of a binary tree.

**Asaan Urdu mein:**  
Queue ko root se start karte hain. Har level ke nodes ko dequeue karte hain, unke values result array mein store karte hain, aur unke left/right children ko queue mein enqueue karte hain. Is tarah level‑by‑level traversal milta hai. Time **O(n)**, space **O(w)** (w = max width).

```javascript
function levelOrder(root) {
  if (!root) return [];
  const result = [], queue = [root];
  while (queue.length) {
    const level = [];
    const len = queue.length;
    for (let i = 0; i < len; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}
```

---



---

## 20. Find the lowest common ancestor of two nodes in a binary tree.

**Asaan Urdu mein:**  
Recursively left aur right subtrees mein search karte hain. Agar dono sides se non‑null nodes milte hain, to current node LCA hota hai. Agar sirf ek side se milta hai, to wahi result propagate hota hai. Time **O(n)**, space **O(h)**.

```javascript
function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) return root;
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  if (left && right) return root;
  return left || right;
}
```

---



---

## 21. Implement quicksort and explain its time complexity.

**Asaan Urdu mein:**  
Pivot select karte hain (usually last element). Partition step mein pivot se chhote elements left, bade right side move karte hain. Phir left aur right partitions ko recursively sort karte hain. Average **O(n log n)**, worst **O(n²)** jab pivot hamesha smallest ya largest ho. In‑place, recursion stack **O(log n)**.

```javascript
function quickSort(arr, low = 0, high = arr.length - 1) {
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
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}
```

---



---

## 22. Implement mergesort and explain its time complexity.

**Asaan Urdu mein:**  
Array ko recursively do halves mein split karte hain jab tak single element na rahe. Phir **merge** step mein dono sorted halves ko compare karte hue ek sorted array banate hain. Hamesha **O(n log n)** time, auxiliary space **O(n)** for merging.

```javascript
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}
```

---



---

## 23. Explain the difference between BFS and DFS, and when to use each.

**Asaan Urdu mein:**  
BFS level‑by‑level explore karta hai queue ke through, jabke DFS depth‑first stack (ya recursion) se kaam karta hai. BFS shortest path (unweighted graphs) aur connected components ke liye best hai; DFS kam memory use karta hai deep graphs ke liye aur topological sort, cycle detection, backtracking problems mein useful hai.

| Feature | **BFS** | **DFS** |
|---------|---------|---------|
| Data structure | Queue | Stack / Recursion |
| Order | Level order | Pre‑order / In‑order / Post‑order |
| Memory (worst) | **O(b^d)** (breadth) | **O(d)** (depth) |
| Typical use | Shortest path, level traversal | Topological sort, cycle detection, puzzles |

---



---

## 24. Solve the 'number of islands' problem using DFS/BFS on a grid.

**Asaan Urdu mein:**  
Grid ke har cell ko



---

## 25. Implement a trie (prefix tree) for autocomplete.

**Asaan Urdu mein:**  
Trie ek prefix tree hota hai jisme har node ke paas ek `children` ka object ya array hota hai aur ek `isEnd` flag hota hai jo batata hai ke koi shabd yahan khatam hota hai. Insert, search, aur `startsWith` functions har character ko ek ek kar ke traverse karte hain. Autocomplete ke liye, prefix node tak pohanch kar DFS chalate hain aur us node se shuru hone wale tamam words collect karte hain. Har operation ka time complexity O(L) hota hai, jahan L shabd ki length hai.

```javascript
class TrieNode {
  constructor() {
    this.children = {};
    this.isEnd = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }
  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) node.children[ch] = new TrieNode();
      node = node.children[ch];
    }
    node.isEnd = true;
  }
  search(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) return false;
      node = node.children[ch];
    }
    return node.isEnd;
  }
  startsWith(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children[ch]) return false;
      node = node.children[ch];
    }
    return true;
  }
  autocomplete(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children[ch]) return [];
      node = node.children[ch];
    }
    const results = [];
    function dfs(n, path) {
      if (n.isEnd) results.push(prefix + path);
      for (const ch of Object.keys(n.children)) {
        dfs(n.children[ch], path + ch);
      }
    }
    dfs(node, '');
    return results;
  }
}
```

---



---

## 26. Find all permutations of a string.

**Asaan Urdu mein:**  
Permutation generate karne ke liye hum backtracking ka istemal karte hain—har position par har character ko swap karte hain aur agle position ke liye recursive call dete hain. Jab start index string ke end tak pohanch jata hai, to current arrangement ko result list mein add kar dete hain. Swap karne ke baad hamesha wapas original order restore karna zaroori hota hai taake dusre branches sahi tarah se explore ho sakein. Is algorithm ki time complexity O(n × n!) aur recursion ke liye O(n) space hoti hai.

```javascript
function permute(str) {
  const result = [];
  const arr = str.split('');
  function backtrack(start) {
    if (start === arr.length) {
      result.push(arr.join(''));
      return;
    }
    for (let i = start; i < arr.length; i++) {
      [arr[start], arr[i]] = [arr[i], arr[start]];
      backtrack(start + 1);
      [arr[start], arr[i]] = [arr[i], arr[start]];
    }
  }
  backtrack(0);
  return result;
}
```

---



---

## 27. Solve the coin change problem using dynamic programming.

**Asaan Urdu mein:**  
Dynamic programming se hum ek `dp` array banate hain jahan `dp[i]` minimum coins batata hai jo amount `i` banane ke liye chahiye. Har coin ke liye hum `dp[i] = min(dp[i], dp[i‑coin] + 1)` update karte hain, jo bottom‑up approach hai. Agar koi amount ban nahi sakti to final answer `-1` return hota hai. Time complexity O(amount × n) aur space O(amount) hoti hai.

```javascript
function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
```

---



---

## 28. Find the longest common subsequence between two strings.

**Asaan Urdu mein:**  
LCS ke liye hum 2‑dimensional DP table `dp[i][j]` use karte hain jo `text1[0..i‑1]` aur `text2[0..j‑1]` ka longest common subsequence length store karta hai. Agar dono characters match karte hain to `dp[i][j] = 1 + dp[i‑1][j‑1]`; warna hum max(`dp[i‑1][j]`, `dp[i][j‑1]`) lete hain. Table ko fill karne ke baad `dp[m][n]` final answer hota hai. Time O(m × n) aur space O(m × n) (optimizable to O(n)).

```javascript
function longestCommonSubsequence(text1, text2) {
  const m = text1.length, n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}
```

---



---

## 29. Implement a min-heap and explain heap sort.

**Asaan Urdu mein:**  
Min‑heap ek complete binary tree hota hai jahan har parent node apne children se chhota ya barabar hota hai. `push` karte waqt hum naya element end mein add karte hain aur `_siftUp` se upar le jate hain; `pop` se root (sab se chhota) nikal kar last element ko root par rakhte hain aur `_siftDown` se phir se heap property restore karte hain. Heap sort me pehle sab elements ko min‑heap mein insert karte hain, phir repeatedly `pop` karke sorted array banate hain. Time complexity O(n log n) aur extra space O(1) hoti hai.

```javascript
class MinHeap {
  constructor() {
    this.heap = [];
  }
  getParent(i) { return Math.floor((i - 1) / 2); }
  getLeft(i) { return 2 * i + 1; }
  getRight(i) { return 2 * i + 2; }
  push(val) {
    this.heap.push(val);
    this._siftUp(this.heap.length - 1);
  }
  pop() {
    if (this.heap.length === 1) return this.heap.pop();
    const top = this.heap[0];
    this.heap[0] = this.heap.pop();
    this._siftDown(0);
    return top;
  }
  _siftUp(i) {
    while (i > 0 && this.heap[i] < this.heap[this.getParent(i)]) {
      [this.heap[i], this.heap[this.getParent(i)]] = [this.heap[this.getParent(i)], this.heap[i]];
      i = this.getParent(i);
    }
  }
  _siftDown(i) {
    const size = this.heap.length;
    while (true) {
      let smallest = i;
      const l = this.getLeft(i), r = this.getRight(i);
      if (l < size && this.heap[l] < this.heap[smallest]) smallest = l;
      if (r < size && this.heap[r] < this.heap[smallest]) smallest = r;
      if (smallest === i) break;
      [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
      i = smallest;
    }
  }
}

function heapSort(arr) {
  const heap = new MinHeap();
  for (const val of arr) heap.push(val);
  const result = [];
  while (heap.heap.length) result.push(heap.pop());
  return result;
}
```

---



---

## 30. Detect if a graph has a cycle (directed and undirected).

**Asaan Urdu mein:**  
Undirected graph me cycle detect karne ke liye DFS use karte hain aur parent node ko track karte hain; agar koi visited neighbor parent se alag ho to cycle milti hai. Directed graph me hum recursion stack (ya in‑degree based Kahn’s algorithm) maintain karte hain; agar DFS ke dauran koi node already stack mein ho to cycle exist karti hai. Dono approaches ka time O(V + E) aur extra space O(V) hota hai.

```javascript
function hasCycleUndirected(graph) {
  const visited = new Set();
  function dfs(node, parent) {
    visited.add(node);
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor, node)) return true;
      } else if (neighbor !== parent) return true;
    }
    return false;
  }
  for (const node in graph) {
    if (!visited.has(node) && dfs(node, null)) return true;
  }
  return false;
}

function hasCycleDirected(graph) {
  const visited = new Set(), recStack = new Set();
  function dfs(node) {
    visited.add(node);
    recStack.add(node);
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (recStack.has(neighbor)) return true;
    }
    recStack.delete(node);
    return false;
  }
  for (const node in graph) {
    if (!visited.has(node) && dfs(node)) return true;
  }
  return false;
}
```

---



---

## 31. Explain time and space complexity (Big O notation) with examples.

**Asaan Urdu mein:**  
Big O batata hai ke algorithm ki runtime ya memory usage input size ke sath kaise grow karti hai. O(1) constant time hota hai, jaise array ka first element lena. O(log n) logarithmic hota hai, jaise binary search. O(n) linear hota hai, jaise simple loop. O(n log n) mergesort jaisa hota hai, O(n²) nested loops ke liye, aur O(2ⁿ) exponential recursion (jaise naive Fibonacci) ke liye.

```javascript
// O(1) - constant
function getFirst(arr) { return arr[0]; }

// O(n) - linear
function sum(arr) { let s = 0; for (const x of arr) s += x; return s; }

// O(n²) - quadratic
function pairSum(arr) {
  for (let i = 0; i < arr.length; i++)
    for (let j = 0; j < arr.length; j++)
      console.log(arr[i] + arr[j]);
}

// O(log n) - logarithmic
function countSteps(n) { let c = 0; while (n > 1) { n = Math.floor(n / 2); c++; } return c; }

// O(2ⁿ) - exponential
function fib(n) { if (n <= 1) return n; return fib(n - 1) + fib(n - 2); }
```

---



---

## 32. Find the shortest path in a weighted graph (Dijkstra's algorithm).

**Asaan Urdu mein:**  
Dijkstra algorithm ek min‑heap (priority queue) use karta hai, jahan har node ka current shortest distance store hota hai. Source se start karte hue sab se chhota distance wala node pop karte hain, phir uske neighbours ko “relax” karte hain—agar naya distance pehle se kam ho to update kar dete hain. Process tab tak repeat hota hai jab tak heap khali na ho. Complexity O((V + E) log V) aur space O(V) hoti hai.

```javascript
function dijkstra(graph, start) {
  const dist = {};
  const pq = [[0, start]];
  for (const node in graph) dist[node] = Infinity;
  dist[start] = 0;
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift();
    if (d > dist[u]) continue;
    for (const [v, w] of graph[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        pq.push([dist[v], v]);
      }
    }
  }
  return dist;
}
```

---



---

## 33. Implement a hash map from scratch and explain collision handling.

**Asaan Urdu mein:**  
Hash map ek array of buckets hota hai; jab `put` karte hain to key ka hash nikal kar `hash % capacity` se index milta hai. Collisions ko separate chaining se handle karte hain—har bucket ek list (ya linked list) hoti hai jisme same index ke multiple entries store hoti hain. `get` karte waqt hum same bucket ki list ko scan karte hain aur matching key milne par value return karte hain. Average case O(1) access hota hai, worst case O(n) jab sab keys ek hi bucket mein aa jayein.

```javascript
class HashMap {
  constructor(capacity = 16) {
    this.buckets = Array.from({ length: capacity }, () => []);
    this.capacity = capacity;
    this.size = 0;
  }
  _hash(key) {
    let hash = 0;
    for (const ch of String(key)) {
      hash = (hash * 31 + ch.charCodeAt(0)) % this.capacity;
    }
    return hash;
  }
  put(key, value) {
    const idx = this._hash(key);
    const bucket = this.buckets[idx];
    for (const entry of bucket) {
      if (entry.key === key) {
        entry.value = value;
        return;
      }
    }
    bucket.push({ key, value });
    this.size++;
  }
  get(key) {
    const idx = this._hash(key);
    const bucket = this.buckets[idx];
    for (const entry of bucket) {
      if (entry.key === key) return entry.value;
    }
    return undefined;
  }
  remove(key) {
    const idx = this._hash(key);
    const bucket = this.buckets[idx];
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i].key === key) {
        bucket.splice(i, 1);
        this.size--;
        return true;
      }
    }
    return false;
  }
}
```

---



---

## 34. Solve the 'N-Queens' problem using backtracking.

**Asaan Urdu mein:**  
N‑Queens problem ko hum column‑by‑column place karte hain; har column ke liye har row try karte hain aur check karte hain ke koi queen same row, same diagonal ya anti‑diagonal par to nahi hai. Agar safe ho to queen rakh kar next column ke liye recursive call karte hain; agar koi valid placement nahi milti to backtrack karte hain aur previous queen ko hata dete hain. Ye process sab solutions generate karne tak chalti hai. Complexity roughly O(n!) aur recursion depth O(n) hoti hai.

```javascript
function solveNQueens(n) {
  const result = [];
  const board = Array.from({ length: n }, () => Array(n).fill('.'));
  const cols = new Set(), diags = new Set(), antiDiags = new Set();
  function backtrack(row) {
    if (row === n) {
      result.push(board.map(r => r.join('')));
      return;
    }
    for (let col = 0; col < n; col++) {
      const diag = row - col, antiDiag = row + col;
      if (cols.has(col) || diags.has(diag) || antiDiags.has(antiDiag)) continue;
      board[row][col] = 'Q';
      cols.add(col); diags.add(diag); antiDiags.add(antiDiag);
      backtrack(row + 1);
      board[row][col] = '.';
      cols.delete(col); diags.delete(diag); antiDiags.delete(antiDiag);
    }
  }
  backtrack(0);
  return result;
}
```

---



---

## 35. Rotate an array by k positions in place.

**Asaan Urdu mein:**  
Array ko `k` positions rotate karne ke liye pehle poore array ko reverse karte hain, phir first `k` elements ko reverse karte hain, aur baaki ke elements ko reverse karte hain. `k = k % n` se hum ensure karte hain ke `k` array ki length se bada ho to bhi sahi shift ho. Ye method O(n) time aur O(1) extra space use karta hai. Rotation ke baad array ka order bilkul wahi hota hai jo `k` steps right‑shift ke baad expected hota hai.

```javascript
function rotate(nums, k) {
  k = k % nums.length;
  reverse(nums, 0, nums.length - 1);
  reverse(nums, 0, k - 1);
  reverse(nums, k, nums.length - 1);
}

function reverse(arr, start, end) {
  while (start < end) {
    [arr[start], arr[end]] = [arr[end], arr[start]];
    start++;
    end--;
  }
}
```

<!--LANG:english-->



# DSA Interview Questions

## 1. Reverse a linked list (iteratively and recursively).

Iterative reversal uses three pointers (prev, curr, next) to reverse links in a single pass. Recursive reversal reaches the tail first, then rewires nodes on the way back up. Both run in O(n) time and O(1) space for iterative, O(n) call-stack space for recursive.

```javascript
class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

function reverseIterative(head) {
  let prev = null, curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}

function reverseRecursive(head) {
  if (!head || !head.next) return head;
  const newHead = reverseRecursive(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}
```

---

## 2. Detect a cycle in a linked list (Floyd's cycle detection).

Use slow and fast pointers — slow moves one step, fast moves two. If they meet, a cycle exists. To find the start, reset one pointer to head and advance both one step until they meet again. O(n) time, O(1) space.

```javascript
function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

function detectCycleStart(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {
      slow = head;
      while (slow !== fast) {
        slow = slow.next;
        fast = fast.next;
      }
      return slow;
    }
  }
  return null;
}
```

---

## 3. Find the middle element of a linked list in one pass.

Use slow/fast pointers — when fast reaches the end, slow is at the middle. For even-length lists, this returns the second middle. O(n) time, O(1) space.

```javascript
function middleNode(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}
```

---

## 4. Merge two sorted linked lists.

Compare heads of both lists, pick the smaller, and recursively or iteratively merge the rest. O(n + m) time, O(1) space for iterative, O(n + m) stack space for recursive.

```javascript
function mergeTwoLists(l1, l2) {
  const dummy = new ListNode(0);
  let curr = dummy;
  while (l1 && l2) {
    if (l1.val < l2.val) {
      curr.next = l1;
      l1 = l1.next;
    } else {
      curr.next = l2;
      l2 = l2.next;
    }
    curr = curr.next;
  }
  curr.next = l1 || l2;
  return dummy.next;
}
```

---

## 5. Implement a stack using two queues (and vice versa).

For stack-using-queues: push to queue1; pop transfers all but last from queue1 to queue2, returns the last, then swaps names. For queue-using-stacks: use two stacks — push to s1; pop transfers s1 to s2 and pops from s2. Push is O(1), pop amortized O(1) for queue-using-stacks.

```javascript
class StackUsingQueues {
  constructor() {
    this.q1 = [];
    this.q2 = [];
  }
  push(x) {
    this.q1.push(x);
  }
  pop() {
    while (this.q1.length > 1) this.q2.push(this.q1.shift());
    const val = this.q1.shift();
    [this.q1, this.q2] = [this.q2, this.q1];
    return val;
  }
  top() {
    while (this.q1.length > 1) this.q2.push(this.q1.shift());
    const val = this.q1[0];
    this.q2.push(this.q1.shift());
    [this.q1, this.q2] = [this.q2, this.q1];
    return val;
  }
  empty() {
    return this.q1.length === 0;
  }
}

class QueueUsingStacks {
  constructor() {
    this.s1 = [];
    this.s2 = [];
  }
  push(x) {
    this.s1.push(x);
  }
  pop() {
    if (this.s2.length === 0) {
      while (this.s1.length) this.s2.push(this.s1.pop());
    }
    return this.s2.pop();
  }
  peek() {
    if (this.s2.length === 0) {
      while (this.s1.length) this.s2.push(this.s1.pop());
    }
    return this.s2[this.s2.length - 1];
  }
  empty() {
    return this.s1.length === 0 && this.s2.length === 0;
  }
}
```

---

## 6. Find the first non-repeating character in a string.

Use a hash map to count character frequencies, then iterate again to find the first char with count 1. O(n) time, O(1) space (since alphabet is bounded).

```javascript
function firstUniqChar(s) {
  const map = {};
  for (const ch of s) map[ch] = (map[ch] || 0) + 1;
  for (let i = 0; i < s.length; i++) {
    if (map[s[i]] === 1) return i;
  }
  return -1;
}
```

---

## 7. Check if a string is a valid palindrome.

Use two pointers from both ends, skipping non-alphanumeric characters with regex, comparing case-insensitively. O(n) time, O(1) space.

```javascript
function isPalindrome(s) {
  let l = 0, r = s.length - 1;
  while (l < r) {
    while (l < r && !/[a-zA-Z0-9]/.test(s[l])) l++;
    while (l < r && !/[a-zA-Z0-9]/.test(s[r])) r--;
    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;
    l++; r--;
  }
  return true;
}
```

---

## 8. Find the longest substring without repeating characters.

Sliding window with a hash map tracking each character's last index. Expand the right pointer; if a repeat is found, move left to max(left, lastIndex + 1). Track max length. O(n) time, O(min(n, m)) space where m is charset size.

```javascript
function lengthOfLongestSubstring(s) {
  const map = {};
  let left = 0, maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (map[ch] !== undefined) left = Math.max(left, map[ch] + 1);
    map[ch] = right;
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}
```

---

## 9. Implement binary search on a sorted array.

Divide the search space in half at each step. Compare the middle element with the target and eliminate the half that cannot contain the target. O(log n) time, O(1) space.

```javascript
function binarySearch(arr, target) {
  let l = 0, r = arr.length - 1;
  while (l <= r) {
    const mid = Math.floor((l + r) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) l = mid + 1;
    else r = mid - 1;
  }
  return -1;
}
```

---

## 10. Find the kth largest element in an unsorted array.

Use a min-heap of size k — for each element, push it; if heap exceeds size k, pop the smallest. At the end, the heap top is the kth largest. Alternatively, use quickselect for average O(n). O(n log k) time with heap, O(k) space.

```javascript
function findKthLargest(nums, k) {
  const minHeap = [];
  const push = (val) => {
    minHeap.push(val);
    let i = minHeap.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (minHeap[p] <= minHeap[i]) break;
      [minHeap[p], minHeap[i]] = [minHeap[i], minHeap[p]];
      i = p;
    }
  };
  const pop = () => {
    const top = minHeap[0];
    const last = minHeap.pop();
    if (minHeap.length) {
      minHeap[0] = last;
      let i = 0;
      while (true) {
        let smallest = i;
        const l = 2 * i + 1, r = 2 * i + 2;
        if (l < minHeap.length && minHeap[l] < minHeap[smallest]) smallest = l;
        if (r < minHeap.length && minHeap[r] < minHeap[smallest]) smallest = r;
        if (smallest === i) break;
        [minHeap[i], minHeap[smallest]] = [minHeap[smallest], minHeap[i]];
        i = smallest;
      }
    }
    return top;
  };
  for (const num of nums) {
    push(num);
    if (minHeap.length > k) pop();
  }
  return minHeap[0];
}
```

---

## 11. Merge overlapping intervals.

Sort intervals by start time, then iterate merging whenever the current interval's start is ≤ previous end. O(n log n) time due to sorting, O(n) space for output.

```javascript
function merge(intervals) {
  if (!intervals.length) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  const result = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    const last = result[result.length - 1];
    if (start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      result.push([start, end]);
    }
  }
  return result;
}
```

---

## 12. Find two numbers in an array that sum to a target (Two Sum).

Use a hash map to store each number's complement (target - num) as we iterate. When a number matches a previously stored complement, we have the pair. O(n) time, O(n) space.

```javascript
function twoSum(nums, target) {
  const map = {};
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map[complement] !== undefined) return [map[complement], i];
    map[nums[i]] = i;
  }
  return [];
}
```

---

## 13. Implement a queue using a fixed-size array (circular queue).

Maintain head and tail pointers modulo the array size. Enqueue at tail, dequeue at head. When tail + 1 mod size equals head, the queue is full. O(1) time per operation, O(n) space.

```javascript
class CircularQueue {
  constructor(k) {
    this.buffer = new Array(k);
    this.capacity = k;
    this.head = 0;
    this.tail = -1;
    this.count = 0;
  }
  enQueue(val) {
    if (this.isFull()) return false;
    this.tail = (this.tail + 1) % this.capacity;
    this.buffer[this.tail] = val;
    this.count++;
    return true;
  }
  deQueue() {
    if (this.isEmpty()) return false;
    this.head = (this.head + 1) % this.capacity;
    this.count--;
    return true;
  }
  Front() {
    return this.isEmpty() ? -1 : this.buffer[this.head];
  }
  Rear() {
    return this.isEmpty() ? -1 : this.buffer[this.tail];
  }
  isEmpty() {
    return this.count === 0;
  }
  isFull() {
    return this.count === this.capacity;
  }
}
```

---

## 14. Find the maximum subarray sum (Kadane's algorithm).

Iterate keeping a running sum — if it goes negative, reset to 0; track the max seen. This works because any positive contribution to a subarray is captured. O(n) time, O(1) space.

```javascript
function maxSubArray(nums) {
  let maxSum = -Infinity, currSum = 0;
  for (const num of nums) {
    currSum += num;
    maxSum = Math.max(maxSum, currSum);
    if (currSum < 0) currSum = 0;
  }
  return maxSum;
}
```

---

## 15. Check if two strings are anagrams of each other.

Count character frequencies from the first string (increment) and decrement from the second. If all counts are zero, they are anagrams. O(n) time, O(1) space.

```javascript
function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = {};
  for (const ch of s) count[ch] = (count[ch] || 0) + 1;
  for (const ch of t) {
    if (!count[ch]) return false;
    count[ch]--;
  }
  return true;
}
```

---

## 16. Implement a binary search tree with insert, search, and delete operations.

Insert walks left/right recursively to find the correct leaf. Search compares each node. Delete finds the node, replaces it with its in-order successor (or predecessor) when it has two children. Average O(log n), worst O(n) for skewed trees.

```javascript
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

class BST {
  constructor() {
    this.root = null;
  }
  insert(val) {
    this.root = this._insert(this.root, val);
  }
  _insert(node, val) {
    if (!node) return new TreeNode(val);
    if (val < node.val) node.left = this._insert(node.left, val);
    else node.right = this._insert(node.right, val);
    return node;
  }
  search(val) {
    let curr = this.root;
    while (curr) {
      if (curr.val === val) return true;
      curr = val < curr.val ? curr.left : curr.right;
    }
    return false;
  }
  delete(val) {
    this.root = this._delete(this.root, val);
  }
  _delete(node, val) {
    if (!node) return null;
    if (val < node.val) node.left = this._delete(node.left, val);
    else if (val > node.val) node.right = this._delete(node.right, val);
    else {
      if (!node.left) return node.right;
      if (!node.right) return node.left;
      let succ = node.right;
      while (succ.left) succ = succ.left;
      node.val = succ.val;
      node.right = this._delete(node.right, succ.val);
    }
    return node;
  }
}
```

---

## 17. Find the height/depth of a binary tree.

Recursively compute max of left and right subtree heights plus one. Base case: null node has height 0 (or -1 depending on definition). O(n) time, O(h) stack space.

```javascript
function height(root) {
  if (!root) return 0;
  return 1 + Math.max(height(root.left), height(root.right));
}
```

---

## 18. Check if a binary tree is balanced.

A balanced tree has a height difference of at most 1 between left and right subtrees at every node. Use a recursive helper that returns the height or -1 if unbalanced. O(n) time, O(h) space.

```javascript
function isBalanced(root) {
  function check(node) {
    if (!node) return 0;
    const left = check(node.left);
    const right = check(node.right);
    if (left === -1 || right === -1 || Math.abs(left - right) > 1) return -1;
    return 1 + Math.max(left, right);
  }
  return check(root) !== -1;
}
```

---

## 19. Perform level-order traversal (BFS) of a binary tree.

Use a queue starting with the root. At each level, process all nodes currently in the queue, adding their children for the next level. O(n) time, O(w) space where w is max width.

```javascript
function levelOrder(root) {
  if (!root) return [];
  const result = [], queue = [root];
  while (queue.length) {
    const level = [];
    const len = queue.length;
    for (let i = 0; i < len; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}
```

---

## 20. Find the lowest common ancestor of two nodes in a binary tree.

Recursively search left and right subtrees. If both sides return non-null, the current node is the LCA. If one side returns null, propagate the other side. O(n) time, O(h) space.

```javascript
function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) return root;
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  if (left && right) return root;
  return left || right;
}
```

---

## 21. Implement quicksort and explain its time complexity.

Pick a pivot, partition the array so elements smaller than the pivot go left and larger go right, then recursively sort the partitions. Average O(n log n), worst O(n²) when pivot is consistently the smallest or largest element. In-place with O(log n) stack space.

```javascript
function quickSort(arr, low = 0, high = arr.length - 1) {
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
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}
```

---

## 22. Implement mergesort and explain its time complexity.

Divide the array into halves recursively until single elements, then merge sorted halves by comparing heads. Always O(n log n) time regardless of input order, O(n) auxiliary space.

```javascript
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}
```

---

## 23. Explain the difference between BFS and DFS, and when to use each.

BFS explores level by level using a queue; DFS explores depth-first using a stack (or recursion). BFS is optimal for shortest path in unweighted graphs and finding connected components. DFS uses less memory on deep graphs and is better for topological sorting, cycle detection, and backtracking problems.

```javascript
// BFS example
function bfs(root) {
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    console.log(node.val);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
}

// DFS example (inorder)
function dfs(root) {
  if (!root) return;
  dfs(root.left);
  console.log(root.val);
  dfs(root.right);
}
```

---

## 24. Solve the 'number of islands' problem using DFS/BFS on a grid.

Iterate through every cell. When a '1' is found, increment count and flood-fill (DFS or BFS) to mark all connected '1's as visited. O(m × n) time, O(m × n) space in worst case for the recursion stack or queue.

```javascript
function numIslands(grid) {
  let count = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === '1') {
        count++;
        dfs(grid, r, c);
      }
    }
  }
  return count;
}

function dfs(grid, r, c) {
  if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] === '0') return;
  grid[r][c] = '0';
  dfs(grid, r + 1, c);
  dfs(grid, r - 1, c);
  dfs(grid, r, c + 1);
  dfs(grid, r, c - 1);
}
```

---

## 25. Implement a trie (prefix tree) for autocomplete.

Each node contains an array/object of children and a boolean marking the end of a word. Insert, search, and startsWith traverse character by character. For autocomplete, DFS from the prefix node to collect all words. O(L) per operation where L is word length.

```javascript
class TrieNode {
  constructor() {
    this.children = {};
    this.isEnd = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }
  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) node.children[ch] = new TrieNode();
      node = node.children[ch];
    }
    node.isEnd = true;
  }
  search(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) return false;
      node = node.children[ch];
    }
    return node.isEnd;
  }
  startsWith(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children[ch]) return false;
      node = node.children[ch];
    }
    return true;
  }
  autocomplete(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children[ch]) return [];
      node = node.children[ch];
    }
    const results = [];
    function dfs(n, path) {
      if (n.isEnd) results.push(prefix + path);
      for (const ch of Object.keys(n.children)) {
        dfs(n.children[ch], path + ch);
      }
    }
    dfs(node, '');
    return results;
  }
}
```

---

## 26. Find all permutations of a string.

Use backtracking — swap each character into the current position and recurse for the next position. Base case: when the position reaches the end, save the permutation. O(n × n!) time, O(n) space for recursion.

```javascript
function permute(str) {
  const result = [];
  const arr = str.split('');
  function backtrack(start) {
    if (start === arr.length) {
      result.push(arr.join(''));
      return;
    }
    for (let i = start; i < arr.length; i++) {
      [arr[start], arr[i]] = [arr[i], arr[start]];
      backtrack(start + 1);
      [arr[start], arr[i]] = [arr[i], arr[start]];
    }
  }
  backtrack(0);
  return result;
}
```

---

## 27. Solve the coin change problem using dynamic programming.

Build a dp array where dp[i] = minimum coins needed to make amount i. For each coin, update dp[i] = min(dp[i], dp[i - coin] + 1). Bottom-up approach. O(amount × n) time, O(amount) space.

```javascript
function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
```

---

## 28. Find the longest common subsequence between two strings.

Use 2D DP where dp[i][j] = LCS length of text1[0..i-1] and text2[0..j-1]. If chars match, dp[i][j] = 1 + dp[i-1][j-1]; else take max of excluding one char. O(m × n) time, O(m × n) space (can be optimized to O(n)).

```javascript
function longestCommonSubsequence(text1, text2) {
  const m = text1.length, n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}
```

---

## 29. Implement a min-heap and explain heap sort.

A min-heap is a complete binary tree where each parent is ≤ its children. Heapify ensures the heap property. Heap sort builds a max-heap (or min-heap), repeatedly swaps root with last element, and heapifies the reduced range. O(n log n) time, O(1) space for heap sort.

```javascript
class MinHeap {
  constructor() {
    this.heap = [];
  }
  getParent(i) { return Math.floor((i - 1) / 2); }
  getLeft(i) { return 2 * i + 1; }
  getRight(i) { return 2 * i + 2; }
  push(val) {
    this.heap.push(val);
    this._siftUp(this.heap.length - 1);
  }
  pop() {
    if (this.heap.length === 1) return this.heap.pop();
    const top = this.heap[0];
    this.heap[0] = this.heap.pop();
    this._siftDown(0);
    return top;
  }
  _siftUp(i) {
    while (i > 0 && this.heap[i] < this.heap[this.getParent(i)]) {
      [this.heap[i], this.heap[this.getParent(i)]] = [this.heap[this.getParent(i)], this.heap[i]];
      i = this.getParent(i);
    }
  }
  _siftDown(i) {
    const size = this.heap.length;
    while (true) {
      let smallest = i;
      const l = this.getLeft(i), r = this.getRight(i);
      if (l < size && this.heap[l] < this.heap[smallest]) smallest = l;
      if (r < size && this.heap[r] < this.heap[smallest]) smallest = r;
      if (smallest === i) break;
      [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
      i = smallest;
    }
  }
}

function heapSort(arr) {
  const heap = new MinHeap();
  for (const val of arr) heap.push(val);
  const result = [];
  while (heap.heap.length) result.push(heap.pop());
  return result;
}
```

---

## 30. Detect if a graph has a cycle (directed and undirected).

For undirected: use DFS with a parent check — if a neighbor is visited and not parent, cycle exists. For directed: track recursion stack (or use Kahn's algorithm with in-degree counts). O(V + E) time, O(V) space.

```javascript
function hasCycleUndirected(graph) {
  const visited = new Set();
  function dfs(node, parent) {
    visited.add(node);
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor, node)) return true;
      } else if (neighbor !== parent) return true;
    }
    return false;
  }
  for (const node in graph) {
    if (!visited.has(node) && dfs(node, null)) return true;
  }
  return false;
}

function hasCycleDirected(graph) {
  const visited = new Set(), recStack = new Set();
  function dfs(node) {
    visited.add(node);
    recStack.add(node);
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (recStack.has(neighbor)) return true;
    }
    recStack.delete(node);
    return false;
  }
  for (const node in graph) {
    if (!visited.has(node) && dfs(node)) return true;
  }
  return false;
}
```

---

## 31. Explain time and space complexity (Big O notation) with examples.

Big O describes how runtime or memory grows relative to input size. O(1) = constant (array access), O(log n) = logarithmic (binary search), O(n) = linear (single loop), O(n log n) = linearithmic (mergesort), O(n²) = quadratic (nested loops), O(2ⁿ) = exponential (recursive Fibonacci).

```javascript
// O(1) - constant
function getFirst(arr) { return arr[0]; }

// O(n) - linear
function sum(arr) { let s = 0; for (const x of arr) s += x; return s; }

// O(n²) - quadratic
function pairSum(arr) {
  for (let i = 0; i < arr.length; i++)
    for (let j = 0; j < arr.length; j++)
      console.log(arr[i] + arr[j]);
}

// O(log n) - logarithmic
function countSteps(n) { let c = 0; while (n > 1) { n = Math.floor(n / 2); c++; } return c; }

// O(2ⁿ) - exponential
function fib(n) { if (n <= 1) return n; return fib(n - 1) + fib(n - 2); }
```

---

## 32. Find the shortest path in a weighted graph (Dijkstra's algorithm).

Use a min-heap (priority queue) starting from the source. Pop the node with the smallest distance, relax its neighbors (update if a shorter path is found). Continue until all reachable nodes are processed. O((V + E) log V) with a binary heap, O(V) space.

```javascript
function dijkstra(graph, start) {
  const dist = {};
  const pq = [[0, start]];
  for (const node in graph) dist[node] = Infinity;
  dist[start] = 0;
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift();
    if (d > dist[u]) continue;
    for (const [v, w] of graph[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        pq.push([dist[v], v]);
      }
    }
  }
  return dist;
}
```

---

## 33. Implement a hash map from scratch and explain collision handling.

Use an array of buckets; on put, compute index via hash function % capacity. Handle collisions with separate chaining (each bucket stores a linked list of entries). On get, search the chain at the computed bucket. Average O(1), worst O(n).

```javascript
class HashMap {
  constructor(capacity = 16) {
    this.buckets = Array.from({ length: capacity }, () => []);
    this.capacity = capacity;
    this.size = 0;
  }
  _hash(key) {
    let hash = 0;
    for (const ch of String(key)) {
      hash = (hash * 31 + ch.charCodeAt(0)) % this.capacity;
    }
    return hash;
  }
  put(key, value) {
    const idx = this._hash(key);
    const bucket = this.buckets[idx];
    for (const entry of bucket) {
      if (entry.key === key) {
        entry.value = value;
        return;
      }
    }
    bucket.push({ key, value });
    this.size++;
  }
  get(key) {
    const idx = this._hash(key);
    const bucket = this.buckets[idx];
    for (const entry of bucket) {
      if (entry.key === key) return entry.value;
    }
    return undefined;
  }
  remove(key) {
    const idx = this._hash(key);
    const bucket = this.buckets[idx];
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i].key === key) {
        bucket.splice(i, 1);
        this.size--;
        return true;
      }
    }
    return false;
  }
}
```

---

## 34. Solve the 'N-Queens' problem using backtracking.

Place queens column by column. At each column, try every row; if safe (no same row, diagonal, or anti-diagonal conflicts), place and recurse. Backtrack if no valid placement exists. O(n!) time, O(n) space.

```javascript
function solveNQueens(n) {
  const result = [];
  const board = Array.from({ length: n }, () => Array(n).fill('.'));
  const cols = new Set(), diags = new Set(), antiDiags = new Set();
  function backtrack(row) {
    if (row === n) {
      result.push(board.map(r => r.join('')));
      return;
    }
    for (let col = 0; col < n; col++) {
      const diag = row - col, antiDiag = row + col;
      if (cols.has(col) || diags.has(diag) || antiDiags.has(antiDiag)) continue;
      board[row][col] = 'Q';
      cols.add(col); diags.add(diag); antiDiags.add(antiDiag);
      backtrack(row + 1);
      board[row][col] = '.';
      cols.delete(col); diags.delete(diag); antiDiags.delete(antiDiag);
    }
  }
  backtrack(0);
  return result;
}
```

---

## 35. Rotate an array by k positions in place.

Reverse the entire array, then reverse the first k elements, then reverse the rest. k = k % n handles shifts larger than the array length. O(n) time, O(1) space.

```javascript
function rotate(nums, k) {
  k = k % nums.length;
  reverse(nums, 0, nums.length - 1);
  reverse(nums, 0, k - 1);
  reverse(nums, k, nums.length - 1);
}

function reverse(arr, start, end) {
  while (start < end) {
    [arr[start], arr[end]] = [arr[end], arr[start]];
    start++;
    end--;
  }
}
```

---
