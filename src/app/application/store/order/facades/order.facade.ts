import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { OrderState, Pizza } from '../state/order.state';
import { selectPizzas, selectTotalPrice } from '../selectors/order.selector';
import { OrderActions } from '../actions/order.action';

@Injectable({
  providedIn: 'root',
})
export class OrderFacade {

  pizzas$ : Observable<Pizza[]>;
  totalPrice$ : Observable<number>;
  private pizzas: Pizza[] = []; // Local state to store pizzas

  constructor(private store: Store<OrderState>) {

    this.pizzas$ = this.store.select(selectPizzas);
    this.totalPrice$ = this.store.select(selectTotalPrice);
    this.store.select(selectPizzas).subscribe(pizzas => {
      this.pizzas = pizzas;
    });
  }

  addPizza(pizza: Pizza) {
    this.store.dispatch(OrderActions.addPizza({ pizza }));
  }

  updatePizzaToppings(id: number, toppings: string[]) {
    this.store.dispatch(OrderActions.updatePizzaToppings({ id, toppings }));
  }

  removePizza(id: number) {
    this.store.dispatch(OrderActions.removePizza({ id }));
  }

  findPizzaBySize(size: string): Pizza | undefined {
    return this.pizzas.find(pizza => pizza.size === size);
  }
}
