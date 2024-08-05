import WORDS from '../../lib/words.json';
import { useQRCode } from 'next-qrcode';

export default function Users() {
    const { Image } = useQRCode();

    return <>
        <div className="grid grid-cols-4">
            {WORDS.map(id => {
                return <div key={id} className="pl-3 pt-6 pb-6 text-left border border-black">
                    <div className="flex items-center">
                        <Image
                            text={`http://vote.here.li/me/${id}`}
                            options={{
                                type: 'image/jpeg',
                                quality: 0.3,
                                errorCorrectionLevel: 'M',
                                margin: 0,
                                scale: 4,
                                width: 100,
                                color: {
                                    dark: '#000',
                                    light: '#fff',
                                },
                            }}
                        />
                        <div className="ml-2">
                            <div className="font-bold text-2xl tracking-tight">1 voting slip per phone</div>
                            <a href={`/me/${id}`} className="font-bold text-base underline">vote.here.li/me/{id}</a>
                        </div>
                    </div>
                </div>
            })}
        </div>
    </>
}