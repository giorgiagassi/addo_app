import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {AuthService} from "../../providers/auth.service";
import {createUserWithEmailAndPassword, getAuth, getIdToken} from "firebase/auth";
import {getStorage, ref, uploadBytes} from "firebase/storage";
import {Router} from "@angular/router";
import {AlertController} from "@ionic/angular";
import {HttpHeaders,  HttpClient} from "@angular/common/http";
@Component({
  selector: 'app-registrazione',
  templateUrl: './registrazione.page.html',
  styleUrls: ['./registrazione.page.scss'],
})
export class RegistrazionePage {

  email: string = ''; // Initialize email as an empty string
  password: string = ''; // Initialize password as an empty string
  credenziali: boolean = true;
  radio: boolean = false;
  azienda: boolean = false;
  privato: boolean = false;
  tipoUtente: string = '';
  mostraForm: boolean = false;
  loading = false;
  businessForm: FormGroup;
  consumerForm: FormGroup;

  cittadinanze = [
    { nome: 'Afghanistan', codice: 'AF' },
    { nome: 'Albania', codice: 'AL' },
    { nome: 'Algeria', codice: 'DZ' },
    { nome: 'Andorra', codice: 'AD' },
    { nome: 'Angola', codice: 'AO' },
    { nome: 'Antigua e Barbuda', codice: 'AG' },
    { nome: 'Argentina', codice: 'AR' },
    { nome: 'Armenia', codice: 'AM' },
    { nome: 'Australia', codice: 'AU' },
    { nome: 'Austria', codice: 'AT' },
    { nome: 'Azerbaigian', codice: 'AZ' },
    { nome: 'Bahamas', codice: 'BS' },
    { nome: 'Bahrain', codice: 'BH' },
    { nome: 'Bangladesh', codice: 'BD' },
    { nome: 'Barbados', codice: 'BB' },
    { nome: 'Belgio', codice: 'BE' },
    { nome: 'Belize', codice: 'BZ' },
    { nome: 'Benin', codice: 'BJ' },
    { nome: 'Bhutan', codice: 'BT' },
    { nome: 'Bolivia', codice: 'BO' },
    { nome: 'Bosnia ed Erzegovina', codice: 'BA' },
    { nome: 'Botswana', codice: 'BW' },
    { nome: 'Brasile', codice: 'BR' },
    { nome: 'Brunei', codice: 'BN' },
    { nome: 'Bulgaria', codice: 'BG' },
    { nome: 'Burkina Faso', codice: 'BF' },
    { nome: 'Burundi', codice: 'BI' },
    { nome: 'Cabo Verde', codice: 'CV' },
    { nome: 'Cambogia', codice: 'KH' },
    { nome: 'Camerun', codice: 'CM' },
    { nome: 'Canada', codice: 'CA' },
    { nome: 'Ciad', codice: 'TD' },
    { nome: 'Cile', codice: 'CL' },
    { nome: 'Cina', codice: 'CN' },
    { nome: 'Cipro', codice: 'CY' },
    { nome: 'Colombia', codice: 'CO' },
    { nome: 'Comore', codice: 'KM' },
    { nome: 'Congo (Rep. Democratica)', codice: 'CD' },
    { nome: 'Congo (Rep. del)', codice: 'CG' },
    { nome: 'Corea del Nord', codice: 'KP' },
    { nome: 'Corea del Sud', codice: 'KR' },
    { nome: 'Costa d\'Avorio', codice: 'CI' },
    { nome: 'Costa Rica', codice: 'CR' },
    { nome: 'Croazia', codice: 'HR' },
    { nome: 'Cuba', codice: 'CU' },
    { nome: 'Danimarca', codice: 'DK' },
    { nome: 'Dominica', codice: 'DM' },
    { nome: 'Ecuador', codice: 'EC' },
    { nome: 'Egitto', codice: 'EG' },
    { nome: 'El Salvador', codice: 'SV' },
    { nome: 'Emirati Arabi Uniti', codice: 'AE' },
    { nome: 'Eritrea', codice: 'ER' },
    { nome: 'Estonia', codice: 'EE' },
    { nome: 'Eswatini', codice: 'SZ' },
    { nome: 'Etiopia', codice: 'ET' },
    { nome: 'Figi', codice: 'FJ' },
    { nome: 'Filippine', codice: 'PH' },
    { nome: 'Finlandia', codice: 'FI' },
    { nome: 'Francia', codice: 'FR' },
    { nome: 'Gabon', codice: 'GA' },
    { nome: 'Gambia', codice: 'GM' },
    { nome: 'Georgia', codice: 'GE' },
    { nome: 'Germania', codice: 'DE' },
    { nome: 'Ghana', codice: 'GH' },
    { nome: 'Giamaica', codice: 'JM' },
    { nome: 'Giappone', codice: 'JP' },
    { nome: 'Giordania', codice: 'JO' },
    { nome: 'Grecia', codice: 'GR' },
    { nome: 'Grenada', codice: 'GD' },
    { nome: 'Guatemala', codice: 'GT' },
    { nome: 'Guinea', codice: 'GN' },
    { nome: 'Guinea-Bissau', codice: 'GW' },
    { nome: 'Guinea Equatoriale', codice: 'GQ' },
    { nome: 'Guyana', codice: 'GY' },
    { nome: 'Haiti', codice: 'HT' },
    { nome: 'Honduras', codice: 'HN' },
    { nome: 'India', codice: 'IN' },
    { nome: 'Indonesia', codice: 'ID' },
    { nome: 'Iran', codice: 'IR' },
    { nome: 'Iraq', codice: 'IQ' },
    { nome: 'Irlanda', codice: 'IE' },
    { nome: 'Islanda', codice: 'IS' },
    { nome: 'Israele', codice: 'IL' },
    { nome: 'Italia', codice: 'IT' },
    { nome: 'Jamaica', codice: 'JM' },
    { nome: 'Kazakistan', codice: 'KZ' },
    { nome: 'Kenya', codice: 'KE' },
    { nome: 'Kirghizistan', codice: 'KG' },
    { nome: 'Kiribati', codice: 'KI' },
    { nome: 'Kosovo', codice: 'XK' },
    { nome: 'Kuwait', codice: 'KW' },
    { nome: 'Laos', codice: 'LA' },
    { nome: 'Lesotho', codice: 'LS' },
    { nome: 'Lettonia', codice: 'LV' },
    { nome: 'Libano', codice: 'LB' },
    { nome: 'Liberia', codice: 'LR' },
    { nome: 'Libia', codice: 'LY' },
    { nome: 'Liechtenstein', codice: 'LI' },
    { nome: 'Lituania', codice: 'LT' },
    { nome: 'Lussemburgo', codice: 'LU' },
    { nome: 'Macedonia del Nord', codice: 'MK' },
    { nome: 'Madagascar', codice: 'MG' },
    { nome: 'Malawi', codice: 'MW' },
    { nome: 'Malesia', codice: 'MY' },
    { nome: 'Maldive', codice: 'MV' },
    { nome: 'Mali', codice: 'ML' },
    { nome: 'Malta', codice: 'MT' },
    { nome: 'Marocco', codice: 'MA' },
    { nome: 'Mauritania', codice: 'MR' },
    { nome: 'Mauritius', codice: 'MU' },
    { nome: 'Messico', codice: 'MX' },
    { nome: 'Micronesia', codice: 'FM' },
    { nome: 'Moldavia', codice: 'MD' },
    { nome: 'Monaco', codice: 'MC' },
    { nome: 'Mongolia', codice: 'MN' },
    { nome: 'Montenegro', codice: 'ME' },
    { nome: 'Mozambico', codice: 'MZ' },
    { nome: 'Myanmar', codice: 'MM' },
    { nome: 'Namibia', codice: 'NA' },
    { nome: 'Nauru', codice: 'NR' },
    { nome: 'Nepal', codice: 'NP' },
    { nome: 'Nicaragua', codice: 'NI' },
    { nome: 'Niger', codice: 'NE' },
    { nome: 'Nigeria', codice: 'NG' },
    { nome: 'Norvegia', codice: 'NO' },
    { nome: 'Nuova Zelanda', codice: 'NZ' },
    { nome: 'Oman', codice: 'OM' },
    { nome: 'Paesi Bassi', codice: 'NL' },
    { nome: 'Pakistan', codice: 'PK' },
    { nome: 'Palau', codice: 'PW' },
    { nome: 'Palestina', codice: 'PS' },
    { nome: 'Panama', codice: 'PA' },
    { nome: 'Papua Nuova Guinea', codice: 'PG' },
    { nome: 'Paraguay', codice: 'PY' },
    { nome: 'Perù', codice: 'PE' },
    { nome: 'Polonia', codice: 'PL' },
    { nome: 'Portogallo', codice: 'PT' },
    { nome: 'Qatar', codice: 'QA' },
    { nome: 'Regno Unito', codice: 'GB' },
    { nome: 'Repubblica Centrafricana', codice: 'CF' },
    { nome: 'Repubblica Ceca', codice: 'CZ' },
    { nome: 'Repubblica Dominicana', codice: 'DO' },
    { nome: 'Romania', codice: 'RO' },
    { nome: 'Ruanda', codice: 'RW' },
    { nome: 'Russia', codice: 'RU' },
    { nome: 'Saint Kitts e Nevis', codice: 'KN' },
    { nome: 'Saint Lucia', codice: 'LC' },
    { nome: 'Saint Vincent e Grenadine', codice: 'VC' },
    { nome: 'Samoa', codice: 'WS' },
    { nome: 'San Marino', codice: 'SM' },
    { nome: 'São Tomé e Príncipe', codice: 'ST' },
    { nome: 'Senegal', codice: 'SN' },
    { nome: 'Serbia', codice: 'RS' },
    { nome: 'Seychelles', codice: 'SC' },
    { nome: 'Sierra Leone', codice: 'SL' },
    { nome: 'Singapore', codice: 'SG' },
    { nome: 'Siria', codice: 'SY' },
    { nome: 'Slovacchia', codice: 'SK' },
    { nome: 'Slovenia', codice: 'SI' },
    { nome: 'Somalia', codice: 'SO' },
    { nome: 'Spagna', codice: 'ES' },
    { nome: 'Sri Lanka', codice: 'LK' },
    { nome: 'Stati Uniti', codice: 'US' },
    { nome: 'Sudafrica', codice: 'ZA' },
    { nome: 'Sudan', codice: 'SD' },
    { nome: 'Sudan del Sud', codice: 'SS' },
    { nome: 'Suriname', codice: 'SR' },
    { nome: 'Svezia', codice: 'SE' },
    { nome: 'Svizzera', codice: 'CH' },
    { nome: 'Swaziland', codice: 'SZ' },
    { nome: 'Tagikistan', codice: 'TJ' },
    { nome: 'Taiwan', codice: 'TW' },
    { nome: 'Tanzania', codice: 'TZ' },
    { nome: 'Thailandia', codice: 'TH' },
    { nome: 'Timor Est', codice: 'TL' },
    { nome: 'Togo', codice: 'TG' },
    { nome: 'Tonga', codice: 'TO' },
    { nome: 'Trinidad e Tobago', codice: 'TT' },
    { nome: 'Tunisia', codice: 'TN' },
    { nome: 'Turchia', codice: 'TR' },
    { nome: 'Turkmenistan', codice: 'TM' },
    { nome: 'Tuvalu', codice: 'TV' },
    { nome: 'Ucraina', codice: 'UA' },
    { nome: 'Uganda', codice: 'UG' },
    { nome: 'Ungheria', codice: 'HU' },
    { nome: 'Uruguay', codice: 'UY' },
    { nome: 'Uzbekistan', codice: 'UZ' },
    { nome: 'Vanuatu', codice: 'VU' },
    { nome: 'Venezuela', codice: 'VE' },
    { nome: 'Vietnam', codice: 'VN' },
    { nome: 'Yemen', codice: 'YE' },
    { nome: 'Zambia', codice: 'ZM' },
    { nome: 'Zimbabwe', codice: 'ZW' }
  ];
  searchTerm: string = '';
  auth = getAuth();
  storage = getStorage();

  constructor(
    private router: Router,
    public authService: AuthService,
    private fb: FormBuilder,
    private alertController: AlertController,
  ) {
    this.businessForm = fb.group({
      username_B: new FormControl(),
      first_name_B: new FormControl(),
      last_name_B: new FormControl(),
      uid_B: new FormControl(),
      address_B: new FormControl(),
      address_legal_B: new FormControl(),
      city_B: new FormControl(),
      city_ccia_registration_B: new FormControl(),
      company_certificate_B: new FormControl(),
      company_name_B: new FormControl(),
      fiscal_code_B: new FormControl(),
      dob_B: new FormControl(),
      email_B: new FormControl(),
      gender_B: new FormControl(),
      nationality_code_B: new FormControl(),
      num_rea_B: new FormControl(),
      pec_B: new FormControl(),
      phone_prefix_B: new FormControl(),
      phone_B: new FormControl(),
      private_user_B: new FormControl(),
      recipient_code_B: new FormControl(),
      state_B: new FormControl(),
      vat_number_B: new FormControl()
    });
    this.consumerForm = fb.group({
      username_C: new FormControl(),
      first_name_C: new FormControl(),
      last_name_C: new FormControl(),
      uid_C: new FormControl(),
      address_C: new FormControl(),
      address_legal_C: new FormControl(),
      birth_place_C: new FormControl(),
      city_C: new FormControl(),
      city_ccia_registration_C: new FormControl(),
      company_certificate_C: new FormControl(),
      company_name_C: new FormControl(),
      fiscal_code_C: new FormControl(),
      dob_C: new FormControl(),
      email_C: new FormControl(),
      gender_C: new FormControl(),
      nationality_code_C: new FormControl(),
      num_rea_C: new FormControl(),
      pec_C: new FormControl(),
      phone_prefix_C: new FormControl(),
      phone_C: new FormControl(),
      private_user_C: new FormControl(),
      recipient_code_C: new FormControl(),
      state_C: new FormControl(),
      vat_number_C: new FormControl()
    });
  }

  toggleCredenziali() {
    this.credenziali = !this.credenziali;
    this.radio = !this.radio;
  }

  sceltaUtente(): void {
    this.azienda = this.tipoUtente === 'business';
    this.privato = this.tipoUtente === 'consumer';
    this.radio = false;
    this.mostraForm = true;
  }


  async registrati(email: string, password: string, role: string) {
    console.log(email, password, role);
    try {
      const user = await this.authService.registerWithEmailAndPassword(email, password);

      if (user) {
        const idToken = await this.authService.getIdToken(user);
        console.log('ID Token:', idToken); // Stampa il token

        let body: any;
        let companyCertificatePath;
        if (this.tipoUtente === 'business') {
          companyCertificatePath = `users/${user.uid}/company_certificate`;
          await this.handleFileUpload(this.businessForm.value.company_certificate_B, companyCertificatePath);

          body = {
            username: '',
            first_name: this.businessForm.value.first_name_B,
            last_name: this.businessForm.value.last_name_B,
            uid: user.uid,
            role: role,
            address: this.businessForm.value.address_B,
            address_legal: this.businessForm.value.address_legal_B,
            city: this.businessForm.value.city_B,
            city_ccia_registration: this.businessForm.value.city_ccia_registration_B,
            company_certificate: this.businessForm.value.company_certificate_B,
            company_name: this.businessForm.value.company_name_B,
            fiscal_code: this.businessForm.value.fiscal_code_B,
            dob: this.businessForm.value.dob_B,
            email: email,
            gender: this.businessForm.value.gender_B ?? null,
            nationality_code: this.businessForm.value.nationality_code_B,
            num_rea: this.businessForm.value.num_rea_B,
            pec: this.businessForm.value.pec_B,
            phone_prefix: this.businessForm.value.phone_prefix_B ?? null,
            phone: this.businessForm.value.phone_B,
            private_user: true,
            recipient_code: this.businessForm.value.recipient_code_B,
            state: this.businessForm.value.state_B,
            vat_number: this.businessForm.value.vat_number_B
          };
        } else if (this.tipoUtente === 'consumer') {
          body = {
            username: '',
            first_name: this.consumerForm.value.first_name_C,
            last_name: this.consumerForm.value.last_name_C,
            uid: user.uid,
            role: role,
            address: this.consumerForm.value.address_C,
            address_legal: this.consumerForm.value.address_legal_C,
            birth_place: this.consumerForm.value.birth_place_C,
            city: this.consumerForm.value.city_C,
            city_ccia_registration: '',
            company_certificate: '',
            company_name: '',
            fiscal_code: this.consumerForm.value.fiscal_code_C,
            dob: this.consumerForm.value.dob_C,
            email: email,
            gender: this.consumerForm.value.gender_C ?? null,
            nationality_code: this.consumerForm.value.nationality_code_C,
            num_rea: '',
            pec: this.consumerForm.value.pec_C,
            phone_prefix: this.consumerForm.value.phone_prefix_C ?? null,
            phone: this.consumerForm.value.phone_C,
            private_user: true,
            recipient_code: '',
            state: this.consumerForm.value.state_C,
            vat_number: ''
          };
        }

        const headers = this.authService.createHeaders(idToken);
        console.log('Headers:', headers); // Stampa gli headers

        const delayInMilliseconds = 1000; // Example: 1 second
        setTimeout(() => {
          if (this.tipoUtente == 'business') { }
          this.authService.createUser(body,  headers ).subscribe({
            next: async (result) => {
              this.loading = false;
              const alert = await this.alertController.create({
                header: 'Account creato con successo',
                buttons: [
                  {
                    text: 'OK',
                    handler: () => {
                      this.authService.SignOut().then(() => {
                        this.router.navigate(['login']);
                      });
                    }
                  }
                ]
              });
              await alert.present();
            },
            error: async (error) => {
              console.error('Errore durante la registrazione:', error);

              const alert = await this.alertController.create({
                header: 'Errore durante la registrazione',
                buttons: [
                  {
                    text: 'OK',
                    handler: () => {
                      this.authService.deleteUser();
                    }
                  }
                ]
              });
              await alert.present();
            },
          });
        }, delayInMilliseconds);

        console.log(body);
      } else {
        console.error('User is undefined or null');
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  }

  async handleFileUpload(file: File, path: string) {
    const storageRef = ref(this.storage, path);

    try {
      await uploadBytes(storageRef, file);
      console.log('Upload completato');
    } catch (error) {
      console.error('Errore durante l\'upload:', error);
    }
  }
}
