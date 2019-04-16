import React, { Component } from 'react'
import { } from 'react-bootstrap'
import Jumbotron from 'react-bootstrap/Jumbotron'
import background from '../images/testbg.png'
import matt from '../images/Matt.jpg'
import phil from '../images/Phill.jpg'
import rahul from '../images/Rahul.jpg'
import rob from '../images/Rob.jpg'
import thep from '../images/Thep.jpg'
import gareth from '../images/Matt.jpg'
import Carousel from 'react-bootstrap/Carousel'
export default class AboutUs extends Component

{
    render()
    {
        return(
            <div>
              <div class="page-head">
                <h1 class="text-center">
                    Meet the team
                </h1>
              </div>
              <div class="aboutUsCarousel">
                <Carousel>
                  <Carousel.Item>
                    <img
                      className="d-block w-100 carouselImage"
                      src={matt}
                      alt="First slide"
                    />
                  <Carousel.Caption>
                    <h2>Matt Harding</h2>
                    <p>Working hard on styling and other bits</p>
                  </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                  <img
                    className="d-block w-100 carouselImage"
                    src={rahul}
                    alt="Second slide"
                  />
                  <Carousel.Caption>
                    <h2>Rahul Khotari</h2>
                    <p>Breaking the server.</p>
                  </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                  <img
                    className="d-block w-100 carouselImage"
                    src={thep}
                    alt="Third slide"
                  />
                  <Carousel.Caption>
                    <h2>Thep</h2>
                    <p>Working on the capture component</p>
                  </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                  <img
                    className="d-block w-100 carouselImage"
                    src={rob}
                    alt="fourth slide"
                  />
                  <Carousel.Caption>
                    <h2>Rob</h2>
                    <p>Putting fires out</p>
                  </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                  <img
                    className="d-block w-100 carouselImage"
                    src={background}
                    alt="Fifth slide"
                  />
                  <Carousel.Caption>
                    <h3>Gareth</h3>
                    <p>Working quietly on graphs</p>
                  </Carousel.Caption>
                </Carousel.Item>

              <Carousel.Item>
                <img
                  className="d-block w-100 carouselImage"
                  src={phil}
                  alt="Sixth slide"
                />
                <Carousel.Caption>
                  <h2>Phil</h2>
                  <p>All about the React </p>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
            <div id="about us">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat
                 nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                  sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
            </div>
            </div>

            </div>
        )
    }
}
