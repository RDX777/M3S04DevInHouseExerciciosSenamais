import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { CreateCityDto } from './dto/create-city.dto';
import { CityEntity } from './entities/city.entity';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class CityRepository extends Repository<CityEntity> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(CityEntity, dataSource.createEntityManager());
  }
  async getById(id: number): Promise<CityEntity> {
    return this.findOne({ where: { id } });
  }

  async getByName(name: string): Promise<CityEntity> {
    return this.findOne({ where: { name } });
  }

  async getByAll(): Promise<CityEntity[]> {
    return this.find();
  }

  async createCity(newCountry: CreateCityDto): Promise<CityEntity> {
    const country = new CityEntity();
    const dataCountry = {
      ...country,
      ...newCountry,
    };

    const countrySave = await this.save(dataCountry);
    return countrySave;
  }

  async deleteCity(city: CityEntity): Promise<boolean> {
    const cityDeleted = await this.delete(city);

    if (cityDeleted) return true;
    return false;
  }

  async updateCity(city: CityEntity): Promise<CityEntity> {
    const cityUpdate = await this.save(city);
    return cityUpdate;
  }
}
