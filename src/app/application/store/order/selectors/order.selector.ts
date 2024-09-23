import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrderState } from '../state/order.state';

export const selectOrderState = createFeatureSelector<OrderState>('order');

export const selectPizzas = createSelector(
  selectOrderState,
  (state: OrderState) => state.pizzas
);

export const selectTotalPrice = createSelector(
  selectOrderState,
  (state: OrderState) => state.totalPrice
);