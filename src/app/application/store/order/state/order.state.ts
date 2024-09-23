export interface Pizza {
  id: number;                  // Unique identifier for each pizza
  size: string;                // e.g., 'Small', 'Medium', 'Large'
  toppings: string[];          // List of selected toppings
  price: number;               // Price for the specific pizza
  isEligibleForOffer: boolean
}

export interface OrderState {
  pizzas: Pizza[];             // Array to hold multiple pizzas
  totalPrice: number;          // Total price of all pizzas
}
