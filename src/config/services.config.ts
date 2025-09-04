import { registerAs } from '@nestjs/config';

export default registerAs('services', () => ({
  identityService: {
    url: process.env.IDENTITY_SERVICE_URL || 'http://localhost:3001',
  },
}));
