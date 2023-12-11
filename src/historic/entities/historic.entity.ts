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

    @Column({nullable:false})
    account_id: string;

    @Column({default:false})
    value_deposit?: boolean;

    @Column({default:false})
    value_withdraw?: boolean;

    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0, })
    ammount: number;

    constructor(
        props: {
            account_id: string;
            ammount: number;
            value_deposit?: boolean;
            value_withdraw?: boolean;
        },
        id?: string,
    ){
        Object.assign(this, props);
        this.id = id || crypto.randomUUID();
    }
}
