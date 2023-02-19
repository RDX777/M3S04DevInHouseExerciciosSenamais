import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  ValidationPipe,
  Body,
  UsePipes,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { StateService } from '../../states/services/state.service';
import { CityService } from '../services/city.service';
import axios from 'axios';
import { City } from '../interfaces';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CityEntity } from '../entities/city.entity';
import { ApiResponses } from 'src/utils/decorators';
import { CreateCityDto } from '../dto/create-city.dto';
import { UpdateCityDto } from '../dto/update-city.dto';
import { isNumber } from 'class-validator';

@ApiTags('cities')
@Controller('city')
export class CityController {
  constructor(
    private cityService: CityService,
    private stateService: StateService,
  ) { }

  @Get(':id')
  @UsePipes(new ValidationPipe())
  async getById(@Param('id') id: number): Promise<CityEntity> {
    if (!isNumber(id)) {
      throw new BadRequestException('FieldMustBeNumber');
    }
    return await this.cityService.findById(id);
  }

  @Post('createAllCities')
  async createAllCities(): Promise<string> {
    try {
      const { data } = await axios.get(
        'https://servicodados.ibge.gov.br/api/v1/localidades/municipios',
      );
      const states = await this.stateService.getByAll();

      data.forEach((city: City) => {
        const state = states.find(
          ({ initials }) => city.microrregiao.mesorregiao.UF.sigla === initials,
        );

        const newCity = {
          name: city.nome,
          state_id: state.id,
        };

        this.cityService.createCity(newCity);
      });
      return 'Cidades salvas com sucesso';
    } catch (error) {
      console.log(error);
    }
  }

  @ApiOperation({
    summary: 'city/:id',
    description: 'Este endpoint recebe como param o id e excluí o registro',
  })
  @Delete(':id')
  async deleteById(@Param('id') id: number): Promise<string> {
    return await this.cityService.deleteCity(id);
  }

  @ApiOperation({
    summary: 'city/create',
    description:
      'Este endpoint recebe como body a city para salvar um registro de dados.',
  })
  @Post('create')
  @ApiResponses({ 201: CreateCityDto })
  @UsePipes(new ValidationPipe())
  async createCity(@Body() newCity: CreateCityDto): Promise<CityEntity> {
    return await this.cityService.createCity(newCity);
  }

  @ApiOperation({
    summary: 'city/update/:id',
    description:
      'Este endpoint recebe como body o name como id para atualizar um registro de dados.',
  })
  @Patch('update/:id')
  async updateCity(
    @Param('id') id: number,
    @Body() updateCityDto: UpdateCityDto,
  ): Promise<CityEntity> {
    const cityUpdate = await this.cityService.updateCity(id, updateCityDto);
    return cityUpdate;
  }
}
