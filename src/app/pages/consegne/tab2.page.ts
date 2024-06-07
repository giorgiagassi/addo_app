import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TDeliveryResult, TSubContainer} from "../../type/delivery.type";
import {LocalStorageService} from "../../providers/local-storage.service";
import {AlertController} from "@ionic/angular";
import {HttpHeaders} from "@angular/common/http";
import {ConsegneService} from "../../providers/consegne.service";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{
  activeTab = 'Dettaglio'; // Setto la tab iniziale
  tabs = ['Dettaglio', 'Dati Ordine', 'Riepilogo']; // Elenco delle tabs
  dataInizio: string;
  showInserimentoDettagli = true;
  showSoluzioneMigliore = false;
  showElencoSelezionati = false;
  selectedCompartments: any[] = [];
  tabDettaglio = false;
  tipoPagamento = "carta";
  public qrdata = 'Data to encode';
  public elementType: 'url' | 'canvas' | 'img' = 'canvas';
  deliveryForm: FormGroup;
  tabRiepilogo = false;
  subContainer: TSubContainer | undefined;
  deliveryResult: TDeliveryResult | undefined | null;
  loading = false;

  constructor(private fb: FormBuilder,
              private consegneService: ConsegneService,
              private alertController: AlertController,
              private localStorageService: LocalStorageService) {

    this.dataInizio = new Date().toISOString().split('T')[0];

    this.deliveryForm = fb.group({
      length: [0, Validators.required],
      height: [0, Validators.required],
      weight: [0, Validators.required],
      width: [0, Validators.required],
      num_order: [0, Validators.required],
      start_date: [this.dataInizio, Validators.required],
      end_date: ['', Validators.required],
      recipient_email: ['', [Validators.required, Validators.email]],
      recipient_first_name: ['', Validators.required],
      recipient_last_name: ['', Validators.required],
      recipient_phone_prefix: ['+39', Validators.required],
      recipient_phone: ['', Validators.required],
    });
    this.deliveryForm.get('start_date')!.disable();
  }

  ngOnInit(): void {
    this.inizializzaDataInizio();
  }

  changeTab(tabName: string): void {
    this.activeTab = tabName;
  }

  navigateTabs(direction: 'previous' | 'next'): void {
    const currentIndex = this.tabs.indexOf(this.activeTab);

    if (direction === 'previous' && currentIndex > 0) {
      this.activeTab = this.tabs[currentIndex - 1];
    } else if (direction === 'next' && currentIndex < this.tabs.length - 1) {
      this.activeTab = this.tabs[currentIndex + 1];
    }
  }

  inizializzaDataInizio() {
    this.dataInizio = new Date().toISOString().split('T')[0];
  }

  async createDelivery(): Promise<void> {
    const accessToken = this.localStorageService.getToken();

    const headers = new HttpHeaders({
      'Authorization': accessToken!,
      'Content-Type': 'application/json',
    });

    const body = {
      product: {
        length: this.deliveryForm.value.length,
        height: this.deliveryForm.value.height,
        weight: this.deliveryForm.value.weight,
        width: this.deliveryForm.value.width,
      },
      subcontainer: this.subContainer!.uuid,
      num_order: this.deliveryForm.value.num_order,
      start_date: this.dataInizio,
      end_date: this.deliveryForm.value.end_date,
      recipient_email: this.deliveryForm.value.recipient_email,
      recipient_first_name: this.deliveryForm.value.recipient_first_name,
      recipient_last_name: this.deliveryForm.value.recipient_last_name,
      recipient_phone_prefix: this.deliveryForm.value.recipient_phone_prefix,
      recipient_phone: this.deliveryForm.value.recipient_phone,
    };

    this.loading = true;
    this.consegneService.deliveryCreate(body, headers).subscribe({
      next: async (result:any) => {
        this.loading = false;
        const alert = await this.alertController.create({
          header: 'Operazione avvenuta con successo',
          buttons: ['OK']
        });
        await alert.present();
        this.deliveryResult = result;
        this.qrdata = this.deliveryResult!.qr_delivery;
      },
      error: async (error:any) => {
        this.loading = false;
        console.error('Errore durante esecuzione:', error);
        const alert = await this.alertController.create({
          header: 'Errore',
          message: error.message,
          buttons: ['OK']
        });
        await alert.present();
      },
    });
  }

  async bestSubcontainer(): Promise<void> {
    const accessToken = this.localStorageService.getToken();

    const headers = new HttpHeaders({
      'Authorization': accessToken!,
      'Content-Type': 'application/json',
    });

    const body = {
      length: this.deliveryForm.value.length,
      height: this.deliveryForm.value.height,
      weight: this.deliveryForm.value.weight,
      width: this.deliveryForm.value.width,
    };

    this.loading = true;
    this.consegneService.postBestSubcontainer(body, headers).subscribe({
      next: (result:any) => {
        this.loading = false;
        this.subContainer = result;
        this.selectedCompartments.push(this.subContainer);
      },
      error: async (error:any) => {
        this.loading = false;
        console.error('Errore durante esecuzione:', error);
        const alert = await this.alertController.create({
          header: 'Errore',
          message: error.message,
          buttons: ['OK']
        });
        await alert.present();
      },
    });
  }

  removeCompartment(compartment: any): void {
    const index = this.selectedCompartments.indexOf(compartment);
    if (index !== -1) {
      this.selectedCompartments.splice(index, 1);
    }

    if (this.selectedCompartments.length === 0) {
      this.showElencoSelezionati = false;
      this.showInserimentoDettagli = true;
      window.location.reload();
    }
  }

  isAvantiButtonDisabled(): boolean {
    return this.deliveryForm.get('end_date')!.invalid || !this.showElencoSelezionati;
  }

  async saveImageToGallery(): Promise<void> {
    try {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/png');
      });

      if (!blob) throw new Error('Errore durante la conversione dell\'immagine in blob');

      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = 'qr_code.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);

      console.log('Immagine salvata con successo');
    } catch (error) {
      console.error('Errore durante il salvataggio dell\'immagine:', error);
    }
  }
}
