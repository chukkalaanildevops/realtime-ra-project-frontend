import moment, { Moment } from 'moment';
import qs from 'querystring';
import { ICoordinates } from '../shared/model';
import Store from '../shared/redux/store/store.index';

if (
  process.env.REACT_APP_ENVIRONMENT === 'PRODUCTION' ||
  process.env.REACT_APP_ENVIRONMENT === 'SAP_PRODUCTION' ||
  process.env.REACT_APP_ENVIRONMENT === 'SAP_STAGING'
) {
  // overriding console log function.
  window.console.log = function() {};
}

const isFileTypeString: (file: any) => boolean = (file: any) =>
  Boolean(typeof file === 'string');

const isPdfFile: (file: string | File) => boolean = (file: any) => {
  return isFileTypeString(file)
    ? Boolean((file as string).search('pdf') !== -1) ||
        Boolean((file as string).search('PDF') !== -1)
    : Boolean(
        (file as File).type === 'application/pdf' ||
          (file as File).type === 'pdf',
      );
};

const getDistance = (
  coord: ICoordinates,
  callback?: (
    message: string,
    distanceInKm: number | null,
    response: any,
  ) => void,
) => {
  try {
    const { google } = window as any;
    if (coord.source && coord.destination) {
      var origin1 = new google.maps.LatLng(coord.source.lat, coord.source.lng);
      var origin2 = new google.maps.LatLng(
        coord.destination.lat,
        coord.destination.lng,
      );

      const _callback = (response: any, status: any) => {
        // See Parsing the Results for
        // the basics of a callback function.
        if (status === 'ZERO_RESULTS') {
          callback && callback('No Result Found', null, response);
        } else if (status === 'OK') {
          callback &&
            callback(
              status,
              response.rows[0].elements[0].distance.value / 1000,
              response,
            );
        } else {
          console.error(status, 'Not handled error.');
          callback && callback('Something Went Wrong', null, response);
        }
      };

      var service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [origin1],
          destinations: [origin2],
          travelMode: 'DRIVING',
        },
        _callback,
      );
    } else {
      console.error('Provide correct parameters!');
    }
  } catch (error) {
    console.error('DEV ERROR [getDistance FN]', error);
  }
};

const generateQueryParamsString = (parameters: {
  [key: string]: string | number | string[] | number[];
}) => {
  Object.entries(parameters).forEach(([key, value]) => {
    if (typeof value !== 'string' && typeof value !== 'number') {
      parameters[key] = value.join(',');
    }
  });
  return qs.stringify(parameters);
};

const getQueryParametersAsObject = (forFilters: boolean = true) => {
  let url = window.location.href;
  let params: { [key: string]: any } = {};
  let queryString = url.split('?')[1];
  const filterDataTypes: any = {
    category: 'Array',
    entity_id: 'Array',
    expense_type: 'Array',
    status: 'Array',
    pending_approval_at: 'Array',
    employee_id: 'Array',
    from_date: 'String',
    to_date: 'String',
    item_no: 'String',
    last_action_prior_to: 'String',
    settled_on_from: 'String',
    settled_on_to: 'String',
    submitted_on_from: 'String',
    submitted_on_to: 'String',
    has_receipt: 'Number',
    max_amount: 'Number',
    min_amount: 'Number',
  };

  if (queryString === undefined) {
    return {};
  }

  queryString.split('&').forEach((item: any) => {
    let tokens = item.split('=');
    let value = decodeURIComponent(tokens[1]);
    let regex = new RegExp(/^\d{2}[.-/]\d{2}[.-/]\d{4}$/);
    if (regex.test(value)) {
      params[tokens[0]] = value;
    } else {
      if (value.split(',').length > 1) {
        params[tokens[0]] = value
          .split(',')
          .map((v: string) => (isNaN(Number(v)) ? v : Number(v)));
      } else {
        if (['has_receipt', 'max_amount', 'min_amount'].includes(tokens[0])) {
          params[tokens[0]] = isNaN(Number(value)) ? value : Number(value);
        } else {
          params[tokens[0]] = value;
        }
      }
    }

    if (
      forFilters &&
      filterDataTypes.hasOwnProperty(tokens[0]) &&
      filterDataTypes[tokens[0]] === 'Array' &&
      !Array.isArray(params[tokens[0]]) &&
      params[tokens[0]]
    ) {
      params[tokens[0]] = [params[tokens[0]]];
    }
  });
  return params;
};

const isPendingStatusInQuery = (): boolean => {
  let urlQueryParameters = getQueryParametersAsObject();
  if (urlQueryParameters.hasOwnProperty('status')) {
    if (
      typeof urlQueryParameters?.status === 'string' &&
      urlQueryParameters?.status !== ''
    ) {
      return urlQueryParameters?.status === 'PENDNG';
    } else if (Array.isArray(urlQueryParameters?.status)) {
      if (urlQueryParameters?.status.length === 1)
        return urlQueryParameters?.status.includes('PENDNG');
      else return false;
    }
  }
  return true;
};

const preciseDecimal = (num: number, precision: number): string => {
  try {
    const splitByDecimal: string[] = num.toString().split('.');
    const decimal = splitByDecimal[1] || '0';
    const convertedDecimal =
      decimal.length === precision
        ? decimal /* if same then dont do any thing return the same value */
        : decimal.length > precision
        ? decimal.slice(
            0,
            precision,
          ) /* if greater than precision then trim extra */
        : `${decimal}${
            Number(0)
              .toFixed(precision - decimal.length)
              .split('.')[1]
          }`; /* if lesser than precision then add 0's */
    const returnVal = [splitByDecimal[0], convertedDecimal].join('.');
    return returnVal;
  } catch (error) {
    console.error('DEV ERROR :: ', error);
    return num.toString();
  }
};

const timeZoneMomentDate = (date: string): Moment => {
  try {
    let timeZone = '';

    if (Store.getState()?.auth?.user?.timezone?.title) {
      timeZone = Store.getState()?.auth?.user?.timezone?.title;
    } else {
      console.error('No Time Zone Found');
      return moment();
    }

    return moment.utc(date, ['DD/MM/YYYYTHH:mm:ss[.mmm]TZD']).tz(timeZone);
  } catch (error) {
    return moment();
  }
};

const buildCronString = (
  time: string = '00:00',
  daysOfWeek: string[] = [],
  daysOfMonth: string[] = [],
  preventEverydayFrequencyForAllWeekDays: boolean = false,
) => {
  let daysOfWeekStringified = '*';
  let daysOfMonthStringified = '*';

  if (
    daysOfWeek.length > 0 &&
    (daysOfWeek.length < 7 || preventEverydayFrequencyForAllWeekDays)
  ) {
    daysOfWeekStringified = daysOfWeek.join(',');
  }
  if (daysOfMonth.length > 0) {
    daysOfMonthStringified = daysOfMonth.join(',');
  }

  return `${time.split(':')[1]} ${
    time.split(':')[0]
  } * ${daysOfMonthStringified} ${daysOfWeekStringified}`;
};

const getCurrencyFormatting = (
  input: number,
  For: 'InputNumberProp' | 'text' = 'text',
): string | { formatter: (val: number) => string } => {
  switch (For) {
    case 'InputNumberProp':
      return {
        formatter: (value: number) =>
          Intl.NumberFormat(
            Intl.DateTimeFormat().resolvedOptions().locale,
          ).format(value),
      };

    case 'text': //Default case
      return Intl.NumberFormat(
        Intl.DateTimeFormat().resolvedOptions().locale,
      ).format(input);
  }
};

const isBackEndReceiptOrSupportingDocObject = (receipt: any) => {
  return (
    (typeof receipt === 'object' &&
      receipt.hasOwnProperty('id') &&
      receipt.hasOwnProperty('file') &&
      receipt.hasOwnProperty('receipt_number') &&
      receipt.hasOwnProperty('created_by') &&
      receipt.created_by !== null) ||
    (typeof receipt === 'object' &&
      receipt.hasOwnProperty('id') &&
      receipt.hasOwnProperty('attachment') &&
      receipt.hasOwnProperty('file_type') &&
      receipt.hasOwnProperty('file_name'))
  );
};

/**
 * String templating
 * @param context eg. {key: value}
 * @param stringTemplate eg. The {key} is required. Note. don't keep any space between key and opening/closing brackets
 */
const stringTemplating = (
  context: {
    [x: string]: string;
  },
  stringTemplate: string,
): string => {
  try {
    let returnSting = stringTemplate || '';
    for (const [key, value] of Object.entries(context)) {
      returnSting = returnSting.replace(
        new RegExp('{' + key + '}', 'gi'),
        value,
      );
    }

    return returnSting || stringTemplate;
  } catch (error) {
    console.error('DEV ERROR : ', error);
    return stringTemplate;
  }
};

const setDocumentTitle = (title?: string) => {
  document.title =
    typeof title === 'string' ? `Reimburse - ${title}` : 'Reimburse';
};

const removeLastSlash = (url: string): string => {
  try {
    let newUrl = url || '';
    const index = newUrl.length - 1;
    if (newUrl[index] === '/') {
      newUrl.slice(0, index);
    }
    return newUrl;
  } catch (error) {
    console.error('DEV ERROR: Failed to remove last slash from url', error);
    return url;
  }
};

const scrollToElem = (selector: string): void => {
  try {
    const elem = document.querySelector(selector);
    // eslint-disable-next-line no-unused-expressions
    elem?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    });
  } catch (error) {
    console.error('DEV ERROR: Failed to scroll to element', error);
  }
};

const removeParamsFromObject = (
  paramsObject: { [x: string]: any },
  keysToRemove: string[],
  conditionForRemoval: boolean = true,
): { [x: string]: any } => {
  try {
    let returnObject = { ...paramsObject };
    if (conditionForRemoval) {
      for (const [key] of Object.entries(paramsObject)) {
        if (keysToRemove.includes(key)) {
          delete returnObject[key];
        }
      }
    }
    return returnObject;
  } catch (error) {
    console.error('DEV ERROR :: ', error);
    return paramsObject;
  }
};

const clearSessionStorage = () => {
  sessionStorage.clear();
};
const isGoogleApiDisabled = () => {
  const timezone = moment.tz.guess(true);
  const restrictedCountry: any =
    process.env.REACT_APP_GOOGLE_API_EXCLUDE_COUNTRIES;
  const restrictedCountryTZ = moment.tz.zonesForCountry(restrictedCountry);
  return restrictedCountryTZ?.includes(timezone);
};
const renderViolationsBgClass = (record: any): string => {
  if (
    Store.getState().configuration?.tenantConfig[0]
      ?.is_enabled_traffic_lights &&
    Store.getState().configuration?.isEnableTrafficLightFeatureForTenantFeatures
  ) {
    if (record.flag_color_v2 === 'ORA') {
      return 'row-background-orange';
    } else if (record.flag_color_v2 === 'RED') {
      return 'row-background-red';
    } else {
      return '';
    }
  } else {
    return '';
  }
};

export {
  isFileTypeString,
  clearSessionStorage,
  isPdfFile,
  generateQueryParamsString,
  getDistance,
  getQueryParametersAsObject,
  preciseDecimal,
  timeZoneMomentDate,
  buildCronString,
  getCurrencyFormatting,
  isBackEndReceiptOrSupportingDocObject,
  stringTemplating,
  isPendingStatusInQuery,
  setDocumentTitle,
  removeLastSlash,
  scrollToElem,
  removeParamsFromObject,
  isGoogleApiDisabled,
  renderViolationsBgClass,
};
