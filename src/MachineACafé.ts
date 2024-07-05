import { Pièce } from "./Pièce";
import { HardwareInterface } from "./hardware/hardware.interface";

export class MachineACafé {
    private readonly _hardware: HardwareInterface;
    private static readonly PrixDuCafé = Pièce.CinquanteCentimes;

    argentEncaisséEnCentimes: number = 0;

    constructor(hardware: HardwareInterface) {
        hardware.RegisterMoneyInsertedCallback((montant: number) => {
            this.insérer(Pièce.Parse(montant));
        });

        this._hardware = hardware;
    }

    private insérer(pièce: Pièce) {
        this.argentEncaisséEnCentimes += pièce.getMontant();

        if (
            this.argentEncaisséEnCentimes >=
            MachineACafé.PrixDuCafé.getMontant()
        ) {
            this._hardware.MakeACoffee(this.argentEncaisséEnCentimes);
            this.argentEncaisséEnCentimes = 0;
        }
    }
}
