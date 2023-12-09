import { Account } from "src/account/entities/account.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Historic {
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

    @ManyToOne(() => Account, account => account.id)
    @JoinColumn({ name: 'account_id' })
    account: Account;

    @Column()
    account_id: string;

    @Column({default:0.0})
    value_deposit?: number;

    @Column({default:0.0})
    value_withdraw?: number;

    constructor(
        props: {
            account_id: string;
            value_deposit?: number | 0.0;
            value_withdraw?: number|0.0;
        },
        id?: string,
    ){
        Object.assign(this, props);
        this.id = id || crypto.randomUUID();
    }
}
