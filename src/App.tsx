import { useEffect, useState } from "react";
import "./App.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

type IpoData = {
  date: string;
  type: string;
  company_name: string;
  color_code: string;
  open_date: string;
  close_date: string;
  allotment_date: string;
  refund_date: string;
  credit_to_demat_date: string;
  listing_date: string;
  sc_did: string;
  url: string;
};

function App() {
  const [ipos, setIpos] = useState<IpoData[]>([]);
  const [value, onChange] = useState<Value>(new Date());
  const [selectedIpos, setSelectedIpos] = useState<IpoData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://api.moneycontrol.com/mcapi/v1/ipo/calendar-data"
      );
      const data = await response.json();
      console.log(data, "data");
      setIpos(data.data.list);
    };

    fetchData().catch((error) =>
      console.error("Error fetching IPO data:", error)
    );
  }, []);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${day}-${month}`;
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const dateStr = formatDate(date);
      const dots: JSX.Element[] = [];
      ipos.forEach((ipo) => {
        if (ipo.date === dateStr && ipo.type === "close") {
          dots.push(<div className="dot red-dot"></div>);
        }
        if (ipo.date === dateStr && ipo.type === "open") {
          dots.push(<div className="dot green-dot"></div>);
        }
        if (ipo.date === dateStr && ipo.type === "listing") {
          dots.push(<div className="dot blue-dot"></div>);
        }
        if (ipo.date === dateStr && ipo.type === "refund") {
          dots.push(<div className="dot yellow-dot"></div>);
        }
        if (ipo.date === dateStr && ipo.type === "allotment") {
          dots.push(<div className="dot purple-dot"></div>);
        }
        if (ipo.date === dateStr && ipo.type === "credit") {
          dots.push(<div className="dot orange-dot"></div>);
        }
      });

      return (
        <div className="dots-container flex items-center">
          {dots.slice(0, 2)}
          {dots.length > 2 && (
            <span
              style={{
                fontSize: "8px",
              }}
            >
              +
            </span>
          )}
        </div>
      );
    }
    return null;
  };

  const handleClick = (date: Date) => {
    const dateStr = formatDate(date);
    setSelectedIpos([]);
    const closedIpos = ipos
      ?.filter((ipo) => ipo.type === "close" && ipo.date === dateStr)
      .map((ipo) => ({ ...ipo, color_code: "red-dot" }));
    const openIpos = ipos
      ?.filter((ipo) => ipo.type === "open" && ipo.date === dateStr)
      .map((ipo) => ({ ...ipo, color_code: "green-dot" }));
    const listingIpos = ipos
      ?.filter((ipo) => ipo.type === "listing" && ipo.date === dateStr)
      .map((ipo) => ({ ...ipo, color_code: "blue-dot" }));
    const refundIpos = ipos
      ?.filter((ipo) => ipo.type === "refund" && ipo.date === dateStr)
      .map((ipo) => ({ ...ipo, color_code: "yellow-dot" }));
    const allotmentIpos = ipos
      ?.filter((ipo) => ipo.type === "allotment" && ipo.date === dateStr)
      .map((ipo) => ({ ...ipo, color_code: "purple-dot" }));
    const creditIpos = ipos
      ?.filter((ipo) => ipo.type === "credit" && ipo.date === dateStr)
      .map((ipo) => ({ ...ipo, color_code: "orange-dot" }));

    setSelectedIpos([
      ...closedIpos,
      ...openIpos,
      ...listingIpos,
      ...refundIpos,
      ...allotmentIpos,
      ...creditIpos,
    ]);
  };

  return (
    <div>
      <Calendar
        onChange={onChange}
        value={value}
        tileContent={tileContent}
        onClickDay={handleClick}
        onActiveStartDateChange={() => {
          setSelectedIpos([]);
        }}
      />

      <div className="selected-ipos mt-4">
        {selectedIpos?.length > 0 ? (
          selectedIpos?.map((ipo: IpoData) => (
            <div key={ipo.company_name} className="ipo-item">
              <div className="flex items-center gap-2">
                <div className={`dot ${ipo.color_code}`}></div>
                <div>{ipo.company_name}</div>
              </div>
              <div className="text-xs text-gray-500">{ipo.type}</div>
            </div>
          ))
        ) : (
          <div className="text-md flex justify-center items-center text-center">
            Click a date to check IPO detail
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
