import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Tab2Page } from './tab2.page';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import {CustomDatePipe} from "../../pipe/custom-date.pipe";
import {QRCodeModule} from "angularx-qrcode";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        Tab2PageRoutingModule,
        ReactiveFormsModule,
        CustomDatePipe,
        QRCodeModule
    ],
  declarations: [Tab2Page],
  providers:[DatePipe]
})
export class Tab2PageModule {}
