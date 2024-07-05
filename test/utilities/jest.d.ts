declare global {
    namespace jest {
        interface Matchers<R> {
            xCafésSontServis(expected: number): R
            aucunCaféNEstServi(): R
            unCaféEstServi(): R
        }
    }
}

export {};
