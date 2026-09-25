import {
    Observable,
    Unsubscribable,
} from 'rxjs';

type ObservableEntry<T> = [Observable<T>, T | undefined, Unsubscribable | undefined];
type ObservableMap<T> = Map<string, ObservableEntry<T>>;

let registries: Map<string, ValuesRegistry<any>> = new Map<string, ValuesRegistry<any>>();

export class ValuesRegistry<T> {

    private _observables: WeakMap<HTMLElement, ObservableMap<T>> = new WeakMap<HTMLElement, ObservableMap<T>>();

    public has(element: HTMLElement, property: string): boolean {
        return this._observables.has(element) && this._observables.get(element)!.has(property);
    }

    public get(element: HTMLElement, property: string): Observable<T> | undefined {
        return this._observables.get(element)?.get(property)?.[0];
    }

    public set(element: HTMLElement, property: string, observable: Observable<T>, initial?: T): void {
        this.delete(element, property);

        if (!this._observables.has(element)) {
            this._observables.set(element, new Map<string, ObservableEntry<T>>());
        }

        this._observables.get(element)!.set(property, [observable, initial, undefined]);

        this._observables.get(element)!.get(property)![2] = observable.subscribe((value: T): void => {
            this._observables.get(element)!.get(property)![1] = value;
        });
    }

    public delete(element: HTMLElement, property: string): void {
        if (this._observables.has(element) && this._observables.get(element)!.has(property)) {
            let previous: Unsubscribable | undefined = this._observables.get(element)!.get(property)![2];
            previous?.unsubscribe();
            this._observables.get(element)!.delete(property);
        }
    }

    public value(element: HTMLElement, property: string): T | undefined {
        return this._observables.get(element)?.get(property)?.[1];
    }
}

export function getRegistry<T>(key: string): ValuesRegistry<T> {
    if (!registries.has(key)) {
        registries.set(key, new ValuesRegistry<T>());
    }

    return registries.get(key)!;
}
