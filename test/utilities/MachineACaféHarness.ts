import { MachineACafé } from "../../src/MachineACafé";
import { Pièce } from "../../src/Pièce";
import { HardwareFake } from "./HardwareFake";

export class MachineACaféHarness extends MachineACafé {
    private hardware: HardwareFake;

    constructor(hardware: HardwareFake) {
        super(hardware);
        this.hardware = hardware;
    }

    public SimulerInsertionPièce(pièce: Pièce | Pièce[]): void {
        this.hardware.SimulerInsertionPièce(pièce);
    }

    public CountInvocationsMakeACoffee() {
        return this.hardware.CountInvocationsMakeACoffee();
    }

    public CountCollectedMoney(): number {
        return this.hardware.CountCollectedMoney();
    }

    public CountStoredMoney(): number {
        return this.hardware.CountStoredMoney();
    }

    public FlushStoredMoney(): number {
        return this.hardware.FlushStoredMoney();
    }

    public CollectCollectedMoney(argentEncaisse: number): number {
        return this.hardware.CollectCollectedMoney(argentEncaisse);
    }
}
