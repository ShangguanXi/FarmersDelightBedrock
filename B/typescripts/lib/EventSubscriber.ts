export interface EventSignal<E, T> {
    subscribe(callback: (event: E) => any, option?: T): any;
}

export function subscribeEvent<E, T>(event: EventSignal<E, T>, filter?: T)  {
    return (target: Object, property: string | symbol, descriptor: TypedPropertyDescriptor<(event: E) => any>) => {
        const callback = descriptor.value;
        if (!callback) throw new Error(`@subscribeEvent can only be applied to methods`);
        if (filter === undefined) {
            event.subscribe(callback);
        } else {
            event.subscribe(callback, filter);
        }
    };
}
