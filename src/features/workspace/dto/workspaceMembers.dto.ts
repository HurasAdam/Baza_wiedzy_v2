export const workspaceMembersDto = (members) => {
    return members.map((m) => ({
        _id: m._id.toString(),
        name: m.userId?.name ?? null,
        surname: m.userId?.surname ?? null,
        email: m.userId?.email ?? null,
        role: m.role?.name ?? null,
    }));
};
