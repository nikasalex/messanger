import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from "typeorm";
import { Dialogues } from "./dialogues";
import { Messages } from "./messages"; 

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

    @OneToMany(()=>Messages, (message)=> message.user)
    messages: Messages[]

    @ManyToMany(()=>Dialogues, (dialogues)=> dialogues.users)
    dialogues: Dialogues[]
}



