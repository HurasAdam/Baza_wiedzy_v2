import { useState } from "react";

export function useMail() {
    const [mail, SetMail] = useState<string | null>("");
    return [mail, SetMail];
}
