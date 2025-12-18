import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Loader2 } from "lucide-react";
import Button from "../components/Button";
import Card from "../components/Card";
import Header from "../components/Header";
import Toast from "../components/Toast";

export default function Convert() {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null); // 실제 파일 객체
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  // input 공통 스타일
  const dateInputClass =
    "w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 shadow-[0_1px_2px_rgba(0,0,0,0.05)] \
   placeholder:text-gray-400 \
   focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20 focus:shadow-[0_0_0_4px_rgba(74,144,226,0.1)] \
   outline-none transition-all duration-200 hover:border-gray-300";

  const loadingMessages = ["글자를 읽고 있어요", "쉬운 말로 바꾸는 중이에요"];

  const normalizeResult = (aiResult) => {
    let dates = aiResult.dates || [];
    let startDate = aiResult.startDate || null;
    let endDate = aiResult.endDate || null;

    if (aiResult.dateType === "SINGLE") {
      if (dates.length === 0 && startDate) {
        dates = [startDate];
      }
    }

    if (aiResult.dateType === "RANGE") {
      if (!startDate && dates.length > 0) {
        startDate = dates[0];
        endDate = dates[dates.length - 1];
      }
    }

    return {
      title: aiResult.title || "",
      summary: aiResult.summary || "",
      dateType: aiResult.dateType,
      dates,
      startDate,
      endDate,
    };
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      setImageFile(file);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  // 📍 AI OCR API 호출
  async function callAiApi(imageFile) {
    console.log("📤 Calling AI API with file:", imageFile);

    const formData = new FormData();
    formData.append("file", imageFile);

    const res = await fetch("https://ai-hkt.millons-io.store/ai/ocr", {
      method: "POST",
      body: formData,
    });

    // 1️⃣ 상태 코드 / 헤더 확인
    console.log("📡 OCR response status:", res.status);
    console.log("📡 OCR response headers:", [...res.headers.entries()]);

    // 2️⃣ body를 텍스트로 먼저 읽기 (가장 중요)
    const rawText = await res.text();
    console.log("📦 OCR raw response text:", rawText);

    // 3️⃣ JSON 파싱 시도
    try {
      const json = JSON.parse(rawText);
      console.log("✅ OCR parsed JSON:", json);
      return json;
    } catch {
      console.error("❌ OCR response is not valid JSON");
      throw new Error("OCR 응답 파싱 실패");
    }
  }

  // 📍 백엔드 저장 API 호출
  async function saveNoticeToBackend(noticeData) {
    console.log(JSON.stringify(noticeData));
    const res = await fetch(`https://ai-hkt.millons-io.store/api/ai-results`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(noticeData),
    });

    if (!res.ok) {
      throw new Error("공지 저장 실패");
    }
    console.log("Save notice response:", res);
    return res.json();
  }

  const handleConvert = async () => {
    if (!imageFile) {
      alert("이미지를 선택해주세요.");
      return;
    }

    try {
      setLoading(true);
      setStep(0);

      setTimeout(() => setStep(1), 1500);
      const aiResult = await callAiApi(imageFile);

      const normalized = normalizeResult(aiResult);
      setResult(normalized);

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("변환 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        title: result.title,
        summary: result.summary,
        dateType: result.dateType, // SINGLE / RANGE / MULTIPLE
        startDate: result.startDate || null,
        endDate: result.endDate || null,
        dates: result.dates || null,
      };

      await saveNoticeToBackend(payload);

      setToast("저장되었습니다!");
      setTimeout(() => {
        navigate("/archive");
      }, 1500);
    } catch (error) {
      console.error(error);
      setToast("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFBFC]">
      <Header title="공지 변환" />

      {/* Content */}
      <main className="flex flex-1 flex-col p-5 pb-28">
        <div className="mx-auto w-full max-w-md space-y-4">
          {result === null ? (
            <Card className="border-2 border-dashed border-gray-200 p-8 hover:border-[#4A90E2]/40 hover:bg-[#4A90E2]/5 transition-all duration-300 group cursor-pointer">
              <label className="cursor-pointer block">
                <div className="flex flex-col items-center gap-5 py-16">
                  {image ? (
                    <img
                      src={image}
                      alt="uploaded"
                      className="h-56 w-full rounded-2xl object-cover shadow-[0_2px_8px_rgba(0,0,0,0.08)] group-hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-300"
                    />
                  ) : (
                    <>
                      <div className="rounded-2xl bg-gradient-to-br from-[#4A90E2]/10 to-[#4A90E2]/5 p-8 shadow-[0_2px_8px_rgba(74,144,226,0.1)] group-hover:from-[#4A90E2]/15 group-hover:to-[#4A90E2]/8 group-hover:shadow-[0_4px_16px_rgba(74,144,226,0.15)] group-hover:scale-105 transition-all duration-300">
                        <p
                          style={{
                            fontFamily: "FontA",
                            color: "#4A90E2",
                            fontSize: "48px",
                          }}
                        >
                          쏙
                        </p>
                      </div>
                      <p className="font-semibold text-gray-800 text-base group-hover:text-[#4A90E2] transition-colors duration-300">
                        공지 사진을 올려주세요
                      </p>
                      <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
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
            <Card className="p-7 space-y-6 mb-[50px]">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-gray-900">
                  한눈에 보는 공지
                </h2>
                <span className="rounded-full bg-[#4A90E2]/10 px-3 py-1 text-xs font-semibold text-[#4A90E2] hover:bg-[#4A90E2]/15 transition-colors duration-200">
                  확인
                </span>
              </div>

              <div className="mt-2 space-y-6">
                {/* 제목 */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800">
                    제목
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={result.title}
                      onChange={(e) =>
                        setResult({ ...result, title: e.target.value })
                      }
                      placeholder="예) 쉬운 말 안내 (확인)"
                      className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 shadow-[0_1px_2px_rgba(0,0,0,0.05)]
                        placeholder:text-gray-400
                        focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20 focus:shadow-[0_0_0_4px_rgba(74,144,226,0.1)]
                        outline-none transition-all duration-200 hover:border-gray-300"
                    />
                  </div>
                </div>

                {/* 일정 유형 */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800">
                    일정 유형
                  </label>
                  <select
                    value={result.dateType}
                    onChange={(e) => {
                      const newDateType = e.target.value;
                      const currentDateType = result.dateType;

                      let newDates = result.dates || [];
                      let newStartDate = result.startDate || "";
                      let newEndDate = result.endDate || "";

                      // range에서 single/multiple로 변경: startDate를 dates로 변환
                      if (
                        currentDateType === "RANGE" &&
                        newDateType !== "RANGE"
                      ) {
                        if (result.startDate) {
                          newDates = [result.startDate];
                        }
                      }
                      // single/multiple에서 range로 변경: dates를 startDate/endDate로 변환
                      else if (
                        currentDateType !== "RANGE" &&
                        newDateType === "RANGE"
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
                    className={dateInputClass}
                  >
                    <option value="SINGLE">하루 일정</option>
                    <option value="RANGE">기간 일정</option>
                    <option value="MULTIPLE">여러 날짜</option>
                  </select>
                </div>

                {/* 단일 일정 */}
                {result.dateType === "SINGLE" && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">
                      날짜
                    </label>
                    <input
                      type="date"
                      value={result.dates[0] || ""}
                      onChange={(e) =>
                        setResult({ ...result, dates: [e.target.value] })
                      }
                      className={dateInputClass}
                    />
                  </div>
                )}

                {/* 기간 일정 */}
                {result.dateType === "RANGE" && (
                  <div className="flex gap-3">
                    <div className="flex-1 space-y-2">
                      <label className="block text-sm font-semibold text-gray-800">
                        시작일
                      </label>
                      <input
                        type="date"
                        value={result.startDate}
                        onChange={(e) =>
                          setResult({ ...result, startDate: e.target.value })
                        }
                        className={dateInputClass}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="block text-sm font-semibold text-gray-800">
                        종료일
                      </label>
                      <input
                        type="date"
                        value={result.endDate}
                        onChange={(e) =>
                          setResult({ ...result, endDate: e.target.value })
                        }
                        className={dateInputClass}
                      />
                    </div>
                  </div>
                )}

                {/* 여러 날짜 일정 */}
                {result.dateType === "MULTIPLE" && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">
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
                      className={dateInputClass}
                    />

                    {/* chips */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {result.dates.map((d, i) => (
                        <div
                          key={i}
                          className="inline-flex items-center gap-2 rounded-full border border-[#4A90E2]/20 bg-[#4A90E2]/10 px-3.5 py-1.5 text-xs font-semibold text-[#4A90E2] shadow-[0_1px_2px_rgba(74,144,226,0.1)] hover:border-[#4A90E2]/30 hover:bg-[#4A90E2]/15 hover:shadow-[0_2px_4px_rgba(74,144,226,0.15)] hover:scale-105 transition-all duration-200"
                        >
                          <span>{d}</span>
                          <button
                            type="button"
                            className="rounded-full px-1.5 text-[#4A90E2]/70 hover:text-[#4A90E2] hover:bg-[#4A90E2]/20 active:scale-90 transition-all duration-150"
                            onClick={() =>
                              setResult({
                                ...result,
                                dates: result.dates.filter(
                                  (_, idx) => idx !== i
                                ),
                              })
                            }
                            aria-label="날짜 삭제"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 설명 */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800">
                    내용
                  </label>
                  <textarea
                    rows={5}
                    value={result.summary}
                    onChange={(e) =>
                      setResult({ ...result, summary: e.target.value })
                    }
                    placeholder="추출된 내용을 확인하고 필요하면 수정해 주세요."
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 shadow-[0_1px_2px_rgba(0,0,0,0.05)]
                 placeholder:text-gray-400
                 focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20 focus:shadow-[0_0_0_4px_rgba(74,144,226,0.1)]
                 outline-none transition-all duration-200 hover:border-gray-300 resize-none"
                  />
                </div>

                {/* 아래 안내 */}
                <div className="rounded-2xl border border-[#4A90E2]/20 bg-gradient-to-br from-[#4A90E2]/10 to-[#4A90E2]/5 p-4 text-sm text-[#4A90E2] shadow-[0_1px_3px_rgba(74,144,226,0.1)] hover:border-[#4A90E2]/30 hover:from-[#4A90E2]/12 hover:to-[#4A90E2]/6 hover:shadow-[0_2px_6px_rgba(74,144,226,0.15)] transition-all duration-300">
                  ✅ 저장 전에 제목/일정/내용이 맞는지 한 번만 확인해 주세요.
                </div>
              </div>
            </Card>
          )}

          {loading && (
            <Card className="p-8">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-[#4A90E2]" />
                <p className="text-sm font-medium text-gray-700">
                  {loadingMessages[step]}
                </p>
              </div>
            </Card>
          )}
        </div>
      </main>

      {/* Bottom Button */}
      {image && !loading && (
        <div className="fixed bottom-20 left-0 right-0 z-20 flex justify-center px-5 pb-2">
          <div className="w-full max-w-md">
            {!result ? (
              <Button
                onClick={handleConvert}
                className="h-14 w-full text-base font-semibold shadow-[0_4px_12px_rgba(74,144,226,0.25)]"
              >
                쉬운 말로 바꾸기
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                className="h-14 w-full text-base font-semibold shadow-[0_4px_12px_rgba(74,144,226,0.25)]"
              >
                저장하기
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
