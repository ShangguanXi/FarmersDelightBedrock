export const methodEventSub = (event, opt) => {
    return (target, propertyKey, descriptor) => {
        if (!opt) {
            event.subscribe((args) => {
                descriptor.value(args);
            });
        }
        else {
            event.subscribe((args) => {
                descriptor.value(args);
            }, opt);
        }
    };
};
export const methodEEventSub = (event) => {
    return (target, propertyKey, descriptor) => {
        new event().subscribe(descriptor.value);
    };
};
//# sourceMappingURL=eventHelper.js.map