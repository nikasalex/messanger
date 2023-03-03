import { Column, PrimaryGeneratedColumn, Entity } from "typeorm";

@Entity()
export class pTokens{  
    @PrimaryGeneratedColumn('uuid')
    token: string

    @Column()
    user_id: number

    @Column()
    expire: Date
}