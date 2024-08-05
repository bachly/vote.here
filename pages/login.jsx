// Next JS related
import Head from 'next/head';
import { useRouter } from 'next/router';

// Firebase Auth
import { useAuthState } from 'react-firebase-hooks/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { auth, firebase } from '../lib/firebaseApp';
import { uiConfig } from '../lib/firebaseApp';
import { useEffect } from 'react';

export default function Login() {
    const [user, loading, error] = useAuthState(auth);
    const router = useRouter();

    useEffect(() => {
        if (loading) return <>Loading...</>
        else if (error) return <div>Error: {error}</div>
        else if (user) {
            console.log("User is already logged in, redirect to admin page")
            router.push('/admin');
            return <></>;
        }
    }, [user, loading, error])

    const authConfig = uiConfig();

    return (
        <>
            <Head>
                <title>LogIn</title>
            </Head>
            <StyledFirebaseAuth uiConfig={authConfig} firebaseAuth={auth} />
        </>
    )
}