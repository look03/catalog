export class RefreshCommand {
  constructor(
    public readonly refreshToken: string,
    public readonly sessionId: string,
  ) {}
}
