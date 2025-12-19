import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';

@ApiTags('search')
@Controller('search/')
export class SearchController {}
