import { Pièce } from "./Pièce";
import { HardwareInterface } from "./hardware/hardware.interface";

export class MachineACafé {
    private readonly _hardware: HardwareInterface;
    private static readonly PrixDuCafé = Pièce.CinquanteCentimes;

    constructor(hardware: HardwareInterface) {
        hardware.RegisterMoneyInsertedCallback((montant: number) => {
            this.insérer(Pièce.Parse(montant));
        });

        this._hardware = hardware;
    }

    private insérer(pièce: Pièce) {
        this._hardware.CollectStoredMoney(pièce.getMontant());

        if (
            this._hardware.CountStoredMoney() >=
            MachineACafé.PrixDuCafé.getMontant()
        ) {
            this._hardware.RefundMoneyGreaterThanCoffeePrice();

            this._hardware.MakeACoffee();
        }
    }
}
