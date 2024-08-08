import { useRef } from "react"

export const useStoreState = <T>(initialValue: T, setState: React.Dispatch<React.SetStateAction<T>>) => {
    const prevState = useRef<T>(initialValue)

    const storeState = (data: (["value", T] | ["operation", ((input: T) => T)])) => {
        const [method, input] = data

        if (method === "value") {
            prevState.current = input
        }
        else {
            prevState.current = input(prevState.current)
        }
        
        setState(prevState.current)
        return prevState.current
    }

    return storeState
}