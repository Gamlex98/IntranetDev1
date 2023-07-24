import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FileService } from 'src/app/services/file.service';
import { logoModel } from 'src/app/models/logo.model';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-logos',
  templateUrl: './logos.component.html',
  styleUrls: ['./logos.component.css']
})
export class LogosComponent implements OnInit {
  logos: logoModel[] = [];

  constructor(private http: HttpClient, private service: FileService, private elementRef: ElementRef ,private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.getLogos();
  }

  getLogos() {
    this.service.getLogos().subscribe((logos: logoModel[]) => {
      this.logos = logos;
    });
  }

  showFile(url: string, contenedor: any): void {
    const urlParticionada = url.substring(url.indexOf('/logo'));
    this.http.get(`/api${urlParticionada}`, { responseType: 'blob' }).subscribe((archivo: any) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = document.createElement('img');
        img.src = reader.result as string;
        contenedor.appendChild(img);
      };
      reader.readAsDataURL(archivo);
    });
  }

  downloadFile(url: string): void {
    const extension = url.substring(url.lastIndexOf('.') + 1);
    const nombreCompleto = `${this.getLogoNombre(url)}.${extension}`;
    const urlParticionada = url.substring(url.indexOf('/logos'));

    const urlNas = 'http://172.16.1.24:88';

    this.http.get(`${urlNas}${urlParticionada}`, { responseType: 'blob' }).subscribe((archivo: any) => {
      const blob = new Blob([archivo]);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = nombreCompleto;
      link.click();
    }, (error: any) => {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Error extensión CORS',
        text: 'Ocurrió un error al descargar el archivo, por favor revisa la configuración de la extensión.',
        showConfirmButton: true,
        confirmButtonText: 'Entendido'
      });
    });
  }

  getLogoNombre(url: string): string {
    const logo = this.logos.find((logo: logoModel) => logo.url === url);
    return logo?.nombre ?? '';
  }

  esUltimoDeFila(index: number): boolean {
    return (index + 1) % 3 === 0;
  }
}
