import { useEffect, useState } from 'react';
import { StoreData } from '../../lib/types';

type InputProps = {
  storeData: StoreData;
};

const TopSection = ({ storeData }: InputProps) => {
  const [timer, timerSet] = useState({
    now: Date.now(),
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    timeRemaining: 0,
    endDate: new Date(),
  });

  useEffect(() => {
    if (!storeData) return;
    const progressBar = document.getElementById('progress');
    const countdownInterval = setInterval(() => {
      timerSet(() => {
        const timer = {
          now: Date.now(),
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          timeRemaining: 0,
          endDate: storeData.endDate,
        };
        timer.now = Date.now();
        timer.timeRemaining = Math.max(0, timer.endDate.getTime() - timer.now); // Ensure timeRemaining is never negative

        timer.days = Math.floor(timer.timeRemaining / (1000 * 60 * 60 * 24));
        timer.hours = Math.floor(
          (timer.timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        timer.minutes = Math.floor(
          (timer.timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
        );
        timer.seconds = Math.floor((timer.timeRemaining % (1000 * 60)) / 1000);
        return timer;
      });
      if (progressBar)
        progressBar.style.width = `${Math.ceil(
          (storeData.soldAmount / storeData.maxSupply) * 100
        )}%`;
    }, 1000);
    return () => clearInterval(countdownInterval);
  }, [storeData]);

  return (
    storeData && (
      <div className='top-section'>
        <h1 className='seed'>Stage 2 - SEED</h1>
        <h2 className='seed'>Buy before price increase</h2>
        <div className='countdown-main'>
          <div className='countdown'>
            <div className='time' id='days'>
              {timer.days < 10 ? '0' + timer.days : timer.days}
            </div>
            <div className='time' id='hours'>
              {timer.hours < 10 ? '0' + timer.hours : timer.hours}
            </div>
            <div className='time' id='minutes'>
              {timer.minutes < 10 ? '0' + timer.minutes : timer.minutes}
            </div>
            <div className='time' id='seconds'>
              {timer.seconds < 10 ? '0' + timer.seconds : timer.seconds}
            </div>
          </div>
          <div className='countdown-labels'>
            <div className='time-label'>DAYS</div>
            <div className='time-label'>HRS</div>
            <div className='time-label'>MIN</div>
            <div className='time-label'>SEC</div>
          </div>
        </div>
        <div className='progress-bar' id='progress-bar'>
          <div className='progress' id='progress'></div>
          <div className='progressText' id='progressText'>
            {Math.ceil((storeData.soldAmount / storeData.maxSupply) * 100)}%
          </div>
        </div>
        <div className='stats'>
          <div className='usdW'>
            <p id='usdRaisedLabel' className='usdRaisedLabel'>
              {`$USD Raised: ${storeData.usdRaised} / ${storeData.usdGoal}`}
            </p>
            <p id='usdRaised' className='usdRaised'></p>
          </div>
          <div className='sold'>
            <p id='aceonSoldLabel' className='aceonSoldLabel'>
              {`$ACEON Sold: ${Math.ceil(
                storeData.soldAmount
              ).toLocaleString()} / ${Math.ceil(
                storeData.maxSupply
              ).toLocaleString()}`}
            </p>
            <p id='aceonSold' className='aceonSold'></p>
          </div>
          <div className='nextr'>
            <p id='nextRoundPriceLabel' className='nextRoundPriceLabel'>
              Next Round Price: {`${storeData.nextRoundPrice.toFixed(5)} $USD`}
            </p>
            <p id='nextRoundPrice' className='nextRoundPrice'></p>
          </div>
        </div>
      </div>
    )
  );
};

export default TopSection;
