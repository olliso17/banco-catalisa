import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({
        example:UUID,
        description:"O user_id é do tipo string e tem que ser um user válido"
    })
    user_id: string;

    @ApiProperty({
        example: new Date(),
        description:"A data tem que ser a data atual e do tipo Date"
    })
    updated_at: Date;
}
