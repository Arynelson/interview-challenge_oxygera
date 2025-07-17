/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'ITs WORKS! localhost http://localhost:8080/api ';
  }
}
