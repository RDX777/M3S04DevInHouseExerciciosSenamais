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
});
