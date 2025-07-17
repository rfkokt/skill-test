interface Problem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedTime: string;
  requiresWebcam: boolean;
  language: string;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  tags: string[];
  languages: string[];
  reactPropName?: string; // New: Optional property for React problems to specify the main prop name
  solutions: {
    [key: string]: {
      initialCodeTemplate: string;
      testCases: {
        input: any[];
        expected: any;
      }[];
    };
  };
}

export const problemsData: { [key: string]: Problem } = {
  "two-sum": {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    language: "javascript",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
      },
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Only one valid answer exists.",
    ],
    tags: ["Array", "Hash Table"],
    estimatedTime: "60 min",
    requiresWebcam: true,
    languages: ["javascript"], // Specify supported languages
    solutions: {
      javascript: {
        initialCodeTemplate:
          "function twoSum(nums, target) {\n  // Write your solution here\n}",
        testCases: [
          { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
          { input: [[3, 2, 4], 6], expected: [1, 2] },
          { input: [[3, 3], 6], expected: [0, 1] },
        ],
      },
    },
  },
  "add-two-numbers": {
    id: "add-two-numbers",
    title: "Add Two Numbers",
    difficulty: "Medium",
    language: "javascript",
    description:
      "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.\n\nYou may assume the two numbers do not contain any leading zero, except the number 0 itself.",
    examples: [
      {
        input: "l1 = [2,4,3], l2 = [5,6,4]",
        output: "[7,0,8]",
        explanation: "342 + 465 = 807.",
      },
    ],
    constraints: [
      "The number of nodes in each linked list is in the range [1, 100].",
      "0 ≤ Node.val ≤ 9",
      "It is guaranteed that the list represents a number that does not have leading zeros.",
    ],
    tags: ["Linked List", "Math", "Recursion"],
    estimatedTime: "60 min",
    requiresWebcam: true,
    languages: ["javascript"],
    solutions: {
      javascript: {
        initialCodeTemplate:
          "function addTwoNumbers(l1, l2) {\n  // Write your solution here\n}",
        testCases: [
          {
            input: [
              [2, 4, 3],
              [5, 6, 4],
            ],
            expected: [7, 0, 8],
          },
        ],
      },
    },
  },
  "react-user-list": {
    id: "react-user-list",
    title: "React User List Component",
    difficulty: "Easy",
    language: "javascript",
    description:
      "Create a React component that renders a list of users. Each user should be displayed in a card format with their name, email, and status. Active users should have a green status indicator, while inactive users should have a red indicator.\n\nYou need to map over the users array and return the appropriate JSX elements.",
    examples: [
      {
        input: `users = [
  { id: 1, name: "John Doe", email: "john@example.com", isActive: true },
  { id: 2, name: "Jane Smith", email: "jane@example.com", isActive: false },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", isActive: true }
]`,
        output: `<div class="user-list">
  <div class="user-card">
    <h3>John Doe</h3>
    <p>john@example.com</p>
    <span class="status active">Active</span>
  </div>
  <div class="user-card">
    <h3>Jane Smith</h3>
    <p>jane@example.com</p>
    <span class="status inactive">Inactive</span>
  </div>
  <div class="user-card">
    <h3>Bob Johnson</h3>
    <p>bob@example.com</p>
    <span class="status active">Active</span>
  </div>
</div>`,
        explanation:
          "Each user is rendered in a card with name as h3, email as p, and status with appropriate class.",
      },
      {
        input: `users = []`,
        output: `<div class="user-list">
  <p class="no-users">No users found</p>
</div>`,
      },
      {
        input: `users = [
  { id: 1, name: "Alice", email: "alice@test.com", isActive: false }
]`,
        output: `<div class="user-list">
  <div class="user-card">
    <h3>Alice</h3>
    <p>alice@test.com</p>
    <span class="status inactive">Inactive</span>
  </div>
</div>`,
      },
    ],
    constraints: [
      "users is an array of user objects",
      "Each user has id (number), name (string), email (string), and isActive (boolean)",
      "Component should handle empty arrays",
      "Use className instead of class for React",
      "Status text should be 'Active' or 'Inactive'",
    ],
    tags: ["React", "JavaScript", "Array Methods", "JSX"],
    estimatedTime: "30 min",
    requiresWebcam: false,
    languages: ["javascript"],
    reactPropName: "users", // Added for dynamic prop passing
    solutions: {
      javascript: {
        initialCodeTemplate: `function UserList({ users }) {
  // Add your logic here. Use 'React.createElement()' to create elements.
  // Example: console.log("Users:", users);
  // Make sure you return a valid React element.
  console.log("Hello from your code!");

  if (!users || users.length === 0) {
    return React.createElement(
      'div',
      { className: 'user-list' },
      React.createElement('p', { className: 'no-users' }, 'No users found')
    );
  }

  return React.createElement(
    'div',
    { className: 'user-list' },
    users.map(user =>
      React.createElement(
        'div',
        { key: user.id, className: 'user-card' },
        React.createElement('h3', null, user.name),
        React.createElement('p', null, user.email),
        React.createElement(
          'span',
          { className: user.isActive ? 'status active' : 'status inactive' },
          user.isActive ? 'Active' : 'Inactive'
        )
      )
    )
  );
}`,
        testCases: [
          {
            input: [
              [
                {
                  id: 1,
                  name: "John Doe",
                  email: "john@example.com",
                  isActive: true,
                },
                {
                  id: 2,
                  name: "Jane Smith",
                  email: "jane@example.com",
                  isActive: false,
                },
              ],
            ],
            expected: `<div className="user-list"><div className="user-card"><h3>John Doe</h3><p>john@example.com</p><span className="status active">Active</span></div><div className="user-card"><h3>Jane Smith</h3><p>jane@example.com</p><span className="status inactive">Inactive</span></div></div>`,
          },
          {
            input: [[]],
            expected: `<div className="user-list"><p className="no-users">No users found</p></div>`,
          },
          {
            input: [
              [
                {
                  id: 1,
                  name: "Alice",
                  email: "alice@test.com",
                  isActive: false,
                },
              ],
            ],
            expected: `<div className="user-list"><div className="user-card"><h3>Alice</h3><p>alice@test.com</p><span className="status inactive">Inactive</span></div></div>`,
          },
        ],
      },
    },
  },
  "react-product-grid": {
    id: "react-product-grid",
    title: "Product Grid with Filtering",
    difficulty: "Medium",
    language: "javascript",
    description:
      "Create a React component that renders a grid of products. The component should filter products based on availability and price range, then display them in a responsive grid layout.\n\nProducts should show image, name, price, and availability status. Only show products that are available and cost less than $100.",
    examples: [
      {
        input: `products = [
  { id: 1, name: "Laptop", price: 899, available: true, image: "laptop.jpg" },
  { id: 2, name: "Mouse", price: 25, available: true, image: "mouse.jpg" },
  { id: 3, name: "Keyboard", price: 75, available: false, image: "keyboard.jpg" },
  { id: 4, name: "Headphones", price: 150, available: true, image: "headphones.jpg" }
]`,
        output: `<div class="product-grid">
  <div class="product-card">
    <img src="mouse.jpg" alt="Mouse" />
    <h3>Mouse</h3>
    <p class="price">$25</p>
    <span class="available">Available</span>
  </div>
</div>`,
        explanation:
          "Only Mouse is shown because it's available and under $100. Laptop is over $100, Keyboard is unavailable, Headphones is over $100.",
      },
    ],
    constraints: [
      "Filter products where available === true AND price < 100",
      "Each product has id, name, price, available, and image properties",
      "Use img tag with src and alt attributes",
      "Price should be formatted with $ symbol",
      "Handle empty results with 'No products available' message",
    ],
    tags: [
      "React",
      "Array Methods",
      "Filtering",
      "JSX",
      "Conditional Rendering",
    ],
    estimatedTime: "45 min",
    requiresWebcam: false,
    languages: ["javascript"],
    reactPropName: "products", // Added for dynamic prop passing
    solutions: {
      javascript: {
        initialCodeTemplate: `function ProductGrid({ products }) {
  // Add your logic here. Use 'React.createElement()' to create elements.
  // Example: console.log("Products:", products);
  // Make sure you return a valid React element.
  console.log("Hello from your code!");

  const filteredProducts = products.filter(product => product.available && product.price < 100);

  if (filteredProducts.length === 0) {
    return React.createElement(
      'div',
      { className: 'product-grid' },
      React.createElement('p', { className: 'no-products' }, 'No products available')
    );
  }

  return React.createElement(
    'div',
    { className: 'product-grid' },
    filteredProducts.map(product =>
      React.createElement(
        'div',
        { key: product.id, className: 'product-card' },
        React.createElement('img', { src: product.image, alt: product.name }),
        React.createElement('h3', null, product.name),
        React.createElement('p', { className: 'price' }, '$' + product.price),
        React.createElement('span', { className: 'available' }, 'Available')
      )
    )
  );
}`,
        testCases: [
          {
            input: [
              [
                {
                  id: 1,
                  name: "Mouse",
                  price: 25,
                  available: true,
                  image: "mouse.jpg",
                },
                {
                  id: 2,
                  name: "Keyboard",
                  price: 75,
                  available: false,
                  image: "keyboard.jpg",
                },
              ],
            ],
            expected: `<div className="product-grid"><div className="product-card"><img src="mouse.jpg" alt="Mouse" /><h3>Mouse</h3><p className="price">$25</p><span className="available">Available</span></div></div>`,
          },
          {
            input: [
              [
                {
                  id: 1,
                  name: "Laptop",
                  price: 899,
                  available: true,
                  image: "laptop.jpg",
                },
                {
                  id: 2,
                  name: "Keyboard",
                  price: 75,
                  available: false,
                  image: "keyboard.jpg",
                },
              ],
            ],
            expected: `<div className="product-grid"><p className="no-products">No products available</p></div>`,
          },
        ],
      },
    },
  },
  "longest-substring": {
    id: "longest-substring",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    language: "javascript",
    description:
      "Given a string `s`, find the length of the longest substring without repeating characters.",
    examples: [
      {
        input: `s = "abcabcbb"`,
        output: `3`,
        explanation: `The answer is "abc", with the length of 3.`,
      },
      {
        input: `s = "bbbbb"`,
        output: `1`,
        explanation: `The answer is "b", with the length of 1.`,
      },
      {
        input: `s = "pwwkew"`,
        output: `3`,
        explanation: `The answer is "wke", with the length of 3. Note that the answer is a substring, not subsequence.`,
      },
    ],
    constraints: [
      "0 <= s.length <= 5 * 10⁴",
      "s consists of English letters, digits, symbols and spaces.",
    ],
    tags: ["Hash Table", "String", "Sliding Window"],
    estimatedTime: "30 min",
    requiresWebcam: true,
    languages: ["javascript", "python"], // Add Python support
    solutions: {
      javascript: {
        initialCodeTemplate: `function lengthOfLongestSubstring(s) {
  // Write your solution here
}`,
        testCases: [
          { input: ["abcabcbb"], expected: 3 },
          { input: ["bbbbb"], expected: 1 },
          { input: ["pwwkew"], expected: 3 },
          { input: [" "], expected: 1 },
          { input: ["au"], expected: 2 },
        ],
      },
      python: {
        initialCodeTemplate: `def length_of_longest_substring(s):
    # Write your solution here
    pass`,
        testCases: [
          { input: ["abcabcbb"], expected: 3 },
          { input: ["bbbbb"], expected: 1 },
          { input: ["pwwkew"], expected: 3 },
          { input: [" "], expected: 1 },
          { input: ["au"], expected: 2 },
        ],
      },
    },
  },
  "median-arrays": {
    id: "median-arrays",
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    language: "javascript",
    description:
      "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be `O(log(m + n))`.",
    examples: [
      {
        input: "nums1 = [1,3], nums2 = [2]",
        output: "2.0",
        explanation: "merged array = [1,2,3] and median is 2.",
      },
      {
        input: "nums1 = [1,2], nums2 = [3,4]",
        output: "2.5",
        explanation:
          "merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.",
      },
    ],
    constraints: [
      "m == nums1.length",
      "n == nums2.length",
      "0 <= m <= 1000",
      "0 <= n <= 1000",
      "1 <= m + n <= 2000",
      "-10⁶ <= nums1[i], nums2[i] <= 10⁶",
    ],
    tags: ["Array", "Binary Search", "Divide and Conquer"],
    estimatedTime: "45 min",
    requiresWebcam: true,
    languages: ["javascript", "python"], // Add Python support
    solutions: {
      javascript: {
        initialCodeTemplate: `function findMedianSortedArrays(nums1, nums2) {
  // Write your solution here
  // Hint: Consider merging the arrays and finding the median,
  // or use a more efficient approach like binary search.
}`,
        testCases: [
          { input: [[1, 3], [2]], expected: 2.0 },
          {
            input: [
              [1, 2],
              [3, 4],
            ],
            expected: 2.5,
          },
          {
            input: [
              [0, 0],
              [0, 0],
            ],
            expected: 0.0,
          },
          { input: [[], [1]], expected: 1.0 },
          { input: [[2], []], expected: 2.0 },
        ],
      },
      python: {
        initialCodeTemplate: `def find_median_sorted_arrays(nums1, nums2):
    # Write your solution here
    # Hint: Consider merging the arrays and finding the median,
    # or use a more efficient approach like binary search.
    pass`,
        testCases: [
          { input: [[1, 3], [2]], expected: 2.0 },
          {
            input: [
              [1, 2],
              [3, 4],
            ],
            expected: 2.5,
          },
          {
            input: [
              [0, 0],
              [0, 0],
            ],
            expected: 0.0,
          },
          { input: [[], [1]], expected: 1.0 },
          { input: [[2], []], expected: 2.0 },
        ],
      },
    },
  },
  // New Python Problem
  "reverse-string": {
    id: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    language: "python",
    description:
      "Given a string `s`, return the string with its characters reversed.",
    examples: [
      {
        input: `s = "hello"`,
        output: `"olleh"`,
        explanation: `The reversed string is "olleh".`,
      },
      {
        input: `s = "Python"`,
        output: `"nohtyP"`,
        explanation: `The reversed string is "nohtyP".`,
      },
    ],
    constraints: [
      "1 <= s.length <= 1000",
      "s consists of printable ASCII characters.",
    ],
    tags: ["String", "Python"],
    estimatedTime: "15 min",
    requiresWebcam: false,
    languages: ["python"],
    solutions: {
      python: {
        initialCodeTemplate: `def reverse_string(s):
    # Write your solution here
    return s[::-1]`, // Example solution for Python
        testCases: [
          { input: ["hello"], expected: "olleh" },
          { input: ["Python"], expected: "nohtyP" },
          { input: ["a"], expected: "a" },
          { input: [""], expected: "" },
        ],
      },
    },
  },
  "react-laptop-list": {
    id: "react-laptop-list",
    title: "LaptopList - Filter 17 inch Laptops",
    difficulty: "Easy",
    examples: [
      {
        input: `laptops = [
          { id: 1, name: "Asus TUF", type: "Laptop", screen_size: "17 inch" },
          { id: 2, name: "Axioo", type: "Laptop", screen_size: "13 inch" }
        ]`,
        output: `<div class="laptop-list">
          <div class="laptop-card">
            <h3>Asus TUF</h3>
            <p>Laptop</p>
            <p>17 inch</p>
          </div>
        </div>`,
        explanation: "Only laptops with 17 inch screens should be displayed",
      },
    ],
    constraints: [
      "Filter laptops where screen_size === '17 inch'",
      "Each laptop has id, name, type, and screen_size properties",
      "Handle empty results with 'No laptops found' message",
    ],
    tags: ["React", "JavaScript", "Array Methods", "JSX"],
    estimatedTime: "1 min",
    requiresWebcam: true,
    language: "javascript",
    languages: ["javascript"],
    reactPropName: "laptops",
    description: `
Buat komponen React bernama \`LaptopList\` yang menerima props \`laptops\`.

Tampilkan hanya laptop dengan \`screen_size === "17 inch"\` dalam daftar.

Untuk setiap laptop, tampilkan:
- Nama (\`name\`) dalam \`<h3>\`
- Tipe (\`type\`) dalam \`<p>\`
- Ukuran layar (\`screen_size\`) dalam \`<p>\`

Jika tidak ada laptop dengan \`screen_size === "17 inch"\`, tampilkan \`<p class="no-laptops">No laptops found</p>\`.

Gunakan JSX.
    `.trim(),
    solutions: {
      javascript: {
        initialCodeTemplate: `function LaptopList({ laptops }) {
  const filteredLaptops = laptops.filter(laptop => laptop.screen_size === "17 inch");

  if (filteredLaptops.length === 0) {
    return <p className="no-laptops">No laptops found</p>;
  }

  return (
    <div className="laptop-list">
      {filteredLaptops.map(laptop => (
        <div key={laptop.id} className="laptop-card">
          <h3>{laptop.name}</h3>
          <p>{laptop.type}</p>
          <p>{laptop.screen_size}</p>
        </div>
      ))}
    </div>
  );
}`,
        testCases: [
          {
            input: [
              [
                {
                  id: 1,
                  name: "Asus TUF",
                  type: "Laptop",
                  screen_size: "17 inch",
                },
                {
                  id: 2,
                  name: "Axioo",
                  type: "Laptop",
                  screen_size: "13 inch",
                },
                {
                  id: 3,
                  name: "Zyrex",
                  type: "Laptop",
                  screen_size: "12 inch",
                },
              ],
            ],
            expected: `<div className=\"list\"><div className=\"card\"><h3>Asus TUF</h3><p>Laptop</p><p>17 inch</p></div><div className=\"card\"><h3>Axioo</h3><p>Laptop</p><p>13 inch</p></div><div className=\"card\"><h3>Zyrex</h3><p>Laptop</p><p>12 inch</p></div></div>`,
          },
          {
            input: [
              [
                {
                  id: 1,
                  name: "Axioo",
                  type: "Laptop",
                  screen_size: "13 inch",
                },
                {
                  id: 2,
                  name: "Zyrex",
                  type: "Laptop",
                  screen_size: "12 inch",
                },
              ],
            ],
            expected: `<p className="no-laptops">No laptops found</p>`,
          },
        ],
      },
    },
  },
};
