import { Entity, Column, CreateDateColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Dialogues } from "./dialogues";

@Entity()
export class Messages{

@PrimaryGeneratedColumn()
id: number

@Column()
message: string

@CreateDateColumn()
createAt: Date 

@ManyToOne(()=>Dialogues, (dialogues)=> dialogues.messages)
dialogue: Dialogues

}