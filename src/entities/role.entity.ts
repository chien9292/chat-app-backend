import { Entity, PrimaryGeneratedColumn, Column, OneToMany, PrimaryColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity('role') 
export class RoleEntity {

  @PrimaryColumn('int')
  id: number;

  @Column()
  name: string;

  @OneToMany(type => UserEntity, user => user.id)
  user: UserEntity[];
}