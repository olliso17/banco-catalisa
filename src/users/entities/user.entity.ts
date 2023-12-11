import { Account } from "src/account/entities/account.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: true })
    active: boolean;

    @Column({default: new Date()})
    created_at: Date;

    @Column({ default: null })
    updated_at: Date;

    @Column({ default: null })
    deactivated_at: Date;

    @Column()
    password: string;

    @Column()
    cpf: string;

    @OneToMany(() => Account, (account) => account.user)
    accounts: Account[];

    constructor(
        props: {
            cpf: string;
            password: string;
            active?: boolean;
        },
        id?: string,
        // user?: Partial<User>
    ){
        
        // this.cpf = user?.cpf,
        // this.active= user?.active
        // this.created_at = user?.created_at
        // this.deactivated_at = user?.deactivated_at
        // this.password = user?.password
        // this.updated_at = user?.updated_at
        // this.id = user?.id
        
        Object.assign(this, props);
        this.id = id || crypto.randomUUID();
    }
 
}

   

 
