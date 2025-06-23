import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Candidates - Shortlist AI',
  description: 'Manage and review candidates',
};

export default function CandidatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 