import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Sessions{  
    @PrimaryGeneratedColumn("uuid")
    session_id: string

    @Column()
    user_id: number  
}



