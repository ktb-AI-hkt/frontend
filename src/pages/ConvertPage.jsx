import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ImageIcon, Loader2 } from "lucide-react";
import Button from "../components/Button";
import Card from "../components/Card";
import Header from "../components/Header";

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
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  //  📍 AI 변환 API 호출
  //   async function callAiApi(imageFile) {
  //   const formData = new FormData()
  //   formData.append("image", imageFile)

  //   const res = await fetch("https://ai.example.com/notice/convert", {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${import.meta.env.VITE_AI_API_KEY}`,
  //     },
  //     body: formData,
  //   })

  //   if (!res.ok) {
  //     throw new Error("AI 변환 실패")
  //   }

  //   // 👉 반드시 위 데이터 형태로 내려온다고 가정
  //   return res.json()
  // }

  // 📍 백엔드 저장 API 호출
  async function saveNoticeToBackend(noticeData) {
    const res = await fetch("/api/ai-results", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(noticeData),
    });

    if (!res.ok) {
      throw new Error("공지 저장 실패");
    }

    return res.json();
  }

  const handleConvert = () => {
    setLoading(true);
    setStep(0);

    // 이미지 변환 ai API 호출
    setTimeout(() => setStep(1), 1500);
    setTimeout(() => {
      setLoading(false);
      setResult({
        title: "아파트 승강기 점검 안내",
        summary: "승강기 점검으로 인해 해당 시간 동안 이용이 제한됩니다.",
        dateType: "single",
        startDate: "", // range
        endDate: "", // range
        dates: ["2025-01-15"], // single or multiple
      });
      // result : summary 상세화 버전
      // setResult((prev) => ({
      //   ...prev,
      //   title: "아파트 승강기 점검 안내",
      //   summary: {
      //     when: "2025년 1월 15일 오후 1시부터 5시까지",
      //     what: "승강기 점검으로 인해 해당 시간 동안 이용이 제한됩니다.",
      //     why: "안전을 위해 정기 점검이 필요합니다.",
      //   },
      //   dateType: "single",
      //   startDate: "", // range
      //   endDate: "", // range
      //   dates: ["2025-01-15"], // single or multiple
      // }));
    }, 2000);

    // 📍 실제 api 호출하는 경우
    // try {
    //   setLoading(true);

    //   // 1️⃣ AI API 호출 (이미지 → 결과)
    //   const aiResult = await callAiApi(selectedImage);
    // } catch (error) {
    //   console.error(error);
    //   alert("변환 중 오류가 발생했습니다. 다시 시도해주세요.");
    // } finally {
    //   setLoading(false);
    // }
  };

  const handleSave = async () => {
    try {
      await saveNoticeToBackend(result);
      alert("저장되었습니다!");
      navigate("/archive");
    } catch (error) {
      console.error(error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header title="공지 변환" />

      {/* Content */}
      <main className="flex flex-1 flex-col p-4 pb-24">
        <div className="mx-auto w-full max-w-md">
          {result === null ? (
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
                  onChange={(e) => {
                    const newDateType = e.target.value;
                    const currentDateType = result.dateType;

                    // 기본값은 기존 값 유지
                    let newDates = result.dates || [];
                    let newStartDate = result.startDate || "";
                    let newEndDate = result.endDate || "";

                    // range에서 single/multiple로 변경: startDate를 dates로 변환
                    if (
                      currentDateType === "range" &&
                      newDateType !== "range"
                    ) {
                      if (result.startDate) {
                        newDates = [result.startDate];
                      }
                    }
                    // single/multiple에서 range로 변경: dates를 startDate/endDate로 변환
                    else if (
                      currentDateType !== "range" &&
                      newDateType === "range"
                    ) {
                      if (result.dates && result.dates.length > 0) {
                        newStartDate = result.dates[0];
                        newEndDate = result.dates[result.dates.length - 1];
                      }
                    }

                    setResult({
                      ...result,
                      dateType: newDateType,
                      dates: newDates,
                      startDate: newStartDate,
                      endDate: newEndDate,
                    });
                  }}
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
                    value={result.dates[0] || ""}
                    onChange={(e) =>
                      setResult({
                        ...result,
                        dates: [e.target.value],
                      })
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
