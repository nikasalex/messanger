import { Column, PrimaryGeneratedColumn, Entity } from "typeorm";

@Entity()
export class Tokens{  
    @PrimaryGeneratedColumn('uuid')
    token: string

    @Column()
    user_id: number

    @Column()
    expire: Date
}