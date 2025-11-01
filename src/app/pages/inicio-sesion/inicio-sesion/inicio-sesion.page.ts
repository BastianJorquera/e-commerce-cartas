import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonButtons,
  ToastController,
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.page.html',
  styleUrls: ['./inicio-sesion.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonButtons,
  ],
})
export class InicioSesionPage implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private toastCtrl: ToastController) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async login() {
    const { email, password } = this.loginForm.value;

    // Simulación de autenticación
    if (email === 'test@correo.com' && password === '123456') {
      const toast = await this.toastCtrl.create({
        message: 'Inicio de sesión exitoso 🎉',
        duration: 2000,
        color: 'success',
      });
      await toast.present();

      // Aquí podrías navegar a /home si ya existe
      // this.router.navigateByUrl('/home');
    } else {
      const toast = await this.toastCtrl.create({
        message: 'Credenciales incorrectas',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }
}



/*
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.page.html',
  styleUrls: ['./inicio-sesion.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class InicioSesionPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
*/