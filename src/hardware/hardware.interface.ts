export interface HardwareInterface {
  /**
   * Demande à la machine de faire couler un café
   * @return True si aucun problème, False si défaillance
   */
  MakeACoffee(): boolean;

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
  CollectStoredMoney(): void;

  CountInvocationsMakeACoffee(): number;

  /**
   * Fait tomber une pièce depuis le stock vers la trappe à monnaie
   * @param coin_code
   * @return True si la pièce était disponible
   * @return False si aucune pièce n'a pu être trouvée avec ce montant
   */
  DropCashback(coin_code: CoinCodes): boolean;
}

export enum CoinCodes {
    ONE_CENT = 1,
    TWO_CENTS = 2,
    FIVE_CENTS = 5,
    TEN_CENTS = 10,
    TWENTY_CENTS = 20,
    FIFTY_CENTS = 50,
    ONE_EURO = 100,
    TWO_EUROS = 200,
}

