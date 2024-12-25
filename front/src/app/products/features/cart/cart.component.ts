import { Component, inject, OnInit } from "@angular/core";
import { DialogModule } from "primeng/dialog";
import { PanelModule } from "primeng/panel";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { InputNumberModule } from "primeng/inputnumber";
import { CartItem } from "./cart.model";
import { CartService } from "./cart.service";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-cart",
  standalone: true,
  imports: [
    DialogModule,
    PanelModule,
    TableModule,
    ButtonModule,
    InputNumberModule,
    FormsModule,
  ],
  templateUrl: "./cart.component.html",
  styleUrl: "./cart.component.css",
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartTotal: number = 0;
  displayCart: boolean = false;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
      this.cartTotal = this.cartService.getCartTotal();
    });
    this.cartService.cartEnabled$.subscribe((enabled) => {
      this.displayCart = enabled;
    });
  }

  removeItem(id: number) {
    this.cartService.removeFromCart(id);
  }

  updateItemQuantity(id: number, quantity: number) {
    this.cartService.updateQuantity(id, quantity);
  }

  clearCart() {
    this.cartService.clearCart();
  }
}
