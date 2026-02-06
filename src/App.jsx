import { useState, useEffect } from 'react';
import { Wheel } from 'react-custom-roulette';
import SlotMachine from './SlotMachine';
import stationsData from './stations.json';
import './App.css';

const lineColors = {
  '01호선': '#0052A4',
  '02호선': '#00A84D',
  '03호선': '#EF7C1C',
  '04호선': '#00A5DE',
  '05호선': '#996CAC',
  '06호선': '#CD7C2F',
  '07호선': '#747F00',
  '08호선': '#E6186C',
  '09호선': '#BDB092',
  '수인분당선': '#FABE00',
  '신분당선': '#D31145',
  '경의중앙선': '#77C4A3',
  '공항철도': '#0090D2',
  '경춘선': '#0C8E72',
  '우이신설선': '#B0CE18',
  '신림선': '#6789CA',
  '김포골드라인': '#996CAC'
};

function App() {
  const [step, setStep] = useState(1);
  const [lines, setLines] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [selectedLine, setSelectedLine] = useState('');
  const [selectedStation, setSelectedStation] = useState('');
  const [stationList, setStationList] = useState([]);
  const [isSlotSpinning, setIsSlotSpinning] = useState(false);
  const [slotFinished, setSlotFinished] = useState(false);
  const [wheelSize, setWheelSize] = useState(500);

  useEffect(() => {
    const linesList = Object.keys(stationsData);
    setLines(linesList);
    const wheelData = linesList.map(line => ({
      option: line,
      style: {
        backgroundColor: lineColors[line] || '#667eea',
        textColor: '#ffffff'
      }
    }));
    setLineData(wheelData);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 480) {
        setWheelSize(280);
      } else if (width <= 768) {
        setWheelSize(380);
      } else {
        setWheelSize(500);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSpinLine = () => {
    if (!mustSpin) {
      const timestamp = Date.now();
      const seed = timestamp * 9301 + 49297;
      const random = (seed % 233280) / 233280;
      const newPrizeNumber = Math.floor(random * lines.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  const handleLineStopSpinning = () => {
    setMustSpin(false);
    const selected = lines[prizeNumber];
    setSelectedLine(selected);
    setStationList(stationsData[selected]);
  };

  const handleMoveToStation = () => {
    setStep(2);
    setSlotFinished(false);
  };

  const handleSpinStation = () => {
    setIsSlotSpinning(true);
    setSlotFinished(false);
  };

  const handleStationResult = (station) => {
    setSelectedStation(station);
    setSlotFinished(true);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedLine('');
    setSelectedStation('');
    setPrizeNumber(0);
    setMustSpin(false);
    setIsSlotSpinning(false);
    setSlotFinished(false);
  };

  return (
    <div className="app">
      <header>
        <h1> 랜덤 수도권 지하철 역 </h1>
      </header>

      <div className="content">
        {step === 1 && (
          <div className="step">
            <h2>호선 뽑기</h2>
            {lineData.length > 0 && (
              <div className="wheel-section">
                <Wheel
                  mustStartSpinning={mustSpin}
                  prizeNumber={prizeNumber}
                  data={lineData}
                  onStopSpinning={handleLineStopSpinning}
                  outerBorderColor="#ffffff"
                  outerBorderWidth={wheelSize < 350 ? 3 : 5}
                  innerBorderColor="#ffffff"
                  innerBorderWidth={wheelSize < 350 ? 3 : 5}
                  radiusLineColor="#ffffff"
                  radiusLineWidth={wheelSize < 350 ? 1 : 2}
                  fontSize={wheelSize < 350 ? 14 : wheelSize < 450 ? 16 : 20}
                  textDistance={wheelSize < 350 ? 50 : 60}
                  spinDuration={1.2}
                  width={wheelSize}
                  height={wheelSize}
                />

                <button className="spin-btn" onClick={handleSpinLine} disabled={mustSpin}>
                  {mustSpin ? '돌아가는 중...' : '호선 뽑기! 🎯'}
                </button>

                {selectedLine && !mustSpin && (
                  <div className="result">
                    <div className="result-text">🎉 {selectedLine} 선택!</div>
                    <div className="button-group">
                      <button className="next-btn" onClick={handleMoveToStation}>
                        역 고르기 🎰
                      </button>
                      <button className="reset-btn" onClick={handleReset}>
                        다시 뽑기 🔄
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="step">
            <h2>🎰 역 뽑기</h2>
            <p className="selected-line">선택된 호선: {selectedLine}</p>

            <SlotMachine
              items={stationList}
              onResult={handleStationResult}
              isSpinning={isSlotSpinning}
              setIsSpinning={setIsSlotSpinning}
            />

            {!slotFinished && (
              <button
                className="spin-btn slot-btn"
                onClick={handleSpinStation}
                disabled={isSlotSpinning}
              >
                {isSlotSpinning ? '🎰 돌아가는 중...' : '슬롯 돌리기! 🎰'}
              </button>
            )}

            {slotFinished && (
              <div className="final-section">
                <div className="final-message">
                  <h3>🎉 오늘의 여행지가 결정되었습니다! 🎉</h3>
                  <p className="station-result">
                    <span className="line-text">{selectedLine}</span>
                    <span className="arrow">→</span>
                    <span className="station-text">{selectedStation}</span>
                  </p>
                  <p className="enjoy-message">즐거운 데이트 되세요! 💕</p>
                </div>
                <button className="reset-btn large" onClick={handleReset}>
                  다시 뽑기 🔄
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
