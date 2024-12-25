import { Component, inject, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SplitterModule } from "primeng/splitter";
import { ToolbarModule } from "primeng/toolbar";
import { PanelMenuComponent } from "./shared/ui/panel-menu/panel-menu.component";
import { CartComponent } from "./products/features/cart/cart.component";
import { BadgeModule } from "primeng/badge";
import { CartService } from "./products/features/cart/cart.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [
    RouterModule,
    SplitterModule,
    ToolbarModule,
    PanelMenuComponent,
    CartComponent,
    BadgeModule,
  ],
})
export class AppComponent implements OnInit {
  cartTotal: number = 0;
  title = "ALTEN SHOP";

  private readonly cartService = inject(CartService);

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(() => {
      this.cartTotal = this.cartService.getItemCount();
    });
  }

  showCart() {
    this.cartService.showCart();
  }
}
