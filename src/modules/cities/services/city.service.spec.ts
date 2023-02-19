import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TestCityStatic } from 'src/utils/tests-city';
import { CityRepository } from '../city.repository';
import { CityService } from './city.service';

describe('countryService', () => {
  let cityService: CityService;
  let cityRepository: CityRepository;

  const mockRepository = {
    getById: jest.fn(),
    createCity: jest.fn(),
    getByName: jest.fn(),
    updateCity: jest.fn(),
    deleteById: jest.fn(),
    deleteCity: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CityService,
        {
          provide: CityRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    cityService = module.get<CityService>(CityService);
    cityRepository = module.get<CityRepository>(CityRepository);
  });

  beforeEach(() => {
    mockRepository.getById.mockReset();
    mockRepository.createCity.mockReset();
    mockRepository.getByName.mockReset();
    mockRepository.updateCity.mockReset();
    mockRepository.deleteById.mockReset();
    mockRepository.deleteCity.mockReset();
  });

  it('deveria ser definido cityService', () => {
    expect(cityService).toBeDefined();
  });

  it('deveria ser definido cityRepository', () => {
    expect(cityRepository).toBeDefined();
  });

  describe('findById', () => {
    it('deveria retornar o objeto country', async () => {
      const city = TestCityStatic.cityData();
      mockRepository.getById.mockReturnValue(city);
      const foundCountry = await cityService.findById(city.id);
      expect(foundCountry).toMatchObject({ id: city.id });
      expect(mockRepository.getById).toHaveBeenCalledTimes(1);
    });

    it('deveria retornar uma excessão devido ao valor enviado', async () => {
      mockRepository.getById.mockReturnValue(null);
      const pathId = 2;
      expect(cityService.findById(pathId)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mockRepository.getById).toHaveBeenCalledTimes(1);
    });
  });

  describe('createCity', () => {
    it('deveria criar uma cidade corretamente', async () => {
      const city = TestCityStatic.cityData();
      const cityDto = TestCityStatic.cityDto();

      mockRepository.getByName.mockReturnValue(null);
      mockRepository.createCity.mockReturnValue(city);

      const saveCity = await cityService.createCity(cityDto);

      expect(saveCity).toMatchObject({
        name: city.name,
        state_id: city.state_id,
      });
      expect(mockRepository.getByName).toHaveBeenCalledTimes(1);
      expect(mockRepository.createCity).toHaveBeenCalledTimes(1);
    });

    it('deveria retornar uma exceção, pois a cidade já existe', async () => {
      const city = TestCityStatic.cityData();
      const cityDto = TestCityStatic.cityDto();

      mockRepository.getByName.mockReturnValue(city);
      await cityService.createCity(cityDto).catch((error: Error) => {
        expect(error).toMatchObject({
          message: 'entityWithArgumentsExists',
        });
        expect(error).toBeInstanceOf(BadRequestException);
      });
      expect(mockRepository.getByName).toHaveBeenCalledTimes(1);
    });

    it('deveria retornar uma exceção, pois houve uma falha ao salvar a cidade', async () => {
      const cityDto = TestCityStatic.cityDto();

      mockRepository.getByName.mockReturnValue(null);
      mockRepository.createCity.mockReturnValue(null);

      await cityService.createCity(cityDto).catch((error: Error) => {
        expect(error).toMatchObject({
          message: 'cityNotSave',
        });
        expect(error).toBeInstanceOf(BadRequestException);
      });
    });
  });

  describe('updateCity', () => {
    it('deveria atualizar uma cidade corretamente', async () => {
      const id = 1;
      const city = TestCityStatic.updateCityDto();
      const updatedCity = TestCityStatic.updatedCityData();

      mockRepository.getById.mockReturnValue(id);
      mockRepository.updateCity.mockReturnValue(updatedCity);

      const saveCity = await cityService.updateCity(id, city);

      expect(saveCity).toMatchObject({
        name: updatedCity.name,
        state_id: updatedCity.state_id,
      });
      expect(mockRepository.getById).toHaveBeenCalledTimes(1);
      expect(mockRepository.updateCity).toHaveBeenCalledTimes(1);
    });

    it('deveria retornar uma exceção, pois a cidade não existe', async () => {
      const id = null;
      const city = TestCityStatic.updateCityDto();

      mockRepository.getById.mockReturnValue(id);
      await cityService.updateCity(id, city).catch((error: Error) => {
        expect(error).toMatchObject({
          message: 'cityNotFound',
        });
        expect(error).toBeInstanceOf(NotFoundException);
      });
      expect(mockRepository.getById).toHaveBeenCalledTimes(1);
    });

    it('deveria retornar uma exceção, pois houve uma falha ao atualizar a cidade', async () => {
      const id = 1;
      const city = TestCityStatic.updateCityDto();

      mockRepository.getById.mockReturnValue(id);
      mockRepository.updateCity.mockReturnValue(null);

      await cityService.updateCity(id, city).catch((error: Error) => {
        expect(error).toMatchObject({
          message: 'cityNotUpdate',
        });
        expect(error).toBeInstanceOf(BadRequestException);
      });
    });
  });

  describe('deleteById', () => {
    it('deveria deletar uma cidade corretamente', async () => {
      const id = 1;

      const founded = mockRepository.getById.mockReturnValue(id);
      mockRepository.deleteCity.mockReturnValue(founded);

      const deletedCity = await cityService.deleteById(id);

      expect(deletedCity).toEqual('Cidade deletada com sucesso');
      expect(mockRepository.getById).toHaveBeenCalledTimes(1);
    });

    it('deveria retornar uma exceção, pois a cidade não existe', async () => {
      const id = null;

      mockRepository.getById.mockReturnValue(id);
      await cityService.deleteById(id).catch((error: Error) => {
        expect(error).toMatchObject({
          message: 'cityNotFound',
        });
        expect(error).toBeInstanceOf(NotFoundException);
      });
      expect(mockRepository.getById).toHaveBeenCalledTimes(1);
    });

    it('deveria retornar uma exceção, pois houve uma falha ao deletar a cidade', async () => {
      const id = 1;

      mockRepository.getById.mockReturnValue(id);
      mockRepository.deleteById.mockReturnValue(null);

      await cityService.deleteById(id).catch((error: Error) => {
        expect(error).toMatchObject({
          message: 'CityNotDelete',
        });
        expect(error).toBeInstanceOf(NotFoundException);
      });
    });
  });
});
