import { Calendar, Clock, TrendingUp } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import type { QuizHistory } from '@/lib/quiz'
import { cn } from '@/lib/utils'

interface QuizHistoriesProps {
  histories: Array<QuizHistory>
}

export function QuizHistories({ histories }: QuizHistoriesProps) {
  if (histories.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-lighter bg-neutral-lighter/50 p-6 text-center">
        <p className="text-neutral-dark">Belum ada riwayat kuis</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        pagination={{
          el: '.swiper-pagination-custom',
          clickable: true,
        }}
        spaceBetween={12}
        slidesPerView={1}
        breakpoints={{
          640: {
            slidesPerView: 1.5,
          },
          1024: {
            slidesPerView: 2,
          },
        }}
      >
        {histories.map((history) => (
          <SwiperSlide key={history.id}>
            <div className="flex items-center justify-between rounded-lg border border-neutral-lighter bg-white p-4 hover:border-neutral-dark transition-colors">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={cn(
                      'px-2 py-1 rounded text-xs font-semibold uppercase',
                      history.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : history.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-neutral-lighter text-neutral-dark',
                    )}
                  >
                    {history.status === 'completed'
                      ? 'Selesai'
                      : history.status === 'in_progress'
                        ? 'Dalam Proses'
                        : 'Draft'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-neutral-dark">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4" />
                    <span>
                      {new Date(history.started_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4" />
                    <span>
                      {new Date(history.started_at).toLocaleTimeString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="ml-4 flex flex-col items-end">
                <div className="flex items-center gap-2">
                  <TrendingUp className="size-5 text-bright-sun-base" />
                  <span className="text-2xl font-bold text-neutral-darker">
                    {history.score.toFixed(1)}
                  </span>
                </div>
                <span className="text-xs text-neutral-dark">Nilai</span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between px-4">
        <button className="swiper-button-prev-custom flex items-center justify-center rounded-full p-2 hover:bg-neutral-lighter text-neutral-darker">
          <svg
            className="size-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Pagination Dots */}
        <div className="swiper-pagination-custom flex items-center justify-center gap-2" />

        <button className="swiper-button-next-custom flex items-center justify-center rounded-full p-2 hover:bg-neutral-lighter text-neutral-darker">
          <svg
            className="size-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <style>{`
        .swiper-pagination-custom .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background-color: #d1d5db;
          opacity: 1;
          margin: 0 4px;
        }
        .swiper-pagination-custom .swiper-pagination-bullet-active {
          background-color: #fbbf24;
        }
      `}</style>
    </div>
  )
}
