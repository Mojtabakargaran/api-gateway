import { Controller, All, Req, Res, HttpException, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ProxyService } from './proxy.service';
import { ApiTags, ApiExcludeController } from '@nestjs/swagger';

@ApiTags('Proxy')
@ApiExcludeController()
@Controller('api/v1')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @All('tenants/*')
  async proxyToIdentityService(@Req() req: Request, @Res() res: Response) {
    try {
      const endpoint = req.url;
      const method = req.method;
      const data = req.body;
      const headers = this.extractHeaders(req);

      const result = await this.proxyService
        .proxyToIdentityService(endpoint, method, data, headers)
        .toPromise();

      res.status(200).json(result);
    } catch (error) {
      this.handleProxyError(error, res);
    }
  }

  @All('auth/*')
  async proxyToAuthService(@Req() req: Request, @Res() res: Response) {
    try {
      const endpoint = req.url;
      const method = req.method;
      const data = req.body;
      const headers = this.extractHeaders(req);

      const result = await this.proxyService
        .proxyToIdentityService(endpoint, method, data, headers)
        .toPromise();

      res.status(200).json(result);
    } catch (error) {
      this.handleProxyError(error, res);
    }
  }

  @All('profile')
  async proxyToProfileService(@Req() req: Request, @Res() res: Response) {
    try {
      const endpoint = req.url;
      const method = req.method;
      const data = req.body;
      const headers = this.extractHeaders(req);

      const result = await this.proxyService
        .proxyToIdentityService(endpoint, method, data, headers)
        .toPromise();

      res.status(200).json(result);
    } catch (error) {
      this.handleProxyError(error, res);
    }
  }

  @All('profile/*')
  async proxyToProfileServiceWithPath(@Req() req: Request, @Res() res: Response) {
    try {
      const endpoint = req.url;
      const method = req.method;
      const data = req.body;
      const headers = this.extractHeaders(req);

      const result = await this.proxyService
        .proxyToIdentityService(endpoint, method, data, headers)
        .toPromise();

      res.status(200).json(result);
    } catch (error) {
      this.handleProxyError(error, res);
    }
  }

  private extractHeaders(req: Request): any {
    const allowedHeaders = [
      'authorization',
      'content-type',
      'accept',
      'user-agent',
      'x-forwarded-for',
      'x-real-ip',
    ];

    const headers: any = {};
    allowedHeaders.forEach((header) => {
      if (req.headers[header]) {
        headers[header] = req.headers[header];
      }
    });

    // Add client IP
    headers['x-client-ip'] = req.ip || req.connection.remoteAddress;

    return headers;
  }

  private handleProxyError(error: any, res: Response) {
    if (error.response) {
      // Forward the error response from the microservice
      res.status(error.response.status).json(error.response.data);
    } else {
      // Internal server error
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        code: 'GATEWAY_ERROR',
        message: 'Internal gateway error',
      });
    }
  }
}
