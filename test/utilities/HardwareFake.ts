import { CoinCodes, HardwareInterface } from "../../src/hardware/hardware.interface";
import { Pièce } from "../../src/Pièce";
import { HardwareDummy } from "./HardwareDummy";

export interface HardwareFakeInterface extends HardwareInterface {
    SimulerInsertionPièce(pièce: Pièce): void;
    CountInvocationsMakeACoffee(): number;
}

export class HardwareFake extends HardwareDummy {
    private _moneyInsertedCallback: (coinValue: number) => void = () => {};
    private _invocationsMakeACoffee: number = 0;

    MakeACoffee(): boolean {
        this._invocationsMakeACoffee++;
        return true;
    }

  public SimulerInsertionPièce(pièce: Pièce): void {
    this._moneyInsertedCallback(pièce.getMontant());
  }

  public CountInvocationsMakeACoffee() {
    return this._invocationsMakeACoffee;
  }

    public CountInvocationsMakeACoffee(): number {
        return this._invocationsMakeACoffee;
    }

    public FlushStoredMoney(): void {
        this._invocationsMakeACoffee = 0;
    }
}
