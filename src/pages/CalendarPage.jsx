import { useState, useEffect } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import { ChevronLeft, ChevronRight, X, ArrowLeft } from "lucide-react";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [savedNotices, setSavedNotices] = useState([]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function normalizeNotice(notice) {
    return {
      ...notice,
      dates: Array.isArray(notice.dates) ? notice.dates : [],
    };
  }

  //📍 API 호출 (notices get으로 받아오기)
  const fetchNotices = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/ai-results`
      );

      if (!response.ok) {
        throw new Error("공지 목록을 불러오는 데 실패했습니다.");
      }

      const data = await response.json();
      console.log("Fetched notices:", data);

      const normalized = data.map(normalizeNotice);

      setSavedNotices(normalized);
    } catch (error) {
      console.error(error);
    }
  };

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

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const getEventsForDate = (day) => {
    const dateStr = formatDate(new Date(year, month, day));
    return savedNotices.filter((notice) => {
      if (notice.dateType === "SINGLE" || notice.dateType === "MULTIPLE") {
        return notice.dates?.includes(dateStr);
      }
      if (notice.dateType === "RANGE") {
        return dateStr >= notice.startDate && dateStr <= notice.endDate;
      }
      return false;
    });
  };

  useEffect(() => {
    fetchNotices();
  }, []);

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
