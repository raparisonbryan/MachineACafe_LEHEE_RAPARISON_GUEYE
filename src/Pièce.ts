export class Pièce {
    static DeuxEuros: Pièce = new Pièce(200);
    static UnEuro: Pièce = new Pièce(100);
    static CinquanteCentimes: Pièce = new Pièce(50);
    static VingtCentimes: Pièce = new Pièce(20);
    static DixCentimes: Pièce = new Pièce(10);
    static CinqCentimes: Pièce = new Pièce(5);
    static DeuxCentimes: Pièce = new Pièce(2);
    static UnCentime: Pièce = new Pièce(1);
    private readonly _montant: number;

    getMontant() : number {
        return this._montant;
    }

    private constructor(montant: number) {
        this._montant = montant;
    }

    EstInférieureA(comparée: Pièce) {
        return this._montant < comparée._montant;
    }

    public toString(){
        return this._montant.toString() + 'cts';
    }

    static Parse(montant: number) {
        switch (montant) {
            case 1:
                return Pièce.UnCentime
            case 2:
                return Pièce.DeuxCentimes
            case 5:
                return Pièce.CinqCentimes
            case 10:
                return Pièce.DixCentimes
            case 20:
                return Pièce.VingtCentimes
            case 50:
                return Pièce.CinquanteCentimes
            case 100:
                return Pièce.UnEuro
            case 200:
                return Pièce.DeuxEuros
            default:
                throw new Error()
        }
    }
}