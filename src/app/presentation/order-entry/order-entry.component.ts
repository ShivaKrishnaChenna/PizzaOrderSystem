import { Component, OnDestroy } from '@angular/core';
import { OrderFacade } from '../../application/store/order/facades/order.facade';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Pizza } from '../../application/store/order/state/order.state';
import { PriceCalculationService } from '../../domain/price-calculation.service';

@Component({
  selector: 'app-order-entry',
  templateUrl: './order-entry.component.html',
  imports: [CommonModule],
  standalone: true
})
export class OrderEntryComponent implements OnDestroy {
  availableToppings: string[] = ['Tomatoes', 'Onions', 'Bell pepper', 'Mushrooms', 'Pineapple', 'Sausage', 'Pepperoni', 'Barbecue chicken'];
  availablePizzas: string[] = ['Small', 'Medium', 'Large'];
  
  pizzas$: Observable<Pizza[]>;
  totalPrice$: Observable<number>;
  pizzaList: Pizza[] = [];
  
  private nextPizzaId = 1; // For generating unique pizza IDs
  private unsubscribe$ = new Subject<void>();

  constructor(private orderFacade: OrderFacade) {
    this.pizzas$ = this.orderFacade.pizzas$;
    this.totalPrice$ = this.orderFacade.totalPrice$;

    this.pizzas$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(list => this.pizzaList = list);
  }

  onToppingChange(topping: string, size: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const existingPizza = this.getPizzaBySize(size);
    
    if (checked) {
      this.handleToppingAddition(topping, size, existingPizza);
    } else {
      this.handleToppingRemoval(topping, existingPizza);
    }
  }

  private handleToppingAddition(topping: string, size: string, existingPizza: Pizza | undefined): void {
    if (existingPizza) {
      const newToppings = [...existingPizza.toppings, topping];
      this.orderFacade.updatePizzaToppings(existingPizza.id, newToppings);
    } else {
      const result = PriceCalculationService.calculatePrice(size, [topping]);
      const newPizza: Pizza = {
        id: this.nextPizzaId++,
        size,
        toppings: [topping],
        price: result.value,
        isEligibleForOffer: result.offerEligible
      };
      this.orderFacade.addPizza(newPizza);
    }
  }

  private handleToppingRemoval(topping: string, existingPizza: Pizza | undefined): void {
    if (existingPizza) {
      const newToppings = existingPizza.toppings.filter(t => t !== topping);
      this.orderFacade.updatePizzaToppings(existingPizza.id, newToppings);
    }
  }

  private getPizzaBySize(size: string): Pizza | undefined {
    return this.orderFacade.findPizzaBySize(size);
  }

  isEligibleForOffer(size: string): boolean {
    const pizza = this.getPizzaBySize(size);
    return pizza?.isEligibleForOffer ?? false;
  }

  getPizzaPrice(size: string): number | undefined {
    const pizza = this.getPizzaBySize(size);
    return pizza?.price;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
