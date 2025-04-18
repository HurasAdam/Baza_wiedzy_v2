"use client";

import * as React from "react";

import { BANNER_IMAGES } from "../../../../../constants/productBanners";
import { cn } from "../../../../../utils/cn";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../ui/select";

interface AccountSwitcherProps {
    isCollapsed: boolean;
    accounts: {
        label: string;
        email: string;
        icon: React.ReactNode;
    }[];
}

export function AccountSwitcher({ isCollapsed, accounts, products }: AccountSwitcherProps) {
    const [selectedAccount, setSelectedAccount] = React.useState<string>(accounts[0].email);

    console.log("WYBRANO",selectedAccount)
    return (
        <Select defaultValue={selectedAccount} onValueChange={setSelectedAccount}>
            <SelectTrigger
                className={cn(
                    "flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
                    isCollapsed &&
                        "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden"
                )}
                aria-label="Select account"
            >
                <SelectValue placeholder="Wybierz produkt">
                    {accounts.find((account) => account.email === selectedAccount)?.icon}
                    <span className={cn("ml-2", isCollapsed && "hidden")}>
                        {products?.find((product) => product?._id === selectedAccount)?._id}
                    </span>
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {/* {accounts.map((account) => (
                    <SelectItem key={account.email} value={account.email}>
                        <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
                            {account.icon}
                            {account.email}
                        </div>
                    </SelectItem>
                ))} */}
                {products?.map((product) => {
                    const bannerURL = BANNER_IMAGES?.[product.banner]; // albo ścieżka np. `/banners/${product.banner}.png`
                    console.log(product,"PRODUKT")
                    return (
                        <SelectItem value={product?.name}>
                            <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
                                <span
                                    className="h-6 w-6 rounded-md"
                                    style={{
                                        backgroundImage: `url(${bannerURL})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                ></span>
                                {product.name}
                                {/* {account.email} */}
                            </div>
                        </SelectItem>
                    );
                })}
            </SelectContent>
        </Select>
    );
}
