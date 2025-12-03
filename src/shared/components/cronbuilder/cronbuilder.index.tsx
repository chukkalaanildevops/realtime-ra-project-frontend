import { Trans } from '@lingui/macro';
import { Checkbox, Select, TimePicker } from 'antd';
import moment from 'moment';
import React, { memo, useEffect, useState } from 'react';
import './cronbuilder.index.less';

const CronBuilder: React.FC<{
  cron?: string;
  generateCron: (
    time: string,
    daysOfWeek: string[],
    daysOfMonth: string[],
    frequency?: string,
  ) => void;
  isNever?: string;
  isNeverVisible?: boolean;
}> = props => {
  const [showDaysOfWeek, setShowDaysOfWeek] = useState<boolean>(false);
  const [showDaysOfMonth, setShowDaysOfMonth] = useState<boolean>(false);
  const [showNever, setShowNever] = useState<boolean>(false);
  const daysOfMonthRange = Array.from({ length: 32 - 1 }, (_v, k) =>
    String(k + 1),
  );

  const [time, setTime] = useState<string>('00:00');
  const [frequency, setFrequency] = useState<string>('ED');
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);
  const [daysOfMonth, setDaysOfMonth] = useState<string[]>([]);

  const parseCron = () => {
    if (
      props.cron !== undefined &&
      props.cron !== null &&
      props.cron.length > 0
    ) {
      let tokens = props.cron?.split(' ');
      if (tokens[0] !== '*' && tokens[1] !== '*') {
        setTime(`${tokens[1]}:${tokens[0]}`);
      }
      if (tokens[3] !== '*') {
        setDaysOfMonth(
          tokens[3].split(',').map(item => item.trimLeft().trimRight()),
        );
        setFrequency('DOM');
        setShowDaysOfMonth(true);
        setShowDaysOfWeek(false);
      }
      if (tokens[4] !== '*') {
        setDaysOfWeek(
          tokens[4].split(',').map(item => item.trimLeft().trimRight()),
        );
        setFrequency('DOW');
        setShowDaysOfMonth(false);
        setShowDaysOfWeek(true);
      }
      if (tokens[3] === '*' && tokens[4] === '*' && props.isNever === 'NEVER') {
        setFrequency('NEV');

        setShowDaysOfMonth(false);

        setShowDaysOfWeek(false);

        setShowNever(true);
      }

      if (
        tokens[3] === '*' &&
        tokens[4] === '*' &&
        props.isNever === 'EVERDAY'
      ) {
        setFrequency('ED');

        setShowDaysOfMonth(false);

        setShowDaysOfWeek(false);

        setShowNever(false);
      }
    }
  };

  useEffect(() => {
    parseCron();
    // eslint-disable-next-line
  }, [props.cron]);

  const updateDaysOfWeek = (day: string, isChecked: boolean) => {
    if (isChecked) {
      setDaysOfWeek(daysOfWeek => [...daysOfWeek, day]);
      props.generateCron(time, [...daysOfWeek, day], daysOfMonth, frequency);
    } else {
      setDaysOfWeek(daysOfWeek => daysOfWeek.filter(item => item !== day));
      props.generateCron(
        time,
        daysOfWeek.filter(item => item !== day),
        daysOfMonth,
        frequency,
      );
    }
  };

  return (
    <div className='cron-builder'>
      <div className='fields'>
        <div className='field'>
          <div className='label'>
            <Trans>Frequency</Trans>
          </div>
          <Select
            className='frequency-selector'
            value={frequency}
            onChange={value => {
              setFrequency(value.toString());
              if (value.toString() === 'DOW') {
                setShowDaysOfWeek(true);
                setShowDaysOfMonth(false);
                setShowNever(false);
                setDaysOfMonth([]);
              } else if (value.toString() === 'DOM') {
                setShowDaysOfWeek(false);
                setShowDaysOfMonth(true);
                setShowNever(false);
                setDaysOfWeek([]);
              } else if (value.toString() === 'NEV') {
                setShowDaysOfWeek(false);
                setShowDaysOfMonth(false);
                setShowNever(true);
                setDaysOfWeek([]);
                setDaysOfMonth([]);
              } else {
                setShowDaysOfWeek(false);
                setShowDaysOfMonth(false);
                setShowNever(false);
                setDaysOfWeek([]);
                setDaysOfMonth([]);
              }
              props.generateCron(time, [], [], value.toString());
            }}
          >
            <Select.Option value='ED'>
              <Trans>Every Day</Trans>
            </Select.Option>
            <Select.Option value='DOW'>
              <Trans>Days Of Week</Trans>
            </Select.Option>
            <Select.Option value='DOM'>
              <Trans>Days Of Month</Trans>
            </Select.Option>
            {props.isNeverVisible && (
              <Select.Option value='NEV'>
                <Trans>Never</Trans>
              </Select.Option>
            )}
          </Select>
        </div>
        {!showNever && (
          <div className='field'>
            <div className='label'>
              <Trans>Time</Trans>
            </div>
            <TimePicker
              format='HH:mm'
              value={moment(time, 'HH:mm')}
              onChange={value => {
                if (value !== undefined && value !== null) {
                  setTime(value.format('HH:mm'));
                  props.generateCron(
                    value.format('HH:mm'),
                    daysOfWeek,
                    daysOfMonth,
                    frequency,
                  );
                }
              }}
            ></TimePicker>
          </div>
        )}
      </div>
      <>
        {(showDaysOfMonth && (
          <div className='field'>
            <Select
              className='days-selector'
              mode='multiple'
              placeholder='Select Days'
              value={daysOfMonth}
              onSelect={value => {
                if (daysOfMonth.indexOf(value) < 0) {
                  setDaysOfMonth(daysOfMonth => [...daysOfMonth, value]);
                  props.generateCron(
                    time,
                    daysOfWeek,
                    [...daysOfMonth, value],
                    frequency,
                  );
                }
              }}
              onDeselect={value => {
                if (daysOfMonth.indexOf(value) > -1) {
                  setDaysOfMonth(daysOfMonth =>
                    daysOfMonth.filter(item => item !== value),
                  );
                  props.generateCron(
                    time,
                    daysOfWeek,
                    daysOfMonth.filter(item => item !== value),
                    frequency,
                  );
                }
              }}
            >
              {daysOfMonthRange.map((item: string) => (
                <Select.Option value={item} key={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </div>
        )) ||
          (showDaysOfWeek && (
            <div className='field'>
              <Checkbox
                checked={daysOfWeek.indexOf('sun') > -1}
                onChange={e => {
                  updateDaysOfWeek('sun', e.target.checked);
                }}
              >
                <Trans>Sunday</Trans>
              </Checkbox>
              <Checkbox
                checked={daysOfWeek.indexOf('mon') > -1}
                onChange={e => {
                  updateDaysOfWeek('mon', e.target.checked);
                }}
              >
                <Trans>Monday</Trans>
              </Checkbox>
              <Checkbox
                checked={daysOfWeek.indexOf('tue') > -1}
                onChange={e => {
                  updateDaysOfWeek('tue', e.target.checked);
                }}
              >
                <Trans>Tuesday</Trans>
              </Checkbox>
              <Checkbox
                checked={daysOfWeek.indexOf('wed') > -1}
                onChange={e => {
                  updateDaysOfWeek('wed', e.target.checked);
                }}
              >
                <Trans>Wednesday</Trans>
              </Checkbox>
              <Checkbox
                checked={daysOfWeek.indexOf('thu') > -1}
                onChange={e => {
                  updateDaysOfWeek('thu', e.target.checked);
                }}
              >
                <Trans>Thursday</Trans>
              </Checkbox>
              <Checkbox
                checked={daysOfWeek.indexOf('fri') > -1}
                onChange={e => {
                  updateDaysOfWeek('fri', e.target.checked);
                }}
              >
                <Trans>Friday</Trans>
              </Checkbox>
              <Checkbox
                checked={daysOfWeek.indexOf('sat') > -1}
                onChange={e => {
                  updateDaysOfWeek('sat', e.target.checked);
                }}
              >
                <Trans>Saturday</Trans>
              </Checkbox>
            </div>
          ))}
      </>
    </div>
  );
};

export default memo(CronBuilder);
