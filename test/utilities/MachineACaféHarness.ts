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

    public CountRefundedMoney(): number {
        return this.hardware.CountRefundedMoney();
    }

    public CountStoredMoney(): number {
        return this.hardware.CountStoredMoney();
    }

    public FlushStoredMoney(): void {
        return this.hardware.FlushStoredMoney();
    }

    public CollectCollectedMoney(argentEncaisse: number): number {
        return this.hardware.CollectCollectedMoney();
    }

    public CollectStoredMoney(storedMoney: number): number {
        return this.hardware.CollectStoredMoney(storedMoney);
    }

    public RefundMoneyGreaterThanCoffeePrice():  void {
        return this.hardware.RefundMoneyGreaterThanCoffeePrice();
    }
}
