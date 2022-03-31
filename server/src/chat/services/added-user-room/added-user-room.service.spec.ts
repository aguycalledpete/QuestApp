import { Test, TestingModule } from '@nestjs/testing';
import { AddedUserRoomService } from './added-user-room.service';

describe('AddedUserRoomService', () => {
  let service: AddedUserRoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddedUserRoomService],
    }).compile();

    service = module.get<AddedUserRoomService>(AddedUserRoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
