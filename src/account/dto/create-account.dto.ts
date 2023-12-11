import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "typeorm/driver/mongodb/bson.typings";

export class CreateAccountDto {
    @ApiProperty({
        description:"O user_id é do tipo string e tem que ser um user válido",
        example:UUID
    })
    user_id:string;
    @ApiProperty({
        description:"O typo tem que ser Corrente ou Poupança",
        example:"Corrente"
    })
    type: string;
    @ApiProperty({
        description:"O saldo é do tipo decimal",
        example:100.0
    })
    balance: number;
}
