export default function () {
    return <div className="">
        <header className="py-2 bg-blue-800 text-white text-center text-2xl">Vote & Survey</header>
    </div>
}

export async function getServerSideProps({ params }) {
    return {
        props: {

        }
    }
}