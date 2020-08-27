import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { UserEntity } from './user.entity';
import { GroupTypes } from '../constants/constant';

@Entity('group')
export class GroupEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn() 
  createdDate: Date;
  
  @Column({ nullable: false })
  creatorId: string;

  @ManyToOne(type => UserEntity, creator => creator.id)
  @JoinColumn({ name: "creatorId" })
  creator: UserEntity;
    
  @ManyToMany(type => UserEntity)
  @JoinTable()
  members: UserEntity[];

  @Column({
    unique: true,
  })
  name: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: GroupTypes.OneToMany, nullable:false })
  type: number;
}