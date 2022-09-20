import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Card from '../../components/Card';
import { getStorageValue } from '../../components/UseLocalStorage';
import Image from 'next/image';

const Versus: NextPage = () => {
  const [widthScreen, setWidthScreen] = useState(0);

  useEffect(() => {
    setWidthScreen(window.innerWidth);
  }, []);

  function getCards(side: String, mobile: boolean = false) {
    let room = getStorageValue('ROOM', null);

    //TODO get room and user from local storage

    let cards = [
      {name: 'Alex', card: 5},
      {name: 'Alex', card: 5},
      {name: 'Gab', card: 2},
      {name: 'Renaud', card: 2},
      {name: 'Esteph', card: 1},
      {name: 'Tbo', card: 1},
      {name: 'Mathieu', card: 5},
      {name: 'Jean', card: 5},
      {name: 'Claude', card: 5}
    ]

    let ordered = Array.from(cards.sort((a, b) => b.card - a.card));

    let highVal = ordered[0].card;
    let lowVal = ordered[ordered.length - 1].card;

    let leftCards = cards.filter(it => it.card == highVal);
    let rightCards = cards.filter(it => it.card == lowVal);

    if (side == 'right') {
      return (
          <>
            <div className="d-none d-sm-block">
              <div className="d-flex flex-wrap justify-content-center gap-5">
                {rightCards.map(item => <Card value={item.card} name={item.name} canClose={false}/>)}
              </div>
            </div>
            <div className="d-sm-none d-block">
              <div className="d-flex flex-wrap justify-content-center gap-5">
                <Card value={highVal} canClose={false} badgeText={rightCards.length} popupText={rightCards.map(item => <div>{item.name}</div>)}/>
              </div>
            </div>
          </>
      )
    }
else
  {
      return (
          <>
            <div className="d-none d-sm-block">
              <div className="d-flex flex-wrap justify-content-center gap-5">
                {leftCards.map(item => <Card value={item.card} name={item.name} canClose={false}/>)}
              </div>
            </div>
            <div className="d-sm-none d-block">
              <div className="d-flex flex-wrap justify-content-center gap-5">
                <Card value={lowVal} canClose={false} badgeText={leftCards.length} popupText={leftCards.map(item => <div>{item.name}</div>)}/>
              </div>
            </div>
          </>
      )
    }
}

return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main>
        <div className="text-center d-sm-block d-none">
          <h1 style={{fontSize: '50px', fontWeight: 'bold'}} className="mx-0">
            LET'S FIGHT !
          </h1>
          <h4>Hey, it seems like we're not all aligned. Let's talk about it.</h4>
        </div>
        <div className="container" style={{marginTop: '5%'}}>
          <div className="row">
            <div className="col-4">
              <div>
                {getCards('left')}
              </div>>
            </div>
            <div className="col-4">
              <Image
                  className="text-white"
                  src="/images/versus.png"
                  layout="responsive"
                  objectFit="contain"
                  alt="logo"
                  height="200px"
                  width="400px"
              />
            </div>
            <div className="col-4">
              <div>
                {getCards('right')}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Versus;
