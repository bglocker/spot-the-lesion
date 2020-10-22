export default class ScoreType {
  private readonly user: string;

  private readonly rank: number;

  private readonly score: number;

  private readonly colour: string;

  constructor(rank: number, user: string, score: number, colour: string) {
    this.user = user;
    this.rank = rank;
    this.score = score;
    this.colour = colour;
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

  public getColour(): string {
    return this.colour;
  }
}
