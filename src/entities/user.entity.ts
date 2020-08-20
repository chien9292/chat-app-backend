import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, BeforeInsert, OneToMany, ManyToOne, JoinColumn, ManyToMany, JoinTable, BeforeUpdate } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { GroupEntity } from './group.entity';
import { RoleEntity } from './role.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn() 
  createdDate: Date;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    nullable: true,
  })
  fullname: string;

  @Column({
    nullable: true,
  })
  avatar: string;
  
  @Column({ default: true })
  isActive: boolean;

  @OneToMany(type => GroupEntity, group => group.creator)
  group: GroupEntity[];

  @ManyToMany(type => GroupEntity)
  @JoinTable()
  favorites: GroupEntity[];

  @Column("int", { nullable: false, default: 2 })
  roleId: number;

  @ManyToOne(type => RoleEntity, role => role.id)
  @JoinColumn({ name: "roleId" })
  role: RoleEntity;

  @BeforeInsert()  async hashPasswordCreate() {
    this.password = await bcrypt.hash(this.password, 10);  
  }
  @BeforeUpdate() async hashPasswordUpdate() {
    this.password = await bcrypt.hash(this.password, 10);  
  }
}