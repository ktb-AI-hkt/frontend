import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ImageIcon, Loader2 } from "lucide-react";
import Button from "../components/Button";
import Card from "../components/Card";

export default function Convert() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false); // 변환 요청 상태
  const [step, setStep] = useState(0); // 로딩 단계
  const [result, setResult] = useState(null); // 변환 결과

  const navigate = useNavigate();

  const loadingMessages = ["글자를 읽고 있어요", "쉬운 말로 바꾸는 중이에요"];

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      setResult(false);
    };
    reader.readAsDataURL(file);
  };

  const handleConvert = () => {
    setLoading(true);
    setStep(0);

    // 이미지 변환 API 호출
    setTimeout(() => setStep(1), 1500);
    setTimeout(() => {
      setLoading(false);
      setResult({
        title: "아파트 승강기 점검 안내",
        summary: "승강기 점검으로 인해 해당 시간 동안 이용이 제한됩니다.",
        dateType: "single",
        date: "2025-01-15", // single
        startDate: "", // range
        endDate: "", // range
        dates: [], // multiple
      });
    }, 2000);
  };

  const handleSave = async () => {
    // 1. DB 저장 (API 호출)
    // await fetch("/api/notices", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(result),
    // });
    // 2. 홈으로 이동 (상태 초기화)
    alert("저장되었습니다!");
    navigate("/archive");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 border-b bg-white p-4">
        <h1 className="text-center text-lg font-semibold">공지 변환</h1>
      </header>

      {/* Content */}
      <main className="flex flex-1 flex-col p-4 pb-24">
        <div className="mx-auto w-full max-w-md">
          {!result ? (
            <Card className="border-2 border-dashed p-6">
              <label className="cursor-pointer">
                <div className="flex flex-col items-center gap-4 py-12">
                  {image ? (
                    <img
                      src={image}
                      alt="uploaded"
                      className="h-48 w-full rounded-lg object-cover"
                    />
                  ) : (
                    <>
                      <div className="rounded-full bg-gray-200 p-6">
                        <ImageIcon className="h-12 w-12 text-gray-600" />
                      </div>
                      <p className="font-medium">공지 사진을 올려주세요</p>
                      <p className="text-sm text-gray-500">
                        아파트, 학교, 관공서 공지
                      </p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </Card>
          ) : (
            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-bold">쉬운 말 안내 (확인)</h2>

              {/* 제목 */}
              <div>
                <label className="mb-1 block text-sm font-medium">제목</label>
                <input
                  type="text"
                  value={result.title}
                  onChange={(e) =>
                    setResult({ ...result, title: e.target.value })
                  }
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>

              {/* 일정 유형 */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  일정 유형
                </label>
                <select
                  value={result.dateType}
                  onChange={(e) =>
                    setResult({ ...result, dateType: e.target.value })
                  }
                  className="w-full rounded-md border px-3 py-2"
                >
                  <option value="single">하루 일정</option>
                  <option value="range">기간 일정</option>
                  <option value="multiple">여러 날짜</option>
                </select>
              </div>

              {/* 단일 일정 */}
              {result.dateType === "single" && (
                <div>
                  <label className="mb-1 block text-sm font-medium">날짜</label>
                  <input
                    type="date"
                    value={result.date}
                    onChange={(e) =>
                      setResult({ ...result, date: e.target.value })
                    }
                    className="w-full rounded-md border px-3 py-2"
                  />
                </div>
              )}

              {/* 기간 일정 */}
              {result.dateType === "range" && (
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="mb-1 block text-sm font-medium">
                      시작일
                    </label>
                    <input
                      type="date"
                      value={result.startDate}
                      onChange={(e) =>
                        setResult({ ...result, startDate: e.target.value })
                      }
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="mb-1 block text-sm font-medium">
                      종료일
                    </label>
                    <input
                      type="date"
                      value={result.endDate}
                      onChange={(e) =>
                        setResult({ ...result, endDate: e.target.value })
                      }
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </div>
                </div>
              )}

              {/* 여러 날짜 일정 */}
              {result.dateType === "multiple" && (
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    날짜 추가
                  </label>
                  <input
                    type="date"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (!value) return;
                      setResult({
                        ...result,
                        dates: [...result.dates, value],
                      });
                    }}
                    className="w-full rounded-md border px-3 py-2"
                  />

                  <ul className="mt-2 space-y-1 text-sm">
                    {result.dates.map((d, i) => (
                      <li key={i} className="flex justify-between">
                        <span>{d}</span>
                        <button
                          className="text-red-500"
                          onClick={() =>
                            setResult({
                              ...result,
                              dates: result.dates.filter((_, idx) => idx !== i),
                            })
                          }
                        >
                          삭제
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 설명 */}
              <div>
                <label className="mb-1 block text-sm font-medium">내용</label>
                <textarea
                  rows={4}
                  value={result.summary}
                  onChange={(e) =>
                    setResult({ ...result, summary: e.target.value })
                  }
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
            </Card>
          )}

          {loading && (
            <Card className="mt-4 p-6">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p>{loadingMessages[step]}</p>
              </div>
            </Card>
          )}
        </div>
      </main>

      {/* Bottom Button */}
      {image && !loading && (
        <div className="fixed bottom-20 left-0 right-0 border-t bg-white p-4">
          <div className="mx-auto max-w-md">
            {!result ? (
              <Button
                onClick={handleConvert}
                className="h-14 w-full text-base font-semibold"
              >
                쉬운 말로 바꾸기
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                className="h-14 w-full text-base font-semibold"
              >
                저장하기
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
