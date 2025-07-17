import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Patient } from '../patient/patient.entity';
import { Medication } from '../medication/medication.entity';

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column()
  numberOfDays: number;

  @ManyToOne(() => Patient, (patient) => patient.assignments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column()
  patientId: number;

  @ManyToOne(() => Medication, (medication) => medication.assignments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'medicationId' })
  medication: Medication;

  @Column()
  medicationId: number;

  // Método para calcular dias restantes
  getRemainingDays(): number {
    const today = new Date();
    const endDate = new Date(this.startDate);
    endDate.setDate(endDate.getDate() + this.numberOfDays);

    const timeDiff = endDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return Math.max(0, daysDiff);
  }
}
