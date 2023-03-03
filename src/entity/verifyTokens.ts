import { Column, PrimaryGeneratedColumn, Entity } from "typeorm";

@Entity()
export class vTokens{  
    @PrimaryGeneratedColumn('uuid')
    token: string

    @Column()
    user_id: number

    @Column()
    expire: Date
}