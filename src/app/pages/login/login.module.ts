import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import {HttpClient} from "@angular/common/http";
import {PrivacyPageModule} from "../privacy/privacy.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        LoginPageRoutingModule,
        PrivacyPageModule
    ],
  declarations: [LoginPage],

})
export class LoginPageModule {}
