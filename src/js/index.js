/* jshint esversion: 6 */
import 'object-fit-images';
import 'picturefill';
import Cool from './components/cool';
import Pajax from 'pajax';
$(document).ready(() => {
  window.promiseHost = "http://47.95.228.57:9091/mock/24";
  window.pajax  = new Pajax();
  const cool = new Cool();
});
