import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable, throwError} from "rxjs";
import {AlertController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class ConsegneService {

  constructor(private http: HttpClient,
              private alertController: AlertController,
              ) { }

//get storico consegne
  deliveryList(headers: any): Observable<any>{
    return this.http.get('https://addo-api.besanfra.com/v1/deliveries/', {headers})
  }

//crea consegna
  deliveryCreate(body: any, headers:any): Observable<any>{
    return this.http.post('https://addo-api.besanfra.com/v1/deliveries/', body, {headers})
  }

  //dettaglio 1 consegna

  getDelivery(headers: any, uuid: string): Observable<any>{
    return this.http.get(`https://addo-api.besanfra.com/v1/deliveries/${uuid}/`, {headers})
  }

  //modifica consegna
  putDelivery(headers: any, uuid: string, body: any): Observable<any>{
    return this.http.put(`https://addo-api.besanfra.com/v1/deliveries/${uuid}/`, body, {headers})
  }

  //cancella consegna
  deleteDelivery(headers:any, uuid: string): Observable<any>{
    return this.http.delete(`https://addo-api.besanfra.com/v1/deliveries/${uuid}` , {headers}).pipe(
      map(async (response) => {
        const alert = await this.alertController.create({
            header: 'Eliminazione avvenuta con successo',
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  // Esegui il reindirizzamento o il ricaricamento della pagina
                  window.location.reload();
                }
              }
            ]})
        await alert.present();
        return response;
      }),
      catchError(async (error) => {
        const alert = await this.alertController.create({
          header: 'Errore',
          message: error.message,
          buttons: ['OK']
        });

        await alert.present();

        return throwError(error);
      })
    )
  }

  //calcolo scomparto migliore
  postBestSubcontainer(body: any, headers:any): Observable<any>{
    return this.http.post('https://addo-api.besanfra.com/v1/deliveries/get_best_subcontainer/', body, {headers})
  }
}
