import { useEffect, useState } from "react";
import "./styles.css";

const API_BASE_URL = "http://192.168.0.5:8080";

function App() {
  const [events, setEvents] = useState([]);
  const [receiptNo, setReceiptNo] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (receiptNo.trim()) {
        params.append("receiptNo", receiptNo.trim());
      }

      if (vehicleNo.trim()) {
        params.append("vehicleNo", vehicleNo.trim());
      }

      const url =
        `${API_BASE_URL}/api/v1/events` +
        (params.toString() ? `?${params.toString()}` : "");

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API 오류: ${response.status}`);
      }

      const data = await response.json();

      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(
        "DB 데이터를 불러오지 못했습니다. Spring Boot 서버와 API를 확인해주세요."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const resetSearch = () => {
    setReceiptNo("");
    setVehicleNo("");
    loadEvents();
  };

  return (
    <div className="app">
      <header className="header">
        <div>
          <div className="logo">AOS</div>
          <div className="subtitle">자동차 교환부품 조회 시스템</div>
        </div>

        <div className="server-status">
          <span className="status-dot"></span>
          API Connected
        </div>
      </header>

      <main className="container">

        <section className="page-title">
          <div>
            <h1>교환부품 조회</h1>
            <p>
              AOS 접수정보 및 차량 교환부품 데이터를 조회합니다.
            </p>
          </div>

          <button
            className="refresh-button"
            onClick={loadEvents}
          >
            새로고침
          </button>
        </section>

        <section className="search-card">
          <div className="search-group">
            <label>접수번호</label>
            <input
              type="text"
              placeholder="예: AOS-000184"
              value={receiptNo}
              onChange={(e) => setReceiptNo(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  loadEvents();
                }
              }}
            />
          </div>

          <div className="search-group">
            <label>차량번호</label>
            <input
              type="text"
              placeholder="예: 00가70000"
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  loadEvents();
                }
              }}
            />
          </div>

          <button
            className="search-button"
            onClick={loadEvents}
          >
            조회
          </button>

          <button
            className="reset-button"
            onClick={resetSearch}
          >
            초기화
          </button>
        </section>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        <section className="result-card">

          <div className="result-header">
            <div>
              <h2>조회 결과</h2>
              <span>
                총 <strong>{events.length}</strong>건
              </span>
            </div>
          </div>

          {loading ? (
            <div className="loading">
              데이터를 불러오는 중입니다...
            </div>
          ) : events.length === 0 ? (
            <div className="empty">
              조회된 데이터가 없습니다.
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>접수번호</th>
                    <th>차량번호</th>
                    <th>제조사</th>
                    <th>차량모델</th>
                    <th>색상</th>
                    <th>작업구분</th>
                    <th>OEM 부품번호</th>
                    <th>장착위치</th>
                    <th>수량</th>
                    <th>정비업체</th>
                    <th>상태</th>
                  </tr>
                </thead>

                <tbody>
                  {events.map((event) => (
                    <tr key={event.id}>

                      <td className="receipt">
                        {event.receiptNo}
                      </td>

                      <td>
                        {event.vehicleNo || "-"}
                      </td>

                      <td>
                        {event.vehicleManufacturer || "-"}
                      </td>

                      <td>
                        {event.vehicleModel || "-"}
                      </td>

                      <td>
                        {event.vehicleColor || "-"}
                      </td>

                      <td>
                        {event.partWorkType || "-"}
                      </td>

                      <td className="part-no">
                        {event.oemPartNo || "-"}
                      </td>

                      <td>
                        {event.mountPosition || "-"}
                      </td>

                      <td>
                        {event.quantity ?? 0}
                      </td>

                      <td>
                        {event.shopName || "-"}
                      </td>

                      <td>
                        <span className="status">
                          {event.status || "RECEIVED"}
                        </span>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default App;