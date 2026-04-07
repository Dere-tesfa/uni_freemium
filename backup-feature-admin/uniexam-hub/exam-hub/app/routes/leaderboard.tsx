import { useLoaderData } from 'react-router';
import type { Route } from './+types/leaderboard';

// Mock data - will be replaced with actual data from loaders
async function getLeaderboard() {
    return [
        { rank: 1, name: 'Sarah Ahmed', score: 980, exams: 24 },
        { rank: 2, name: 'John Doe', score: 965, exams: 22 },
        { rank: 3, name: 'Mohammed Ali', score: 950, exams: 21 },
        { rank: 4, name: 'Elena Gilbert', score: 940, exams: 20 },
        { rank: 5, name: 'Stefan Salvatore', score: 935, exams: 19 },
    ];
}

export async function loader() {
    const players = await getLeaderboard();
    return { players };
}

export default function Leaderboard() {
    const { players } = useLoaderData<typeof loader>();

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-primary">Global Leaderboard</h1>
            <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted border-b">
                            <tr>
                                <th className="px-6 py-4 font-bold">Rank</th>
                                <th className="px-6 py-4 font-bold">Student</th>
                                <th className="px-6 py-4 font-bold">Score</th>
                                <th className="px-6 py-4 font-bold">Exams Taken</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {players.map((p) => (
                                <tr key={p.rank} className="hover:bg-accent/20 transition-colors">
                                    <td className="px-6 py-4 font-semibold">#{p.rank}</td>
                                    <td className="px-6 py-4">{p.name}</td>
                                    <td className="px-6 py-4 font-mono text-primary">{p.score}</td>
                                    <td className="px-6 py-4 text-muted-foreground">{p.exams}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
