import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
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
import { Router, RouterModule } from '@angular/router';

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

  constructor(
    private fb: FormBuilder,
    private toastCtrl: ToastController,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async login() {
  const { email, password } = this.loginForm.value;

  // Obtener usuarios guardados
  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  const usuarioEncontrado = usuarios.find((u: any) => u.email === email && u.password === password);

  if (!usuarioEncontrado) {
    const toast = await this.toastCtrl.create({
      message: 'Usuario o contraseña incorrectos',
      duration: 2000,
      color: 'danger',
    });
    await toast.present();
    return;
  }

  // Iniciar sesión usando UsuarioService
  this.usuarioService.iniciarSesion(); // mantiene la compatibilidad con tu código actual
  const toast = await this.toastCtrl.create({
    message: 'Inicio de sesión exitoso 🎉',
    duration: 2000,
    color: 'success',
  });
  await toast.present();

  // Abrir tab Perfil automáticamente
  this.router.navigateByUrl('/tabs/perfil', { replaceUrl: true });
  }
}