import { useState, useEffect } from 'react';
import './SlotMachine.css';

function SlotMachine({ items, onResult, isSpinning, setIsSpinning }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (isSpinning) {
      spin();
    }
  }, [isSpinning]);

  const spin = () => {
    setAnimating(true);

    // 타임스탬프 기반 난수
    const timestamp = Date.now();
    const seed = timestamp * 9301 + 49297;
    const random = (seed % 233280) / 233280;
    const targetIndex = Math.floor(random * items.length);

    let count = 0;
    let speed = 30; // 초기 속도 (빠름)
    let index = currentIndex;

    const spinInterval = () => {
      // 순차적으로 인덱스 증가
      index = (index + 1) % items.length;
      setCurrentIndex(index);
      count++;

      // 부드러운 감속
      if (count < 50) {
        speed = 30; // 빠르게
      } else if (count < 80) {
        speed = 50; // 조금 느리게
      } else if (count < 100) {
        speed = 80; // 더 느리게
      } else if (count < 115) {
        speed = 120; // 많이 느리게
      } else if (count < 125) {
        speed = 180; // 아주 느리게
      } else if (count < 132) {
        speed = 250; // 거의 멈춤
      } else {
        speed = 350; // 완전히 천천히
      }

      // 목표 인덱스에 가까워지면 정확히 맞춰서 멈춤
      if (count > 130 && index === targetIndex) {
        setAnimating(false);

        // 0.5초 후에 결과 표시
        setTimeout(() => {
          setIsSpinning(false);
          onResult(items[targetIndex]);
        }, 500);
      } else {
        setTimeout(spinInterval, speed);
      }
    };

    spinInterval();
  };

  const getVisibleItems = () => {
    const prev = (currentIndex - 1 + items.length) % items.length;
    const next = (currentIndex + 1) % items.length;
    return [
      items[prev],
      items[currentIndex],
      items[next]
    ];
  };

  const visibleItems = getVisibleItems();

  return (
    <div className="slot-machine-single">
      <div className={`slot-reel-single ${animating ? 'spinning' : 'stopped'}`}>
        <div className="slot-item-single">{visibleItems[0]}</div>
        <div className="slot-item-single active">{visibleItems[1]}</div>
        <div className="slot-item-single">{visibleItems[2]}</div>
      </div>
    </div>
  );
}

export default SlotMachine;
