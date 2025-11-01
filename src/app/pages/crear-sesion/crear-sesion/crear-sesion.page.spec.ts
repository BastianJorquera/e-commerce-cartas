import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearSesionPage } from './crear-sesion.page';

describe('CrearSesionPage', () => {
  let component: CrearSesionPage;
  let fixture: ComponentFixture<CrearSesionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearSesionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
