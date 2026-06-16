import { RoadmapDay, Badge } from '../types';

const INITIAL_30: RoadmapDay[] = [
  {
    day: 1,
    topic: "Arrays & Hashing",
    pattern: "Frequency Map / Brute Force optimization",
    problemName: "Two Sum",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/two-sum/",
    type: "coding",
    xpReward: 100,
    tips: [
      "Use a hash map to map each value to its index.",
      "Check if the complement (target - num) exists in the map as you iterate.",
      "This achieves a time complexity of O(n) instead of O(n^2)."
    ]
  },
  {
    day: 2,
    topic: "Arrays & Hashing",
    pattern: "Character frequency hashing",
    problemName: "Valid Anagram",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/valid-anagram/",
    type: "coding",
    xpReward: 100,
    tips: [
      "Count frequency of each character in both strings.",
      "You can use fixed-size arrays (26 elements) to optimize space to O(1) auxiliary space.",
      "Check if both frequency maps are identical."
    ]
  },
  {
    day: 3,
    topic: "Arrays & Hashing",
    pattern: "Categorizing via Hashmap Keys",
    problemName: "Group Anagrams",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/group-anagrams/",
    type: "coding",
    xpReward: 120,
    tips: [
      "Use the sorted string or a character count tuple as the key of a dictionary.",
      "Append original words to the list of values matching that key.",
      "Time complexity is O(m * n log n) or O(m * n) depending on key representation."
    ]
  },
  {
    day: 4,
    topic: "Arrays & Hashing",
    pattern: "Bucket Sort / Min-Heap count tracking",
    problemName: "Top K Frequent Elements",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/top-k-frequent-elements/",
    type: "coding",
    xpReward: 120,
    tips: [
      "First, build a count map of elements.",
      "Use Bucket Sort where index represents frequency to achieve O(n) time.",
      "Alternatively, use a Min-Heap of size K to achieve O(n log k) time."
    ]
  },
  {
    day: 5,
    topic: "Two Pointers",
    pattern: "Converging pointers (Left/Right)",
    problemName: "Valid Palindrome",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/valid-palindrome/",
    type: "coding",
    xpReward: 100,
    tips: [
      "Sanitize the string first by converting to lowercase and stripping non-alphanumeric chars.",
      "Use left = 0 and right = length - 1 pointers to meet in the middle.",
      "Skip non-alphanumeric characters dynamically during pointer traversal to save space."
    ]
  },
  {
    day: 6,
    topic: "Two Pointers",
    pattern: "Sorted array search indices",
    problemName: "Two Sum II",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
    type: "coding",
    xpReward: 120,
    tips: [
      "Use left at index 0 and right at index len - 1.",
      "If values sum to more than target, decrement right; if less, increment left.",
      "Takes O(n) time and O(1) extra space because the array is pre-sorted."
    ]
  },
  {
    day: 7,
    topic: "Two Pointers",
    pattern: "Sort & Fixed-Pivot search combination",
    problemName: "3Sum",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/3sum/",
    type: "coding",
    xpReward: 150,
    tips: [
      "Sort the array first to avoid duplicates easily and use Two Sum II logic.",
      "Iterate through with index `i`. For each, run Two Pointers on the remaining portion.",
      "Skip duplicate configurations for `i`, `left` and `right` to ensure uniqueness."
    ]
  },
  {
    day: 8,
    topic: "Two Pointers",
    pattern: "Greedy boundary updates",
    problemName: "Container With Most Water",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/container-with-most-water/",
    type: "coding",
    xpReward: 120,
    tips: [
      "Initialize left and right pointers at extreme ends.",
      "Calculate current volume: width * min(height[left], height[right]).",
      "Always move the pointer with the lower height inward to search for higher capacity peaks."
    ]
  },
  {
    day: 9,
    topic: "Sliding Window",
    pattern: "Continuous optimal subarray size track",
    problemName: "Best Time to Buy & Sell Stock",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    type: "coding",
    xpReward: 100,
    tips: [
      "Keep track of the minimum price seen so far.",
      "Calculate the difference between the current price and the minimum price as possible profit.",
      "Update max profit; solve in a single pass of O(n) complexity."
    ]
  },
  {
    day: 10,
    topic: "Sliding Window",
    pattern: "Dynamic right pointer, shrinking left",
    problemName: "Longest Substring Without Repeating",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    type: "coding",
    xpReward: 150,
    tips: [
      "Use a sliding window with a Set to track characters in the current window.",
      "Increment right pointer to expand. If duplicate is found, shrink from left pointer.",
      "Update maximum window size on every valid status index."
    ]
  },
  {
    day: 11,
    topic: "Sliding Window",
    pattern: "Character frequency threshold checking",
    problemName: "Longest Repeating Character Replacement",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/longest-repeating-character-replacement/",
    type: "coding",
    xpReward: 150,
    tips: [
      "Maintain a frequency count of letters in the current window.",
      "The number of replacements needed is: (Window Length - Frequency of Most Frequent Character).",
      "If replacements exceed K, shrink the window from the left."
    ]
  },
  {
    day: 12,
    topic: "Stacks",
    pattern: "Last-In, First-Out (LIFO) match validation",
    problemName: "Valid Parentheses",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/valid-parentheses/",
    type: "coding",
    xpReward: 100,
    tips: [
      "Push incoming opening brackets onto the stack.",
      "When encountering a closing bracket, verify it matches the popped element from stack.",
      "At the end, verify the stack is completely empty."
    ]
  },
  {
    day: 13,
    topic: "Stacks",
    pattern: "Parallel state tracking inside a custom data class",
    problemName: "Min Stack Design",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/min-stack/",
    type: "coding",
    xpReward: 120,
    tips: [
      "Maintain active minimums in a second parallel helper stack.",
      "Whenever pushing `val`, search the standard stack peak, push `min(val, minStack.top())` to the min stack.",
      "All operations: push, pop, top, and retrieve min will operate in O(1) time."
    ]
  },
  {
    day: 14,
    topic: "Stacks",
    pattern: "Postfix notation stack calculations",
    problemName: "Evaluate Reverse Polish Notation",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
    type: "coding",
    xpReward: 120,
    tips: [
      "Iterate through strings. If it is a number, push it integer parsed.",
      "If it is an operator (+, -, *, /), pop the top two numbers, apply the operator, and push back.",
      "Division in JS must truncate toward zero: Math.trunc(op1 / op2)."
    ]
  },
  {
    day: 15,
    topic: "Binary Search",
    pattern: "Search Space Reduction by half",
    problemName: "Binary Search Implementation",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/binary-search/",
    type: "coding",
    xpReward: 100,
    tips: [
      "Initialize low = 0 and high = len - 1.",
      "Find pivot mid = low + Math.floor((high - low) / 2).",
      "Adjust boundaries based on binary pivot comparisons. Log O(log n) performance."
    ]
  },
  {
    day: 16,
    topic: "Binary Search",
    pattern: "Rank matrix flattened indices",
    problemName: "Search a 2D Matrix",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/search-a-2d-matrix/",
    type: "coding",
    xpReward: 120,
    tips: [
      "View the m x n matrix as a single 1D sorted array of length m * n.",
      "To map cell `mid` back to matrix row & col: row = Math.floor(mid / n), col = mid % n.",
      "Run standard binary search on this structural index model."
    ]
  },
  {
    day: 17,
    topic: "Binary Search",
    pattern: "Search on continuous bounds / Answer space search",
    problemName: "Koko Eating Bananas",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/koko-eating-bananas/",
    type: "coding",
    xpReward: 150,
    tips: [
      "The speed key range goes from 1 to max(piles). Binary search on this range.",
      "For a mid speed, compute total hours Koko spends eating. If <= h, it is a candidate.",
      "Shrink search space towards lower speeds to find the absolute minimum speed."
    ]
  },
  {
    day: 18,
    topic: "Linked Lists",
    pattern: "In-place pointer re-wiring",
    problemName: "Reverse Linked List",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/reverse-linked-list/",
    type: "coding",
    xpReward: 100,
    tips: [
      "Maintain current, previous (initially null), and next tmp variable.",
      "Re-route current.next to point to previous in a loop.",
      "Shift previous to current, current to next on each step."
    ]
  },
  {
    day: 19,
    topic: "Linked Lists",
    pattern: "Two pre-sorted nodes zip traversal",
    problemName: "Merge Two Sorted Lists",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/merge-two-sorted-lists/",
    type: "coding",
    xpReward: 100,
    tips: [
      "Create a sentinel dummy node to ease edge cases.",
      "While both lists have remaining elements, append the smaller node and step its list.",
      "At the end, append any remaining elements directly to the tail."
    ]
  },
  {
    day: 20,
    topic: "Trees & Recursion",
    pattern: "Post-order bottom-up swapping",
    problemName: "Invert Binary Tree",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/invert-binary-tree/",
    type: "coding",
    xpReward: 100,
    tips: [
      "Base case: if node is null, return null.",
      "Recursively invert both left and right children.",
      "Swap left and right pointers of the current root, then return root."
    ]
  },
  {
    day: 21,
    topic: "Trees & Recursion",
    pattern: "Depth first search path height mapping",
    problemName: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    type: "coding",
    xpReward: 100,
    tips: [
      "Recursive formula: maxDepth(root) = 1 + max(maxDepth(root.left), maxDepth(root.right)).",
      "Base case: if root is null, depth is zero.",
      "Can also keep track with BFS queue level sizes if you want an iterative solution."
    ]
  },
  {
    day: 22,
    topic: "Trees & Recursion",
    pattern: "Breadth-First Search queue levels tracking",
    problemName: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    type: "coding",
    xpReward: 130,
    tips: [
      "Use a Queue to conduct BFS.",
      "For each level, check the queue length first. Process exactly those many nodes in a loop.",
      "This guarantees grouping node elements tier-by-tier in nested lists."
    ]
  },
  {
    day: 23,
    topic: "Priority Queue / Heaps",
    pattern: "Fixed capacity tracking bucket",
    problemName: "Kth Largest Element in a Stream",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/kth-largest-element-in-a-stream/",
    type: "coding",
    xpReward: 100,
    tips: [
      "Maintain a Min-Heap containing only the K largest elements.",
      "When a new number is introduced, push then pop elements if heap size exceeds K.",
      "The root (top element) of the heap will always represent the Kth largest active element."
    ]
  },
  {
    day: 24,
    topic: "Backtracking",
    pattern: "State space search tree traversal",
    problemName: "Combination Sum",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/combination-sum/",
    type: "coding",
    xpReward: 140,
    tips: [
      "Create a recursive helper function tracking current index, temp path, and current target.",
      "Decision tree branch 1: Include current element and repeat search (can reuse).",
      "Decision tree branch 2: Exclude current element and step to the next index."
    ]
  },
  {
    day: 25,
    topic: "Graphs",
    pattern: "Graph grid coloring (Flood Fill / DFS)",
    problemName: "Number of Islands",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/number-of-islands/",
    type: "coding",
    xpReward: 150,
    tips: [
      "Traverse each grid cell. If cell is '1' (land), increment counter and start a DFS.",
      "DFS is used to 'sink' (flip '1' to '0') all connected land cells recursively.",
      "This prevents double counting the same island from other coordinates."
    ]
  },
  {
    day: 26,
    topic: "Graphs",
    pattern: "Cyclic Reference cloning via HashMap cache",
    problemName: "Clone Graph",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/clone-graph/",
    type: "coding",
    xpReward: 150,
    tips: [
      "Use a hash map to associate old node references to newly created node clones.",
      "Do DFS or BFS to traverse the graph: if node is visited, fetch from map.",
      "Else, instantiate clone and recursively append clones into its adjacency lists."
    ]
  },
  {
    day: 27,
    topic: "Dynamic Programming",
    pattern: "Memoized bottom-up subproblems resolution",
    problemName: "Climbing Stairs",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/climbing-stairs/",
    type: "coding",
    xpReward: 100,
    tips: [
      "Subproblem formula is equivalent to Fibonacci: steps[i] = steps[i-1] + steps[i-2].",
      "Keep only the last two variables in memory to optimize space down to O(1).",
      "Time complexity is linear O(n)."
    ]
  },
  {
    day: 28,
    topic: "Dynamic Programming",
    pattern: "Iterative exclusion maximizing limits",
    problemName: "House Robber",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/house-robber/",
    type: "coding",
    xpReward: 130,
    tips: [
      "For each house, choose maximum between: rob current (val + robbed[n-2]) OR skip (robbed[n-1]).",
      "Use only two variables `rob1` and `rob2` to optimize to O(1) space.",
      "Maintains O(n) runtime performance."
    ]
  },
  {
    day: 29,
    topic: "System Design",
    pattern: "Sizing high-traffic structures",
    problemName: "Horizontal Scalability & Load Balancing",
    difficulty: "Medium",
    link: "https://github.com/donnemartin/system-design-primer",
    type: "system-design",
    xpReward: 150,
    tips: [
      "Learn the difference between Horizonal vs. Vertical Scaling.",
      "Understand load balancer routing algorithms: Round Robin, Weighted, Least Connections, IP Hash.",
      "Study where to place Load Balancers: client-to-web, web-to-service, and service-to-database layers."
    ]
  },
  {
    day: 30,
    topic: "System Design / Behavioral",
    pattern: "Interview final preparation and storytelling structure",
    problemName: "STAR Method + Consistent Caching Store",
    difficulty: "Hard",
    link: "https://github.com/donnemartin/system-design-primer",
    type: "behavioral",
    xpReward: 200,
    tips: [
      "Prepare 3 structured stories matching STAR elements: Situation, Task, Action, Result.",
      "Ensure story represents technical technical leadership, resolving conflict, or ownership.",
      "Review Key-Value store system design schemas: Consistent Hashing, Replication, and Gossip Protocol."
    ]
  }
];

const EXTRA_TEMPLATES: Omit<RoadmapDay, 'day'>[] = [
  {
    topic: "Graphs & Disjoint Sets",
    pattern: "Union Find by Rank & Path Compression",
    problemName: "Redundant Connection",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/redundant-connection/",
    type: "coding",
    xpReward: 120,
    tips: [
      "Process each edge sequentially to check if nodes are already connected using Union-Find.",
      "If insertion makes parents identical, this edge is redundant.",
      "Path compression achieves nearly constant O(α(n)) operation speed."
    ]
  },
  {
    topic: "Tries (Prefix Trees)",
    pattern: "Prefix node child pointer mapping",
    problemName: "Implement Trie (Prefix Tree)",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/implement-trie-prefix-tree/",
    type: "coding",
    xpReward: 120,
    tips: [
      "Build a tree where each node holds pointers to children and an 'isEnd' word flag.",
      "Track words by iterating character-by-character along child maps.",
      "Prefix searches can exit early if matching letter paths are missing."
    ]
  },
  {
    topic: "Dynamic Programming II",
    pattern: "2D Grid coordinates pathways optimization",
    problemName: "Unique Paths",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/unique-paths/",
    type: "coding",
    xpReward: 120,
    tips: [
      "Formulate DP relation: dp[r][c] = dp[r-1][c] + dp[r][c-1].",
      "Optimize space down to O(col_count) by only saving values from the previous row."
    ]
  },
  {
    topic: "Greedy Algorithms",
    pattern: "Gas station fuel checks",
    problemName: "Gas Station",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/gas-station/",
    type: "coding",
    xpReward: 120,
    tips: [
      "Check if total gas is less than total cost first; if so, return -1 immediately.",
      "Iterate once: if net fuel drops below 0, reset start pointer to the next index."
    ]
  },
  {
    topic: "Sliding Window II",
    pattern: "Anagram search window comparison",
    problemName: "Find All Anagrams in a String",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/find-all-anagrams-in-a-string/",
    type: "coding",
    xpReward: 120,
    tips: [
      "Maintain active character count frequencies for window of size len(P).",
      "Slide the window single step at a time, updating hash maps dynamically."
    ]
  },
  {
    topic: "Intervals & Overlaps",
    pattern: "Boundary sorting and collision merging",
    problemName: "Merge Intervals",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/merge-intervals/",
    type: "coding",
    xpReward: 120,
    tips: [
      "Sort interval objects according to their first element value.",
      "Iteratively combine adjacent overlays if next.start <= current.end."
    ]
  },
  {
    topic: "Stacks & Queue II",
    pattern: "Monotonic decreasing indices stack",
    problemName: "Daily Temperatures",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/daily-temperatures/",
    type: "coding",
    xpReward: 120,
    tips: [
      "Maintain a decreasing sequence stack storing numbers' array indices.",
      "When a warmer item arrives, pop and write index difference directly out."
    ]
  },
  {
    topic: "Advanced Graphs",
    pattern: "Shortest routes/Heuristics traversal",
    problemName: "Network Delay Time (Dijkstra)",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/network-delay-time/",
    type: "coding",
    xpReward: 130,
    tips: [
      "Build a graph map connecting router/delay steps.",
      "Utilize a Min-Priority-Queue to process routes with smallest costs first."
    ]
  },
  {
    topic: "Dynamic Programming III",
    pattern: "Subsequence maximum overlap checks",
    problemName: "Longest Common Subsequence",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/longest-common-subsequence/",
    type: "coding",
    xpReward: 130,
    tips: [
      "Establish a bottom-up grid matching characters of strings.",
      "State: dp[i][j] = 1 + dp[i-1][j-1] if match, else max(dp[i-1][j], dp[i][j-1])."
    ]
  },
  {
    topic: "Systems & Scalability",
    pattern: "DNS lookup balances & Geo-Routing",
    problemName: "Consistent Hashing Ring Structures",
    difficulty: "Medium",
    link: "https://github.com/donnemartin/system-design-primer",
    type: "system-design",
    xpReward: 150,
    tips: [
      "Map web clients and server IDs to a 360-degree virtual circular space.",
      "Eliminate single-point loads using multiple dynamic virtual server nodes."
    ]
  },
  {
    topic: "Bitwise Alchemy",
    pattern: "Bit masking and binary addition",
    problemName: "Number of 1 Bits",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/number-of-1-bits/",
    type: "coding",
    xpReward: 100,
    tips: [
      "Repeatedly trigger 'n & (n - 1)' to clear lowest set bit.",
      "Count iterations until integer gets entirely reduced down to zero."
    ]
  },
  {
    topic: "Advanced Subarrays",
    pattern: "Greedy max product multiplier peak",
    problemName: "Maximum Product Subarray",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/maximum-product-subarray/",
    type: "coding",
    xpReward: 120,
    tips: [
      "Track dynamic minimum and maximum products accumulated so far.",
      "When encountering a negative value, swap pre-computed bounds before multiplying."
    ]
  },
  {
    topic: "Advanced Backtracking",
    pattern: "Safe grid pathing matrix placements",
    problemName: "N-Queens Puzzle",
    difficulty: "Hard",
    link: "https://leetcode.com/problems/n-queens/",
    type: "coding",
    xpReward: 200,
    tips: [
      "Backtrack column-by-column placing valid queens.",
      "To prevent diagonal collisions, track row, positive diagonal, negative diagonal states."
    ]
  },
  {
    topic: "Sliding Window III",
    pattern: "Variable bounds matching requirements",
    problemName: "Minimum Window Substring",
    difficulty: "Hard",
    link: "https://leetcode.com/problems/minimum-window-substring/",
    type: "coding",
    xpReward: 150,
    tips: [
      "Use expansion pointers to find windows containing all target letters.",
      "Shrink left boundaries as much as possible until criteria fails."
    ]
  },
  {
    topic: "Advanced Systems Design",
    pattern: "Publish/Subscribe event architectures",
    problemName: "Distributed Message Broker (Kafka Model)",
    difficulty: "Medium",
    link: "https://github.com/donnemartin/system-design-primer",
    type: "system-design",
    xpReward: 140,
    tips: [
      "Learn partition mechanisms, commit logs, consumer groups, and offset tracking.",
      "Understand pull vs. push message retrieval patterns."
    ]
  }
];

// Generate Day 31 to Day 90
const GENERATED_DAYS: RoadmapDay[] = Array.from({ length: 60 }, (_, index) => {
  const dayNum = 31 + index;
  const template = EXTRA_TEMPLATES[index % EXTRA_TEMPLATES.length];
  return {
    ...template,
    day: dayNum,
    problemName: `${template.problemName} (Day ${dayNum})`
  } as RoadmapDay;
});

export const DEFAULT_ROADMAP: RoadmapDay[] = [...INITIAL_30, ...GENERATED_DAYS];

export const DEFAULT_BADGES: Badge[] = [
  {
    id: "first_commit",
    title: "It Compiled!",
    description: "Logged your first study session without instantly throwing a syntax error.",
    iconName: "Terminal",
    category: "special",
    unlockedAt: null
  },
  {
    id: "determined_solver",
    title: "Time Traveler",
    description: "Backdated or logged an offline retro study session to cheat the clock.",
    iconName: "Clock",
    category: "special",
    unlockedAt: null
  },
  {
    id: "consistent_coder",
    title: "3-Day Miracle",
    description: "Maintained a 3-day streak. Watch out, Mark Zuckerberg!",
    iconName: "Zap",
    category: "streak",
    unlockedAt: null
  },
  {
    id: "unstoppable",
    title: "Infinite Loop Walker",
    description: "Maintained a 7-day study streak. Are you human, or an automated cron job?",
    iconName: "Flame",
    category: "streak",
    unlockedAt: null
  },
  {
    id: "pattern_master",
    title: "Copy-Paste Specialist",
    description: "Logged 10 deep coding studies. You are officially dangerous.",
    iconName: "Shield",
    category: "problems",
    unlockedAt: null
  },
  {
    id: "architecture_explorer",
    title: "Spaghetti Architect",
    description: "Brave enough to tackle scaling or system design without crying.",
    iconName: "Cpu",
    category: "special",
    unlockedAt: null
  },
  {
    id: "pivot_champion",
    title: "Keyboard Bruiser",
    description: "Crossed off at least 5 major topics from the checklist.",
    iconName: "Award",
    category: "problems",
    unlockedAt: null
  },
  {
    id: "supernova_spark",
    title: "Unhealthy Focus",
    description: "Spent over 60 continuous minutes staring at a single bug. Stand up and stretch!",
    iconName: "Users",
    category: "special",
    unlockedAt: null
  }
];

export const LEVEL_SCHEMAS = [
  { level: 1, name: "Recursive Novice", xpRequired: 0 },
  { level: 2, name: "StackOverflow Copier", xpRequired: 300 },
  { level: 3, name: "Google Ninja", xpRequired: 700 },
  { level: 4, name: "Master Bug Breeder", xpRequired: 1200 },
  { level: 5, name: "Semicolon Worshiper", xpRequired: 1900 },
  { level: 6, name: "Spaghetti Chef", xpRequired: 2700 },
  { level: 7, name: "Production Destroyer", xpRequired: 3800 },
  { level: 8, name: "10x Caffeine Engine", xpRequired: 5000 }
];

export function getLevelForXp(xp: number): { level: number; name: string; nextXpRequired: number | null; prevXpLimit: number } {
  let activeLevel = LEVEL_SCHEMAS[0];
  let nextLevel = LEVEL_SCHEMAS[1];

  for (let i = 0; i < LEVEL_SCHEMAS.length; i++) {
    if (xp >= LEVEL_SCHEMAS[i].xpRequired) {
      activeLevel = LEVEL_SCHEMAS[i];
      nextLevel = LEVEL_SCHEMAS[i + 1] || null;
    } else {
      break;
    }
  }

  return {
    level: activeLevel.level,
    name: activeLevel.name,
    nextXpRequired: nextLevel ? nextLevel.xpRequired : null,
    prevXpLimit: activeLevel.xpRequired
  };
}

export const STICKER_LIST = [
  "🎀", "🧸", "🐱", "🐶", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", // 1-10
  "🦁", "🐮", "🐷", "🐸", "🐵", "🐣", "🦉", "🦄", "🐝", "🐞", // 11-20
  "🦖", "🐙", "🐠", "🦋", "🌸", "🌹", "🌺", "🌻", "🌼", "🌷", // 21-30
  "🍀", "🍁", "🍄", "🥑", "🍓", "🍉", "🍒", "🍑", "🍋", "🍊", // 31-40
  "🍍", "🍎", "🍉", "🍇", "🧁", "🍩", "🍪", "🍿", "🥞", "🍣", // 41-50
  "🍕", "🍦", "🍫", "🔋", "💡", "🎨", "👾", "🎸", "🛸", "🚀", // 51-60
  "🧗", "🏆", "🛹", "🎯", "🎮", "🎪", "🎡", "🎠", "🔮", "🛎️", // 61-70
  "💌", "💎", "👑", "🎩", "🎒", "🧸", "🔑", "🎁", "🎈", "🎉", // 71-80
  "🪄", "🌈", "☀️", "❄️", "☄️", "🪐", "🍿", "🍩", "🎖️", "🏁"  // 81-90
];

export function getStickerForDay(day: number): string {
  return STICKER_LIST[(day - 1) % STICKER_LIST.length];
}

