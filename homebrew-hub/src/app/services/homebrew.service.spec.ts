import { TestBed } from '@angular/core/testing';
import { Paquete } from '../models/package.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { HomebrewService } from './homebrew.service';

describe('HomebrewService', () => {
  let service: HomebrewService;
  let paquetes: Paquete[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    }).compileComponents();

    service = TestBed.inject(HomebrewService);

    service.watch().subscribe({
      next(data) {
        paquetes = data;
      },
    });
    service.getAll();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Debería obtener más de 6k paquetes', () => {
    expect(paquetes.length).toBeGreaterThan(6000);
  });

  it('Los paquetes no deben estar undefined', () => {
    expect(paquetes[0]).not.toBeUndefined();
  });

  it('Los paquetes encontrados deben tener la palabra "Mysql"', () => {
    const busqueda = 'Mysql';
    const encontrado = service.filtrarPorBusqueda(busqueda);

    let coinciden = true;
    for (let i = 0; i < encontrado.length && coinciden; i++) {
      coinciden =
        encontrado[i].name.includes(busqueda) ||
        !encontrado[i].desc.includes(busqueda);
    }

    expect(coinciden).toBeTrue();
  });

  it('El primer filtro debe contener paquetes sólo con la licencia 0BSD', () => {
    const licencia0BSD = '0BSD';
    const paquetesFiltrados = service.filtrarPorLicencia(
      licencia0BSD,
      paquetes,
      []
    );
    let coinciden = true;

    for (let i = 0; i < paquetesFiltrados.length && coinciden; i++) {
      coinciden = paquetesFiltrados[i].license.includes(licencia0BSD);
    }

    expect(coinciden).toBeTrue();
  });

  it('El segundo filtro debe contener paquetes con licencia 0BSD y AFL', () => {
    const licencia0BSD = '0BSD';
    const paquetesFiltrados = service.filtrarPorLicencia(
      licencia0BSD,
      paquetes,
      []
    );

    const licenciaAFL = 'AFL';
    const nuevoFiltro = service.filtrarPorLicencia(
      licenciaAFL,
      paquetes,
      paquetesFiltrados
    );
    let coinciden = true;

    for (let i = 0; i < nuevoFiltro.length && coinciden; i++) {
      coinciden =
        nuevoFiltro[i].license.includes(licencia0BSD) ||
        nuevoFiltro[i].license.includes(licenciaAFL);
    }

    expect(coinciden).toBeTrue();
  });

  it('El primer filtro debe contener paquetes sólo para Mac OS', () => {
    const sistemaMac = 'mac';
    const paquetesFiltrados = service.filtrarPorSistemaOperativo(
      sistemaMac,
      paquetes,
      []
    );
    let coinciden = true;

    for (let i = 0; i < paquetesFiltrados.length && coinciden; i++) {
      coinciden = !paquetesFiltrados[i].linuxCompatible;
    }

    expect(coinciden).toBeTrue();
  });

  it('El segundo filtro debe contener paquetes para Mac OS y Linux', () => {
    const sistemaMac = 'mac';
    const paquetesFiltrados = service.filtrarPorSistemaOperativo(
      sistemaMac,
      paquetes,
      []
    );

    const sistemaLinux = 'Linux';
    const nuevoFiltro = service.filtrarPorSistemaOperativo(
      sistemaLinux,
      paquetes,
      paquetesFiltrados
    );

    expect(paquetesFiltrados.length + nuevoFiltro.length).toBeGreaterThan(
      paquetesFiltrados.length
    );
  });

  it('Los paquetes deben contener paquetes que tengan la categoría "audio" en la descripción', () => {
    const categoria = 'audio';
    const paquetesFiltrados = service.filtrarPorCategoria(
      categoria,
      paquetes,
      []
    );
    let coinciden = true;

    for (let i = 0; i < paquetesFiltrados.length && coinciden; i++) {
      coinciden = paquetesFiltrados[i].desc.toLocaleLowerCase().includes(categoria);
    }

    expect(coinciden).toBeTrue();
  });
});
