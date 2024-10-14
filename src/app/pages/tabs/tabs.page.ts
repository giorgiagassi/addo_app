import { Component } from '@angular/core';
import {AuthService} from "../../providers/auth.service";

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  constructor(public autenticazioneService: AuthService ) { }

  logout(){
    this.autenticazioneService.SignOut()
  }
  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
}
