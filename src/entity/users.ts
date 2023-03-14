import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { Dialogues } from "./dialogues";

@Entity()
export class Users{  
    @PrimaryGeneratedColumn()
    id: number 

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

    @ManyToMany(()=>Dialogues, (dialogues)=> dialogues.users)
    dialogues: Dialogues[]
}



