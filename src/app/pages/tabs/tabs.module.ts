import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import {RouterModule} from "@angular/router";
import {PrivacyPageModule} from "../privacy/privacy.module";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TabsPageRoutingModule,
        RouterModule,
        PrivacyPageModule
    ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
