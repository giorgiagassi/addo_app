import {Injectable, NgZone} from '@angular/core';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut, User } from "firebase/auth";
import { initializeApp } from "firebase/app";
import {environment} from "../../environments/environment";
import {BehaviorSubject, catchError, finalize, Observable, tap} from "rxjs";
import {Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AlertController} from "@ionic/angular";


const firebaseApp = initializeApp(environment.firebaseConfig);
const auth = getAuth(firebaseApp);
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = 'https://addo-api.besanfra.com/v1/user/';
  userData: any;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading = this.loadingSubject.asObservable();

  constructor(
    public router: Router,
    private http: HttpClient,
    private alertController: AlertController,
    private ngZone: NgZone
  ) {
    auth.onAuthStateChanged((user) => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    });
  }

  async SignIn(email: string, password: string) {
    this.loadingSubject.next(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      if (user) {
        const idToken = await user.getIdToken();
        const headers = new HttpHeaders({
          'Authorization': `${idToken}`,
          'Content-Type': 'application/json',
        });

        const userData = await this.http.get(this.apiUrl, { headers }).toPromise();
        console.log(userData, 'user data');

        const alert = await this.alertController.create({
          header: 'Accesso avvenuto con successo',
          buttons: [{
            text: 'OK',
            handler: () => this.router.navigate(['/home'])
          }]
        });
        await alert.present();


      }
    } catch (error: any) {
      console.error(error.code);
      this.errorMessage(error.code);
    } finally {
      this.loadingSubject.next(false);
    }
  }

  async SignUp(email: string, password: string) {
    this.loadingSubject.next(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      this.errorMessage(error.code);
    } finally {
      this.loadingSubject.next(false);
    }
  }

  async ForgotPassword(passwordResetEmail: string) {
    this.loadingSubject.next(true);
    try {
      await sendPasswordResetEmail(auth, passwordResetEmail);
      const alert = await this.alertController.create({
        header: 'Cambio password avvenuto con successo',
        message: 'Controlla la tua mail per le istruzioni',
        buttons: ['OK']
      });
      await alert.present();
    } catch (error: any) {
      this.errorMessage(error.code);
    } finally {
      this.loadingSubject.next(false);
    }
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null;
  }

  async SignOut() {
    this.loadingSubject.next(true);
    try {
      await signOut(auth);
      localStorage.removeItem('user');

      const alert = await this.alertController.create({
        header: 'Logout avvenuto con successo',
        message: 'Il logout è stato eseguito con successo.',
        buttons: [{
          text: 'OK',
          handler: () => window.location.reload()
        }]
      });
      await alert.present();

      this.ngZone.run(() => this.router.navigate(['/login']));
    } catch (error: any) {
      console.error('Errore durante il sign-out:', error);
    } finally {
      this.loadingSubject.next(false);
    }
  }

  createUser(body: any, headers: any): Observable<any> {
    this.loadingSubject.next(true);
    return this.http.post(this.apiUrl, body, { headers })
      .pipe(
        tap(() => {}),
        catchError((error) => {
          this.errorMessage(error.code);
          throw error;
        }),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  async deleteUser() {
    try {
      const user = auth.currentUser;
      if (user) {
        await user.delete();
        const alert = await this.alertController.create({
          header: 'Account eliminato con successo',
          message: 'Il tuo account è stato eliminato.',
          buttons: ['OK']
        });
        await alert.present();
      }
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Errore',
        message: 'Errore durante l\'eliminazione dell\'account',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  errorMessage(code: string) {
    let message = '';
    switch (code) {
      case 'auth/wrong-password':
        message = 'La password inserita non è valida.';
        break;
      case 'auth/user-not-found':
        message = 'Non è stato trovato nessun utente con queste credenziali.';
        break;
      case 'auth/missing-email':
        message = 'Non è stata inserita nessuna mail.';
        break;
      case 'auth/missing-password':
        message = 'Non è stata inserita nessuna password.';
        break;
      case 'auth/invalid-login-credentials':
        message = 'Le credenziali non sono valide.';
        break;
      default:
        message = 'Si è verificato un errore sconosciuto.';
        break;
    }
    this.alertController.create({
      header: 'Errore',
      message: message,
      buttons: ['OK']
    }).then(alert => alert.present());
  }
}
