import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class {{pascalName}}Service {
  private readonly url = "";
  private readonly http = inject(HttpClient);
  
  constructor() {}

  getData() {
    return this.http.get(`${this.url}/{{name}}`);
  }

  getDataById(id: string) {
    return this.http.get(`${this.url}/{{name}}/${id}`);
  }

  updateData(id: string, data: any) {
    return this.http.put(`${this.url}/{{name}}/${id}`, data);
  }

  addData(data: any) {
    return this.http.post(`${this.url}/{{name}}`, data);
  }
}
