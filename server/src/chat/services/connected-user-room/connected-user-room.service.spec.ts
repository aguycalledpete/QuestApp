import { Test, TestingModule } from '@nestjs/testing';
import { ConnectedUserRoomService } from './connected-user-room.service';

describe('ConnectedUserRoomService', () => {
  let service: ConnectedUserRoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConnectedUserRoomService],
    }).compile();

    service = module.get<ConnectedUserRoomService>(ConnectedUserRoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
