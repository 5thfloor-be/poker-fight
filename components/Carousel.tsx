import React, { Component } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

export default class NextJsCarousel extends Component {
  render() {
    return (
      <div>
        <Carousel
          autoPlay={true}
          emulateTouch={true}
          infiniteLoop={true}
          showThumbs={false}
          showStatus={false}
        >
          <div>
            <img src="/images/poker-planning.jpg" alt="Love Git" />
            <p className="legend">
              Discover a new voting system for your Poker Planning, with fun and
              innovative features.
            </p>
          </div>
          <div>
            <img src="/images/love-git.jpg" alt="Love Git" />
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
            <img src="/images/gdpr.jpg" alt="Love Git" />
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
