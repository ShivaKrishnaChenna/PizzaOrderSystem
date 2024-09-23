import { createAction, props } from '@ngrx/store';
import { Pizza } from '../state/order.state';

export const addPizza = createAction(
  '[Order] Add Pizza',
  props<{ pizza: Pizza }>()
);

export const updatePizzaToppings = createAction(
  '[Order] Update Pizza Toppings',
  props<{ id: number; toppings: string[] }>()
);

export const updatePizzaOffer = createAction(
  '[Order] Update Pizza Offer',
  props<{ id: number; offer: boolean }>()
);


export const removePizza = createAction(
  '[Order] Remove Pizza',
  props<{ id: number }>()
);

export const OrderActions = {
  addPizza,
  updatePizzaToppings,
  updatePizzaOffer,
  removePizza
}