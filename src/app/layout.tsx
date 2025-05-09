// app/layout.tsx
import '../styles/globals.css';
import FirebaseProvider from '@/components/FirebaseProvider';

export const metadata = {
  title: 'SikaCling | Jasa Cuci Sepatu Premium',
  description: 'Jasa cuci sepatu profesional dengan fitur tracking order dan booking online.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <FirebaseProvider>
          {children}
        </FirebaseProvider>
      </body>
    </html>
  );
}
