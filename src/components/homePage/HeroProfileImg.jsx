"use client";
import Employe23 from "@/assets/homePage/Employe23.png";
import Employe34 from "@/assets/homePage/Employe34.png";
import Employe56 from "@/assets/homePage/Employe56.png";
import Employe12 from "@/assets/homePage/p1.png";
import Employe45 from "@/assets/homePage/p2.png";
import leftImg from "@/assets/homePage/LeftBannerImage.png";
import rightImg from "@/assets/homePage/p3.png";
import Image from "next/image";
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useState, useEffect } from 'react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const HeroProfileImg = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // 640px is sm breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  return (
    <section className="mx-2 mt-5 mb-10 sm:mx-0 lg:mb-32 xl:mt-14 2xl:mb-0">
      <div className="mx-0 max-w-[1520px] px-2 xl:mx-auto">
        {/* Mobile & Tablet Slider - Compact design */}
        <div className="block lg:hidden relative">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={8}
            slidesPerView={1.3}
            centeredSlides={true}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            speed={600}
            loop={true}
            breakpoints={{
              242: {
                slidesPerView: 1,
                spaceBetween: 8,
                centeredSlides: true,
              },
              396: {
                slidesPerView: 1.5,
                spaceBetween: 8,
                centeredSlides: true,
              },
              480: {
                slidesPerView: 1.8,
                spaceBetween: 10,
                centeredSlides: false,
              },
              640: {
                slidesPerView: 2.8,
                spaceBetween: 12,
                centeredSlides: false,
              },
              600: {
                slidesPerView: 3,
                spaceBetween: 12,
                centeredSlides: false,
              },
              768: {
                slidesPerView: 3.2,
                spaceBetween: 15,
                centeredSlides: false,
              },
              1024: {
                slidesPerView: 3.8,
                spaceBetween: 18,
                centeredSlides: false,
              }
            }}
            className="hero-profile-swiper !pb-10"
            style={{
              '--swiper-pagination-color': '#3b82f6',
              '--swiper-pagination-bullet-inactive-color': 'rgba(59, 130, 246, 0.3)',
              '--swiper-pagination-bullet-inactive-opacity': '0.5',
            }}
          >
            <SwiperSlide>
              <div className="flex justify-center transform transition-all duration-500 hover:scale-105">
                <div className="relative group">
                  <Image
                    src={Employe34}
                    alt="Employee 1"
                    width={280}
                    height={200}
                    className="h-[215px] w-[230px] sm:h-[215px] sm:w-[200px] md:h-[215px] md:w-[220px] rounded-xl object-cover shadow-[0_8px_25px_rgba(0,_0,_0,_0.2)] transition-all duration-500 group-hover:shadow-[0_12px_35px_rgba(0,_0,_0,_0.3)]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="flex justify-center transform transition-all duration-500 hover:scale-105">
                <div className="relative group">
                  <Image
                    src={Employe23}
                    alt="Employee 2"
                    width={280}
                    height={200}
                    className="h-[215px] w-[230px] sm:h-[215px] sm:w-[200px] md:h-[215px] md:w-[220px] rounded-xl object-cover shadow-[0_8px_25px_rgba(0,_0,_0,_0.2)] transition-all duration-500 group-hover:shadow-[0_12px_35px_rgba(0,_0,_0,_0.3)]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            </SwiperSlide>
            {isMobile && (
              <SwiperSlide>
                <div className="flex justify-center transform transition-all duration-500 hover:scale-105">
                  <div className="relative group">
                    <Image
                      src={leftImg}
                      alt="Left Banner Image"
                      width={280}
                      height={200}
                      className="h-[215px] w-[230px] sm:h-[215px] sm:w-[200px] md:h-[215px] md:w-[220px] rounded-xl object-cover shadow-[0_8px_25px_rgba(0,_0,_0,_0.2)] transition-all duration-500 group-hover:shadow-[0_12px_35px_rgba(0,_0,_0,_0.3)]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>
              </SwiperSlide>
            )}

            {isMobile && (
              <SwiperSlide>
                <div className="flex justify-center transform transition-all duration-500 hover:scale-105">
                  <div className="relative group">
                    <Image
                      src={rightImg}
                      alt="Right Banner Image"
                      width={280}
                      height={200}
                      className="h-[215px] w-[230px] sm:h-[215px] sm:w-[200px] md:h-[215px] md:w-[220px] rounded-xl object-cover shadow-[0_8px_25px_rgba(0,_0,_0,_0.2)] transition-all duration-500 group-hover:shadow-[0_12px_35px_rgba(0,_0,_0,_0.3)]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>
              </SwiperSlide>
            )}

            <SwiperSlide>
              <div className="flex justify-center transform transition-all duration-500 hover:scale-105">
                <div className="relative group">
                  <Image
                    src={Employe12}
                    alt="Employee 3"
                    width={280}
                    height={200}
                    className="h-[215px] w-[230px] sm:h-[215px] sm:w-[200px] md:h-[215px] md:w-[220px] rounded-xl object-cover shadow-[0_8px_25px_rgba(0,_0,_0,_0.2)] transition-all duration-500 group-hover:shadow-[0_12px_35px_rgba(0,_0,_0,_0.3)]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="flex justify-center transform transition-all duration-500 hover:scale-105">
                <div className="relative group">
                  <Image
                    src={Employe45}
                    alt="Employee 4"
                    width={280}
                    height={200}
                    className="h-[215px] w-[230px] sm:h-[215px] sm:w-[200px] md:h-[215px] md:w-[220px] rounded-xl object-cover shadow-[0_8px_25px_rgba(0,_0,_0,_0.2)] transition-all duration-500 group-hover:shadow-[0_12px_35px_rgba(0,_0,_0,_0.3)]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="flex justify-center transform transition-all duration-500 hover:scale-105">
                <div className="relative group">
                  <Image
                    src={Employe56}
                    alt="Employee 5"
                    width={280}
                    height={200}
                    className="h-[215px] w-[230px]  sm:h-[215px] sm:w-[200px] md:h-[215px] md:w-[220px] rounded-xl object-cover shadow-[0_8px_25px_rgba(0,_0,_0,_0.2)] transition-all duration-500 group-hover:shadow-[0_12px_35px_rgba(0,_0,_0,_0.3)]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>

        {/* Desktop Grid Layout - Compact design */}
        <div className="hidden lg:grid grid-cols-5 justify-items-center items-end gap-6">
          <div className="relative xl:top-28 2xl:end-10 transform transition-all duration-500 hover:scale-105 hover:-translate-y-1">
            <div className="relative group">
              <Image
                src={Employe34}
                alt="Employee 1 "
                width={104}
                height={104}
                className="h-[104px] w-[250px] rounded-xl object-cover shadow-[0_8px_25px_rgba(0,_0,_0,_0.2)] xl:h-[104px] xl:w-[104px] transition-all duration-500 group-hover:shadow-[0_12px_35px_rgba(0,_0,_0,_0.3)]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>

          <div className="relative xl:top-0 2xl:end-20 transform transition-all duration-500 hover:scale-105 hover:-translate-y-1">
            <div className="relative group">
              <Image
                src={Employe23}
                alt="Employee 2"
                width={180}
                height={180}
                className="h-[104px] w-[250px] rounded-xl object-cover shadow-[0_8px_25px_rgba(0,_0,_0,_0.2)] xl:h-[180px] xl:w-[180px] transition-all duration-500 group-hover:shadow-[0_12px_35px_rgba(0,_0,_0,_0.3)]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>

          <div className="relative xl:top-14 2xl:top-14 transform transition-all duration-500 hover:scale-105 hover:-translate-y-1">
            <div className="relative group">
              <Image
                src={Employe12}
                alt="Employee 3"
                width={250}
                height={250}
                className="h-[250px] w-[250px] rounded-xl object-cover shadow-[0_12px_35px_rgba(0,_0,_0,_0.25)] transition-all duration-500 group-hover:shadow-[0_18px_45px_rgba(0,_0,_0,_0.35)]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>

          <div className="relative xl:top-0 2xl:start-20 transform transition-all duration-500 hover:scale-105 hover:-translate-y-1">
            <div className="relative group">
              <Image
                src={Employe45}
                alt="Employee 4"
                width={180}
                height={180}
                className="h-[180px] w-[180px] rounded-xl object-cover shadow-[0_8px_25px_rgba(0,_0,_0,_0.2)] xl:h-[180px] xl:w-[180px] transition-all duration-500 group-hover:shadow-[0_12px_35px_rgba(0,_0,_0,_0.3)]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>

          <div className="relative xl:top-28 2xl:start-10 transform transition-all duration-500 hover:scale-105 hover:-translate-y-1">
            <div className="relative group">
              <Image
                src={Employe56}
                alt="Employee 5"
                width={104}
                height={104}
                className="h-[104px] w-[250px] rounded-xl object-cover shadow-[0_8px_25px_rgba(0,_0,_0,_0.2)] xl:h-[104px] xl:w-[104px] transition-all duration-500 group-hover:shadow-[0_12px_35px_rgba(0,_0,_0,_0.3)]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroProfileImg;
