export default class ScoreType {
  private readonly user: string;

  private readonly rank: number;

  private readonly score: number;

  private readonly colour: string;

  private readonly medal: boolean;

  constructor(rank: number, user: string, score: number, colour: string, medal: boolean) {
    this.user = user;
    this.rank = rank;
    this.score = score;
    this.colour = colour;
    this.medal = medal;
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

  public getMedal(): boolean {
    return this.medal;
  }
}
