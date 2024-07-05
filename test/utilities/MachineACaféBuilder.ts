import {MachineACafé} from "../../src/MachineACafé";
import {HardwareFake} from "./HardwareFake";

export class MachineACaféBuilder {
    public static ParDéfaut() {
        return new MachineACaféBuilder().Build()
    }

    public Build() : MachineACafé {
        return new MachineACafé(new HardwareFake())
    }
}