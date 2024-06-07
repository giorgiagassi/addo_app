import { Component} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page  {
  nome!: string;
  email!: string;
  oggetto!: string;
  messaggio!: string;
  file!: File;
  loading: boolean = false;
  constructor(private http: HttpClient,
              private alertController: AlertController,) { }

  inviaEmail() {
    this.loading == true;
    const nome = this.nome;
    const email = this.email;
    const oggetto = this.oggetto;
    const messaggio = this.messaggio;

    const payload = {
      recipients: "giorgiagassi@gmail.com",
      subject: oggetto,
      html: `<p>Ciao ${nome},<br>  ${messaggio} </p>`,
      type: "general-purpose-with-template"
    };

    // Imposta l'header di autorizzazione
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'AIzaSyByVzsgkpxvo321McAo-3B-XAjE6u-BIbg' // Assicurati di inserire il token corretto
    });

    // Effettua la richiesta HTTP con l'header di autorizzazione
    this.http.post('https://europe-west1-addo24h.cloudfunctions.net/sendEmail', payload, { headers })
      .subscribe(
        async () => {
          const alert = await this.alertController.create({
            header: 'Email inviata con sucesso',
            buttons: [
              {
                text: 'OK',
              }
            ]
          });
          await alert.present();
          this.loading == false;
        },
        async (error) => {
          const alert = await this.alertController.create({
            header: 'Errore',
            buttons: [
              {
                text: 'OK',
              }
            ]
          });
          await alert.present();
        }
      );
  }

}
