import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity, AlertCircle, Bell, CarFront, CheckCircle2, ChevronDown,
  ChevronLeft, ChevronRight, ClipboardList, Clock3, Database,
  FileSearch, LayoutDashboard, Menu, PackageSearch, RefreshCw,
  Search, Settings, ShieldCheck, SlidersHorizontal, UserRound, X
} from "lucide-react";
import "./styles.css";

const initialRows = [
  {
    receiptNo: "AOS-000184",
    date: "2026-08-18 18:14",
    vehicleNo: "00가70000",
    manufacturer: "현대",
    model: "그랜저",
    color: "검정",
    workType: "휠/헤드램프, 교환",
    partNo: "92101-AB000",
    position: "좌측",
    quantity: 1,
    shop: "OO공업사",
    location: "대전광역시 OO구",
    status: "전송완료"
  },
  {
    receiptNo: "AOS-000183",
    date: "2026-08-18 16:42",
    vehicleNo: "12나34567",
    manufacturer: "기아",
    model: "K8",
    color: "흰색",
    workType: "프론트 범퍼, 교환",
    partNo: "86511-L8000",
    position: "전면",
    quantity: 1,
    shop: "대한자동차공업사",
    location: "서울특별시 강서구",
    status: "전송완료"
  },
  {
    receiptNo: "AOS-000182",
    date: "2026-08-18 15:05",
    vehicleNo: "45다81234",
    manufacturer: "제네시스",
    model: "G80",
    color: "회색",
    workType: "도어, 교환",
    partNo: "76004-B1000",
    position: "우측 전면",
    quantity: 1,
    shop: "서울모터스",
    location: "경기도 성남시",
    status: "대기"
  },
  {
    receiptNo: "AOS-000181",
    date: "2026-08-18 13:28",
    vehicleNo: "88라90123",
    manufacturer: "현대",
    model: "쏘나타",
    color: "청색",
    workType: "헤드램프, 교환",
    partNo: "92102-C1000",
    position: "우측",
    quantity: 1,
    shop: "한빛자동차",
    location: "인천광역시 남동구",
    status: "전송오류"
  },
  {
    receiptNo: "AOS-000180",
    date: "2026-08-18 11:17",
    vehicleNo: "33마55421",
    manufacturer: "기아",
    model: "쏘렌토",
    color: "검정",
    workType: "리어 범퍼, 교환",
    partNo: "86611-P2000",
    position: "후면",
    quantity: 1,
    shop: "탑모터스",
    location: "경기도 수원시",
    status: "전송완료"
  },
  {
    receiptNo: "AOS-000179",
    date: "2026-08-18 10:03",
    vehicleNo: "17바44321",
    manufacturer: "BMW",
    model: "520i",
    color: "검정",
    workType: "사이드미러, 교환",
    partNo: "51167407349",
    position: "좌측",
    quantity: 1,
    shop: "프리미엄모터스",
    location: "서울특별시 송파구",
    status: "전송완료"
  }
];

function App() {
  const [rows, setRows] = useState(initialRows);
  const [selected, setSelected] = useState(initialRows[0]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("전체");
  const [date, setDate] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [toast, setToast] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesQuery = !q || [
        r.receiptNo, r.vehicleNo, r.manufacturer, r.model, r.partNo, r.shop
      ].join(" ").toLowerCase().includes(q);
      const matchesStatus = status === "전체" || r.status === status;
      const matchesDate = !date || r.date.startsWith(date);
      return matchesQuery && matchesStatus && matchesDate;
    });
  }, [rows, query, status, date]);

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(window.__aosToast);
    window.__aosToast = window.setTimeout(() => setToast(""), 2200);
  };

  const reset = () => {
    setQuery("");
    setStatus("전체");
    setDate("");
  };

  const resend = () => {
    if (!selected) return;
    setRows((current) =>
      current.map((r) => r.receiptNo === selected.receiptNo ? { ...r, status: "전송완료" } : r)
    );
    setSelected((r) => ({ ...r, status: "전송완료" }));
    showToast(`${selected.receiptNo} 전송 요청을 완료했습니다.`);
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="brand">
          <div className="brand-mark">A</div>
          {!collapsed && <div><strong>AOS</strong><span>교환부품 관리</span></div>}
        </div>

        <div className="nav-section">
          {!collapsed && <div className="nav-label">MENU</div>}
          <NavItem icon={<LayoutDashboard size={18}/>} label="대시보드" collapsed={collapsed}/>
          <NavItem icon={<PackageSearch size={18}/>} label="교환부품 조회" active collapsed={collapsed}/>
          <NavItem icon={<ClipboardList size={18}/>} label="전송 내역" collapsed={collapsed}/>
          <NavItem icon={<Activity size={18}/>} label="API 상태" collapsed={collapsed}/>
        </div>

        <div className="nav-section bottom-nav">
          {!collapsed && <div className="nav-label">SYSTEM</div>}
          <NavItem icon={<Settings size={18}/>} label="시스템 설정" collapsed={collapsed}/>
          <NavItem icon={<ShieldCheck size={18}/>} label="접근 권한" collapsed={collapsed}/>
        </div>

        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={18}/> : <ChevronLeft size={18}/>}
          {!collapsed && "메뉴 접기"}
        </button>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="mobile-title">
            <button className="icon-button"><Menu size={20}/></button>
            <strong>AOS</strong>
          </div>
          <div className="topbar-right">
            <button className="icon-button notification"><Bell size={19}/><i/></button>
            <div className="user">
              <div className="avatar"><UserRound size={17}/></div>
              <div className="user-copy"><strong>관리자</strong><span>Administrator</span></div>
              <ChevronDown size={16}/>
            </div>
          </div>
        </header>

        <div className="content">
          <div className="breadcrumb">AOS 관리 <span>/</span> 교환부품 조회</div>
          <div className="page-heading">
            <div>
              <h1>교환부품 조회</h1>
              <p>접수된 차량 및 교환부품 정보를 조회하고 전송 상태를 관리합니다.</p>
            </div>
            <button className="outline-btn" onClick={() => showToast("최신 데이터를 조회했습니다.")}>
              <RefreshCw size={16}/> 새로고침
            </button>
          </div>

          <section className="stats">
            <Stat icon={<Database/>} label="전체 접수" value="184" unit="건" tone="purple"/>
            <Stat icon={<Clock3/>} label="금일 접수" value="12" unit="건" tone="blue"/>
            <Stat icon={<CheckCircle2/>} label="전송 완료" value="176" unit="건" tone="green"/>
            <Stat icon={<AlertCircle/>} label="전송 오류" value="3" unit="건" tone="red"/>
          </section>

          <section className="card search-card">
            <div className="card-title">
              <div className="title-icon"><SlidersHorizontal size={17}/></div>
              <div><strong>조회 조건</strong><span>검색할 조건을 입력하세요.</span></div>
            </div>
            <div className="search-grid">
              <label>접수번호<input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="예: AOS-000184"/></label>
              <label>접수일자<input type="date" value={date} onChange={(e) => setDate(e.target.value)}/></label>
              <label>전송상태<select value={status} onChange={(e) => setStatus(e.target.value)}><option>전체</option><option>전송완료</option><option>대기</option><option>전송오류</option></select></label>
              <label>차량번호<input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="차량번호 / 차종 / 부품번호"/></label>
              <div className="search-actions">
                <button className="text-btn" onClick={reset}>초기화</button>
                <button className="primary-btn" onClick={() => showToast(`${filtered.length}건을 조회했습니다.`)}><Search size={17}/> 조회</button>
              </div>
            </div>
          </section>

          <section className="workspace">
            <div className="card table-card">
              <div className="table-header">
                <div><strong>접수 목록</strong><span>총 <b>{filtered.length}</b>건</span></div>
                <button className="icon-button small"><FileSearch size={17}/></button>
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>접수번호</th><th>접수일시</th><th>차량정보</th><th>교환부품</th><th>정비업체</th><th>상태</th></tr></thead>
                  <tbody>
                    {filtered.map((row) => (
                      <tr key={row.receiptNo} className={selected?.receiptNo === row.receiptNo ? "selected" : ""} onClick={() => setSelected(row)}>
                        <td><strong className="receipt">{row.receiptNo}</strong></td>
                        <td className="muted">{row.date}</td>
                        <td><div className="vehicle-cell"><div className="car-icon"><CarFront size={17}/></div><div><strong>{row.vehicleNo}</strong><span>{row.manufacturer} {row.model}</span></div></div></td>
                        <td><div><strong>{row.workType}</strong><span className="muted">{row.partNo} · {row.position}</span></div></td>
                        <td><div><strong>{row.shop}</strong><span className="muted">{row.location}</span></div></td>
                        <td><Status status={row.status}/></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && <div className="empty">조건에 맞는 접수 데이터가 없습니다.</div>}
              </div>
              <div className="pagination"><button disabled><ChevronLeft size={16}/></button><button className="current">1</button><button>2</button><button>3</button><span>...</span><button>19</button><button><ChevronRight size={16}/></button></div>
            </div>

            {selected && <aside className="card detail-card">
              <div className="detail-header">
                <div><span className="eyebrow">RECEIPT DETAIL</span><h2>{selected.receiptNo}</h2></div>
                <Status status={selected.status}/>
              </div>
              <div className="detail-block">
                <h3>차량 정보</h3>
                <div className="vehicle-hero"><div className="hero-car"><CarFront size={31}/></div><div><strong>{selected.manufacturer} {selected.model}</strong><span>{selected.vehicleNo} · {selected.color}</span></div></div>
                <InfoRows items={[["차량번호", selected.vehicleNo],["제조사", selected.manufacturer],["차종", selected.model],["차량색상", selected.color]]}/>
              </div>
              <div className="detail-block">
                <h3>교환부품 정보</h3>
                <InfoRows items={[["작업유형", selected.workType],["OEM 부품번호", selected.partNo],["장착위치", selected.position],["수량", `${selected.quantity} EA`]]}/>
              </div>
              <div className="detail-block">
                <h3>정비업체 정보</h3>
                <InfoRows items={[["업체명", selected.shop],["소재지", selected.location],["접수일시", selected.date]]}/>
              </div>
              <div className="detail-actions">
                <button className="outline-btn wide" onClick={() => showToast("상세 정보를 준비했습니다.")}>상세 데이터</button>
                <button className="primary-btn wide" onClick={resend}><RefreshCw size={16}/> 재전송</button>
              </div>
            </aside>}
          </section>
        </div>
      </main>

      {toast && <div className="toast"><CheckCircle2 size={18}/>{toast}</div>}
    </div>
  );
}

function NavItem({icon,label,active,collapsed}) {
  return <button className={`nav-item ${active ? "active" : ""}`} title={collapsed ? label : ""}>{icon}{!collapsed && <span>{label}</span>}</button>;
}
function Stat({icon,label,value,unit,tone}) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div><span>{label}</span><div><strong>{value}</strong><small>{unit}</small></div></div></div>;
}
function Status({status}) {
  const cls = status === "전송완료" ? "success" : status === "전송오류" ? "danger" : "warning";
  return <span className={`status ${cls}`}><i/>{status}</span>;
}
function InfoRows({items}) {
  return <div className="info-rows">{items.map(([k,v]) => <div key={k}><span>{k}</span><strong>{v}</strong></div>)}</div>;
}

createRoot(document.getElementById("root")).render(<App />);
