import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../providers/auth.service";
import { Router } from "@angular/router";
import {PrivacyPage} from "../privacy/privacy.page";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loading: boolean = false;
  email: string = '';
  password: string = '';
  component = PrivacyPage;
  constructor(public autenticazioneService: AuthService, private router: Router) { }

  accedi() {
    if (this.email && this.password) {
      this.loading = true;
      this.autenticazioneService.SignIn(this.email, this.password)
        .then(() => {
          // Login completato con successo
        })
        .catch((error) => {
          // Gestire gli errori qui, se necessario
          console.error('Errore di login:', error);
        })
        .finally(() => {
          this.loading = false; // Assicurati che lo spinner sia disattivato
        });
    } else {
      console.error('Valori di email o password non validi.');
    }
  }

  resetPassword() {
    if (this.email) {
      this.autenticazioneService.ForgotPassword(this.email);
    } else {
      window.alert("Inserisci la mail dell'account da recuperare nel campo email.");
    }
  }

  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
}
