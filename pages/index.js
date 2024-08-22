import { faker } from '@faker-js/faker';
import _ from 'underscore';

export default function () {

    const strings = []

    for (var i = 0; i < 2000; i++) {
        const str = faker.string.alphanumeric({ length: { min: 4, max: 6 } })
        strings.push(str);
    }

    console.log(_.compact(strings));

    return <div>
        QR Vote
    </div>
}