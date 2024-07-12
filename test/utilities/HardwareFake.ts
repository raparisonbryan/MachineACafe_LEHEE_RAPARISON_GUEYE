import { CoinCodes, HardwareInterface } from "../../src/hardware/hardware.interface";
import { Pièce } from "../../src/Pièce";

export class HardwareFake implements HardwareInterface {
  private _moneyInsertedCallback: (coinValue: number) => void = () => {};
  private _invocationsMakeACoffee: number = 0;
  protected _storedMoney: number = 0;
  protected _collectedMoney: number = 0;
  protected _refundedMoney: number = 0;

  MakeACoffee(): boolean {
    this._invocationsMakeACoffee++;
    this.CollectStoredMoney();
    return true;
  }

  RegisterMoneyInsertedCallback(callback: (coinValue: number) => void): void {
    this._moneyInsertedCallback = callback;
  }

  public SimulerInsertionPièce(pièce: Pièce): void {
    this._moneyInsertedCallback(pièce.getMontant());
  }

  public CountInvocationsMakeACoffee() {
    return this._invocationsMakeACoffee;
  }


  public FlushStoredMoney(): void {
    if (this._storedMoney >= Pièce.CinquanteCentimes.getMontant()) return;

    this._refundedMoney = this._storedMoney;
    this._storedMoney = 0;
  }

  public CollectStoredMoney(): void {
    this._collectedMoney = Pièce.CinquanteCentimes.getMontant();

    this._invocationsMakeACoffee = 0;
    this._storedMoney = 0;
  }

  DropCashback(coin_code: CoinCodes): boolean {
    if (coin_code <= Pièce.CinquanteCentimes.getMontant()) return false;
    return true;
  }
}
