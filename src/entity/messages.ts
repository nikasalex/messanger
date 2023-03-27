import { Entity, Column, CreateDateColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Dialogues } from "./dialogues";
import { Users } from "./users";

@Entity()
export class Messages{

@PrimaryGeneratedColumn()
id: number

@Column()
message: string

@CreateDateColumn()
createAt: Date 

@ManyToOne(()=>Dialogues, (dialogue)=> dialogue.messages, {cascade:true})
dialogue: Dialogues

@ManyToOne(()=>Users, (user)=> user.messages)
user: Users

}