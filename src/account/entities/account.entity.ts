import { Historic } from "src/historic/entities/historic.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Account {
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

    @Column({default: '031'})
    agency: string;

    @Column()
    type: string;

    @Column()
    valueType: string;

    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0, })
    balance: number;

    @Column({unique:true})
    number_account: string
        
    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    user_id: string;

    @OneToMany(() => Historic, (historic) => historic.account)
    historics: Historic[];

    constructor(
        props: {
            user_id: string;
            type: string;
            balance?: number|0.0;
        },
        id?: string,
    ){
        Object.assign(this, props);
        this.id = id || crypto.randomUUID();
    }
}
