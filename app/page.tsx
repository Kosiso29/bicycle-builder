import { Button } from "@mui/material";
import Link from "next/link";

export default function Home() {

    return (
        <main className="h-screen flex items-center justify-center bg-blue-100">
            <div className="flex gap-10">
                <Link href="/build">
                    <Button variant="contained">New Build</Button>
                </Link>
                <Link href="/login">
                    <Button variant="outlined">Admin</Button>
                </Link>
                <Link href="/openai">
                    <Button variant="outlined">Current Bike</Button>
                </Link>
            </div>
        </main>
    );
}
