import { auth } from "../lib/firebaseApp";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import Link from "next/link";
import { useUserContext } from "../lib/contexts";

export default function () {
    const { user, loadingUser, errorLoadingUser } = useUserContext();
    const router = useRouter();

    function logout() {
        signOut(auth).then(() => {
            router.push('/admin')
        })
    }

    if (loadingUser) {
        return (
            <div className="bg-black text-white">
                <p>Initialising User...</p>
            </div>
        );
    }
    if (errorLoadingUser) {
        return (
            <div className="bg-black text-white">
                <p>Error: {error}</p>
            </div>
        );
    }
    if (user) {
        return (
            <div className="bg-black text-white">
                Hello {user.email} (<button onClick={logout}>Log out</button>)
            </div>
        );
    }

    return <div className="bg-black text-white">
        <Link href="/login">Login</Link>
    </div>;
}