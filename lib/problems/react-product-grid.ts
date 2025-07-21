// problems/react-product-grid.ts
import { Problem } from "./types";

export const reactProductGridProblem: Problem = {
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
  tags: ["React", "Array Methods", "Filtering", "JSX", "Conditional Rendering"],
  estimatedTime: "45 min",
  requiresWebcam: false,
  languages: ["javascript"],
  reactPropName: "products",
  verificationCode: "PROD101",
  requiresCoding: true,
  requiresVerificationCode: false,
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
};
