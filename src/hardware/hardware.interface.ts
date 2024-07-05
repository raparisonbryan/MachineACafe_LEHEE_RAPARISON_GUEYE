export interface HardwareInterface {
    /**
     * Demande à la machine de faire couler un café
     * @return True si aucun problème, False si défaillance
     */
    MakeACoffee(argentEncaisse: number): boolean;

    /**
     * Enregistre un callback, qui sera appelé lors de l'insertion d'une pièce reconnue valide
     * @param callback prend un unique paramètre où sera injecté la valeur de la pièce détectée
     */
    RegisterMoneyInsertedCallback(callback: (coinValue: number) => void): void;

    /**
     * Vide le monnayeur et rend l'argent
     */
    FlushStoredMoney(): void;

    /**
     * Vide le monnayeur et encaisse l'argent
     */
    CollectCollectedMoney(argentEncaisse: number): number;
}
