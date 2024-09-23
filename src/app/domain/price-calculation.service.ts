export class PriceCalculationService {

    static calculatePrice(size: string | null, toppings: string[]): { value: number; offerEligible: boolean } {
      let basePrice = 0;
      let totalPrice = 0;

      const toppingCount = toppings.length;

      if(toppings.length <= 0) {
        return { value : 0, offerEligible : false };
      }
  
      switch (size) {
        case 'Small': basePrice = 5; break;
        case 'Medium': basePrice = 7; break;
        case 'Large': basePrice = 8; break;
        case 'Extra Large': basePrice = 9; break;
      }
  
      const toppingsPrice = toppings.reduce((acc, topping) => {
        switch (topping) {
          case 'Tomatoes': return acc + 1;
          case 'Onions': return acc + 0.5;
          case 'Bell pepper': return acc + 1;
          case 'Mushrooms': return acc + 1.2;
          case 'Pineapple': return acc + 0.75;
          case 'Sausage': return acc + 1;
          case 'Pepperoni': return acc + 2;
          case 'Barbecue chicken': return acc + 3;
          default: return acc;
        }
      }, 0);

      totalPrice = basePrice + toppingsPrice;

      // Apply Offer 1: 1 Medium Pizza with 2 toppings for $5
      if (size === 'Medium' && toppingCount === 2) {
        return { value : 5, offerEligible : true };
      }

       // Apply Offer 2: 2 Medium Pizzas with 4 toppings each for $9 (to be handled outside, for multiple pizzas)

      // Apply Offer 3: 1 Large Pizza with 4 toppings (Pepperoni and Barbecue chicken count as 2 each) - 50% discount
      if (size === 'Large') {
        let adjustedToppingsCount = toppings.reduce((count, topping) => {
          if (topping === 'Pepperoni' || topping === 'Barbecue chicken') {
            return count + 2; // Count these toppings as double
          }
          return count + 1;
        }, 0);

        if (adjustedToppingsCount === 4) {
          return { value : totalPrice / 2, offerEligible : true };
        }
      }

      return { value : totalPrice, offerEligible : false };
    }

  }