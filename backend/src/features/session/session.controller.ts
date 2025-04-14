import { OK } from "@/constants/http";
import catchErrors from "@/utils/catchErrors";
import { sessionIdDto } from "./dto/session-id.dto";
import { SessionService } from "./session.service";

export const SessionController = (sessionService = SessionService) => ({
    find: catchErrors(async ({ user, sessionId }, res) => {
        const result = await sessionService.find(user.id, sessionId);
        return res.status(OK).json(result);
    }),

    deleteOne: catchErrors(async ({ user, params }, res) => {
        const sessionId = sessionIdDto.parse(params.id);
        await sessionService.deleteOne(user.id, sessionId);
        return res.status(OK).json({ message: "Session removed" });
    }),
});
