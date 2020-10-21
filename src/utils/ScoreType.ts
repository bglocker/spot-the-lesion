export default class ScoreType {
  private readonly user: string;

  private readonly rank: number;

  private readonly score: number;

  constructor(rank: number, user: string, score: number) {
    this.user = user;
    this.rank = rank;
    this.score = score;
  }

  public getUser(): string {
    return this.user;
  }

  public getRank(): number {
    return this.rank;
  }

  public getScore(): number {
    return this.score;
  }
}
