import { MachineACafé } from "../src/MachineACafé";
import { Pièce } from "../src/Pièce";
import { HardwareFake } from "./utilities/HardwareFake";
import "./utilities/HardwareMatchers";

describe("MVP", () => {
    test("Cas 2 cafés", () => {
        // ETANT DONNE une machine a café
        let hardware = new HardwareFake();
        new MachineACafé(hardware);

        // QUAND on insère 50cts, 2 fois
        hardware.SimulerInsertionPièce(Pièce.CinquanteCentimes);
        hardware.SimulerInsertionPièce(Pièce.CinquanteCentimes);

        // ALORS il a été demandé au hardware de servir deux cafés
        expect(hardware).xCafésSontServis(2);

        console.log(
            "hardware.CountStoredMoney()",
            hardware.CountCollectedMoney()
        );

        // ET l'argent est encaissé
        expect(hardware.CountCollectedMoney()).toEqual(100);
    });

    test.each([
        Pièce.UnCentime,
        Pièce.DeuxCentimes,
        Pièce.CinqCentimes,
        Pièce.DixCentimes,
        Pièce.VingtCentimes,
    ])("Cas pas assez argent : %s", (pièce: Pièce) => {
        // ETANT DONNE une machine a café
        // ET une pièce d'une valeur inférieure 50cts
        let hardware = new HardwareFake();
        let machineACafé = new MachineACafé(hardware);

        // QUAND on insère la pièce
        hardware.SimulerInsertionPièce(pièce);

        // ALORS il n'a pas été demandé au hardware de servir un café
        expect(hardware).aucunCaféNEstServi();

        // ET l'argent n'est pas encaissé
        expect(machineACafé.argentEncaisséEnCentimes).toEqual(
            pièce.getMontant()
        );
    });

    test.each([Pièce.CinquanteCentimes, Pièce.UnEuro, Pièce.DeuxEuros])(
        "Cas nominal : %s",
        (pièce: Pièce) => {
            // ETANT DONNE une machine a café
            // ET une pièce d'une valeur supérieure à 50cts
            let hardware = new HardwareFake();
            let machineACafé = new MachineACafé(hardware);

            // QUAND on insère la pièce
            hardware.SimulerInsertionPièce(pièce);

            // ALORS il a été demandé au hardware de servir un café
            expect(hardware).unCaféEstServi();

            // ET l'argent est encaissé
            expect(hardware.CountCollectedMoney()).toEqual(pièce.getMontant());

            // ET l'argent encaissé est remis à zéro
            expect(machineACafé.argentEncaisséEnCentimes).toEqual(0);
        }
    );
});

describe("Plusieurs pièces", () => {
    test.each([
        [Pièce.DeuxCentimes, Pièce.DixCentimes],
        [Pièce.DeuxCentimes, Pièce.VingtCentimes],
        [Pièce.DeuxCentimes, Pièce.CinqCentimes],
        [Pièce.DeuxCentimes, Pièce.UnCentime],
    ])(
        "Cas multiple pièces DANS MONAYEUR INFERIEUR PRIX CAFE : %s",
        (pièce: Pièce, pièce2: Pièce) => {
            // ETANT DONNE une machine a café
            // ET une pièce d'une valeur inférieure 50cts
            let hardware = new HardwareFake();
            let machineACafé = new MachineACafé(hardware);

            // QUAND on insère la pièce
            hardware.SimulerInsertionPièce([pièce, pièce2]);

            // ALORS il n'a pas été demandé au hardware de servir un café
            expect(hardware).aucunCaféNEstServi();

            // ET l'argent est dans le monnayeur
            expect(machineACafé.argentEncaisséEnCentimes).toEqual(
                pièce.getMontant() + pièce2.getMontant()
            );
        }
    );

    test.each([
        [Pièce.DeuxCentimes, Pièce.DixCentimes],
        [Pièce.DeuxCentimes, Pièce.VingtCentimes],
        [Pièce.DeuxCentimes, Pièce.CinqCentimes],
        [Pièce.DeuxCentimes, Pièce.UnCentime],
    ])(
        "Cas multiple pièces REMBOURSEMENT : %s",
        (pièce: Pièce, pièce2: Pièce) => {
            // ETANT DONNE une machine a café
            // ET double de valeur définie
            let hardware = new HardwareFake();
            let machineACafé = new MachineACafé(hardware);

            // QUAND on insère la pièce
            hardware.SimulerInsertionPièce([pièce, pièce2]);

            // QUAND on récupère sa monnaie
            hardware.FlushStoredMoney();

            // ALORS il n'a pas été demandé au hardware de servir un café
            expect(hardware).aucunCaféNEstServi();

            // ET l'argent n'est pas encaissé
            expect(hardware.CountStoredMoney()).toEqual(0);
            expect(machineACafé.argentEncaisséEnCentimes).toEqual(
                pièce.getMontant() + pièce2.getMontant()
            );
        }
    );

    test.each([
        [Pièce.VingtCentimes, Pièce.UnEuro],
        [Pièce.DeuxCentimes, Pièce.DeuxEuros],
        [Pièce.VingtCentimes, Pièce.DeuxEuros],
    ])("Cas multiple pièces CAFE SERVI : %s", (pièce: Pièce, pièce2: Pièce) => {
        // ETANT DONNE une machine a café
        // ET double de valeur définie
        let hardware = new HardwareFake();
        new MachineACafé(hardware);

        // QUAND on insère la pièce
        hardware.SimulerInsertionPièce([pièce, pièce2]);

        // ALORS il n'a pas été demandé au hardware de servir un café
        expect(hardware).unCaféEstServi();

        // ET l'argent est encaissé
        expect(hardware.CountCollectedMoney()).toEqual(
            pièce.getMontant() + pièce2.getMontant()
        );
        expect(hardware.CountStoredMoney()).toEqual(0);
    });
});

describe("Cas Flush money", () => {
    test.each([Pièce.UnCentime, Pièce.DeuxCentimes])(
        "Cas pas assez argent ET récupère sa monnaie : %s",
        (pièce: Pièce) => {
            // ETANT DONNE une machine a café
            // ET une pièce d'une valeur inférieure 50cts
            let hardware = new HardwareFake();
            new MachineACafé(hardware);

            // QUAND on insère la pièce
            hardware.SimulerInsertionPièce(pièce);

            // QUAND on récupère sa monnaie
            hardware.FlushStoredMoney();

            // ALORS il n'a pas été demandé au hardware de servir un café
            expect(hardware).aucunCaféNEstServi();

            // ET l'argent a été rendu
            expect(hardware.CountStoredMoney()).toEqual(0);
        }
    );
});

// TEST throw erreur quand piece inconnue

// TEST underpayment with exeactly 5 coins and automatic refund

// TEST 5 coins with exact payment

// TEST total fait plus de 50cts sors 1 café mais pas remboursement si FLUSH


