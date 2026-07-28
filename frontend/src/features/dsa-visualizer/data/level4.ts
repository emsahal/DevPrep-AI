import type { QuestionData } from '../types'

export const level4Questions: QuestionData[] = [
  {
    id: 'tree-traversals',
    title: 'Tree Traversals (Inorder/Preorder/Postorder)',
    difficulty: 'Easy',
    topic: 'Trees',
    level: 4,
    problem: 'Given the root of a binary tree, perform inorder, preorder, and postorder traversals. Inorder: left-root-right. Preorder: root-left-right. Postorder: left-right-root.',
    example: 'Input: root = [1, 2, 3, 4, 5, null, 6]\nInorder: [4, 2, 5, 1, 3, 6]\nPreorder: [1, 2, 4, 5, 3, 6]\nPostorder: [4, 5, 2, 6, 3, 1]',
    intuition: 'Tree traversals visit every node exactly once, differing only in the order. Recursion implicitly uses the call stack, making the implementation elegant.',
    steps: [
      {
        title: 'Start at root',
        description: 'Begin traversal at root node with value 1. We will demonstrate inorder traversal.',
        why: 'The root is the entry point for all traversals.',
        animations: [
          { type: 'visitNode', target: '1', value: 1, color: '#3B82F6', label: 'Start at root 1' },
          { type: 'showTree', data: { type: 'binary-tree', nodes: [1, 2, 3, 4, 5, null, 6] } },
          { type: 'showText', value: 'Inorder: left → root → right', color: '#3B82F6' },
        ],
      },
      {
        title: 'Go left to 2',
        description: 'Recursively traverse left subtree of 1. Move to node 2.',
        why: 'In inorder, we fully explore the left subtree before visiting the root.',
        animations: [
          { type: 'connectNodes', from: '1', to: '2', color: '#3B82F6', label: 'Go left' },
          { type: 'visitNode', target: '2', value: 2, color: '#3B82F6', label: 'Move to node 2' },
          { type: 'showStack', value: 'Call stack: [1, 2]', color: '#F97316' },
        ],
      },
      {
        title: 'Go left to 4',
        description: 'From node 2, go left to node 4. No left child of 4, so visit 4.',
        why: 'Node 4 has no left child (null), so we visit it, then check its right child (also null).',
        animations: [
          { type: 'connectNodes', from: '2', to: '4', color: '#3B82F6', label: 'Go left to 4' },
          { type: 'visitNode', target: '4', value: 4, color: '#22C55E', label: 'Visit node 4 (no left child)' },
          { type: 'highlightCode', value: 'inorder(node.left); visit(node); inorder(node.right);', color: '#EAB308' },
          { type: 'showStack', value: 'Call stack: [1, 2, 4] → visiting 4', color: '#F97316' },
        ],
      },
      {
        title: 'Back to 2, visit 2',
        description: 'Return from left subtree of 2. Visit node 2, then go to its right child 5.',
        why: 'After left subtree is done, we visit the root node of the current subtree.',
        animations: [
          { type: 'visitNode', target: '2', value: 2, color: '#22C55E', label: 'Visit node 2' },
          { type: 'connectNodes', from: '2', to: '5', color: '#3B82F6', label: 'Go right to 5' },
          { type: 'showStack', value: 'Call stack: [1] → visiting 2, go right', color: '#F97316' },
        ],
      },
      {
        title: 'Visit 5, back to 1',
        description: 'Visit node 5 (no children). Return to node 1 via recursion stack.',
        why: 'Node 5 is a leaf, so both children are null. Visit it and return.',
        animations: [
          { type: 'visitNode', target: '5', value: 5, color: '#22C55E', label: 'Visit node 5' },
          { type: 'connectNodes', from: '5', to: '1', color: '#6B7280', label: 'Return to root 1' },
          { type: 'showStack', value: 'Call stack: [1] → returning from left', color: '#6B7280' },
        ],
      },
      {
        title: 'Visit root 1, go right',
        description: 'Visit root node 1. Then recursively traverse right subtree starting at 3.',
        why: 'Root is visited after left subtree and before right subtree (inorder).',
        animations: [
          { type: 'visitNode', target: '1', value: 1, color: '#22C55E', label: 'Visit root 1' },
          { type: 'connectNodes', from: '1', to: '3', color: '#3B82F6', label: 'Go right to 3' },
          { type: 'showStack', value: 'Call stack: [3]', color: '#F97316' },
        ],
      },
      {
        title: 'Traverse right subtree',
        description: 'From 3, go left (null), visit 3, go right to 6, visit 6.',
        why: 'Apply the same inorder logic: left → root → right on the right subtree.',
        animations: [
          { type: 'visitNode', target: '3', value: 3, color: '#22C55E', label: 'Visit node 3' },
          { type: 'connectNodes', from: '3', to: '6', color: '#3B82F6', label: 'Go right to 6' },
          { type: 'visitNode', target: '6', value: 6, color: '#22C55E', label: 'Visit node 6' },
        ],
      },
      {
        title: 'Traversal complete',
        description: 'Inorder traversal result: [4, 2, 5, 1, 3, 6]. The same logic applies to preorder (root-left-right) and postorder (left-right-root).',
        why: 'Only the order of visiting root vs children changes between traversal types.',
        animations: [
          { type: 'showText', value: 'Inorder: [4, 2, 5, 1, 3, 6]', color: '#22C55E' },
          { type: 'showText', value: 'Preorder: [1, 2, 4, 5, 3, 6] | Postorder: [4, 5, 2, 6, 3, 1]', color: '#22C55E' },
          { type: 'glow', target: '1', value: 1, color: '#22C55E', label: 'All traversals complete' },
        ],
      },
    ],
    pseudocode: [
      'function inorder(node):',
      '  if node == null: return',
      '  inorder(node.left)',
      '  visit(node)',
      '  inorder(node.right)',
      '',
      'function preorder(node):',
      '  if node == null: return',
      '  visit(node)',
      '  preorder(node.left)',
      '  preorder(node.right)',
      '',
      'function postorder(node):',
      '  if node == null: return',
      '  postorder(node.left)',
      '  postorder(node.right)',
      '  visit(node)',
    ],
    code: {
      cpp: `void inorder(TreeNode* root) {
  if (!root) return;
  inorder(root->left);
  cout << root->val << " ";
  inorder(root->right);
}

void preorder(TreeNode* root) {
  if (!root) return;
  cout << root->val << " ";
  preorder(root->left);
  preorder(root->right);
}

void postorder(TreeNode* root) {
  if (!root) return;
  postorder(root->left);
  postorder(root->right);
  cout << root->val << " ";
}`,
      javascript: `function inorder(root) {
  if (!root) return;
  inorder(root.left);
  console.log(root.val);
  inorder(root.right);
}

function preorder(root) {
  if (!root) return;
  console.log(root.val);
  preorder(root.left);
  preorder(root.right);
}

function postorder(root) {
  if (!root) return;
  postorder(root.left);
  postorder(root.right);
  console.log(root.val);
}`,
    },
    complexity: { time: 'O(n)', space: 'O(h) where h is tree height' },
    commonMistakes: [
      'Confusing the order of traversal (especially preorder vs postorder)',
      'Forgetting the base case (null node check) causing infinite recursion',
      'Using iterative approach without properly simulating the call stack',
    ],
    tips: [
      'All three traversals visit each node exactly once — only the order differs',
      'Use recursion for simplicity; use explicit stack for iterative traversal',
      'Morris traversal achieves O(1) space by threading the tree',
    ],
    inputExample: { tree: [1, 2, 3, 4, 5, null, 6], traversalType: 'inorder' },
  },
  {
    id: 'height-of-tree',
    title: 'Height of Binary Tree',
    difficulty: 'Easy',
    topic: 'Trees',
    level: 4,
    problem: 'Given the root of a binary tree, find its height. The height is the number of edges on the longest path from the root to a leaf. (Some definitions count nodes — we count edges.)',
    example: 'Input: root = [3, 9, 20, null, null, 15, 7]\nOutput: 2\nExplanation: The longest edge path is 3→20→15 (or 3→20→7), which has 2 edges.',
    intuition: 'The height of a tree is the maximum of the heights of its left and right subtrees, plus 1 (for the edge to the root). This recursive definition lends itself perfectly to a divide-and-conquer solution.',
    steps: [
      {
        title: 'Start at root',
        description: 'Start at root node 3. We recursively compute the height of left and right subtrees.',
        why: 'The height of the root depends on the taller of its two children subtrees.',
        animations: [
          { type: 'visitNode', target: '3', value: 3, color: '#3B82F6', label: 'Root 3' },
          { type: 'showTree', data: { type: 'binary-tree', nodes: [3, 9, 20, null, null, 15, 7] } },
          { type: 'showText', value: 'height(node) = 1 + max(height(left), height(right))', color: '#3B82F6' },
        ],
      },
      {
        title: 'Compute left subtree height',
        description: 'Move to left child 9. Node 9 has no children, so its height is 0 (no edges below it).',
        why: 'A leaf node has height 0 because there are 0 edges from it to any leaf (it is itself a leaf).',
        animations: [
          { type: 'connectNodes', from: '3', to: '9', color: '#3B82F6', label: 'Go left to 9' },
          { type: 'visitNode', target: '9', value: 9, color: '#EAB308', label: 'Leaf node 9' },
          { type: 'showVariable', target: 'leftHeight', value: 0, label: 'height(9) = 0', color: '#22C55E' },
        ],
      },
      {
        title: 'Return to root, go right',
        description: 'Left subtree height = 0. Now compute right subtree height from node 20.',
        why: 'We need the right subtree height to compute the overall height.',
        animations: [
          { type: 'connectNodes', from: '9', to: '3', color: '#6B7280', label: 'Return to 3' },
          { type: 'connectNodes', from: '3', to: '20', color: '#3B82F6', label: 'Go right to 20' },
          { type: 'visitNode', target: '20', value: 20, color: '#3B82F6', label: 'Node 20' },
          { type: 'showVariable', target: 'leftHeight', value: 0, label: 'height(9) = 0', color: '#6B7280' },
        ],
      },
      {
        title: 'Height of node 20 left',
        description: 'From node 20, go left to 15. Node 15 has no children, height = 0.',
        why: 'Recursively compute height of 20\'s left child.',
        animations: [
          { type: 'connectNodes', from: '20', to: '15', color: '#3B82F6', label: 'Go left to 15' },
          { type: 'visitNode', target: '15', value: 15, color: '#EAB308', label: 'Leaf 15' },
          { type: 'showVariable', target: 'h15', value: 0, label: 'height(15) = 0', color: '#22C55E' },
        ],
      },
      {
        title: 'Height of node 20 right',
        description: 'From node 20, go right to 7. Node 7 has no children, height = 0.',
        animations: [
          { type: 'connectNodes', from: '15', to: '20', color: '#6B7280', label: 'Return to 20' },
          { type: 'connectNodes', from: '20', to: '7', color: '#3B82F6', label: 'Go right to 7' },
          { type: 'visitNode', target: '7', value: 7, color: '#EAB308', label: 'Leaf 7' },
          { type: 'showVariable', target: 'h7', value: 0, label: 'height(7) = 0', color: '#22C55E' },
        ],
      },
      {
        title: 'Compute height(20)',
        description: 'height(20) = 1 + max(height(15), height(7)) = 1 + max(0, 0) = 1.',
        why: 'Node 20 has one edge to its taller child (both equal at 0). So height is 1.',
        animations: [
          { type: 'visitNode', target: '20', value: 20, color: '#F97316', label: 'Computing height(20)' },
          { type: 'showVariable', target: 'rightHeight', value: 1, label: 'height(20) = 1', color: '#22C55E' },
          { type: 'highlightCode', value: 'return 1 + max(leftHeight, rightHeight)', color: '#EAB308' },
        ],
      },
      {
        title: 'Compute overall height',
        description: 'height(3) = 1 + max(height(9), height(20)) = 1 + max(0, 1) = 2.',
        why: 'The right subtree (rooted at 20) has height 1, so the overall tree height is 2 (edges: 3→20→15 or 3→20→7).',
        animations: [
          { type: 'visitNode', target: '3', value: 3, color: '#F97316', label: 'Root height calculation' },
          { type: 'showVariable', target: 'leftHeight', value: 0, label: 'height(9) = 0', color: '#6B7280' },
          { type: 'showVariable', target: 'rightHeight', value: 1, label: 'height(20) = 1', color: '#6B7280' },
          { type: 'updateVariable', target: 'treeHeight', value: 2, label: 'height(3) = 2', color: '#22C55E' },
        ],
      },
      {
        title: 'Result',
        description: 'Tree height is 2. The longest root-to-leaf path (3→20→15 or 3→20→7) has 2 edges.',
        animations: [
          { type: 'showText', value: 'Height = 2', color: '#22C55E' },
          { type: 'pulse', target: '3', value: 3, color: '#22C55E', label: 'Tree height computed' },
        ],
      },
    ],
    pseudocode: [
      'function height(root):',
      '  if root == null: return -1   // or 0 if counting nodes',
      '  leftHeight = height(root.left)',
      '  rightHeight = height(root.right)',
      '  return 1 + max(leftHeight, rightHeight)',
    ],
    code: {
      cpp: `int height(TreeNode* root) {
  if (!root) return -1;  // -1 because we count edges
  int leftHeight = height(root->left);
  int rightHeight = height(root->right);
  return 1 + max(leftHeight, rightHeight);
}`,
      javascript: `function height(root) {
  if (!root) return -1;  // -1 because we count edges
  const leftHeight = height(root.left);
  const rightHeight = height(root.right);
  return 1 + Math.max(leftHeight, rightHeight);
}`,
    },
    complexity: { time: 'O(n)', space: 'O(h) where h is tree height' },
    commonMistakes: [
      'Returning 0 for null instead of -1 (off-by-one in edge-counting definition)',
      'Forgetting the base case, causing infinite recursion',
      'Confusing height with depth (depth is distance from root; height is distance to deepest leaf)',
    ],
    tips: [
      'Remember: height counts edges, depth counts edges from root',
      'For node-counting height, return 0 for null',
      'The recursion depth equals the tree height — watch for stack overflow on skewed trees',
    ],
    inputExample: { tree: [3, 9, 20, null, null, 15, 7] },
  },
  {
    id: 'balanced-tree',
    title: 'Balanced Binary Tree Check',
    difficulty: 'Easy',
    topic: 'Trees',
    level: 4,
    problem: 'Given a binary tree, determine if it is height-balanced. A tree is balanced if the absolute height difference between the left and right subtrees of every node is at most 1.',
    example: 'Input: root = [3, 9, 20, null, null, 15, 7]\nOutput: true\nExplanation: height(9)=0, height(20)=1, diff=|0-1|=1 ≤ 1. height(3)=2, diff=|0-1|=1 ≤ 1. All nodes satisfy the condition.',
    intuition: 'We augment the height computation to also check balance. If any node has unbalanced children, we propagate -1 (or a sentinel) upward to signal imbalance.',
    steps: [
      {
        title: 'Start at root 3',
        description: 'Begin checking from root 3. We need heights of left (9) and right (20) subtrees.',
        why: 'A tree is balanced if every node\'s left-right height difference ≤ 1. Check bottom-up via postorder.',
        animations: [
          { type: 'visitNode', target: '3', value: 3, color: '#3B82F6', label: 'Root 3' },
          { type: 'showTree', data: { type: 'binary-tree', nodes: [3, 9, 20, null, null, 15, 7] } },
          { type: 'showText', value: 'Balanced if |height(left) - height(right)| ≤ 1 for every node', color: '#3B82F6' },
        ],
      },
      {
        title: 'Check node 9',
        description: 'Node 9 has no children. height(9) = 0 (leaf). It is balanced.',
        why: 'A leaf has no children, so height difference is 0 ≤ 1. Trivially balanced.',
        animations: [
          { type: 'connectNodes', from: '3', to: '9', color: '#3B82F6', label: 'Check left child 9' },
          { type: 'visitNode', target: '9', value: 9, color: '#22C55E', label: 'Leaf 9, height=0, balanced' },
          { type: 'showVariable', target: 'height(9)', value: 0, label: 'height(9) = 0', color: '#22C55E' },
        ],
      },
      {
        title: 'Check node 15',
        description: 'Node 15 has no children. height(15) = 0. Balanced.',
        animations: [
          { type: 'connectNodes', from: '20', to: '15', color: '#3B82F6', label: 'Go to 15' },
          { type: 'visitNode', target: '15', value: 15, color: '#22C55E', label: 'Leaf 15, height=0, balanced' },
          { type: 'showVariable', target: 'height(15)', value: 0, label: 'height(15) = 0', color: '#22C55E' },
        ],
      },
      {
        title: 'Check node 7',
        description: 'Node 7 has no children. height(7) = 0. Balanced.',
        animations: [
          { type: 'connectNodes', from: '20', to: '7', color: '#3B82F6', label: 'Go to 7' },
          { type: 'visitNode', target: '7', value: 7, color: '#22C55E', label: 'Leaf 7, height=0, balanced' },
          { type: 'showVariable', target: 'height(7)', value: 0, label: 'height(7) = 0', color: '#22C55E' },
        ],
      },
      {
        title: 'Check node 20',
        description: 'height(15)=0, height(7)=0. Diff = |0-0| = 0 ≤ 1. height(20) = 1 + max(0,0) = 1. Balanced.',
        why: 'Node 20 has two leaf children with equal height. The subtree rooted at 20 is balanced.',
        animations: [
          { type: 'visitNode', target: '20', value: 20, color: '#22C55E', label: 'Node 20' },
          { type: 'showVariable', target: 'diff', value: 0, label: '|0-0| = 0 ≤ 1 ✓', color: '#22C55E' },
          { type: 'updateVariable', target: 'height(20)', value: 1, label: 'height(20) = 1', color: '#22C55E' },
        ],
      },
      {
        title: 'Check root 3',
        description: 'height(9)=0, height(20)=1. Diff = |0-1| = 1 ≤ 1. Tree is balanced!',
        why: 'The root passes the balance check, so the entire tree is height-balanced.',
        animations: [
          { type: 'visitNode', target: '3', value: 3, color: '#22C55E', label: 'Root 3 final check' },
          { type: 'showVariable', target: 'diff', value: 1, label: '|0-1| = 1 ≤ 1 ✓', color: '#22C55E' },
          { type: 'showText', value: 'Tree is balanced!', color: '#22C55E' },
          { type: 'pulse', target: '3', value: 3, color: '#22C55E', label: 'Balanced' },
        ],
      },
    ],
    pseudocode: [
      'function isBalanced(root):',
      '  return checkHeight(root) != -1',
      '',
      'function checkHeight(node):',
      '  if node == null: return 0',
      '  left = checkHeight(node.left)',
      '  if left == -1: return -1',
      '  right = checkHeight(node.right)',
      '  if right == -1: return -1',
      '  if abs(left - right) > 1: return -1',
      '  return 1 + max(left, right)',
    ],
    code: {
      cpp: `int checkHeight(TreeNode* root) {
  if (!root) return 0;
  int left = checkHeight(root->left);
  if (left == -1) return -1;
  int right = checkHeight(root->right);
  if (right == -1) return -1;
  if (abs(left - right) > 1) return -1;
  return 1 + max(left, right);
}

bool isBalanced(TreeNode* root) {
  return checkHeight(root) != -1;
}`,
      javascript: `function checkHeight(root) {
  if (!root) return 0;
  const left = checkHeight(root.left);
  if (left === -1) return -1;
  const right = checkHeight(root.right);
  if (right === -1) return -1;
  if (Math.abs(left - right) > 1) return -1;
  return 1 + Math.max(left, right);
}

function isBalanced(root) {
  return checkHeight(root) !== -1;
}`,
    },
    complexity: { time: 'O(n)', space: 'O(h)' },
    commonMistakes: [
      'Only checking balance at the root, ignoring deeper nodes',
      'Separately computing height for each node (O(n²) time) instead of augmenting height computation',
      'Confusing height-balanced with perfect/complete binary tree',
    ],
    tips: [
      'The -1 sentinel trick avoids a separate isBalanced flag — clean and efficient',
      'Postorder traversal ensures children are checked before their parent',
      'An empty tree (null) is considered balanced',
    ],
    inputExample: { tree: [3, 9, 20, null, null, 15, 7] },
  },
  {
    id: 'lowest-common-ancestor',
    title: 'Lowest Common Ancestor of a Binary Tree',
    difficulty: 'Medium',
    topic: 'Trees',
    level: 4,
    problem: 'Given a binary tree and two node values p and q, find their lowest common ancestor (LCA). The LCA is the deepest node that has both p and q as descendants.',
    example: 'Input: root = [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], p = 5, q = 1\nOutput: 3\nExplanation: LCA of nodes 5 and 1 is 3, which is the root.',
    intuition: 'We traverse the tree recursively. If a node matches p or q, we return it. If both left and right recursive calls return non-null, the current node is the LCA.',
    steps: [
      {
        title: 'Start at root 3',
        description: 'Begin traversal at root 3. We are searching for nodes 5 (p) and 1 (q).',
        why: 'We use a recursive postorder search: check children first, then determine if current node is LCA.',
        animations: [
          { type: 'visitNode', target: '3', value: 3, color: '#3B82F6', label: 'Root 3' },
          { type: 'showTree', data: { type: 'binary-tree', nodes: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4] } },
          { type: 'showText', value: 'Find LCA of nodes 5 and 1', color: '#3B82F6' },
        ],
      },
      {
        title: 'Search left subtree of 3',
        description: 'Recursively search left child 5. Node 5 matches p! Return node 5 upward.',
        why: 'We found p=5 in the left subtree. Return it to indicate "found in this subtree".',
        animations: [
          { type: 'connectNodes', from: '3', to: '5', color: '#3B82F6', label: 'Search left: 5 matches p!' },
          { type: 'visitNode', target: '5', value: 5, color: '#22C55E', label: 'Found p = 5' },
          { type: 'glow', target: '5', value: 5, color: '#22C55E', label: 'p found' },
        ],
      },
      {
        title: 'Search right subtree of 3',
        description: 'Recursively search right child 1. Node 1 matches q! Return node 1 upward.',
        why: 'We found q=1 in the right subtree. Both subtrees returned non-null.',
        animations: [
          { type: 'connectNodes', from: '3', to: '1', color: '#3B82F6', label: 'Search right: 1 matches q!' },
          { type: 'visitNode', target: '1', value: 1, color: '#22C55E', label: 'Found q = 1' },
          { type: 'glow', target: '1', value: 1, color: '#22C55E', label: 'q found' },
        ],
      },
      {
        title: 'Determine LCA at root',
        description: 'Left returned 5 (p found), right returned 1 (q found). Therefore, root 3 is their LCA.',
        why: 'When both left and right recursive calls return non-null, the current node is where p and q diverge, making it the LCA.',
        animations: [
          { type: 'visitNode', target: '3', value: 3, color: '#F97316', label: 'Both sides found! 3 is LCA' },
          { type: 'showText', value: 'Left found p, right found q → 3 is LCA', color: '#F97316' },
        ],
      },
      {
        title: 'Edge case: p is ancestor of q',
        description: 'If p=5 and q=4 (in right subtree of 5), search left: 5 matches p. Search right subtree of 5: eventually find 4 in right branch.',
        why: 'When p is an ancestor of q, we return p immediately without searching the full tree.',
        animations: [
          { type: 'connectNodes', from: '5', to: '2', color: '#3B82F6', label: 'Search right of 5' },
          { type: 'connectNodes', from: '2', to: '4', color: '#3B82F6', label: 'Search right of 2' },
          { type: 'visitNode', target: '4', value: 4, color: '#22C55E', label: 'Found q = 4' },
          { type: 'visitNode', target: '5', value: 5, color: '#F97316', label: 'p=5 is ancestor of q=4 → LCA=5' },
        ],
      },
      {
        title: 'Return result',
        description: 'LCA of 5 and 1 is 3. LCA of 5 and 4 is 5. LCA of 4 and 8 is 3.',
        why: 'The algorithm works for all cases: both nodes in tree, one is ancestor of another, or different branches.',
        animations: [
          { type: 'showVariable', target: 'LCA', value: 3, label: 'LCA(5, 1) = 3', color: '#22C55E' },
          { type: 'pulse', target: '3', value: 3, color: '#22C55E', label: 'Lowest Common Ancestor' },
        ],
      },
    ],
    pseudocode: [
      'function lowestCommonAncestor(root, p, q):',
      '  if root == null or root == p or root == q: return root',
      '  left = lowestCommonAncestor(root.left, p, q)',
      '  right = lowestCommonAncestor(root.right, p, q)',
      '  if left and right: return root  // p and q in different subtrees',
      '  return left ? left : right      // both in same subtree',
    ],
    code: {
      cpp: `TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
  if (!root || root == p || root == q) return root;
  TreeNode* left = lowestCommonAncestor(root->left, p, q);
  TreeNode* right = lowestCommonAncestor(root->right, p, q);
  if (left && right) return root;
  return left ? left : right;
}`,
      javascript: `function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) return root;
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  if (left && right) return root;
  return left || right;
}`,
    },
    complexity: { time: 'O(n)', space: 'O(h)' },
    commonMistakes: [
      'Forgetting that a node can be its own descendant (p is ancestor of q)',
      'Not handling the case where p or q is not in the tree',
      'Using node values instead of node references (works only if values are unique)',
    ],
    tips: [
      'This solution works for any binary tree, not just BST',
      'For BST, we can use value comparisons for a more efficient O(log n) approach',
      'The recursive approach is elegant but can overflow for skewed trees; use iterative path-finding as alternative',
    ],
    inputExample: { tree: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], p: 5, q: 1 },
  },
  {
    id: 'level-order-traversal',
    title: 'Level Order Traversal (BFS)',
    difficulty: 'Easy',
    topic: 'Trees',
    level: 4,
    problem: 'Given the root of a binary tree, return its level-order traversal. Visit nodes level by level from left to right. Each level should be grouped as a separate list.',
    example: 'Input: root = [3, 9, 20, null, null, 15, 7]\nOutput: [[3], [9, 20], [15, 7]]\nExplanation: Level 0: [3], Level 1: [9, 20], Level 2: [15, 7].',
    intuition: 'We use a queue to process nodes in FIFO order. At each level, we record the current queue size (number of nodes at that level), dequeue them, and enqueue their children.',
    steps: [
      {
        title: 'Initialize queue with root',
        description: 'Enqueue root node 3. Queue = [3]. level = 0.',
        why: 'BFS uses a queue to ensure we process nodes in the order they are discovered (level by level).',
        animations: [
          { type: 'visitNode', target: '3', value: 3, color: '#3B82F6', label: 'Enqueue root 3' },
          { type: 'showTree', data: { type: 'binary-tree', nodes: [3, 9, 20, null, null, 15, 7] } },
          { type: 'showVariable', target: 'level', value: 0, label: 'Level 0', color: '#3B82F6' },
          { type: 'showText', value: 'Queue: [3]', color: '#F97316' },
        ],
      },
      {
        title: 'Process level 0',
        description: 'Queue has 1 node. Dequeue 3. Add its children: left=9, right=20. Level result: [3].',
        why: 'We record the size of the queue before processing — that tells us how many nodes are at the current level.',
        animations: [
          { type: 'highlightCode', value: 'size = q.size(); for i = 0 to size-1', color: '#EAB308' },
          { type: 'visitNode', target: '3', value: 3, color: '#22C55E', label: 'Visit root 3' },
          { type: 'connectNodes', from: '3', to: '9', color: '#3B82F6', label: 'Enqueue left 9' },
          { type: 'connectNodes', from: '3', to: '20', color: '#3B82F6', label: 'Enqueue right 20' },
          { type: 'showText', value: 'Level 0: [3] | Queue: [9, 20]', color: '#22C55E' },
        ],
      },
      {
        title: 'Process level 1',
        description: 'Queue size = 2. Dequeue 9 and 20. Add children: 9 has none; 20 has 15 and 7. Level result: [9, 20].',
        why: 'We process all nodes currently in the queue (which belong to level 1) before moving to level 2.',
        animations: [
          { type: 'showVariable', target: 'level', value: 1, label: 'Level 1', color: '#F97316' },
          { type: 'visitNode', target: '9', value: 9, color: '#22C55E', label: 'Visit 9' },
          { type: 'visitNode', target: '20', value: 20, color: '#22C55E', label: 'Visit 20' },
          { type: 'connectNodes', from: '20', to: '15', color: '#3B82F6', label: 'Enqueue 15' },
          { type: 'connectNodes', from: '20', to: '7', color: '#3B82F6', label: 'Enqueue 7' },
          { type: 'showText', value: 'Level 1: [9, 20] | Queue: [15, 7]', color: '#22C55E' },
        ],
      },
      {
        title: 'Process level 2',
        description: 'Queue size = 2. Dequeue 15 and 7. No children. Level result: [15, 7]. Queue is empty.',
        why: 'Leaf nodes have no children, so nothing new is enqueued. The traversal ends.',
        animations: [
          { type: 'showVariable', target: 'level', value: 2, label: 'Level 2', color: '#F97316' },
          { type: 'visitNode', target: '15', value: 15, color: '#22C55E', label: 'Visit 15' },
          { type: 'visitNode', target: '7', value: 7, color: '#22C55E', label: 'Visit 7' },
          { type: 'showText', value: 'Level 2: [15, 7] | Queue: []', color: '#22C55E' },
        ],
      },
      {
        title: 'Return result',
        description: 'Final level-order traversal: [[3], [9, 20], [15, 7]].',
        why: 'Each level is grouped into its own array, preserving the tree structure level by level.',
        animations: [
          { type: 'showText', value: 'Level Order: [[3], [9, 20], [15, 7]]', color: '#22C55E' },
          { type: 'glow', target: '3', value: 3, color: '#22C55E', label: 'BFS complete' },
          { type: 'pulse', target: '20', value: 20, color: '#22C55E' },
        ],
      },
    ],
    pseudocode: [
      'function levelOrder(root):',
      '  if root == null: return []',
      '  queue = [root], result = []',
      '  while queue not empty:',
      '    size = queue.length',
      '    level = []',
      '    for i = 0 to size-1:',
      '      node = queue.dequeue()',
      '      level.push(node.val)',
      '      if node.left: queue.enqueue(node.left)',
      '      if node.right: queue.enqueue(node.right)',
      '    result.push(level)',
      '  return result',
    ],
    code: {
      cpp: `vector<vector<int>> levelOrder(TreeNode* root) {
  if (!root) return {};
  vector<vector<int>> result;
  queue<TreeNode*> q;
  q.push(root);
  while (!q.empty()) {
    int size = q.size();
    vector<int> level;
    for (int i = 0; i < size; i++) {
      TreeNode* node = q.front(); q.pop();
      level.push_back(node->val);
      if (node->left) q.push(node->left);
      if (node->right) q.push(node->right);
    }
    result.push_back(level);
  }
  return result;
}`,
      javascript: `function levelOrder(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  while (queue.length) {
    const size = queue.length;
    const level = [];
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}`,
    },
    complexity: { time: 'O(n)', space: 'O(w) where w is max width of tree' },
    commonMistakes: [
      'Not recording the queue size before processing (mixes levels together)',
      'Using recursion (DFS) instead of a queue — recursion doesn\'t naturally do BFS',
      'Forgetting to handle the empty tree case',
    ],
    tips: [
      'The queue size trick is essential for grouping by level',
      'BFS can also be used for shortest path in unweighted graphs',
      'For zigzag order, alternate between queue and stack directions',
    ],
    inputExample: { tree: [3, 9, 20, null, null, 15, 7] },
  },
  {
    id: 'bst-search',
    title: 'Search in a Binary Search Tree',
    difficulty: 'Easy',
    topic: 'Trees',
    level: 4,
    problem: 'Given the root of a BST and a target value, return the node containing that value. If not found, return null. A BST has the property: left subtree values < root value < right subtree values.',
    example: 'Input: root = [4, 2, 7, 1, 3], target = 2\nOutput: Node with value 2 (and its subtree)\nExplanation: Starting at 4, go left to 2, found.',
    intuition: 'BST search exploits the ordering property: compare target with current node value. If equal, return. If smaller, search left. If larger, search right. This eliminates half the tree at each step.',
    steps: [
      {
        title: 'Start at root 4',
        description: 'Current node = 4. Compare target = 2 with 4.',
        why: 'Root is the entry point. BST property tells us which direction to go.',
        animations: [
          { type: 'visitNode', target: '4', value: 4, color: '#3B82F6', label: 'Root 4' },
          { type: 'showTree', data: { type: 'binary-tree', nodes: [4, 2, 7, 1, 3] } },
          { type: 'compare', target: '4', index: 0, color: '#EAB308', label: 'Compare target 2 vs 4' },
          { type: 'showText', value: '2 < 4, go left', color: '#F97316' },
        ],
      },
      {
        title: 'Go left to 2',
        description: 'Since 2 < 4, move to left child. Current node = 2.',
        why: 'In BST, all smaller values are in the left subtree.',
        animations: [
          { type: 'connectNodes', from: '4', to: '2', color: '#3B82F6', label: 'Go left to 2' },
          { type: 'visitNode', target: '2', value: 2, color: '#3B82F6', label: 'Move to node 2' },
          { type: 'highlightCode', value: 'if target < root.val: return search(root.left, target)', color: '#EAB308' },
        ],
      },
      {
        title: 'Compare target with 2',
        description: 'target = 2, current.val = 2. They are equal! Return node 2.',
        why: 'We found the target. In BST search, we return the node pointer/reference.',
        animations: [
          { type: 'compare', target: '2', index: 1, color: '#22C55E', label: '2 === 2, found!' },
          { type: 'glow', target: '2', value: 2, color: '#22C55E', label: 'Target found at node 2' },
          { type: 'showText', value: 'Search successful: node 2 found', color: '#22C55E' },
        ],
      },
      {
        title: 'Return the node',
        description: 'Return the subtree rooted at node 2. If target were not found (e.g., 5), we would continue right from 4 → 7 → left to check for 5, or ultimately return null.',
        animations: [
          { type: 'showVariable', target: 'result', value: 2, label: 'Found node = 2', color: '#22C55E' },
          { type: 'pulse', target: '2', value: 2, color: '#22C55E', label: 'Returning subtree rooted at 2' },
        ],
      },
    ],
    pseudocode: [
      'function searchBST(root, target):',
      '  if root == null or root.val == target: return root',
      '  if target < root.val: return searchBST(root.left, target)',
      '  else: return searchBST(root.right, target)',
    ],
    code: {
      cpp: `TreeNode* searchBST(TreeNode* root, int target) {
  if (!root || root->val == target) return root;
  if (target < root->val) return searchBST(root->left, target);
  return searchBST(root->right, target);
}`,
      javascript: `function searchBST(root, target) {
  if (!root || root.val === target) return root;
  if (target < root.val) return searchBST(root.left, target);
  return searchBST(root.right, target);
}`,
    },
    complexity: { time: 'O(log n) average, O(n) worst', space: 'O(log n) average, O(n) worst' },
    commonMistakes: [
      'Using non-recursive approach without updating the current pointer correctly',
      'Confusing BST property (left < root < right) with heap property',
      'Returning the value instead of the node pointer',
    ],
    tips: [
      'Iterative approach avoids recursion stack overflow for skewed trees',
      'BST search is essentially binary search on a tree structure',
      'The same concept applies for insert, delete, and other BST operations',
    ],
    inputExample: { tree: [4, 2, 7, 1, 3], target: 2 },
  },
  {
    id: 'insert-into-bst',
    title: 'Insert into a Binary Search Tree',
    difficulty: 'Medium',
    topic: 'Trees',
    level: 4,
    problem: 'Insert a value into a BST. The BST property must be maintained after insertion. Return the root of the modified tree. Duplicate values are not allowed.',
    example: 'Input: root = [4, 2, 7, 1, 3], val = 5\nOutput: [4, 2, 7, 1, 3, 5]\nExplanation: Starting at 4, 5 > 4 go right to 7, 5 < 7 go left (null), insert 5 as left child of 7.',
    intuition: 'Search for the insertion position using BST comparison rules. When we reach a null child, we insert the new node there. Recursively, this is clean: root changes only if tree is empty.',
    steps: [
      {
        title: 'Start at root 4',
        description: 'Current node = 4. Compare val = 5 with 4.',
        why: 'We traverse the tree to find the correct insertion point based on BST ordering.',
        animations: [
          { type: 'visitNode', target: '4', value: 4, color: '#3B82F6', label: 'Root 4' },
          { type: 'showTree', data: { type: 'binary-tree', nodes: [4, 2, 7, 1, 3] } },
          { type: 'compare', target: '4', index: 0, color: '#EAB308', label: '5 > 4, go right' },
          { type: 'showText', value: '5 > 4, insert in right subtree', color: '#F97316' },
        ],
      },
      {
        title: 'Go right to 7',
        description: 'Since 5 > 4, move to right child 7.',
        why: 'All values greater than 4 go to the right subtree.',
        animations: [
          { type: 'connectNodes', from: '4', to: '7', color: '#3B82F6', label: 'Go right to 7' },
          { type: 'visitNode', target: '7', value: 7, color: '#3B82F6', label: 'Move to node 7' },
        ],
      },
      {
        title: 'Compare with 7',
        description: 'Current node = 7. Compare val = 5 with 7. 5 < 7, so go left.',
        why: '5 is less than 7, so it belongs in the left subtree of 7.',
        animations: [
          { type: 'compare', target: '7', index: 2, color: '#EAB308', label: '5 < 7, go left' },
          { type: 'connectNodes', from: '7', to: 'null-left', color: '#3B82F6', label: 'Go left (null)' },
          { type: 'showText', value: 'Left child is null — insertion point found!', color: '#22C55E' },
        ],
      },
      {
        title: 'Insert new node 5',
        description: 'Left child of 7 is null. Create new node with value 5 and attach as left child of 7.',
        why: 'We found a null position that preserves BST ordering. The new node is inserted as a leaf.',
        animations: [
          { type: 'showVariable', target: 'newNode', value: 5, label: 'Create node(5)', color: '#F97316' },
          { type: 'connectNodes', from: '7', to: '5', color: '#22C55E', label: 'Insert 5 as left child of 7' },
          { type: 'glow', target: '5', value: 5, color: '#22C55E', label: 'New node 5 inserted' },
        ],
      },
      {
        title: 'Final tree',
        description: 'Updated BST: [4, 2, 7, 1, 3, 5]. BST property is maintained: left < root < right everywhere.',
        why: 'The insertion only adds a leaf — no structural changes needed. BST property is automatically preserved.',
        animations: [
          { type: 'showTree', data: { type: 'binary-tree', nodes: [4, 2, 7, 1, 3, 5] } },
          { type: 'showText', value: 'Insertion complete: 5 successfully added', color: '#22C55E' },
          { type: 'pulse', target: '4', value: 4, color: '#22C55E', label: 'Root unchanged' },
        ],
      },
    ],
    pseudocode: [
      'function insertIntoBST(root, val):',
      '  if root == null: return new TreeNode(val)',
      '  if val < root.val:',
      '    root.left = insertIntoBST(root.left, val)',
      '  else if val > root.val:',
      '    root.right = insertIntoBST(root.right, val)',
      '  return root',
    ],
    code: {
      cpp: `TreeNode* insertIntoBST(TreeNode* root, int val) {
  if (!root) return new TreeNode(val);
  if (val < root->val) root->left = insertIntoBST(root->left, val);
  else if (val > root->val) root->right = insertIntoBST(root->right, val);
  return root;
}`,
      javascript: `function insertIntoBST(root, val) {
  if (!root) return new TreeNode(val);
  if (val < root.val) root.left = insertIntoBST(root.left, val);
  else if (val > root.val) root.right = insertIntoBST(root.right, val);
  return root;
}`,
    },
    complexity: { time: 'O(log n) average, O(n) worst', space: 'O(log n) average, O(n) worst' },
    commonMistakes: [
      'Not handling the case where root is null (empty tree)',
      'Not updating the parent\'s child pointer after recursive insertion',
      'Inserting duplicates (should return root unchanged)',
    ],
    tips: [
      'Always return root to maintain tree connectivity',
      'Iterative insertion avoids recursion overhead',
      'Deletion is more complex — requires handling 3 cases (leaf, one child, two children)',
    ],
    inputExample: { tree: [4, 2, 7, 1, 3], val: 5 },
  },
]
