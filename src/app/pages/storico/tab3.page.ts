import {Component, OnInit, ViewChild} from '@angular/core';
import {TStorico} from "../../type/delivery.type";
import {ConsegneService} from "../../providers/consegne.service";
import {AlertController} from "@ionic/angular";
import {HttpHeaders} from "@angular/common/http";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{
  storico: TStorico  | undefined;
  loading: boolean = false;
  public qrCode: string | undefined = "";
  public qrCodeDownloadLink: SafeUrl = "";
  isModalOpen = false;
  @ViewChild('qrcode') qrcode: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
  constructor(
    private consegneService: ConsegneService,
    private alertController: AlertController,
    private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    const user = localStorage.getItem('user')
    const accessToken = user ? JSON.parse(user)?.stsTokenManager?.accessToken : null;
    const headers = new HttpHeaders({
      'Authorization': accessToken,
      'Content-Type': 'application/json',
    });
    this.loading = true;
    this.consegneService.deliveryList(headers).subscribe(
      result => {
        this.storico = result;
        this.loading = false;
      }
    )
  }


  async delete(uuid: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Sei sicuro di voler eliminare il prodotto?',
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          handler: () => {
            // Azione da eseguire se l'utente annulla
            console.log('Eliminazione annullata');
          }
        },
        {
          text: 'OK',
          handler: () => {
            // Azione da eseguire se l'utente conferma
            this.confermaEliminazione(uuid);
          }
        }
      ]
    });

    await alert.present();
  }

  confermaEliminazione(uuid:string): void {
    this.loading = true
    const user = localStorage.getItem('user')
    const accessToken = user ? JSON.parse(user)?.stsTokenManager?.accessToken : null;

    const headers = new HttpHeaders({
      'Authorization': accessToken,
      'Content-Type': 'application/json',
    });
    this.consegneService.deleteDelivery(headers, uuid).subscribe({
      next: async (response) => {
        this.loading = false
        // Successo
      },
      error: async (error) => {
        // Errore
        const alert = await this.alertController.create({
          header: 'Errore',
          message: error.message, // Puoi personalizzare il messaggio di errore in base alla risposta del backend
          buttons: ['OK']
        });
        await alert.present();
      }
    })
  }

  // METODO PER METTERE VISUALIZZABILI I QRCODE DELL'ORDINE SCELTO
  async QRConsegna(uuid: string, isOpen: boolean): Promise<void> {
    this.qrCode = uuid
    this.isModalOpen = isOpen;

  }
  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = this.sanitizer.bypassSecurityTrustUrl(this.qrCode!);

  }

}
