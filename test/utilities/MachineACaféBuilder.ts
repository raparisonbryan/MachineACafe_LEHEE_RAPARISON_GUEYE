import { HardwareFake } from "./HardwareFake";
import { MachineACaféHarness } from "./MachineACaféHarness";

export class MachineACaféBuilder {
    public static ParDéfaut() {
        return new MachineACaféBuilder().Build();
    }

    private Build(): MachineACaféHarness {
        let hardware = new HardwareFake();
        return new MachineACaféHarness(hardware);
    }
}
