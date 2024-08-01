import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebaseApp";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import Link from "next/link";

export default function () {
    const [user, loading, error] = useAuthState(auth);
    const router = useRouter();

    function logout() {
        signOut(auth).then(() => {
            router.push('/admin')
        })
    }

    if (loading) {
        return (
            <div>
                <p>Initialising User...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div>
                <p>Error: {error}</p>
            </div>
        );
    }
    if (user) {
        return (
            <div>
                Hello {user.email} (<button onClick={logout}>Log out</button>)
            </div>
        );
    }

    return <Link href="/login">Login</Link>;
}