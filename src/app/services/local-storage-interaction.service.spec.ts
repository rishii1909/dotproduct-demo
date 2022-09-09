import { TestBed } from '@angular/core/testing';

import { LocalStorageInteractionService } from './local-storage-interaction.service';

describe('LocalStorageInteractionService', () => {
  let service: LocalStorageInteractionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageInteractionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
