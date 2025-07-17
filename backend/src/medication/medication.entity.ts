import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Assignment } from '../assignment/assignment.entity';

@Entity()
export class Medication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  dosage: number;

  @Column()
  frequency: number;

  @OneToMany(() => Assignment, (assignment) => assignment.medication)
  assignments: Assignment[];
}
