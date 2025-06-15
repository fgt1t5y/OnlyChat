export interface OpenDMSessionDto {
  userBId: number;
}

export interface CloseDMSessionDto {
  userBId: number;
}

export interface GetDMMessageDto {
  before: number;
  around: number;
  after: number;
  takeCount: number;
}

export interface CreateDMMessageDto {
  content: string;
}
