import React, {
  FC,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { IRiskScoreCard } from './riskScoreCard.models';
import { Card, Input, InputNumber } from 'antd';
import { WarningFilled } from '@ant-design/icons';
import ReactSlider from 'react-slider';
import './riskScoreCard.index.less';

const RiskScoreCard: FC<IRiskScoreCard> = forwardRef(
  (
    {
      type = 'warning',
      riskTitle = 'Low Risk',
      maxRange = 100,
      midRange = 50,
      minRange = 0,
      isLoading = false,
    },
    ref?: any,
  ) => {
    const [sliderValue, setSliderValue] = useState<any>([2, 50, 100]);

    useEffect(() => {
      setSliderValue([minRange, midRange, maxRange]);
    }, [maxRange, minRange, midRange]);

    const handleChange = (index: number, value: any) => {
      const regex = /^[0-9]*$/;
      if (regex.test(value) || value === '') {
        let newSlider = Object.assign([], sliderValue);
        newSlider[index] = parseInt(value);
        setSliderValue(newSlider);
      }
    };
    useImperativeHandle(ref, () => ({
      getSliderValue() {
        const [min_range, mid_range] = sliderValue;
        const riskRanges = {
          min_range: min_range.toString(),
          mid_range: mid_range.toString(),
        };
        return riskRanges;
      },
      resetSliderValue() {
        setSliderValue([minRange, midRange, maxRange]);
      },
    }));
    return (
      <>
        <Card className='riskscore-card' loading={isLoading}>
          <div className='riskscore-title-wrapper'>
            <label>For:</label>
            <span className={`risk-title ${type}`}>
              <WarningFilled /> {riskTitle}
            </span>
            <span className={`risk-title error`}>
              <WarningFilled /> High Risk
            </span>
          </div>
          <div className='rangeslider-wrapper'>
            <ReactSlider
              className='react-slider'
              thumbClassName='react-thumb'
              trackClassName='react-track'
              value={sliderValue}
              onChange={e => {
                setSliderValue([
                  e[0] <= 0 ? 1 : e[0],
                  e[1] >= 2 ? e[1] : sliderValue[1],
                  100,
                ]);
              }}
              pearling
              minDistance={1}
              renderThumb={(props, state) => (
                <div {...props}>
                  <span className='custom-thumb'>{state.valueNow}</span>
                </div>
              )}
            />
          </div>
          <div className='range-wrapper'>
            <div className='form-group'>
              <label>Min Range</label>
              <span className='ant-input-group-wrapper'>
                <span className='ant-input-wrapper ant-input-group'>
                  <InputNumber
                    min={1}
                    max={sliderValue[1] - 1}
                    value={sliderValue[0]}
                    className='input-range'
                    onChange={value => handleChange(0, value)}
                  />
                  <span className='ant-input-group-addon'>%</span>
                </span>
              </span>
            </div>
            <div className='form-group'>
              <label>Mid Range</label>
              <span className='ant-input-group-wrapper'>
                <span className='ant-input-wrapper ant-input-group'>
                  <InputNumber
                    min={sliderValue[0] + 1}
                    max={99}
                    value={sliderValue[1]}
                    className='input-range'
                    onChange={value => handleChange(1, value)}
                  />
                  <span className='ant-input-group-addon'>%</span>
                </span>
              </span>
            </div>
            <div className='form-group'>
              <label>Max Range</label>
              <Input
                addonAfter='%'
                type='number'
                value={sliderValue[2]}
                style={{ width: '100px' }}
                onChange={() => handleChange(2, 100)}
              />
            </div>
          </div>
        </Card>
      </>
    );
  },
);

export default RiskScoreCard;
