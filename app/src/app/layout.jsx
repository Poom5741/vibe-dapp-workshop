import "./globals.css";

export const metadata = {
  title: "Vibe dApp — NFT Mint",
  description: "Built in a 2-hour Avalanche workshop with an AI coding agent",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
