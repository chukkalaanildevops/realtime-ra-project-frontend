import moment from 'moment';

export const sideScroll = (
  element: Element,
  direction: 'left' | 'right',
  speed: number,
  distance: number,
  step: number,
) => {
  let scrollAmount = 0;
  var slideTimer = setInterval(function() {
    if (direction === 'left') {
      element.scrollLeft -= step;
    } else {
      element.scrollLeft += step;
    }
    scrollAmount += step;
    if (scrollAmount >= distance) {
      window.clearInterval(slideTimer);
    }
  }, speed);
};

export const getFormattedDate = (date: string, format = 'DD/MM/YYYY') => {
  return date
    ? moment.utc(date, ['DD/MM/YYYYTHH:mm:ss[.mmm]TZD']).format(format)
    : '';
};

export const getQueryString = (field: string, url?: string) => {
  var href = url ? url : window.location.href;
  var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
  var string = reg.exec(href);
  return string ? string[1] : null;
};

export const loadScript = () => {
  const key = process.env.REACT_APP_GOOGLE_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
  let script: any = document.createElement('script'); // create script tag
  script.type = 'text/javascript';

  // when script state is ready and loaded or complete we will call callback
  if (script.readyState) {
    script.onreadystatechange = function() {
      if (script.readyState === 'loaded' || script.readyState === 'complete') {
        script.onreadystatechange = null;
        // callback();
      }
    };
  } else {
    // script.onload = () => callback();
  }

  script.src = url; // load by url
  document.getElementsByTagName('head')[0].appendChild(script); // append to head
};
