import Image from "next/image";
import { Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"] });
const imageUrl = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3";
const alt = "노트북으로 함께 작업하는 모습";

export default function MediaPage() {
  return (
    <>
      <h1 className={`${geist.className} text-2xl font-bold`}>Hello, Next.js!</h1>
      <h2>next/image로 표시한 이미지</h2>
      <Image src={imageUrl} alt={alt} width={600} height={400}
        sizes="(max-width: 648px) calc(100vw - 48px), 600px" />
      <h2>같은 원본을 img로 표시한 이미지</h2>
      <img src={imageUrl} alt={alt} width={600} height={400} />
    </>
  );
}
