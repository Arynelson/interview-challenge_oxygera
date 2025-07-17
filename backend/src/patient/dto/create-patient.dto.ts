import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';

export class CreatePatientDto {
  @ApiProperty({
    description: 'Name of the patient',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Date of birth of the patient in YYYY-MM-DD format',
    example: '1990-01-01',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  dateOfBirth: Date;
}
