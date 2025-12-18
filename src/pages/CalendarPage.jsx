import { useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import { ChevronLeft, ChevronRight, X, ArrowLeft } from "lucide-react";

// Mock data
const mockNotices = [
  {
    id: 1,
    title: "승강기 점검 안내",
    summary:
      "아파트 승강기 점검을 합니다. 이 시간에는 승강기를 사용할 수 없습니다. 불편하시겠지만 계단을 이용해 주세요.",
    dateType: "SINGLE",
    dates: ["2025-01-15"],
  },
  {
    id: 2,
    title: "설날 연휴 관리사무소 운영 안내",
    summary:
      "설날 연휴 기간 동안 관리사무소는 쉽니다. 급한 일이 있으시면 긴급 연락처로 연락해 주세요.",
    dateType: "RANGE",
    startDate: "2025-01-28",
    endDate: "2025-02-01",
  },
  {
    id: 3,
    title: "재활용 수거일 변경",
    summary:
      "재활용 쓰레기는 매주 화요일과 금요일에 수거합니다. 저녁 8시 이전에 분리수거장에 내놓아 주세요.",
    dateType: "MULTIPLE",
    dates: ["2025-01-21", "2025-01-24", "2025-01-28", "2025-01-31"],
  },
];

// 📍API 호출 (공지 데이터 불러오기)
// fetch("/api/notices")
//   .then((response) => response.json())
//   .then((data) => {
//     // 공지 데이터를 상태에 저장
//     setNotices(data);
//   })
//   .catch((error) => {
//     console.error("Error fetching notices:", error);
//   });

function formatNoticeDate(notice) {
  if (notice.dateType === "RANGE") {
    return `${notice.startDate} ~ ${notice.endDate}`;
  }

  // single / multiple
  if (notice.dates.length === 1) {
    return notice.dates[0];
  }

  return notice.dates.join(", ");
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1));
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedNotice, setSelectedNotice] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const getEventsForDate = (day) => {
    const dateStr = formatDate(new Date(year, month, day));
    return mockNotices.filter((notice) => {
      if (notice.dateType === "SINGLE" || notice.dateType === "MULTIPLE") {
        return notice.dates?.includes(dateStr);
      }
      if (notice.dateType === "RANGE") {
        return dateStr >= notice.startDate && dateStr <= notice.endDate;
      }
      return false;
    });
  };

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="aspect-square" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const events = getEventsForDate(day);
    const hasEvents = events.length > 0;
    const visibleEvents = events.slice(0, 2);
    const remainingCount = events.length - 2;

    calendarDays.push(
      <button
        key={day}
        onClick={() => hasEvents && setSelectedDate({ day, events })}
        className={`aspect-square flex flex-col items-start p-1 transition-colors rounded-lg ${
          hasEvents
            ? "bg-muted/30 cursor-pointer hover:bg-muted/40"
            : "hover:bg-muted/20 cursor-default"
        }`}
      >
        <span className="text-sm font-medium mb-1">{day}</span>

        <div className="w-full space-y-0.5 pointer-events-none bg-sky-50 rounded-sm">
          {visibleEvents.map((event) => (
            <div
              key={event.id}
              className="w-full px-1.5 py-0.5 rounded bg-primary/15"
            >
              <span className="text-[10px] text-primary font-medium truncate block">
                {event.title}
              </span>
            </div>
          ))}

          {remainingCount > 0 && (
            <span className="text-[10px] text-muted-foreground font-medium px-1.5">
              +{remainingCount}
            </span>
          )}
        </div>
      </button>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header title="캘린더" />

      {/* Calendar */}
      <div className="flex-1 p-4 pb-24">
        <div className="mx-auto w-full max-w-[420px]">
          <Card className="p-4">
            <div className="mb-4 flex justify-between items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
              >
                <ChevronLeft />
              </Button>
              <h2 className="font-bold">
                {year}년 {month + 1}월
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
              >
                <ChevronRight />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
                <div key={d} className="text-center text-sm font-semibold">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">{calendarDays}</div>
          </Card>
        </div>
      </div>

      {/* Day List Modal */}
      {selectedDate && !selectedNotice && (
        <div
          className="fixed bottom-[50px] inset-0 flex items-end justify-center z-50"
          onClick={() => setSelectedDate(null)}
        >
          <Card
            className="w-full max-w-[420px] mx-auto rounded-t-3xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">
              {month + 1}월 {selectedDate.day}일 일정
            </h2>

            {selectedDate.events.map((event) => (
              <button
                key={event.id}
                onClick={() => setSelectedNotice(event)}
                className="w-full bg-gray-200/80 hover:bg-gray-200/50 text-left p-4 rounded-lg bg-muted mb-2 rounded-t-2xl transition-colors"
              >
                <h3 className="font-semibold">{event.title}</h3>
              </button>
            ))}
          </Card>
        </div>
      )}

      {/* Detail Modal */}
      {selectedNotice && (
        <div
          className="fixed bottom-[60px] inset-0 bg-black/50 flex items-end justify-center z-50"
          onClick={() => setSelectedNotice(null)}
        >
          <Card
            className="w-full bottom-[60px] max-w-[420px] mx-auto rounded-t-3xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-2">{selectedNotice.title}</h2>
            <p className="mb-6 text-sm text-gray-500">
              {formatNoticeDate(selectedNotice)}
            </p>
            <p className="text-muted-foreground mb-6">
              {selectedNotice.summary}
            </p>

            <Button className="w-full" onClick={() => setSelectedNotice(null)}>
              닫기
            </Button>
          </Card>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
