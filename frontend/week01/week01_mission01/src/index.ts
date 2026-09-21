interface Member {
  id: number;
  name: string;
  role: string;
  githubId?: string;
}

const members: Member[] = [
  {
    id: 1,
    name: '구자욱',
    role: 'admin',
    githubId: 'koo9', // GitHub 아이디가 있는 회원
  },
  {
    id: 2,
    name: '이재현',
    role: 'challenger', // GitHub 아이디가 없는 회원
  },
];

function getMemberInfo(id: number): string {
  const member = members.find((member) => member.id === id);

  if (!member) {
    return `회원을 찾을 수 없습니다.`;
  }
  
  const githubInfo = member.githubId ?? 'GitHub 정보 없음';

  return `[회원 정보] ID: ${member.id} | 이름: ${member.name} | 역할: ${member.role} | ${githubInfo}`;
}

console.log(getMemberInfo(1));
console.log(getMemberInfo(2));
console.log(getMemberInfo(999));