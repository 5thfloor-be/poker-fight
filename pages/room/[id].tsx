import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Card from '../../components/Card';
import User, { Role } from '../api/model/user';
import { States } from '../api/model/room';
import { GiCardRandom } from 'react-icons/all';

const Room: NextPage = () => {
    const router = useRouter();
    const roomId = router.query.id;

    const me = new User('20', {name: 'Gab', color: '#008000', role: Role.DEV});

    const pedro = new User('10', {name: 'Pedro', color: '#ffff00', role: Role.DEV});
    const estef = new User('30', {name: 'Estef', color: '#ffc0cb', role: Role.DEV});
    const tbo = new User('40', {name: 'Tbo', color: '#ffa500', role: Role.DEV});
    const alex = new User('50', {name: 'Alex', color: '#ffc0cb', role: Role.DEV});
    const mathieu = new User('60', {name: 'Mathieu', color: '#808080', role: Role.DEV});
    const renaud = new User('70', {name: 'Renaud', color: '#0000ff', role: Role.DEV});
    const rachel = new User('80', {name: 'Rachel', color: '#808080', role: Role.DEV});
    const michou = new User('90', {name: 'Michou', color: '#ff0000', role: Role.DEV});
    const jerry = new User('100', {name: 'Jerry', color: '#0000ff', role: Role.DEV});

    const room = {
        users: [pedro, estef, tbo, alex, mathieu, renaud, rachel, michou, jerry],
        modified: new Date(),
        coffeBreak: new Map([]),
        buzzer: new Map([]),
        currentVotes: new Map([]),
        state: States.STARTING,
        currentPoints: 0,
        callback: {}
    };

    const cardValues = [1, 2, 3, 5, 8, 13];

    // get room from server

    return (
        <div className="container">
            <div className="row">
                {
                    room.users.map((user, key) =>
                        <div key={key} className="col">
                            <Card value={undefined} canClose={false} color={user.userInfo.color} />
                            <h1>{user.userInfo.name}</h1>
                        </div>
                    )
                }
            </div>
            <div className="row">

            </div>
            <div className="row d-none d-sm-inline-flex">
                {
                    cardValues.map((cardValue, key) =>
                        <div key={key} className="col">
                            <Card value={cardValue} canClose={false} color={""} />
                        </div>
                    )
                }
            </div>
            <div className="row d-sm-none">
                {
                    <div className="col text-center h-100">
                        <button className="btn btn-light rounded-5 fw-bold">
                            {/*<GiCardRandom />*/}
                        </button>

                    </div>
                }
            </div>
        </div>
    )
}

export default Room;