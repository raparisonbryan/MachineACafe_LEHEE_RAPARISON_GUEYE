import { HardwareFake } from "../test/utilities/HardwareFake";
import { Pièce } from "./Pièce";
import { HardwareInterface } from "./hardware/hardware.interface";

export class MachineACafé {
  private readonly _hardware: HardwareInterface;
  private static readonly PrixDuCafé = Pièce.CinquanteCentimes;

    private _storedMoney: number = 0;
    private _collectedMoney: number = 0;
    private _refundedMoney: number = 0;
    private _coinsInserted: number = 0;

    constructor(hardware: HardwareInterface) {
        hardware.RegisterMoneyInsertedCallback((montant: number) => {
            this.insérer(Pièce.Parse(montant));
        });

  constructor(hardware: HardwareInterface) {
    hardware.RegisterMoneyInsertedCallback((montant: number) => {
      this.insérer(Pièce.Parse(montant));
    });
    this._hardware = hardware;

    private insérer(pièce: Pièce) {
        this.CollectStoredMoney(pièce.getMontant());

        if (this.CountStoredMoney() >= MachineACafé.PrixDuCafé.getMontant()) {
            this.RefundMoneyGreaterThanCoffeePrice();

            this._hardware.MakeACoffee();
            this.CollectCollectedMoney();
        }
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
