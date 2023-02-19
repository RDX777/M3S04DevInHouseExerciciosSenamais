/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { CreateCityDto } from 'src/core/dtos';
import { CityEntity } from 'src/modules/cities/entities/city.entity';
import { StateEntity } from 'src/modules/states/entities/state.entity';

export class TestCityStatic {
  static cityData(): CityEntity {
    const city = new CityEntity();
    city.id = 1;
    city.name = 'Cidade 1';
    city.state_id = 1;
    city.state = new StateEntity();
    city.createdAt = new Date();
    city.updatedAt = new Date();
    city.deletedAt = null;

    return city;
  }

  static updatedCityData(): CityEntity {
    const city = new CityEntity();
    city.id = 1;
    city.name = 'Cidade 1 atualizada';
    city.state_id = 2;
    city.state = new StateEntity();
    city.createdAt = new Date();
    city.updatedAt = new Date();
    city.deletedAt = null;

    return city;
  }

  static cityDto(): CreateCityDto {
    const cityBodyDto = new CreateCityDto();
    cityBodyDto.name = 'Cidade 1';
    cityBodyDto.state_id = 1;

    return cityBodyDto;
  }

  static updateCityDto(): CreateCityDto {
    const cityBodyDto = new CreateCityDto();
    cityBodyDto.name = 'Cidade 2';
    cityBodyDto.state_id = 2;

    return cityBodyDto;
  }
}
