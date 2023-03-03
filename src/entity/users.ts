import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Users{  
    @PrimaryGeneratedColumn('increment')
    user_id: number

    @Column()
    email: string

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    password: string

    @Column()
    verify: boolean   
}



