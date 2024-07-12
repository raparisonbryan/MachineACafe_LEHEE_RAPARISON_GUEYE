import { HardwareFake } from "../test/utilities/HardwareFake";
import { Pièce } from "./Pièce";
import { HardwareInterface } from "./hardware/hardware.interface";

export class MachineACafé {
  private readonly _hardware: HardwareInterface;
  private static readonly PrixDuCafé = Pièce.CinquanteCentimes;

  private _storedMoney: number = 0;
  private _collectedMoney: number = 0;
  private _refundedMoney: number = 0;

  constructor(hardware: HardwareInterface) {
    hardware.RegisterMoneyInsertedCallback((montant: number) => {
      this.insérer(Pièce.Parse(montant));
    });
    this._hardware = hardware;

  }

  // inserer une piece dans la machine
  /*    private insérer(pièce: Pièce) {
        this._hardware.CollectStoredMoney(pièce.getMontant());

        if (
            this._hardware.CountStoredMoney() >=
            MachineACafé.PrixDuCafé.getMontant()
        ) {
            this._hardware.RefundMoneyGreaterThanCoffeePrice();

            this._hardware.MakeACoffee();
        }
    }
*/

  private insérer(pièce: Pièce) {
    this._storedMoney += pièce.getMontant();


    if (
      this.pieceInserer() ||
      this._storedMoney >= MachineACafé.PrixDuCafé.getMontant()
    ) {
      this._hardware.DropCashback(this._storedMoney);
      this._refundedMoney =
        this._storedMoney - MachineACafé.PrixDuCafé.getMontant();
      this._hardware.MakeACoffee();
    } else {
      if (!this.pieceInserer()) {
        this._hardware.FlushStoredMoney();
      }
    }
  }

  /*
   * si piece mise dans la machine est >= a 5 piece
   */
  private pieceInserer(): boolean {
    if (
      (this._hardware.CountInvocationsMakeACoffee() >= 5 &&
        this._storedMoney >= MachineACafé.PrixDuCafé.getMontant()) ||
      (this._hardware.CountInvocationsMakeACoffee() < 5 &&
        this._storedMoney >= MachineACafé.PrixDuCafé.getMontant())
    ) {
      return true;
    }

    return false;
  }

  //
}
