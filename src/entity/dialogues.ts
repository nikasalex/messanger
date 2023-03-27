import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, Column, OneToMany} from "typeorm";
import { Users } from "./users";
import { Messages } from "./messages";

@Entity()
export class Dialogues{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToMany(()=>Messages, (message)=> message.dialogue)
    messages: Messages[]

    @ManyToMany(()=> Users, (users)=> users.dialogues)
    @JoinTable()
    users: Users[]

}