import { Component, OnInit } from '@angular/core';
import {TAccount} from "../../type/account.type";
import {ImpostazioniService} from "../../providers/impostazioni.service";
import {AuthService} from "../../providers/auth.service";
import {DatePipe} from "@angular/common";
import {AlertController} from "@ionic/angular";
import {HttpHeaders} from "@angular/common/http";

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {
  account!: TAccount;
  loading: boolean = false;

  constructor(
    private impostazioniService: ImpostazioniService,
    public authService: AuthService,
    private datePipe: DatePipe,
    private alertController: AlertController
) { }

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    const accessToken = user ? JSON.parse(user)?.stsTokenManager?.accessToken : null;

    const headers = new HttpHeaders({
      'Authorization': accessToken,
      'Content-Type': 'application/json',
    });

    this.loading = true;
    this.impostazioniService.getAccount(headers).subscribe(
      result => {
        this.account = result;
        this.loading = false;
      },
      error => {
        console.error('Errore durante il recupero dell\'account:', error);
        this.loading = false;
      }
    );
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }

  deleteAccount(): void {
    const user = localStorage.getItem('user');
    const accessToken = user ? JSON.parse(user)?.stsTokenManager?.accessToken : null;

    const uuid = this.account.uuid;

    const headers = new HttpHeaders({
      'Authorization': accessToken,
      'Content-Type': 'application/json',
    });

    this.impostazioniService.deleteAccount(headers, uuid!).subscribe(
      response => {
        console.log('Eliminazione dell\'account riuscita:', response);
        this.authService.deleteUser();
      },
      error => {
        console.error('Errore durante l\'eliminazione dell\'account:', error);
      }
    );
  }

  async putAccount() {
    const user = localStorage.getItem('user');
    const accessToken = user ? JSON.parse(user)?.stsTokenManager?.accessToken : null;

    const uuid = this.account.uuid;

    const headers = new HttpHeaders({
      'Authorization': accessToken,
      'Content-Type': 'application/json',
    });

    const body = {
      username: '',
      first_name: this.account.first_name ?? null,
      last_name: this.account.last_name ?? null,
      uid: this.account.uid ?? null,
      role: this.account.role ?? null,
      address: this.account.address ?? null,
      address_legal: this.account.address_legal ?? null,
      city: this.account.city ?? null,
      city_ccia_registration: this.account.city_ccia_registration ?? null,
      company_certificate: this.account.company_certificate ?? null,
      company_name: this.account.company_name ?? null,
      fiscal_code: this.account.fiscal_code ?? null,
      dob: this.account.dob ?? null,
      email: this.account.email ?? null,
      gender: '',
      nationality_code: this.account.nationality_code ?? null,
      num_rea: this.account.num_rea ?? null,
      pec: this.account.pec ?? null,
      phone_prefix: this.account.phone_prefix ?? null,
      phone: this.account.phone ?? null,
      private_user: true,
      recipient_code: this.account.recipient_code ?? null,
      state: this.account.state ?? null,
      vat_number: this.account.vat_number ?? null
    };

    try {
      const result = await this.impostazioniService.putAccount(headers, uuid!, body).toPromise();

      const alert = await this.alertController.create({
        header: 'Modifica avvenuta con successo',
        message: 'Il tuo account è stato modificato con successo!',
        buttons: ['OK']
      });

      await alert.present();
    } catch (error: any) {
      console.error('Errore durante la modifica:', error);

      const alert = await this.alertController.create({
        header: 'Errore',
        message: error.message,
        buttons: ['OK']
      });

      await alert.present();
    }
  }

  async resetPassword(email: string | number | null | undefined) {
    if (typeof email === 'string') {
      try {
        await this.authService.ForgotPassword(email);
        const alert = await this.alertController.create({
          header: 'Email inviata',
          message: 'Ti abbiamo mandato una mail, segui le istruzioni per il cambio password!',
          buttons: ['OK']
        });
        await alert.present();
      } catch (error: any) {
        console.error('Errore durante il reset della password:', error);

        const alert = await this.alertController.create({
          header: 'Errore',
          message: error.message,
          buttons: ['OK']
        });

        await alert.present();
      }
    } else {
      console.error('Email non valida per il reset della password');
    }
  }

}
