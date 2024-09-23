import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderEntryComponent } from './order-entry.component';
import { OrderFacade } from '../../application/store/order/facades/order.facade';
import { of } from 'rxjs';
import { Pizza } from '../../application/store/order/state/order.state';
import { PriceCalculationService } from '../../domain/price-calculation.service';

describe('OrderEntryComponent', () => {
  let component: OrderEntryComponent;
  let fixture: ComponentFixture<OrderEntryComponent>;
  let mockOrderFacade: jasmine.SpyObj<OrderFacade>;

  beforeEach(() => {
    mockOrderFacade = jasmine.createSpyObj('OrderFacade', ['pizzas$', 'totalPrice$', 'updatePizzaToppings', 'addPizza', 'findPizzaBySize']);
    
    TestBed.configureTestingModule({
      imports: [OrderEntryComponent], // Import the standalone component
      providers: [
        { provide: OrderFacade, useValue: mockOrderFacade }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderEntryComponent);
    component = fixture.componentInstance;

    // Set up observable properties
    mockOrderFacade.pizzas$ = of([]);  // Set as an observable directly
    mockOrderFacade.totalPrice$ = of(0);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should add a new pizza with toppings when checked', () => {
    const topping = 'Tomatoes';
    const size = 'Small';
    const mockPriceResult = { value: 10, offerEligible: true };
    spyOn(PriceCalculationService, 'calculatePrice').and.returnValue(mockPriceResult);

    component.onToppingChange(topping, size, { target: { checked: true } } as any);

    expect(mockOrderFacade.addPizza).toHaveBeenCalled();
    const newPizza = mockOrderFacade.addPizza.calls.mostRecent().args[0];
    expect(newPizza.toppings).toContain(topping);
    expect(newPizza.size).toBe(size);
    expect(newPizza.price).toBe(mockPriceResult.value);
    expect(newPizza.isEligibleForOffer).toBe(mockPriceResult.offerEligible);
  });

  it('should update existing pizza toppings when checked', () => {
    const existingPizza: Pizza = { id: 1, size: 'Small', toppings: [], price: 10, isEligibleForOffer: false };
    mockOrderFacade.findPizzaBySize.and.returnValue(existingPizza);
    const topping = 'Tomatoes';

    component.onToppingChange(topping, 'Small', { target: { checked: true } } as any);

    expect(mockOrderFacade.updatePizzaToppings).toHaveBeenCalledWith(existingPizza.id, [topping]);
  });

  it('should remove a topping from an existing pizza when unchecked', () => {
    const existingPizza: Pizza = { id: 1, size: 'Small', toppings: ['Tomatoes'], price: 10, isEligibleForOffer: false };
    mockOrderFacade.findPizzaBySize.and.returnValue(existingPizza);
    const topping = 'Tomatoes';

    component.onToppingChange(topping, 'Small', { target: { checked: false } } as any);

    expect(mockOrderFacade.updatePizzaToppings).toHaveBeenCalledWith(existingPizza.id, []);
  });

  it('should return eligibility for offer based on pizza size', () => {
    const pizza: Pizza = { id: 1, size: 'Small', toppings: [], price: 10, isEligibleForOffer: true };
    mockOrderFacade.findPizzaBySize.and.returnValue(pizza);

    expect(component.isEligibleForOffer('Small')).toBeTrue();
  });

  it('should return price for the specified pizza size', () => {
    const pizza: Pizza = { id: 1, size: 'Small', toppings: [], price: 10, isEligibleForOffer: false };
    mockOrderFacade.findPizzaBySize.and.returnValue(pizza);

    expect(component.getPizzaPrice('Small')).toBe(10);
  });
});
