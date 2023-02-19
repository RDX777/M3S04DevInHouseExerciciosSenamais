import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { StateService } from 'src/modules/states/services/state.service';
import { TestCityStatic } from 'src/utils/tests-city';
import { CityService } from '../services/city.service';
import { CityController } from './city.controller';
import { CreateCityDto } from '../dto/create-city.dto';

describe('CityController', () => {
  let cityController: CityController;

  const mockService = {
    findById: jest.fn(),
    createCity: jest.fn(),
    updateCity: jest.fn(),
    deleteById: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CityController],
      providers: [
        { provide: CityService, useValue: mockService },
        { provide: StateService, useValue: mockService },
      ],
    }).compile();

    cityController = module.get<CityController>(CityController);
  });

  beforeEach(() => {
    mockService.findById.mockReset();
    mockService.createCity.mockReset();
    mockService.updateCity.mockReset();
    mockService.deleteById.mockReset();
  });

  it('deveria estar definido', () => {
    expect(cityController).toBeDefined();
  });

  describe('getById', () => {
    it('deveria retornar o resultado da busca e devolver um registro de dados da cidade', async () => {
      const city = TestCityStatic.cityData();
      mockService.findById.mockReturnValue(city);
      const foundCity = await cityController.getById(city.id);
      expect(foundCity).toMatchObject({ id: city.id });
      expect(mockService.findById).toHaveBeenCalledTimes(1);
    });

    it('deveria retornar uma exceção, pois o id param enviado não é um numérico', async () => {
      const anyValue = 'anyValue' as unknown as number;
      await cityController.getById(anyValue).catch((error: Error) => {
        expect(error).toMatchObject({
          message: 'FieldMustBeNumber',
        });
        expect(error).toBeInstanceOf(BadRequestException);
      });
    });
  });

  describe('createCity', () => {
    it('deve criar uma nova cidade', async () => {
      const newCity = TestCityStatic.cityDto();
      const result = mockService.createCity(TestCityStatic.cityData());
      const createdCity = await cityController.createCity(newCity);
      expect(createdCity).toEqual(result);
    });

    it('deveria retornar uma exceção, caso algum campo do body for nulo', async () => {
      const anyValue = 'anyValue' as unknown as CreateCityDto;
      await cityController.createCity(anyValue).catch((error: Error) => {
        expect(error).toBeInstanceOf(BadRequestException);
      });
    });
  });

  describe('updateCity', () => {
    it('deve atualizar uma cidade', async () => {
      const id = 1;
      const city = TestCityStatic.updateCityDto();
      const updatedCity = TestCityStatic.updatedCityData();

      const result = mockService.updateCity(id, updatedCity);

      const newCity = await cityController.updateCity(id, city);
      expect(newCity).toEqual(result);
    });

    it('deveria retornar uma exceção, caso id seja nulo', async () => {
      const anyValue = 'anyValue' as unknown as number;
      const city = TestCityStatic.updateCityDto();
      await cityController.updateCity(anyValue, city).catch((error: Error) => {
        expect(error).toBeInstanceOf(BadRequestException);
      });
    });
  });

  describe('deleteById', () => {
    it('deve deletar uma cidade', async () => {
      const id = 1;

      const result = mockService.deleteById(id);

      const deletedCity = await cityController.deleteById(id);
      expect(deletedCity).toEqual(result);
    });

    it('deveria retornar uma exceção, caso id seja nulo', async () => {
      const anyValue = 'anyValue' as unknown as number;
      await cityController.deleteById(anyValue).catch((error: Error) => {
        expect(error).toBeInstanceOf(BadRequestException);
      });
    });
  });
});
