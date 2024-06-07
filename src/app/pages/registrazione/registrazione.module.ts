import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrazionePageRoutingModule } from './registrazione-routing.module';

import { RegistrazionePage } from './registrazione.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RegistrazionePageRoutingModule,
        ReactiveFormsModule
    ],
  declarations: [RegistrazionePage]
})
export class RegistrazionePageModule {}
