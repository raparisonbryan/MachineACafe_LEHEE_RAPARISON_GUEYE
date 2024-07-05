import { HardwareInterface } from "../../src/hardware/hardware.interface";
import { Pièce } from "../../src/Pièce";

export class HardwareFake implements HardwareInterface {
    private _moneyInsertedCallback: (coinValue: number) => void = () => {};
    private _invocationsMakeACoffee: number = 0;
    private _storedMoney: number = 0;
    private _collectedMoney: number = 0;

    MakeACoffee(argentEncaisse: number): boolean {
        this._invocationsMakeACoffee++;
        this.CollectCollectedMoney(argentEncaisse);

        return true;
    }

    RegisterMoneyInsertedCallback(callback: (coinValue: number) => void): void {
        this._moneyInsertedCallback = callback;
    }

    public SimulerInsertionPièce(pièce: Pièce | Pièce[]): void {
        if (pièce instanceof Array) {
            for (let i = 0; i < pièce.length; i++) {
                this._moneyInsertedCallback(pièce[i].getMontant());
            }
            return;
        }

        this._moneyInsertedCallback(pièce.getMontant());
    }

    public CountInvocationsMakeACoffee() {
        return this._invocationsMakeACoffee;
    }

    public CountCollectedMoney(): number {
        return this._collectedMoney;
    }

    public CountStoredMoney(): number {
        return this._storedMoney;
    }

    public FlushStoredMoney(): number {
        this._storedMoney = 0;
        return this._storedMoney;
    }

    public CollectCollectedMoney(argentEncaisse: number): number {
        this._storedMoney = 0;
        this._collectedMoney += argentEncaisse;

        return this._collectedMoney;
    }
}
