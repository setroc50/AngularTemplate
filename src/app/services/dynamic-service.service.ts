import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,catchError,forkJoin, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DynamicService { 
  private apiUrl = '';
  private http = inject(HttpClient);


  getWithKey<T>(endpoint: string, key: string): Observable<{ [key: string]: T }> {
   // const url = `${this.apiUrl}/${endpoint}`;
    const url = endpoint;
    return this.http.get<any>(url).pipe(
      map(response => ({ [key]: response as T })), // Cast la respuesta a T
      catchError(error => {
        console.error(`Error fetching ${endpoint}:`, error);
        // Devuelve un Observable con la estructura esperada, con un valor por defecto (puedes ajustarlo)
        return of({ [key]: {} as T });
      })
    );
  }

  getMultipleWithKeys<T>(endpoints: []): Observable<{ [key: string]: T }> {
    const requests: Observable<{ [key: string]: T }>[] = endpoints.map(endpointConfig =>{
      let end = endpointConfig as any;
     return  this.getWithKey<T>(end.url, end.key)
    }
    );

    return forkJoin(requests).pipe(
      map(arrayOfResponses => {
        const result: { [key: string]: T } = {};
        arrayOfResponses.forEach(responseObject => {
          Object.assign(result, responseObject);
        });
        return result;
      })
    );
  }


  get<T>(endpoint: string): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}`;
    return   this.http.get<T>(endpoint);
  }

  getMultiple<T>(endpoints: []): Observable<T[]> {
    const requests: Observable<T>[] = endpoints.map(endpoint => {
      let end = endpoint as any;
      return this.get<T>(end.url)
    }
    );
      
    
    return forkJoin(requests);
  }
 
  create<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http.post<T>(url, data);
  }

  getAll<T>(endpoint: [], queryParams?: any): Observable<T[]> {
    let url = `${this.apiUrl}/${endpoint}`;
    if (queryParams) {
      const params = new URLSearchParams();
      for (const key in queryParams) {
        if (queryParams.hasOwnProperty(key)) {
          params.set(key, queryParams[key]);
        }
      }
      url += `?${params.toString()}`;
    }
    return this.http.get<T[]>(url);
  }

  getById<T>(endpoint: string, id: number): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}/${id}`;
    return this.http.get<T>(url);
  }

  update<T>(endpoint: string, id: number, data: any): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}/${id}`;
    return this.http.put<T>(url, data);
  }

  delete<T>(endpoint: string, id: number): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}/${id}`;
    return this.http.delete<T>(url);
  }
}