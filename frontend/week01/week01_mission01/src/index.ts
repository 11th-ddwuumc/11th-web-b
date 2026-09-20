interface Member {
  id: number;
  name: string;
  role: string;
  githubId?: string; // 선택값: 옵셔널 프로퍼티 사용
}

const members: Member[] = [
  {
    id: 1,
    name: "홍길동",
    role: "Frontend Developer",
    githubId: "ChaeYeon-J",
  },
  {
    id: 2,
    name: "홍길순",
    role: "UI Designer",
  },
];

function getMemberInfo(id: number): string {
  const member = members.find((m) => m.id === id); //못 찾으면 undefined

  if (!member) {
    //존재하지 않는 회원(타입 좁히기)
    return `ID ${id}번 회원을 찾을 수 없습니다.`;
  }

  const githubInfo = member.githubId ?? "등록된 GitHub 계정 없음"; //깃허브 없을 경우

  return `[회원 정보] 이름: ${member.name} | 역할: ${member.role} | GitHub: ${githubInfo}`;
}

console.log(getMemberInfo(1));
console.log(getMemberInfo(2));
console.log(getMemberInfo(999));
