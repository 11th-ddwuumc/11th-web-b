import { Suspense } from "react";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

async function TodoContent({ params }: Props) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
  if (response.status === 404) notFound();
  if (!response.ok) throw new Error("할 일을 불러오지 못했어요.");
  const todo: { title: string } = await response.json();

  return (
    <>
      <h1 className="text-2xl font-bold">Todo {id}</h1>
      <p>{todo.title}</p>
    </>
  );
}

export default function TodoPage(props: Props) {
  return (
    <Suspense fallback={<p>할 일을 불러오는 중이에요.</p>}>
      <TodoContent {...props} />
    </Suspense>
  );
}
