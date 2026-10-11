import Icon from '/components/rating_app_icon.png';
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Header() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <header className="site-header">
            <div className="flex items-center gap-2">
                <Image
                    src={Icon}
                    width={50}
                    height={50}
                    alt="Picture of the author"
                />
                <h1 className="page-heading text-2xl text-left">RateIt</h1>
                <Link href="/home" aria-label="Home" className="icon-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9.5 12 3l9 6.5" />
                        <path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10" />
                    </svg>
                </Link>
                <Link href="/Search" aria-label="Search" className="icon-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </Link>
                {user ? (
                    <div className="ml-auto flex items-center gap-2">
                        <Link href={`/User/${user.id}`} aria-label="Account" className="icon-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="8" r="4" />
                                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                            </svg>
                        </Link>
                        <Link href="/Settings" aria-label="Settings" className="icon-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                            </svg>
                        </Link>
                    </div>
                ) : (
                    <div className="ml-auto flex items-center gap-2">
                        <Link
                            href="/login"
                            className="btn-outline"
                        >
                            Log in
                        </Link>
                        <Link
                            href="/signup"
                            className="btn-primary px-3 py-1.5 text-sm"
                        >
                            Sign up
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}
