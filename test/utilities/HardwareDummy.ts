import { Pièce } from "../../src/Pièce";
import { ButtonCodes, CoinCodes } from "../../src/hardware/hardware.interface";
import { HardwareFakeInterface } from "./HardwareFake";

export class HardwareDummy implements HardwareFakeInterface {
    DropCashback(coin_code: CoinCodes): boolean {
        throw new Error("Method not implemented.");
    }
    SimulerInsertionPièce(pièce: Pièce): void {
        throw new Error("Method not implemented.");
    }
    CountInvocationsMakeACoffee(): number {
        throw new Error("Method not implemented.");
    }
    RegisterMoneyInsertedCallback(
        callback: (coinValue: CoinCodes) => void
    ): void {
        throw new Error("Method not implemented.");
    }
    FlushStoredMoney(): void {
        throw new Error("Method not implemented.");
    }
    CollectStoredMoney(): void {
        throw new Error("Method not implemented.");
    }
    RegisterButtonPressedCallback(
        callback: (buttonCode: ButtonCodes) => void
    ): void {
        throw new Error("Method not implemented.");
    }
    MakeACoffee(): boolean {
        throw new Error("Method not implemented.");
    }
}
