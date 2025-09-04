import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { Observable, catchError, map } from 'rxjs';

@Injectable()
export class ProxyService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  proxyToIdentityService(endpoint: string, method: string, data?: any, headers?: any): Observable<any> {
    const identityServiceUrl = this.configService.get('services.identityService.url');
    const url = `${identityServiceUrl}${endpoint}`;

    return this.makeRequest(url, method, data, headers);
  }

  private makeRequest(url: string, method: string, data?: any, headers?: any): Observable<any> {
    const requestConfig = {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    let request: Observable<AxiosResponse<any>>;

    switch (method.toLowerCase()) {
      case 'get':
        request = this.httpService.get(url, requestConfig);
        break;
      case 'post':
        request = this.httpService.post(url, data, requestConfig);
        break;
      case 'put':
        request = this.httpService.put(url, data, requestConfig);
        break;
      case 'delete':
        request = this.httpService.delete(url, requestConfig);
        break;
      case 'patch':
        request = this.httpService.patch(url, data, requestConfig);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    return request.pipe(
      map((response) => response.data),
      catchError((error) => {
        console.error(`Proxy request failed for ${method} ${url}:`, error.message);
        throw error;
      }),
    );
  }
}
