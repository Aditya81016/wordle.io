import { Button } from "@/components/ui/button";
import { linkTo } from "@/config";
import Link from "next/link";

export default function Home() {
  return (
    <main className="p-5 h-[100dvh] flex flex-col">
      <h1 className="text-4xl font-bold">Wordle.io</h1>
      <div className="flex flex-col items-center justify-center h-full gap-5">
        <Button asChild size={"lg"} variant={"outline"}>
          <Link href={linkTo.solvePuzzle}>Solve Puzzle</Link>
        </Button>
        <Button asChild size={"lg"} variant={"outline"}>
          <Link href={linkTo.passAndPlay}>Pass & Play</Link>
        </Button>
        <Button asChild size={"lg"} variant={"outline"}>
          <Link href={linkTo.createRoom}>Create Room</Link>
        </Button>
        <Button asChild size={"lg"} variant={"outline"}>
          <Link href={linkTo.joinRoom}>Join Room</Link>
        </Button>
      </div>
    </main>
  );
}
