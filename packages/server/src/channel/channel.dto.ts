export interface GetServerChannelsDto {
  serverId: number;
}

export interface GetChannelMessageDto {
  before: number;
  around: number;
  after: number;
  takeCount: number;
}
