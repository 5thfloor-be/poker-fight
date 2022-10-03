import React, { Component } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";

export default class NextJsCarousel extends Component {
  render() {
    return (
      <div className="col-12 col-sm-6 offset-sm-3 col-xxl-8 offset-xxl-2 my-2 my-xxl-3">
        <Carousel
          autoPlay={true}
          emulateTouch={true}
          infiniteLoop={true}
          showThumbs={false}
          showStatus={false}
          dynamicHeight={false}
          interval={4000}
        >
          <div>
            <Image
              src="/images/poker-planning.jpg"
              alt="Poker Planning"
              width={1000}
              height={500}
            />
            <p className="legend">
              Discover a new voting system for your Poker Planning, with fun and
              innovative features.
            </p>
          </div>
          <div>
            <Image
              src="/images/vsroom.jpg"
              alt="VS Room"
              width={1000}
              height={500}
            />
            <p className="legend">
              When there is no consensus, meet in a special room to open a
              debate.
            </p>
          </div>
          <div>
            <Image
              src="/images/love-git.jpg"
              alt="Love Git"
              width={1000}
              height={500}
            />
            <p className="legend">
              This application is Open Source and developed by 5th Floor teams.
              Discover the full story{" "}
              <a
                className="text-decoration-none text-reset"
                href="https://5thfloor.be/poker-fight"
                target="_blank"
                rel="noreferrer"
              >
                here
              </a>
              .
            </p>
          </div>

          <div>
            <Image
              src="/images/gdpr.jpg"
              alt="GDPR Friendly"
              width={1000}
              height={500}
            />
            <p className="legend">
              No registration is required, just start a game and invite your
              colleagues to join you.
            </p>
          </div>
        </Carousel>
      </div>
    );
  }
}
