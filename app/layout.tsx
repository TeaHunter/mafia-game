export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Mafia Game</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, fontFamily: 'sans-serif', backgroundColor: '#000', color: '#fff' }}>
        {children}
      </body>
    </html>
  );
}
