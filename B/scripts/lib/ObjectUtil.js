export function isSamePos(required, supplied) {
    return supplied && required.x === supplied.x && required.y === supplied.y && required.z === supplied.z;
}
