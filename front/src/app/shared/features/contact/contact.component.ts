import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

import { MessageService } from "primeng/api";
import { CardModule } from "primeng/card";
import { InputTextareaModule } from "primeng/inputtextarea";
import { InputTextModule } from "primeng/inputtext";
import { ToastModule } from "primeng/toast";
import { ButtonModule } from "primeng/button";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.css"],
  standalone: true,
  imports: [
    CardModule,
    FormsModule,
    InputTextareaModule,
    InputTextModule,
    ToastModule,
    ReactiveFormsModule,
    ButtonModule,
  ],
  providers: [MessageService],
})
export class ContactComponent {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder, private messageService: MessageService) {
    this.contactForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      message: ["", [Validators.required, Validators.maxLength(300)]],
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.contactForm.get(field);
    return !!(control?.invalid && control?.touched);
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.messageService.add({
        severity: "success",
        detail: "Demande de contact envoyée avec succès.",
      });
      this.contactForm.reset(); // Reset the form after submission
    }
  }
}
