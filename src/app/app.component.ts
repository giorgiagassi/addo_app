import {Component, OnInit} from '@angular/core';
import {AuthService} from "./providers/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  loading: boolean = false;
  ngOnInit(){
    this.autenticazioneService.loading.subscribe((value: boolean) => {
      this.loading = value;
    });

  }

  constructor(protected autenticazioneService : AuthService){
  }


}
