type Member = {
    id: number;
    name: string;
    role: string;
    GitHubId?: string;
}

const members: Member[] = [
    {
        id: 20240000,
        name: "정대현",
        role: "leader",
        GitHubId: "git0000"
    },

    {
        id: 20249999,
        name: "미나미",
        role: "member",
        GitHubId: "git9999"
    },

    {
        id: 20241234,
        name: "Emily",
        role: "member",
    } 
];

function getMemberById(userId: number): string{
    const foundUser = members.find((member) => member.id === userId);

    if(!foundUser){
        return "존재하지 않는 회원입니다.";
    }

    const GitHub = foundUser.GitHubId ?? "GitHub 계정 없음";

    return "회원 정보: " + foundUser.name + ", 역할: " + foundUser.role + ", GitHub: " + GitHub;
}

console.log(getMemberById(20241234));