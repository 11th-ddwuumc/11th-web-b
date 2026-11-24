"use client";

export function AlertButton() {
  return (
    <button
      type="button"
      className="rounded bg-blue-700 px-4 py-2 text-white"
      onClick={() => alert("Hello, Next.js!")}
    >
      Click Me
    </button>
  );
}
