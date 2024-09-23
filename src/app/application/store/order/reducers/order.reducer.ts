import { createReducer, on } from '@ngrx/store';
import { OrderActions } from '../actions/order.action';
import { PriceCalculationService } from '../../../../domain/price-calculation.service';
import { OrderState } from '../state/order.state';

const initialState: OrderState = {
  pizzas: [],
  totalPrice: 0,
};

export const orderReducer = createReducer(
  initialState,

  on(OrderActions.addPizza, (state, { pizza }) => {
    const updatedPizzas = [...state.pizzas, pizza];
    const updatedTotalPrice = updatedPizzas.reduce((acc, curr) => acc + curr.price, 0);
    return { ...state, pizzas: updatedPizzas, totalPrice: updatedTotalPrice };
}),

on(OrderActions.updatePizzaToppings, (state, { id, toppings }) => {
  const updatedPizzas = state.pizzas
    .map(pizza => {
      if (pizza.id === id) {
        const result = PriceCalculationService.calculatePrice(pizza.size, toppings); // Recalculate price
        return { ...pizza, toppings, price: result.value, isEligibleForOffer : result.offerEligible };
      }
      return pizza;
    })
    .filter(pizza => pizza.price > 0); // Remove pizza if price is 0

  const updatedTotalPrice = updatedPizzas.reduce((acc, curr) => acc + curr.price, 0);

  return { ...state, pizzas: updatedPizzas, totalPrice: updatedTotalPrice };
}),

on(OrderActions.removePizza, (state, { id }) => {
    const updatedPizzas = state.pizzas.filter(pizza => pizza.id !== id);
    const updatedTotalPrice = updatedPizzas.reduce((acc, curr) => acc + curr.price, 0);
    return { ...state, pizzas: updatedPizzas, totalPrice: updatedTotalPrice };
})
  
);
