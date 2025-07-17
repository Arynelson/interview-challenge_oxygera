import { IsNumber, IsDateString, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssignmentDto {
  @ApiProperty({
    description: 'ID of the patient',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  patientId: number;

  @ApiProperty({
    description: 'ID of the medication',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  medicationId: number;

  @ApiProperty({
    description: 'Start date of the assignment in YYYY-MM-DD format',
    example: '2023-10-01',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'Number of days the assignment lasts',
    example: 7,
  })
  @IsNumber()
  @IsPositive()
  numberOfDays: number;
}
