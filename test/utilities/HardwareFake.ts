import { HardwareInterface } from "../../src/hardware/hardware.interface";
import { Pièce } from "../../src/Pièce";

export class HardwareFake implements HardwareInterface {
    private _moneyInsertedCallback: (coinValue: number) => void = () => {};
    private _invocationsMakeACoffee: number = 0;
    private _storedMoney: number = 0;
    private _collectedMoney: number = 0;
    private _refundedMoney: number = 0;
    private _coinsInserted: number = 0;

    MakeACoffee(): boolean {
        this._invocationsMakeACoffee++;
        this.CollectCollectedMoney();

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

    public CountRefundedMoney(): number {
        return this._refundedMoney;
    }

    public FlushStoredMoney(): void {
        if (this._storedMoney >= Pièce.CinquanteCentimes.getMontant()) return;

        this.RefundMoneyLessThanCoffeePrice();
        this._storedMoney = 0;
    }

    private RefundMoneyLessThanCoffeePrice(): void {
        this._refundedMoney = this._storedMoney;

        this._storedMoney = 0;
        this._coinsInserted = 0;
    }

    public RefundMoneyGreaterThanCoffeePrice(): void {
        if (this._storedMoney < Pièce.CinquanteCentimes.getMontant()) return;

        this._refundedMoney =
            this._storedMoney - Pièce.CinquanteCentimes.getMontant();
    }

    public CollectStoredMoney(storedMoney: number): number {
        this._storedMoney += storedMoney;

        this.CollecCoinsInserted();

        return this._storedMoney;
    }

    private CollecCoinsInserted(): void {
        this._coinsInserted++;

        if (
            this._coinsInserted >= 5 &&
            this._storedMoney < Pièce.CinquanteCentimes.getMontant()
        ) {
            this.RefundMoneyLessThanCoffeePrice();
            
        }
    }

    public CollectCollectedMoney(): number {
        this._storedMoney -= this._refundedMoney;

        this._collectedMoney += this._storedMoney;

        this._storedMoney = 0;
        this._coinsInserted = 0;

        return this._collectedMoney;
    }
}
