import { expect } from "@jest/globals";
import type { MatcherFunction } from "expect";
import { MachineACaféHarness } from "./MachineACaféHarness";

const aucunCaféNEstServi: MatcherFunction = function (actual: unknown) {
    if (!(actual instanceof MachineACaféHarness))
        throw new Error("Only works with MachineACaféHarness");

    const delta = actual.CountInvocationsMakeACoffee();
    const pass = delta == 0;
    const message = pass
        ? `Au moins un café devait être servi, aucun ne l'a été.`
        : `Aucun café ne devait être servi, ${delta} ont été servis.`;

    return {
        message: () => message,
        pass: pass,
    };
};

const unCaféEstServi: MatcherFunction = function (actual: unknown) {
    if (!(actual instanceof MachineACaféHarness))
        throw new Error("Only works with MachineACaféHarness");

    const delta = actual.CountInvocationsMakeACoffee();
    const pass = delta == 1;
    const message = pass
        ? `Un café devait être servi, ${delta} ne l'a été.`
        : `Zéro ou plusieurs cafés devaient être servis, Un a été servi.`;

    return {
        message: () => message,
        pass: pass,
    };
};

const xCafésSontServis: MatcherFunction<[expected: unknown]> = function (
    actual: unknown,
    expected: unknown
) {
    if (!(actual instanceof MachineACaféHarness))
        throw new Error("Only works with HardwareFake");

    if (!Number.isInteger(expected)) throw new Error("Only works with integer");

    const delta = actual.CountInvocationsMakeACoffee();
    const pass = delta == expected;
    const message = pass
        ? `${expected} cafés devaient être servis, ${delta} l'a été.`
        : `Il était demandé de ne pas service ${expected}, ce fut le cas.`;

    return {
        message: () => message,
        pass: pass,
    };
};

expect.extend({
    aucunCaféNEstServi,
    xCafésSontServis,
    unCaféEstServi,
});
