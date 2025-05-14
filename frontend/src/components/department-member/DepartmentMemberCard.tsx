export interface IDepartmentMember {
    _id: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
}

interface Props {
    member: IDepartmentMember;
}

const DepartmentMemberCard = ({ member }: Props) => {
    return (
        <div key={member._id} className="border rounded-xl p-4 shadow-sm bg-card text-card-foreground">
            <h2 className="font-semibold text-lg">
                {member.name} {member.surname}
            </h2>
            <p className="text-sm text-muted-foreground">{member.email}</p>
            <p className="text-sm text-muted-foreground">Telefon: {member.phone}</p>
        </div>
    );
};

export default DepartmentMemberCard;
