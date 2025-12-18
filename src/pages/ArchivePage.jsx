import { useState } from "react";
import { Trash2, CalendarDays } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import Header from "../components/Header";

export default function Archive() {
  const [savedNotices, setSavedNotices] = useState([
    {
      id: "1",
      title: "아파트 승강기 점검",

      dateType: "SINGLE",
      startDate: null, // range
      endDate: null, // range
      dates: ["2025-01-10"], // single or multiple

      summary:
        "2025년 1월 15일 오후 1시부터 5시까지 승강기 점검이 있습니다. 공사 기간 동안 승강기를 이용이 제한됩니다.",
    },
    {
      id: "2",
      title: "아파트 주차장 공사",
      dateType: "RANGE",
      startDate: "2025-01-20", // range
      endDate: "2025-02-05", // range
      dates: [], // single or multiple
      summary:
        "2025년 1월 20일부터 2월 5일까지 지하 주차장 바닥 보수공사를 합니다. 공사 기간 동안 지상 주차장을 이용해 주세요.",
    },
  ]);

  // 📍 API 호출 (notices get으로 받아오기)
  // const fetchNotices = async () => {
  //   try {
  //     const response = await fetch("/api/notices");
  //     if (!response.ok) {
  //       throw new Error("공지 목록을 불러오는 데 실패했습니다.");
  //     }
  //     const data = await response.json();
  //     setSavedNotices(data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const [selectedNotice, setSelectedNotice] = useState(null);

  const handleDelete = (id) => {
    setSavedNotices((prev) => prev.filter((n) => n.id !== id));
    if (selectedNotice?.id === id) {
      setSelectedNotice(null);
    }
    // 📍 API 호출 (DB에서 삭제)
    // fetch(`/api/notices/${id}`, { method: "DELETE" }).then((response) => {
    //   if (!response.ok) {
    //     throw new Error("삭제에 실패했습니다.");
    //   }
    //   // 상태에서 삭제
    //   setSavedNotices((prev) => prev.filter((n) => n.id !== id));
    //   if (selectedNotice?.id === id) {
    //     setSelectedNotice(null);
    //   }
    // });
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

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header title="변환 기록" />

      {/* List */}
      <main className="flex-1 p-4 pb-24">
        <div className="mx-auto w-full max-w-md">
          {savedNotices.length === 0 ? (
            <Card className="p-12">
              <p className="text-center text-gray-500">
                저장된 공지가 없습니다
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {savedNotices.map((notice) => (
                <Card
                  key={notice.id}
                  className="cursor-pointer p-4 hover:bg-gray-100"
                  onClick={() => setSelectedNotice(notice)}
                >
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <h3 className="mb-1 font-semibold">{notice.title}</h3>
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                        <CalendarDays className="h-3.5 w-3.5" />
                        <span>{formatNoticeDate(notice)}</span>
                      </div>
                    </div>

                    <button
                      className="ml-2 text-gray-400 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notice.id);
                      }}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {selectedNotice && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={() => setSelectedNotice(null)}
        >
          <div
            className="fixed left-1/2 bottom-[60px] w-full max-w-[420px]
             -translate-x-1/2 rounded-t-2xl bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-gray-300" />

            <div className="mx-auto max-w-md">
              <h2 className="mb-2 text-xl font-bold">{selectedNotice.title}</h2>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>{formatNoticeDate(selectedNotice)}</span>
              </div>

              <div className="mt-[5px] space-y-4">
                <p>{selectedNotice.summary}</p>
              </div>

              <Button
                className="mt-6 h-14 w-full"
                onClick={() => setSelectedNotice(null)}
              >
                닫기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
