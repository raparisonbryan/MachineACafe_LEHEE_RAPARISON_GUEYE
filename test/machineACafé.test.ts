import { MachineACafé } from "../src/MachineACafé";
import { Pièce } from "../src/Pièce";
import { HardwareFake } from "./utilities/HardwareFake";
import "./utilities/HardwareMatchers";
import { MachineACaféBuilder } from "./utilities/MachineACaféBuilder";

describe("MVP", () => {
    test("Cas 2 cafés", () => {
        // ETANT DONNE une machine a café
 //       let hardware = new HardwareFake();
  //      new MachineACafé(hardware);

        let machineACafe= MachineACaféBuilder.ParDéfaut();

        // QUAND on insère 50cts, 2 fois
        machineACafe.SimulerInsertionPièce(Pièce.CinquanteCentimes);
        machineACafe.SimulerInsertionPièce(Pièce.CinquanteCentimes);

        // ALORS il a été demandé au hardware de servir deux cafés
        expect(machineACafe).xCafésSontServis(2);

        // ET l'argent est encaissé
        expect(machineACafe.CountCollectedMoney()).toEqual(100);
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

    test("Cas pièce invalide", () => {
        // ETANT DONNE une machine a café
        let hardware = new HardwareFake();
        let machineACafé = new MachineACafé(hardware);

        // ET une pièce invalizde
        const insertFalsyCoin = () => {
            hardware.SimulerInsertionPièce(Pièce.DummyPiece);
        };

        expect(insertFalsyCoin).toThrow(Error);
    });
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

describe("Cas 5 pièces", () => {
    test("Cas 5 pièces 10cts", () => {
        // ETANT DONNE une machine a café
        let hardware = new HardwareFake();
        new MachineACafé(hardware);

        // QUAND on insère 5 pièces de 10cts
        for (let i = 0; i < 5; i++) {
            hardware.SimulerInsertionPièce(Pièce.DixCentimes);
        }

        // ALORS il a été demandé au hardware de servir un café
        expect(hardware).unCaféEstServi();

        // ET l'argent est encaissé
        expect(hardware.CountCollectedMoney()).toEqual(50);

        // ET l'argent encaissé est remis à zéro
        expect(hardware.CountStoredMoney()).toEqual(0);
    });

    test("Cas 4 pieces 10cts et 1 de 2 euros et pas de remboursement", () => {
        // ETANT DONNE une machine a café
        let hardware = new HardwareFake();
        new MachineACafé(hardware);

        // QUAND on insère 5 pièces de 10cts
        for (let i = 0; i < 5; i++) {
            if (i < 4) {
                return hardware.SimulerInsertionPièce(Pièce.DixCentimes);
            }

            return hardware.SimulerInsertionPièce(Pièce.UnEuro);
        }

        // ALORS il a été demandé au hardware de servir un café
        expect(hardware).unCaféEstServi();

        // ET l'argent est encaissé
        expect(hardware.CountCollectedMoney()).toEqual(140);

        // ET si je flush
        hardware.FlushStoredMoney();

        // ET il n'y aura pas d'argent remboursé
        expect(hardware.CountStoredMoney()).toEqual(0);
    });

    test("Cas 5 pices et total < 50cts donc remboursement", () => {
        // ETANT DONNE une machine a café
        let hardware = new HardwareFake();
        const machineACafe = new MachineACafé(hardware);

        // QUAND on insère 5 pièces de 5cts
        for (let i = 0; i < 5; i++) {
            hardware.SimulerInsertionPièce(Pièce.CinqCentimes);
        }

        // ALORS aucun café n'est servi
        expect(hardware).aucunCaféNEstServi();

        // ET pas d'argent encaissé
        expect(hardware.CountCollectedMoney()).toEqual(0);

        // ET argent remboursé égal 5 pièces insérées
        expect(machineACafe.argentEncaisséEnCentimes).toEqual(25);
    });
});
