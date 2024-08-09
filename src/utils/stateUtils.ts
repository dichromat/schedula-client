import { useRef } from "react"


export function useStoreState<T extends Function>(initialValue: T & Function, setState: React.Dispatch<React.SetStateAction<T>>): ((input: T & Function) => (T & Function));
export function useStoreState<T>(initialValue: T, setState: React.Dispatch<React.SetStateAction<T>>): ((input: T | ((input: T) => T)) => T);
export function useStoreState<T>(initialValue: T, setState: React.Dispatch<React.SetStateAction<T>>) {
    const prevState = useRef<T>(initialValue)

    if (typeof initialValue === 'function') {
        const storeFunctionState = (input: (T & Function)) => {
            prevState.current = input(prevState.current)
            setState(prevState.current)
            return prevState.current
        }
        return storeFunctionState
    }
    else {
        const storeVariableState = (input: T | ((input: T) => T)) => {
            if (typeof input === 'function') {
                prevState.current = (input as (input: T) => T)(prevState.current)
            }
            else {
                prevState.current = input
            }
            
            setState(prevState.current)
            return prevState.current
        }
        return storeVariableState
    }
}