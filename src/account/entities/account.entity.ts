import { Historic } from "src/historic/entities/historic.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Account {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: true, nullable:false })
    active: boolean;

    @Column({default: new Date(), nullable:false})
    created_at: Date;

    @Column({ default: null })
    updated_at: Date;

    @Column({ default: null })
    deactivated_at: Date;

    @Column({default: '031', nullable:false})
    agency: string;

    @Column({nullable:false})
    type: string;

    @Column({nullable:false})
    valueType: string;

    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0, })
    balance: number;

    @Column({unique:true, nullable:false})
    number_account: string
        
    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({nullable:false})
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
        account?: Partial<Account>
    ){
        this.active = account?.active;
        this.agency = account?.agency;
        this.balance = account?.balance;
        this.created_at = account?.created_at;
        this.deactivated_at = account?.deactivated_at;
        this.historics = account?.historics
        this.id = account?.id;
        this.number_account = account?.number_account;
        this.type = account?.type;
        this.updated_at = account?.updated_at;
        this.user = account?.user;
        this.user_id = account?.user_id;

        Object.assign(this, props);
        this.id = id || crypto.randomUUID();
    }
}
