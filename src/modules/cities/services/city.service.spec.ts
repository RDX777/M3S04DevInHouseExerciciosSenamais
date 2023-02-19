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
  });

  it('deveria ser definido countryService', () => {
    expect(cityService).toBeDefined();
  });

  it('deveria ser definido countryRepository', () => {
    expect(cityService).toBeDefined();
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
});
