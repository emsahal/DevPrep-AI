import type { QuestionData } from '../types';

export const level3Questions: QuestionData[] = [
  // ==================== LINKED LIST (5 questions) ====================
  {
    id: 'reverse-linked-list',
    title: 'Reverse a Linked List',
    difficulty: 'Medium',
    topic: 'Linked List',
    level: 3,
    problem:
      'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    example:
      'Input: head = [1,2,3,4,5]\nOutput: [5,4,3,2,1]\n\nExplanation: The linked list 1->2->3->4->5 is reversed to 5->4->3->2->1.',
    intuition:
      'We iterate through the list using three pointers (prev, curr, next) to reverse each node\'s link direction. At each step, save the next node, point current back to previous, then advance both prev and curr. This reverses the list in-place with O(1) extra space.',
    steps: [
      {
        title: 'Initialize Pointers',
        description:
          'Set prev to nullptr and curr to head. The prev pointer tracks the reversed portion, curr traverses the original list.',
        why: 'Two pointers: prev builds the reversed list backwards, curr iterates forward through the original list.',
        animations: [
          { type: 'showVariable' as any, target: 'prev', value: 'nullptr', color: '#6B7280', label: 'prev = nullptr' },
          { type: 'showVariable' as any, target: 'curr', value: 'head (Node 1)', color: '#3B82F6', label: 'curr = head' },
          { type: 'highlightNode' as any, target: 'node-1', color: '#3B82F6', label: 'head / curr' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#3B82F6', label: 'prev = nullptr, curr = head' },
        ],
      },
      {
        title: 'Store Next Node',
        description:
          'Save the next node before overwriting curr->next. This preserves the rest of the list so we can continue traversal.',
        why: 'Once we reverse the link of curr, we lose access to the rest of the list unless we save it first.',
        animations: [
          { type: 'showVariable' as any, target: 'nextTemp', value: 'Node 2', color: '#F97316', label: 'next = curr->next' },
          { type: 'moveArrow' as any, target: 'curr-next', from: 'curr', to: 'nextTemp', color: '#F97316' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#F97316', label: 'ListNode* next = curr->next' },
        ],
      },
      {
        title: 'Reverse the Link',
        description:
          'Point curr->next to prev. This reverses the edge direction for the current node.',
        why: 'Core reversal step: the node now points backward to the previous node instead of forward.',
        animations: [
          { type: 'disconnectNodes' as any, target: ['curr', 'nextTemp'], color: '#EF4444' },
          { type: 'connectNodes' as any, target: ['curr', 'prev'], color: '#22C55E' },
          { type: 'showVariable' as any, target: 'curr.next', value: 'prev (nullptr)', color: '#22C55E', label: 'curr->next = prev' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#22C55E', label: 'curr->next = prev' },
        ],
      },
      {
        title: 'Advance Pointers',
        description:
          'Move prev to curr and curr to next. This shifts the window forward so we can reverse the next node.',
        why: 'After reversing the current node, slide the window: prev becomes the newly reversed node, curr moves to the next unprocessed node.',
        animations: [
          { type: 'updateVariable' as any, target: 'prev', value: 'Node 1', from: 'nullptr', color: '#F97316', label: 'prev = curr' },
          { type: 'updateVariable' as any, target: 'curr', value: 'Node 2', from: 'Node 1', color: '#F97316', label: 'curr = next' },
          { type: 'moveArrow' as any, target: 'prev-pos', from: 'null', to: 'Node 1', color: '#F97316' },
          { type: 'moveArrow' as any, target: 'curr-pos', from: 'Node 1', to: 'Node 2', color: '#F97316' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#F97316', label: 'prev = curr; curr = next' },
        ],
      },
      {
        title: 'Repeat Until End',
        description:
          'Continue: save next, reverse link, advance pointers. Stop when curr reaches nullptr.',
        why: 'Each iteration processes one node. When curr is null, all nodes are reversed and prev points to the new head.',
        animations: [
          { type: 'showText' as any, value: 'Loop iteration 2: processing Node 2', color: '#3B82F6' },
          { type: 'highlightNode' as any, target: 'node-2', color: '#EAB308', label: 'curr at Node 2' },
          { type: 'showVariable' as any, target: 'prev', value: 'Node 1', color: '#6B7280', label: 'prev = Node 1' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#EAB308', label: 'while (curr != nullptr)' },
        ],
      },
      {
        title: 'Return New Head',
        description:
          'After the loop, prev points to the last node processed, the new head of the reversed list.',
        why: 'When curr becomes null, prev is at the last node, now the first node of the reversed list.',
        animations: [
          { type: 'glow' as any, target: 'node-5', color: '#22C55E', label: 'New Head: Node 5' },
          { type: 'showVariable' as any, target: 'newHead', value: 'prev (Node 5)', color: '#22C55E', label: 'return prev' },
          { type: 'showText' as any, value: 'List reversed! 5 -> 4 -> 3 -> 2 -> 1', color: '#22C55E' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#22C55E', label: 'return prev' },
        ],
      },
    ],
    pseudocode: [
      'function reverseList(head):',
      '  prev = nullptr',
      '  curr = head',
      '',
      '  while curr != nullptr:',
      '    next = curr.next',
      '    curr.next = prev',
      '    prev = curr',
      '    curr = next',
      '',
      '  return prev  // New head',
    ],
    code: {
      cpp: `ListNode* reverseList(ListNode* head) {
  ListNode* prev = nullptr;
  ListNode* curr = head;

  while (curr != nullptr) {
    ListNode* next = curr->next;
    curr->next = prev;
    prev = curr;
    curr = next;
  }

  return prev;
}`,
      javascript: `function reverseList(head) {
  let prev = null;
  let curr = head;

  while (curr !== null) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }

  return prev;
}`,
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    commonMistakes: [
      'Forgetting to save next before overwriting curr->next, losing the rest of the list',
      'Returning curr instead of prev (curr is always nullptr at the end)',
      'Starting prev at head instead of nullptr',
      'Not handling the empty list edge case',
    ],
    tips: [
      'Draw the pointers at each step to build intuition',
      'The pattern (save -> reverse -> advance) works for any singly linked list reversal',
      'Foundation for reverse K-group and palindrome check problems',
      'Use a debugger to trace prev, curr, and next values',
    ],
    inputExample: { head: [1, 2, 3, 4, 5] },
  },

  {
    id: 'detect-loop',
    title: 'Detect Cycle in Linked List',
    difficulty: 'Medium',
    topic: 'Linked List',
    level: 3,
    problem:
      'Given the head of a linked list, determine if the linked list has a cycle. A cycle occurs when a node\'s next pointer points back to a previous node.',
    example:
      'Input: head = [3,2,0,-4], pos = 1 (tail connects to node at index 1)\nOutput: true\n\nExplanation: The tail node (-4) points back to node 2, forming a cycle.',
    intuition:
      'Floyd\'s Cycle Detection (Tortoise and Hare) uses two pointers at different speeds. If a cycle exists, the fast pointer will eventually lap the slow pointer and they will meet. If fast reaches null, there is no cycle. O(n) time, O(1) space.',
    steps: [
      {
        title: 'Initialize Slow and Fast',
        description:
          'Set both slow and fast pointers to the head of the linked list.',
        why: 'Both pointers start at the same position. Slow moves one step, fast moves two steps per iteration.',
        animations: [
          { type: 'showVariable' as any, target: 'slow', value: 'head (Node 3)', color: '#3B82F6', label: 'slow = head' },
          { type: 'showVariable' as any, target: 'fast', value: 'head (Node 3)', color: '#3B82F6', label: 'fast = head' },
          { type: 'highlightNode' as any, target: 'node-3', color: '#3B82F6', label: 'slow & fast at head' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#3B82F6', label: 'slow = fast = head' },
        ],
      },
      {
        title: 'Move Pointers',
        description:
          'Move slow by one step and fast by two steps through the list.',
        why: 'The speed difference (1 vs 2) ensures fast will catch up to slow from behind if a cycle exists.',
        animations: [
          { type: 'visitNode' as any, target: 'node-2', color: '#3B82F6', label: 'slow -> Node 2' },
          { type: 'visitNode' as any, target: 'node-0', color: '#EAB308', label: 'fast -> Node 0 (skipped Node 2)' },
          { type: 'moveArrow' as any, target: 'slow-pos', from: 'Node 3', to: 'Node 2', color: '#3B82F6' },
          { type: 'moveArrow' as any, target: 'fast-pos', from: 'Node 3', to: 'Node 0', color: '#EAB308' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#EAB308', label: 'slow = slow->next; fast = fast->next->next' },
        ],
      },
      {
        title: 'Fast Enters Cycle',
        description:
          'Continue moving. Fast enters the cycle first by moving from tail to node 2 via the cycle link.',
        why: 'Fast moves faster so it circles around the cycle and approaches slow from behind.',
        animations: [
          { type: 'visitNode' as any, target: 'node--4', color: '#EAB308', label: 'fast -> Node -4 (tail)' },
          { type: 'visitNode' as any, target: 'node-0', color: '#3B82F6', label: 'slow -> Node 0' },
          { type: 'moveArrow' as any, target: 'slow-pos', from: 'Node 2', to: 'Node 0', color: '#3B82F6' },
          { type: 'moveArrow' as any, target: 'fast-pos', from: 'Node 0', to: 'Node -4', color: '#EAB308' },
          { type: 'showText' as any, value: 'Fast at tail. Next step wraps through cycle!', color: '#F97316' },
        ],
      },
      {
        title: 'Fast Loops Through Cycle',
        description:
          'Fast wraps from tail back to node 2 via the cycle link. Slow moves to node -4.',
        why: 'In a cycle, fast continues circling and will eventually meet slow.',
        animations: [
          { type: 'visitNode' as any, target: 'node-2', color: '#EAB308', label: 'fast cycles -> Node 2' },
          { type: 'visitNode' as any, target: 'node--4', color: '#3B82F6', label: 'slow -> Node -4' },
          { type: 'moveArrow' as any, target: 'fast-pos', from: 'Node -4', to: 'Node 2', color: '#EAB308' },
          { type: 'showVariable' as any, target: 'dist', value: 'fast is 1 step behind slow', color: '#F97316', label: 'Closing distance' },
        ],
      },
      {
        title: 'Pointers Meet — Cycle Detected',
        description:
          'Slow and fast meet at the same node, proving a cycle exists.',
        why: 'If fast catches up to slow, they must be in a cycle because fast would have reached the end in a linear list.',
        animations: [
          { type: 'visitNode' as any, target: 'node-0', color: '#22C55E', label: 'slow & fast MEET at Node 0!' },
          { type: 'glow' as any, target: 'node-0', color: '#22C55E', label: 'CYCLE DETECTED' },
          { type: 'showVariable' as any, target: 'result', value: 'true (cycle exists)', color: '#22C55E', label: 'return true' },
          { type: 'showText' as any, value: 'slow == fast -> Cycle exists!', color: '#22C55E' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#22C55E', label: 'if (slow == fast) return true' },
        ],
      },
      {
        title: 'Final Result',
        description:
          'The algorithm confirms a cycle. Return true.',
        animations: [
          { type: 'showText' as any, value: 'Cycle detected! Returns true.', color: '#22C55E', label: 'Done' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#22C55E', label: 'return false (unreached)' },
        ],
      },
    ],
    pseudocode: [
      'function hasCycle(head):',
      '  if head == null: return false',
      '',
      '  slow = head',
      '  fast = head',
      '',
      '  while fast != null AND fast.next != null:',
      '    slow = slow.next',
      '    fast = fast.next.next',
      '',
      '    if slow == fast: return true',
      '',
      '  return false  // No cycle',
    ],
    code: {
      cpp: `bool hasCycle(ListNode* head) {
  if (head == nullptr) return false;

  ListNode* slow = head;
  ListNode* fast = head;

  while (fast != nullptr && fast->next != nullptr) {
    slow = slow->next;
    fast = fast->next->next;

    if (slow == fast) return true;
  }

  return false;
}`,
      javascript: `function hasCycle(head) {
  if (head === null) return false;

  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;

    if (slow === fast) return true;
  }

  return false;
}`,
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    commonMistakes: [
      'Using slow = slow.next.next (moving slow by 2) instead of slow = slow.next',
      'Not checking fast->next before accessing fast->next->next (null pointer dereference)',
      'Starting fast ahead (fast = head->next) which changes the meeting condition',
      'Forgetting to handle the empty list edge case',
    ],
    tips: [
      'The distance from head to cycle start equals distance from meeting point to cycle start (for finding cycle entry)',
      'If fast reaches null or fast.next is null, there is definitely no cycle',
      'The relative speed of fast to slow is 1 step per iteration, guaranteeing a meet within O(n)',
      'Also known as Floyd\'s Tortoise and Hare algorithm',
    ],
    inputExample: { head: [3, 2, 0, -4], pos: 1 },
  },

  {
    id: 'find-middle-node',
    title: 'Find Middle of Linked List',
    difficulty: 'Easy',
    topic: 'Linked List',
    level: 3,
    problem:
      'Given the head of a singly linked list, return the middle node. If there are two middle nodes (even length), return the second middle node.',
    example:
      'Input: head = [1,2,3,4,5]\nOutput: Node with value 3\n\nInput: head = [1,2,3,4,5,6]\nOutput: Node with value 4 (second middle)',
    intuition:
      'Use slow and fast pointers. Slow moves one step, fast moves two steps. When fast reaches the end, slow is at the middle. For even-length lists, fast ends at null and slow points to the second middle node.',
    steps: [
      {
        title: 'Initialize Pointers',
        description:
          'Set both slow and fast pointers to the head of the list.',
        why: 'Both start at head. The speed difference naturally places slow at the middle when fast finishes.',
        animations: [
          { type: 'showVariable' as any, target: 'slow', value: 'head (Node 1)', color: '#3B82F6', label: 'slow = head' },
          { type: 'showVariable' as any, target: 'fast', value: 'head (Node 1)', color: '#3B82F6', label: 'fast = head' },
          { type: 'highlightNode' as any, target: 'node-1', color: '#3B82F6', label: 'Start' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#3B82F6', label: 'slow = fast = head' },
        ],
      },
      {
        title: 'First Advance',
        description:
          'Move slow one step (to node 2) and fast two steps (to node 3).',
        why: 'Slow covers 1 node, fast covers 2. This creates the 2x speed ratio for middle detection.',
        animations: [
          { type: 'visitNode' as any, target: 'node-2', color: '#3B82F6', label: 'slow -> Node 2' },
          { type: 'visitNode' as any, target: 'node-3', color: '#EAB308', label: 'fast -> Node 3' },
          { type: 'moveArrow' as any, target: 'slow-pos', from: 'Node 1', to: 'Node 2', color: '#3B82F6' },
          { type: 'moveArrow' as any, target: 'fast-pos', from: 'Node 1', to: 'Node 3', color: '#EAB308' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#EAB308', label: 'slow = slow->next; fast = fast->next->next' },
        ],
      },
      {
        title: 'Continue Traversal',
        description:
          'For a 5-node list, slow goes to node 3 while fast goes to node 5.',
        why: 'With each iteration, slow catches up proportionally. When fast hits the last node, slow reaches the middle.',
        animations: [
          { type: 'visitNode' as any, target: 'node-3', color: '#3B82F6', label: 'slow -> Node 3' },
          { type: 'visitNode' as any, target: 'node-5', color: '#EAB308', label: 'fast -> Node 5 (last)' },
          { type: 'moveArrow' as any, target: 'slow-pos', from: 'Node 2', to: 'Node 3', color: '#3B82F6' },
          { type: 'moveArrow' as any, target: 'fast-pos', from: 'Node 3', to: 'Node 5', color: '#EAB308' },
          { type: 'showText' as any, value: 'fast->next == nullptr, loop will stop', color: '#F97316' },
        ],
      },
      {
        title: 'Fast Reaches End',
        description:
          'Fast is at the last node. Loop condition fast && fast->next fails.',
        why: 'For odd length (5), fast ends at node 5 whose next is null. Slow is exactly at the middle (node 3).',
        animations: [
          { type: 'showVariable' as any, target: 'fast.next', value: 'nullptr', color: '#6B7280', label: 'fast->next == null' },
          { type: 'glow' as any, target: 'node-3', color: '#22C55E', label: 'MIDDLE = Node 3' },
          { type: 'showVariable' as any, target: 'middle', value: 'slow (Node 3)', color: '#22C55E', label: 'return slow' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#22C55E', label: 'while (fast && fast->next)' },
        ],
      },
      {
        title: 'Return Middle Node',
        description:
          'Return the node pointed to by slow — the middle node (second middle for even-length).',
        why: 'When fast reaches the end, slow has traveled exactly half the distance, making it the middle.',
        animations: [
          { type: 'glow' as any, target: 'node-3', color: '#22C55E', label: 'Answer: Node 3' },
          { type: 'showVariable' as any, target: 'result', value: 'Node with value 3', color: '#22C55E', label: 'Middle = 3' },
          { type: 'showText' as any, value: 'Middle node of [1,2,3,4,5] is Node 3', color: '#22C55E' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#22C55E', label: 'return slow' },
        ],
      },
    ],
    pseudocode: [
      'function middleNode(head):',
      '  slow = head',
      '  fast = head',
      '',
      '  while fast != null AND fast.next != null:',
      '    slow = slow.next',
      '    fast = fast.next.next',
      '',
      '  return slow',
    ],
    code: {
      cpp: `ListNode* middleNode(ListNode* head) {
  ListNode* slow = head;
  ListNode* fast = head;

  while (fast != nullptr && fast->next != nullptr) {
    slow = slow->next;
    fast = fast->next->next;
  }

  return slow;
}`,
      javascript: `function middleNode(head) {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }

  return slow;
}`,
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    commonMistakes: [
      'Checking only fast != nullptr, missing fast->next check',
      'Moving slow by 2 and fast by 1 (reversed speeds)',
      'Returning head instead of slow',
      'For even-length lists, this returns the second middle. To get the first, stop when fast->next->next is null.',
    ],
    tips: [
      'For even-length lists this returns the second middle node by default',
      'Same technique finds any fraction (1/3, 1/4, etc.) using different speeds',
      'One-pass algorithm, useful for binary search on linked lists and palindrome checks',
      'Works great as a subroutine for reorder list problems',
    ],
    inputExample: { head: [1, 2, 3, 4, 5] },
  },

  {
    id: 'merge-two-lists',
    title: 'Merge Two Sorted Linked Lists',
    difficulty: 'Easy',
    topic: 'Linked List',
    level: 3,
    problem:
      'Merge two sorted linked lists into one sorted linked list. The new list should be made by splicing together the nodes of the original two lists.',
    example:
      'Input: list1 = [1,2,4], list2 = [1,3,4]\nOutput: [1,1,2,3,4,4]\n\nExplanation: The merged list maintains ascending order by comparing heads at each step.',
    intuition:
      'Use a dummy node to simplify merging logic. Compare heads of both lists, attach the smaller node to the result, and advance that list\'s pointer. When one list empties, attach the remainder of the other. The dummy node eliminates special cases for the head.',
    steps: [
      {
        title: 'Create Dummy Node',
        description:
          'Create a dummy node as the starting point. Set a tail pointer to dummy.',
        why: 'The dummy node avoids handling edge cases for inserting at the head. Final result is dummy->next.',
        animations: [
          { type: 'highlight' as any, target: 'dummy', color: '#3B82F6', label: 'dummy = new ListNode(0)' },
          { type: 'showVariable' as any, target: 'tail', value: 'dummy', color: '#3B82F6', label: 'tail = dummy' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#3B82F6', label: 'ListNode dummy(0); ListNode* tail = &dummy' },
        ],
      },
      {
        title: 'Compare First Nodes',
        description:
          'Compare list1 (1) and list2 (1). They are equal, so either can be attached.',
        why: 'We always pick the smaller (or equal) value to maintain sorted order in the merged list.',
        animations: [
          { type: 'compare' as any, target: ['list1-head', 'list2-head'], color: '#EAB308', label: 'Compare 1 vs 1' },
          { type: 'showVariable' as any, target: 'list1.val', value: '1', color: '#EAB308', label: 'list1 = 1' },
          { type: 'showVariable' as any, target: 'list2.val', value: '1', color: '#EAB308', label: 'list2 = 1' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#EAB308', label: 'if (list1->val <= list2->val)' },
        ],
      },
      {
        title: 'Attach Smaller Node',
        description:
          'Attach list1\'s node (value 1) to the merged list. Advance list1 to its next node.',
        animations: [
          { type: 'connectNodes' as any, target: ['dummy', 'list1-node'], color: '#22C55E' },
          { type: 'moveArrow' as any, target: 'list1-pos', from: 'Node 1', to: 'Node 2', color: '#F97316' },
          { type: 'updateVariable' as any, target: 'tail', value: 'list1.node', color: '#22C55E', label: 'tail = tail->next' },
          { type: 'showVariable' as any, target: 'merged', value: '[1]', color: '#22C55E', label: 'Merged: [1]' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#22C55E', label: 'tail->next = list1; list1 = list1->next' },
        ],
      },
      {
        title: 'Compare Next Pair',
        description:
          'Now list1=[2,4], list2=[1,3,4]. Compare 2 vs 1. list2\'s node (1) is smaller.',
        why: '1 < 2, so pick from list2 to maintain sorted order.',
        animations: [
          { type: 'compare' as any, target: ['list1-head', 'list2-head'], color: '#EAB308', label: 'Compare 2 vs 1' },
          { type: 'showVariable' as any, target: 'list1.val', value: '2', color: '#EAB308', label: 'list1 = 2' },
          { type: 'showVariable' as any, target: 'list2.val', value: '1', color: '#EAB308', label: 'list2 = 1 (smaller)' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#EAB308', label: 'else (list2 is smaller)' },
        ],
      },
      {
        title: 'Attach from List2',
        description:
          'Attach list2\'s node (value 1) to merged list. Advance list2 pointer.',
        animations: [
          { type: 'connectNodes' as any, target: ['tail', 'list2-node'], color: '#22C55E' },
          { type: 'moveArrow' as any, target: 'list2-pos', from: 'Node 1', to: 'Node 3', color: '#F97316' },
          { type: 'updateVariable' as any, target: 'tail', value: 'list2.node', color: '#22C55E', label: 'tail = tail->next' },
          { type: 'showVariable' as any, target: 'merged', value: '[1, 1]', color: '#22C55E', label: 'Merged: [1,1]' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#22C55E', label: 'tail->next = list2; list2 = list2->next' },
        ],
      },
      {
        title: 'Continue Merging',
        description:
          'Continue comparing and attaching until one list becomes empty.',
        animations: [
          { type: 'showText' as any, value: 'Continue: pick 2, then 3, then 4, then 4', color: '#3B82F6' },
          { type: 'showVariable' as any, target: 'merged', value: '[1, 1, 2, 3]', color: '#3B82F6', label: 'Merged: [1,1,2,3]' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#3B82F6', label: 'while (list1 && list2)' },
        ],
      },
      {
        title: 'Attach Remaining',
        description:
          'One list is empty. Attach remaining nodes from the non-empty list directly.',
        why: 'Both lists are sorted, so remaining nodes are all larger than the last attached node and already sorted.',
        animations: [
          { type: 'connectNodes' as any, target: ['tail', 'list2-remaining'], color: '#22C55E' },
          { type: 'glow' as any, target: 'merged-list', color: '#22C55E', label: 'Final merged list' },
          { type: 'showVariable' as any, target: 'merged', value: '[1, 1, 2, 3, 4, 4]', color: '#22C55E', label: 'Merged: [1,1,2,3,4,4]' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#22C55E', label: 'tail->next = (list1) ? list1 : list2' },
        ],
      },
      {
        title: 'Return Merged List',
        description:
          'Return dummy->next as the head of the merged sorted list.',
        animations: [
          { type: 'showVariable' as any, target: 'result', value: 'dummy->next (Node 1)', color: '#22C55E', label: 'return dummy->next' },
          { type: 'showText' as any, value: 'Merged: [1, 1, 2, 3, 4, 4]', color: '#22C55E' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#22C55E', label: 'return dummy.next' },
        ],
      },
    ],
    pseudocode: [
      'function mergeTwoLists(list1, list2):',
      '  dummy = new ListNode(0)',
      '  tail = dummy',
      '',
      '  while list1 != null AND list2 != null:',
      '    if list1.val <= list2.val:',
      '      tail.next = list1',
      '      list1 = list1.next',
      '    else:',
      '      tail.next = list2',
      '      list2 = list2.next',
      '    tail = tail.next',
      '',
      '  if list1 != null: tail.next = list1',
      '  if list2 != null: tail.next = list2',
      '  return dummy.next',
    ],
    code: {
      cpp: `ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
  ListNode dummy(0);
  ListNode* tail = &dummy;

  while (list1 != nullptr && list2 != nullptr) {
    if (list1->val <= list2->val) {
      tail->next = list1;
      list1 = list1->next;
    } else {
      tail->next = list2;
      list2 = list2->next;
    }
    tail = tail->next;
  }

  tail->next = (list1 != nullptr) ? list1 : list2;
  return dummy.next;
}`,
      javascript: `function mergeTwoLists(list1, list2) {
  const dummy = new ListNode(0);
  let tail = dummy;

  while (list1 !== null && list2 !== null) {
    if (list1.val <= list2.val) {
      tail.next = list1;
      list1 = list1.next;
    } else {
      tail.next = list2;
      list2 = list2.next;
    }
    tail = tail.next;
  }

  tail.next = list1 !== null ? list1 : list2;
  return dummy.next;
}`,
    },
    complexity: { time: 'O(n + m)', space: 'O(1)' },
    commonMistakes: [
      'Not using a dummy node, requiring special case handling for the first node',
      'Forgetting to advance the tail pointer after attaching a node',
      'Creating new nodes instead of reusing existing list nodes (extra memory)',
      'Not handling the case where one or both lists are empty',
    ],
    tips: [
      'The dummy node pattern is extremely useful for linked list construction problems',
      'Can extend to merge K sorted lists by repeatedly merging pairs',
      'This solution uses O(1) extra space beyond the input lists',
      'This merge step is the foundation of merge sort for linked lists',
    ],
    inputExample: { list1: [1, 2, 4], list2: [1, 3, 4] },
  },

  {
    id: 'delete-node',
    title: 'Delete Node in a Linked List',
    difficulty: 'Medium',
    topic: 'Linked List',
    level: 3,
    problem:
      'Delete a node from a singly linked list given only access to that node. The node to delete is not the tail.',
    example:
      'Input: head = [4,5,1,9], node = 5\nOutput: [4,1,9]\n\nExplanation: Node 5 is removed without access to the head.',
    intuition:
      'Since we only have access to the node to delete (not the head or previous node), we copy the next node\'s value into the current node and then bypass the next node. This effectively "deletes" the current node by overwriting it with its successor.',
    steps: [
      {
        title: 'Identify the Node',
        description:
          'We are given the node to delete directly (value 5). No access to head.',
        why: 'Key constraint: we only have a reference to the node itself, not the previous node.',
        animations: [
          { type: 'highlightNode' as any, target: 'node-5', color: '#EF4444', label: 'Node to delete: 5' },
          { type: 'showVariable' as any, target: 'node', value: 'Node(5)', color: '#EF4444', label: 'given node = Node(5)' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#EF4444', label: 'void deleteNode(ListNode* node)' },
        ],
      },
      {
        title: 'Check Constraints',
        description:
          'Problem guarantees node is not the tail, so node->next is valid.',
        why: 'This constraint is essential because the algorithm copies data from the next node, which must exist.',
        animations: [
          { type: 'showVariable' as any, target: 'node.next', value: 'Node(1)', color: '#22C55E', label: 'node->next exists' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#22C55E', label: 'assume node->next != nullptr' },
        ],
      },
      {
        title: 'Copy Next Node\'s Value',
        description:
          'Copy the value from the next node (1) into the current node.',
        why: 'Overwrites the data of the node to delete with the next node\'s data, removing the original value.',
        animations: [
          { type: 'updateVariable' as any, target: 'node.val', from: '5', to: '1', color: '#F97316', label: 'node->val = node->next->val' },
          { type: 'showVariable' as any, target: 'node.val', value: '1 (was 5)', color: '#F97316', label: '5 -> 1 copied' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#F97316', label: 'node->val = node->next->val' },
        ],
      },
      {
        title: 'Bypass Next Node',
        description:
          'Point node->next to node->next->next, skipping the next node.',
        why: 'The next node is redundant (its value was copied). Removing it from the chain deletes it.',
        animations: [
          { type: 'disconnectNodes' as any, target: ['node', 'node-1'], color: '#EF4444' },
          { type: 'connectNodes' as any, target: ['node', 'node-9'], color: '#22C55E' },
          { type: 'moveArrow' as any, target: 'node.next', from: 'Node(1)', to: 'Node(9)', color: '#22C55E' },
          { type: 'showVariable' as any, target: 'node.next', value: 'Node(9)', color: '#22C55E', label: 'node->next = node->next->next' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#F97316', label: 'node->next = node->next->next' },
        ],
      },
      {
        title: 'Verify Deletion',
        description:
          'The original node (now value 1) links directly to 9. Node(1) is removed from the list.',
        animations: [
          { type: 'fade' as any, target: 'node-1', color: '#6B7280', label: 'Node(1) removed' },
          { type: 'showText' as any, value: 'List after deletion: [4, 1, 9]', color: '#22C55E' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#22C55E', label: 'Done!' },
        ],
      },
    ],
    pseudocode: [
      'function deleteNode(node):',
      '  // node is guaranteed to not be the tail',
      '  node.val = node.next.val',
      '  node.next = node.next.next',
    ],
    code: {
      cpp: `void deleteNode(ListNode* node) {
  node->val = node->next->val;
  ListNode* temp = node->next;
  node->next = node->next->next;
  delete temp;
}`,
      javascript: `function deleteNode(node) {
  node.val = node.next.val;
  node.next = node.next.next;
}`,
    },
    complexity: { time: 'O(1)', space: 'O(1)' },
    commonMistakes: [
      'Trying to free the node directly without updating previous node\'s next',
      'Not checking node is not the tail (but problem guarantees this)',
      'In C++, not deleting the bypassed node causing a memory leak',
      'Confusing with standard deletion that requires head and a target value',
    ],
    tips: [
      'This trick only works when node is not the tail (needs a next node to copy from)',
      'In garbage-collected languages (JS, Java), no need to free the bypassed node',
      'O(1) time and space — only modify pointers and copy one value',
      'The original node object stays but with different data; it\'s not actually removed from memory',
    ],
    inputExample: { head: [4, 5, 1, 9], node: 5 },
  },

  // ==================== STACK (5 questions) ====================
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    topic: 'Stack',
    level: 3,
    problem:
      'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid. A string is valid if brackets close in the correct order and every closing bracket has a matching opening bracket.',
    example:
      'Input: s = "()[]{}"\nOutput: true\n\nInput: s = "([)]"\nOutput: false\n\nInput: s = "{[]}"\nOutput: true',
    intuition:
      'Use a stack to track opening brackets. Push opening brackets onto the stack. For closing brackets, check if they match the top of the stack. If matching, pop; if not, the string is invalid. The stack must be empty at the end for a valid string.',
    steps: [
      {
        title: 'Initialize Stack and Mapping',
        description:
          'Create an empty stack and a mapping of closing brackets to their opening brackets.',
        why: 'The stack holds unmatched opening brackets. The mapping provides fast lookup for matching pairs.',
        animations: [
          { type: 'showStack' as any, target: 'stack', color: '#3B82F6', label: 'stack = []' },
          { type: 'showVariable' as any, target: 'mapping', value: '):(, }:], ]:[', color: '#6B7280', label: 'bracket map' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#3B82F6', label: 'stack<char> st; unordered_map<char,char>' },
        ],
      },
      {
        title: 'Process First Char: \'{\'',
        description:
          'First character is \'{\', an opening bracket. Push it onto the stack.',
        why: 'Opening brackets are stored on the stack until we find their matching closing bracket.',
        animations: [
          { type: 'highlight' as any, target: 'char-0', color: '#3B82F6', label: 's[0] = \'{\'' },
          { type: 'push' as any, target: 'stack', value: '\'{\'', color: '#3B82F6', label: 'push \'{\'' },
          { type: 'showStack' as any, target: 'stack', value: '[\'{\']', color: '#3B82F6', label: 'stack: {' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#3B82F6', label: 'if (openers) st.push(c)' },
        ],
      },
      {
        title: 'Process \'[\' — Push',
        description:
          'Next character is \'[\', another opening bracket. Push it onto the stack.',
        animations: [
          { type: 'highlight' as any, target: 'char-1', color: '#3B82F6', label: 's[1] = \'[\'' },
          { type: 'push' as any, target: 'stack', value: '\'[\'', color: '#3B82F6', label: 'push \'[\'' },
          { type: 'showStack' as any, target: 'stack', value: '[\'{\', \'[\']', color: '#3B82F6', label: 'stack: { [' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#3B82F6', label: 'st.push(c)' },
        ],
      },
      {
        title: 'Process \']\' — Match Found',
        description:
          'Character is \']\'. Stack top is \'[\', which matches via our mapping. Pop the stack.',
        why: 'The last unmatched opening bracket \'[\' matches \']\'. This pair is valid, so we pop.',
        animations: [
          { type: 'highlight' as any, target: 'char-2', color: '#EAB308', label: 's[2] = \']\'' },
          { type: 'compare' as any, target: ['stack-top', 'mapping'], color: '#EAB308', label: 'Match: ] -> [' },
          { type: 'pop' as any, target: 'stack', value: '\'[\'', color: '#22C55E', label: 'pop \'[\' — matched!' },
          { type: 'showStack' as any, target: 'stack', value: '[\'{\']', color: '#22C55E', label: 'stack: {' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#22C55E', label: 'if (st.top() == map[c]) st.pop()' },
        ],
      },
      {
        title: 'Process \'}\' — Match Found',
        description:
          'Character is \'}\'. Stack top is \'{\', which matches. Pop the stack.',
        animations: [
          { type: 'highlight' as any, target: 'char-3', color: '#EAB308', label: 's[3] = \'}\'' },
          { type: 'compare' as any, target: ['stack-top', 'mapping'], color: '#EAB308', label: 'Match: } -> {' },
          { type: 'pop' as any, target: 'stack', value: '\'{\'', color: '#22C55E', label: 'pop \'{\' — matched!' },
          { type: 'showStack' as any, target: 'stack', value: '[]', color: '#22C55E', label: 'stack: [] (empty)' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#22C55E', label: 'st.pop()' },
        ],
      },
      {
        title: 'Final Check',
        description:
          'Stack is empty after processing all characters. Every bracket was properly matched.',
        why: 'If any unmatched brackets remained in the stack, the string would be invalid.',
        animations: [
          { type: 'glow' as any, target: 'stack', color: '#22C55E', label: 'Stack empty = valid!' },
          { type: 'showText' as any, value: '"{[]}" is VALID', color: '#22C55E' },
          { type: 'showVariable' as any, target: 'result', value: 'true', color: '#22C55E', label: 'return true' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#22C55E', label: 'return st.empty()' },
        ],
      },
    ],
    pseudocode: [
      'function isValid(s):',
      '  stack = empty Stack',
      '  map = { \')\': \'(\', \'}\': \'{\', \']\': \'[\' }',
      '',
      '  for each char c in s:',
      '    if c is an opening bracket:',
      '      stack.push(c)',
      '    else:',
      '      if stack is empty: return false',
      '      if stack.top() != map[c]: return false',
      '      stack.pop()',
      '',
      '  return stack is empty',
    ],
    code: {
      cpp: `bool isValid(string s) {
  stack<char> st;
  unordered_map<char, char> closing = {
    {')', '('}, {'}', '{'}, {']', '['}
  };

  for (char c : s) {
    if (c == '(' || c == '{' || c == '[') {
      st.push(c);
    } else {
      if (st.empty() || st.top() != closing[c]) {
        return false;
      }
      st.pop();
    }
  }

  return st.empty();
}`,
      javascript: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };

  for (const c of s) {
    if (c === '(' || c === '{' || c === '[') {
      stack.push(c);
    } else {
      if (stack.length === 0 || stack.pop() !== map[c]) {
        return false;
      }
    }
  }

  return stack.length === 0;
}`,
    },
    complexity: { time: 'O(n)', space: 'O(n)' },
    commonMistakes: [
      'Using stack.pop() in JavaScript during comparison without realizing it removes the element',
      'Not checking if stack is empty before accessing top (undefined behavior in C++)',
      'Confusing opening and closing brackets in the mapping',
      'Returning true immediately at an intermediate point when stack is empty',
    ],
    tips: [
      'Stack is LIFO — perfect for bracket matching since the most recent opening bracket must close first',
      'The mapping approach is cleaner than if-else chains for checking bracket pairs',
      'Edge cases: empty string returns true, single opening bracket returns false',
      'This is one of the most common coding interview problems — master it thoroughly',
    ],
    inputExample: { s: '{[]}' },
  },

  {
    id: 'min-stack',
    title: 'Min Stack',
    difficulty: 'Medium',
    topic: 'Stack',
    level: 3,
    problem:
      'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time. Implement the MinStack class with O(1) time for all operations.',
    example:
      'Input: push(5), push(2), push(7), push(1), getMin(), pop(), getMin(), top()\nOutput: 1, 2, 7\n\nAfter pushes, min is 1. After pop (removes 1), min is 2. Top is 7.',
    intuition:
      'Use two stacks: a main stack for all elements and a min stack that tracks the current minimum. When pushing, push the new value onto the min stack only if it is <= current minimum. When popping, if the popped value equals the min stack top, pop from the min stack too.',
    steps: [
      {
        title: 'Initialize Two Stacks',
        description:
          'Create two empty stacks: main stack and min stack.',
        why: 'The separate min stack allows getMin() in O(1) without searching through the main stack.',
        animations: [
          { type: 'showStack' as any, target: 'main-stack', color: '#3B82F6', label: 'stack = []' },
          { type: 'showStack' as any, target: 'min-stack', color: '#3B82F6', label: 'minStack = []' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#3B82F6', label: 'stack<int> st, minSt' },
        ],
      },
      {
        title: 'Push 5',
        description:
          'Push 5 onto main stack. Min stack is empty, so also push 5 onto min stack.',
        why: 'First element is always the minimum so far. Both stacks get the same value.',
        animations: [
          { type: 'push' as any, target: 'main-stack', value: '5', color: '#3B82F6', label: 'push 5' },
          { type: 'push' as any, target: 'min-stack', value: '5', color: '#3B82F6', label: 'minStack push 5' },
          { type: 'showStack' as any, target: 'main-stack', value: '[5]', color: '#3B82F6', label: 'stack: [5]' },
          { type: 'showStack' as any, target: 'min-stack', value: '[5]', color: '#3B82F6', label: 'minStack: [5]' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#3B82F6', label: 'st.push(val); if (minSt.empty()) minSt.push(val)' },
        ],
      },
      {
        title: 'Push 2',
        description:
          'Push 2 onto main stack. Compare 2 with current min (5). Since 2 < 5, push 2 onto min stack.',
        animations: [
          { type: 'push' as any, target: 'main-stack', value: '2', color: '#3B82F6', label: 'push 2' },
          { type: 'compare' as any, target: ['val-2', 'min-5'], color: '#EAB308', label: '2 < 5? Yes!' },
          { type: 'push' as any, target: 'min-stack', value: '2', color: '#22C55E', label: 'minStack push 2 (new min!)' },
          { type: 'showStack' as any, target: 'main-stack', value: '[5, 2]', color: '#3B82F6', label: 'stack: [5, 2]' },
          { type: 'showStack' as any, target: 'min-stack', value: '[5, 2]', color: '#22C55E', label: 'minStack: [5, 2]' },
          { type: 'showVariable' as any, target: 'currentMin', value: '2', color: '#22C55E', label: 'min = 2' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#22C55E', label: 'if (val <= minSt.top()) minSt.push(val)' },
        ],
      },
      {
        title: 'Push 7 and Push 1',
        description:
          'Push 7 (no min change, 7 > 2). Push 1 (new min, push to min stack).',
        animations: [
          { type: 'push' as any, target: 'main-stack', value: '7', color: '#3B82F6', label: 'push 7' },
          { type: 'compare' as any, target: ['val-7', 'min-2'], color: '#EAB308', label: '7 > 2, no push to min' },
          { type: 'push' as any, target: 'main-stack', value: '1', color: '#3B82F6', label: 'push 1' },
          { type: 'compare' as any, target: ['val-1', 'min-2'], color: '#EAB308', label: '1 < 2? Yes!' },
          { type: 'push' as any, target: 'min-stack', value: '1', color: '#22C55E', label: 'minStack push 1 (new min!)' },
          { type: 'showStack' as any, target: 'main-stack', value: '[5, 2, 7, 1]', color: '#3B82F6', label: 'stack: [5,2,7,1]' },
          { type: 'showStack' as any, target: 'min-stack', value: '[5, 2, 1]', color: '#22C55E', label: 'minStack: [5,2,1]' },
          { type: 'showVariable' as any, target: 'currentMin', value: '1', color: '#22C55E', label: 'min = 1' },
        ],
      },
      {
        title: 'getMin()',
        description:
          'Return top of min stack, which is 1.',
        why: 'The min stack always has the current minimum at its top. This is an O(1) operation.',
        animations: [
          { type: 'highlight' as any, target: 'min-top', color: '#22C55E', label: 'min = minStack.top() = 1' },
          { type: 'showVariable' as any, target: 'getMinResult', value: '1', color: '#22C55E', label: 'getMin() -> 1' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#22C55E', label: 'return minSt.top()' },
        ],
      },
      {
        title: 'pop()',
        description:
          'Pop 1 from main stack. Since 1 equals min stack top, pop from min stack too.',
        why: 'If the popped element was the current minimum, we need to restore the previous minimum.',
        animations: [
          { type: 'pop' as any, target: 'main-stack', value: '1', color: '#F97316', label: 'pop 1' },
          { type: 'compare' as any, target: ['popped-1', 'min-top-1'], color: '#EAB308', label: 'popped == min.top? Yes!' },
          { type: 'pop' as any, target: 'min-stack', value: '1', color: '#F97316', label: 'minStack pop 1' },
          { type: 'showStack' as any, target: 'main-stack', value: '[5, 2, 7]', color: '#3B82F6', label: 'stack: [5,2,7]' },
          { type: 'showStack' as any, target: 'min-stack', value: '[5, 2]', color: '#22C55E', label: 'minStack: [5,2]' },
          { type: 'showVariable' as any, target: 'currentMin', value: '2', color: '#22C55E', label: 'min = 2 (restored)' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#F97316', label: 'if (st.top() == minSt.top()) minSt.pop()' },
        ],
      },
      {
        title: 'top() and Final State',
        description:
          'Return top of main stack (7). Current minimum is now 2.',
        animations: [
          { type: 'showVariable' as any, target: 'topResult', value: '7', color: '#3B82F6', label: 'top() -> 7' },
          { type: 'showVariable' as any, target: 'currentMin', value: '2', color: '#22C55E', label: 'getMin() -> 2' },
          { type: 'showText' as any, value: 'All operations O(1). Min stack works!', color: '#22C55E' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#22C55E', label: 'return st.top()' },
        ],
      },
    ],
    pseudocode: [
      'class MinStack:',
      '  stack = []',
      '  minStack = []',
      '',
      '  function push(val):',
      '    stack.push(val)',
      '    if minStack is empty OR val <= minStack.top():',
      '      minStack.push(val)',
      '',
      '  function pop():',
      '    if stack.top() == minStack.top():',
      '      minStack.pop()',
      '    stack.pop()',
      '',
      '  function top(): return stack.top()',
      '  function getMin(): return minStack.top()',
    ],
    code: {
      cpp: `class MinStack {
  stack<int> st, minSt;

public:
  void push(int val) {
    st.push(val);
    if (minSt.empty() || val <= minSt.top()) {
      minSt.push(val);
    }
  }

  void pop() {
    if (st.top() == minSt.top()) {
      minSt.pop();
    }
    st.pop();
  }

  int top() { return st.top(); }
  int getMin() { return minSt.top(); }
};`,
      javascript: `class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = [];
  }

  push(val) {
    this.stack.push(val);
    if (this.minStack.length === 0 || val <= this.minStack[this.minStack.length - 1]) {
      this.minStack.push(val);
    }
  }

  pop() {
    if (this.stack[this.stack.length - 1] === this.minStack[this.minStack.length - 1]) {
      this.minStack.pop();
    }
    this.stack.pop();
  }

  top() { return this.stack[this.stack.length - 1]; }
  getMin() { return this.minStack[this.minStack.length - 1]; }
}`,
    },
    complexity: { time: 'O(1) per operation', space: 'O(n)' },
    commonMistakes: [
      'Using <= instead of < when pushing to minStack (must handle duplicate mins correctly)',
      'Not popping from minStack when the popped value equals the current minimum',
      'Using a single variable for min instead of a stack (fails when min is popped)',
      'Confusing top() with getMin() — they return different values',
    ],
    tips: [
      'The two-stack approach is the most intuitive and commonly asked in interviews',
      'Can be optimized to one stack storing pairs (value, currentMin) or using a single stack with encoding',
      'All operations are O(1) time, O(n) extra space for the min stack',
      'Edge case: duplicates — use <= to ensure both copies are tracked on min stack',
    ],
    inputExample: { operations: ['push(5)', 'push(2)', 'push(7)', 'push(1)', 'getMin()', 'pop()', 'getMin()', 'top()'] },
  },

  {
    id: 'next-greater-element',
    title: 'Next Greater Element',
    difficulty: 'Medium',
    topic: 'Stack',
    level: 3,
    problem:
      'Given an array of integers, find the next greater element for each element. The next greater element is the first element to the right that is larger. If none exists, output -1.',
    example:
      'Input: nums = [4, 5, 2, 25]\nOutput: [5, 25, 25, -1]\n\nExplanation: 4 -> 5, 5 -> 25, 2 -> 25, 25 -> -1',
    intuition:
      'Use a monotonic stack (decreasing). Iterate from right to left: pop elements smaller than current, then the next greater is the stack top (or -1 if empty). Push current onto stack. This processes each element once in O(n) time.',
    steps: [
      {
        title: 'Initialize Stack and Result',
        description:
          'Create an empty stack and a result array filled with -1 of the same length as nums.',
        why: 'Stack will store potential next greater elements. Result is initialized with -1 for elements with no greater element.',
        animations: [
          { type: 'showStack' as any, target: 'stack', color: '#3B82F6', label: 'stack = []' },
          { type: 'showVariable' as any, target: 'result', value: '[-1, -1, -1, -1]', color: '#6B7280', label: 'result = [-1]*n' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#3B82F6', label: 'stack<int> st; vector<int> res(n, -1)' },
        ],
      },
      {
        title: 'Process 25 (Rightmost)',
        description:
          'Start from the rightmost element (25). Stack is empty, so no next greater. Stack top becomes the candidate for future elements. Push 25.',
        why: 'The rightmost element always has no next greater since there are no elements to its right.',
        animations: [
          { type: 'highlight' as any, target: 'index-3', color: '#3B82F6', label: 'i=3, nums[3]=25' },
          { type: 'showStack' as any, target: 'stack', value: '[]', color: '#6B7280', label: 'stack empty -> no NGE' },
          { type: 'showVariable' as any, target: 'result[3]', value: '-1', color: '#6B7280', label: 'res[3] = -1' },
          { type: 'push' as any, target: 'stack', value: '25', color: '#3B82F6', label: 'push 25' },
          { type: 'showStack' as any, target: 'stack', value: '[25]', color: '#3B82F6', label: 'stack: [25]' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#3B82F6', label: 'while (!st.empty() && st.top() <= nums[i]) st.pop()' },
        ],
      },
      {
        title: 'Process 2',
        description:
          'Current element is 2. Stack top is 25, which is greater than 2. So next greater of 2 is 25. Push 2.',
        animations: [
          { type: 'highlight' as any, target: 'index-2', color: '#3B82F6', label: 'i=2, nums[2]=2' },
          { type: 'compare' as any, target: ['val-2', 'stack-top-25'], color: '#EAB308', label: '2 < 25? Yes. NGE = 25' },
          { type: 'showVariable' as any, target: 'result[2]', value: '25', color: '#22C55E', label: 'res[2] = 25' },
          { type: 'push' as any, target: 'stack', value: '2', color: '#3B82F6', label: 'push 2' },
          { type: 'showStack' as any, target: 'stack', value: '[25, 2]', color: '#3B82F6', label: 'stack: [25, 2]' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#22C55E', label: 'if (!st.empty()) res[i] = st.top()' },
        ],
      },
      {
        title: 'Process 5',
        description:
          'Current element is 5. While stack top (2) <= 5, pop (2 is smaller). Now stack top is 25 > 5, so NGE = 25. Push 5.',
        why: 'Pop smaller elements because they can never be the NGE for elements further left (5 is larger than 2 and appears earlier).',
        animations: [
          { type: 'highlight' as any, target: 'index-1', color: '#3B82F6', label: 'i=1, nums[1]=5' },
          { type: 'compare' as any, target: ['val-5', 'stack-top-2'], color: '#EAB308', label: '2 <= 5? Yes. Pop 2' },
          { type: 'pop' as any, target: 'stack', value: '2', color: '#F97316', label: 'pop 2 (too small)' },
          { type: 'compare' as any, target: ['val-5', 'stack-top-25'], color: '#EAB308', label: '25 > 5. NGE = 25' },
          { type: 'showVariable' as any, target: 'result[1]', value: '25', color: '#22C55E', label: 'res[1] = 25' },
          { type: 'push' as any, target: 'stack', value: '5', color: '#3B82F6', label: 'push 5' },
          { type: 'showStack' as any, target: 'stack', value: '[25, 5]', color: '#3B82F6', label: 'stack: [25, 5]' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#F97316', label: 'while (!st.empty() && st.top() <= nums[i]) st.pop()' },
        ],
      },
      {
        title: 'Process 4',
        description:
          'Current element is 4. While stack top (5) <= 4? No, 5 > 4. So NGE = 5. Push 4.',
        animations: [
          { type: 'highlight' as any, target: 'index-0', color: '#3B82F6', label: 'i=0, nums[0]=4' },
          { type: 'compare' as any, target: ['val-4', 'stack-top-5'], color: '#EAB308', label: '5 > 4. NGE = 5' },
          { type: 'showVariable' as any, target: 'result[0]', value: '5', color: '#22C55E', label: 'res[0] = 5' },
          { type: 'push' as any, target: 'stack', value: '4', color: '#3B82F6', label: 'push 4' },
          { type: 'showStack' as any, target: 'stack', value: '[25, 5, 4]', color: '#3B82F6', label: 'stack: [25, 5, 4]' },
        ],
      },
      {
        title: 'Final Result',
        description:
          'Return the result array with next greater elements.',
        animations: [
          { type: 'glow' as any, target: 'result-array', color: '#22C55E', label: 'Final: [5, 25, 25, -1]' },
          { type: 'showText' as any, value: '[4->5, 5->25, 2->25, 25->-1]', color: '#22C55E' },
          { type: 'showVariable' as any, target: 'result', value: '[5, 25, 25, -1]', color: '#22C55E', label: 'return result' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#22C55E', label: 'return res' },
        ],
      },
    ],
    pseudocode: [
      'function nextGreaterElement(nums):',
      '  stack = []',
      '  result = [-1] * nums.length',
      '',
      '  for i = nums.length - 1 down to 0:',
      '    while stack not empty AND stack.top() <= nums[i]:',
      '      stack.pop()',
      '',
      '    if stack not empty:',
      '      result[i] = stack.top()',
      '',
      '    stack.push(nums[i])',
      '',
      '  return result',
    ],
    code: {
      cpp: `vector<int> nextGreaterElement(vector<int>& nums) {
  stack<int> st;
  int n = nums.size();
  vector<int> res(n, -1);

  for (int i = n - 1; i >= 0; i--) {
    while (!st.empty() && st.top() <= nums[i]) {
      st.pop();
    }
    if (!st.empty()) {
      res[i] = st.top();
    }
    st.push(nums[i]);
  }

  return res;
}`,
      javascript: `function nextGreaterElement(nums) {
  const stack = [];
  const res = new Array(nums.length).fill(-1);

  for (let i = nums.length - 1; i >= 0; i--) {
    while (stack.length > 0 && stack[stack.length - 1] <= nums[i]) {
      stack.pop();
    }
    if (stack.length > 0) {
      res[i] = stack[stack.length - 1];
    }
    stack.push(nums[i]);
  }

  return res;
}`,
    },
    complexity: { time: 'O(n)', space: 'O(n)' },
    commonMistakes: [
      'Iterating left to right instead of right to left (requires more complex logic)',
      'Using < instead of <= in the while condition (need to pop smaller OR equal elements)',
      'Forgetting that the stack should be monotonically decreasing',
      'Not initializing result with -1 and forgetting the no-NGE case',
    ],
    tips: [
      'The monotonic stack pattern is used in many problems (daily temperatures, stock span, largest rectangle)',
      'Right-to-left traversal naturally finds the next element to the right',
      'Popping smaller elements maintains the stack in decreasing order (monotonic)',
      'Think of the stack as maintaining "future candidates" for previous elements',
    ],
    inputExample: { nums: [4, 5, 2, 25] },
  },

  {
    id: 'evaluate-postfix',
    title: 'Evaluate Postfix Expression',
    difficulty: 'Medium',
    topic: 'Stack',
    level: 3,
    problem:
      'Evaluate the value of a postfix expression (Reverse Polish Notation). Valid operators are +, -, *, /. Each operand may be an integer or another expression.',
    example:
      'Input: tokens = ["2", "1", "+", "3", "*"]\nOutput: 9\n\nExplanation: ((2 + 1) * 3) = 9',
    intuition:
      'Use a stack for operands. Scan tokens left to right: when encountering an operand, push it onto the stack. When encountering an operator, pop two operands, apply the operator, and push the result back. The final result is the only element left on the stack.',
    steps: [
      {
        title: 'Initialize Stack',
        description:
          'Create an empty stack to hold operands during evaluation.',
        why: 'The stack stores intermediate results. Operands are pushed, and when an operator appears, two operands are popped, computed, and the result is pushed back.',
        animations: [
          { type: 'showStack' as any, target: 'stack', color: '#3B82F6', label: 'stack = []' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#3B82F6', label: 'stack<int> st' },
        ],
      },
      {
        title: 'Process "2" — Push',
        description:
          'Token "2" is an operand. Push 2 onto the stack.',
        animations: [
          { type: 'highlight' as any, target: 'token-0', color: '#3B82F6', label: 'Token: "2"' },
          { type: 'push' as any, target: 'stack', value: '2', color: '#3B82F6', label: 'push 2' },
          { type: 'showStack' as any, target: 'stack', value: '[2]', color: '#3B82F6', label: 'stack: [2]' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#3B82F6', label: 'st.push(stoi(token))' },
        ],
      },
      {
        title: 'Process "1" — Push',
        description:
          'Token "1" is an operand. Push 1 onto the stack.',
        animations: [
          { type: 'highlight' as any, target: 'token-1', color: '#3B82F6', label: 'Token: "1"' },
          { type: 'push' as any, target: 'stack', value: '1', color: '#3B82F6', label: 'push 1' },
          { type: 'showStack' as any, target: 'stack', value: '[2, 1]', color: '#3B82F6', label: 'stack: [2, 1]' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#3B82F6', label: 'st.push(stoi(token))' },
        ],
      },
      {
        title: 'Process "+" — Pop and Compute',
        description:
          'Token "+" is an operator. Pop 1 (right), pop 2 (left). Compute 2 + 1 = 3. Push 3.',
        why: 'Operators pop the top two operands. The first pop is the right operand, the second pop is the left operand.',
        animations: [
          { type: 'highlight' as any, target: 'token-2', color: '#EAB308', label: 'Token: "+"' },
          { type: 'pop' as any, target: 'stack', value: '1', color: '#F97316', label: 'pop right = 1' },
          { type: 'pop' as any, target: 'stack', value: '2', color: '#F97316', label: 'pop left = 2' },
          { type: 'showVariable' as any, target: 'computed', value: '2 + 1 = 3', color: '#22C55E', label: '2 + 1 = 3' },
          { type: 'push' as any, target: 'stack', value: '3', color: '#22C55E', label: 'push result: 3' },
          { type: 'showStack' as any, target: 'stack', value: '[3]', color: '#22C55E', label: 'stack: [3]' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#EAB308', label: 'int right = st.top(); st.pop(); int left = st.top(); st.pop()' },
        ],
      },
      {
        title: 'Process "3" — Push',
        description:
          'Token "3" is an operand. Push 3 onto the stack.',
        animations: [
          { type: 'highlight' as any, target: 'token-3', color: '#3B82F6', label: 'Token: "3"' },
          { type: 'push' as any, target: 'stack', value: '3', color: '#3B82F6', label: 'push 3' },
          { type: 'showStack' as any, target: 'stack', value: '[3, 3]', color: '#3B82F6', label: 'stack: [3, 3]' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#3B82F6', label: 'st.push(stoi(token))' },
        ],
      },
      {
        title: 'Process "*" — Final Compute',
        description:
          'Token "*" is an operator. Pop 3 (right), pop 3 (left). Compute 3 * 3 = 9. Push 9.',
        animations: [
          { type: 'highlight' as any, target: 'token-4', color: '#EAB308', label: 'Token: "*"' },
          { type: 'pop' as any, target: 'stack', value: '3', color: '#F97316', label: 'pop right = 3' },
          { type: 'pop' as any, target: 'stack', value: '3', color: '#F97316', label: 'pop left = 3' },
          { type: 'showVariable' as any, target: 'computed', value: '3 * 3 = 9', color: '#22C55E', label: '3 * 3 = 9' },
          { type: 'push' as any, target: 'stack', value: '9', color: '#22C55E', label: 'push result: 9' },
          { type: 'showStack' as any, target: 'stack', value: '[9]', color: '#22C55E', label: 'stack: [9]' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#EAB308', label: 'switch(op) { case "*": st.push(left * right); }' },
        ],
      },
      {
        title: 'Return Result',
        description:
          'The final result (9) is the only element on the stack. Pop and return it.',
        why: 'After processing all tokens, the stack contains exactly one value: the final result.',
        animations: [
          { type: 'glow' as any, target: 'stack-top', color: '#22C55E', label: 'Result: 9' },
          { type: 'showVariable' as any, target: 'result', value: '9', color: '#22C55E', label: 'return 9' },
          { type: 'showText' as any, value: 'Expression "(2+1)*3" = 9', color: '#22C55E' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#22C55E', label: 'return st.top()' },
        ],
      },
    ],
    pseudocode: [
      'function evalPostfix(tokens):',
      '  stack = []',
      '',
      '  for each token in tokens:',
      '    if token is an operator:',
      '      right = stack.pop()',
      '      left = stack.pop()',
      '      if token == "+": result = left + right',
      '      if token == "-": result = left - right',
      '      if token == "*": result = left * right',
      '      if token == "/": result = left / right',
      '      stack.push(result)',
      '    else:',
      '      stack.push(parseInt(token))',
      '',
      '  return stack.pop()',
    ],
    code: {
      cpp: `int evalRPN(vector<string>& tokens) {
  stack<int> st;

  for (const string& token : tokens) {
    if (token == "+" || token == "-" || token == "*" || token == "/") {
      int right = st.top(); st.pop();
      int left = st.top(); st.pop();

      if (token == "+") st.push(left + right);
      else if (token == "-") st.push(left - right);
      else if (token == "*") st.push(left * right);
      else st.push(left / right);
    } else {
      st.push(stoi(token));
    }
  }

  return st.top();
}`,
      javascript: `function evalRPN(tokens) {
  const stack = [];
  const ops = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => Math.trunc(a / b),
  };

  for (const token of tokens) {
    if (ops[token]) {
      const right = stack.pop();
      const left = stack.pop();
      stack.push(ops[token](left, right));
    } else {
      stack.push(parseInt(token));
    }
  }

  return stack[0];
}`,
    },
    complexity: { time: 'O(n)', space: 'O(n)' },
    commonMistakes: [
      'Popping order: first pop is right operand, second is left operand (order matters for -, /)',
      'Using parseInt for negative numbers in JavaScript — they work correctly but verify',
      'Not handling division truncation toward zero correctly in different languages',
      'Forgetting to check if token is an operator vs operand',
    ],
    tips: [
      'Postfix notation eliminates the need for parentheses — operator precedence is implicit in the order',
      'The stack-based algorithm is used in actual compilers for expression evaluation',
      'Watch operand order for subtraction and division (left op right, not right op left)',
      'In C++, integer division truncates toward zero by default, which matches LeetCode requirements',
    ],
    inputExample: { tokens: ['2', '1', '+', '3', '*'] },
  },

  {
    id: 'balanced-parentheses',
    title: 'Balanced Parentheses Expression',
    difficulty: 'Medium',
    topic: 'Stack',
    level: 3,
    problem:
      'Check if an expression with parentheses, brackets, and braces is balanced. A balanced expression has every opening bracket properly closed in the correct order, and there are no unmatched brackets.',
    example:
      'Input: expr = "[(a+b)*{c-d}]/e"\nOutput: true\n\nInput: expr = "[(a+b]*{c-d})/e"\nOutput: false',
    intuition:
      'Similar to valid parentheses but generalized for expressions with other characters. Traverse the expression: push opening brackets onto a stack. For closing brackets, check if they match the top of the stack. Non-bracket characters are ignored.',
    steps: [
      {
        title: 'Initialize Stack and Bracket Set',
        description:
          'Create an empty stack and define sets of opening and closing brackets.',
        why: 'The stack tracks opening brackets. Closing brackets are validated against the stack top.',
        animations: [
          { type: 'showStack' as any, target: 'stack', color: '#3B82F6', label: 'stack = []' },
          { type: 'showVariable' as any, target: 'openers', value: "'({['", color: '#6B7280', label: 'openers = ({[' },
          { type: 'showVariable' as any, target: 'closers', value: "'}])'", color: '#6B7280', label: 'closers = }])' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#3B82F6', label: 'stack<char> st; set<char> opens' },
        ],
      },
      {
        title: 'Process \'[\' — Push',
        description:
          'Character \'[\' is an opening bracket. Push it onto the stack.',
        animations: [
          { type: 'highlight' as any, target: 'char-0', color: '#3B82F6', label: '\'[\' -> opening' },
          { type: 'push' as any, target: 'stack', value: '\'[\'', color: '#3B82F6', label: 'push \'[\'' },
          { type: 'showStack' as any, target: 'stack', value: '[\'[\']', color: '#3B82F6', label: 'stack: [' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#3B82F6', label: 'if (isOpen(c)) st.push(c)' },
        ],
      },
      {
        title: 'Skip Non-Bracket Characters',
        description:
          'Characters \'a\', \'+\', \'b\' are not brackets. They are ignored and the scan continues.',
        why: 'Only bracket characters affect balance. Others are part of the expression content.',
        animations: [
          { type: 'highlight' as any, target: 'char-1-3', color: '#6B7280', label: '"a+b" skipped (not brackets)' },
          { type: 'showText' as any, value: 'Ignoring non-bracket characters...', color: '#6B7280' },
        ],
      },
      {
        title: 'Process \')\' — Check Match',
        description:
          'Character \')\' is a closing bracket. Stack top is \'[\'. Check if \')\' matches \'[\'. It does not (\')\' matches \'(\'). Expression is invalid!',
        why: 'A closing bracket must match the most recent unmatched opening bracket (LIFO). \')\' expects \'(\' but found \'[\'.',
        animations: [
          { type: 'highlight' as any, target: 'char-4', color: '#EAB308', label: 's[4] = \')\'' },
          { type: 'compare' as any, target: ['stack-top', 'char'], color: '#EF4444', label: ') vs [ -> MISMATCH!' },
          { type: 'showText' as any, value: 'Error: ) does not match [. Invalid expression!', color: '#EF4444' },
          { type: 'showVariable' as any, target: 'result', value: 'false', color: '#EF4444', label: 'return false' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#EF4444', label: 'if (st.top() != matchingBracket) return false' },
        ],
      },
      {
        title: 'Early Termination',
        description:
          'Since a mismatch is found, return false immediately. No need to process the rest of the expression.',
        why: 'A single mismatch invalidates the entire expression. We can stop early.',
        animations: [
          { type: 'fade' as any, target: 'remaining-chars', color: '#6B7280', label: 'Remaining chars skipped' },
          { type: 'showText' as any, value: 'Expression is NOT balanced.', color: '#EF4444' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#EF4444', label: 'return false' },
        ],
      },
    ],
    pseudocode: [
      'function isBalanced(expr):',
      '  stack = []',
      '  openers = "([{"',
      '  closers = ")]}"',
      '  pairs = { \')\': \'(\', \']\': \'[\', \'}\': \'{\' }',
      '',
      '  for each char c in expr:',
      '    if c in openers:',
      '      stack.push(c)',
      '    else if c in closers:',
      '      if stack is empty: return false',
      '      if stack.top() != pairs[c]: return false',
      '      stack.pop()',
      '',
      '  return stack is empty',
    ],
    code: {
      cpp: `bool isBalanced(string expr) {
  stack<char> st;
  unordered_map<char, char> pairs = {
    {')', '('}, {']', '['}, {'}', '{'}
  };
  string openers = "([{";
  string closers = ")]}";

  for (char c : expr) {
    if (openers.find(c) != string::npos) {
      st.push(c);
    } else if (closers.find(c) != string::npos) {
      if (st.empty() || st.top() != pairs[c]) {
        return false;
      }
      st.pop();
    }
  }

  return st.empty();
}`,
      javascript: `function isBalanced(expr) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };
  const openers = new Set(['(', '{', '[']);

  for (const c of expr) {
    if (openers.has(c)) {
      stack.push(c);
    } else if (pairs[c]) {
      if (stack.length === 0 || stack.pop() !== pairs[c]) {
        return false;
      }
    }
  }

  return stack.length === 0;
}`,
    },
    complexity: { time: 'O(n)', space: 'O(n)' },
    commonMistakes: [
      'Not skipping non-bracket characters and trying to push them onto the stack',
      'Using stack.pop() in JavaScript during the comparison check (destructive)',
      'Forgetting the empty check before accessing stack top',
      'Not checking that all openers are matched at the end (stack must be empty)',
    ],
    tips: [
      'This is a generalized version of Valid Parentheses that works with expressions containing other characters',
      'The set-based check for openers/closers is cleaner than multiple if-else conditions',
      'Early termination on mismatch improves performance for invalid expressions',
      'Can be extended to support custom bracket types by adding to the mapping',
    ],
    inputExample: { expr: '[(a+b)*{c-d}]/e' },
  },

  // ==================== QUEUE (3 questions) ====================
  {
    id: 'queue-using-stack',
    title: 'Implement Queue using Stacks',
    difficulty: 'Easy',
    topic: 'Queue',
    level: 3,
    problem:
      'Implement a First-In-First-Out (FIFO) queue using two stacks. The implemented queue should support enqueue, dequeue, peek, and empty operations.',
    example:
      'Input: enqueue(1), enqueue(2), peek(), dequeue(), enqueue(3), dequeue()\nOutput: 1, 1, 2\n\nExplanation: Queue behaviour: 1 enters first, so it leaves first.',
    intuition:
      'Use two stacks: input stack for enqueue operations, output stack for dequeue/peek. When dequeue is called and output is empty, transfer all elements from input to output. This reverses the order twice, effectively making it FIFO.',
    steps: [
      {
        title: 'Initialize Two Stacks',
        description:
          'Create two empty stacks: inputStack and outputStack.',
        why: 'Input stack receives new elements (push at top). Output stack reverses them for FIFO extraction.',
        animations: [
          { type: 'showStack' as any, target: 'input-stack', color: '#3B82F6', label: 'inputStack = []' },
          { type: 'showStack' as any, target: 'output-stack', color: '#3B82F6', label: 'outputStack = []' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#3B82F6', label: 'stack<int> in, out' },
        ],
      },
      {
        title: 'Enqueue 1',
        description:
          'Push 1 onto inputStack.',
        why: 'Enqueue always pushes onto inputStack. This is O(1).',
        animations: [
          { type: 'push' as any, target: 'input-stack', value: '1', color: '#3B82F6', label: 'enqueue(1): push to input' },
          { type: 'showStack' as any, target: 'input-stack', value: '[1]', color: '#3B82F6', label: 'input: [1]' },
          { type: 'enqueue' as any, target: 'queue', value: '1', color: '#3B82F6', label: 'Queue: [1]' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#3B82F6', label: 'void enqueue(int x) { in.push(x); }' },
        ],
      },
      {
        title: 'Enqueue 2',
        description:
          'Push 2 onto inputStack.',
        animations: [
          { type: 'push' as any, target: 'input-stack', value: '2', color: '#3B82F6', label: 'enqueue(2): push to input' },
          { type: 'showStack' as any, target: 'input-stack', value: '[1, 2]', color: '#3B82F6', label: 'input: [1, 2]' },
          { type: 'enqueue' as any, target: 'queue', value: '2', color: '#3B82F6', label: 'Queue: [1, 2]' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#3B82F6', label: 'in.push(x)' },
        ],
      },
      {
        title: 'Peek / Dequeue — Transfer Needed',
        description:
          'outputStack is empty. Transfer all from inputStack to outputStack, reversing the order.',
        why: 'Transfer reverses elements: input has [1,2] with 2 on top. Popping to output gives [2,1] with 1 on top — now FIFO order.',
        animations: [
          { type: 'showText' as any, value: 'output empty! Transferring input -> output', color: '#F97316' },
          { type: 'pop' as any, target: 'input-stack', value: '2', color: '#F97316', label: 'pop 2 from input' },
          { type: 'push' as any, target: 'output-stack', value: '2', color: '#F97316', label: 'push 2 to output' },
          { type: 'pop' as any, target: 'input-stack', value: '1', color: '#F97316', label: 'pop 1 from input' },
          { type: 'push' as any, target: 'output-stack', value: '1', color: '#F97316', label: 'push 1 to output' },
          { type: 'showStack' as any, target: 'input-stack', value: '[]', color: '#6B7280', label: 'input: []' },
          { type: 'showStack' as any, target: 'output-stack', value: '[2, 1]', color: '#3B82F6', label: 'output: [2, 1]' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#F97316', label: 'if (out.empty()) while (!in.empty()) { out.push(in.top()); in.pop(); }' },
        ],
      },
      {
        title: 'Dequeue — Pop from Output',
        description:
          'Pop from outputStack. The top is 1 (the first enqueued element). This is the correct FIFO order.',
        why: 'Output stack top is the front of the queue. Popping it dequeues the oldest element.',
        animations: [
          { type: 'pop' as any, target: 'output-stack', value: '1', color: '#22C55E', label: 'pop 1 from output' },
          { type: 'showStack' as any, target: 'output-stack', value: '[2]', color: '#3B82F6', label: 'output: [2]' },
          { type: 'dequeue' as any, target: 'queue', value: '1', color: '#22C55E', label: 'Dequeue: 1' },
          { type: 'showVariable' as any, target: 'dequeued', value: '1', color: '#22C55E', label: 'return 1' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#22C55E', label: 'int val = out.top(); out.pop(); return val' },
        ],
      },
      {
        title: 'Enqueue 3 and Dequeue',
        description:
          'Enqueue 3 (push to input). Dequeue: output has [2] so no transfer needed. Pop 2 from output.',
        animations: [
          { type: 'push' as any, target: 'input-stack', value: '3', color: '#3B82F6', label: 'enqueue(3): push to input' },
          { type: 'showStack' as any, target: 'input-stack', value: '[3]', color: '#3B82F6', label: 'input: [3]' },
          { type: 'pop' as any, target: 'output-stack', value: '2', color: '#22C55E', label: 'dequeue: pop 2 from output' },
          { type: 'dequeue' as any, target: 'queue', value: '2', color: '#22C55E', label: 'Dequeue: 2' },
          { type: 'showVariable' as any, target: 'dequeued', value: '2', color: '#22C55E', label: 'return 2' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#22C55E', label: 'dequeue: if out empty, transfer; pop out' },
        ],
      },
      {
        title: 'Final State',
        description:
          'Queue has [3] remaining. Input has 3, output is empty.',
        animations: [
          { type: 'showText' as any, value: 'Queue operations work correctly with O(1) amortized cost', color: '#22C55E' },
          { type: 'showStack' as any, target: 'input-stack', value: '[3]', color: '#3B82F6', label: 'input: [3]' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#22C55E', label: 'bool empty() { return in.empty() && out.empty(); }' },
        ],
      },
    ],
    pseudocode: [
      'class QueueUsingStacks:',
      '  input = []',
      '  output = []',
      '',
      '  function enqueue(x):',
      '    input.push(x)',
      '',
      '  function dequeue():',
      '    if output is empty:',
      '      while input is not empty:',
      '        output.push(input.pop())',
      '    return output.pop()',
      '',
      '  function peek():',
      '    same as dequeue but without the pop',
      '',
      '  function empty():',
      '    return input is empty AND output is empty',
    ],
    code: {
      cpp: `class MyQueue {
  stack<int> in, out;

  void transfer() {
    while (!in.empty()) {
      out.push(in.top());
      in.pop();
    }
  }

public:
  void push(int x) { in.push(x); }

  int pop() {
    if (out.empty()) transfer();
    int val = out.top(); out.pop();
    return val;
  }

  int peek() {
    if (out.empty()) transfer();
    return out.top();
  }

  bool empty() { return in.empty() && out.empty(); }
};`,
      javascript: `class MyQueue {
  constructor() {
    this.in = [];
    this.out = [];
  }

  push(x) { this.in.push(x); }

  pop() {
    if (this.out.length === 0) {
      while (this.in.length > 0) {
        this.out.push(this.in.pop());
      }
    }
    return this.out.pop();
  }

  peek() {
    if (this.out.length === 0) {
      while (this.in.length > 0) {
        this.out.push(this.in.pop());
      }
    }
    return this.out[this.out.length - 1];
  }

  empty() { return this.in.length === 0 && this.out.length === 0; }
}`,
    },
    complexity: { time: 'O(1) amortized per operation', space: 'O(n)' },
    commonMistakes: [
      'Forgetting to transfer from input to output when output is empty',
      'Transferring on every operation instead of only when output is empty (loses O(1) amortized)',
      'Not handling the case where both stacks are empty for peek/dequeue',
      'Confusing the direction: input transfer reverses the order (LIFO -> FIFO)',
    ],
    tips: [
      'Each element is pushed at most twice (once to input, once to output) and popped at most twice — O(1) amortized',
      'The transfer step is what makes the two-stack approach work: it reverses the order twice',
      'peek() can be implemented similarly to pop() but without removing the element',
      'This is a classic interview question that tests understanding of stack vs queue semantics',
    ],
    inputExample: { operations: ['enqueue(1)', 'enqueue(2)', 'peek()', 'dequeue()', 'enqueue(3)', 'dequeue()'] },
  },

  {
    id: 'stack-using-queue',
    title: 'Implement Stack using Queues',
    difficulty: 'Easy',
    topic: 'Queue',
    level: 3,
    problem:
      'Implement a Last-In-First-Out (LIFO) stack using two queues. The implemented stack should support push, pop, top, and empty operations.',
    example:
      'Input: push(1), push(2), top(), pop(), push(3), pop(), pop()\nOutput: 2, 2, 3, 1\n\nExplanation: Stack behaviour: most recently pushed element is on top.',
    intuition:
      'Use two queues. On push, add the new element to the empty queue, then move all elements from the other queue to maintain LIFO order. Alternatively, push to one queue and rotate by moving all previous elements to the back.',
    steps: [
      {
        title: 'Initialize Two Queues',
        description:
          'Create two empty queues: q1 (primary) and q2 (helper).',
        why: 'Two queues allow us to rearrange elements so that the most recently pushed is always at the front.',
        animations: [
          { type: 'showQueue' as any, target: 'q1', color: '#3B82F6', label: 'q1 = []' },
          { type: 'showQueue' as any, target: 'q2', color: '#3B82F6', label: 'q2 = []' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#3B82F6', label: 'queue<int> q1, q2' },
        ],
      },
      {
        title: 'Push 1',
        description:
          'Push 1 to q1. q1 is empty so q1 simply gets [1].',
        why: 'With only one element, it is both the top and bottom of the stack.',
        animations: [
          { type: 'enqueue' as any, target: 'q1', value: '1', color: '#3B82F6', label: 'push 1 to q1' },
          { type: 'showQueue' as any, target: 'q1', value: '[1]', color: '#3B82F6', label: 'q1: [1]' },
          { type: 'push' as any, target: 'stack', value: '1', color: '#3B82F6', label: 'Stack: [1]' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#3B82F6', label: 'q1.push(x)' },
        ],
      },
      {
        title: 'Push 2',
        description:
          'Push 2 to q2. Move all elements from q1 (just 1) to q2. Swap q1 and q2. Now q1 has [2, 1] — 2 is at front.',
        why: 'By moving existing elements behind the new element, the new element stays at the front for pop().',
        animations: [
          { type: 'enqueue' as any, target: 'q2', value: '2', color: '#3B82F6', label: 'push 2 to q2' },
          { type: 'showText' as any, value: 'Move q1 -> q2 to maintain order', color: '#F97316' },
          { type: 'dequeue' as any, target: 'q1', value: '1', color: '#F97316', label: 'move 1 from q1 to q2' },
          { type: 'enqueue' as any, target: 'q2', value: '1', color: '#F97316', label: 'q2 now: [2, 1]' },
          { type: 'showQueue' as any, target: 'q2', value: '[2, 1]', color: '#F97316', label: 'q2: [2, 1]' },
          { type: 'showText' as any, value: 'Swap q1 <-> q2', color: '#3B82F6' },
          { type: 'showQueue' as any, target: 'q1', value: '[2, 1]', color: '#22C55E', label: 'After swap: q1 = [2, 1]' },
          { type: 'showQueue' as any, target: 'q2', value: '[]', color: '#6B7280', label: 'q2 = []' },
          { type: 'push' as any, target: 'stack', value: '2', color: '#22C55E', label: 'Stack: [1, 2] (2 on top)' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#F97316', label: 'q2.push(x); while(!q1.empty()){ q2.push(q1.front()); q1.pop(); } swap(q1,q2)' },
        ],
      },
      {
        title: 'Top — Peek',
        description:
          'Return the front of q1, which is 2 (the most recently pushed element).',
        why: 'After our ordering scheme, the front of q1 is always the stack top.',
        animations: [
          { type: 'highlight' as any, target: 'q1-front', color: '#22C55E', label: 'top -> q1.front() = 2' },
          { type: 'showVariable' as any, target: 'topResult', value: '2', color: '#22C55E', label: 'top() = 2' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#22C55E', label: 'return q1.front()' },
        ],
      },
      {
        title: 'Pop',
        description:
          'Pop the front of q1, which is 2 (the stack top). q1 now has [1].',
        animations: [
          { type: 'dequeue' as any, target: 'q1', value: '2', color: '#F97316', label: 'pop 2 from q1' },
          { type: 'showQueue' as any, target: 'q1', value: '[1]', color: '#3B82F6', label: 'q1: [1]' },
          { type: 'pop' as any, target: 'stack', value: '2', color: '#F97316', label: 'Stack after pop: [1]' },
          { type: 'showVariable' as any, target: 'popped', value: '2', color: '#F97316', label: 'pop() = 2' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#F97316', label: 'int val = q1.front(); q1.pop(); return val' },
        ],
      },
      {
        title: 'Push 3',
        description:
          'Push 3: same process — add to empty q2, move q1\'s [1] to q2, swap. q1 becomes [3, 1].',
        animations: [
          { type: 'enqueue' as any, target: 'q2', value: '3', color: '#3B82F6', label: 'push 3 to q2' },
          { type: 'dequeue' as any, target: 'q1', value: '1', color: '#F97316', label: 'move 1 from q1 to q2' },
          { type: 'enqueue' as any, target: 'q2', value: '1', color: '#F97316', label: 'q2: [3, 1]' },
          { type: 'showQueue' as any, target: 'q1', value: '[3, 1]', color: '#22C55E', label: 'After swap: q1 = [3, 1]' },
          { type: 'push' as any, target: 'stack', value: '3', color: '#22C55E', label: 'Stack: [1, 3] (3 on top)' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#F97316', label: 'push: transfer all q1 -> q2, then swap' },
        ],
      },
      {
        title: 'Pop All',
        description:
          'Pop 3 then pop 1 from q1. Stack is now empty.',
        animations: [
          { type: 'dequeue' as any, target: 'q1', value: '3', color: '#F97316', label: 'pop 3' },
          { type: 'pop' as any, target: 'stack', value: '3', color: '#F97316', label: 'pop() = 3' },
          { type: 'dequeue' as any, target: 'q1', value: '1', color: '#F97316', label: 'pop 1' },
          { type: 'pop' as any, target: 'stack', value: '1', color: '#F97316', label: 'pop() = 1' },
          { type: 'showQueue' as any, target: 'q1', value: '[]', color: '#6B7280', label: 'q1: [] (empty)' },
          { type: 'showText' as any, value: 'Stack operations work correctly with queues!', color: '#22C55E' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#22C55E', label: 'bool empty() { return q1.empty(); }' },
        ],
      },
    ],
    pseudocode: [
      'class StackUsingQueues:',
      '  q1 = []',
      '  q2 = []',
      '',
      '  function push(x):',
      '    q2.enqueue(x)',
      '    while q1 is not empty:',
      '      q2.enqueue(q1.dequeue())',
      '    swap q1 and q2',
      '',
      '  function pop(): return q1.dequeue()',
      '  function top(): return q1.peek()',
      '  function empty(): return q1 is empty',
    ],
    code: {
      cpp: `class MyStack {
  queue<int> q1, q2;

public:
  void push(int x) {
    q2.push(x);
    while (!q1.empty()) {
      q2.push(q1.front());
      q1.pop();
    }
    swap(q1, q2);
  }

  int pop() {
    int val = q1.front();
    q1.pop();
    return val;
  }

  int top() { return q1.front(); }
  bool empty() { return q1.empty(); }
};`,
      javascript: `class MyStack {
  constructor() {
    this.q1 = [];
    this.q2 = [];
  }

  push(x) {
    this.q2.push(x);
    while (this.q1.length > 0) {
      this.q2.push(this.q1.shift());
    }
    [this.q1, this.q2] = [this.q2, this.q1];
  }

  pop() { return this.q1.shift(); }
  top() { return this.q1[0]; }
  empty() { return this.q1.length === 0; }
}`,
    },
    complexity: { time: 'O(n) push, O(1) pop/top', space: 'O(n)' },
    commonMistakes: [
      'Using a single queue and not maintaining LIFO order correctly',
      'Forgetting to swap q1 and q2 after the push transfer',
      'Using array shift() in JavaScript in performance-critical code (O(n) shift + O(n) push = O(n^2))',
      'Not handling empty queue case for pop/top operations',
    ],
    tips: [
      'This approach makes push O(n) and pop/peek O(1). Alternatively, make push O(1) and pop O(n) by rotating on pop',
      'The swap step is crucial to maintain the invariant that q1 always contains elements in stack order',
      'A single-queue approach also works: push x, then rotate n-1 elements to the back',
      'Understanding this problem helps clarify the difference between stack (LIFO) and queue (FIFO) behavior',
    ],
    inputExample: { operations: ['push(1)', 'push(2)', 'top()', 'pop()', 'push(3)', 'pop()', 'pop()'] },
  },

  {
    id: 'circular-queue',
    title: 'Design Circular Queue',
    difficulty: 'Medium',
    topic: 'Queue',
    level: 3,
    problem:
      'Design a circular queue (ring buffer) using an array. The queue should support enQueue, deQueue, Front, Rear, isEmpty, and isFull operations. The circular queue reuses the array space by wrapping around.',
    example:
      'Input: CircularQueue(3), enQueue(1), enQueue(2), enQueue(3), enQueue(4), Rear(), isFull(), deQueue(), enQueue(4), Rear()\nOutput: true, true, false, 3, true, true, 4\n\nExplanation: After 3 enqueues, queue is full. Dequeue frees a slot, then can enqueue 4.',
    intuition:
      'Use an array of fixed size k, with front and rear pointers. Enqueue adds at rear position and advances rear (mod k). Dequeue removes from front and advances front (mod k). The circular nature means pointers wrap around using modulo arithmetic.',
    steps: [
      {
        title: 'Initialize Circular Queue',
        description:
          'Create an array of size k. Set front = 0, rear = -1, and count = 0.',
        why: 'front tracks the head for dequeue, rear tracks the tail for enqueue. count tracks total elements. Modulo k handles wrap-around.',
        animations: [
          { type: 'showQueue' as any, target: 'circular-queue', value: '[_, _, _]', color: '#3B82F6', label: 'size = 3' },
          { type: 'showVariable' as any, target: 'front', value: '0', color: '#3B82F6', label: 'front = 0' },
          { type: 'showVariable' as any, target: 'rear', value: '-1', color: '#3B82F6', label: 'rear = -1' },
          { type: 'showVariable' as any, target: 'count', value: '0', color: '#3B82F6', label: 'count = 0' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#3B82F6', label: 'CircularQueue(int k): arr(k), front(0), rear(-1), count(0) {}' },
        ],
      },
      {
        title: 'EnQueue 1',
        description:
          'Queue is not full (count=0 < k=3). Increment rear: (rear+1)%k = (-1+1)%3 = 0. arr[0] = 1. count becomes 1.',
        why: 'rear wraps around using modulo. -1 + 1 = 0, so the first element goes at index 0.',
        animations: [
          { type: 'highlight' as any, target: 'index-0', color: '#3B82F6', label: 'rear -> (0) arr[0]=1' },
          { type: 'enqueue' as any, target: 'circular-queue', value: '1 at index 0', color: '#3B82F6', label: 'enQueue(1)' },
          { type: 'updateVariable' as any, target: 'rear', from: '-1', to: '0', color: '#F97316', label: 'rear = 0' },
          { type: 'updateVariable' as any, target: 'count', from: '0', to: '1', color: '#F97316', label: 'count = 1' },
          { type: 'showQueue' as any, target: 'circular-queue', value: '[1, _, _]', color: '#3B82F6', label: 'Queue: [1]' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#3B82F6', label: 'bool enQueue(int val) { if (isFull()) return false; rear = (rear+1)%k; arr[rear]=val; count++; return true; }' },
        ],
      },
      {
        title: 'EnQueue 2',
        description:
          'rear = (0+1)%3 = 1. arr[1] = 2. count = 2.',
        animations: [
          { type: 'highlight' as any, target: 'index-1', color: '#3B82F6', label: 'rear -> (1) arr[1]=2' },
          { type: 'enqueue' as any, target: 'circular-queue', value: '2 at index 1', color: '#3B82F6', label: 'enQueue(2)' },
          { type: 'updateVariable' as any, target: 'rear', from: '0', to: '1', color: '#F97316', label: 'rear = 1' },
          { type: 'updateVariable' as any, target: 'count', from: '1', to: '2', color: '#F97316', label: 'count = 2' },
          { type: 'showQueue' as any, target: 'circular-queue', value: '[1, 2, _]', color: '#3B82F6', label: 'Queue: [1, 2]' },
        ],
      },
      {
        title: 'EnQueue 3',
        description:
          'rear = (1+1)%3 = 2. arr[2] = 3. count = 3. Queue is now full.',
        animations: [
          { type: 'highlight' as any, target: 'index-2', color: '#3B82F6', label: 'rear -> (2) arr[2]=3' },
          { type: 'enqueue' as any, target: 'circular-queue', value: '3 at index 2', color: '#3B82F6', label: 'enQueue(3)' },
          { type: 'updateVariable' as any, target: 'rear', from: '1', to: '2', color: '#F97316', label: 'rear = 2' },
          { type: 'updateVariable' as any, target: 'count', from: '2', to: '3', color: '#F97316', label: 'count = 3' },
          { type: 'showQueue' as any, target: 'circular-queue', value: '[1, 2, 3]', color: '#3B82F6', label: 'Queue: [1, 2, 3]' },
          { type: 'showVariable' as any, target: 'isFull', value: 'true', color: '#EAB308', label: 'isFull = true' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#EAB308', label: 'count == k -> isFull()' },
        ],
      },
      {
        title: 'EnQueue 4 — Queue Full',
        description:
          'Queue is full (count=3=k). enQueue returns false — element cannot be added.',
        animations: [
          { type: 'showText' as any, value: 'Queue FULL! Cannot enqueue 4.', color: '#EF4444' },
          { type: 'highlight' as any, target: 'circular-queue', color: '#EF4444', label: 'isFull = true, enQueue fails' },
          { type: 'showVariable' as any, target: 'enQueueResult', value: 'false', color: '#EF4444', label: 'enQueue(4) = false' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#EF4444', label: 'if (isFull()) return false' },
        ],
      },
      {
        title: 'Rear and DeQueue',
        description:
          'Rear returns arr[rear] = arr[2] = 3. DeQueue: remove front (index 0, value 1). front = (0+1)%3 = 1. count = 2. Slot 0 is now free.',
        animations: [
          { type: 'highlight' as any, target: 'rear-2', color: '#22C55E', label: 'Rear() = arr[2] = 3' },
          { type: 'showVariable' as any, target: 'rearValue', value: '3', color: '#22C55E', label: 'Rear() = 3' },
          { type: 'dequeue' as any, target: 'circular-queue', value: '1 from index 0', color: '#F97316', label: 'deQueue: remove 1' },
          { type: 'updateVariable' as any, target: 'front', from: '0', to: '1', color: '#F97316', label: 'front = 1' },
          { type: 'updateVariable' as any, target: 'count', from: '3', to: '2', color: '#F97316', label: 'count = 2' },
          { type: 'showQueue' as any, target: 'circular-queue', value: '[_, 2, 3]', color: '#3B82F6', label: 'Queue: [2, 3]' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#F97316', label: 'bool deQueue() { if (isEmpty()) return false; front = (front+1)%k; count--; return true; }' },
        ],
      },
      {
        title: 'EnQueue 4 (Circular Wrap)',
        description:
          'Queue is not full (count=2 < k=3). rear = (2+1)%3 = 0. arr[0] = 4. The array wraps around and reuses the freed slot! count = 3.',
        why: 'This is the power of circular queues: index 0 was freed by dequeue, so we reuse it via modulo wrap-around.',
        animations: [
          { type: 'highlight' as any, target: 'index-0', color: '#22C55E', label: 'rear wraps to 0! arr[0]=4' },
          { type: 'enqueue' as any, target: 'circular-queue', value: '4 at index 0 (reused!)', color: '#22C55E', label: 'enQueue(4) OK!' },
          { type: 'updateVariable' as any, target: 'rear', from: '2', to: '0', color: '#F97316', label: 'rear = 0 (wrapped!)' },
          { type: 'updateVariable' as any, target: 'count', from: '2', to: '3', color: '#F97316', label: 'count = 3' },
          { type: 'showQueue' as any, target: 'circular-queue', value: '[4, 2, 3]', color: '#22C55E', label: 'Queue: [4, 2, 3]' },
          { type: 'showVariable' as any, target: 'Rear', value: '4', color: '#22C55E', label: 'Rear() = 4' },
          { type: 'showText' as any, value: 'Circular queue reuses index 0!', color: '#22C55E' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#22C55E', label: 'rear = (rear + 1) % k (wraps around)' },
        ],
      },
    ],
    pseudocode: [
      'class CircularQueue(k):',
      '  arr = new int[k]',
      '  front = 0',
      '  rear = -1',
      '  count = 0',
      '',
      '  function enQueue(val):',
      '    if isFull(): return false',
      '    rear = (rear + 1) % k',
      '    arr[rear] = val',
      '    count++',
      '    return true',
      '',
      '  function deQueue():',
      '    if isEmpty(): return false',
      '    front = (front + 1) % k',
      '    count--',
      '    return true',
      '',
      '  function Front(): return arr[front]',
      '  function Rear(): return arr[rear]',
      '  function isEmpty(): return count == 0',
      '  function isFull(): return count == k',
    ],
    code: {
      cpp: `class CircularQueue {
  vector<int> arr;
  int front, rear, count, k;

public:
  CircularQueue(int k) : arr(k), front(0), rear(-1), count(0), k(k) {}

  bool enQueue(int val) {
    if (isFull()) return false;
    rear = (rear + 1) % k;
    arr[rear] = val;
    count++;
    return true;
  }

  bool deQueue() {
    if (isEmpty()) return false;
    front = (front + 1) % k;
    count--;
    return true;
  }

  int Front() { return arr[front]; }
  int Rear() { return arr[rear]; }
  bool isEmpty() { return count == 0; }
  bool isFull() { return count == k; }
};`,
      javascript: `class CircularQueue {
  constructor(k) {
    this.arr = new Array(k);
    this.k = k;
    this.front = 0;
    this.rear = -1;
    this.count = 0;
  }

  enQueue(val) {
    if (this.isFull()) return false;
    this.rear = (this.rear + 1) % this.k;
    this.arr[this.rear] = val;
    this.count++;
    return true;
  }

  deQueue() {
    if (this.isEmpty()) return false;
    this.front = (this.front + 1) % this.k;
    this.count--;
    return true;
  }

  Front() { return this.arr[this.front]; }
  Rear() { return this.arr[this.rear]; }
  isEmpty() { return this.count === 0; }
  isFull() { return this.count === this.k; }
}`,
    },
    complexity: { time: 'O(1) per operation', space: 'O(k)' },
    commonMistakes: [
      'Not using modulo for wrap-around (rear = (rear+1) % k)',
      'Confusing isEmpty (count==0) with isFull (count==k)',
      'Not handling negative modulo in languages where % can return negative (not an issue in C++/JS with positive numbers)',
      'Forgetting to update count on enQueue and deQueue',
    ],
    tips: [
      'The modulo operation is the key to circular behavior — it wraps indices back to 0',
      'Tracking count separately is simpler than tracking front/rear positions to distinguish empty vs full',
      'Circular queues are used in real-world systems: IO buffers, network packet queues, audio buffers',
      'The front pointer advances on dequeue, rear advances on enqueue — they chase each other around the array',
    ],
    inputExample: { k: 3, operations: ['enQueue(1)', 'enQueue(2)', 'enQueue(3)', 'enQueue(4)', 'Rear()', 'isFull()', 'deQueue()', 'enQueue(4)', 'Rear()'] },
  },

  // ==================== HASHMAP (5 questions) ====================
  {
    id: 'two-sum-hashmap',
    title: 'Two Sum (Hash Map)',
    difficulty: 'Easy',
    topic: 'HashMap',
    level: 3,
    problem:
      'Given an array of integers and a target integer, return the indices of the two numbers that add up to the target. Each input has exactly one solution, and you may not use the same element twice.',
    example:
      'Input: nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1]\n\nExplanation: nums[0] + nums[1] = 2 + 7 = 9, so return [0, 1].',
    intuition:
      'Use a hash map to store each element\'s value as key and its index as value as we iterate. For each element, compute the complement (target - current). If the complement exists in the map, we found our pair. This gives O(n) time with one pass.',
    steps: [
      {
        title: 'Initialize Hash Map',
        description:
          'Create an empty hash map that will store values we have seen and their indices.',
        why: 'The hash map allows O(1) lookup to check if the complement of the current number exists among previously seen elements.',
        animations: [
          { type: 'showVariable' as any, target: 'map', value: '{}', color: '#3B82F6', label: 'map = {}' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#3B82F6', label: 'unordered_map<int,int> mp' },
        ],
      },
      {
        title: 'Process nums[0] = 2',
        description:
          'Current element is 2. Complement = 9 - 2 = 7. Is 7 in the map? No (map is empty). Store 2 -> index 0 in map.',
        why: 'Complement 7 is not found yet, but later when we encounter 7, it will look up 2 and find it.',
        animations: [
          { type: 'highlight' as any, target: 'index-0', color: '#3B82F6', label: 'i=0, nums[0]=2' },
          { type: 'showVariable' as any, target: 'complement', value: '9 - 2 = 7', color: '#EAB308', label: 'complement = 7' },
          { type: 'compare' as any, target: ['complement-7', 'map'], color: '#EAB308', label: '7 in map? No' },
          { type: 'insert' as any, target: 'map', value: '{2: 0}', color: '#F97316', label: 'map[2] = 0' },
          { type: 'showVariable' as any, target: 'map', value: '{2:0}', color: '#F97316', label: 'map: {2->0}' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#F97316', label: 'mp[nums[i]] = i' },
        ],
      },
      {
        title: 'Process nums[1] = 7',
        description:
          'Current element is 7. Complement = 9 - 7 = 2. Is 2 in the map? Yes! Found at index 0.',
        why: 'The complement 2 was stored in the previous step. We found a pair: [0, 1] because 2 + 7 = 9.',
        animations: [
          { type: 'highlight' as any, target: 'index-1', color: '#3B82F6', label: 'i=1, nums[1]=7' },
          { type: 'showVariable' as any, target: 'complement', value: '9 - 7 = 2', color: '#EAB308', label: 'complement = 2' },
          { type: 'compare' as any, target: ['complement-2', 'map'], color: '#EAB308', label: '2 in map? Yes!' },
          { type: 'glow' as any, target: 'map-entry-0', color: '#22C55E', label: 'Found at map[2] = index 0' },
          { type: 'showVariable' as any, target: 'result', value: '[0, 1]', color: '#22C55E', label: 'Result: [0, 1]' },
          { type: 'showText' as any, value: '2 + 7 = 9 -> indices [0, 1]', color: '#22C55E' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#22C55E', label: 'if (mp.count(complement)) return {mp[complement], i}' },
        ],
      },
      {
        title: 'Return Result',
        description:
          'Return [0, 1] as the indices that sum to the target.',
        animations: [
          { type: 'glow' as any, target: 'result-array', color: '#22C55E', label: '[0, 1]' },
          { type: 'showText' as any, value: 'Two Sum solved in O(n) using hash map!', color: '#22C55E' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#22C55E', label: 'return {} (no solution found)' },
        ],
      },
    ],
    pseudocode: [
      'function twoSum(nums, target):',
      '  map = {}',
      '',
      '  for i = 0 to nums.length - 1:',
      '    complement = target - nums[i]',
      '    if complement is in map:',
      '      return [map[complement], i]',
      '    map[nums[i]] = i',
      '',
      '  return []  // No solution found',
    ],
    code: {
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {
  unordered_map<int, int> mp;

  for (int i = 0; i < nums.size(); i++) {
    int complement = target - nums[i];
    if (mp.count(complement)) {
      return {mp[complement], i};
    }
    mp[nums[i]] = i;
  }

  return {};
}`,
      javascript: `function twoSum(nums, target) {
  const map = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }

  return [];
}`,
    },
    complexity: { time: 'O(n)', space: 'O(n)' },
    commonMistakes: [
      'Adding the current element to the map before checking the complement (could match with itself)',
      'Returning the values instead of the indices',
      'Using a Set instead of a Map when indices are needed',
      'Not handling the case where no solution exists (but problem guarantees one)',
    ],
    tips: [
      'The one-pass hash map approach is optimal — O(n) time and O(n) space',
      'Always check the complement before storing the current element to avoid self-matching',
      'For variants that return values instead of indices, a Set can be used instead of a Map',
      'This problem demonstrates the classic space-time tradeoff: O(n) space for O(n) time vs O(n^2) brute force',
    ],
    inputExample: { nums: [2, 7, 11, 15], target: 9 },
  },

  {
    id: 'frequency-counter',
    title: 'Frequency Counter',
    difficulty: 'Easy',
    topic: 'HashMap',
    level: 3,
    problem:
      'Given an array of integers, count the frequency of each element and return a map/dictionary of element frequencies.',
    example:
      'Input: nums = [1, 2, 2, 3, 1, 1, 4]\nOutput: {1: 3, 2: 2, 3: 1, 4: 1}\n\nExplanation: 1 appears 3 times, 2 appears 2 times, 3 and 4 appear 1 time each.',
    intuition:
      'Iterate through the array once. For each element, increment its count in a hash map. If the element is not in the map, initialize it to 1. This yields the frequency of every element in O(n) time.',
    steps: [
      {
        title: 'Initialize Frequency Map',
        description:
          'Create an empty hash map to store element frequencies.',
        why: 'The hash map provides fast O(1) lookups and updates for counting each element.',
        animations: [
          { type: 'showVariable' as any, target: 'freqMap', value: '{}', color: '#3B82F6', label: 'freq = {}' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#3B82F6', label: 'unordered_map<int,int> freq' },
        ],
      },
      {
        title: 'Process 1 (index 0)',
        description:
          'Element is 1. Not in map, so initialize freq[1] = 1.',
        animations: [
          { type: 'highlight' as any, target: 'index-0', color: '#3B82F6', label: 'i=0, nums[0]=1' },
          { type: 'compare' as any, target: ['val-1', 'map'], color: '#EAB308', label: '1 in map? No' },
          { type: 'insert' as any, target: 'freqMap', value: '{1: 1}', color: '#F97316', label: 'freq[1] = 1' },
          { type: 'showVariable' as any, target: 'freqMap', value: '{1:1}', color: '#F97316', label: 'freq: {1->1}' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#F97316', label: 'freq[nums[i]]++' },
        ],
      },
      {
        title: 'Process 2 (index 1)',
        description:
          'Element is 2. Not in map, so freq[2] = 1.',
        animations: [
          { type: 'highlight' as any, target: 'index-1', color: '#3B82F6', label: 'i=1, nums[1]=2' },
          { type: 'insert' as any, target: 'freqMap', value: '{2: 1}', color: '#F97316', label: 'freq[2] = 1' },
          { type: 'showVariable' as any, target: 'freqMap', value: '{1:1, 2:1}', color: '#F97316', label: 'freq: {1->1, 2->1}' },
        ],
      },
      {
        title: 'Process 2 (index 2)',
        description:
          'Element is 2 again. Already in map, so increment freq[2] from 1 to 2.',
        animations: [
          { type: 'highlight' as any, target: 'index-2', color: '#3B82F6', label: 'i=2, nums[2]=2' },
          { type: 'compare' as any, target: ['val-2', 'map'], color: '#EAB308', label: '2 in map? Yes! Increment' },
          { type: 'updateVariable' as any, target: 'freq[2]', from: '1', to: '2', color: '#22C55E', label: 'freq[2] = 1 -> 2' },
          { type: 'showVariable' as any, target: 'freqMap', value: '{1:1, 2:2}', color: '#22C55E', label: 'freq: {1->1, 2->2}' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#22C55E', label: 'freq[nums[i]]++' },
        ],
      },
      {
        title: 'Process Remaining Elements',
        description:
          'Process 3 (index 3): freq[3] = 1. Process 1 (index 4): freq[1] = 1 -> 2. Process 1 (index 5): freq[1] = 2 -> 3. Process 4 (index 6): freq[4] = 1.',
        animations: [
          { type: 'highlight' as any, target: 'index-3', color: '#3B82F6', label: 'i=3, nums[3]=3 -> freq[3]=1' },
          { type: 'highlight' as any, target: 'index-4', color: '#3B82F6', label: 'i=4, nums[4]=1 -> freq[1]=2' },
          { type: 'highlight' as any, target: 'index-5', color: '#3B82F6', label: 'i=5, nums[5]=1 -> freq[1]=3' },
          { type: 'highlight' as any, target: 'index-6', color: '#3B82F6', label: 'i=6, nums[6]=4 -> freq[4]=1' },
          { type: 'updateVariable' as any, target: 'freq[1]', from: '1', to: '3', color: '#F97316', label: 'freq[1] = 3' },
          { type: 'showVariable' as any, target: 'freqMap', value: '{1:3, 2:2, 3:1, 4:1}', color: '#22C55E', label: 'freq: {1->3, 2->2, 3->1, 4->1}' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#F97316', label: 'freq[nums[i]]++' },
        ],
      },
      {
        title: 'Return Frequency Map',
        description:
          'Return the frequency map containing counts for all elements.',
        animations: [
          { type: 'glow' as any, target: 'freqMap', color: '#22C55E', label: 'Final frequencies' },
          { type: 'showText' as any, value: '{1: 3, 2: 2, 3: 1, 4: 1}', color: '#22C55E' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#22C55E', label: 'return freq' },
        ],
      },
    ],
    pseudocode: [
      'function frequencyCounter(nums):',
      '  freq = {}',
      '',
      '  for each num in nums:',
      '    freq[num] = freq[num] + 1  // Default 0 if not present',
      '',
      '  return freq',
    ],
    code: {
      cpp: `unordered_map<int, int> frequencyCounter(vector<int>& nums) {
  unordered_map<int, int> freq;

  for (int num : nums) {
    freq[num]++;
  }

  return freq;
}`,
      javascript: `function frequencyCounter(nums) {
  const freq = new Map();

  for (const num of nums) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }

  return freq;
}`,
    },
    complexity: { time: 'O(n)', space: 'O(n)' },
    commonMistakes: [
      'Using an array instead of a hash map when the element range is unknown or sparse',
      'Forgetting to handle the case where an element appears for the first time (null check in JS)',
      'Not recognizing that freq[num]++ in C++ automatically initializes to 0 for new keys',
      'Confusing frequency counting with grouping — they are different operations',
    ],
    tips: [
      'In C++, freq[num]++ works because operator[] inserts a default-initialized value (0) for new keys',
      'In JavaScript, use Map with get/has or the || operator for default values',
      'Frequency counting is the building block for many hash map problems (anagrams, duplicates, mode)',
      'Can be extended to count frequency of any hashable type (strings, characters, etc.)',
    ],
    inputExample: { nums: [1, 2, 2, 3, 1, 1, 4] },
  },

  {
    id: 'first-non-repeating-char',
    title: 'First Non-Repeating Character',
    difficulty: 'Easy',
    topic: 'HashMap',
    level: 3,
    problem:
      'Find the first non-repeating character in a string and return its index. If no such character exists, return -1.',
    example:
      'Input: s = "loveleetcode"\nOutput: 2\n\nExplanation: The first character that appears only once is \'v\' at index 2. (l appears twice, o appears twice, v appears once...)',
    intuition:
      'First pass: build a frequency map of all characters. Second pass: iterate through the string again and find the first character whose frequency is 1. Return its index. This gives O(n) time with one extra pass.',
    steps: [
      {
        title: 'Build Frequency Map',
        description:
          'Create an empty map. Iterate through the string, counting occurrences of each character.',
        why: 'We need to know the count of each character before we can determine which is non-repeating.',
        animations: [
          { type: 'showVariable' as any, target: 'freq', value: '{}', color: '#3B82F6', label: 'freq = {}' },
          { type: 'showText' as any, value: 'Pass 1: Counting frequencies...', color: '#3B82F6' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#3B82F6', label: 'for (char c : s) freq[c]++' },
        ],
      },
      {
        title: 'Count Each Character',
        description:
          'Process each character in \"loveleetcode\": l(1), o(1), v(1), e(1), l(2), e(2), e(3), t(1), c(1), o(2), d(1), e(4).',
        why: 'After the first pass, freq = {l:2, o:2, v:1, e:4, t:1, c:1, d:1}. Characters v, t, c, d are non-repeating.',
        animations: [
          { type: 'highlight' as any, target: 'char-l', color: '#EAB308', label: 'l: count 2' },
          { type: 'highlight' as any, target: 'char-o', color: '#EAB308', label: 'o: count 2' },
          { type: 'highlight' as any, target: 'char-v', color: '#22C55E', label: 'v: count 1' },
          { type: 'highlight' as any, target: 'char-e', color: '#EAB308', label: 'e: count 4' },
          { type: 'highlight' as any, target: 'char-t', color: '#22C55E', label: 't: count 1' },
          { type: 'highlight' as any, target: 'char-c', color: '#22C55E', label: 'c: count 1' },
          { type: 'highlight' as any, target: 'char-d', color: '#22C55E', label: 'd: count 1' },
          { type: 'showVariable' as any, target: 'freqMap', value: '{l:2,o:2,v:1,e:4,t:1,c:1,d:1}', color: '#22C55E', label: 'freq = {l:2, o:2, v:1, e:4, t:1, c:1, d:1}' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#EAB308', label: 'freq[c]++' },
        ],
      },
      {
        title: 'Second Pass — Find First Unique',
        description:
          'Iterate through the string again. For each character, check its frequency. The first with count 1 is the answer.',
        why: 'We need the original order of characters, so we must scan the string again rather than the map (maps are unordered).',
        animations: [
          { type: 'showText' as any, value: 'Pass 2: Find first char with freq=1', color: '#3B82F6' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#3B82F6', label: 'for (int i = 0; i < s.length(); i++)' },
        ],
      },
      {
        title: 'Check \'l\' (index 0)',
        description:
          'Character is \'l\'. freq[\'l\'] = 2. Not 1. Continue.',
        animations: [
          { type: 'highlight' as any, target: 'index-0', color: '#EAB308', label: 'i=0: \'l\' freq=2 (repeating)' },
          { type: 'showVariable' as any, target: 'freq[l]', value: '2', color: '#EAB308', label: 'freq[l] = 2 != 1' },
        ],
      },
      {
        title: 'Check \'v\' (index 2)',
        description:
          'Character is \'v\'. freq[\'v\'] = 1. This is the first non-repeating character!',
        why: '\'v\' has a frequency of 1, meaning it appears only once in the entire string.',
        animations: [
          { type: 'highlight' as any, target: 'index-2', color: '#22C55E', label: 'i=2: \'v\' freq=1 -> FOUND!' },
          { type: 'glow' as any, target: 'char-v', color: '#22C55E', label: 'First unique: v at index 2' },
          { type: 'showVariable' as any, target: 'result', value: '2', color: '#22C55E', label: 'return 2' },
          { type: 'showText' as any, value: 'First non-repeating character is \'v\' at index 2', color: '#22C55E' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#22C55E', label: 'if (freq[s[i]] == 1) return i' },
        ],
      },
      {
        title: 'Return Index',
        description:
          'Return 2 as the index of the first non-repeating character.',
        animations: [
          { type: 'glow' as any, target: 'result-index', color: '#22C55E', label: 'Answer: 2' },
          { type: 'showText' as any, value: 'First non-repeating: \'v\' at index 2', color: '#22C55E' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#22C55E', label: 'return -1' },
        ],
      },
    ],
    pseudocode: [
      'function firstUniqChar(s):',
      '  freq = {}',
      '',
      '  // First pass: count frequencies',
      '  for each char c in s:',
      '    freq[c]++',
      '',
      '  // Second pass: find first unique',
      '  for i = 0 to s.length - 1:',
      '    if freq[s[i]] == 1:',
      '      return i',
      '',
      '  return -1  // No unique character',
    ],
    code: {
      cpp: `int firstUniqChar(string s) {
  unordered_map<char, int> freq;

  for (char c : s) {
    freq[c]++;
  }

  for (int i = 0; i < s.length(); i++) {
    if (freq[s[i]] == 1) {
      return i;
    }
  }

  return -1;
}`,
      javascript: `function firstUniqChar(s) {
  const freq = new Map();

  for (const c of s) {
    freq.set(c, (freq.get(c) || 0) + 1);
  }

  for (let i = 0; i < s.length; i++) {
    if (freq.get(s[i]) === 1) {
      return i;
    }
  }

  return -1;
}`,
    },
    complexity: { time: 'O(n)', space: 'O(1)' },
    commonMistakes: [
      'Only doing one pass and trying to track unique status on the fly (doesn\'t work without knowing total counts)',
      'Using a Set instead of a Map — need to know the count, not just presence',
      'Returning the character instead of its index',
      'Forgetting to return -1 when no non-repeating character exists',
    ],
    tips: [
      'The two-pass approach is simple and optimal: O(n) time, O(1) space (alphabet size is bounded)',
      'For Unicode strings, the map can grow, but for ASCII, space is O(26) or O(256)',
      'Can be solved in one pass using a Map with index tracking, but two-pass is cleaner',
      'This problem is a classic application of frequency counting with hash maps',
    ],
    inputExample: { s: 'loveleetcode' },
  },

  {
    id: 'group-anagrams',
    title: 'Group Anagrams',
    difficulty: 'Medium',
    topic: 'HashMap',
    level: 3,
    problem:
      'Given an array of strings, group anagrams together. Anagrams are strings that contain the same characters in any order.',
    example:
      'Input: strs = ["eat", "tea", "tan", "ate", "nat", "bat"]\nOutput: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]\n\nExplanation: "eat", "tea", "ate" are anagrams of each other. "tan" and "nat" are anagrams. "bat" has no anagram.',
    intuition:
      'Use a hash map where the key is the sorted version of each string (or character count signature). All anagrams produce the same key. Group them by appending each original string to the list for its key.',
    steps: [
      {
        title: 'Initialize Map and Process First String',
        description:
          'Create an empty map. Take the first string "eat". Sort its characters to get "aet".',
        why: 'Anagrams have the same characters, so their sorted forms are identical. Using sorted form as the key groups anagrams together.',
        animations: [
          { type: 'showVariable' as any, target: 'map', value: '{}', color: '#3B82F6', label: 'map = {}' },
          { type: 'highlight' as any, target: 'str-0', color: '#3B82F6', label: 'str = "eat"' },
          { type: 'showVariable' as any, target: 'sorted', value: '"aet"', color: '#F97316', label: 'sorted = "aet"' },
          { type: 'insert' as any, target: 'map', value: '{"aet": ["eat"]}', color: '#F97316', label: 'map["aet"] = ["eat"]' },
          { type: 'showVariable' as any, target: 'map', value: '{aet: ["eat"]}', color: '#F97316', label: 'map: {aet -> [eat]}' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#F97316', label: 'string key = s; sort(key.begin(), key.end()); mp[key].push_back(s)' },
        ],
      },
      {
        title: 'Process "tea"',
        description:
          'String "tea" sorted is "aet". "aet" exists in map -> append "tea" to the list.',
        animations: [
          { type: 'highlight' as any, target: 'str-1', color: '#3B82F6', label: 'str = "tea"' },
          { type: 'showVariable' as any, target: 'sorted', value: '"aet"', color: '#EAB308', label: 'sorted = "aet"' },
          { type: 'compare' as any, target: ['key-aet', 'map'], color: '#EAB308', label: '"aet" in map? Yes!' },
          { type: 'updateVariable' as any, target: 'map["aet"]', value: '["eat", "tea"]', color: '#22C55E', label: 'group: [eat, tea]' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#22C55E', label: 'mp[key].push_back(s)' },
        ],
      },
      {
        title: 'Process "tan"',
        description:
          'String "tan" sorted is "ant". "ant" is a new key -> create new group.',
        animations: [
          { type: 'highlight' as any, target: 'str-2', color: '#3B82F6', label: 'str = "tan"' },
          { type: 'showVariable' as any, target: 'sorted', value: '"ant"', color: '#F97316', label: 'sorted = "ant"' },
          { type: 'insert' as any, target: 'map', value: '{"ant": ["tan"]}', color: '#F97316', label: 'new key: map["ant"] = ["tan"]' },
          { type: 'showVariable' as any, target: 'map', value: '{aet:[eat,tea], ant:[tan]}', color: '#F97316', label: 'map: 2 groups' },
        ],
      },
      {
        title: 'Process "ate"',
        description:
          'String "ate" sorted is "aet". Appends to the first group.',
        animations: [
          { type: 'highlight' as any, target: 'str-3', color: '#3B82F6', label: 'str = "ate"' },
          { type: 'showVariable' as any, target: 'sorted', value: '"aet"', color: '#EAB308', label: 'sorted = "aet"' },
          { type: 'updateVariable' as any, target: 'map["aet"]', value: '["eat", "tea", "ate"]', color: '#22C55E', label: 'group grows: [eat, tea, ate]' },
        ],
      },
      {
        title: 'Process Remaining Strings',
        description:
          '"nat" sorted = "ant" -> appends to second group. "bat" sorted = "abt" -> new third group.',
        animations: [
          { type: 'highlight' as any, target: 'str-4', color: '#3B82F6', label: '"nat" -> "ant" -> group 2' },
          { type: 'updateVariable' as any, target: 'map["ant"]', value: '["tan", "nat"]', color: '#22C55E', label: 'group 2: [tan, nat]' },
          { type: 'highlight' as any, target: 'str-5', color: '#3B82F6', label: '"bat" -> "abt" -> new group 3' },
          { type: 'insert' as any, target: 'map', value: '{"abt": ["bat"]}', color: '#F97316', label: 'new key: map["abt"] = ["bat"]' },
        ],
      },
      {
        title: 'Return Grouped Anagrams',
        description:
          'Return the values of the map as a list of anagram groups.',
        animations: [
          { type: 'glow' as any, target: 'map-values', color: '#22C55E', label: '3 groups formed' },
          { type: 'showText' as any, value: '[[eat,tea,ate], [tan,nat], [bat]]', color: '#22C55E' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#22C55E', label: 'vector<vector<string>> result; for (auto& p : mp) result.push_back(p.second); return result' },
        ],
      },
    ],
    pseudocode: [
      'function groupAnagrams(strs):',
      '  map = {}',
      '',
      '  for each string s in strs:',
      '    sorted = s.sort()',
      '    map[sorted].push(s)',
      '',
      '  return map.values() as list',
    ],
    code: {
      cpp: `vector<vector<string>> groupAnagrams(vector<string>& strs) {
  unordered_map<string, vector<string>> mp;

  for (string s : strs) {
    string key = s;
    sort(key.begin(), key.end());
    mp[key].push_back(s);
  }

  vector<vector<string>> result;
  for (auto& p : mp) {
    result.push_back(p.second);
  }

  return result;
}`,
      javascript: `function groupAnagrams(strs) {
  const map = new Map();

  for (const s of strs) {
    const key = s.split('').sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(s);
  }

  return Array.from(map.values());
}`,
    },
    complexity: { time: 'O(n * k log k)', space: 'O(n * k)' },
    commonMistakes: [
      'Modifying the original string instead of creating a copy for sorting',
      'Using an inefficient sorting approach (k log k is optimal for each string of length k)',
      'Not using a Map in JavaScript and trying to use a plain object (less reliable for keys)',
      'Forgetting to initialize the list before pushing when using Map in JS',
    ],
    tips: [
      'The sorted-key approach is the most intuitive. For very long strings, a character count signature (26-element array) can be more efficient',
      'Time complexity: O(n * k log k) where n is number of strings and k is max string length',
      'The char count approach improves to O(n * k) but uses more complex keys',
      'This problem demonstrates how custom key generation enables flexible grouping with hash maps',
    ],
    inputExample: { strs: ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'] },
  },

  {
    id: 'contains-duplicate',
    title: 'Contains Duplicate',
    difficulty: 'Easy',
    topic: 'HashMap',
    level: 3,
    problem:
      'Given an array of integers, return true if any value appears at least twice, and false if every element is distinct.',
    example:
      'Input: nums = [1, 2, 3, 1]\nOutput: true\n\nInput: nums = [1, 2, 3, 4]\nOutput: false',
    intuition:
      'Use a hash set to track elements we have seen. Iterate through the array: for each element, check if it is already in the set. If yes, return true (duplicate found). Otherwise, add it to the set. If we finish the array without finding duplicates, return false.',
    steps: [
      {
        title: 'Initialize Hash Set',
        description:
          'Create an empty hash set to track seen elements.',
        why: 'A hash set provides O(1) lookups and insertions, making duplicate detection efficient.',
        animations: [
          { type: 'showVariable' as any, target: 'set', value: '{}', color: '#3B82F6', label: 'set = {}' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#3B82F6', label: 'unordered_set<int> seen' },
        ],
      },
      {
        title: 'Process nums[0] = 1',
        description:
          'Element is 1. Is 1 in the set? No (set is empty). Add 1 to the set.',
        why: 'First occurrence of 1. We store it to detect if it appears again later.',
        animations: [
          { type: 'highlight' as any, target: 'index-0', color: '#3B82F6', label: 'i=0, nums[0]=1' },
          { type: 'compare' as any, target: ['val-1', 'set'], color: '#EAB308', label: '1 in set? No' },
          { type: 'insert' as any, target: 'set', value: '1', color: '#F97316', label: 'add 1 to set' },
          { type: 'showVariable' as any, target: 'set', value: '{1}', color: '#F97316', label: 'seen: {1}' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#F97316', label: 'if (seen.count(nums[i])) return true; seen.insert(nums[i])' },
        ],
      },
      {
        title: 'Process nums[1] = 2',
        description:
          'Element is 2. Not in set. Add 2.',
        animations: [
          { type: 'highlight' as any, target: 'index-1', color: '#3B82F6', label: 'i=1, nums[1]=2' },
          { type: 'compare' as any, target: ['val-2', 'set'], color: '#EAB308', label: '2 in set? No' },
          { type: 'insert' as any, target: 'set', value: '2', color: '#F97316', label: 'add 2 to set' },
          { type: 'showVariable' as any, target: 'set', value: '{1, 2}', color: '#F97316', label: 'seen: {1, 2}' },
        ],
      },
      {
        title: 'Process nums[2] = 3',
        description:
          'Element is 3. Not in set. Add 3.',
        animations: [
          { type: 'highlight' as any, target: 'index-2', color: '#3B82F6', label: 'i=2, nums[2]=3' },
          { type: 'compare' as any, target: ['val-3', 'set'], color: '#EAB308', label: '3 in set? No' },
          { type: 'insert' as any, target: 'set', value: '3', color: '#F97316', label: 'add 3 to set' },
          { type: 'showVariable' as any, target: 'set', value: '{1, 2, 3}', color: '#F97316', label: 'seen: {1, 2, 3}' },
        ],
      },
      {
        title: 'Process nums[3] = 1 — Duplicate!',
        description:
          'Element is 1. Is 1 in the set? Yes! We have seen it before (at index 0). Duplicate detected!',
        why: 'Since 1 was already added to the set, encountering it again means there is a duplicate in the array.',
        animations: [
          { type: 'highlight' as any, target: 'index-3', color: '#EF4444', label: 'i=3, nums[3]=1' },
          { type: 'compare' as any, target: ['val-1', 'set'], color: '#EF4444', label: '1 in set? YES! DUPLICATE!' },
          { type: 'glow' as any, target: 'duplicate-mark', color: '#EF4444', label: 'Duplicate found: 1' },
          { type: 'showVariable' as any, target: 'result', value: 'true', color: '#EF4444', label: 'return true' },
          { type: 'showText' as any, value: 'Array contains duplicate (1 appears twice)', color: '#EF4444' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#EF4444', label: 'return true' },
        ],
      },
      {
        title: 'Return True',
        description:
          'Since a duplicate was found, return true.',
        animations: [
          { type: 'glow' as any, target: 'result', color: '#EF4444', label: 'Contains Duplicate: true' },
          { type: 'showText' as any, value: 'nums = [1,2,3,1] -> true (1 appears twice)', color: '#EF4444' },
          { type: 'highlightCode' as any, target: 'cpp', color: '#EF4444', label: 'return false (unreached)' },
        ],
      },
    ],
    pseudocode: [
      'function containsDuplicate(nums):',
      '  seen = empty Set',
      '',
      '  for each num in nums:',
      '    if num in seen:',
      '      return true  // Duplicate found',
      '    seen.add(num)',
      '',
      '  return false  // All elements unique',
    ],
    code: {
      cpp: `bool containsDuplicate(vector<int>& nums) {
  unordered_set<int> seen;

  for (int num : nums) {
    if (seen.count(num)) {
      return true;
    }
    seen.insert(num);
  }

  return false;
}`,
      javascript: `function containsDuplicate(nums) {
  const seen = new Set();

  for (const num of nums) {
    if (seen.has(num)) {
      return true;
    }
    seen.add(num);
  }

  return false;
}`,
    },
    complexity: { time: 'O(n)', space: 'O(n)' },
    commonMistakes: [
      'Using a Map instead of a Set when only presence tracking is needed',
      'Adding all elements first then checking for duplicates in a second pass (wasteful)',
      'Not returning early when a duplicate is found',
      'Using O(n^2) brute force (nested loops) instead of O(n) hash set approach',
    ],
    tips: [
      'A Set is the most appropriate data structure — we only care about presence, not counts',
      'Early termination on first duplicate improves average-case performance',
      'Can also use sorting: sort first, then check adjacent elements (O(n log n) time, O(1) space)',
      'The hash set approach is optimal for average-case O(n) time, though it uses O(n) extra space',
    ],
    inputExample: { nums: [1, 2, 3, 1] },
  },
];

