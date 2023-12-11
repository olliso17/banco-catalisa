import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({
        description:"O cpf tem que ter no mínimo 11 caracteres numéricos e tem que ser único",
        example:"02364912680"
    })

    cpf:string;

    @ApiProperty({
        description:"O password só aceita caracteres numéricos e no mínimo 4",
        example:"4321"
        
    })
    password: string;

    active?: boolean;
}
