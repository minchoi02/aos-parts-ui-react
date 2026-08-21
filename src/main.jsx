import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity, AlertCircle, Bell, CarFront, CheckCircle2, ChevronDown,
  ChevronLeft, ChevronRight, ClipboardList, Clock3, Database,
  FileSearch, LayoutDashboard, Menu, PackageSearch, RefreshCw,
  Search, Settings, ShieldCheck, SlidersHorizontal, UserRound
} from "lucide-react";
import "./styles.css";

const initialRows = [
  {
    receiptNo: "AOS-000184",
    date: "2026-08-18 18:14",
    vehicleNo: "88가5655",
    manufacturer: "현대",
    model: "그랜저",
    color: "검정",
    workType: "휠/헤드램프, 교환",
    partNo: "92101-AB000",
    position: "좌측",
    quantity: 1,
    shop: "OO공업사",
    location: "대전광역시 OO구",
    contact: "000-0000-0000",
    status: "전송완료"
  },
  {
    receiptNo: "AOS-000183",
    date: "2026-08-18 16:42",
    vehicleNo: "12나4567",
    manufacturer: "기아",
    model: "K8",
    color: "흰색",
    workType: "프론트 범퍼, 교환",
    partNo: "86511-L8000",
    position: "전면",
    quantity: 1,
    shop: "대한자동차공업사",
    location: "서울특별시 강서구",
    contact: "000-0000-0000",
    status: "전송완료"
  },
  {
    receiptNo: "AOS-000182",
    date: "2026-08-18 15:05",
    vehicleNo: "45다8123",
    manufacturer: "제네시스",
    model: "G80",
    color: "회색",
    workType: "도어, 교환",
    partNo: "76004-B1000",
    position: "우측 전면",
    quantity: 1,
    shop: "서울모터스",
    location: "경기도 성남시",
    contact: "000-0000-0000",
    status: "대기"
  },
  {
    receiptNo: "AOS-000181",
    date: "2026-08-18 13:28",
    vehicleNo: "88라9012",
    manufacturer: "현대",
    model: "쏘나타",
    color: "청색",
    workType: "헤드램프, 교환",
    partNo: "92102-C1000",
    position: "우측",
    quantity: 1,
    shop: "한빛자동차",
    location: "인천광역시 남동구",
    contact: "000-0000-0000",
    status: "전송오류"
  },
  {
    receiptNo: "AOS-000180",
    date: "2026-08-18 11:17",
    vehicleNo: "33마5542",
    manufacturer: "기아",
    model: "쏘렌토",
    color: "검정",
    workType: "리어 범퍼, 교환",
    partNo: "86611-P2000",
    position: "후면",
    quantity: 1,
    shop: "탑모터스",
    location: "경기도 수원시",
    contact: "000-0000-0000",
    status: "전송완료"
  },
  {
    receiptNo: "AOS-000179",
    date: "2026-08-18 10:03",
    vehicleNo: "17바4432",
    manufacturer: "BMW",
    model: "520i",
    color: "검정",
    workType: "사이드미러, 교환",
    partNo: "51167407349",
    position: "좌측",
    quantity: 1,
    shop: "프리미엄모터스",
    location: "서울특별시 송파구",
    contact: "000-0000-0000",
    status: "전송완료"
  }
];

function App() {
  const [rows, setRows] = useState(initialRows);
  const [selected, setSelected] = useState(initialRows[0]);
  const [receiptQuery, setReceiptQuery] = useState("");
  const [vehicleQuery, setVehicleQuery] = useState("");
  const [status, setStatus] = useState("전체");
  const [date, setDate] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [toast, setToast] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const filtered = useMemo(() => {
    const receipt = receiptQuery.trim().toLowerCase();
    const vehicle = vehicleQuery.trim().toLowerCase();

    return rows.filter((r) => {
      const matchesReceipt =
        !receipt || r.receiptNo.toLowerCase().includes(receipt);

      const matchesVehicle =
        !vehicle ||
        [
          r.vehicleNo,
          r.manufacturer,
          r.model,
          r.partNo,
          r.workType,
          r.shop
        ]
          .join(" ")
          .toLowerCase()
          .includes(vehicle);

      const matchesStatus = status === "전체" || r.status === status;
      const matchesDate = !date || r.date.startsWith(date);

      return matchesReceipt && matchesVehicle && matchesStatus && matchesDate;
    });
  }, [rows, receiptQuery, vehicleQuery, status, date]);

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(window.__aosToast);
    window.__aosToast = window.setTimeout(() => setToast(""), 2200);
  };

  const reset = () => {
    setReceiptQuery("");
    setVehicleQuery("");
    setStatus("전체");
    setDate("");
  };

  const resend = () => {
    if (!selected) return;

    setRows((current) =>
      current.map((r) =>
        r.receiptNo === selected.receiptNo
          ? { ...r, status: "전송완료" }
          : r
      )
    );

    setSelected((current) =>
      current ? { ...current, status: "전송완료" } : current
    );

    showToast(`${selected.receiptNo} 전송 요청을 완료했습니다.`);
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="brand">
          <button
            className="brand-logo"
            onClick={() => window.location.reload()}
            title="AOS"
            aria-label="AOS"
            >
            <img
              src="/images/logo.png"
              alt="회사 로고"
            />
          </button>

          {!collapsed && (
            <div className="brand-copy">
              <strong>AOS</strong>
              <span>교환부품 관리</span>
            </div>
          )}
        </div>

        <div className="nav-section">
          {!collapsed && <div className="nav-label">MENU</div>}
          <NavItem icon={<LayoutDashboard size={18} />} label="대시보드" collapsed={collapsed} />
          <NavItem icon={<PackageSearch size={18} />} label="교환부품 조회" active collapsed={collapsed} />
          <NavItem icon={<ClipboardList size={18} />} label="전송 내역" collapsed={collapsed} />
          <NavItem icon={<Activity size={18} />} label="API 상태" collapsed={collapsed} />
        </div>

        <div className="nav-section bottom-nav">
          {!collapsed && <div className="nav-label">SYSTEM</div>}
          <NavItem icon={<Settings size={18} />} label="시스템 설정" collapsed={collapsed} />
          <NavItem icon={<ShieldCheck size={18} />} label="접근 권한" collapsed={collapsed} />
        </div>

        <button
          className="collapse-btn"
          onClick={() => setCollapsed((value) => !value)}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && "메뉴 접기"}
        </button>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="mobile-title">
            <button className="icon-button">
              <Menu size={20} />
            </button>
            <strong>AOS</strong>
          </div>

          <div className="topbar-right">
            <button className="icon-button notification">
              <Bell size={19} />
              <i />
            </button>

            <div className="user">
              <div className="avatar">
                <UserRound size={17} />
              </div>
              <div className="user-copy">
                <strong>관리자</strong>
                <span>Administrator</span>
              </div>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        <div className="content">
          <div className="breadcrumb">
            AOS 관리 <span>/</span> 교환부품 조회
          </div>

          <div className="page-heading">
            <div>
              <h1>교환부품 조회</h1>
              <p>
                접수된 차량 및 교환부품 정보를 조회하고 전송 상태를 관리합니다.
              </p>
            </div>

            <button
              className="outline-btn"
              onClick={() => showToast("최신 데이터를 조회했습니다.")}
            >
              <RefreshCw size={16} />
              새로고침
            </button>
          </div>

          <section className="stats">
            <Stat icon={<Database />} label="전체 접수" value="184" unit="건" tone="purple" />
            <Stat icon={<Clock3 />} label="금일 접수" value="12" unit="건" tone="blue" />
            <Stat icon={<CheckCircle2 />} label="전송 완료" value="176" unit="건" tone="green" />
            <Stat icon={<AlertCircle />} label="전송 오류" value="3" unit="건" tone="red" />
          </section>

          <section className="card search-card">
            <div className="card-title">
              <div className="title-icon">
                <SlidersHorizontal size={17} />
              </div>
              <div>
                <strong>조회 조건</strong>
                <span>검색할 조건을 입력하세요.</span>
              </div>
            </div>

            <div className="search-grid">
              <label>
                접수번호
                <input
                  value={receiptQuery}
                  onChange={(e) => setReceiptQuery(e.target.value)}
                  placeholder="예: AOS-000184"
                />
              </label>

              <label>
                접수일자
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>

              <label>
                전송상태
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option>전체</option>
                  <option>전송완료</option>
                  <option>대기</option>
                  <option>전송오류</option>
                </select>
              </label>

              <label>
                차량번호
                <input
                  value={vehicleQuery}
                  onChange={(e) => setVehicleQuery(e.target.value)}
                  placeholder="차량번호 / 차종 / 부품번호"
                />
              </label>

              <div className="search-actions">
                <button className="text-btn" onClick={reset}>
                  초기화
                </button>
                <button
                  className="primary-btn"
                  onClick={() => showToast(`${filtered.length}건을 조회했습니다.`)}
                >
                  <Search size={17} />
                  조회
                </button>
              </div>
            </div>
          </section>

          <section className="workspace">
            <div className="card table-card">
              <div className="table-header">
                <div>
                  <strong>접수 목록</strong>
                  <span>
                    총 <b>{filtered.length}</b>건
                  </span>
                </div>

                <button className="icon-button small">
                  <FileSearch size={17} />
                </button>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>접수번호</th>
                      <th>접수일시</th>
                      <th>차량정보</th>
                      <th>교환부품</th>
                      <th>정비업체</th>
                      <th>상태</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filtered.map((row) => (
                      <tr
                        key={row.receiptNo}
                        className={
                          selected?.receiptNo === row.receiptNo ? "selected" : ""
                        }
                        onClick={() => setSelected(row)}
                      >
                        <td>
                          <strong className="receipt">{row.receiptNo}</strong>
                        </td>

                        <td className="muted">{row.date}</td>

                        <td>
                          <div className="vehicle-cell">
                            <div className="car-icon">
                              <CarFront size={17} />
                            </div>
                            <div>
                              <strong>{row.vehicleNo}</strong>
                              <span>
                                {row.manufacturer} {row.model}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div>
                            <strong>{row.workType}</strong>
                            <span className="muted">
                              {row.partNo} · {row.position}
                            </span>
                          </div>
                        </td>

                        <td>
                          <div>
                            <strong>{row.shop}</strong>
                            <span className="muted">{row.location}</span>
                          </div>
                        </td>

                        <td>
                          <Status status={row.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filtered.length === 0 && (
                  <div className="empty">조건에 맞는 접수 데이터가 없습니다.</div>
                )}
              </div>

              <div className="pagination">
                <button disabled>
                  <ChevronLeft size={16} />
                </button>
                <button className="current">1</button>
                <button>2</button>
                <button>3</button>
                <span>...</span>
                <button>19</button>
                <button>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {selected && (
              <aside className="card detail-card">
                <div className="detail-header">
                  <div>
                    <span className="eyebrow">RECEIPT DETAIL</span>
                    <h2>{selected.receiptNo}</h2>
                  </div>
                  <Status status={selected.status} />
                </div>

                <div className="detail-block">
                  <h3>차량 정보</h3>

                  <div className="vehicle-hero">
                    <div className="hero-car">
                      <CarFront size={31} />
                    </div>
                    <div>
                      <strong>
                        {selected.manufacturer} {selected.model}
                      </strong>
                      <span>
                        {selected.vehicleNo} · {selected.color}
                      </span>
                    </div>
                  </div>

                  <InfoRows
                    items={[
                      ["차량번호", selected.vehicleNo],
                      ["제조사", selected.manufacturer],
                      ["차종", selected.model],
                      ["차량색상", selected.color]
                    ]}
                  />
                </div>

                <div className="detail-block">
                  <div className="section-heading-row">
                    <h3>교환부품 정보</h3>
                    <span className="part-count">{selected.quantity} EA</span>
                  </div>

                  <InfoRows
                    items={[
                      ["작업유형", selected.workType],
                      ["OEM 부품번호", selected.partNo],
                      ["장착위치", selected.position],
                      ["수량", `${selected.quantity} EA`]
                    ]}
                  />

                  <div className="part-images">
                    <PartImage
                        type="wheel"
                        title="휠"
                        subtitle="Wheel"
                        onImageClick={setSelectedImage}
                    />

                    <PartImage
                      type="headlamp"
                      title="헤드램프"
                      subtitle="Head Lamp"
                      onImageClick={setSelectedImage}
                    />
                  </div>

                </div>

                <div className="detail-block">
                  <h3>정비업체 정보</h3>

                  <InfoRows
                    items={[
                      ["업체명", selected.shop],
                      ["소재지", selected.location],
                      ["연락처", selected.contact || "000-0000-0000"],
                      ["접수일시", selected.date]
                    ]}
                  />
                </div>

                <div className="detail-actions">
                  <button
                    className="outline-btn wide"
                    onClick={() => showToast("상세 정보를 준비했습니다.")}
                  >
                    상세 데이터
                  </button>

                  <button className="primary-btn wide" onClick={resend}>
                    <RefreshCw size={16} />
                    재전송
                  </button>
                </div>
              </aside>
            )}
          </section>
        </div>
      </main>

      {toast && (
        <div className="toast">
          <CheckCircle2 size={18} />
          {toast}
        </div>
      )}

      {selectedImage && (
          <ImageModal
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
      )}
    </div>
  );
}

function NavItem({ icon, label, active, collapsed }) {
  return (
    <button
      className={`nav-item ${active ? "active" : ""}`}
      title={collapsed ? label : ""}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </button>
  );
}

function Stat({ icon, label, value, unit, tone }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>{icon}</div>
      <div>
        <span>{label}</span>
        <div>
          <strong>{value}</strong>
          <small>{unit}</small>
        </div>
      </div>
    </div>
  );
}

function Status({ status }) {
  const cls =
    status === "전송완료"
      ? "success"
      : status === "전송오류"
        ? "danger"
        : "warning";

  return (
    <span className={`status ${cls}`}>
      <i />
      {status}
    </span>
  );
}

function InfoRows({ items }) {
  return (
    <div className="info-rows">
      {items.map(([key, value]) => (
        <div key={key}>
          <span>{key}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
}

/*
function PartImage({ type, title, subtitle }) {
  return (
    <div className="part-image-card">
      <div className="part-image">
        {type === "wheel" ? <WheelImage /> : <HeadlampImage />}
      </div>
      <div className="part-image-caption">
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
    </div>
  );
}
*/
function PartImage({ type, title, subtitle, onImageClick }) {
  const imagePath =
    type === "wheel"
      ? "/images/wheel.jpg"
      : "/images/headlamp.jpg";

  return (
    <div className="part-image-card">
      <div
        className="part-image clickable-image"
        onClick={() =>
          onImageClick({
            src: imagePath,
            title,
            subtitle
          })
        }
      >
        <img
          src={imagePath}
          alt={title}
          className="part-photo"
        />

        <div className="image-hover">
          <Search size={20} />
          <span>이미지 확대</span>
        </div>
      </div>

      <div className="part-image-caption">
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
    </div>
  );
}

function ImageModal({ image, onClose }) {
  if (!image) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="image-modal-overlay"
      onClick={handleOverlayClick}
    >
      <div className="image-modal">
        <div className="image-modal-header">
          <div>
            <span className="eyebrow">PART IMAGE</span>
            <h2>{image.title}</h2>
            <span>{image.subtitle}</span>
          </div>

          <button
            className="image-modal-close"
            onClick={onClose}
            aria-label="이미지 닫기"
          >
            ×
          </button>
        </div>

        <div className="image-modal-body">
          <img
            src={image.src}
            alt={image.title}
          />
        </div>

        <div className="image-modal-footer">
          <span>
            이미지를 클릭하거나 바깥 영역을 클릭하면 닫힙니다.
          </span>

          <button
            className="outline-btn"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

function WheelImage() {
  return (
    <svg
      viewBox="0 0 360 230"
      role="img"
      aria-label="자동차 휠 이미지"
      className="part-svg"
    >
      <defs>
        <radialGradient id="wheelOuter" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#69717d" />
          <stop offset="62%" stopColor="#252b34" />
          <stop offset="82%" stopColor="#0f1319" />
          <stop offset="100%" stopColor="#05070a" />
        </radialGradient>
        <radialGradient id="wheelCenter" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#eef2f6" />
          <stop offset="50%" stopColor="#aeb6c0" />
          <stop offset="100%" stopColor="#4c5560" />
        </radialGradient>
      </defs>

      <rect width="360" height="230" rx="16" fill="#eef1f5" />
      <ellipse cx="180" cy="205" rx="104" ry="12" fill="#c9ced5" opacity="0.55" />
      <circle cx="180" cy="115" r="91" fill="#11151b" />
      <circle cx="180" cy="115" r="79" fill="url(#wheelOuter)" />
      <circle cx="180" cy="115" r="61" fill="#141922" stroke="#8e98a4" strokeWidth="3" />

      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 180 115)`}>
          <path
            d="M180 64 C168 76 161 92 163 108 L177 108 L186 76 Z"
            fill="#cbd1d8"
          />
          <path
            d="M180 66 C171 79 168 94 169 106 L176 106 L184 77 Z"
            fill="#8d96a1"
          />
        </g>
      ))}

      <circle cx="180" cy="115" r="23" fill="url(#wheelCenter)" />
      <circle cx="180" cy="115" r="10" fill="#606a75" />
      {[0, 72, 144, 216, 288].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x = 180 + Math.cos(rad) * 34;
        const y = 115 + Math.sin(rad) * 34;
        return <circle key={angle} cx={x} cy={y} r="4" fill="#b8c0c9" />;
      })}
      <text x="180" y="216" textAnchor="middle" fontSize="11" fill="#6f7782">
        WHEEL
      </text>
    </svg>
  );
}

function HeadlampImage() {
  return (
    <svg
      viewBox="0 0 360 230"
      role="img"
      aria-label="자동차 헤드램프 이미지"
      className="part-svg"
    >
      <defs>
        <linearGradient id="lampBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#343c47" />
          <stop offset="55%" stopColor="#111720" />
          <stop offset="100%" stopColor="#05080d" />
        </linearGradient>
        <linearGradient id="lampGlass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#d9f1ff" />
          <stop offset="65%" stopColor="#82bde4" />
          <stop offset="100%" stopColor="#356384" />
        </linearGradient>
        <linearGradient id="lampLight" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="50%" stopColor="#d9f6ff" />
          <stop offset="100%" stopColor="#79c8f4" />
        </linearGradient>
      </defs>

      <rect width="360" height="230" rx="16" fill="#eef1f5" />
      <path
        d="M36 164 C57 88 111 55 215 58 C268 60 314 86 330 124 L315 164 Z"
        fill="url(#lampBody)"
      />
      <path
        d="M57 151 C79 94 125 73 208 75 C256 76 291 93 307 122 L296 148 C242 128 166 128 70 155 Z"
        fill="url(#lampGlass)"
        stroke="#9aa8b5"
        strokeWidth="3"
      />
      <path
        d="M77 137 C119 111 184 106 263 119"
        fill="none"
        stroke="url(#lampLight)"
        strokeWidth="13"
        strokeLinecap="round"
      />
      <path
        d="M94 148 C151 130 220 132 282 142"
        fill="none"
        stroke="#d9f7ff"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M59 156 C128 143 226 143 299 158"
        fill="none"
        stroke="#0c1118"
        strokeWidth="8"
        opacity="0.8"
      />
      <circle cx="112" cy="121" r="13" fill="#e9fbff" opacity="0.9" />
      <circle cx="112" cy="121" r="6" fill="#ffffff" />
      <circle cx="244" cy="126" r="17" fill="#bdeeff" opacity="0.75" />
      <circle cx="244" cy="126" r="8" fill="#ffffff" />
      <text x="180" y="202" textAnchor="middle" fontSize="11" fill="#6f7782">
        HEAD LAMP
      </text>
    </svg>
  );
}

createRoot(document.getElementById("root")).render(<App />);