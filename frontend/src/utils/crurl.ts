/**
 * crurl - create url
 * join parameters with slashes
 *
 * crurl(a, b, c) -> "a/b/c"
 */
export const crurl = <T extends any[]>(...args: T) => {
    return args.join("/");
};
