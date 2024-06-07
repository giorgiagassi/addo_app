import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable, throwError } from "rxjs";
import { AlertController } from '@ionic/angular';

import { TAccount } from '../type/account.type';
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class ImpostazioniService {

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    public alertController: AlertController // Importa AlertController
  ) { }

  async presentAlert(header: string, message: string, icon: 'success' | 'error') {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  getAccount(headers: any): Observable<TAccount> {
    return this.http.get('https://addo-api.besanfra.com/v1/user/', { headers }).pipe(
      map((response: any) => response as TAccount),
      catchError((error) => {
        this.presentAlert('Error', error.message, 'error');
        return throwError(error);
      })
    );
  }

  deleteAccount(headers: any, uuid: string): Observable<any> {
    return this.http.delete(`https://addo-api.besanfra.com/v1/user/${uuid}`, { headers }).pipe(
      map((response) => {
        this.presentAlert('Success', 'Account eliminato correttamente', 'success');
        this.authService.SignOut();
        return response;
      }),
      catchError((error) => {
        this.presentAlert('Errore', error.message, 'error');
        return throwError(error);
      })
    );
  }

  putAccount(headers: any, uuid: string, body: any): Observable<any> {
    return this.http.put(`https://addo-api.besanfra.com/v1/user/${uuid}/`, body, { headers });
  }
}
