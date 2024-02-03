import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-viewmodal',
  templateUrl: './viewmodal.component.html',
  styleUrls: ['./viewmodal.component.scss']
})
export class ViewmodalComponent implements OnInit {
  movieTerms: any;
  fileId: number;
  fileUrl;
  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.movieTerms = JSON.parse(localStorage.getItem('movieTerms'));
    const blob = new Blob([this.movieTerms], { type: 'application/octet-stream' });
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
  }

}
