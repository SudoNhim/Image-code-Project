function setPixel(x,y) {
  var r=0, g=0, b=0;
  //Attempt at raymarcher
  // WITH ANTI-ALIAS :D
  RESOLUTION = 450;
  
  //flip y
  y = 1-y;
  
  //Maximum distance to march
  var MAX_DIST = 30;
  //Decrease this to improve quality
  var INCREMENT_PERCENTAGE = 0.002;
 

  
 
  //A very "hacked in" conversion to anti-aliasing
  function castRay()
  {
  //Ray starts at camera
  var cameraPos = new Array(0,1.0,-2);
  //Intersects screen at
  var pixelPos = new Array(1.5*x, 1.2*y, 0);
  //Giving the direction as
  var rayDir = new Array( pixelPos[0]-cameraPos[0],
                          pixelPos[1]-cameraPos[1],
                          pixelPos[2]-cameraPos[2] );
  //Normalise...
  var mag = sqrt( pow( rayDir[0], 2 ) +
                  pow( rayDir[1], 2 ) +
                  pow( rayDir[2], 2 ) )
  rayDir[0] /= mag;
  rayDir[1] /= mag;
  rayDir[2] /= mag;
  
  var rayPos = pixelPos;
  
  //Now we have our ray with a direction and origin,
  //lets define the scenery as a heightmap
  function h(x2,z2)
  {
    return ( 0.1*sin(2.0*x2)+
             0.1*sin(1.5*z2)+
             0.1*sin(x2+z2)
             -0.5
            );
  }
  //And the normal
  function hn(x2,z2)
  {
    //0.1sin(2x)+0.1sin(1.5z)+0.1sin(x+z)-y=0
    var dx = 0.2*cos(2*x2)+0.1*cos(x2+z2);
    var dy = -1.0;
    var dz = 0.15*cos(1.5*z2)+0.1*cos(x2+z2);
    //Normalise
    var mag = sqrt(dx*dx+dy*dy+dz*dz);
    dx /= mag;
    dy /= mag;
    dz /= mag;
    return Array(dx,dy,dz);
  }
  
  //Let's define a texture as well
  function tex(x2,z2)
  {
    var gridX = mod(floor(4*x2),2);
    var gridZ = mod(floor(4*z2),2);
    return 0.5+0.5*mod(gridX+gridZ, 2);
  }
  
  //Begin "marching" the ray from the screen until
  //it falls below the height map
  var height;
  var incr = 0.01;
  for (var d=1.0; d<=MAX_DIST; d+=incr)
  {
    rayPos[0] += rayDir[0]*incr;
    rayPos[1] += rayDir[1]*incr;
    rayPos[2] += rayDir[2]*incr;
  
    height = h( rayPos[0], rayPos[2] );
    if (height > rayPos[1]) {
      break;
    }
    incr = INCREMENT_PERCENTAGE * d;
  }
  
  if (d <= MAX_DIST) { //if intersected
    //Get the normal
    var normal = hn(rayPos[0],rayPos[2]);
    //Parallel light source
    var lightDir = new Array(1.0,-1.0,1.0);
    //Dot product normal with light
    var specular = (normal[0]*lightDir[0]+
                     normal[1]*lightDir[1]+
                     normal[2]*lightDir[2]);
    specular *= 0.6;
    var texture = tex(rayPos[0], rayPos[2]);
    var grey = texture*specular*255;
    var fog = (MAX_DIST-0.4*d)/MAX_DIST
    r = grey*fog;
    g = grey*0.5+0.5*grey*fog;
    b = grey;
  } else {
    //Sky color
    r=20; 
    g=100;
    b=100*x+130;
  }
    return Array(r,g,b)
  }
  
  //Sample 4 sub-pixels
  var tempCol;
  var actualX = x;
  var actualY = y;
  var col = new Array(0,0,0);
  for (var dx=-0.33; dx<=0.33; dx+=0.66) {
    for (var dy=-0.33; dy<=0.33; dy+=0.66) {
      x = actualX + dx/RESOLUTION;
      y = actualY + dy/RESOLUTION;
      tempCol = castRay()
      col[0] += 0.25*tempCol[0];
      col[1] += 0.25*tempCol[1];
      col[2] += 0.25*tempCol[2];
    }
  }
  
  r = col[0];
  g = col[1];
  b = col[2];
  
  return [ mod(r,256), mod(g,256), mod(b,256) ];
}
