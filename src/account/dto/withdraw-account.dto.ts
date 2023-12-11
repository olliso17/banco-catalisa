import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "typeorm/driver/mongodb/bson.typings";

export class withdrawAccountDto {
    @ApiProperty({
        description:"A account_id é do tipo string e tem que ser um user válido",
        example:UUID
    })
    account_id?: string;

    value_withdraw?: true;

    @ApiProperty({
        description:"O valor é do tipo decimal",

        example:100.0
    })
    ammount:number;
}
