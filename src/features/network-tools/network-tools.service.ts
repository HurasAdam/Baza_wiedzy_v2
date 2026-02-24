import { Resolver, lookup } from "dns/promises";

const RESOLVERS: Record<string, string> = {
    google: "8.8.8.8",
    cloudflare: "1.1.1.1",
    edupage: "ns.edupage3.org",
    OpenDNS: "208.67.222.222",
    quad9: "9.9.9.9",
};

export const NetworkToolsService = {
    async dnsLookup(domain: string, resolverKey: string, recordType: string) {
        const resolverHostOrIp = RESOLVERS[resolverKey];
        if (!domain || !resolverHostOrIp || !recordType) {
            throw new Error("Missing fields");
        }

        const resolver = new Resolver();

        let resolverIp = resolverHostOrIp;
        const ipRegex = /^(?:\d{1,3}\.){3}\d{1,3}$/;
        if (!ipRegex.test(resolverHostOrIp)) {
            const lookupResult = await lookup(resolverHostOrIp);
            resolverIp = lookupResult.address;
        }

        resolver.setServers([resolverIp]);

        const safeResolve = async (fn: () => Promise<any>) => {
            try {
                return await fn();
            } catch (err: any) {
                if (err.code === "ENODATA") return [];
                throw err;
            }
        };

        const results: any = {};

        switch (recordType.toUpperCase()) {
            case "A":
                results.A = await safeResolve(() => resolver.resolve4(domain));
                break;
            case "CNAME":
                results.CNAME = await safeResolve(() => resolver.resolveCname(domain));
                break;
            case "MX":
                results.MX = await safeResolve(() => resolver.resolveMx(domain));
                break;
            case "NS":
                results.NS = await safeResolve(() => resolver.resolveNs(domain));
                break;
            case "SOA":
                results.SOA = await safeResolve(() => resolver.resolveSoa(domain));
                break;
            case "TXT":
                results.TXT = await safeResolve(() => resolver.resolveTxt(domain));
                break;
            case "ALL":
                results.A = await safeResolve(() => resolver.resolve4(domain));
                results.CNAME = await safeResolve(() => resolver.resolveCname(domain));
                results.MX = await safeResolve(() => resolver.resolveMx(domain));
                results.NS = await safeResolve(() => resolver.resolveNs(domain));
                results.SOA = await safeResolve(() => resolver.resolveSoa(domain));
                results.TXT = await safeResolve(() => resolver.resolveTxt(domain));
                break;
            default:
                throw new Error("Unsupported record type");
        }

        return results;
    },
};
