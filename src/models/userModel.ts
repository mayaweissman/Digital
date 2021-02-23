export class UserModel {
  public constructor(
    public userId?: number,
    public username?: string,
    public phoneNumber?: number,
    public permission?: string
  ) {}
}
