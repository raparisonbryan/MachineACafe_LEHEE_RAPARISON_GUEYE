import { Pièce } from "../src/Pièce";
import "./utilities/HardwareMatchers";
import { MachineACaféBuilder } from "./utilities/MachineACaféBuilder";

describe("MVP", () => {
    test("Cas 2 cafés", () => {
        // ETANT DONNE une machine a café
        const machineACafe = MachineACaféBuilder.ParDéfaut();

        // QUAND on insère 50cts, 2 fois
        machineACafe.SimulerInsertionPièce(Pièce.CinquanteCentimes);
        machineACafe.SimulerInsertionPièce(Pièce.CinquanteCentimes);

        // ALORS il a été demandé au hardware de servir deux cafés
        expect(machineACafe).xCafésSontServis(2);

        // ET l'argent est encaissé
        expect(machineACafe.CountCollectedMoney()).toEqual(
            Pièce.UnEuro.getMontant()
        );
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
        const machineACafe = MachineACaféBuilder.ParDéfaut();

        // QUAND on insère la pièce
        machineACafe.SimulerInsertionPièce(pièce);

        // ALORS il n'a pas été demandé au hardware de servir un café
        expect(machineACafe).aucunCaféNEstServi();

        // ET l'argent n'est pas encaissé
        expect(machineACafe.CountStoredMoney()).toEqual(pièce.getMontant());
    });

    test.each([Pièce.CinquanteCentimes, Pièce.UnEuro, Pièce.DeuxEuros])(
        "Cas nominal : %s",
        (pièce: Pièce) => {
            // ETANT DONNE une machine a café
            // ET une pièce d'une valeur supérieure à 50cts
            const machineACafe = MachineACaféBuilder.ParDéfaut();

            // QUAND on insère la pièce
            machineACafe.SimulerInsertionPièce(pièce);

            // ALORS il a été demandé au hardware de servir un café
            expect(machineACafe).unCaféEstServi();

            // ET l'argent est encaissé
            expect(machineACafe.CountCollectedMoney()).toEqual(
                Pièce.CinquanteCentimes.getMontant()
            );

            // ET l'argent encaissé est remis à zéro
            expect(machineACafe.CountStoredMoney()).toEqual(0);

            // ET l'argent remboursé est remis au user
            expect(machineACafe.CountRefundedMoney()).toEqual(
                pièce.getMontant() - Pièce.CinquanteCentimes.getMontant()
            );
        }
    );

    test("Cas pièce invalide", () => {
        // ETANT DONNE une machine a café
        const machineACafe = MachineACaféBuilder.ParDéfaut();

        // ET une pièce invalizde
        const insertFalsyCoin = () => {
            machineACafe.SimulerInsertionPièce(Pièce.DummyPiece);
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
            const machineACafe = MachineACaféBuilder.ParDéfaut();

            // QUAND on insère les pièces
            [pièce, pièce2].forEach((coin) =>
                machineACafe.SimulerInsertionPièce(coin)
            );

            // ALORS il n'a pas été demandé au hardware de servir un café
            expect(machineACafe).aucunCaféNEstServi();

            // ET l'argent est dans le monnayeur
            expect(machineACafe.CountStoredMoney()).toEqual(
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
            const machineACafe = MachineACaféBuilder.ParDéfaut();

            // QUAND on insère les pièces
            [pièce, pièce2].forEach((coin) =>
                machineACafe.SimulerInsertionPièce(coin)
            );

            // QUAND on récupère sa monnaie
            machineACafe.FlushStoredMoney();

            // ALORS il n'a pas été demandé au hardware de servir un café
            expect(machineACafe).aucunCaféNEstServi();

            // ET l'argent n'est pas encaissé
            expect(machineACafe.CountStoredMoney()).toEqual(0);

            // ET argent remboursé est égal à la somme des pièces insérées
            expect(machineACafe.CountRefundedMoney()).toEqual(
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
        const machineACafe = MachineACaféBuilder.ParDéfaut();

        // QUAND on insère les pièces
        [pièce, pièce2].forEach((coin) =>
            machineACafe.SimulerInsertionPièce(coin)
        );

        // ALORS il n'a pas été demandé au hardware de servir un café
        expect(machineACafe).unCaféEstServi();

        // ET l'argent est encaissé
        expect(machineACafe.CountCollectedMoney()).toEqual(
            Pièce.CinquanteCentimes.getMontant()
        );

        // ET argent remboursé est égal à la difference entre argent inséré et prix café
        expect(machineACafe.CountRefundedMoney()).toEqual(
            pièce.getMontant() +
                pièce2.getMontant() -
                Pièce.CinquanteCentimes.getMontant()
        );
    });
});

describe("Cas Flush money", () => {
    test.each([Pièce.UnCentime, Pièce.DeuxCentimes])(
        "Cas pas assez argent ET récupère sa monnaie : %s",
        (pièce: Pièce) => {
            // ETANT DONNE une machine a café
            // ET une pièce d'une valeur inférieure 50cts
            const machineACafe = MachineACaféBuilder.ParDéfaut();

            // QUAND on insère la pièce
            machineACafe.SimulerInsertionPièce(pièce);

            // QUAND on récupère sa monnaie
            machineACafe.FlushStoredMoney();

            // ALORS il n'a pas été demandé au hardware de servir un café
            expect(machineACafe).aucunCaféNEstServi();

            // ET l'argent a été rendu
            expect(machineACafe.CountRefundedMoney()).toEqual(
                pièce.getMontant()
            );
        }
    );
});

describe("Cas 5 pièces", () => {
    test("Cas 5 pièces 10cts", () => {
        // ETANT DONNE une machine a café
        const machineACafe = MachineACaféBuilder.ParDéfaut();

        // QUAND on insère 5 pièces de 10cts
        for (let i = 0; i < 5; i++) {
            machineACafe.SimulerInsertionPièce(Pièce.DixCentimes);
        }

        // ALORS il a été demandé au hardware de servir un café
        expect(machineACafe).unCaféEstServi();

        // ET l'argent est encaissé
        expect(machineACafe.CountCollectedMoney()).toEqual(
            Pièce.CinquanteCentimes.getMontant()
        );

        // ET l'argent encaissé est remis à zéro
        expect(machineACafe.CountStoredMoney()).toEqual(0);
    });

    test("Cas 4 pieces 10cts et 1 de 2 euros et REMBOURSEMENT DU RESTE", () => {
        // ETANT DONNE une machine a café
        const machineACafe = MachineACaféBuilder.ParDéfaut();
        const coinsInserted = [
            Pièce.DixCentimes,
            Pièce.DixCentimes,
            Pièce.DixCentimes,
            Pièce.DixCentimes,
            Pièce.DeuxEuros,
        ];
        const coinValuesInserted = coinsInserted
            .map((coin) => coin.getMontant())
            .reduce((a, b) => a + b, 0);

        // QUAND on insère 5 pièces de 10cts
        coinsInserted.forEach((coin) =>
            machineACafe.SimulerInsertionPièce(coin)
        );

        // ALORS il a été demandé au hardware de servir un café
        expect(machineACafe).unCaféEstServi();

        // ET l'argent est encaissé
        expect(machineACafe.CountCollectedMoney()).toEqual(
            Pièce.CinquanteCentimes.getMontant()
        );

        // ET il argent remboursé du reste
        expect(machineACafe.CountRefundedMoney()).toEqual(
            coinValuesInserted - Pièce.CinquanteCentimes.getMontant()
        );
    });

    test("Cas 5 pices et total < 50cts donc remboursement", () => {
        // ETANT DONNE une machine a café
        const machineACafe = MachineACaféBuilder.ParDéfaut();

        const coinsInserted = Array(5).fill(Pièce.CinqCentimes);
        const coinValuesInserted = coinsInserted
            .map((coin) => coin.getMontant())
            .reduce((a, b) => a + b, 0);

        // QUAND on insère 5 pièces de 5cts
        coinsInserted.forEach((coin) =>
            machineACafe.SimulerInsertionPièce(coin)
        );

        // ALORS aucun café n'est servi
        expect(machineACafe).aucunCaféNEstServi();

        // ET pas d'argent encaissé
        expect(machineACafe.CountCollectedMoney()).toEqual(0);

        // ET argent remboursé égal 5 pièces insérées
        expect(machineACafe.CountRefundedMoney()).toEqual(coinValuesInserted);
    });
});
