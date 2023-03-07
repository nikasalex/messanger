import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Sessions{  
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    user_id: number  
}



