function setPixel(x,y) {
  var r=0, g=0, b=0;
  r = x * 254315;
  g = y * 212412432145;
  b = 0;
  return [ mod(r,256), mod(g,256), mod(b,256) ];
}