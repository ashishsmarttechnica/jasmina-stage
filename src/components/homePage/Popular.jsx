"use client";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { IoChatbubbleOutline } from "react-icons/io5";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useTestimonials } from "../../hooks/testimonials/testimonials";
import useTestimonialsStore from "../../store/testimonials.store";

const Popular = () => {
  const t = useTranslations("HomePage.testimonials");
  const testimonial = useTestimonialsStore((s) => s.testimonials);
  const setStoreTestimonials = useTestimonialsStore((s) => s.setTestimonials);

  // Fetch testimonials using custom hook
  const { testimonials: fetchedTestimonials, isLoading } = useTestimonials({
    page: 1,
    limit: 100000
  });

  // Update store when data is fetched
  useEffect(() => {
    if (fetchedTestimonials && fetchedTestimonials.length > 0) {

      const mappedTestimonials = fetchedTestimonials.map((item) => {
        // Extract region from parentheses in name if present
        const nameMatch = item.name?.match(/^(.+?)\s*\((.+?)\)\s*$/);
        const role = nameMatch ? nameMatch[1].trim() : (item.name || t("anonymous"));
        const region = nameMatch ? nameMatch[2].trim() : "";



        return {
          id: item._id,
          role: role,
          region: region,
          quote: item.message || "",
          image: item.image || "",
        };
      });

      // Update Zustand store
      setStoreTestimonials(mappedTestimonials);
    }
  }, [fetchedTestimonials, setStoreTestimonials]);

  const SkeletonCard = () => (
    <div className="rounded-[30px] border border-[#ece7df] bg-white/80 p-8 shadow-[0_30px_75px_rgba(15,23,42,0.07)]">
      <div className="flex items-center gap-4">
        <span className="inline-flex h-12 w-12 rounded-2xl bg-slate-200" />
        <div className="flex flex-col gap-2">
          <span className="h-3 w-20 rounded bg-slate-200" />
          <span className="h-4 w-32 rounded bg-slate-200" />
        </div>
      </div>
      <div className="mt-6 space-y-3">
        <span className="block h-4 w-full rounded bg-slate-200" />
        <span className="block h-4 w-[85%] rounded bg-slate-200" />
        <span className="block h-4 w-[70%] rounded bg-slate-200" />
      </div>
      <div className="mt-6 h-px w-full bg-slate-200/70" />
      <span className="mt-4 block h-4 w-32 rounded bg-slate-200" />
    </div>
  );

  return (
    <section className="py-10">
      <div className="px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {t("eyebrow")}
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">
            {t("title")}
          </h2>
          <p className="mt-4 text-base text-slate-600">
            {t("description")}
          </p>
        </div>

        <div className="relative mt-16 px-2 sm:px-6 lg:px-10">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : testimonial.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-slate-500">{t("noTestimonials")}</p>
            </div>
          ) : (
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={24}
              slidesPerView={1}
              loop
              speed={350}
              loopAdditionalSlides={2}
              loopedSlides={testimonial.length}
              autoplay={{
                delay: 1500,
                disableOnInteraction: false,
                pauseOnMouseEnter: false,
              }}
              pagination={{ clickable: true }}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="testimonial-swiper !pb-12"
            >

              {testimonial.map((testimonial) => (
                <SwiperSlide key={testimonial.id}>
                  <article className="relative h-full rounded-[30px] border border-[#ece7df] bg-gradient-to-br from-white via-[#faf7f2] to-white p-8 shadow-[0_30px_75px_rgba(15,23,42,0.1)] transition-transform duration-300 hover:-translate-y-1">
                    <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-[radial-gradient(circle_at_top,_rgba(203,213,225,0.35),_transparent_65%)] opacity-80" />
                    <div className="relative flex h-full min-h-[240px] flex-col justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {testimonial.image ? (
                          <img
                            src={testimonial.image}
                            alt={testimonial.role}
                            className="h-12 w-12 rounded-2xl object-cover shadow-md"
                            onError={(e) => {
                              console.error("❌ Failed to load image:", testimonial.image);
                              e.target.style.display = 'none';
                              e.target.nextElementSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <span
                          className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8ecf2] text-2xl text-slate-600 shadow-inner"
                          style={{ display: testimonial.image ? 'none' : 'flex' }}
                        >
                          <IoChatbubbleOutline className="text-xl" />
                        </span>
                        <div>
                          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{t("region")}</p>
                          <p className="text-lg font-semibold text-slate-900">{testimonial.region}</p>
                        </div>
                      </div>
                      <p className="text-lg leading-relaxed text-slate-800 line-clamp-3">
                        {testimonial.quote}
                      </p>
                      <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                      <p className="text-sm italic text-slate-500">{testimonial.role}</p>
                    </div>
                  </article>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </section>
  );
};

export default Popular;
