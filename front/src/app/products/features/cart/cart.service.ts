import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { CartItem } from "./cart.model";

@Injectable({
  providedIn: "root",
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$: Observable<CartItem[]> =
    this.cartItemsSubject.asObservable();

  private cartEnabledSubject = new BehaviorSubject<boolean>(false);
  public cartEnabled$: Observable<boolean> =
    this.cartEnabledSubject.asObservable();

  constructor() {
    this.cartEnabledSubject.next(false);
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      this.cartItemsSubject.next(JSON.parse(storedCart));
    }
  }
  showCart() {
    this.cartEnabledSubject.next(true);
  }
  hideCart() {
    this.cartEnabledSubject.next(false);
  }

  addToCart(item: CartItem) {
    const currentCart = this.cartItemsSubject.value;
    currentCart.push({ ...item, quantity: 1 });

    this.cartItemsSubject.next([...currentCart]);
    this.saveCartToLocalStorage();
  }

  removeFromCart(itemId: number) {
    const currentCart = this.cartItemsSubject.value.filter(
      (item) => item.id !== itemId
    );
    this.cartItemsSubject.next([...currentCart]);
    this.saveCartToLocalStorage();
  }

  updateQuantity(itemId: number, quantity: number) {
    const currentCart = this.cartItemsSubject.value.map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity };
      }
      return item;
    });
    this.cartItemsSubject.next(currentCart);
    this.saveCartToLocalStorage();
  }

  clearCart() {
    this.cartItemsSubject.next([]);
    localStorage.removeItem("cart");
  }

  private saveCartToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(this.cartItemsSubject.value));
  }

  getCartTotal(): number {
    return this.cartItemsSubject.value.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }
  getItemCount(): number {
    return this.cartItemsSubject.value.length;
  }
}
