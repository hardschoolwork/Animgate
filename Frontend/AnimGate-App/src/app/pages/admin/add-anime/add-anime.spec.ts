import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAnime } from './add-anime';

describe('AddAnime', () => {
  let component: AddAnime;
  let fixture: ComponentFixture<AddAnime>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAnime],
    }).compileComponents();

    fixture = TestBed.createComponent(AddAnime);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
