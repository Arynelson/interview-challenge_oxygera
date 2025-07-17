import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Max,
  Min,
} from 'class-validator';

export class CreateMedicationDto {
  @ApiProperty({
    description: 'Name of the medication',
    example: 'Aspirin',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Dosage of the medication in milligrams',
    example: 500,
  })
  @Max(100000)
  @Min(1)
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  dosage: number;

  @ApiProperty({
    description: 'Frequency of the medication in times per day',
    example: 2,
  })
  @Max(24)
  @Min(1)
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  frequency: number;
}
